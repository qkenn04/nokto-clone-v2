// Fails when seo/sitemap-pages.json drifts from the real pages in src/app.
// Runs in the Docker `check` stage (no .git there), so it only reads the working tree. Plain Node, no dependencies.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { isAbsolute, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const configFile = "seo/sitemap-pages.json";
const appDir = "src/app";
const errors = [];

/** Maps a page file under src/app to its URL, or null when the folder is not routable on its own. */
function routeOf(file) {
  const segments = file.split("/").slice(0, -1);
  // Private folders (_x) are not routes; intercepting folders ((.)x, (..)x, (...)x) only overlay another route.
  if (segments.some((s) => s.startsWith("_") || /^\(\.{1,3}\)/.test(s))) return null;
  // Route groups (x) and parallel-route slots @x do not appear in the URL.
  return "/" + segments.filter((s) => !/^\(.+\)$/.test(s) && !s.startsWith("@")).join("/");
}

function isRepoPath(path) {
  return typeof path === "string" && path !== "" && !isAbsolute(path) && normalize(path).split(/[\\/]/)[0] !== "..";
}

function fail() {
  console.error(`sitemap-pages: ${errors.length} problem(s) in ${configFile}:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(readFileSync(join(root, configFile), "utf8"));
} catch (error) {
  console.error(`sitemap-pages: cannot read ${configFile}: ${error.message}`);
  process.exit(1);
}

const pages = Array.isArray(config.pages) ? config.pages : [];
const shared = config.shared ?? [];
const exclude = config.exclude ?? [];
const dynamic = config.dynamic ?? [];
if (!Array.isArray(config.pages) || pages.length === 0) errors.push(`"pages" must be a non-empty array.`);
for (const [key, value] of Object.entries({ shared, exclude, dynamic })) {
  if (!Array.isArray(value)) errors.push(`"${key}" must be an array when present.`);
}
if (errors.length > 0) fail();

const routes = new Set(
  readdirSync(join(root, appDir), { recursive: true })
    .map((file) => String(file).replaceAll("\\", "/"))
    .filter((file) => /(^|\/)page\.(tsx|ts|jsx|js|mdx)$/.test(file))
    .map(routeOf)
    .filter((route) => route !== null),
);

const listed = new Set();
for (const page of pages) {
  const path = page?.path;
  if (typeof path !== "string" || !path.startsWith("/")) {
    errors.push(`pages: every entry needs a "path" starting with "/" (got ${JSON.stringify(path)}).`);
    continue;
  }
  if (listed.has(path)) errors.push(`pages: "${path}" is listed more than once.`);
  listed.add(path);
  if (path.includes("[")) errors.push(`pages: "${path}" is a dynamic route pattern, not a URL; declare it under "dynamic" instead.`);
  else if (!routes.has(path)) errors.push(`pages: "${path}" has no matching page file in ${appDir} (page removed or renamed?).`);
  if (exclude.includes(path)) errors.push(`"${path}" is in both "pages" and "exclude"; keep it in one.`);
  if (!Array.isArray(page.sources) || page.sources.length === 0) errors.push(`pages: "${path}" needs a non-empty "sources" array.`);
}

const sources = [
  ...shared.map((source) => ["shared", source]),
  ...pages.flatMap((page) => (Array.isArray(page?.sources) ? page.sources.map((source) => [page.path, source]) : [])),
];
for (const [owner, source] of sources) {
  if (!isRepoPath(source)) errors.push(`${owner}: source ${JSON.stringify(source)} must be a path relative to the repo root.`);
  else if (!existsSync(join(root, source))) errors.push(`${owner}: source "${source}" does not exist (moved or deleted? update ${configFile}).`);
}

for (const route of [...routes].sort()) {
  const isDynamic = route.includes("[");
  if (isDynamic && !dynamic.includes(route)) {
    errors.push(`Route "${route}" is dynamic; declare it in "dynamic" in ${configFile}.`);
  } else if (!isDynamic && !listed.has(route) && !exclude.includes(route)) {
    errors.push(`Route "${route}" is not declared in ${configFile}; add it to "pages" (with its sources) or to "exclude".`);
  }
}
for (const route of exclude) {
  if (!routes.has(route)) errors.push(`exclude: "${route}" has no matching page file in ${appDir}; remove it.`);
}
for (const route of dynamic) {
  if (!routes.has(route) || !route.includes("[")) errors.push(`dynamic: "${route}" is not a dynamic route in ${appDir}; remove it.`);
}

if (errors.length > 0) fail();
console.log(
  `sitemap-pages: OK, ${routes.size} routes = ${listed.size} in sitemap + ${exclude.length} excluded + ${dynamic.length} dynamic; all ${sources.length} source entries exist.`,
);
