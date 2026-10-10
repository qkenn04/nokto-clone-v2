// Site-wide content observed on https://nokto-template.vercel.app/.
export const ASSET_BASE = "/sites/nokto";

export const site = {
  name: "NOKTO",
  location: "Warsaw",
  rootTitle: "NOKTO — Next.js Restaurant Website Template",
  rootDescription:
    "An eighteen-seat omakase counter in Warsaw. One chef. One seasonal menu. Two seatings a night, Tuesday through Saturday.",
  rootOgDescription: "Dine in the half-light. Eighteen seats. Two seatings a night.",
  schemaDescription: "An eighteen-seat omakase counter in Warsaw. Two seatings a night, Tuesday through Saturday.",
  label: "RESTAURANT — WARSAW",
  tagline: "Warsaw Omakase Counter",
  nav: [
    { label: "Menu", href: "/menu", image: `${ASSET_BASE}/images/menu.svg`, imageWidth: 228, imageHeight: 231 },
    { label: "About", href: "/about", image: `${ASSET_BASE}/images/about.svg`, imageWidth: 228, imageHeight: 226 },
    {
      label: "Reservations",
      href: "/reservation",
      image: `${ASSET_BASE}/images/reservations.svg`,
      imageWidth: 194,
      imageHeight: 226,
    },
  ],
  cta: { label: "Reserve a table", href: "/reservation" },
  hours: {
    days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "18:00",
    closes: "23:30",
    display: "Tue – Sat · Seatings at 18:00 & 21:00",
  },
  address: { street: "Próżna 12", city: "Warsaw", country: "PL", display: "Próżna 12 · Warsaw" },
  phone: "+48 22 555 0123",
  email: "privacy@nokto.example",
  social: "Instagram @nokto.warsaw",
  footer: "NOKTO · Warsaw · Est. 2021",
  cuisine: "Japanese",
  priceRange: "$$$$",
  currency: { symbol: "PLN", position: "after" },
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;

export function siteImage(file: string) {
  return `${ASSET_BASE}/images/${file}`;
}
