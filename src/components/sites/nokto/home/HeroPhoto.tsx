"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { usePageTick } from "../chrome/PageTransition";
import { EASE_CINEMA } from "../motion";
import { Section } from "../ui";

/** Chef's name written on with a left-to-right clip, then a rule and caption fade in beneath it. */
function ChefSignature({ name, caption, delay = 1.2 }: { name: string; caption?: string; delay?: number }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="flex flex-col items-end gap-3 text-white">
      <motion.span
        initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 4 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 }}
        transition={
          reduce
            ? { duration: 0.3, delay }
            : {
                opacity: { duration: 0.4, delay, ease: EASE_CINEMA },
                y: { duration: 0.6, delay, ease: EASE_CINEMA },
                clipPath: { duration: 1.2, delay: delay + 0.1, ease: EASE_CINEMA },
              }
        }
        className="block font-medium tracking-[-0.01em] leading-none text-signature"
      >
        {name}
      </motion.span>
      {caption ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + 1.2, ease: EASE_CINEMA }}
          className="flex items-center gap-3"
        >
          <span aria-hidden className="block h-px w-8 bg-current opacity-70" />
          <span className="type-label">{caption}</span>
        </motion.div>
      ) : null}
    </div>
  );
}

/** Full-bleed photograph that settles from a slight zoom, with the chef's signature in the corner. */
export function HeroPhoto({
  src,
  alt,
  signature,
  signatureCaption,
}: {
  src: string;
  alt: string;
  signature?: string;
  signatureCaption?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const tick = usePageTick();

  return (
    <Section as="div" padX={false} padY="none" relative tone="background" className="h-full">
      <Fragment key={tick}>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_CINEMA }}
          className="h-full w-full"
        >
          <div className="relative w-full overflow-hidden bg-surface h-full w-full">
            <Image src={src} alt={alt} fill preload sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
          </div>
        </motion.div>
        {signature ? (
          <div className="section-pad section-pad-y pointer-events-none absolute inset-0 flex items-end justify-end">
            <ChefSignature name={signature} caption={signatureCaption} />
          </div>
        ) : null}
      </Fragment>
    </Section>
  );
}
