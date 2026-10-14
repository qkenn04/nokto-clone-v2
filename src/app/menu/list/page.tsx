import type { Metadata } from "next";
import { FixedVideo } from "@/components/sites/nokto/chrome/FixedVideo";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { MenuList } from "@/components/sites/nokto/menu/MenuList";
import { kitchenVideo } from "@/components/sites/the-hot/videos";

const description = "Menu nhậu The Hot Beer Garden Đà Lạt: mồi từ 39.000₫, giá đã gồm VAT. Giá bia ưu đãi áp dụng Chủ nhật đến thứ Năm.";

export const metadata: Metadata = {
  title: "Thực đơn dạng danh sách",
  description,
  alternates: { canonical: "/menu/list" },
  openGraph: { title: "Thực đơn dạng danh sách — The Hot Beer Garden Đà Lạt", description, url: "/menu/list", type: "website" },
};

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
