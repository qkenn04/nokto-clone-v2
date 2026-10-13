"use client";

import Lenis from "lenis";
import { cancelFrame, frame, type FrameData } from "motion/react";
import { useEffect } from "react";

/** Lenis smooth wheel scrolling with the source's options, driven by Motion's frame loop. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoToggle: true,
    });
    const update = ({ timestamp }: FrameData) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
