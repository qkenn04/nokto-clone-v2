import { BookOpen, List } from "lucide-react";
import Link from "next/link";
import { cx } from "../ui";

const views = [
  { value: "book", label: "Lật sách", href: "/menu", icon: BookOpen },
  { value: "list", label: "Danh sách", href: "/menu/list", icon: List },
] as const;

/** Both menus belong to the same site and remain one click apart. */
export function MenuViewSwitcher({ active }: { active: "list" | "book" }) {
  return (
    <nav aria-label="Phiên bản thực đơn" className="inline-flex max-w-full self-start gap-1 border border-border bg-background/60 p-1">
      {views.map(({ value, label, href, icon: Icon }) => (
        <Link
          key={value}
          href={href}
          aria-current={active === value ? "page" : undefined}
          className={cx(
            "inline-flex min-h-11 items-center justify-center gap-2 px-3 text-small font-semibold transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:px-4",
            active === value ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface hover:text-foreground",
          )}
        >
          <Icon aria-hidden size={16} strokeWidth={1.5} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
