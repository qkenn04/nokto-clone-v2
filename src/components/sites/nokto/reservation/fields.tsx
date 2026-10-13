"use client";

import { Check, CircleAlert, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { EASE_CINEMA } from "../motion";
import { Stack, Text } from "../ui";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const lineInputClass = `w-full border-b border-border bg-transparent px-0 py-3 text-body text-foreground transition-colors duration-[var(--duration-fast)]`;
const inputStates = `focus:border-foreground focus:outline-none ${focusRing} disabled:cursor-not-allowed disabled:opacity-50 data-[error=true]:border-error data-[error=true]:focus:border-error`;

/** Error line used under fields: alert icon and a small red message. */
export function ErrorMessage({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Stack direction="row" align="center" gap={1} id={id}>
      <CircleAlert aria-hidden className="h-3 w-3 shrink-0 text-error" strokeWidth={1.5} />
      <Text as="span" variant="small" tone="error" leading="tight">
        {children}
      </Text>
    </Stack>
  );
}

/** Label row (label left, optional hint right), the control, and an animated error message. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: -4 };

  return (
    <Stack gap={2}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="type-label text-foreground">
          {label}
        </label>
        {hint ? (
          <div className="text-right">
            <Text as="span" variant="label" tone="subtle">
              {hint}
            </Text>
          </div>
        ) : null}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            id={`${id}-error`}
            role="alert"
            initial={hidden}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={hidden}
            transition={{ duration: 0.25, ease: EASE_CINEMA }}
          >
            <ErrorMessage>{error}</ErrorMessage>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Stack>
  );
}

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "className"> & { invalid?: boolean };

/** Underlined text input. */
export function TextInput({ invalid = false, ...rest }: InputProps) {
  return (
    <input
      data-error={invalid ? "true" : undefined}
      aria-invalid={invalid || undefined}
      className={`${lineInputClass} placeholder:text-subtle ${inputStates}`}
      {...rest}
    />
  );
}

/** Underlined native date picker, dark colour scheme. */
export function DateInput({ invalid = false, ...rest }: Omit<InputProps, "type">) {
  return (
    <input
      type="date"
      data-error={invalid ? "true" : undefined}
      aria-invalid={invalid || undefined}
      className={`${lineInputClass} [color-scheme:dark] ${inputStates}`}
      {...rest}
    />
  );
}

/** Boxed, non-resizable textarea. */
export function TextArea({
  invalid = false,
  ...rest
}: Omit<ComponentPropsWithoutRef<"textarea">, "className"> & { invalid?: boolean }) {
  return (
    <textarea
      data-error={invalid ? "true" : undefined}
      aria-invalid={invalid || undefined}
      className={`w-full resize-none border border-border bg-transparent px-4 py-3 text-body text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-subtle ${inputStates}`}
      {...rest}
    />
  );
}

/** Square checkbox with an accent fill; the native input stays in the DOM for forms and focus. */
export function Checkbox({
  id,
  label,
  checked,
  invalid = false,
  ...rest
}: Omit<ComponentPropsWithoutRef<"input">, "className" | "type"> & {
  id: string;
  label: ReactNode;
  checked: boolean;
  invalid?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-start gap-3 text-small leading-relaxed text-foreground/85"
    >
      <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          data-checked={checked ? "true" : "false"}
          data-error={invalid ? "true" : undefined}
          aria-invalid={invalid || undefined}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden
          className="block h-4 w-4 border border-border transition-colors duration-[var(--duration-fast)] group-hover:border-foreground/60 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-data-[error=true]:border-error"
        />
        <Check
          aria-hidden
          strokeWidth={2}
          className={`absolute h-3 w-3 text-accent-foreground transition-opacity duration-[var(--duration-fast)] ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <span>{label}</span>
    </label>
  );
}

const stepperButtonClass = `flex h-12 w-12 items-center justify-center text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-surface ${focusRing} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`;

/** Minus / count / plus stepper. Arrow keys also adjust the count; a note appears at the maximum. */
export function GuestStepper({
  value,
  min,
  max,
  onChange,
  invalid = false,
  describedBy,
  overflowNote,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  invalid?: boolean;
  describedBy?: string;
  overflowNote?: string;
}) {
  const atMin = value <= min;
  const atMax = value >= max;
  const count = Math.max(min, Math.min(max, value));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      if (atMax) return;
      event.preventDefault();
      onChange(Math.min(max, count + 1));
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      if (atMin) return;
      event.preventDefault();
      onChange(Math.max(min, count - 1));
    }
  };

  return (
    <Stack gap={3}>
      <div
        role="group"
        aria-label="Số khách"
        aria-describedby={describedBy}
        onKeyDown={onKeyDown}
        className={`inline-flex items-stretch border ${invalid ? "border-error" : "border-border"}`}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, count - 1))}
          disabled={atMin}
          aria-label="Giảm số khách"
          className={stepperButtonClass}
        >
          <Minus aria-hidden strokeWidth={1.5} className="h-4 w-4" />
        </button>
        <span
          aria-live="polite"
          className="flex min-w-[4rem] items-center justify-center border-x border-border px-4 text-body text-foreground tabular-nums"
        >
          {count}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, count + 1))}
          disabled={atMax}
          aria-label="Tăng số khách"
          className={stepperButtonClass}
        >
          <Plus aria-hidden strokeWidth={1.5} className="h-4 w-4" />
        </button>
      </div>
      {atMax && overflowNote ? (
        <Text variant="small" tone="muted">
          {overflowNote}
        </Text>
      ) : null}
    </Stack>
  );
}

/** Time slots as a radio group with roving focus (arrows, Home, End select as they move). */
export function TimeSlots({
  times,
  value,
  onChange,
  invalid = false,
  labelledBy,
  describedBy,
}: {
  times: readonly string[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  labelledBy?: string;
  describedBy?: string;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const tabStop = Math.max(0, times.indexOf(value));

  const moveTo = useCallback(
    (index: number) => {
      const next = (index + times.length) % times.length;
      buttons.current[next]?.focus();
      onChange(times[next]);
    },
    [onChange, times],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const targets: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: times.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    moveTo(targets[event.key]);
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      data-error={invalid ? "true" : undefined}
      className="grid grid-cols-3 gap-2 sm:grid-cols-4"
    >
      {times.map((time, index) => {
        const selected = time === value;
        return (
          <button
            key={time}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={index === tabStop ? 0 : -1}
            data-selected={selected ? "true" : "false"}
            onClick={() => onChange(time)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`border px-3 py-3 text-small tracking-[var(--tracking-label)] uppercase transition-colors duration-[var(--duration-fast)] ${focusRing} data-[selected=true]:border-accent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=false]:border-border data-[selected=false]:text-foreground/85 data-[selected=false]:hover:border-foreground`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}
