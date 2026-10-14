import type { Metadata } from "next";
import { Suspense } from "react";
import { FixedVideo } from "@/components/sites/nokto/chrome/FixedVideo";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { ReservationForm } from "@/components/sites/nokto/reservation/ReservationForm";
import { ReservationHero } from "@/components/sites/nokto/reservation/ReservationHero";
import { ReservationLoading } from "@/components/sites/nokto/reservation/ReservationLoading";
import { aboutVideo } from "@/components/sites/the-hot/videos";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/reservation");

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
