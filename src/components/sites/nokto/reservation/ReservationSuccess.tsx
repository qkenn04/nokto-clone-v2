import Image from "next/image";
import { siteImage } from "../site";
import { ButtonLink, Heading, Stack, Text, buttonClass } from "../ui";
import { reservation } from "./content";
import { ReservationSummary } from "./steps";
import type { ReservationData } from "./validation";

/** Local summary with phone and Facebook actions to confirm with the restaurant. */
export function ReservationSuccess({ data, onReset }: { data: ReservationData; onReset: () => void }) {
  const { success } = reservation;

  return (
    <Stack gap={12}>
      <Stack gap={6}>
        <div aria-hidden className="relative h-12 w-12">
          <Image src={siteImage("check.svg")} alt="" fill sizes="3rem" className="object-contain" />
        </div>
        <Text variant="label" tone="muted">
          {success.label}
        </Text>
        <Heading as="h2" level="h1">
          {success.title}
        </Heading>
        <Text variant="editorial" leading="snug" tone="faded" measure="wide">
          {success.subtitle}
        </Text>
      </Stack>
      <ReservationSummary data={data} />
      <Stack gap={4}>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
          {success.ctas.map((cta) =>
            cta.variant !== "ghost" ? (
              <ButtonLink key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
              </ButtonLink>
            ) : (
              <button key={cta.label} type="button" onClick={onReset} className={buttonClass(cta.variant)}>
                {cta.label}
              </button>
            ),
          )}
        </div>
        <Text variant="label" tone="subtle">
          {success.demoNote}
        </Text>
      </Stack>
    </Stack>
  );
}
