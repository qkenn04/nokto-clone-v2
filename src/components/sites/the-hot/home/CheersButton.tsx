"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useId } from "react";
import type { TrackAttrs } from "@/lib/analytics";
import { EASE_CINEMA } from "../../nokto/motion";
import { buttonClass, cx } from "../../nokto/ui";
import { BeerPour } from "../BeerPour";
import styles from "./CheersButton.module.css";

const MotionLink = motion.create(Link);

// Seconds for the whole clink; rims first meet at IMPACT of the way through.
const CLINK = 0.68;
const IMPACT = 0.44;

/** `side` is 1 for the left mug (swings clockwise) and -1 for the mirrored right mug. */
function mugVariants(side: 1 | -1): Variants {
  return {
    rest: { rotate: -6 * side, x: 0, y: 0, transition: { duration: 0.5, ease: EASE_CINEMA } },
    cheers: {
      rotate: [null, 17 * side, 9 * side, 15 * side, 14 * side],
      x: [null, 0.2 * side, -0.6 * side, 0, 0],
      y: [null, -2.5, -1.6, -2.4, -2.2],
      transition: {
        duration: CLINK,
        times: [0, IMPACT, 0.62, 0.8, 1],
        ease: ["easeIn", "easeOut", "easeInOut", "easeOut"],
      },
    },
    still: { rotate: 9 * side, x: 0, y: -1, transition: { duration: 0 } },
  };
}

const MUG_VARIANTS = { left: mugVariants(1), right: mugVariants(-1) };

// Foam flecks thrown up from the contact point; offsets in px, kept inside the button's top padding.
const DROPLETS = [
  { x: -5.5, y: -8, size: 4.5, kind: "foam", delay: 0 },
  { x: 5, y: -9.5, size: 4, kind: "foam", delay: 0.03 },
  { x: -0.5, y: -11, size: 2.5, kind: "beer", delay: 0.05 },
  { x: 8, y: -5.5, size: 2.5, kind: "beer", delay: 0.02 },
] as const;

function dropletVariants({ x, y, delay }: (typeof DROPLETS)[number]): Variants {
  return {
    rest: {
      opacity: 0,
      transition: { opacity: { duration: 0.15 }, default: { duration: 0, delay: 0.15 } },
      x: 0,
      y: 0,
      scale: 0.3,
    },
    cheers: {
      opacity: [0, 1, 1, 0],
      x: [0, x * 0.7, x],
      y: [0, y, y + 3],
      scale: [0.3, 1, 0.6],
      transition: { duration: 0.5, delay: CLINK * IMPACT + delay, ease: "easeOut" },
    },
    still: { opacity: 0 },
  };
}

const DROPLET_VARIANTS = DROPLETS.map(dropletVariants);

/**
 * Dimpled glass mug after the logo's: D handle, beer darkening toward a frosted base, one highlight and a facet edge,
 * and a foam crown spilling a drip over the inner rim. Drawn with the handle on the left, mirrored for the right mug.
 */
function Mug() {
  const beer = useId();
  return (
    <svg viewBox="0 0 18 24" fill="none" className={styles.mugArt}>
      <defs>
        <linearGradient id={beer} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcd26a" />
          <stop offset="0.5" stopColor="#f4a326" />
          <stop offset="1" stopColor="#bf600d" />
        </linearGradient>
      </defs>
      <path
        d="M6.1 11.2H4.2Q1.5 11.2 1.5 13.9V16.7Q1.5 19.4 4.2 19.4H6.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.55 10.2 7 20.2H15.35L15.85 10.2Z" fill={`url(#${beer})`} />
      <path d="M6.95 20.2H15.4L15.35 21.3Q15.3 22.2 14.3 22.2H8.1Q7.1 22.2 7.05 21.3Z" fill="#fff" opacity="0.55" />
      <path d="M13.1 12.4 12.92 19" stroke="#9a4a0a" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      <path d="M8.2 12.6 8.4 18.9" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.92" />
      <path
        d="M5.9 9.2 6.45 21.4Q6.5 22.9 8 22.9H14.4Q15.9 22.9 15.95 21.4L16.5 9.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3 10.4C4 9.8 4.1 7.6 5.8 7.2 5.8 5 8 3.7 9.8 4.7 10.7 2.5 14 2.4 15 4.8 16.9 4.8 18 7 16.9 8.6 17.3 9.4 17.1 10.4 16.6 10.9L16.55 12.6Q16.5 13.6 15.75 13.4 15.2 13.2 15.25 12.2L15.3 10.9C14.4 11.4 13.1 11.2 12.6 10.6 11.6 11.3 10.3 11.2 9.6 10.6 8.7 11.3 7.3 11.2 6.7 10.6 6.3 10.9 5.7 10.8 5.3 10.4Z"
        fill="#fffaf0"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Home CTA: the primary button, with beer pouring in and two mugs that clink on hover or focus. */
export function CheersButton({ href, label, tracking }: { href: string; label: string; tracking?: TrackAttrs }) {
  const reduce = useReducedMotion() ?? false;
  // Reduced motion: no clink or pour; the mugs settle into a static toast and CSS shows a full pint on hover.
  const gestures = reduce
    ? { animate: "still" }
    : { animate: "rest", whileHover: "cheers", whileFocus: "cheers" };

  return (
    <MotionLink href={href} initial="rest" className={buttonClass("primary", "before:hidden")} {...gestures} {...tracking}>
      <BeerPour mode="follow" streamAt={92} />
      <span aria-hidden className={styles.mugs}>
        <motion.span variants={MUG_VARIANTS.left} className={cx(styles.mug, styles.mugLeft)}>
          <Mug />
        </motion.span>
        <motion.span variants={MUG_VARIANTS.right} className={cx(styles.mug, styles.mugRight)}>
          <Mug />
        </motion.span>
        <span className={styles.splash}>
          {DROPLETS.map((drop, index) => (
            <motion.span
              key={index}
              variants={DROPLET_VARIANTS[index]}
              className={cx(styles.droplet, drop.kind === "foam" ? styles.foam : styles.beer)}
              style={{ width: drop.size, height: drop.size, marginLeft: drop.size / -2, marginTop: drop.size / -2 }}
            />
          ))}
        </span>
      </span>
      {label}
    </MotionLink>
  );
}
