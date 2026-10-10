"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { revealOnView } from "../motion";
import { Heading, Section, Stack, Text } from "../ui";
import { about } from "./content";

/** Chef portrait with an accent caption, then the name and a two-line bio. */
export function AboutChef() {
  const reduce = !!useReducedMotion();

  return (
    <Section aria-label="The chef" relative padY="lg" className="2xl:min-h-[110dvh]">
      <div className="grid grid-cols-1 gap-y-12 2xl:grid-cols-12 2xl:gap-x-6 2xl:gap-y-0">
        <motion.figure {...revealOnView(reduce, 0)} className="flex flex-col gap-4 2xl:col-start-2 2xl:col-end-7">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface 2xl:h-[75dvh] 2xl:aspect-auto">
            <Image
              src={about.chefImage.src}
              alt={about.chefImage.alt}
              fill
              sizes="(max-width: 1536px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
          <Text as="figcaption" variant="label" tone="accent-60">
            {`/ ${about.chef.name} · ${about.chef.role}`}
          </Text>
        </motion.figure>
        <div className="flex flex-col gap-8 2xl:col-start-8 2xl:col-end-12 2xl:mt-[calc(40dvh+2.5rem)]">
          <motion.div {...revealOnView(reduce, 0.1)}>
            <Text variant="label" tone="muted">
              Chef
            </Text>
          </motion.div>
          <motion.div {...revealOnView(reduce, 0.2)}>
            <Heading as="h2" level="h2">
              {about.chef.name}
            </Heading>
          </motion.div>
          <Stack gap={5}>
            {about.chefBio.map((line, index) => (
              <motion.div key={line} {...revealOnView(reduce, 0.3 + 0.08 * index)}>
                <Text variant="editorial" serif weight="light" leading="normal" tone="faded">
                  {line}
                </Text>
              </motion.div>
            ))}
          </Stack>
        </div>
      </div>
    </Section>
  );
}
