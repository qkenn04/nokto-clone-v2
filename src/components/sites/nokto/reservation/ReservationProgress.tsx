import Image from "next/image";
import { siteImage } from "../site";
import { Stack, Text } from "../ui";
import { reservation, type StepNumber } from "./content";

type StepState = "upcoming" | "active" | "complete";

// The three labels sit under the brush stroke's dots (left, 52.05% and right).
const positions = [
  "left-0 items-start text-left",
  "left-[52.05%] -translate-x-1/2 items-center text-center",
  "right-0 items-end text-right",
];
const numberTone: Record<StepState, string> = { upcoming: "text-subtle", active: "text-accent", complete: "text-muted" };
const labelTone: Record<StepState, string> = { upcoming: "text-subtle", active: "text-foreground", complete: "text-muted" };

function stepState(step: StepNumber, current: StepNumber): StepState {
  if (current > step) return "complete";
  return current === step ? "active" : "upcoming";
}

/** "Progress" aside: hand-drawn path with three dots and the step labels beneath. */
export function ReservationProgress({ current }: { current: StepNumber }) {
  return (
    <aside aria-label="Các bước chuẩn bị">
      <Stack gap={4}>
        <Text variant="label" tone="muted">
          Các bước
        </Text>
        <div role="group" aria-label="Tiến trình" className="w-full">
          <div className="w-full max-w-md">
            <div aria-hidden className="pointer-events-none relative aspect-[303/10] w-full">
              <Image
                src={siteImage("path-horizontal.svg")}
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 28rem"
                className="object-contain"
              />
            </div>
            <ol className="relative mt-5 h-12 w-full">
              {reservation.steps.map((step, index) => {
                const state = stepState(step.number, current);
                return (
                  <li
                    key={step.number}
                    aria-current={state === "active" ? "step" : undefined}
                    className={`absolute top-0 flex flex-col gap-1 ${positions[index]}`}
                  >
                    <span className={`type-label transition-colors duration-[var(--duration-fast)] ${numberTone[state]}`}>
                      {String(step.number).padStart(2, "0")}
                    </span>
                    <span className={`type-label ${labelTone[state]}`}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Stack>
    </aside>
  );
}
