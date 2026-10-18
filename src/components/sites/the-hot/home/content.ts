import { hotImage } from "../../nokto/site";
import type { HomeEvent } from "./events";

export type GalleryCategory = "space" | "friends" | "food";
export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: GalleryCategory;
};

export const galleryCategories = [
  { value: "all", label: "Tất cả" },
  { value: "space", label: "Không gian & nhạc" },
  { value: "friends", label: "Hội mình" },
  { value: "food", label: "Mồi bén" },
] as const;

// Actual frames from the restaurant's supplied video.
export const galleryPhotos: GalleryPhoto[] = [
  { id: "stage", src: hotImage("space.jpg"), alt: "Biểu diễn trên sân khấu The Hot Beer Garden", title: "Nhạc lên. Mood lên.", caption: "Một góc sân khấu, cả đêm lên mood.", category: "space" },
  { id: "friends", src: hotImage("friends.jpg"), alt: "Khách và nhân viên tại The Hot Beer Garden", title: "Hội mình ở đây.", caption: "Có bạn cùng bàn, câu chuyện cứ thế nối dài.", category: "friends" },
  { id: "food", src: hotImage("kitchen.jpg"), alt: "Món ăn được phục vụ tại The Hot Beer Garden", title: "Mồi bén lên bàn.", caption: "Chọn vài món hợp gu, chia nhau cả bàn.", category: "food" },
  { id: "bar", src: hotImage("welcome.jpg"), alt: "Nhân viên tại quầy The Hot Beer Garden", title: "Hẹn nhau ở The Hot.", caption: "Từ quầy đến bàn, sẵn sàng cho kèo tối nay.", category: "friends" },
  { id: "night", src: hotImage("night.jpg"), alt: "Không khí buổi tối tại sân khấu The Hot Beer Garden", title: "Đà Lạt lên đèn.", caption: "Một đêm ở The Hot, nhìn từ giữa hội bạn.", category: "space" },
];

// Preview programmes requested by the owner, using real restaurant photos.
// The 10/10/2026 poster date is confirmed; its calendar-day window does not
// imply exact performance hours. Friday on Fire (16/10) and Hot Saturday (17/10)
// were confirmed by the owner on 2026-10-15; the other programmes are illustrative.
export const homeEvents: HomeEvent[] = [
  {
    id: "hot-saturday",
    title: "Hot Saturday",
    subtitle: "Cuối tuần, lên mood hết cỡ",
    description: "Một kèo tối thứ Bảy cho hội mê nhạc và thích ngồi lâu. Chọn mồi hợp gu, tìm góc quen rồi để đêm Đà Lạt trôi theo playlist.",
    poster: hotImage("night.jpg"),
    posterAlt: "Sân khấu The Hot Beer Garden về đêm",
    tags: ["Saturday night", "DJ set", "Hội bạn"],
    timing: { kind: "scheduled", startsAt: "2026-10-17T19:30:00+07:00", endsAt: "2026-10-18T00:30:00+07:00" },
  },
  {
    id: "friday-on-fire",
    title: "Friday on Fire",
    subtitle: "Tan làm. Lên đồ. Tới The Hot.",
    description: "Khép lại một tuần bằng nhạc lên sân khấu, mồi lên bàn và những câu chuyện chưa kể hết. Hẹn hội bạn một tối thứ Sáu thật có mood.",
    poster: hotImage("space.jpg"),
    posterAlt: "Biểu diễn trên sân khấu The Hot Beer Garden",
    tags: ["Friday night", "Live performance"],
    timing: { kind: "scheduled", startsAt: "2026-10-16T19:00:00+07:00", endsAt: "2026-10-17T00:30:00+07:00" },
  },
  {
    id: "after-hours",
    title: "After Hours",
    subtitle: "Kèo đầu tuần của hội mình",
    description: "Đầu tuần vẫn có lý do để gặp nhau. Ghé The Hot sau giờ làm, gọi vài món ăn chơi và ngồi lại trong không khí nhạc của quán.",
    poster: hotImage("welcome.jpg"),
    posterAlt: "Góc quầy The Hot, ảnh minh hoạ chương trình After Hours",
    tags: ["After work", "Music & friends"],
    timing: { kind: "scheduled", startsAt: "2026-10-12T17:30:00+07:00", endsAt: "2026-10-13T00:30:00+07:00" },
    illustrative: true,
  },
  {
    id: "sac-pin-dem",
    title: "Sạc pin đêm",
    subtitle: "Quẩy bất chấp",
    description: "DJ Performance, special game và một đêm lên mood ở The Hot. Xem trọn poster để khám phá chương trình.",
    poster: "/images/main.jpg",
    posterAlt: "Poster 10/10 — Sạc pin đêm, Quẩy bất chấp tại The Hot Beer Garden Đà Lạt",
    tags: ["DJ Performance", "Special game"],
    timing: { kind: "scheduled", startsAt: "2026-10-10T00:00:00+07:00", endsAt: "2026-10-11T00:00:00+07:00", dateOnly: true },
  },
  {
    id: "acoustic-chill",
    title: "Acoustic & Chill",
    subtitle: "Hát cùng nhau, chill cùng hội",
    description: "Một tối dành cho những bài hát quen và câu chuyện quanh bàn. Lưu lại vài khoảnh khắc nhẹ nhàng trước khi cuối tuần lên nhịp.",
    poster: hotImage("friends.jpg"),
    posterAlt: "Khách tại The Hot, ảnh minh hoạ chương trình Acoustic & Chill",
    tags: ["Acoustic", "Chill night"],
    timing: { kind: "scheduled", startsAt: "2026-10-09T18:30:00+07:00", endsAt: "2026-10-09T23:30:00+07:00" },
    illustrative: true,
  },
];

export const recentEventsHref = "https://www.facebook.com/photo/?fbid=122135768073172686&set=a.122093104983172686";
