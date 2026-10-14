import type { VideoSource } from "../nokto/chrome/FixedVideo";
import { hotImage } from "../nokto/site";

export type SiteVideo = { poster: string; sources: readonly VideoSource[] };

/**
 * A source plus, optionally, its video track as `navigator.mediaCapabilities.decodingInfo` takes it: the video codec
 * alone (the API takes one codec per track) and the stream's size, bitrate and frame rate, read with `ffprobe`.
 */
export type ProbedVideoSource = VideoSource & { video?: VideoConfiguration };

/** Home hero loop. H.264 only; HeroVideo attaches it once the page has loaded. */
export const heroVideo = {
  poster: hotImage("hero-video-poster.jpg"),
  sources: [{ src: "/videos/main.mp4", type: "video/mp4" }],
} satisfies { poster: string; sources: readonly ProbedVideoSource[] };

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
