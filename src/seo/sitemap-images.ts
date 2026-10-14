import { about } from "@/components/sites/nokto/about/content";
import { galleryPhotos } from "@/components/sites/the-hot/home/content";
import { MENU_IMAGE_BASE, menuPages } from "@/components/sites/the-hot/menuPages";
import { aboutVideo, heroVideo, kitchenVideo } from "@/components/sites/the-hot/videos";

// Image sitemap entries, read from the same data modules the pages render (no hand-typed lists).
// Rules: only real photos of The Hot that the page actually shows. Never the template backdrop
// (/sites/nokto/images/hero-backdrop.jpg), SVG decorations, icons, the logo or OG images.
// Each image is listed once per page, as its original static file (not /_next/image?...).
const imagesByPath = new Map<string, readonly string[]>([
  ["/", [heroVideo.poster, ...galleryPhotos.map((photo) => photo.src)]],
  ["/menu", menuPages.map((page) => `${MENU_IMAGE_BASE}/${page.file}`)],
  ["/menu/list", [kitchenVideo.poster]],
  // about.heroImage is left out: no about component renders it.
  ["/about", [aboutVideo.poster, about.experienceImage.src, ...about.gallery.map((item) => item.src)]],
]);

/** Absolute image URLs for a sitemap page, or `undefined` when the page declares none. */
export function imagesFor(path: string, siteUrl: string): string[] | undefined {
  const sources = imagesByPath.get(path);
  if (!sources?.length) return undefined;
  return [...new Set(sources)].map((src) => `${siteUrl}${src}`);
}
