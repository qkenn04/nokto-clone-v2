"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { BrandMark } from "../chrome/BrandMark";
import { usePageTick } from "../chrome/PageTransition";
import { EASE_CINEMA, fadeUp } from "../motion";
import { site, siteImage } from "../site";
import { ButtonLink, Heading, Section, Stack, Text } from "../ui";
import styles from "./HeroIntro.module.css";

const copy = {
  label: "QUÁN NHẬU CỦA HỘI MÌNH",
  headline: site.sloganLines,
  editorial: "Mồi bén. Bia lạnh. Nhạc lên.",
  body: "Tan làm hay cuối tuần, kéo hội bạn qua The Hot. Gọi vài món, làm một ly, kể nhau nghe đủ chuyện giữa đêm Đà Lạt.",
};

const HEADLINE_LINES = copy.headline.map((line) => line.split(" "));

/** Marble photograph behind the intro, softly masked to the right; it fades in to 35%. */
function HeroBackdrop() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ duration: 1.6, ease: EASE_CINEMA }}
      className="mask-fade-right-hero pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
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
    <Heading as="h1" level="display" className={styles.headline}>
      {HEADLINE_LINES.map((words, lineIndex) => (
        <span key={words.join(" ")} className={`block whitespace-nowrap ${lineIndex === 1 ? "text-accent" : ""}`}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <motion.span
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + 0.12 * lineIndex + 0.04 * index, ease: EASE_CINEMA }}
                className="inline-block whitespace-nowrap"
              >
                {word}
              </motion.span>
              {" "}
            </span>
          ))}
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
    <Section as="div" relative className={`isolate flex flex-1 max-lg:pb-24 lg:block lg:h-full ${styles.intro}`}>
      <Stack gap={10} fullHeight="lg" className={`flex-1 justify-between md:gap-14 lg:gap-16 ${styles.layout}`}>
        <Fragment key={tick}>
          <HeroBackdrop />
          <motion.div {...fadeUp(reduce, 8, 0, 0.8)} className="pointer-events-auto">
            <BrandMark />
          </motion.div>
          <Stack gap={6} className={`pointer-events-auto sm:gap-8 py-8 md:py-0 shrink min-h-0 ${styles.copy}`}>
            <motion.div {...fadeUp(reduce, 12, 0.1)}>
              <Text variant="label" tone="accent">{copy.label}</Text>
            </motion.div>
            <HeroHeadline reduce={reduce} />
            <motion.div {...fadeUp(reduce, 16, 0.55, 0.8)}>
              <Text weight="semibold" tone="accent" tracking="normal">
                {copy.editorial}
              </Text>
            </motion.div>
            <motion.div {...fadeUp(reduce, 16, 0.75, 0.8)}>
              <Text tone="faded" measure="comfort" className="max-lg:text-white/85">
                {copy.body}
              </Text>
            </motion.div>
            <motion.div {...fadeUp(reduce, 16, 0.95, 0.8)}>
              <Stack direction="row" align="center" gap={6} wrap className="pt-2">
                <ButtonLink href={site.cta.href}>{site.cta.label}</ButtonLink>
                <ButtonLink href="/menu" variant="link">
                  Xem menu
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
