"use client";

import { motion, useReducedMotion } from "motion/react";
import { LocateIcon } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { trackAttrs } from "@/lib/analytics";
import { BeerPour } from "../../the-hot/BeerPour";
import { CheersButton } from "../../the-hot/home/CheersButton";
import { BrandMark } from "../chrome/BrandMark";
import { usePageTick } from "../chrome/PageTransition";
import { site, siteImage } from "../site";
import { ButtonLink, Heading, Section, Stack, Text } from "../ui";
import styles from "./HeroIntro.module.css";

const copy = {
  label: "THE HOT ĐÀ LẠT",
  opening: site.sloganLines[0],
  brand: "The Hot",
  punchline: "lên mood.",
  editorial: "Mồi bén. Bia lạnh. Nhạc lên.",
  body: "Tan làm hay cuối tuần, kéo hội bạn qua The Hot. Gọi vài món, làm một ly, kể nhau nghe đủ chuyện giữa đêm Đà Lạt.",
};

// True until the hero first hydrates: only the server-rendered hero is the one the page-load splash covers.
let initialLoad = true;

/** Inline timing for a CSS entrance that rises `y` px and fades in; CSS holds it while the splash covers the page. */
function enter(y: number, delay: number, duration = 0.6) {
  return { "--enter-y": `${y}px`, "--enter-delay": `${delay}s`, "--enter-duration": `${duration}s` } as CSSProperties;
}

/** Marble photograph behind the intro, softly masked to the right; it fades in to 35%. */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className={`mask-fade-right-hero pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block ${styles.backdrop}`}
    >
      <Image
        src={siteImage("hero-backdrop.jpg")}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        quality={55}
        className="object-cover object-left"
      />
    </div>
  );
}

/**
 * Staggered spring lettering and a tilted sticker give the slogan a playful beat.
 * The entrance is CSS so it starts at first paint on the compositor; on phones hydration can land seconds later.
 * Motion only adds the hover play.
 */
function HeroHeadline({ reduce }: { reduce: boolean }) {
  return (
    <Heading as="h1" level="display" aria-label={site.slogan} className={styles.headline}>
      <span aria-hidden="true" className={styles.lettering}>
        <span className={styles.opening}>{copy.opening}</span>
        {" "}
        <span className={styles.brandLine}>
          {Array.from(copy.brand).map((letter, index) => (
            <span
              key={index}
              className={letter === " " ? styles.wordSpace : `${styles.letter} ${styles.brandLetter}`}
              style={{ "--delay": `${0.18 + index * 0.045}s` } as CSSProperties}
            >
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
        {" "}
        <motion.span
          style={{ rotate: -3 }}
          whileHover={reduce ? undefined : { rotate: 0, scale: 1.025 }}
          className={styles.moodSticker}
        >
          {/* Pours once the sticker and its letters have landed. */}
          <BeerPour mode="auto" delay={1} duration={1.4} streamAt={95} />
          <span className={styles.stickerText}>
            {Array.from(copy.punchline).map((letter, index) => (
              <motion.span
                key={index}
                whileHover={reduce || letter === " " ? undefined : { y: -7, rotate: index % 2 === 0 ? -6 : 6 }}
                className={letter === " " ? styles.wordSpace : `${styles.letter} ${styles.moodLetter}`}
                style={{ "--delay": `${0.56 + index * 0.035}s` } as CSSProperties}
              >
                {letter === " " ? "\u00a0" : letter}
              </motion.span>
            ))}
          </span>
        </motion.span>
      </span>
    </Heading>
  );
}

/**
 * Left column of the home page: logo, headline, copy and actions over a masked backdrop.
 * Every entrance is CSS, so it plays from first paint whatever hydration does. On a full page load the
 * server-rendered column (`data-load`) waits for the splash to start leaving. Clicking the logo on `/` bumps the page
 * tick, which remounts the column and replays its entrance at once.
 */
export function HeroIntro() {
  const reduce = useReducedMotion() ?? false;
  const tick = usePageTick();
  const [fromLoad] = useState(() => initialLoad);

  useEffect(() => {
    initialLoad = false;
  }, []);

  return (
    <Section
      as="div"
      relative
      data-load={fromLoad && tick === 0 ? "" : undefined}
      className={`isolate flex flex-1 max-lg:pb-24 lg:block lg:h-full ${styles.intro}`}
    >
      <Stack gap={10} fullHeight="lg" className={`flex-1 justify-between md:gap-14 lg:gap-16 ${styles.layout}`}>
        <Fragment key={tick}>
          <HeroBackdrop />
          <div className={`pointer-events-auto ${styles.enter}`} style={enter(8, 0, 0.8)}>
            <BrandMark />
          </div>
          <Stack gap={6} className={`pointer-events-auto sm:gap-8 py-8 md:py-0 shrink min-h-0 ${styles.copy}`}>
            <div className={styles.enter} style={enter(12, 0.1)}>
              <Text variant="label" tone="accent" className={styles.eyebrow}>
                <LocateIcon aria-hidden="true" size={14} strokeWidth={1.8} />
                {copy.label}
              </Text>
            </div>
            <HeroHeadline reduce={reduce} />
            <div className={styles.enter} style={enter(16, 0.55, 0.8)}>
              <Text weight="semibold" tone="accent" tracking="normal" className={styles.editorial}>
                {copy.editorial}
              </Text>
            </div>
            <div className={styles.enter} style={enter(16, 0.75, 0.8)}>
              <Text tone="faded" measure="comfort" className={`max-lg:text-white/85 ${styles.body}`}>
                {copy.body}
              </Text>
            </div>
            <div className={styles.enter} style={enter(16, 0.95, 0.8)}>
              <Stack direction="row" align="center" gap={6} wrap className="pt-2">
                <CheersButton href={site.cta.href} label={site.cta.label} tracking={trackAttrs("booking_cta_click", { location: "hero" })} />
                <ButtonLink href="/menu" variant="link">
                  Xem menu nhậu
                </ButtonLink>
              </Stack>
            </div>
          </Stack>
          <div aria-hidden />
        </Fragment>
      </Stack>
    </Section>
  );
}
