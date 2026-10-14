"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./MoodStamp.module.css";

// Seconds after the stamp starts falling until it hits the page.
const DROP_DELAY = 0.3;
const DROP = 0.6;
const LANDED = DROP_DELAY + DROP * 0.6;

function stampVariants(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, scale: 1.7, rotate: -8 },
    stamped: reduce
      ? { opacity: 1, scale: 1, rotate: 10, transition: { duration: 0 } }
      : {
          opacity: 1,
          scale: [1.7, 0.92, 1.04, 1],
          rotate: [-8, 10, 10, 10],
          transition: {
            delay: DROP_DELAY,
            duration: DROP,
            times: [0, 0.6, 0.8, 1],
            ease: ["easeIn", "easeOut", "easeInOut"],
            opacity: { delay: DROP_DELAY, duration: 0.2 },
          },
        },
  };
}

function inkVariants(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, scale: 0.92 },
    stamped: reduce
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: [0, 0.7, 0], scale: [0.92, 1.3], transition: { delay: LANDED, duration: 0.7, ease: "easeOut" } },
  };
}

function beerVariants(reduce: boolean): Variants {
  return {
    hidden: { backgroundPositionY: "0%" },
    stamped: {
      backgroundPositionY: "100%",
      transition: reduce ? { duration: 0 } : { delay: LANDED + 0.15, duration: 1.3, ease: [0.3, 0.55, 0.3, 1] },
    },
  };
}

/** Rubber stamp that presses onto the page once in view; "Mood đầy." then fills up like a pint. */
export function MoodStamp() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      aria-hidden="true"
      variants={stampVariants(reduce)}
      initial="hidden"
      whileInView="stamped"
      viewport={{ once: true, amount: 0.8 }}
      className={styles.stamp}
    >
      <motion.div
        whileHover={reduce ? undefined : { rotate: [0, -7, 6, -3, 0], scale: 1.05, transition: { duration: 0.6 } }}
        className={styles.face}
      >
        <svg viewBox="0 0 100 100" className={styles.ring}>
          <circle cx="50" cy="50" r="49.4" pathLength={120} />
        </svg>
        <motion.span variants={inkVariants(reduce)} className={styles.ink} />
        <span className={styles.line}>Hội đủ.</span>
        <span className={styles.mood}>
          <span className={styles.glass}>Mood đầy.</span>
          <motion.span variants={beerVariants(reduce)} className={styles.beer}>
            Mood đầy.
          </motion.span>
        </span>
      </motion.div>
    </motion.div>
  );
}
