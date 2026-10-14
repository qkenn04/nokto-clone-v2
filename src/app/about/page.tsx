import type { Metadata } from "next";
import { AboutBody } from "@/components/sites/nokto/about/AboutBody";
import { AboutChef } from "@/components/sites/nokto/about/AboutChef";
import { AboutClosing } from "@/components/sites/nokto/about/AboutClosing";
import { AboutGallery } from "@/components/sites/nokto/about/AboutGallery";
import { AboutNumbers } from "@/components/sites/nokto/about/AboutNumbers";
import { AboutOpening } from "@/components/sites/nokto/about/AboutOpening";
import { AboutQuote } from "@/components/sites/nokto/about/AboutQuote";
import { FixedVideo } from "@/components/sites/nokto/chrome/FixedVideo";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { aboutVideo } from "@/components/sites/the-hot/videos";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <main id="main-content" className="relative w-full">
      <FixedVideo {...aboutVideo} />
      <div className="relative z-10 lg:w-1/2">
        <AboutOpening />
        <AboutBody />
        <AboutChef />
        <AboutQuote />
        <AboutGallery />
        <AboutNumbers />
        <AboutClosing />
      </div>
      <SiteFooter />
    </main>
  );
}
