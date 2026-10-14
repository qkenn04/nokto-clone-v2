// Business details from The Hot's supplied menu and event poster.
export const ASSET_BASE = "/sites/nokto";
export const THE_HOT_ASSET_BASE = "/sites/the-hot-beer-garden";

const sloganLines = ["Đà Lạt lên đèn,", "The Hot lên mood."] as const;
const slogan = sloganLines.join(" ");

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
  nav: [
    { label: "Thực đơn", href: "/menu" },
    { label: "Về The Hot", href: "/about" },
    { label: "Đặt bàn", href: "/reservation" },
  ],
  cta: { label: "Đặt bàn", href: "/reservation" },
  hours: {
    opens: "17:30",
    display: "17:30 – Late",
  },
  address: { street: "28 Sương Nguyệt Ánh, P. Lâm Viên", city: "Đà Lạt", region: "Lâm Đồng", country: "VN", display: "28 Sương Nguyệt Ánh, P. Lâm Viên, Đà Lạt" },
  phone: "0967 539 939",
  phoneHref: "tel:+84967539939",
  social: "The Hot Beer Garden Đà Lạt",
  socialHref: "https://www.facebook.com/thehotbeergardendalat/",
  messengerHref: "https://m.me/thehotbeergardendalat",
  zaloHref: "https://zalo.me/0967539939",
  footer: "The Hot · Đà Lạt Chill Zone",
  cuisine: "Vietnamese",
  currency: { symbol: "₫", position: "after" },
  beerOffer: "Giá bia trong menu áp dụng từ Chủ nhật đến thứ Năm hằng tuần.",
  legal: [
    { label: "Thông tin đặt bàn", href: "/terms" },
    { label: "Bảo mật thông tin", href: "/privacy" },
  ],
} as const;

export function siteImage(file: string) {
  return `${ASSET_BASE}/images/${file}`;
}

export function hotImage(file: string) {
  return `${THE_HOT_ASSET_BASE}/images/${file}`;
}
