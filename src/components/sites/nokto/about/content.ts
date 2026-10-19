import { hotImage, site } from "../site";

export type AboutImage = { src: string; alt: string };
export type GalleryItem = AboutImage & { caption: string };
export type AboutNumber = { value: number; suffix: string; label: string };

export const about = {
  chapter: "THE HOT · CHỖ HẸN CỦA HỘI MÌNH",
  headline: ["Đúng hội bạn.", "Đúng chỗ vui."],
  editorial: "Tan làm, sinh nhật hay chỉ là lâu rồi chưa gặp, có hội là có kèo.",
  body: [
    `Ở ${site.name}, kèo vui bắt đầu từ một tin nhắn: "Tối nay đi đâu?". Một bàn mồi ngon, bia lạnh và đám bạn hợp cạ là đủ.`,
    `Gọi món theo gu cả bàn: chút đồ giòn để lai rai, món đậm đà để nhắm bia, thêm cơm hay mì cho hội đang đói. Vừa ăn vừa kể chuyện, nhạc lên là cùng nhập cuộc.`,
    `Hẹn hội mình ở ${site.address.display}, từ ${site.hours.opens} đến khuya. Gọi ${site.phone} hoặc nhắn Facebook để chốt bàn trước khi tới.`,
  ],
  experience: { name: "Hợp cạ là vui", role: "The Hot Đà Lạt" },
  experienceImage: { src: hotImage("friends.jpg"), alt: "Khách và nhân viên tại The Hot Beer Garden" } satisfies AboutImage,
  heroImage: { src: hotImage("night.jpg"), alt: "Sân khấu và không khí buổi tối tại The Hot" } satisfies AboutImage,
  experienceBody: [
    "Đi hai người hay kéo nguyên hội, cứ chọn món mình thích rồi chia nhau cả bàn. Chuyện hôm nay, kế hoạch cuối tuần, cứ ngồi xuống là có thứ để nói.",
    "Muốn biết tối nay có gì vui? Ghé Facebook The Hot Beer Garden Đà Lạt để xem chương trình và lịch nhạc của quán.",
  ],
  quote: { text: "Mồi lên bàn. Hội lên mood.", attribution: "— The Hot Beer Garden" },
  gallery: [
    { src: hotImage("space.jpg"), alt: "Biểu diễn trên sân khấu The Hot", caption: "/ nhạc lên" },
    { src: hotImage("kitchen.jpg"), alt: "Món ăn được phục vụ tại The Hot", caption: "/ mồi bén" },
    { src: hotImage("welcome.jpg"), alt: "Nhân viên tại quầy The Hot", caption: "/ hội mình ở đây" },
  ] satisfies GalleryItem[],
  numbers: [
    { value: 28, suffix: "", label: "/ Sương Nguyệt Ánh" },
    { value: 17, suffix: ":30", label: "/ mở cửa đến khuya" },
    { value: 10, suffix: "", label: "/ trang menu để khám phá" },
  ] satisfies AboutNumber[],
  closing: {
    headline: "Có hội rồi. Chốt kèo thôi.",
    note: `${site.address.display} · ${site.hours.display} · ${site.phone}`,
    cta: { label: "Đặt bàn cho hội mình →", href: "/reservation" },
  },
} as const;
