import { about } from "@/components/sites/nokto/about/content";
import { terms } from "@/components/sites/nokto/legal/content";
import { galleryPhotos, homeEvents } from "@/components/sites/the-hot/home/content";
import { MENU_IMAGE_BASE, menuPages } from "@/components/sites/the-hot/menuPages";
import { aboutVideo, heroVideo, kitchenVideo } from "@/components/sites/the-hot/videos";

// Image sitemap entries, read from the same data modules the pages render (no hand-typed lists).
// Rule: every real photo of The Hot the page shows; the same photo may appear on several pages.
// Never the template backdrop (/sites/nokto/images/hero-backdrop.jpg), SVG decorations, icons,
// the logo or OG images. Each image is listed once per page, as its original static file (not /_next/image?...).
const imagesByPath = new Map<string, readonly string[]>([
  ["/", [heroVideo.poster, ...galleryPhotos.map((photo) => photo.src), ...homeEvents.map((event) => event.poster)]],
  ["/menu", menuPages.map((page) => `${MENU_IMAGE_BASE}/${page.file}`)],
  ["/menu/list", [kitchenVideo.poster]],
  // about.heroImage is left out: no about component renders it.
  ["/about", [aboutVideo.poster, about.experienceImage.src, ...about.gallery.map((item) => item.src)]],
  // <FixedVideo {...aboutVideo} /> shows the poster behind the video.
  ["/reservation", [aboutVideo.poster]],
  // LegalPage pins the document's photo beside the text.
  ["/terms", [terms.image.src]],
]);

/** Page paths that declare images; src/app/sitemap.ts checks that each one is a page in seo/sitemap-pages.json. */
export const imagePaths: readonly string[] = [...imagesByPath.keys()];

/** Absolute image URLs for a sitemap page, or `undefined` when the page declares none. */
export function imagesFor(path: string, siteUrl: string): string[] | undefined {
  const sources = imagesByPath.get(path);
  if (!sources?.length) return undefined;
  // new URL percent-encodes spaces and non-ASCII characters and keeps absolute sources as they are.
  return [...new Set(sources.map((src) => new URL(src, siteUrl).href))];
}
