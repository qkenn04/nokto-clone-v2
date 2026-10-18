import Link from "next/link";
import { trackAttrs, type TrackAttrs } from "@/lib/analytics";
import { site } from "../site";
import { Stack, Text } from "../ui";

/** Shared business detail in the footer and navigation. */
export function InfoItem({ label, value, href, align = "left", tracking }: {
  label: string;
  value: string;
  href?: string;
  align?: "left" | "right";
  /** `data-track*` attributes for the link (src/lib/analytics.ts). */
  tracking?: TrackAttrs;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <Stack gap={1}>
        <Text variant="label" tone="muted">{label}</Text>
        <Text variant="small" tone="faded">
          {href ? <a href={href} {...tracking} className="hover:text-accent focus-visible:outline focus-visible:outline-accent">{value}</a> : value}
        </Text>
      </Stack>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="section-pad section-pad-y-sm relative flex w-full flex-col gap-6 border-t border-border-subtle pb-[calc(9rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <InfoItem label="Giờ mở cửa" value={site.hours.display} />
        <InfoItem label="Địa chỉ" value={site.address.display} />
        <InfoItem label="Hotline đặt bàn" value={site.phone} href={site.phoneHref} tracking={trackAttrs("contact_click", { method: "phone", location: "footer" })} />
        <InfoItem label="Facebook" value={site.social} href={site.socialHref} tracking={trackAttrs("contact_click", { method: "facebook", location: "footer" })} />
      </div>
      <nav aria-label="Các trang trong website">
        <ul className="flex flex-wrap items-center gap-x-8">
          {site.footerNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="type-label inline-flex min-h-11 items-center text-muted transition-colors duration-[var(--duration-fast)] hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
