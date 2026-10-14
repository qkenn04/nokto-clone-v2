import { useRef, type KeyboardEvent } from "react";
import { cx } from "../ui";

export type MenuTab<T extends string> = { id: T; label: string; summary?: string };

const tabBase =
  "relative flex min-h-14 min-w-0 flex-1 flex-col items-start justify-center gap-1 py-3 pr-3 text-left transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent after:content-[''] after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-accent after:origin-left after:transition-transform after:duration-500 after:ease-cinema motion-reduce:after:transition-none";

/**
 * The menu's groups as tabs (WAI-ARIA tabs with automatic activation): one tab stop, the arrow keys move and select,
 * Home and End jump to the first and last tab. Shared by the flip book (/menu) and the list (/menu/list).
 */
export function MenuTabs<T extends string>({
  tabs,
  active,
  onSelect,
  label,
  idPrefix,
  controls,
}: {
  tabs: readonly MenuTab<T>[];
  active: T;
  onSelect: (id: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Each tab's id is `${idPrefix}-${tab.id}`; panels point back to it with aria-labelledby. */
  idPrefix: string;
  /** Id of the panel a tab shows. */
  controls: (id: T) => string;
}) {
  const buttons = useRef(new Map<T, HTMLButtonElement>());

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = tabs.findIndex((tab) => tab.id === active);
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (current + 1) % tabs.length
      : event.key === "ArrowLeft" ? (current - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    const tab = tabs[next];
    onSelect(tab.id);
    buttons.current.get(tab.id)?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="flex border-b border-border" onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) buttons.current.set(tab.id, node);
              return () => {
                buttons.current.delete(tab.id);
              };
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-${tab.id}`}
            aria-selected={selected}
            aria-controls={controls(tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            className={cx(tabBase, selected ? "text-accent after:scale-x-100" : "text-muted hover:text-foreground after:scale-x-0")}
          >
            <span className="text-small font-semibold uppercase tracking-[var(--tracking-label)]">{tab.label}</span>
            {tab.summary ? <span className="text-[0.6875rem] leading-snug text-muted">{tab.summary}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
