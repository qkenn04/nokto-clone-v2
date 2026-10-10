"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealOnView } from "../motion";
import { ButtonLink, Heading, Section, Text } from "../ui";
import { about } from "./content";

/** Closing statement, reservation note, and the link to reserve. */
export function AboutClosing() {
  const reduce = !!useReducedMotion();

  return (
    <Section aria-label="Closing" relative padY="lg" className="flex items-center lg:min-h-[80dvh]">
      <div className="grid w-full grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        <div className="flex flex-col lg:col-start-2 lg:col-end-9">
          <motion.div {...revealOnView(reduce, 0)}>
            <Heading as="h2" level="closing">
              {about.closing.headline}
            </Heading>
          </motion.div>
          <motion.div {...revealOnView(reduce, 0.15)} className="mt-20">
            <Text variant="small" leading="body" tone="muted">
              {about.closing.note}
            </Text>
          </motion.div>
          <motion.div {...revealOnView(reduce, 0.3)} className="mt-[200px]">
            <ButtonLink href={about.closing.cta.href} variant="link">
              {about.closing.cta.label}
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
