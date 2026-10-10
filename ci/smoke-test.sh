#!/usr/bin/env bash
# Smoke-test a built image before it is pushed: start it, wait for the Docker HEALTHCHECK,
# then request every route from inside the container (the slim image has no curl).
# Usage: ci/smoke-test.sh <image> [site-url]
set -euo pipefail

IMAGE="${1:?usage: ci/smoke-test.sh <image> [site-url]}"
SITE_URL="${2:-https://nokto.qkenn.cloud}"
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
const checks = [
  ...["/", "/menu", "/about", "/reservation", "/terms", "/privacy"].map((path) => [path, 200]),
  ["/smoke-test-missing-page", 404],
];
(async () => {
  let failed = false;
  for (const [path, expected] of checks) {
    const { status } = await fetch(base + path);
    console.log(`${status === expected ? "ok  " : "FAIL"} ${status} ${path}`);
    if (status !== expected) failed = true;
  }
  // NEXT_PUBLIC_SITE_URL is baked in at build time; a missing build arg shows up here.
  const sitemap = `${process.env.SITE_URL}/sitemap.xml`;
  const robots = await (await fetch(base + "/robots.txt")).text();
  const ok = robots.includes(sitemap);
  console.log(`${ok ? "ok  " : "FAIL"} robots.txt points to ${sitemap}`);
  process.exit(failed || !ok ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'
