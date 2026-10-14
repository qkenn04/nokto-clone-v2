# Việc sắp làm

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Lộ trình](roadmap.md), [Tiến độ](progress.md), [Mục lục spec](../specs/README.md)

Mốc đang làm: đóng M1; M2, M3, M4 làm song song tuỳ việc nào gỡ chặn trước; chủ quán bắt đầu M5 ngay ([lộ trình](roadmap.md)). Việc chi tiết của từng tính năng nằm trong `tasks.md` của spec; ở đây chỉ trỏ tới.

Người làm: **Chủ quán** (chủ quán hoặc người quản lý) · **Dev** (code, CI; mọi thay đổi đi qua PR).

## Chủ quán

### Làm ngay

- [ ] TK01 Google Business Profile: đổi giờ mở cửa từ 16:30 sang **17:30** cho khớp website · mốc M5 · xong khi: Google Maps hiện 17:30 · gấp: khách đang thấy giờ sai
- [ ] TK02 Cloudflare: xác nhận SSL/TLS đang ở **Full (strict)** · M1 · xong khi: gửi ảnh chụp màn hình (không kiểm được từ bên ngoài)
- [ ] TK03 Search Console: URL Inspection → `https://thehot.vn/terms` → Request indexing · M1 · [001-T31](../specs/001-sitemap-automation/tasks.md)
- [ ] TK04 Search Console → Sitemaps: kiểm *Success* và 6 trang được khám phá · M1 · [001-T32](../specs/001-sitemap-automation/tasks.md)
- [ ] TK05 PageSpeed Insights Mobile `https://thehot.vn` sau build #16, chạy 3 lần, gửi số trung vị cho dev (hoặc dev tự đo) · M1 · xong khi: số vào [tiến độ](progress.md#đo-lường)
- [ ] TK06 Search Console → Settings → Users: thêm quyền cho người cùng làm · M1
- [ ] TK07 Google Business Profile: website `https://thehot.vn/?utm_source=google&utm_medium=gbp`, link đặt chỗ `https://thehot.vn/reservation?utm_source=google&utm_medium=gbp&utm_campaign=booking` · M5
- [ ] TK08 Trả lời các câu hỏi ở mục [Câu hỏi chờ chủ quán](#câu-hỏi-chờ-chủ-quán) · chặn M2

### Tiếp theo

- [ ] TK09 Gửi ảnh gốc rộng từ 1600 px, có ảnh ngang (16:9, 4:3) và vuông (1:1) · M2 · [001-T40](../specs/001-sitemap-automation/tasks.md)
- [ ] TK10 Cloudflare: Browser Cache TTL "Respect Existing Headers" và Cache Rule cho `/_next/image` (hoặc cấp quyền cho dev làm) · M3 · [003-T20, 003-T21](../specs/003-performance/tasks.md)
- [ ] TK11 Tạo GA4 (account, property `thehot.vn`, web stream), gửi Measurement ID · M4 · [004-T20](../specs/004-analytics/tasks.md)
- [ ] TK12 In mã QR link xin đánh giá, đặt ở bàn hoặc kèm hoá đơn · M5
- [ ] TK13 Sửa thông tin quán cho thống nhất trên Facebook, Instagram, TikTok, Bing Places, Apple Business Connect; tạo hoặc nhận trang Foody / ShopeeFood, TripAdvisor · M5
- [ ] TK14 Xem Core Web Vitals của khách thật ở Cloudflare → Analytics & Logs → Web Analytics; quyết định giữ hay tắt khi có Umami · M3, M4

## Dev

### Đang làm, tiếp theo

- [ ] TK20 Gỡ nhãn minh hoạ cho sự kiện 16/10 (Friday on Fire) và 17/10 (Hot Saturday), đã được xác nhận là thật · M2 · [002-T20](../specs/002-onpage-seo/tasks.md) · xong khi: deploy trước 16/10
- [ ] TK21 Đo lại PageSpeed sau PR #4 (cùng TK05), đo mốc còn thiếu (Desktop, `/menu`, MB trong 10 s đầu) · M1, M3 · [003-T03, 003-T14](../specs/003-performance/tasks.md)
- [ ] TK22 Facebook Sharing Debugger: Scrape Again cho 7 URL · M1 · [002-T14](../specs/002-onpage-seo/tasks.md)
- [ ] TK23 JSON-LD đợt 1 chỉ với thông tin đã xác nhận (`geo`, `sameAs`, `hasMap`, `WebSite`, `Event` cho sự kiện thật) · M2 · [002-T21, 002-T22](../specs/002-onpage-seo/tasks.md)
- [ ] TK24 Header cache cho tệp `public/` ở reverse proxy (PR ở repo hạ tầng riêng) · M3 · [003-T22](../specs/003-performance/tasks.md)
- [ ] TK25 Video hero bước nhanh: faststart + bỏ âm thanh (cần `ffmpeg`) · M3 · [003-T30, 003-T31](../specs/003-performance/tasks.md)
- [ ] TK26 Sửa mục "Tùy chọn hiển thị" đang sai ở `/privacy` (nói về `sessionStorage` đã bỏ từ `d0a8e34`): gộp vào 003 phần E hoặc 004 PR A, tuỳ cái nào làm trước · [003-T51](../specs/003-performance/tasks.md), [004-T15](../specs/004-analytics/tasks.md)
- [ ] TK27 Hạ tầng Umami (repo hạ tầng riêng, private), lấy Website ID · M4 · [004-T03](../specs/004-analytics/tasks.md)
- [ ] TK28 Dọn tệp template NOKTO không còn dùng trong `public/sites/nokto/` · M2 · [002-T32](../specs/002-onpage-seo/tasks.md)

### Để sau

- [ ] Gửi Core Web Vitals về Umami: sau M4 · [003-T63](../specs/003-performance/tasks.md)
- [ ] Đổi subset font: chờ duyệt · [003-T52](../specs/003-performance/tasks.md)
- [ ] Tách video khỏi git: không chặn việc nào ([lộ trình mục 4](roadmap.md#4-để-sau-phiên-bản-đầu))

## Câu hỏi chờ chủ quán

Mỗi câu chặn việc ghi ở cột "Chặn"; chưa có câu trả lời thì để `[CẦN XÁC NHẬN]` trong spec, không đoán.

| # | Câu hỏi | Dùng cho | Chặn | Từ ngày |
|---|---|---|---|---|
| Q1 | Giờ đóng cửa: 00:00 hay 00:30? Mở mọi ngày trong tuần? Chưa xác định, cần chủ quán xác nhận | JSON-LD giờ mở cửa, Google Business Profile, hỏi đáp | 002-T23, TK01 (giờ đóng) | 2026-10-14 |
| Q2 | Có nhạc sống không; nếu có thì tối nào (sự kiện thứ Sáu ghi "Live performance")? | `amenityFeature`, thuộc tính hồ sơ Google, alt, tiêu đề | 002-T23, 002-T30 | 2026-10-14 |
| Q3 | Khoảng giá phổ biến? | `priceRange`, mức giá trên Google Maps | 002-T23 | 2026-10-14 |
| Q4 | Hình thức thanh toán nhận (tiền mặt, chuyển khoản, thẻ, ví)? | `paymentAccepted`, thuộc tính hồ sơ Google | 002-T23 | 2026-10-14 |
| Q5 | Chuỗi địa chỉ chính xác như đang ghi trên Google Business Profile? | Thông tin nhất quán mọi nơi (M5), địa chỉ trong JSON-LD | TK13 | 2026-10-14 |
| Q6 | Gửi ảnh ngang độ phân giải cao (từ 1600 px; 16:9, 4:3, 1:1) | Đổi tên ảnh, `Restaurant.image`, ảnh chia sẻ riêng | 001-T40, 002-T25, 002-T31 | 2026-10-14 |
| Q7 | Có logo SVG gốc không? | Logo nét và nhẹ nhất; `logo` trong JSON-LD | — | 2026-10-14 |
| Q8 | Xác nhận SSL/TLS Full (strict) trong Cloudflare | Đóng M1 | TK02 | 2026-10-14 |
| Q9 | Điện thoại: phát video hero (hoãn tải) hay chỉ hiện poster? Đề xuất: phát | 003 phần B | 003-T33 | 2026-10-14 |
| Q10 | Duyệt chất lượng video sau encode | 003 phần B | 003-T32 | khi có bản encode |
| Q11 | Duyệt màn hình chờ ngắn hơn và chữ hero hiện ngay (cùng `kennle04`) | 003 phần E | 003-T50 | khi có bản thử |
| Q12 | Duyệt đổi subset font (lệch kerning nhẹ) | 003 phần F | 003-T52 | 2026-10-14 |
| Q13 | Thông tin cho hỏi đáp: chỗ để xe, nhóm đông tối đa bao nhiêu người | 002 phần F | 002-T40 | 2026-10-14 |
| Q14 | Các câu hỏi về analytics (tài khoản GA4, thời gian lưu, ai xem số liệu, chữ banner, `/privacy`, Cloudflare Web Analytics) | 004 | 004-T02 | 2026-10-14 |

Danh sách đầy đủ cho analytics: [004 spec mục 12](../specs/004-analytics/spec.md#12-câu-hỏi-mở).

## Vừa xong

- [x] Tên miền chính `thehot.vn`, bỏ `noindex`; tên miền cũ 301 · `7af5058`, Jenkins build #10 (2026-10-14)
- [x] Chủ quán: CNAME `www` (proxied), Always Use HTTPS (2026-10-14)
- [x] Chủ quán: Search Console Domain property xác minh bằng DNS TXT, gửi sitemap, Request indexing 5 URL, Test live URL đạt (2026-10-14)
- [x] Chủ quán: Bing Webmaster Tools import từ Search Console (2026-10-14)
- [x] Sitemap tự động · PR #3, Jenkins build #11 (2026-10-14)
- [x] Đo mốc PageSpeed Mobile: 90 / LCP 2,9 s (2026-10-14 16:41)
- [x] Ưu tiên LCP và logo, tiêu đề và mô tả, ảnh chia sẻ · PR #4, #5, #6; `90f1882`, Jenkins build #16 (2026-10-14)
- [x] Khôi phục CI sau sự cố WSL khởi động lại giữa build; viết [runbook 001](../ops/runbooks/001-jenkins-git-cache-corrupted.md) (2026-10-14)
- [x] Chuyển ghi chú kế hoạch SEO, sitemap, tốc độ, analytics vào `docs/plan` và `docs/specs` (2026-10-14)
