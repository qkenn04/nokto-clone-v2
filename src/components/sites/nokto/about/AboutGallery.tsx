"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASE_CINEMA } from "../motion";
import { Section, Text, cx } from "../ui";
import { about } from "./content";

type GalleryLayout = { grid: string; height: string; offset: string };

// Single column below 2xl; at 2xl the three frames scatter across a 12-column grid.
const galleryLayout: GalleryLayout[] = [
  { grid: "2xl:col-start-1 2xl:col-end-6", height: "aspect-[4/5] 2xl:h-[60dvh] 2xl:aspect-auto", offset: "2xl:mt-0" },
  {
    grid: "2xl:col-start-7 2xl:col-end-10",
    height: "aspect-[3/4] 2xl:h-[40dvh] 2xl:aspect-auto",
    offset: "2xl:mt-[25dvh]",
  },
  {
    grid: "2xl:col-start-4 2xl:col-end-8",
    height: "aspect-[4/3] 2xl:h-[50dvh] 2xl:aspect-auto",
    offset: "2xl:mt-[60dvh]",
  },
];

/** Three captioned photographs from the counter. */
export function AboutGallery() {
  const reduce = !!useReducedMotion();

  return (
    <Section aria-label="Fragments from the counter" relative padY="lg" className="2xl:min-h-[140dvh]">
      <ul className="grid grid-cols-1 gap-y-16 2xl:grid-cols-12 2xl:gap-x-6 2xl:gap-y-0">
        {about.gallery.map((item, index) => {
          const layout = galleryLayout[index];
          return (
            <motion.li
              key={item.src}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.08 * index, ease: EASE_CINEMA }}
              className={cx("relative", layout.grid, layout.offset)}
            >
              <figure className="flex flex-col gap-4">
                <div className={cx("relative w-full overflow-hidden bg-surface", layout.height)}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <Text as="figcaption" variant="label" tone="accent-60">
                  {item.caption}
                </Text>
              </figure>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
