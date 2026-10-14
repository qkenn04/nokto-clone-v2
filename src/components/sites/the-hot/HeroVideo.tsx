"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../nokto/chrome/FixedVideo";
import { usePageTick } from "../nokto/chrome/PageTransition";
import { cx } from "../nokto/ui";
import styles from "./HeroVideo.module.css";
import type { ProbedVideoSource } from "./videos";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// The clip opens on about 2 s of near-black (a slow fade-in on a dark shot of the sign); its first bright shot cuts in
// at 2.33 s. Starting the first play there keeps the hero from dipping to black right after the bright poster; `loop`
// then plays the whole clip from 0.
const FIRST_PLAY_FROM = 2.25;
// The video waits for the page's own first load, but a request that never settles must not hold it back for good.
const LOAD_WAIT_CAP_MS = 8000;
const IDLE_TIMEOUT_MS = 1000;
// Cross-fade from the poster. Slow at the start, so the few frames before the first bright shot never show through.
const FADE_IN: KeyframeAnimationOptions = { duration: 1000, easing: "ease-in-out" };

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Data Saver is on, or the connection is 2G-class. Only Chromium browsers expose `navigator.connection`. */
function onLowData() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return connection?.saveData === true || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";
}

/** Resolves on the window `load` event (at once when it has fired), after `LOAD_WAIT_CAP_MS` at the latest, or on abort. */
function pageLoaded(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted || document.readyState === "complete") return resolve();
    const done = () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", done);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const timer = window.setTimeout(done, LOAD_WAIT_CAP_MS);
    window.addEventListener("load", done);
    signal.addEventListener("abort", done);
  });
}

/**
 * Resolves once the splash is leaving: `data-splash` on the splash root is `exit` or `done` (see Preloader), or on
 * abort. Client navigations back to `/` find it `done`; without the root or the attribute (the layout's script did not
 * run) there is nothing to wait for.
 */
function splashLeaving(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const root = document.querySelector("[data-splash-root]");
    const leaving = () => {
      const state = root?.getAttribute("data-splash");
      return state == null || state === "exit" || state === "done";
    };
    if (signal.aborted || !root || leaving()) return resolve();
    const done = () => {
      observer.disconnect();
      signal.removeEventListener("abort", done);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (leaving()) done();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-splash"] });
    signal.addEventListener("abort", done);
  });
}

/** Resolves when the main thread is next idle (at most `IDLE_TIMEOUT_MS` later), or on abort. Safari has no idle callback. */
function idle(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const done = () => {
      if (hasIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const handle = hasIdleCallback
      ? window.requestIdleCallback(done, { timeout: IDLE_TIMEOUT_MS })
      : window.setTimeout(done, 50);
    signal.addEventListener("abort", done);
  });
}

/**
 * Whether this device plays `source` smoothly and power-efficiently (in practice: decodes it in hardware). Without the
 * Media Capabilities API, or without the stream facts to ask it, the element's `canPlayType` decides.
 */
async function decodesWell(video: HTMLVideoElement, source: ProbedVideoSource) {
  if (source.video && navigator.mediaCapabilities) {
    try {
      const info = await navigator.mediaCapabilities.decodingInfo({ type: "file", video: source.video });
      return info.supported && info.smooth && info.powerEfficient;
    } catch {
      // A configuration this browser cannot parse: let canPlayType decide.
    }
  }
  return video.canPlayType(source.type) === "probably";
}

/** Index of the first source this device decodes well; the last source is the fallback for every other device. */
async function chooseSource(video: HTMLVideoElement, sources: readonly ProbedVideoSource[]) {
  for (let index = 0; index < sources.length - 1; index += 1) {
    if (await decodesWell(video, sources[index])) return index;
  }
  return sources.length - 1;
}

/**
 * Home hero: the poster, with the muted video loop cross-fading in over it once it actually plays. The server markup has
 * no video source, so nothing downloads with the page. The client attaches one after the window `load` event, once the
 * splash is leaving and the main thread is idle, and never with reduced motion, Data Saver or a 2G-class connection
 * (the poster stays). Sources are ordered best first: it takes the first one this device decodes well, starts the
 * first play on the first bright shot, and pauses the video while it is scrolled out of view.
 */
export function HeroVideo({ sources, poster }: { sources: readonly ProbedVideoSource[]; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const tick = usePageTick();
  const lastTick = useRef(tick);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce || sources.length === 0 || onLowData()) return;
    const controller = new AbortController();
    const { signal } = controller;
    let observer: IntersectionObserver | undefined;

    void (async () => {
      await pageLoaded(signal);
      await splashLeaving(signal);
      await idle(signal);
      if (signal.aborted) return;
      const index = await chooseSource(video, sources);
      if (signal.aborted) return;

      // The chosen source and the ones after it: the browser only moves on when a file cannot be fetched or read, so
      // the fallback costs nothing otherwise, and a device that was steered away from a source never falls back to it.
      for (const { src, type } of sources.slice(index)) {
        const source = document.createElement("source");
        source.src = src;
        source.type = type;
        video.append(source);
      }
      // React does not reliably reflect `muted` to the element; autoplay policies require it before play().
      video.muted = true;
      const startOnBrightShot = () => {
        video.currentTime = FIRST_PLAY_FROM;
      };
      video.addEventListener("loadedmetadata", startOnBrightShot, { once: true, signal });
      // Run source selection now that the <source> children are attached.
      video.load();
      // Keep the poster when the browser blocks autoplay (iOS Low Power Mode, for one).
      void video.play().catch(() => {});

      let resumeOnReturn = false;
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          resumeOnReturn = !video.paused;
          video.pause();
        } else if (resumeOnReturn) {
          resumeOnReturn = false;
          void video.play().catch(() => {});
        }
      });
      observer.observe(video);
    })();

    return () => {
      controller.abort();
      observer?.disconnect();
      video.pause();
      // Loading the element without sources aborts any download still in flight.
      video.replaceChildren();
      video.load();
    };
  }, [reduce, sources]);

  // Clicking the logo on `/` replays the page entrance: restart the clip on its first bright shot and fade it in again.
  useEffect(() => {
    if (tick === lastTick.current) return;
    lastTick.current = tick;
    const video = videoRef.current;
    if (!video || !shown) return;
    video.currentTime = FIRST_PLAY_FROM;
    video.animate({ opacity: [0, 1] }, FADE_IN);
  }, [tick, shown]);

  return (
    <div className="relative isolate h-full w-full bg-background">
      {/*
        Visible at once and kept underneath: it is all there is until the video plays, and stays if it never does.
        Eager but not high priority, so it does not compete with the splash backdrop, the LCP image (ADR 0006).
      */}
      <Image
        src={poster}
        alt="Không gian The Hot Beer Garden Đà Lạt"
        fill
        loading="eager"
        sizes="(max-width: 1023px) 100vw, 55vw"
        className="object-cover"
      />
      <video
        id="home-hero-video"
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        onPlaying={(event) => {
          if (shown) return;
          setShown(true);
          event.currentTarget.animate({ opacity: [0, 1] }, FADE_IN);
        }}
        onEmptied={() => setShown(false)}
        onError={() => setShown(false)}
        className={cx("absolute inset-0 h-full w-full object-cover", shown ? "opacity-100" : "opacity-0")}
      />
      <div aria-hidden="true" className={styles.overlay} />
    </div>
  );
}
