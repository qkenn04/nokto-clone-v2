import type { Metadata } from "next";
import { FixedPhoto } from "@/components/sites/nokto/chrome/FixedPhoto";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { MenuList } from "@/components/sites/nokto/menu/MenuList";
import { hotImage } from "@/components/sites/nokto/site";

const description = "Menu nhậu The Hot Beer Garden Đà Lạt: mồi từ 39.000₫, giá đã gồm VAT. Giá bia ưu đãi áp dụng Chủ nhật đến thứ Năm.";

export const metadata: Metadata = {
  title: "Thực đơn",
  description,
  alternates: { canonical: "/menu" },
  openGraph: { title: "Thực đơn — The Hot Beer Garden Đà Lạt", description, url: "/menu", type: "website" },
};

export default function MenuPage() {
  return (
    <main id="main-content" className="relative w-full">
      <FixedPhoto src={hotImage("kitchen.jpg")} alt="" />
      <div className="relative z-10 lg:w-1/2">
        <MenuList />
      </div>
      <SiteFooter />
    </main>
  );
}
