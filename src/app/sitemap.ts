import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import config from "../../seo/sitemap-pages.json";
import { imagePaths, imagesFor } from "@/seo/sitemap-images";

// Public origin without trailing slashes, so a build arg of "https://thehot.vn/" never produces "//" in URLs.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const datesFile = "src/generated/sitemap-lastmod.json";

/** Per-page dates of the last commit touching the page, written by ci/sitemap-lastmod.sh (Jenkins runs it before the build). */
function lastModifiedByPath(): Record<string, string> {
  let dates: unknown;
  try {
    dates = JSON.parse(readFileSync(join(process.cwd(), datesFile), "utf8"));
  } catch {
    // Not generated (local build without the script): leave <lastmod> out rather than invent a date.
    console.warn(`sitemap: cannot read ${datesFile}, <lastmod> omitted (run bash ci/sitemap-lastmod.sh).`);
    return {};
  }
  const entries = typeof dates === "object" && dates !== null && !Array.isArray(dates) ? Object.entries(dates) : [];
  const valid = entries.filter((entry): entry is [string, string] => typeof entry[1] === "string");
  if (entries.length === 0 || valid.length < entries.length) {
    // The script always writes { "<path>": "<ISO date>", ... }; anything else is a bug there, not a reason to fail the build.
    console.warn(`sitemap: ${datesFile} is not an object of date strings, <lastmod> omitted where missing (run bash ci/sitemap-lastmod.sh).`);
  }
  return Object.fromEntries(valid);
}

/** The home page stays the bare origin ("https://thehot.vn"); other paths resolve against it. */
function pageUrl(path: string): string {
  return path === "/" ? siteUrl : new URL(path, siteUrl).href;
}

// Pages come from seo/sitemap-pages.json; `npm run check:sitemap` fails when it drifts from src/app.
// Built once at build time (static route), so the dates file is only needed in the build stage.
export default function sitemap(): MetadataRoute.Sitemap {
  const pagePaths = new Set(config.pages.map((page) => page.path));
  const unknown = imagePaths.filter((path) => !pagePaths.has(path));
  if (unknown.length > 0) {
    throw new Error(
      `sitemap: src/seo/sitemap-images.ts lists images for paths that are not pages in seo/sitemap-pages.json (typo, or page removed?): ${unknown.map((path) => `"${path}"`).join(", ")}.`,
    );
  }

  const lastModified = lastModifiedByPath();
  return config.pages.map((page) => ({
    url: pageUrl(page.path),
    lastModified: lastModified[page.path],
    images: imagesFor(page.path, siteUrl),
  }));
}
