import { siteImage } from "../site";

// Reservation copy and booking rules observed on https://nokto-template.vercel.app/reservation.

export type StepNumber = 1 | 2 | 3;

export type ReservationStep = {
  number: StepNumber;
  label: string;
  title: string;
};

type SuccessCta = { label: string; variant: "ghost" } | { label: string; variant: "link"; href: string };

export const reservation = {
  metadata: {
    title: "Reserve a Table",
    description: "Book your seat at NOKTO omakase counter in Warsaw. Two seatings nightly, Tuesday through Saturday.",
  },
  hero: {
    label: "RESERVATIONS",
    headline: ["Reserve", "a seat."],
    intro:
      "Eighteen seats. Two seatings a night. Choose your evening — we'll hold the counter until your name is on it.",
    scrollCta: "Make a reservation",
    policy: ["15-minute grace hold", "Up to 8 guests per booking", "48-hour cancellation"],
  },
  image: {
    src: siteImage("hero-reservations.jpg"),
    alt: "The omakase counter at rest, one place setting lit by an overhead pendant",
  },
  availableTimes: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  guests: {
    min: 1,
    max: 8,
    initial: 2,
    overflowNote: "For parties of 9 or more, please call the counter directly.",
  },
  notesMaxLength: 500,
  steps: [
    { number: 1, label: "When", title: "Choose your evening." },
    { number: 2, label: "Who", title: "Tell us who's coming." },
    { number: 3, label: "Confirm", title: "Review and confirm." },
  ] satisfies ReservationStep[],
  errors: {
    required: "This field is required.",
    emailFormat: "Please enter a valid email address.",
    phoneFormat: "Please enter a valid phone number.",
    dateMin: "Reservations must be made at least one day in advance.",
    timeRequired: "Choose a time slot.",
    guestsRange: "Between 1 and 8 guests.",
    notesLength: "Notes can be up to 500 characters.",
    policy: "Please accept the cancellation policy to continue.",
  },
  fields: {
    date: { label: "Date", hint: "From tomorrow" },
    time: { label: "Time", hint: "Tue – Sat" },
    guests: { label: "Guests", hint: "1 – 8" },
    firstName: { label: "First name" },
    lastName: { label: "Last name" },
    email: { label: "Email", placeholder: "name@example.com" },
    phone: { label: "Phone", placeholder: "Optional", hint: "Optional" },
    notes: {
      label: "Notes for the chef",
      placeholder: "Allergies, occasions, dietary requests…",
      hint: "Optional, up to 500 characters",
    },
    policy: {
      label: "I understand the 48-hour cancellation policy and authorize a holding card at booking.",
    },
  },
  actions: {
    next: "Continue",
    back: "Back",
    submit: "Confirm reservation",
    submitting: "Confirming…",
  },
  summary: {
    title: "Your reservation",
    fields: {
      date: "Date",
      time: "Time",
      guests: "Guests",
      name: "Name",
      email: "Email",
      phone: "Phone",
      notes: "Notes",
    },
  },
  cancellation: {
    label: "Cancellation",
    policy:
      "A holding card is required at booking. Cancellations within 48 hours of the seating are charged in full — the counter cannot be resold quickly.",
  },
  success: {
    label: "CONFIRMED",
    title: "The counter is yours.",
    subtitle:
      "We've sent a confirmation to {email}. A holding card will be charged at booking; the balance is settled at the end of service.",
    ctas: [
      { label: "Make another reservation", variant: "ghost" },
      { label: "Back to home →", variant: "link", href: "/" },
    ] satisfies SuccessCta[],
    demoNote: "Demo — no reservation was sent.",
  },
} as const;
