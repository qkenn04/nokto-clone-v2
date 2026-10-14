"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../ui";
import { Backdrop } from "./Backdrop";
import styles from "./Preloader.module.css";
import { SPLASH_LOGO } from "./splashLogo";

// Bubble positions in % of the beer, size in px, rise duration and (negative) phase in seconds.
const BUBBLES = [
  { x: 4, y: 12, size: 8, duration: 2.6, delay: -0.3 },
  { x: 9, y: 34, size: 5, duration: 2.1, delay: -1.2 },
  { x: 14, y: 20, size: 11, duration: 3.1, delay: -2.2 },
  { x: 20, y: 46, size: 6, duration: 2.3, delay: -0.8 },
  { x: 25, y: 8, size: 7, duration: 2.8, delay: -1.7 },
  { x: 31, y: 28, size: 4, duration: 1.9, delay: -0.4 },
  { x: 36, y: 52, size: 9, duration: 2.9, delay: -2.6 },
  { x: 42, y: 16, size: 5, duration: 2.2, delay: -1.5 },
  { x: 47, y: 38, size: 12, duration: 3.4, delay: -2.9 },
  { x: 53, y: 40, size: 7, duration: 2.5, delay: -0.1 },
  { x: 58, y: 10, size: 12, duration: 3.3, delay: -1.9 },
  { x: 64, y: 30, size: 5, duration: 2, delay: -0.9 },
  { x: 69, y: 48, size: 8, duration: 2.7, delay: -2.4 },
  { x: 75, y: 18, size: 6, duration: 2.4, delay: -0.6 },
  { x: 81, y: 38, size: 10, duration: 3, delay: -1.4 },
  { x: 86, y: 6, size: 4, duration: 2.1, delay: -2 },
  { x: 91, y: 26, size: 7, duration: 2.6, delay: -1 },
  { x: 96, y: 44, size: 5, duration: 2.2, delay: -1.8 },
] as const;

/** Amber beer rising from the bottom with a drifting foam head; the foam thickens as it fills. */
function BeerFill() {
  return (
    <div className={styles.liquid}>
      <div className={styles.foam}>
        <span className={styles.crestBack} />
        <span className={styles.crest} />
      </div>
      <div className={styles.beer}>
        {BUBBLES.map((bubble, index) => (
          <span
            key={index}
            className={styles.bubble}
            style={{
              left: `${bubble.x}%`,
              bottom: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Settles once every animation has finished or been cancelled. */
function settled(animations: Animation[]) {
  return Promise.allSettled(animations.map((animation) => animation.finished));
}

/** Resolves when the main thread next has a moment free, so the exit does not start mid-task; at most `timeout` ms. */
function whenIdle(timeout: number) {
  return new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 50);
  });
}

/**
 * Beer-fill splash on every full page load (client navigations keep the layout, so it does not come back). It is the
 * first content in the server HTML and runs on CSS from first paint; the layout's script drives `data-splash` on the
 * root (see Preloader.module.css). Once hydrated it holds the full glass until the intro has played out and the page
 * is ready, then fades it and unmounts.
 */
export function Preloader() {
  const overlay = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const element = overlay.current;
    const root = element?.closest<HTMLElement>("[data-splash-root]");
    if (!element || !root) return;
    let active = true;
    const state = () => root.getAttribute("data-splash");
    const unmount = () => {
      if (active) setFinished(true);
    };
    // The fade is a transition on the overlay itself; when none is running it has already ended.
    const leave = () => {
      if (!active) return;
      if (state() === "wait" || state() === "play") root.setAttribute("data-splash", "exit");
      settled(element.getAnimations()).then(() => {
        if (!active) return;
        root.setAttribute("data-splash", "done");
        unmount();
      });
    };

    const current = state();
    if (current === null) {
      // The script did not run: the overlay is on its fixed CSS clock, so wait for its own fade.
      settled(element.getAnimations()).then(unmount);
    } else if (current === "wait" || current === "play") {
      // Every one-shot animation inside (the rise, ink and logo; foam and bubbles loop) must play out first, and the
      // fonts must be in; this effect running means the page has hydrated.
      const own = new Set(element.getAnimations());
      const intro = element
        .getAnimations({ subtree: true })
        .filter((animation) => !own.has(animation) && animation.effect?.getTiming().iterations !== Infinity);
      Promise.all([settled(intro), document.fonts.ready])
        .then(() => whenIdle(500))
        .then(leave);
    } else {
      // The script's 6s cap already started the exit (or it ended): finish it.
      leave();
    }
    return () => {
      active = false;
    };
  }, []);

  if (finished) return null;

  return (
    <div
      ref={overlay}
      aria-hidden
      className={cx("fixed inset-0 z-[120] items-center justify-center overflow-hidden bg-background", styles.overlay)}
    >
      {/*
        The logo is inline vector geometry, so there is nothing to load. It comes first in the markup (layered above
        the beer with z-index) so a page still streaming in cannot paint any splash content before it.
      */}
      <div className={cx("relative z-[2] flex items-center justify-center", styles.logo)}>
        <svg viewBox={SPLASH_LOGO.viewBox} className={cx("block h-28 w-auto", styles.logoGold)}>
          <path id="splash-logo-shape" fillRule="evenodd" d={SPLASH_LOGO.d} />
        </svg>
      </div>
      {/* Dark copy of the logo, revealed in step with the surface (trailing the foam crest) so it stays legible. */}
      <div className={cx("absolute inset-0 z-[3] overflow-hidden", styles.ink)}>
        <div className={cx("absolute inset-0 flex items-center justify-center", styles.inkLogo)}>
          <div className={styles.logo}>
            <svg viewBox={SPLASH_LOGO.viewBox} className={cx("block h-28 w-auto", styles.logoInk)}>
              <use href="#splash-logo-shape" />
            </svg>
          </div>
        </div>
      </div>
      <Backdrop position="absolute" preload />
      <BeerFill />
    </div>
  );
}
