import { FixedPhoto } from "@/components/sites/nokto/chrome/FixedPhoto";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { siteImage } from "@/components/sites/nokto/site";

// Placeholder until the terms page is built.
export default function TermsPage() {
  return (
    <main id="main-content" className="relative w-full">
      <FixedPhoto src={siteImage("terms.jpg")} />
      <div className="relative z-10 min-h-[200dvh] lg:w-1/2" />
      <SiteFooter />
    </main>
  );
}
