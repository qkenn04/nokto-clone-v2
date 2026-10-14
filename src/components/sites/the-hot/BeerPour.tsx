"use client";

import { motion, type Variants } from "motion/react";
import { useMemo, type CSSProperties } from "react";
import styles from "./BeerPour.module.css";

type BeerPourProps = {
  /**
   * "follow" reacts to the parent's `rest` / `cheers` / `still` variant labels (motion, for hover).
   * "auto" pours once on CSS keyframes from first paint, so it never waits for hydration.
   */
  mode: "follow" | "auto";
  /** Seconds before an auto pour starts; a hero splash offset (`--hero-offset`) is added on top. */
  delay?: number;
  /** Seconds for the level to reach the top. */
  duration?: number;
  /** Where the stream falls, in % of the width. */
  streamAt?: number;
};

const DRAIN = { duration: 0.45, ease: "easeIn" } as const;
const EASE_POUR = [0.3, 0.62, 0.35, 1] as const;

// Columns of carbonation: x in %, size and height above the bottom edge in cqh, rise time and phase in seconds.
const BUBBLES = [
  { x: 8, size: 6, from: 3, duration: 2, delay: -0.4 },
  { x: 8, size: 4, from: 14, duration: 2, delay: -1.4 },
  { x: 20, size: 7, from: 1, duration: 1.7, delay: -0.9 },
  { x: 33, size: 5, from: 6, duration: 1.5, delay: -0.2 },
  { x: 33, size: 3.5, from: 16, duration: 1.5, delay: -1 },
  { x: 47, size: 8, from: 0, duration: 2.3, delay: -1.7 },
  { x: 47, size: 5, from: 12, duration: 2.3, delay: -0.6 },
  { x: 60, size: 6, from: 4, duration: 1.8, delay: -1.2 },
  { x: 74, size: 7, from: 2, duration: 2.1, delay: -0.3 },
  { x: 74, size: 4, from: 13, duration: 2.1, delay: -1.5 },
  { x: 86, size: 5, from: 5, duration: 1.6, delay: -0.8 },
  { x: 97, size: 4.5, from: 8, duration: 1.9, delay: -1.1 },
] as const;

function pourVariants(duration: number) {
  const pour = { duration, ease: EASE_POUR };
  const instant = { duration: 0 };
  // The level stops with the bubbly crest just inside the top edge.
  const liquid: Variants = {
    rest: { y: "100%", skewY: 0, transition: DRAIN },
    cheers: {
      y: "9%",
      skewY: [0, -3, 2.2, -1, 0],
      transition: { y: pour, skewY: { duration: duration * 0.85, ease: "easeInOut" } },
    },
    still: { y: "9%", skewY: 0, transition: instant },
  };
  // Beer sliding under the foam: a thin head at first, churned thick mid-pour, then settling.
  const body: Variants = {
    rest: { y: "-8%", transition: DRAIN },
    cheers: { y: ["-8%", "8%", "0%"], transition: { duration: duration * 1.25, times: [0, 0.5, 1], ease: "easeOut" } },
    still: { y: "0%", transition: instant },
  };
  const stream: Variants = {
    rest: { clipPath: "inset(0% 0% 100% 0%)", scaleX: 1, transition: { duration: 0.15 } },
    cheers: {
      clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
      scaleX: [0.6, 1, 0.85, 0.3],
      transition: { duration: duration * 0.95, times: [0, 0.12, 0.72, 1], ease: "easeOut" },
    },
    still: { clipPath: "inset(0% 0% 100% 0%)", transition: instant },
  };
  // Foam bloom where the stream hits the surface.
  const churn: Variants = {
    rest: { opacity: 0, scale: 0.4, transition: { duration: 0.2 } },
    cheers: {
      opacity: [0, 1, 1, 0],
      scale: [0.4, 1.15, 0.95, 0.5],
      transition: { duration: duration * 0.95, times: [0, 0.15, 0.7, 1], ease: "easeOut" },
    },
    still: { opacity: 0, transition: instant },
  };
  return { liquid, body, stream, churn };
}

function Bubbles() {
  return BUBBLES.map((bubble, index) => (
    <span
      key={index}
      className={styles.bubble}
      style={{
        left: `${bubble.x}%`,
        top: `${68 - bubble.from}cqh`,
        width: `${bubble.size}cqh`,
        height: `${bubble.size}cqh`,
        animationDuration: `${bubble.duration}s`,
        animationDelay: `${bubble.delay}s`,
      }}
    />
  ));
}

function FollowPour({ duration, streamAt }: { duration: number; streamAt: number }) {
  const variants = useMemo(() => pourVariants(duration), [duration]);

  return (
    <span aria-hidden className={`${styles.pour} ${styles.follow}`} style={{ "--stream-at": `${streamAt}%` } as CSSProperties}>
      <motion.span variants={variants.stream} className={styles.stream} />
      <motion.span variants={variants.liquid} className={styles.liquid}>
        <span className={styles.head} />
        <motion.span variants={variants.body} className={styles.body}>
          <Bubbles />
        </motion.span>
        <motion.span variants={variants.churn} className={styles.churn} />
      </motion.span>
    </span>
  );
}

function AutoPour({ delay, duration, streamAt }: { delay: number; duration: number; streamAt: number }) {
  const timing = { "--stream-at": `${streamAt}%`, "--pour-delay": `${delay}s`, "--pour-duration": `${duration}s` };

  return (
    <span aria-hidden className={`${styles.pour} ${styles.auto}`} style={timing as CSSProperties}>
      <span className={styles.stream} />
      <span className={styles.liquid}>
        <span className={styles.head} />
        <span className={styles.body}>
          <Bubbles />
        </span>
        <span className={styles.churn} />
      </span>
    </span>
  );
}

/** Beer poured into its positioned parent: stream, foam head, glossy liquid and rising carbonation. */
export function BeerPour({ mode, delay = 0, duration = 0.7, streamAt = 86 }: BeerPourProps) {
  return mode === "auto" ? (
    <AutoPour delay={delay} duration={duration} streamAt={streamAt} />
  ) : (
    <FollowPour duration={duration} streamAt={streamAt} />
  );
}
