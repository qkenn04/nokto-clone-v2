import { cx } from "../ui";

export type MenuFilterOption = { value: string; label: string };

const buttonBase =
  "relative inline-flex pb-1 text-small uppercase tracking-[var(--tracking-label)] transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-accent after:origin-left after:transition-transform after:duration-500 after:ease-cinema";

/** Category toggles; the active one is accent-coloured with a drawn-in underline. */
export function MenuFilter({
  filters,
  active,
  onChange,
}: {
  filters: MenuFilterOption[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <nav aria-label="Filter menu categories">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
        {filters.map((filter) => {
          const pressed = filter.value === active;
          return (
            <li key={filter.value}>
              <button
                type="button"
                onClick={() => onChange(filter.value)}
                aria-pressed={pressed}
                className={cx(
                  buttonBase,
                  pressed ? "text-accent after:scale-x-100" : "text-muted hover:text-foreground after:scale-x-0",
                )}
              >
                {filter.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
