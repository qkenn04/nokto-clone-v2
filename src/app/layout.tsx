import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { CustomCursor } from "@/components/sites/nokto/chrome/CustomCursor";
import { PageTransition } from "@/components/sites/nokto/chrome/PageTransition";
import { PersistentChrome } from "@/components/sites/nokto/chrome/PersistentChrome";
import { Preloader } from "@/components/sites/nokto/chrome/Preloader";
import { SmoothScroll } from "@/components/sites/nokto/chrome/SmoothScroll";
import { FloatingContact } from "@/components/sites/the-hot/FloatingContact";
import { site } from "@/components/sites/nokto/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.rootTitle, template: `%s — ${site.name} ${site.location}` },
  description: site.rootDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { title: site.rootTitle, description: site.rootDescription, url: "/", type: "website", locale: "vi_VN", siteName: site.name },
  twitter: { card: "summary_large_image", title: site.rootTitle, description: site.rootDescription },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteUrl}/#restaurant`,
  name: site.name,
  description: site.schemaDescription,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  servesCuisine: site.cuisine,
  telephone: site.phoneHref.slice(4),
  sameAs: [site.socialHref],
  hasMenu: `${siteUrl}/menu`,
  currenciesAccepted: "VND",
  acceptsReservations: "True",
};

// The beer-fill splash plays on every full page load and is the first thing painted: it is the first content in the
// body and shows by default, so nothing has to run before it appears. This script runs just before it is parsed and
// holds its intro ("wait") until the splash has been through a frame, since that first frame lays out the whole page
// underneath and can be slow; then it plays it. The Preloader starts the exit once the page is ready; the 6s cap
// here still lets the page through if the app's scripts never arrive. Without scripts the splash runs on its own clock.
const SPLASH_SCRIPT = `(function(){var script=document.currentScript,root=script.parentElement;root.setAttribute("data-splash","wait");function painted(){if(!script.nextElementSibling)return requestAnimationFrame(painted);requestAnimationFrame(play)}function play(){if(root.getAttribute("data-splash")!=="wait")return;root.setAttribute("data-splash","play");setTimeout(function(){if(root.getAttribute("data-splash")==="play")root.setAttribute("data-splash","exit")},6000)}requestAnimationFrame(painted)})()`;

const FONT_FILES = ["barlow-condensed-700-latin", "barlow-condensed-700-latin-ext", "barlow-condensed-700-vietnamese", "be-vietnam-pro-400-latin", "be-vietnam-pro-400-vietnamese"];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  for (const file of FONT_FILES) {
    preload(`/sites/the-hot-beer-garden/fonts/${file}.woff2`, { as: "font", type: "font/woff2", crossOrigin: "" });
  }

  return (
    <html lang="vi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        {/* Marked by the script below before first paint; not <html>, whose attributes React resets in dev. */}
        <div className="contents" data-splash-root="" suppressHydrationWarning>
          <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
          <Preloader />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:text-small focus:tracking-[var(--tracking-label)] focus:uppercase focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent"
          >
            Chuyển đến nội dung
          </a>
          <CustomCursor />
          <PersistentChrome />
          <PageTransition>{children}</PageTransition>
          <FloatingContact />
          <SmoothScroll />
        </div>
      </body>
    </html>
  );
}
