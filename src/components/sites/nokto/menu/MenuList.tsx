"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { EASE_CINEMA } from "../motion";
import { Heading, Section, Stack, Text } from "../ui";
import { menu, type MenuGroup, type MenuGroupId } from "./data";
import { MenuFilter, type MenuFilterOption } from "./MenuFilter";
import { MenuItemRow } from "./MenuItemRow";
import { MenuTabs } from "./MenuTabs";
import { MenuViewSwitcher } from "./MenuViewSwitcher";

const ALL = "all";
const TAB_ID_PREFIX = "menu-list-tab";
const panelId = (id: MenuGroupId) => `menu-list-panel-${id}`;

const groupTabs = menu.groups.map(({ id, label, summary }) => ({ id, label, summary }));

/**
 * One group's category filter and categories. Both groups stay in the HTML (the other one `hidden`), so every dish
 * and price is in the page for search engines and one tab away for visitors; each keeps its own filter.
 */
function MenuGroupPanel({ group, hidden }: { group: MenuGroup; hidden: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(ALL);
  const filters: MenuFilterOption[] = useMemo(
    () => [
      { value: ALL, label: "Tất cả" },
      ...group.categories.map((category) => ({ value: category.name, label: category.short ?? category.name })),
    ],
    [group],
  );
  const categories = useMemo(
    () => (active === ALL ? group.categories : group.categories.filter((category) => category.name === active)),
    [active, group],
  );

  return (
    <div role="tabpanel" id={panelId(group.id)} aria-labelledby={`${TAB_ID_PREFIX}-${group.id}`} hidden={hidden}>
      <div className="border-b border-border-subtle">
        <Stack className="py-5">
          <MenuFilter filters={filters} active={active} onChange={setActive} />
        </Stack>
      </div>

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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Menu header, the two menu groups as tabs, and each group's category filter and list. */
export function MenuList() {
  const reduce = useReducedMotion();
  const [groupId, setGroupId] = useState<MenuGroupId>(menu.groups[0].id);

  const selectGroup = (id: MenuGroupId) => {
    if (id === groupId) return;
    setGroupId(id);
    track("menu_tab_select", { tab: id, mode: "list" });
  };

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
          className="border-t border-border-subtle"
        >
          <MenuTabs label="Chọn menu" tabs={groupTabs} active={groupId} onSelect={selectGroup} idPrefix={TAB_ID_PREFIX} controls={panelId} />
        </motion.div>

        {menu.groups.map((group) => (
          <MenuGroupPanel key={group.id} group={group} hidden={group.id !== groupId} />
        ))}

        <Stack className="py-12">
          <Text variant="body" leading="snug" tone="faded">
            {menu.pairings}
          </Text>
          <Text variant="small" tone="subtle" measure="wide">
            {menu.footnote}
          </Text>
        </Stack>
      </Stack>
    </Section>
  );
}
