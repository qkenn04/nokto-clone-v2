"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { BrandMark } from "../chrome/BrandMark";
import { usePageTick } from "../chrome/PageTransition";
import { EASE_CINEMA, fadeUp } from "../motion";
import { site, siteImage } from "../site";
import { ButtonLink, Heading, Section, Stack, Text } from "../ui";

const copy = {
  headline: "After the first bite, the room goes quiet.",
  editorial: "The experience is everything.",
  body: site.rootDescription,
};

const HEADLINE_WORDS = copy.headline.split(" ");

/** Marble photograph behind the intro, softly masked to the right; it fades in to 35%. */
function HeroBackdrop() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ duration: 1.6, ease: EASE_CINEMA }}
      className="mask-fade-right-hero pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Image
        src={siteImage("hero-backdrop.jpg")}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        quality={55}
        className="object-cover object-left"
      />
    </motion.div>
  );
}

/** Headline split into words that rise in one after another. */
function HeroHeadline({ reduce }: { reduce: boolean }) {
  return (
    <Heading as="h1" level="display">
      {HEADLINE_WORDS.map((word, index) => (
        <span key={`${word}-${index}`}>
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + 0.06 * index, ease: EASE_CINEMA }}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
          {index < HEADLINE_WORDS.length - 1 ? " " : null}
        </span>
      ))}
    </Heading>
  );
}

/**
 * Left column of the home page: logo, headline, copy and actions over a masked backdrop.
 * Clicking the logo on `/` bumps the page tick, which remounts the column and replays its entrance.
 */
export function HeroIntro() {
  const reduce = useReducedMotion() ?? false;
  const tick = usePageTick();

  return (
    <Section as="div" relative className="isolate lg:h-full">
      <Stack gap={10} fullHeight="lg" className="md:gap-14 lg:gap-16 lg:justify-between">
        <Fragment key={tick}>
          <HeroBackdrop />
          <motion.div {...fadeUp(reduce, 8, 0, 0.8)}>
            <BrandMark />
          </motion.div>
          <Stack gap={6} className="sm:gap-8 py-8 md:py-0 shrink min-h-0">
            <HeroHeadline reduce={reduce} />
            <motion.div {...fadeUp(reduce, 16, 0.55, 0.8)}>
              <Text variant="editorial" serif italic weight="light" tone="muted" tracking="normal" nowrap>
                {copy.editorial}
              </Text>
            </motion.div>
            <motion.div {...fadeUp(reduce, 16, 0.75, 0.8)}>
              <Text tone="faded" measure="comfort">
                {copy.body}
              </Text>
            </motion.div>
            <motion.div {...fadeUp(reduce, 16, 0.95, 0.8)}>
              <Stack direction="row" align="center" gap={6} className="pt-2">
                <ButtonLink href={site.cta.href}>{site.cta.label}</ButtonLink>
                <ButtonLink href="/menu" variant="link">
                  View menu
                </ButtonLink>
              </Stack>
            </motion.div>
          </Stack>
          <div aria-hidden />
        </Fragment>
      </Stack>
    </Section>
  );
}
