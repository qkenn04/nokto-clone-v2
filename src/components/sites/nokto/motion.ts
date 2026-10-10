import type { Transition, Variants } from "motion/react";

// Shared motion values observed in the source bundle.
export const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;

type MotionProps = {
  initial: Record<string, number>;
  transition: Transition;
};

/** Entrance on mount: fade and rise. Reduced motion keeps only a short fade. */
export function fadeUp(reduce: boolean, y = 24, delay = 0, duration = 0.6) {
  return reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay, ease: EASE_CINEMA } }
    : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration, delay, ease: EASE_CINEMA } };
}

/** Reveal once when 15% inside the viewport. */
export function revealOnView(reduce: boolean, delay = 0, y = 24) {
  const base: MotionProps = reduce
    ? { initial: { opacity: 0 }, transition: { duration: 0.6, delay, ease: EASE_CINEMA } }
    : { initial: { opacity: 0, y }, transition: { duration: 0.6, delay, ease: EASE_CINEMA } };
  return {
    ...base,
    whileInView: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15% 0px" },
  };
}

/** Horizontal step transition used by multi-step flows; `custom` is the direction (1 or -1). */
export function slideVariants(reduce: boolean, distance: number): Variants {
  const offset = reduce ? 0 : distance;
  return {
    enter: (direction: number) => ({ x: direction * offset, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_CINEMA } },
    exit: (direction: number) => ({ x: -direction * offset, opacity: 0, transition: { duration: 0.25, ease: EASE_CINEMA } }),
  };
}

/** Scale-in panel transition used for state swaps. */
export function scaleVariants(reduce: boolean): Variants {
  return {
    enter: { opacity: 0, scale: reduce ? 1 : 0.97 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_CINEMA } },
    exit: { opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.25, ease: EASE_CINEMA } },
  };
}
