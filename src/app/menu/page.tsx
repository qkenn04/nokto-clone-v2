import type { Metadata } from "next";
import { FixedPhoto } from "@/components/sites/nokto/chrome/FixedPhoto";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { MenuList } from "@/components/sites/nokto/menu/MenuList";
import { siteImage } from "@/components/sites/nokto/site";

const description = "Seasonal omakase menu at NOKTO. Nigiri, maki and chef's selections — updated weekly.";

export const metadata: Metadata = {
  title: "Menu",
  description,
  alternates: { canonical: "/menu" },
  openGraph: { title: "Menu — NOKTO Warsaw", description, url: "/menu", type: "website" },
};

export default function MenuPage() {
  return (
    <main id="main-content" className="relative w-full">
      <FixedPhoto src={siteImage("hero-menu.jpg")} alt="" />
      <div className="relative z-10 lg:w-1/2">
        <MenuList />
      </div>
      <SiteFooter />
    </main>
  );
}
