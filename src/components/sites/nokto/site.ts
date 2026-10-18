// Business details from The Hot's supplied menu and event poster.
export const ASSET_BASE = "/sites/nokto";
export const THE_HOT_ASSET_BASE = "/sites/the-hot-beer-garden";

const sloganLines = ["Đà Lạt lên đèn,", "The Hot lên mood."] as const;
const slogan = sloganLines.join(" ");

const pageLinks = {
  menu: { label: "Thực đơn", href: "/menu" },
  menuList: { label: "Bảng giá món", href: "/menu/list" },
  about: { label: "Về The Hot", href: "/about" },
  reservation: { label: "Đặt bàn", href: "/reservation" },
  terms: { label: "Thông tin đặt bàn", href: "/terms" },
  privacy: { label: "Bảo mật thông tin", href: "/privacy" },
} as const;

export const site = {
  name: "The Hot Beer Garden",
  location: "Đà Lạt",
  slogan,
  sloganLines,
  rootTitle: `The Hot Beer Garden Đà Lạt — ${slogan}`,
  rootDescription:
    `${slogan} Quán nhậu cho hội bạn ở Đà Lạt: mồi bén, bia lạnh, nhạc lên. Ghé 28 Sương Nguyệt Ánh, P. Lâm Viên từ 17:30. Đặt bàn: 0967 539 939.`,
  rootOgDescription: `${slogan} Mồi bén, bia lạnh và những đêm nhạc giữa Đà Lạt.`,
  schemaDescription: "The Hot Beer Garden tại 28 Sương Nguyệt Ánh, P. Lâm Viên, Đà Lạt. Nhà hàng nhậu cho giới trẻ, phục vụ món ăn, bia và âm nhạc từ 17:30 đến khuya.",
  label: "BEER GARDEN — ĐÀ LẠT",
  tagline: "Đà Lạt Chill Zone",
  logo: { src: `${THE_HOT_ASSET_BASE}/images/logo.png`, width: 640, height: 479 },
  nav: [pageLinks.menu, pageLinks.about, pageLinks.reservation],
  footerNav: [pageLinks.menu, pageLinks.menuList, pageLinks.about, pageLinks.reservation, pageLinks.terms, pageLinks.privacy],
  cta: { label: "Đặt bàn", href: "/reservation" },
  hours: {
    opens: "17:30",
    display: "17:30 – Late",
  },
  address: { street: "28 Sương Nguyệt Ánh, P. Lâm Viên", city: "Đà Lạt", region: "Lâm Đồng", country: "VN", display: "28 Sương Nguyệt Ánh, P. Lâm Viên, Đà Lạt" },
  /** Map pin of the address above, supplied by the owner (structured data only). */
  geo: { latitude: 11.950599, longitude: 108.456165 },
  /** The venue's Google profile (Maps / Business Profile). */
  mapHref: "https://share.google/GzxQd0SE6t7QogToT",
  phone: "0967 539 939",
  phoneHref: "tel:+84967539939",
  social: "The Hot Beer Garden Đà Lạt",
  socialHref: "https://www.facebook.com/thehot.dalat/",
  /** The venue's other public profiles, listed with `socialHref` in structured data `sameAs`. */
  profiles: {
    instagram: "https://www.instagram.com/thehot.dalat/",
    tiktok: "https://www.tiktok.com/@thehot.dalat",
    /** Knowledge Graph ID of the Google Business Profile. */
    google: "https://www.google.com/search?kgmid=/g/11yff9m3ws",
    tripadvisor: "https://www.tripadvisor.com.vn/Attraction_Review-g293922-d33307586-Reviews-The_Hot_Beer_Garden-Da_Lat_Lam_Dong_Province.html",
  },
  /** Other names people search for the site by (structured data `WebSite.alternateName`). */
  alternateNames: ["The Hot Đà Lạt", "The Hot Beer Garden Đà Lạt", "thehot.vn"],
  messengerHref: "https://m.me/thehot.dalat",
  zaloHref: "https://zalo.me/0967539939",
  footer: "The Hot · Đà Lạt Chill Zone",
  cuisine: "Vietnamese",
  /** Amenities listed on the Google profile and stated on /about (structured data `amenityFeature`). */
  amenities: ["Chỗ ngồi ngoài trời"],
  currency: { symbol: "₫", position: "after" },
  beerOffer: "Giá bia trong menu áp dụng từ Chủ nhật đến thứ Năm hằng tuần.",
  legal: [pageLinks.terms, pageLinks.privacy],
} as const;

type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

/** Business facts the structured data emits only once they are set (src/seo/structured-data.ts). */
export type PendingFacts = {
  /** Weekly hours, "HH:MM" in Đà Lạt time. Opening time is `site.hours.opens`; the closing time and open days are not confirmed. */
  openingHours?: readonly { days: readonly Weekday[]; opens: string; closes: string }[];
  /** Typical spend per guest, as the owner states it (`priceRange`). */
  priceRange?: string;
  /** Payment methods, e.g. cash or bank transfer (`paymentAccepted`). */
  paymentAccepted?: string;
  /** Live music on a regular basis; emitted as the amenity "Nhạc sống". */
  liveMusic?: boolean;
};

// Awaiting owner confirmation: leave each field unset until the owner confirms it (and the site shows it).
export const pendingFacts: PendingFacts = {};

export function siteImage(file: string) {
  return `${ASSET_BASE}/images/${file}`;
}

export function hotImage(file: string) {
  return `${THE_HOT_ASSET_BASE}/images/${file}`;
}
