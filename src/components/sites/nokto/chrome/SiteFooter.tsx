import Link from "next/link";
import { trackAttrs, type TrackAttrs } from "@/lib/analytics";
import { site } from "../site";
import { Stack, Text } from "../ui";

const infoLinkClassName = "hover:text-accent focus-visible:outline focus-visible:outline-accent";

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
          {href ? <a href={href} {...tracking} className={infoLinkClassName}>{value}</a> : value}
        </Text>
      </Stack>
    </div>
  );
}

type InfoLink = { label: string; href: string; tracking: TrackAttrs };

function InfoLinks({ label, links }: { label: string; links: readonly InfoLink[] }) {
  return (
    <div className="text-left">
      <Stack gap={1}>
        <Text variant="label" tone="muted">{label}</Text>
        <Text as="ul" variant="small" tone="faded" className="flex flex-wrap gap-x-6 gap-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} {...link.tracking} className={infoLinkClassName}>{link.label}</a>
            </li>
          ))}
        </Text>
      </Stack>
    </div>
  );
}

const socialLinks: readonly InfoLink[] = [
  { label: "Facebook", href: site.socialHref, tracking: trackAttrs("contact_click", { method: "facebook", location: "footer" }) },
  { label: "Instagram", href: site.profiles.instagram, tracking: trackAttrs("social_click", { network: "instagram" }) },
  { label: "TikTok", href: site.profiles.tiktok, tracking: trackAttrs("social_click", { network: "tiktok" }) },
];

export function SiteFooter() {
  return (
    <footer className="section-pad section-pad-y-sm relative flex w-full flex-col gap-6 border-t border-border-subtle pb-[calc(9rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <InfoItem label="Giờ mở cửa" value={site.hours.display} />
        <InfoItem label="Địa chỉ" value={site.address.display} />
        <InfoItem label="Hotline đặt bàn" value={site.phone} href={site.phoneHref} tracking={trackAttrs("contact_click", { method: "phone", location: "footer" })} />
        <InfoLinks label="Mạng xã hội" links={socialLinks} />
      </div>
      <nav aria-label="Các trang trong website">
        <ul className="flex flex-wrap items-center gap-x-8">
          {site.footerNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                {...(item.href === site.cta.href ? trackAttrs("booking_cta_click", { location: "footer" }) : {})}
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
