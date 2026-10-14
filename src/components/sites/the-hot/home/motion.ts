import { EASE_CINEMA } from "../../nokto/motion";

/** One entrance per item; reduced motion shows content without moving it. */
export function revealOnScroll(reduce: boolean, delay = 0, tilt = 0) {
  return {
    initial: reduce ? false as const : { opacity: 0, y: 36, rotate: tilt, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, rotate: 0, scale: 1 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduce ? 0 : 0.65, delay: reduce ? 0 : delay, ease: EASE_CINEMA },
  };
}
