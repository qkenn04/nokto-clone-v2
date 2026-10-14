import type { Metadata } from "next";
import { FixedVideo } from "@/components/sites/nokto/chrome/FixedVideo";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { MenuList } from "@/components/sites/nokto/menu/MenuList";
import { kitchenVideo } from "@/components/sites/the-hot/videos";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/menu/list");

export default function MenuListPage() {
  return (
    <main id="main-content" className="relative w-full">
      <FixedVideo {...kitchenVideo} />
      <div className="relative z-10 lg:w-1/2">
        <MenuList />
      </div>
      <SiteFooter />
    </main>
  );
}
