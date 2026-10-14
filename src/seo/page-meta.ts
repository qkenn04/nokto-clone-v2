import type { Metadata } from "next";
import { site } from "@/components/sites/nokto/site";

// Search-facing titles and descriptions for every page. They are tuned for search results, so they live here and not
// in the page content: the visible headings (e.g. "Thông tin đặt bàn") and the slogan stay in the UI modules.

/** "The Hot Beer Garden Đà Lạt": the root layout appends " — <brandName>" to every inner-page title. */
export const brandName = `${site.name} ${site.location}`;

/** The home `<title>`. Home Open Graph/Twitter keep the slogan title (`site.rootTitle`), set in the root layout. */
export const homeTitle = `${brandName} — Quán nhậu chill, bia lạnh`;

/** `title` is the part before the layout's " — <brandName>" suffix. */
export const pageMeta = {
  "/menu": {
    title: "Menu",
    description:
      "Menu nhậu The Hot Beer Garden Đà Lạt: món ăn từ 39K, giá đã gồm VAT. Bia ưu đãi từ 19K, Chủ nhật đến thứ Năm. Lật menu, chốt món rồi đặt bàn.",
  },
  "/menu/list": {
    title: "Bảng giá món nhậu & bia",
    description:
      "Bảng giá món nhậu The Hot Đà Lạt: món ăn chơi, salad, gà, mực, heo, bò từ 39.000₫, giá đã gồm VAT. Bia ưu đãi Chủ nhật đến thứ Năm.",
  },
  "/about": {
    title: "Beer garden chill cho hội bạn",
    description: `The Hot là beer garden cho hội bạn ở Đà Lạt: chỗ ngồi ngoài trời, mồi bén, bia lạnh, nhạc lên. Ghé ${site.address.street} từ ${site.hours.opens}.`,
  },
  "/reservation": {
    title: "Đặt bàn quán nhậu cho hội bạn",
    description: `Đặt bàn cho hội bạn tại The Hot Beer Garden Đà Lạt: chọn ngày, giờ, số người rồi chốt qua hotline ${site.phone} hoặc Facebook. 28 Sương Nguyệt Ánh.`,
  },
  "/terms": {
    title: "Giờ mở cửa & địa chỉ",
    description: `The Hot Beer Garden Đà Lạt mở cửa từ ${site.hours.opens} tại ${site.address.street}. Cách đặt bàn, nhóm đông, giá và ưu đãi bia. Hotline ${site.phone}.`,
  },
  "/privacy": {
    title: "Bảo mật thông tin",
    description: "Thông tin về biểu mẫu đặt bàn và các liên kết liên hệ trên website The Hot.",
  },
} as const satisfies Record<string, { title: string; description: string }>;

export type PagePath = keyof typeof pageMeta;

/**
 * Share card for inner pages: the home card (`src/app/opengraph-image.png`, 1200×630). Next.js only applies that file
 * to pages without their own `openGraph`, and every inner page sets one, so it is listed here explicitly; without it
 * Facebook, Messenger and Zalo show links to /menu etc. with no image.
 */
const shareImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.rootTitle } as const;

/**
 * Title, description, canonical and Open Graph for an inner page. The layout's title template does not reach Open
 * Graph, so the full title is spelled out there; Twitter copies both from Open Graph (see the root layout).
 */
export function pageMetadata(path: PagePath): Metadata {
  const { title, description } = pageMeta[path];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} — ${brandName}`, description, url: path, type: "website", images: [shareImage] },
  };
}
