#!/usr/bin/env bash
# Smoke-test a built image before it is pushed: start it, wait for the Docker HEALTHCHECK,
# then request every route from inside the container (the slim image has no curl).
# It also checks the image's /sitemap.xml: every <url> has a <lastmod>, and every <loc> and
# <image:loc> is on the site URL and served by this container (200, images as image/*).
# Usage: ci/smoke-test.sh <image> [site-url]
#
# The <lastmod> check fails on purpose for an image built without src/generated/sitemap-lastmod.json:
# CI always writes it before the build, so run `bash ci/sitemap-lastmod.sh` before building locally.
set -euo pipefail

IMAGE="${1:?usage: ci/smoke-test.sh <image> [site-url]}"
SITE_URL="${2:-https://thehot.vn}"
NAME="nokto-smoke-${BUILD_NUMBER:-local}-$$"

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

docker exec -e SITE_URL="$SITE_URL" "$NAME" node -e '
const base = "http://127.0.0.1:3000";
const site = process.env.SITE_URL;
let failed = false;
const report = (ok, line) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${line}`);
  if (!ok) failed = true;
};
const checks = [
  ...["/", "/menu", "/menu/list", "/about", "/reservation", "/terms", "/privacy", "/sitemap.xml"].map((path) => [path, 200]),
  ["/smoke-test-missing-page", 404],
];
(async () => {
  for (const [path, expected] of checks) {
    const { status } = await fetch(base + path);
    report(status === expected, `${status} ${path}`);
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
