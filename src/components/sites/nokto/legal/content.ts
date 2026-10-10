import type { Metadata } from "next";
import { site } from "../site";

export type LegalSection = {
  title: string;
  body: string;
};

export type LegalDocument = {
  path: "/terms" | "/privacy";
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  image: { file: string; alt: string };
  sections: readonly LegalSection[];
};

// Sample legal copy from the source template, reproduced verbatim.
export const terms: LegalDocument = {
  path: "/terms",
  eyebrow: "LEGAL · TERMS",
  title: "Terms & Conditions",
  description: "Reservation terms, cancellation policy, and conditions of service at NOKTO.",
  updated: "1 January 2026",
  intro:
    "These Terms & Conditions govern reservations and dining at NOKTO, an eighteen-seat omakase counter in Warsaw. By making a reservation, you agree to the terms below.",
  image: { file: "terms.jpg", alt: "A folded napkin and menu card on the counter" },
  sections: [
    {
      title: "Reservations & deposits",
      body: "Seats are confirmed only after a deposit per cover is charged to the card on file. The deposit is applied to your final bill on the night of your seating. Walk-ins are accepted only if seats remain after confirmed bookings.",
    },
    {
      title: "Cancellation policy",
      body: "Cancellations made more than 48 hours before your seating are refunded in full. Cancellations made within 48 hours, or no-shows, forfeit the deposit. To cancel or amend a booking, reply to your confirmation email or call us directly.",
    },
    {
      title: "Late arrival",
      body: "We hold reserved seats for 15 minutes past the booked time. After that, the chef begins service and your seat may be released to a waitlisted guest. Late arrivals are still charged the full deposit and may be served a shortened menu at the team's discretion.",
    },
    {
      title: "Group size",
      body: "Each booking is limited to eight guests. Larger parties and private buyouts of the full counter are arranged directly — contact us by email or phone and we will quote a minimum spend.",
    },
    {
      title: "Dietary requirements & allergens",
      body: "Tell us about allergies, intolerances, or strong aversions at the time of booking. The chef will adapt the menu where possible but does not offer ingredient substitutions. We are unable to accommodate fully vegan diets at the counter.",
    },
    {
      title: "Children",
      body: "Guests under twelve are not seated at the counter. The omakase format requires sustained attention and an unhurried pace, and the experience is built around an adult audience.",
    },
    {
      title: "Service & gratuity",
      body: "All listed prices include 23% VAT. A 10% service charge is added to the final bill and shared with the entire team. Additional gratuity is at your discretion and goes directly to the staff.",
    },
    {
      title: "Photography & conduct",
      body: "Discreet photography of your own plates is welcome — please keep flash off and phones away from the counter during service. We reserve the right to refuse service to anyone whose conduct disturbs other guests or the chef, including guests who arrive intoxicated.",
    },
    {
      title: "Liability & lost property",
      body: "NOKTO is not liable for damage to or loss of personal property left on the premises, including coats, bags, and electronics in the cloakroom. Lost items are held for thirty days — please contact us within that window.",
    },
    {
      title: "Governing law",
      body: "These terms are governed by the laws of Poland. Any dispute arising under or in connection with these terms will be resolved by the courts of Warsaw.",
    },
  ],
};

export const privacy: LegalDocument = {
  path: "/privacy",
  eyebrow: "LEGAL · PRIVACY",
  title: "Privacy Policy",
  description: "How NOKTO collects, stores, and processes guest data.",
  updated: "1 January 2026",
  intro:
    "This Privacy Policy explains how NOKTO collects, uses, and protects personal data submitted through reservations on this website. We act as the data controller under the EU General Data Protection Regulation (GDPR).",
  image: { file: "privacy.jpg", alt: "The low-lit room before evening service" },
  sections: [
    {
      title: "Data controller",
      body: "The data controller is NOKTO, with its registered address at Próżna 12, Warsaw, Poland. For any data-related enquiry, write to privacy@nokto.example.",
    },
    {
      title: "What we collect",
      body: "When you book a reservation we collect: your first and last name, email address, phone number (optional), the date and time of your booking, the number of guests, and any notes you choose to share with the chef. We do not collect payment information on our site — deposits are processed by our payment provider, who handles card data under PCI-DSS.",
    },
    {
      title: "How we use your data",
      body: "Reservation data is used to confirm your booking, send a confirmation email, prepare the counter for your visit, and contact you if details change. Notes are read by the kitchen team so they can accommodate allergies and dietary requests. We do not use your data for marketing without your explicit consent.",
    },
    {
      title: "Legal basis",
      body: "We process your data on the basis of contract performance under GDPR Art. 6(1)(b) — necessary to deliver the reservation you requested — and our legitimate interest in operating the restaurant under Art. 6(1)(f).",
    },
    {
      title: "Third parties",
      body: "We share data only with service providers that help us deliver the reservation: Resend (resend.com) sends the confirmation email; Vercel (vercel.com) hosts the website and processes form submissions. Both providers are bound by GDPR-compliant data processing agreements. We do not sell, rent, or share your data with marketing companies.",
    },
    {
      title: "Retention",
      body: "Reservation records are kept for 24 months from the booking date, after which they are deleted. Confirmation emails sent through Resend are retained according to Resend's policy. Server access logs are retained for 30 days for security and debugging.",
    },
    {
      title: "Your rights",
      body: "Under GDPR you have the right to access your data, correct it, request deletion, restrict processing, object to processing, or receive a copy in a portable format. To exercise any of these rights, email privacy@nokto.example — we respond within 30 days. You also have the right to lodge a complaint with the Polish Data Protection Authority (UODO).",
    },
    {
      title: "Cookies & analytics",
      body: "This site uses Vercel Analytics, which collects anonymous traffic data (referrer, page views, country) without using cookies or storing IP addresses. We use one session-only browser flag (sessionStorage) to remember whether you have seen the preloader animation in this tab — it is removed when you close the browser.",
    },
    {
      title: "Security",
      body: "Data is transmitted over HTTPS. Access to reservation records is restricted to the floor manager and the chef. We follow industry-standard practices to protect against unauthorised access, accidental loss, and misuse.",
    },
    {
      title: "Updates",
      body: "We may update this policy occasionally. The last-updated date at the top of the page reflects the most recent revision. Material changes — for example, adding a new third-party processor — will be flagged in the next confirmation email you receive.",
    },
  ],
};

/**
 * Route metadata as served by the source: the document title goes through the root template,
 * while Open Graph spells out the full title because the root `openGraph.title` has no template.
 */
export function legalMetadata(content: LegalDocument): Metadata {
  const fullTitle = `${content.title} — ${site.name} ${site.location}`;
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: content.path },
    openGraph: { title: fullTitle, description: content.description, url: content.path, type: "website" },
  };
}
