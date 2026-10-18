"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { usePageTick } from "../chrome/PageTransition";
import { EASE_CINEMA, fadeUp } from "../motion";
import { Heading, Section, Text } from "../ui";
import { about } from "./content";

/** Full-height opening: chapter label, two-line display headline, and an editorial line at the bottom. */
export function AboutOpening() {
  const reduce = !!useReducedMotion();
  const tick = usePageTick();

  return (
    <Section aria-label="Giới thiệu The Hot" relative padX={false} padY="none" minH="100dvh" className="isolate">
      <Fragment key={tick}>
        <motion.div
          {...fadeUp(reduce, 12, 0.1)}
          className="absolute left-8 top-32 sm:left-12 sm:top-40 md:left-16 md:top-44 lg:left-20 lg:top-48 xl:left-24 xl:top-52"
        >
          <Text variant="label" tone="muted">
            {about.chapter}
          </Text>
        </motion.div>
        <div className="section-pad flex min-h-[100dvh] items-center">
          <Heading as="h1" level="display">
            {about.headline.map((line, index) => (
              <motion.span
                key={line}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + 0.12 * index, ease: EASE_CINEMA }}
                className="block"
              >
                {index > 0 ? " " : null}
                {line}
              </motion.span>
            ))}
          </Heading>
        </div>
        <motion.div
          {...fadeUp(reduce, 24, 0.7)}
          className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:bottom-16 md:left-16 lg:bottom-20 lg:left-20 xl:bottom-24 xl:left-24"
        >
          <Text variant="small" leading="snug" tone="dim" measure="reading">
            {about.editorial}
          </Text>
        </motion.div>
      </Fragment>
    </Section>
  );
}
