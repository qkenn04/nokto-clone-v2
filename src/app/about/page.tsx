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
import { site } from "@/components/sites/nokto/site";
import { aboutVideo } from "@/components/sites/the-hot/videos";

const title = "Về The Hot";
const description = "The Hot — quán nhậu của hội bạn ở Đà Lạt. Mồi bén, bia lạnh, nhạc lên tại 28 Sương Nguyệt Ánh, P. Lâm Viên.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  // The layout's title template does not reach openGraph, so the full title is spelled out.
  openGraph: { title: `${title} — ${site.name} ${site.location}`, description, url: "/about", type: "website" },
};

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
