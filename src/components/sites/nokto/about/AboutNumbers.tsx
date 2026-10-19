"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_CINEMA } from "../motion";
import { Heading, Section, Text, cx } from "../ui";
import { about } from "./content";

const statPlacement = ["lg:col-start-2 lg:col-end-4", "lg:col-start-6 lg:col-end-8", "lg:col-start-10 lg:col-end-12"];

/** Counts from 0 up to `target` once the number scrolls into view. */
function CountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const value = useMotionValue(target);
  const rounded = useTransform(value, (latest) => Math.round(latest));

  useEffect(() => {
    if (reduce || target === 0) {
      value.set(target);
      return;
    }
    if (!inView) {
      value.set(0);
      return;
    }
    const controls = animate(value, target, { duration: 1.6, delay, ease: EASE_CINEMA });
    return () => controls.stop();
  }, [inView, value, target, delay, reduce]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/** Three details about The Hot. */
export function AboutNumbers() {
  const reduce = !!useReducedMotion();

  return (
    <Section
      aria-label="The Hot qua những con số"
      relative
      padY="lg-tight"
      className="flex items-center lg:min-h-[60dvh]"
    >
      <dl className="@container grid w-full grid-cols-1 items-baseline gap-y-12 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
        {about.numbers.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: 0.08 * index, ease: EASE_CINEMA }}
            className={cx("flex flex-col gap-3", statPlacement[index])}
          >
            <Heading as="dt" level="stat" family="display" className="lg:text-[length:min(var(--text-stat),calc((100cqi_-_3rem)/5))]">
              <CountUp target={stat.value} delay={0.12 * index} />{stat.suffix}
            </Heading>
            <Text as="dd" variant="label" tone="muted">
              {stat.label}
            </Text>
          </motion.div>
        ))}
      </dl>
    </Section>
  );
}
