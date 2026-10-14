import type { Metadata } from "next";
import { Suspense } from "react";
import { FixedVideo } from "@/components/sites/nokto/chrome/FixedVideo";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { reservation } from "@/components/sites/nokto/reservation/content";
import { ReservationForm } from "@/components/sites/nokto/reservation/ReservationForm";
import { ReservationHero } from "@/components/sites/nokto/reservation/ReservationHero";
import { ReservationLoading } from "@/components/sites/nokto/reservation/ReservationLoading";
import { site } from "@/components/sites/nokto/site";
import { aboutVideo } from "@/components/sites/the-hot/videos";

const { title, description } = reservation.metadata;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reservation" },
  // The root title template does not apply to Open Graph titles, so the full title is spelled out.
  openGraph: { title: `${title} — ${site.name} ${site.location}`, description, url: "/reservation", type: "website" },
};

export default function ReservationPage() {
  return (
    <Suspense fallback={<ReservationLoading />}>
      <main id="main-content" className="relative w-full">
        <FixedVideo {...aboutVideo} />
        <div className="relative z-10 lg:w-1/2">
          <ReservationHero />
          <ReservationForm />
        </div>
        <SiteFooter />
      </main>
    </Suspense>
  );
}
