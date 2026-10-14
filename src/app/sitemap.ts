import type { MetadataRoute } from "next";
import config from "../../seo/sitemap-pages.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Pages come from seo/sitemap-pages.json; `npm run check:sitemap` fails when it drifts from src/app.
export default function sitemap(): MetadataRoute.Sitemap {
  return config.pages.map((page) => ({
    url: page.path === "/" ? siteUrl : `${siteUrl}${page.path}`,
  }));
}
