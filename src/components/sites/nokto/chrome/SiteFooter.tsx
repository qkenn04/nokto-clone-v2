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
    <footer className="section-pad section-pad-y-sm relative flex w-full flex-col gap-4 border-t border-border-subtle lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <InfoItem label="Giờ mở cửa" value={site.hours.display} />
      <InfoItem label="Địa chỉ" value={site.address.display} />
      <InfoItem label="Hotline đặt bàn" value={site.phone} href={site.phoneHref} tracking={trackAttrs("contact_click", { method: "phone", location: "footer" })} />
      <InfoItem label="Facebook" value={site.social} href={site.socialHref} tracking={trackAttrs("contact_click", { method: "facebook", location: "footer" })} />
    </footer>
  );
}
