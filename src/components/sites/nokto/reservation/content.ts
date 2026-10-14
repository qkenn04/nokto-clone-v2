import { hotImage, site } from "../site";

export type StepNumber = 1 | 2 | 3;
export type ReservationStep = { number: StepNumber; label: string; title: string };
type SuccessCta =
  | { label: string; variant: "ghost" }
  | { label: string; variant: "primary" | "link"; href: string; method: "phone" | "facebook" };

export const reservation = {
  hero: {
    label: "CHỐT KÈO Ở THE HOT",
    headline: ["Rủ đủ hội.", "Chốt bàn thôi."],
    intro: `Đi hôm nào, mấy người? Chuẩn bị thông tin bên dưới rồi gọi ${site.phone} hoặc nhắn Facebook để The Hot kiểm tra và chốt bàn cho hội mình.`,
    scrollCta: "Lên kèo cho hội mình",
    policy: [site.hours.display, site.phone, "Xác nhận trực tiếp với The Hot"],
  },
  image: { src: hotImage("friends.jpg"), alt: "Khách ghé The Hot Beer Garden Đà Lạt" },
  availableTimes: ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  guests: { min: 1, max: 8, initial: 2, overflowNote: `Kéo hội đông hơn hoặc muốn đến giờ khác? Gọi ${site.phone}, The Hot hỗ trợ nhé.` },
  notesMaxLength: 500,
  steps: [
    { number: 1, label: "Khi nào", title: "Đi hôm nào?" },
    { number: 2, label: "Hội mình", title: "Cho The Hot biết tên bạn." },
    { number: 3, label: "Kiểm tra", title: "Đúng kèo chưa?" },
  ] satisfies ReservationStep[],
  errors: {
    required: "Vui lòng điền thông tin này.",
    emailFormat: "Vui lòng nhập email hợp lệ.",
    phoneFormat: "Vui lòng nhập số điện thoại hợp lệ.",
    dateMin: "Vui lòng chọn hôm nay hoặc ngày sắp tới.",
    timeRequired: "Vui lòng chọn giờ dự kiến.",
    guestsRange: "Chọn từ 1 đến 8 khách hoặc gọi hotline cho nhóm đông hơn.",
    notesLength: "Ghi chú tối đa 500 ký tự.",
    policy: "Vui lòng xác nhận bạn sẽ liên hệ The Hot để chốt bàn.",
  },
  fields: {
    date: { label: "Ngày", hint: "Ngày dự kiến" },
    time: { label: "Giờ", hint: "Giờ dự kiến" },
    guests: { label: "Số khách", hint: "1 – 8" },
    firstName: { label: "Tên" },
    lastName: { label: "Họ" },
    email: { label: "Email (không bắt buộc)", placeholder: "ten@example.com" },
    phone: { label: "Điện thoại", placeholder: "Không bắt buộc", hint: "Không bắt buộc" },
    notes: { label: "Ghi chú", placeholder: "Hội mình đi sinh nhật? Có ai dị ứng món nào? Ghi ở đây nhé…", hint: "Không bắt buộc, tối đa 500 ký tự" },
    policy: { label: "Tôi hiểu bàn chỉ được xác nhận sau khi liên hệ trực tiếp với The Hot." },
  },
  actions: { next: "Tiếp tục", back: "Quay lại", submit: "Liên hệ chốt bàn" },
  summary: {
    title: "Kèo của hội mình",
    fields: { date: "Ngày", time: "Giờ", guests: "Số khách", name: "Họ tên", email: "Email", phone: "Điện thoại", notes: "Ghi chú" },
  },
  cancellation: {
    label: "Xác nhận đặt bàn",
    policy: `Điền xong chưa phải là đặt bàn. Gọi ${site.phone} hoặc nhắn Facebook để The Hot kiểm tra bàn trống và xác nhận kèo của bạn.`,
  },
  success: {
    label: "LIÊN HỆ ĐỂ XÁC NHẬN",
    title: "Giờ thì chốt bàn!",
    subtitle: `Kèo đã có ngày, giờ và đủ thông tin. Gọi ${site.phone} hoặc gửi thông tin bên dưới qua Facebook để The Hot xác nhận bàn nhé.`,
    ctas: [
      { label: "Gọi The Hot", variant: "primary", href: site.phoneHref, method: "phone" },
      { label: "Nhắn Facebook →", variant: "link", href: site.socialHref, method: "facebook" },
      { label: "Lên kèo khác", variant: "ghost" },
    ] satisfies SuccessCta[],
    demoNote: "Thông tin chưa được gửi. Nhớ gọi hoặc nhắn The Hot để được xác nhận bàn.",
  },
} as const;
