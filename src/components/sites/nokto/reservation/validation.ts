import { reservation } from "./content";

export type ReservationData = {
  date: string;
  time: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  policyAccepted: boolean;
};

export type ReservationField = keyof ReservationData;
export type FieldErrors = Partial<Record<ReservationField, string>>;

export const initialReservation: ReservationData = {
  date: "",
  time: "",
  guests: reservation.guests.initial,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  policyAccepted: false,
};

const { errors } = reservation;
// Same patterns as the source: Zod's email check and a loose phone format.
const EMAIL_PATTERN = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^[+0-9()\-\s.]{6,}$/;

/** Tomorrow in the visitor's local time, as an `<input type="date">` value. */
export function tomorrowIsoDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Step 1: date (from tomorrow), a listed time slot, and 1–8 guests. */
export function validateWhen({ date, time, guests }: ReservationData): FieldErrors {
  const result: FieldErrors = {};
  if (!date) result.date = errors.required;
  else if (date < tomorrowIsoDate()) result.date = errors.dateMin;
  if (!(reservation.availableTimes as readonly string[]).includes(time)) result.time = errors.timeRequired;
  if (!Number.isInteger(guests) || guests < reservation.guests.min || guests > reservation.guests.max) {
    result.guests = errors.guestsRange;
  }
  return result;
}

/** Step 2: names and email are required; phone and notes are optional. */
export function validateWho({ firstName, lastName, email, phone, notes }: ReservationData): FieldErrors {
  const result: FieldErrors = {};
  if (!firstName.trim()) result.firstName = errors.required;
  if (!lastName.trim()) result.lastName = errors.required;
  const trimmedEmail = email.trim();
  if (!trimmedEmail) result.email = errors.required;
  else if (!EMAIL_PATTERN.test(trimmedEmail)) result.email = errors.emailFormat;
  if (phone !== "" && !PHONE_PATTERN.test(phone.trim())) result.phone = errors.phoneFormat;
  if (notes.length > reservation.notesMaxLength) result.notes = errors.notesLength;
  return result;
}

/** Step 3: the cancellation policy must be accepted. */
export function validateConfirm({ policyAccepted }: ReservationData): FieldErrors {
  return policyAccepted ? {} : { policyAccepted: errors.policy };
}

export function hasErrors(fieldErrors: FieldErrors) {
  return Object.values(fieldErrors).some((message) => Boolean(message));
}

/** Long British date for the summary, e.g. "Monday, 12 October 2026". */
export function formatReservationDate(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
