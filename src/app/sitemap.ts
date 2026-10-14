import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Matches the source sitemap: legal pages are intentionally omitted.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-12T08:43:06.116Z");
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/menu`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/menu/list`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/reservation`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
