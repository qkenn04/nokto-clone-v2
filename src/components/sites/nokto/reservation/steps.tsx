"use client";

import { useId, useSyncExternalStore } from "react";
import { Heading, Stack, Text } from "../ui";
import { reservation, type ReservationStep } from "./content";
import { Checkbox, DateInput, Field, GuestStepper, TextArea, TextInput, TimeSlots } from "./fields";
import {
  formatReservationDate,
  minimumReservationDate,
  type FieldErrors,
  type ReservationData,
  type ReservationField,
} from "./validation";

export type UpdateField = <K extends ReservationField>(field: K, value: ReservationData[K]) => void;

type StepProps = {
  data: ReservationData;
  errors: FieldErrors;
  onUpdate: UpdateField;
};

const { fields, steps } = reservation;
const describedBy = (id: string, error?: string) => (error ? `${id}-error` : undefined);

// The date minimum depends on the visitor's clock, so it is only set after hydration.
const subscribeToNothing = () => () => {};
function useMinimumDate() {
  return useSyncExternalStore(subscribeToNothing, minimumReservationDate, () => undefined);
}

function StepHeader({ step }: { step: ReservationStep }) {
  return (
    <Stack gap={3}>
      <Text variant="label" tone="muted">
        Bước {String(step.number).padStart(2, "0")} · {step.label}
      </Text>
      <Heading as="h2" level="h2">
        {step.title}
      </Heading>
    </Stack>
  );
}

/** Step 1 — date, party size and seating time. */
export function WhenStep({ data, errors, onUpdate }: StepProps) {
  const dateId = useId();
  const timeId = useId();
  const guestsId = useId();
  const minimumDate = useMinimumDate();

  return (
    <Stack gap={10}>
      <StepHeader step={steps[0]} />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field id={dateId} label={fields.date.label} hint={fields.date.hint} error={errors.date}>
          <DateInput
            id={dateId}
            name="date"
            min={minimumDate}
            value={data.date}
            invalid={Boolean(errors.date)}
            aria-describedby={describedBy(dateId, errors.date)}
            onChange={(event) => onUpdate("date", event.target.value)}
          />
        </Field>
        <Field id={guestsId} label={fields.guests.label} hint={fields.guests.hint} error={errors.guests}>
          <GuestStepper
            value={data.guests}
            min={reservation.guests.min}
            max={reservation.guests.max}
            onChange={(value) => onUpdate("guests", value)}
            invalid={Boolean(errors.guests)}
            describedBy={describedBy(guestsId, errors.guests)}
            overflowNote={reservation.guests.overflowNote}
          />
        </Field>
      </div>
      <Stack gap={2}>
        <div className="flex items-baseline justify-between gap-3">
          <span id={`${timeId}-label`} className="type-label text-foreground">
            {fields.time.label}
          </span>
          <Text as="span" variant="label" tone="subtle">
            {fields.time.hint}
          </Text>
        </div>
        <TimeSlots
          times={reservation.availableTimes}
          value={data.time}
          onChange={(value) => onUpdate("time", value)}
          invalid={Boolean(errors.time)}
          labelledBy={`${timeId}-label`}
          describedBy={describedBy(timeId, errors.time)}
        />
        {errors.time ? (
          <Text variant="small" tone="error" leading="tight" id={`${timeId}-error`}>
            {errors.time}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}

/** Step 2 — guest details. */
export function WhoStep({ data, errors, onUpdate }: StepProps) {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const notesId = useId();

  return (
    <Stack gap={10}>
      <StepHeader step={steps[1]} />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field id={firstNameId} label={fields.firstName.label} error={errors.firstName}>
          <TextInput
            id={firstNameId}
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={data.firstName}
            invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy(firstNameId, errors.firstName)}
            onChange={(event) => onUpdate("firstName", event.target.value)}
          />
        </Field>
        <Field id={lastNameId} label={fields.lastName.label} error={errors.lastName}>
          <TextInput
            id={lastNameId}
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={data.lastName}
            invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy(lastNameId, errors.lastName)}
            onChange={(event) => onUpdate("lastName", event.target.value)}
          />
        </Field>
        <Field id={emailId} label={fields.email.label} error={errors.email}>
          <TextInput
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={fields.email.placeholder}
            value={data.email}
            invalid={Boolean(errors.email)}
            aria-describedby={describedBy(emailId, errors.email)}
            onChange={(event) => onUpdate("email", event.target.value)}
          />
        </Field>
        <Field id={phoneId} label={fields.phone.label} hint={fields.phone.hint} error={errors.phone}>
          <TextInput
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={fields.phone.placeholder}
            value={data.phone}
            invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(phoneId, errors.phone)}
            onChange={(event) => onUpdate("phone", event.target.value)}
          />
        </Field>
      </div>
      <Field id={notesId} label={fields.notes.label} hint={fields.notes.hint} error={errors.notes}>
        <TextArea
          id={notesId}
          name="notes"
          rows={4}
          maxLength={reservation.notesMaxLength}
          placeholder={fields.notes.placeholder}
          value={data.notes}
          invalid={Boolean(errors.notes)}
          aria-describedby={describedBy(notesId, errors.notes)}
          onChange={(event) => onUpdate("notes", event.target.value)}
        />
      </Field>
    </Stack>
  );
}

type SummaryRow = { label: string; value: string };

/** "Your reservation" table shown on the review step and the confirmation screen. */
export function ReservationSummary({ data }: { data: ReservationData }) {
  const labels = reservation.summary.fields;
  const name = [data.lastName, data.firstName].filter(Boolean).join(" ");
  const rows: SummaryRow[] = [
    { label: labels.date, value: formatReservationDate(data.date) },
    { label: labels.time, value: data.time || "—" },
    { label: labels.guests, value: `${data.guests} khách` },
    { label: labels.name, value: name || "—" },
    { label: labels.email, value: data.email || "—" },
    { label: labels.phone, value: data.phone || "—" },
  ];
  if (data.notes.trim()) rows.push({ label: labels.notes, value: data.notes });

  return (
    <div className="border border-border-subtle bg-surface/40 backdrop-blur-sm">
      <div className="border-b border-border-subtle px-6 py-4">
        <Text variant="label" tone="muted">
          {reservation.summary.title}
        </Text>
      </div>
      <dl className="flex flex-col divide-y divide-border-subtle">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <Text as="dt" variant="label" tone="muted">
              {row.label}
            </Text>
            <dd className="text-body text-foreground/90 sm:text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Step 3 — summary, cancellation terms and the required policy checkbox. */
export function ConfirmStep({
  data,
  policyError,
  onUpdate,
}: {
  data: ReservationData;
  policyError?: string;
  onUpdate: UpdateField;
}) {
  const policyId = useId();

  return (
    <Stack gap={10}>
      <StepHeader step={steps[2]} />
      <ReservationSummary data={data} />
      <div className="border border-border-subtle bg-surface/30 p-6">
        <Stack gap={4}>
          <Text variant="label" tone="muted">
            {reservation.cancellation.label}
          </Text>
          <Text variant="body" tone="faded" leading="snug">
            {reservation.cancellation.policy}
          </Text>
        </Stack>
      </div>
      <Stack gap={2}>
        <Checkbox
          id={policyId}
          name="policyAccepted"
          checked={data.policyAccepted}
          invalid={Boolean(policyError)}
          aria-describedby={describedBy(policyId, policyError)}
          onChange={(event) => onUpdate("policyAccepted", event.target.checked)}
          label={fields.policy.label}
        />
        {policyError ? (
          <Text variant="small" tone="error" leading="tight" id={`${policyId}-error`}>
            {policyError}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}
