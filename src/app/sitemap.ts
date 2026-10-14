import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import config from "../../seo/sitemap-pages.json";
import { imagesFor } from "@/seo/sitemap-images";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Per-page dates of the last commit touching the page, written by ci/sitemap-lastmod.sh (Jenkins runs it before the build). */
function lastModifiedByPath(): Record<string, string> {
  const file = join(process.cwd(), "src/generated/sitemap-lastmod.json");
  try {
    const dates: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (typeof dates !== "object" || dates === null || Array.isArray(dates)) return {};
    return Object.fromEntries(Object.entries(dates).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch {
    // Not generated (local build without the script): leave <lastmod> out rather than invent a date.
    console.warn("sitemap: cannot read src/generated/sitemap-lastmod.json, <lastmod> omitted (run bash ci/sitemap-lastmod.sh).");
    return {};
  }
}

// Pages come from seo/sitemap-pages.json; `npm run check:sitemap` fails when it drifts from src/app.
// Built once at build time (static route), so the dates file is only needed in the build stage.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = lastModifiedByPath();
  return config.pages.map((page) => ({
    url: page.path === "/" ? siteUrl : `${siteUrl}${page.path}`,
    lastModified: lastModified[page.path],
    images: imagesFor(page.path, siteUrl),
  }));
}
