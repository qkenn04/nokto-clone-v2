import Script from "next/script";
import { UMAMI_WEBSITE_ID } from "@/lib/analytics";

// Inlined at `next build` like the website ID. Changing a value means building a new image.
const src = process.env.NEXT_PUBLIC_UMAMI_SRC?.trim() || "https://stats.thehot.vn/ht.js";

/**
 * Umami tracker (cookieless). Renders nothing without a website ID, so `npm run dev`, local builds and images built
 * without the build arg never load it.
 *  - data-domains: only counts on thehot.vn; the production image run on localhost sends nothing.
 *  - data-exclude-hash: `#events` and other anchors are not separate page views.
 *  - No data-exclude-search: `?utm_…` must reach Umami to tell where visitors come from.
 * Clicks are tracked by ClickTracker, never by Umami's `data-umami-event` (see ClickTracker.tsx).
 */
export function UmamiScript() {
  if (!UMAMI_WEBSITE_ID) return null;
  return <Script src={src} strategy="afterInteractive" data-website-id={UMAMI_WEBSITE_ID} data-domains="thehot.vn" data-exclude-hash="true" />;
}
