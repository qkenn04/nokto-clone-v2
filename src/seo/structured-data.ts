import { pendingFacts, site } from "@/components/sites/nokto/site";
import { galleryPhotos, homeEvents } from "@/components/sites/the-hot/home/content";
import type { HomeEvent } from "@/components/sites/the-hot/home/events";

// schema.org JSON-LD for search engines, read from the same data modules the pages render (no hand-typed values), so
// every value matches the visible text. Facts the owner has not confirmed (pendingFacts in site.ts) are left out.

type JsonLdNode = { [key: string]: unknown };

/** Public origin without trailing slashes, as in src/app/sitemap.ts: "https://thehot.vn". */
const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
/** The home page's canonical URL: the bare origin, like `<link rel="canonical">` and the sitemap. */
const homeUrl = origin;
const restaurantId = `${origin}/#restaurant`;
const websiteId = `${origin}/#website`;

/** Absolute URL of a root-relative path; `new URL` percent-encodes spaces and non-ASCII characters. */
function absolute(path: string): string {
  return new URL(path, origin).href;
}

const address = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  addressCountry: site.address.country,
};

const geo = { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude };

function amenity(name: string) {
  return { "@type": "LocationFeatureSpecification", name, value: true };
}

function restaurantNode(): JsonLdNode {
  const { openingHours, priceRange, paymentAccepted, liveMusic } = pendingFacts;
  return {
    "@type": ["Restaurant", "BarOrPub"],
    "@id": restaurantId,
    name: site.name,
    description: site.schemaDescription,
    url: homeUrl,
    telephone: site.phoneHref.replace(/^tel:/, ""),
    address,
    geo,
    hasMap: site.mapHref,
    logo: absolute(site.logo.src),
    // A few real photos of the venue from the home gallery, then the share card.
    image: [...galleryPhotos.slice(0, 5).map((photo) => absolute(photo.src)), absolute("/opengraph-image.png")],
    servesCuisine: site.cuisine,
    menu: absolute("/menu/list"),
    hasMenu: absolute("/menu/list"),
    acceptsReservations: absolute("/reservation"),
    currenciesAccepted: "VND",
    amenityFeature: [...site.amenities, ...(liveMusic ? ["Nhạc sống"] : [])].map(amenity),
    sameAs: [site.profiles.instagram, site.profiles.tiktok, site.socialHref, site.profiles.google, site.profiles.tripadvisor],
    // Emitted only once set in site.ts (pendingFacts).
    ...(openingHours && openingHours.length > 0
      ? {
          openingHoursSpecification: openingHours.map(({ days, opens, closes }) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: days.map((day) => `https://schema.org/${day}`),
            opens,
            closes,
          })),
        }
      : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(paymentAccepted ? { paymentAccepted } : {}),
  };
}

function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    alternateName: site.alternateNames,
    url: homeUrl,
    inLanguage: "vi-VN",
    publisher: { "@id": restaurantId },
  };
}

/** Calendar date ("2026-10-10") of an instant in Đà Lạt. */
function localDate(time: number): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(time);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/;

/** ISO 8601 start and end, or null when the event has no valid schedule (same rule as getEventStatus). */
function eventDates(event: HomeEvent): { startDate: string; endDate: string } | null {
  if (event.timing.kind !== "scheduled") return null;
  const { startsAt, endsAt, dateOnly } = event.timing;
  if (!ISO_DATE_TIME.test(startsAt) || !ISO_DATE_TIME.test(endsAt)) return null;
  const start = Date.parse(startsAt);
  const end = Date.parse(endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  if (!dateOnly) return { startDate: startsAt, endDate: endsAt };
  // Only the day is known: dates without an hour. endsAt is the midnight after the last day, so step back into it;
  // a one-day event has the same start and end date, as Google suggests for day-long events.
  return { startDate: localDate(start), endDate: localDate(end - 1) };
}

function eventNode(event: HomeEvent, dates: { startDate: string; endDate: string }): JsonLdNode {
  return {
    "@type": "Event",
    // Each event card's heading has this id on the home page.
    "@id": `${origin}/#event-${event.id}`,
    name: event.title,
    ...dates,
    description: event.description,
    image: [absolute(event.poster)],
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: site.name, address, geo },
    // Name and URL as well as the reference: this graph is in its own script, apart from the restaurant node.
    organizer: { "@id": restaurantId, name: site.name, url: homeUrl },
  };
}

/** JSON for a `<script type="application/ld+json">`, with "<" escaped so no string can close the script (Next.js JSON-LD guide). */
function serialize(nodes: JsonLdNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}

/** The restaurant and the website: rendered on every page by the root layout. */
export function siteJsonLd(): string {
  return serialize([restaurantNode(), websiteNode()]);
}

/**
 * The real programmes in the home page's event timeline (not the illustrative ones), or null when there are none.
 * Rendered by the home page only, where the events are shown. The page is static, so this is the list in
 * home/content.ts at build time: past events stay until they are removed there, and a new event needs a new build.
 */
export function homeEventsJsonLd(): string | null {
  const nodes = homeEvents.flatMap((event) => {
    const dates = event.illustrative ? null : eventDates(event);
    return dates ? [eventNode(event, dates)] : [];
  });
  return nodes.length > 0 ? serialize(nodes) : null;
}
