// Visitor analytics shared by every tracker (docs/specs/004-analytics, ADR 0007).
// Umami: always on when the build has NEXT_PUBLIC_UMAMI_WEBSITE_ID; no cookies, no IP stored.
// GA4: a later change adds it at the marked extension point in track(), only after the visitor consents.
//
// Every custom event goes through track(). NEVER send names, phone numbers, emails, notes or anything else a
// visitor types: only the event names and property keys allowed below leave the page.

/**
 * Umami website ID, inlined at `next build` (Jenkinsfile → Dockerfile build arg; keep the literal
 * `process.env.NEXT_PUBLIC_…` so Next.js can inline it). Empty: no tracker, and /privacy leaves out the Umami section.
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ?? "";

export type AnalyticsEvent =
  | "contact_click"
  | "booking_cta_click"
  | "reservation_complete"
  | "menu_view_mode"
  | "event_view"
  | "social_click";

const EVENTS: readonly AnalyticsEvent[] = [
  "contact_click",
  "booking_cta_click",
  "reservation_complete",
  "menu_view_mode",
  "event_view",
  "social_click",
];

/** Property keys an event may carry (spec 004 §4.1). Anything else is dropped before it is sent. */
export type AnalyticsPropKey = "method" | "location" | "mode" | "event_id" | "network" | "party_size";

const ALLOWED_PROPS: readonly AnalyticsPropKey[] = ["method", "location", "mode", "event_id", "network", "party_size"];

/** Longest property value sent; longer strings are cut. */
const MAX_VALUE_LENGTH = 100;

export type AnalyticsProps = Partial<Record<AnalyticsPropKey, string | number>>;

/** The part of the Umami 3.4 tracker API this site uses (`window.umami.track(name, data)`). */
type UmamiTracker = { track: (eventName: string, data?: AnalyticsProps) => Promise<void> | void };

declare global {
  interface Window {
    // Missing when the build has no Umami website ID (dev, smoke test, local builds), before the script has loaded,
    // or when a blocker stops it. Present but inert on hosts outside `data-domains`.
    umami?: UmamiTracker;
  }
}

export function isAnalyticsEvent(value: string): value is AnalyticsEvent {
  return (EVENTS as readonly string[]).includes(value);
}

function isAllowedProp(key: string): key is AnalyticsPropKey {
  return (ALLOWED_PROPS as readonly string[]).includes(key);
}

/** Keeps only allowed keys with a non-empty string (cut to 100 characters) or a finite number. */
export function cleanProps(props?: Readonly<Record<string, unknown>>): AnalyticsProps {
  const clean: AnalyticsProps = {};
  if (!props) return clean;
  for (const [key, value] of Object.entries(props)) {
    if (!isAllowedProp(key)) continue;
    if (typeof value === "number") {
      if (Number.isFinite(value)) clean[key] = value;
    } else if (typeof value === "string") {
      const text = value.trim().slice(0, MAX_VALUE_LENGTH);
      if (text) clean[key] = text;
    }
  }
  return clean;
}

/**
 * Sends one custom event. Never throws and never blocks the click or form that triggered it: when the tracker is
 * missing (not configured, not loaded yet, blocked) the event is dropped, not queued.
 */
export function track(name: AnalyticsEvent, props?: Readonly<Record<string, string | number>>): void {
  if (typeof window === "undefined" || !isAnalyticsEvent(name)) return;
  const data = cleanProps(props);
  const hasData = Object.keys(data).length > 0;

  // ── Umami ──
  try {
    const sent = window.umami?.track(name, hasData ? data : undefined);
    if (sent && typeof sent.catch === "function") sent.catch(() => undefined);
  } catch {
    // A broken tracker must not break the button that was pressed.
  }

  // ── GA4 ── extension point for the consent-gated GA4 change (spec 004 PR B): send `name` and `data` (already
  // filtered above) to gtag here, only when the visitor has consented. Nothing else in this file needs to change.
}

/** `data-track*` attributes for a link or button, read by ClickTracker. Works in Server Components too. */
export type TrackAttrs = { [key: `data-track${string}`]: string };

export function trackAttrs(name: AnalyticsEvent, props?: Partial<Record<AnalyticsPropKey, string>>): TrackAttrs {
  const attrs: TrackAttrs = { "data-track": name };
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value !== undefined) attrs[`data-track-${key}`] = value;
  }
  return attrs;
}
