#!/usr/bin/env bash
# Smoke-test a built image before it is pushed: start it, wait for the Docker HEALTHCHECK,
# then request every route from inside the container (the slim image has no curl).
# It also checks the image's /sitemap.xml: every <url> has a <lastmod>, and every <loc> and
# <image:loc> is on the site URL and served by this container (200, images as image/*).
# Every HTML page must load the Umami tracker when a website ID is given (the ID the image was
# built with), and must not load it when the ID is empty or missing.
# Usage: ci/smoke-test.sh <image> [site-url] [umami-website-id]
#
# The <lastmod> check fails on purpose for an image built without src/generated/sitemap-lastmod.json:
# CI always writes it before the build, so run `bash ci/sitemap-lastmod.sh` before building locally.
set -euo pipefail

IMAGE="${1:?usage: ci/smoke-test.sh <image> [site-url] [umami-website-id]}"
SITE_URL="${2:-https://thehot.vn}"
UMAMI_WEBSITE_ID="${3:-}"
NAME="thehot-smoke-${BUILD_NUMBER:-local}-$$"

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$NAME" "$IMAGE" >/dev/null

status=starting
for _ in $(seq 1 30); do
  status=$(docker inspect -f '{{.State.Health.Status}}' "$NAME")
  [ "$status" = healthy ] || [ "$status" = unhealthy ] && break
  sleep 2
done
if [ "$status" != healthy ]; then
  echo "Container is not healthy (status: $status). Last log lines:"
  docker logs --tail 50 "$NAME"
  exit 1
fi
echo "healthy"

docker exec -e SITE_URL="$SITE_URL" -e UMAMI_WEBSITE_ID="$UMAMI_WEBSITE_ID" "$NAME" node -e '
const base = "http://127.0.0.1:3000";
const site = process.env.SITE_URL;
const umamiId = process.env.UMAMI_WEBSITE_ID ?? "";
let failed = false;
const report = (ok, line) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${line}`);
  if (!ok) failed = true;
};
const checks = [
  ...["/", "/menu", "/menu/list", "/about", "/reservation", "/terms", "/privacy", "/sitemap.xml"].map((path) => [path, 200]),
  ["/smoke-test-missing-page", 404],
];
// NEXT_PUBLIC_UMAMI_* are baked in at build time too. next/script (afterInteractive) adds the <script>
// tag in the browser after hydration, so the server HTML has its props (src first, then the website
// ID and data attributes) in the React payload and a <link rel="preload" as="script"> for its src.
const checkTracker = (path, rawHtml) => {
  const html = rawHtml.replaceAll("\\\"", "\"");
  if (!umamiId) {
    report(!html.includes("\"data-website-id\""), `${path} has no Umami tracker (built without a website ID)`);
    return;
  }
  const props = html.match(/"src":"([^"]+)"[^{}]*"data-website-id":"([^"]*)"[^{}]*\}/);
  const ok =
    props !== null &&
    props[2] === umamiId &&
    props[0].includes("\"data-domains\":\"thehot.vn\"") &&
    props[0].includes("\"data-exclude-hash\":\"true\"") &&
    !props[0].includes("data-exclude-search") &&
    html.includes(`<link rel="preload" href="${props[1]}" as="script"`);
  report(ok, `${path} loads the Umami tracker` + (props ? ` (${props[1]}, website ID ${props[2]})` : " (no tracker props in the HTML)"));
};
(async () => {
  for (const [path, expected] of checks) {
    const response = await fetch(base + path);
    report(response.status === expected, `${response.status} ${path}`);
    if (path.endsWith(".xml")) await response.body?.cancel();
    else checkTracker(path, await response.text());
  }
  // NEXT_PUBLIC_SITE_URL is baked in at build time; a missing build arg shows up here.
  const sitemap = `${site}/sitemap.xml`;
  const robots = await (await fetch(base + "/robots.txt")).text();
  report(robots.includes(sitemap), `robots.txt points to ${sitemap}`);

  // Sitemap: every URL dated (CI always generates the dates) and every listed page and image served.
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  const values = (tag) =>
    [...xml.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, "g"))].map((match) => match[1].trim().replaceAll("&amp;", "&"));
  const urls = (xml.match(/<url>/g) ?? []).length;
  const lastmods = values("lastmod").length;
  const datesOk = urls > 0 && urls === lastmods;
  report(
    datesOk,
    `sitemap.xml has ${urls} <url> and ${lastmods} <lastmod>` +
      (datesOk ? "" : " (want at least one <url>, each with a <lastmod>; run bash ci/sitemap-lastmod.sh before the build)"),
  );
  const origin = new URL(site).origin;
  const fetchLoc = async (tag, loc) => {
    let url;
    try {
      url = new URL(loc);
    } catch {
      return report(false, `<${tag}> ${JSON.stringify(loc)} is not an absolute URL`);
    }
    if (url.origin !== origin) return report(false, `<${tag}> ${loc} is not on ${origin}`);
    const path = url.pathname + url.search;
    // No redirect following: a sitemap URL must answer 200 itself.
    const response = await fetch(base + path, { redirect: "manual" });
    const type = response.headers.get("content-type") ?? "";
    await response.body?.cancel();
    const isImage = tag === "image:loc";
    report(
      response.status === 200 && (!isImage || type.startsWith("image/")),
      `${response.status} ${path} (sitemap <${tag}>${isImage ? `, ${type || "no content-type"}` : ""})`,
    );
  };
  for (const tag of ["loc", "image:loc"]) {
    for (const loc of new Set(values(tag))) await fetchLoc(tag, loc);
  }
  process.exit(failed ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'
