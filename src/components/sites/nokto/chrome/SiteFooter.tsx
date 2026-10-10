import { site } from "../site";
import { Stack, Text } from "../ui";

/** Label over value, used in the footer and the navigation overlay. */
export function InfoItem({ label, value, align = "left" }: { label: string; value: string; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <Stack gap={1}>
        <Text variant="label" tone="muted">
          {label}
        </Text>
        <Text variant="small" tone="faded">
          {value}
        </Text>
      </Stack>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="section-pad section-pad-y-sm relative flex w-full flex-col gap-4 border-t border-border-subtle lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <InfoItem label="Hours" value={site.hours.display} />
      <InfoItem label="Address" value={site.address.display} />
      <InfoItem label="Social" value={site.social} />
      <div className="hidden lg:block">
        <InfoItem label="Est." value={site.footer} align="right" />
      </div>
    </footer>
  );
}
