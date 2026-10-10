"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_CINEMA, revealOnView } from "../motion";
import { Heading, Section, Text } from "../ui";
import { about } from "./content";

/** The chef's quote at h1 size with its accent attribution. */
export function AboutQuote() {
  const reduce = !!useReducedMotion();

  return (
    <Section
      aria-label="In the chef's words"
      relative
      padY="lg-loose"
      className="flex items-center lg:min-h-[90dvh]"
    >
      <div className="grid w-full grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        <blockquote className="lg:col-start-2 lg:col-end-10">
          <motion.div {...revealOnView(reduce, 0)}>
            <Heading as="p" level="h1">
              {about.quote.text}
            </Heading>
          </motion.div>
          <motion.footer
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_CINEMA }}
            className="mt-[120px]"
          >
            <Text variant="label" tone="accent-70">
              {about.quote.attribution}
            </Text>
          </motion.footer>
        </blockquote>
      </div>
    </Section>
  );
}
