import type { VideoSource } from "../nokto/chrome/FixedVideo";
import { hotImage } from "../nokto/site";

export type SiteVideo = { poster: string; sources: readonly VideoSource[] };

/**
 * A source plus, optionally, its video track as `navigator.mediaCapabilities.decodingInfo` takes it: the video codec
 * alone (the API takes one codec per track) and the stream's size, bitrate and frame rate, read with `ffprobe`.
 */
export type ProbedVideoSource = VideoSource & { video?: VideoConfiguration };

/**
 * Home hero loop: the full 103 s with its audio track (ADR 0008), best first. AV1 1080x1920 where it decodes smoothly
 * and power-efficiently, else H.264 720x1280; both faststart. HeroVideo picks one once the page has loaded. A new encode
 * gets a new file name: `/videos` is cached for 7 days.
 */
export const heroVideo = {
  poster: hotImage("hero-video-poster.jpg"),
  sources: [
    {
      src: "/videos/main.v2.av1.mp4",
      type: 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"',
      video: { contentType: 'video/mp4; codecs="av01.0.08M.08"', width: 1080, height: 1920, bitrate: 1_945_547, framerate: 30 },
    },
    { src: "/videos/main.v2.720.mp4", type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"' },
  ],
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
