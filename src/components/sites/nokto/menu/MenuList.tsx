"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { EASE_CINEMA } from "../motion";
import { Heading, Section, Stack, Text } from "../ui";
import { menu } from "./data";
import { MenuFilter, type MenuFilterOption } from "./MenuFilter";
import { MenuItemRow } from "./MenuItemRow";
import { MenuViewSwitcher } from "./MenuViewSwitcher";

const ALL = "all";

const filters: MenuFilterOption[] = [
  { value: ALL, label: "Tất cả" },
  ...menu.categories.map((category) => ({ value: category.name, label: category.name })),
];

/** Menu header, category filter, and the filtered category list. */
export function MenuList() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(ALL);
  const categories = useMemo(
    () => (active === ALL ? menu.categories : menu.categories.filter((category) => category.name === active)),
    [active],
  );

  return (
    <Section as="div" padY="none">
      <Stack className="pt-32 sm:pt-40 md:pt-44 lg:pt-48 xl:pt-52">
        <motion.header
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_CINEMA }}
        >
          <Stack gap={6} className="pb-12">
            <Text variant="label" tone="muted">
              {menu.label}
            </Text>
            <Heading as="h1" level="h1">
              {menu.headline}
            </Heading>
            <Text variant="editorial" tone="muted" measure="comfort">
              {menu.editorial}
            </Text>
            <MenuViewSwitcher active="list" />
          </Stack>
        </motion.header>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_CINEMA }}
          className="border-y border-border-subtle"
        >
          <Stack className="py-5">
            <MenuFilter filters={filters} active={active} onChange={setActive} />
          </Stack>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_CINEMA }}
            className="flex flex-col"
          >
            {categories.map((category) => (
              <section key={category.name} className="border-b border-border-subtle last:border-b-0">
                <Stack gap={8} className="py-12 lg:py-16">
                  <Stack gap={3}>
                    <Heading as="h2" level="category" family="display">
                      {category.name}
                    </Heading>
                    {category.tagline ? (
                      <Text variant="body" tone="muted" leading="snug" measure="comfort">
                        {category.tagline}
                      </Text>
                    ) : null}
                  </Stack>
                  {category.items.length > 0 ? (
                    <ul className="flex flex-col divide-y divide-border-subtle">
                      {category.items.map((item) => (
                        <MenuItemRow key={`${category.name}-${item.name}`} item={item} />
                      ))}
                    </ul>
                  ) : (
                    <Text variant="body" tone="muted" leading="snug">
                      Chưa có món trong nhóm này.
                    </Text>
                  )}
                </Stack>
              </section>
            ))}
            <Stack className="py-12">
              <Text variant="body" leading="snug" tone="faded">
                {menu.pairings}
              </Text>
              <Text variant="small" tone="subtle" measure="wide">
                {menu.footnote}
              </Text>
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Stack>
    </Section>
  );
}
