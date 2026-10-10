import { site, siteImage } from "../site";

export type AboutImage = { src: string; alt: string };
export type GalleryItem = AboutImage & { caption: string };
export type AboutNumber = { value: number; label: string };

// About page copy observed on https://nokto-template.vercel.app/about.
export const about = {
  chapter: "PHILOSOPHY · CHAPTER ONE",
  headline: ["The knife", "moves once."],
  editorial: "Everything before that moment is preparation. Everything after is service.",
  body: [
    `We opened ${site.name} in 2021 with a single conviction: that a meal can be quiet, and still be the loudest thing you remember from a season.`,
    "The fish arrives twice a week from Toyosu. The rice is polished in-house. The counter seats eighteen — never more, never differently.",
    "There is no music after the first course. The room listens with you.",
  ],
  chef: { name: "Haruki Tanaka", role: "Chef" },
  chefImage: { src: siteImage("chef.jpg"), alt: "Chef Haruki Tanaka at the counter" } satisfies AboutImage,
  heroImage: { src: siteImage("hero-about.jpg"), alt: "The omakase counter in low evening light" } satisfies AboutImage,
  chefBio: [
    `Haruki spent twelve years at counters in Tokyo and Kyoto before opening ${site.name}.`,
    "He does not speak during service. He nods. The rest is in the rice.",
  ],
  quote: {
    text: "A meal is not what you serve. It is what the room remembers when everyone has gone home.",
    attribution: "— Chef Haruki Tanaka",
  },
  gallery: [
    { src: siteImage("counter.jpg"), alt: "The omakase counter at rest", caption: "/ the counter" },
    { src: siteImage("first-course.jpg"), alt: "First course of the evening", caption: "/ first course" },
    { src: siteImage("omakase.jpg"), alt: "Omakase service, evening", caption: "/ omakase, evening" },
  ] satisfies GalleryItem[],
  numbers: [
    { value: 18, label: "/ seats at the counter" },
    { value: 2, label: "/ deliveries from toyosu" },
    { value: 0, label: "/ substitutions, ever" },
  ] satisfies AboutNumber[],
  closing: {
    headline: "Eighteen seats. One service. Six nights a week.",
    note: "Reservations open the first of each month.",
    cta: { label: "Reserve a seat →", href: "/reservation" },
  },
} as const;
