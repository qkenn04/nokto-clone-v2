"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASE_CINEMA } from "../motion";
import { siteImage } from "../site";
import { Section, Text, cx } from "../ui";
import { about } from "./content";

// From lg up the three paragraphs are pinned at staggered heights and offsets over the timeline.
const paragraphPlacement = [
  "lg:absolute lg:top-[22dvh] lg:left-[30%] lg:right-[12%] 2xl:left-[32%] 2xl:right-[14%]",
  "lg:absolute lg:top-[43dvh] lg:left-[30%] lg:right-[12%] 2xl:left-[44%] 2xl:right-[8%]",
  "lg:absolute lg:top-[66dvh] lg:left-[30%] lg:right-[12%] 2xl:left-[34%] 2xl:right-[12%]",
] as const;

type TimelinePath = { file: string; width: number; height: number; className: string };

// The straight path runs from lg to xl; the curved path replaces it at 2xl.
const timelinePaths: TimelinePath[] = [
  {
    file: "path2.svg",
    width: 20,
    height: 565,
    className: "pointer-events-none absolute hidden lg:left-20 lg:top-[18%] lg:block lg:h-[39%] xl:left-24 2xl:hidden",
  },
  {
    file: "path.svg",
    width: 420,
    height: 1031,
    className: "pointer-events-none absolute hidden 2xl:left-12 2xl:top-[24%] 2xl:block 2xl:h-[28%]",
  },
];

/** The story in three numbered paragraphs, with a timeline drawn downwards by a clip-path reveal. */
export function AboutBody() {
  const reduce = !!useReducedMotion();
  const pathReveal = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    whileInView: reduce ? { opacity: 0.95 } : { opacity: 0.95, clipPath: "inset(0 0 0% 0)" },
    viewport: { once: true, margin: "-10% 0px" },
    transition: {
      opacity: { duration: 0.6, ease: EASE_CINEMA },
      clipPath: { duration: 2.4, ease: EASE_CINEMA },
    },
  };

  return (
    <Section aria-label="Philosophy" relative padY="none" className="lg:min-h-[120dvh]">
      <div className="flex flex-col gap-4 py-24 sm:py-32 md:py-40 lg:py-0">
        {timelinePaths.map((path) => (
          <motion.div key={path.file} aria-hidden {...pathReveal} className={path.className}>
            <Image
              src={siteImage(path.file)}
              alt=""
              width={path.width}
              height={path.height}
              unoptimized
              className="h-full w-auto"
            />
          </motion.div>
        ))}
        <div className="flex flex-col gap-y-16 lg:block">
          {about.body.map((paragraph, index) => (
            <motion.div
              key={paragraph}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: 0.08 * index, ease: EASE_CINEMA }}
              className={cx("relative", paragraphPlacement[index])}
            >
              <span aria-hidden className="type-label absolute -left-12 top-[0.4em] hidden text-accent/80 lg:block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Text variant="editorial" leading="snug" tone="soft">
                {paragraph}
              </Text>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
