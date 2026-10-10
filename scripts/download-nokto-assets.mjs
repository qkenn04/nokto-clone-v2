// Downloads the assets observed on https://nokto-template.vercel.app/ into public/sites/nokto/
// and the app icons into src/app/. Run with: node scripts/download-nokto-assets.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://nokto-template.vercel.app";
const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "public/sites/nokto");

const images = [
  "a5wagyu.jpg", "akami.jpg", "anago.jpg", "chef.jpg", "counter.jpg", "first-course.jpg",
  "hero-about.jpg", "hero-backdrop.jpg", "hero-menu.jpg", "hero-nigiri.jpg", "hero-reservations.jpg",
  "hirame.jpg", "hotate.jpg", "ikura.jpg", "kanpachi.jpg", "omakase.jpg", "otoro-nigiri.jpg",
  "otoro.jpg", "privacy.jpg", "saba.jpg", "terms.jpg", "uni.jpg",
  "about.svg", "check.svg", "menu.svg", "path-horizontal.svg", "path.svg", "path2.svg", "reservations.svg",
];

// Latin and Latin Extended subsets (the site's copy includes "Próżna"). Weights are variable axes.
const fonts = {
  "inter-tight-latin.woff2": "/_next/static/media/103fc5fac08dcb15-s.p.woff2",
  "inter-tight-latin-ext.woff2": "/_next/static/media/ceda3e828136e1b8-s.woff2",
  "fraunces-latin.woff2": "/_next/static/media/26dc4a78f0c7af7f-s.p.woff2",
  "fraunces-latin-ext.woff2": "/_next/static/media/d02d66744511ad29-s.woff2",
  "fraunces-italic-latin.woff2": "/_next/static/media/e0f4b1ebfdbd83f9-s.p.woff2",
  "fraunces-italic-latin-ext.woff2": "/_next/static/media/7d08bfa01b04d053-s.woff2",
};

const downloads = [
  ["/logo.svg", path.join(SITE, "logo.svg"), "image/svg+xml"],
  ...images.map((file) => [`/images/${file}`, path.join(SITE, "images", file), file.endsWith(".svg") ? "image/svg+xml" : "image/jpeg"]),
  ...Object.entries(fonts).map(([file, url]) => [url, path.join(SITE, "fonts", file), "font/woff2"]),
  ["/icon.svg", path.join(ROOT, "src/app/icon.svg"), "image/svg+xml"],
  ["/apple-icon", path.join(ROOT, "src/app/apple-icon.png"), "image/png"],
  ["/opengraph-image", path.join(ROOT, "src/app/opengraph-image.png"), "image/png"],
];

for (const [url, destination, expectedType] of downloads) {
  const response = await fetch(ORIGIN + url);
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !type.startsWith(expectedType)) {
    throw new Error(`${url}: HTTP ${response.status}, ${type} (expected ${expectedType})`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  console.log(`${url} -> ${path.relative(ROOT, destination)} (${bytes.length} bytes)`);
}
