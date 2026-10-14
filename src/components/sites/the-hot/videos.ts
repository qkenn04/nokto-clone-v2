import type { VideoSource } from "../nokto/chrome/FixedVideo";
import { hotImage } from "../nokto/site";

export type SiteVideo = { poster: string; sources: readonly VideoSource[] };

/** Home hero loop. H.264 only; HeroVideo plays the first source. */
export const heroVideo = {
  poster: hotImage("hero-video-poster.jpg"),
  sources: [{ src: "/videos/main.mp4", type: "video/mp4" }],
} satisfies SiteVideo;

/** Night at the venue, shared by the about and reservation pages. AV1 first, H.264 fallback. */
export const aboutVideo = {
  poster: hotImage("about-video-poster.jpg"),
  sources: [
    { src: "/videos/about.av1.mp4", type: "video/mp4; codecs=av01.0.08M.08" },
    { src: "/videos/about.mp4", type: "video/mp4" },
  ],
} satisfies SiteVideo;

/** Kitchen loop for the list menu. AV1 first, H.264 fallback. */
export const kitchenVideo = {
  poster: hotImage("kitchen-video-poster.jpg"),
  sources: [
    { src: "/videos/kitchen.av1.mp4", type: "video/mp4; codecs=av01.0.08M.08" },
    { src: "/videos/kitchen.mp4", type: "video/mp4" },
  ],
} satisfies SiteVideo;
