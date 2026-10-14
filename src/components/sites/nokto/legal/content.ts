import { hotImage, site } from "../site";

export type LegalSection = { title: string; body: string };
export type LegalDocument = {
  path: "/terms" | "/privacy";
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  image: { src: string; alt: string };
  sections: readonly LegalSection[];
};

export const terms: LegalDocument = {
  path: "/terms",
  eyebrow: "THE HOT · THÔNG TIN ĐẶT BÀN",
  title: "Thông tin đặt bàn",
  updated: "12 tháng 10, 2026",
  intro: "Hẹn bàn và trao đổi yêu cầu trực tiếp với The Hot để nhà hàng xác nhận cuộc hẹn của bạn.",
  image: { src: hotImage("welcome.jpg"), alt: "Quầy phục vụ The Hot Beer Garden" },
  sections: [
    { title: "Địa chỉ và giờ mở cửa", body: `${site.address.display}. Giờ mở cửa: ${site.hours.display}.` },
    { title: "Cách đặt bàn", body: `Gọi ${site.phone} hoặc nhắn Facebook The Hot Beer Garden Đà Lạt. Cung cấp ngày, giờ, số khách và tên liên hệ để nhà hàng kiểm tra và xác nhận bàn.` },
    { title: "Thông tin trên website", body: "Biểu mẫu giúp bạn chuẩn bị và kiểm tra thông tin cuộc hẹn. Thông tin chưa tự động gửi đến nhà hàng; việc hoàn thành biểu mẫu chưa phải xác nhận đặt bàn." },
    { title: "Thay đổi cuộc hẹn", body: `Nếu muốn đổi giờ, số khách hoặc hủy cuộc hẹn, vui lòng gọi ${site.phone} hoặc nhắn lại Facebook để The Hot hỗ trợ.` },
    { title: "Nhóm đông và yêu cầu riêng", body: "Liên hệ trực tiếp nếu đi theo nhóm đông, tổ chức dịp đặc biệt hoặc có yêu cầu về món ăn và chỗ ngồi. Báo trước các dị ứng thực phẩm để trao đổi với nhà hàng." },
    { title: "Giá và ưu đãi", body: `Giá trong bộ ảnh menu tính bằng VNĐ và đã bao gồm VAT. ${site.beerOffer} Liên hệ The Hot để kiểm tra thực đơn và ưu đãi tại thời điểm ghé quán.` },
  ],
};

export const privacy: LegalDocument = {
  path: "/privacy",
  eyebrow: "THE HOT · THÔNG TIN RIÊNG TƯ",
  title: "Bảo mật thông tin",
  updated: "12 tháng 10, 2026",
  intro: "Trang này giải thích cách thông tin bạn nhập được sử dụng trong phiên bản website hiện tại.",
  image: { src: hotImage("night.jpg"), alt: "Không khí buổi tối ở The Hot" },
  sections: [
    { title: "Biểu mẫu chuẩn bị đặt bàn", body: "Thông tin nhập trong biểu mẫu được dùng để hiển thị bản kiểm tra cuộc hẹn ngay trên trang. Website hiện chưa gửi thông tin này đến nhà hàng, chưa lưu đặt bàn vào hệ thống và chưa gửi email xác nhận. Tải lại trang sẽ xóa nội dung biểu mẫu." },
    { title: "Liên hệ qua điện thoại và Facebook", body: "Bạn chủ động chia sẻ thông tin với The Hot khi gọi hotline hoặc nhắn Facebook. Khi truy cập Facebook, thông tin được xử lý theo chính sách của Facebook." },
    { title: "Thông tin thanh toán", body: "Biểu mẫu trên website không yêu cầu số thẻ hoặc thông tin thanh toán." },
    { title: "Tùy chọn hiển thị", body: "Website ghi nhớ việc bạn đã xem phần giới thiệu logo trong tab hiện tại. Dữ liệu này không chứa thông tin đặt bàn và hết hiệu lực khi đóng tab." },
    { title: "Hỗ trợ", body: `Nếu cần trao đổi về thông tin bạn đã cung cấp trực tiếp cho nhà hàng, liên hệ ${site.phone} hoặc Facebook The Hot Beer Garden Đà Lạt.` },
  ],
};
