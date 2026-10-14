# Yêu cầu phi chức năng

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Đặc tả sản phẩm](spec.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Số đo hiệu năng](../dev/perf.md), [Kiểm thử](../dev/testing.md), [Mô hình đe doạ](../security/threat-model.md), [Triển khai](../ops/deployment.md)

File này là **ngân sách**: ngưỡng phải đạt và cách đo. Số đo thật nằm ở [dev/perf.md](../dev/perf.md); ở đây chỉ ghi kết quả gần nhất.

## 1. Cách đọc

| Cột | Nghĩa |
|---|---|
| Ngưỡng | Giá trị phải đạt, có đơn vị và điều kiện đo |
| Cách đo | Công cụ hoặc lệnh; ai đo, khi nào |
| Nguồn | Vì sao là con số này |
| Trạng thái | `Chưa đo` · `Đạt (YYYY-MM-DD)` · `Chưa đạt (YYYY-MM-DD)` · `[CẦN XÁC NHẬN]` |

## 2. Hiệu năng (Core Web Vitals trên điện thoại)

Điều kiện đo chung: https://pagespeed.web.dev, chế độ **Mobile** (giả lập Moto G Power, Slow 4G), trang chủ `https://thehot.vn`. Số liệu khách thật (field data) xem ở Cloudflare Web Analytics và Search Console → Core Web Vitals khi đủ lượt truy cập.

| Mã | Chỉ số | Ngưỡng | Cách đo | Nguồn | Trạng thái |
|---|---|---|---|---|---|
| PERF-01 | Largest Contentful Paint (LCP) | < 2,5 s | PageSpeed Mobile; field data khi có | Ngưỡng "tốt" của Core Web Vitals | Chưa đạt (2026-10-14: 2,9 s, trước PR #4); sau PR #4: Chưa đo |
| PERF-02 | Cumulative Layout Shift (CLS) | < 0,1 | PageSpeed Mobile | Ngưỡng "tốt" của Core Web Vitals | Đạt (2026-10-14: 0) |
| PERF-03 | Interaction to Next Paint (INP), dữ liệu khách thật; trong lúc chưa có field data dùng Total Blocking Time (TBT) giả lập | INP < 200 ms; TBT < 200 ms | INP: Cloudflare Web Analytics, Search Console; TBT: PageSpeed Mobile | Ngưỡng "tốt" của Core Web Vitals | TBT đạt (2026-10-14: 40 ms); INP: Chưa đo |
| PERF-04 | Điểm Performance của PageSpeed Mobile | Không thấp hơn lần đo trước, trừ khi PR ghi lý do | PageSpeed Mobile trước và sau PR có ảnh hưởng hiệu năng | Giữ mức đã đạt; điểm PageSpeed dao động giữa các lần chạy nên lấy trung vị 3 lần | Mốc 90 (2026-10-14) |

Speed Index (5,6 s ngày 2026-10-14) và dung lượng tải trong 10 giây đầu được theo dõi ở [dev/perf.md](../dev/perf.md) nhưng không phải ngân sách chặn.

## 3. Tìm kiếm (SEO kỹ thuật)

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| SEO-01 | Mọi trang trong sitemap index được: không có `X-Robots-Tag: noindex`, thẻ robots `index, follow`, canonical tuyệt đối trên `https://thehot.vn` | `curl -sI`, xem nguồn trang; Search Console URL Inspection | Đạt (2026-10-14) |
| SEO-02 | `sitemap.xml` khớp các trang thật; mỗi URL có `<lastmod>` lấy từ lịch sử git; mọi URL và ảnh trong sitemap trả 200 | `npm run check:sitemap`, `ci/smoke-test.sh` ([ADR 0004](../adr/0004-automate-sitemap-from-page-config-and-git.md)) | Đạt (2026-10-14, mỗi build) |
| SEO-03 | JSON-LD `Restaurant` hợp lệ, không có lỗi nghiêm trọng, và khớp nội dung hiển thị (bất biến I-02 ở [mô hình dữ liệu](../architecture/data-model.md)) | Rich Results Test, validator.schema.org | Đạt về cú pháp (2026-10-14: 2 mục hợp lệ, có cảnh báo không nghiêm trọng) |
| SEO-04 | Tên miền cũ và `www` chuyển hướng 301 về `https://thehot.vn`, giữ đường dẫn | `curl -sI https://thehot.k2-tech.dev/menu` | Đạt (2026-10-14) ([ADR 0002](../adr/0002-use-thehot-vn-as-primary-domain.md)) |
| SEO-05 | Mỗi trang có tiêu đề và mô tả riêng, ảnh chia sẻ (`og:image`) | Xem nguồn trang; Facebook Sharing Debugger | Đạt (2026-10-14, PR #5 và #6) |

## 4. Riêng tư

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| PRIV-01 | Dữ liệu khách nhập vào form đặt bàn không rời trình duyệt và không được lưu | DevTools Network khi gửi form; review code | Đạt (2026-10-14) |
| PRIV-02 | Không tải script nào đặt cookie theo dõi trước khi khách đồng ý | DevTools → Network, Application → Cookies trên trang mới mở | Đạt (2026-10-14: chưa có GA4); áp dụng cho GA4 theo [ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md) |
| PRIV-03 | Trang `/privacy` liệt kê mọi bên thứ ba nhận dữ liệu truy cập của khách | So danh sách request bên thứ ba trên trang với nội dung `/privacy` | Chưa đạt (2026-10-14): beacon Cloudflare Web Analytics chưa được nhắc; mục "Tùy chọn hiển thị" mô tả việc ghi nhớ trong tab không còn đúng với code |
| PRIV-04 | Không gửi tên, số điện thoại hay nội dung khách nhập vào công cụ analytics | Review code; danh sách tham số cho phép | Áp dụng khi triển khai analytics |

## 5. Sẵn sàng và phục hồi

| Mã | Chỉ số | Ngưỡng | Cách đo | Nguồn | Trạng thái |
|---|---|---|---|---|---|
| AVAIL-01 | Tỉ lệ sẵn sàng theo tháng của `https://thehot.vn` | Chưa xác định — cần chủ quán xác nhận | Monitor uptime từ bên ngoài | — | `[CẦN XÁC NHẬN: đã có monitor nào theo dõi thehot.vn chưa]` |
| AVAIL-02 | Deploy lỗi không làm site ngừng lâu | Bản mới không qua healthcheck thì tự quay về image trước | Script deploy trên VPS (chi tiết ở `qkenn04/infra-qkenn`) | [Triển khai](../ops/deployment.md) | Có (2026-10-14) |
| AVAIL-03 | Máy CI tắt không ảnh hưởng site đang chạy | Site vẫn phục vụ khi Jenkins hoặc Harbor ngừng | Kiến trúc: VPS chạy image đã kéo về | [Kiến trúc](../architecture/ARCHITECTURE.md) | Có (2026-10-14) |
| AVAIL-04 | Thời gian từ khi merge PR revert tới khi bản cũ chạy trên production | `[CẦN XÁC NHẬN: chưa chốt ngưỡng]` | Thời lượng build trên Jenkins | Ước lượng thô hiện tại: poll tối đa 5 phút cộng pipeline khoảng 7 phút | Chưa đo |

Site không có dữ liệu riêng cần sao lưu: mọi nội dung nằm trong git; image của từng commit nằm trong Harbor và VPS giữ vài image gần nhất.

## 6. Bảo mật

Chi tiết đe doạ và lớp bảo vệ: [mô hình đe doạ](../security/threat-model.md).

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| SEC-01 | Không có secret trong repo (repo công khai) | Review PR; quét secret | `[CẦN XÁC NHẬN: chưa có công cụ quét secret tự động]` |
| SEC-02 | Container ứng dụng chạy bằng user không phải root | `USER node` trong `Dockerfile` | Đạt (2026-10-14) |
| SEC-03 | Có header bảo mật HSTS, `X-Frame-Options` hoặc CSP `frame-ancestors`, `X-Content-Type-Options` | `curl -sI https://thehot.vn/` | Chưa đạt (2026-10-14: PageSpeed báo thiếu HSTS, CSP, XFO, COOP) |
| SEC-04 | Ứng dụng chỉ nhận traffic qua Cloudflare và nginx; cổng ứng dụng không mở ra Internet | Cấu hình ở `qkenn04/infra-qkenn` | Có theo thiết kế; kiểm ở repo infra |

## 7. Tiếp cận

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| A11Y-01 | Điểm Accessibility của PageSpeed Mobile không giảm so với mốc | PageSpeed Mobile | Mốc 100 (2026-10-14) |
| A11Y-02 | Hiệu ứng tôn trọng `prefers-reduced-motion`; có link "Chuyển đến nội dung" | DevTools, emulate reduced motion; dùng bàn phím | Có (2026-10-14) |

## 8. Vận hành

| Mã | Yêu cầu | Ngưỡng | Cách kiểm | Trạng thái |
|---|---|---|---|---|
| OPS-01 | Mỗi build thành công hoặc thất bại đều có thông báo, phân biệt "build hỏng, VPS không bị đụng" với "deploy hỏng, VPS đã tự quay về" | 100% build | Khối `post` trong `Jenkinsfile`; Jenkins phải có webhook Discord | Một phần (2026-10-15): code có, nhưng lúc sự cố 2026-10-14 webhook chưa được cấu hình nên build hỏng không báo cho ai ([postmortem 001](../ops/postmortems/001-wsl-restart-corrupted-jenkins-git-cache.md)). `[CẦN XÁC NHẬN: đã cấu hình webhook chưa]` |
| OPS-02 | Commit merge vào `main` lên production mà không cần thao tác tay | Poll mỗi 5 phút | `Jenkinsfile` (`pollSCM`) | Có (2026-10-14) |

## 9. Tương thích, dữ liệu và riêng tư

- Trình duyệt: Chrome, Safari, Firefox, Edge bản hiện hành, trên điện thoại và máy tính. Video có bản AV1 kèm bản H.264 dự phòng cho máy không giải mã được AV1.
- Ngôn ngữ: tiếng Việt (`lang="vi"`, Open Graph `vi_VN`). Bản tiếng Anh: Chưa xác định — cần chủ quán xác nhận.
- Múi giờ: giờ sự kiện ghi kèm múi giờ `+07:00` và hiển thị theo `Asia/Ho_Chi_Minh`, không phụ thuộc máy khách.
- Tiền tệ: VND, giá đã gồm VAT.
- Dữ liệu cá nhân: site không thu thập (PRIV-01). Khi thêm analytics, nội dung `/privacy` phải được cập nhật trong cùng PR.

## 10. Mâu thuẫn và chỗ chưa chốt

| Chỉ số | Giá trị A (nguồn) | Giá trị B (nguồn) | Chọn | Ghi chú |
|---|---|---|---|---|
| Giờ mở cửa | 16:30–00:00 (Google Maps, 2026-10-14) | "từ 17:30", "17:30 – Late" (`site.ts`) | Chưa xác định — cần chủ quán xác nhận | Ảnh hưởng SEO-03 và [Đặc tả sản phẩm](spec.md), G4 |
