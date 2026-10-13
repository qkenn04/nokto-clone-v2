"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, useCallback } from "react";
import { usePageTick } from "../chrome/PageTransition";
import { EASE_CINEMA, fadeUp } from "../motion";
import { Heading, Section, Stack, Text, buttonClass } from "../ui";
import { reservation } from "./content";

function PolicyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
      {items.map((item, index) => (
        <li key={item} className="relative flex items-center gap-3">
          {index > 0 ? <span aria-hidden className="hidden h-px w-4 bg-border sm:-ml-3 sm:block" /> : null}
          <Text as="span" variant="small" tone="muted">
            {item}
          </Text>
        </li>
      ))}
    </ul>
  );
}

/** Full-height opening: label, two-line display heading, intro, scroll cue and booking rules. */
export function ReservationHero() {
  const reduce = useReducedMotion() ?? false;
  const tick = usePageTick();
  const { hero } = reservation;

  const scrollToForm = useCallback(() => {
    document
      .getElementById("reservation-form")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  return (
    <Section as="section" aria-label="Đặt bàn The Hot" relative padX={false} padY="none" minH="100dvh" className="isolate">
      <Fragment key={tick}>
        <motion.div
          {...fadeUp(reduce, 12, 0.1)}
          className="absolute left-8 top-24 sm:left-12 sm:top-28 md:left-16 md:top-32 lg:left-20 lg:top-36 xl:left-24 xl:top-40"
        >
          <Text variant="label" tone="muted">
            {hero.label}
          </Text>
        </motion.div>

        <div className="section-pad flex min-h-[100dvh] items-center">
          <Stack gap={10} className="lg:gap-12">
            <Heading as="h1" level="display">
              {hero.headline.map((line, index) => (
                <motion.span
                  key={line}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 + 0.12 * index, ease: EASE_CINEMA }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </Heading>
            <motion.div {...fadeUp(reduce, 24, 0.55)}>
              <Text variant="editorial" leading="snug" tone="low" measure="comfort">
                {hero.intro}
              </Text>
            </motion.div>
            <motion.div {...fadeUp(reduce, 24, 0.75)}>
              <button type="button" onClick={scrollToForm} aria-label={hero.scrollCta} className={buttonClass("link")}>
                <span>{hero.scrollCta}</span>
                <ArrowDown aria-hidden strokeWidth={1.5} className="h-4 w-4" />
              </button>
            </motion.div>
          </Stack>
        </div>

        <motion.div
          {...fadeUp(reduce, 24, 0.75)}
          className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12 md:bottom-16 md:left-16 md:right-16 lg:bottom-20 lg:left-20 lg:right-auto lg:max-w-[42rem] xl:bottom-24 xl:left-24"
        >
          <PolicyList items={hero.policy} />
        </motion.div>
      </Fragment>
    </Section>
  );
}
