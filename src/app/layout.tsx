import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { CustomCursor } from "@/components/sites/nokto/chrome/CustomCursor";
import { PageTransition } from "@/components/sites/nokto/chrome/PageTransition";
import { PersistentChrome } from "@/components/sites/nokto/chrome/PersistentChrome";
import { Preloader } from "@/components/sites/nokto/chrome/Preloader";
import { ScrollManager } from "@/components/sites/nokto/chrome/ScrollManager";
import { SmoothScroll } from "@/components/sites/nokto/chrome/SmoothScroll";
import { site } from "@/components/sites/nokto/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.rootTitle, template: `%s — ${site.name} ${site.location}` },
  description: site.rootDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { title: site.rootTitle, description: site.rootDescription, url: "/", type: "website" },
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
  image: `${siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  servesCuisine: site.cuisine,
  priceRange: site.priceRange,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.hours.days,
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
  ],
  acceptsReservations: "True",
};

const FONT_FILES = ["inter-tight-latin", "fraunces-latin", "fraunces-italic-latin"];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  for (const file of FONT_FILES) {
    preload(`/sites/nokto/fonts/${file}.woff2`, { as: "font", type: "font/woff2", crossOrigin: "" });
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:text-small focus:tracking-[var(--tracking-label)] focus:uppercase focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          Skip to content
        </a>
        <CustomCursor />
        <PersistentChrome />
        <PageTransition>{children}</PageTransition>
        <Preloader />
        <SmoothScroll />
        <ScrollManager />
      </body>
    </html>
  );
}
