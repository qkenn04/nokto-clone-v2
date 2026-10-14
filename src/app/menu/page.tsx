import type { Metadata } from "next";
import { MenuBook } from "@/components/sites/the-hot/MenuBook";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";

const description = "Menu lật sách The Hot Beer Garden Đà Lạt — món ăn từ 39K, giá đã gồm VAT. Giá bia ưu đãi từ 19K áp dụng Chủ nhật đến thứ Năm.";

export const metadata: Metadata = {
  title: "Thực đơn",
  description,
  alternates: { canonical: "/menu" },
  openGraph: { title: "Thực đơn — The Hot Beer Garden Đà Lạt", description, url: "/menu", type: "website" },
};

export default function MenuPage() {
  return (
    <main id="main-content" className="relative w-full">
      <MenuBook />
      <SiteFooter />
    </main>
  );
}
