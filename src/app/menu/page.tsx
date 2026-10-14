import type { Metadata } from "next";
import { MenuBook } from "@/components/sites/the-hot/MenuBook";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/menu");

export default function MenuPage() {
  return (
    <main id="main-content" className="relative w-full">
      <MenuBook />
      <SiteFooter />
    </main>
  );
}
