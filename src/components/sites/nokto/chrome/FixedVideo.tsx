"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import styles from "./FixedVideo.module.css";

export type VideoSource = { src: string; type: string };

// Matches Tailwind's `lg` breakpoint, where the panel becomes visible.
const DESKTOP_QUERY = "(min-width: 64rem)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Live `matchMedia` result; `false` during SSR and hydration so the server markup never carries video sources. */
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Desktop-only muted video loop pinned to the right half of the viewport while the left column scrolls.
 * The poster sits underneath as the fallback; sources are only attached on `lg` screens without reduced motion,
 * and the video fades in once it is actually playing. A gradient overlay blends the panel into the content column.
 * Pair it with a `relative z-10 lg:w-1/2` content column inside `<main className="relative w-full">`.
 */
export function FixedVideo({ sources, poster }: { sources: readonly VideoSource[]; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const enabled = isDesktop && !reduce;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;
    // React does not reliably reflect `muted` to the element; autoplay policies require it before play().
    video.muted = true;
    // Re-run source selection now that the <source> children are attached.
    video.load();
    // Keep the poster visible when browser preferences block autoplay.
    void video.play().catch(() => {});
    return () => {
      // The sources are gone by now; loading the empty element aborts any in-flight download.
      video.pause();
      video.load();
    };
  }, [enabled]);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 isolate z-0 hidden h-dvh w-1/2 overflow-hidden lg:block"
    >
      <Image src={poster} alt="" fill sizes="50vw" preload className="z-0 object-cover" />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        onPlaying={() => setPlaying(true)}
        onEmptied={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        className={cn(
          "absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-cinema",
          enabled && playing && "opacity-100",
        )}
      >
        {enabled && sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
      </video>
      <div className={styles.overlay} />
    </aside>
  );
}
