# Việc sắp làm

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Lộ trình](roadmap.md), [Tiến độ](progress.md), [Mục lục spec](../specs/README.md)

Mốc đang làm: đóng M1; M2, M3, M4 làm song song tuỳ việc nào gỡ chặn trước (2026-10-15: M2 có PR #10 chờ duyệt, M3 đã xong cache); chủ quán bắt đầu M5 ngay ([lộ trình](roadmap.md)). Việc chi tiết của từng tính năng nằm trong `tasks.md` của spec; ở đây chỉ trỏ tới.

Người làm: **Chủ quán** (chủ quán hoặc người quản lý) · **Dev** (code, CI; mọi thay đổi đi qua PR).

## Chủ quán

### Làm ngay

- [ ] TK01 Google Business Profile: đổi giờ mở cửa từ 16:30 sang **17:30** cho khớp website · mốc M5 · xong khi: Google Maps hiện 17:30 · gấp: khách đang thấy giờ sai; từ 2026-10-15 AI Overview của Google cũng hiện "4:30 PM–12 AM", lấy từ Google Maps và TripAdvisor (sửa cả TripAdvisor: TK15)
- [ ] TK02 Cloudflare: xác nhận SSL/TLS đang ở **Full (strict)** · M1 · xong khi: gửi ảnh chụp màn hình (không kiểm được từ bên ngoài)
- [ ] TK03 Search Console: URL Inspection → `https://thehot.vn/terms` → Request indexing · M1 · [001-T31](../specs/001-sitemap-automation/tasks.md)
- [ ] TK04 Search Console → Sitemaps: kiểm *Success* và 6 trang được khám phá · M1 · [001-T32](../specs/001-sitemap-automation/tasks.md)
- [ ] TK05 PageSpeed Insights Mobile `https://thehot.vn` sau build #16, chạy 3 lần, gửi số trung vị cho dev (hoặc dev tự đo) · M1 · xong khi: số vào [tiến độ](progress.md#đo-lường)
- [ ] TK06 Search Console → Settings → Users: thêm quyền cho người cùng làm · M1
- [ ] TK07 Google Business Profile: website `https://thehot.vn/?utm_source=google&utm_medium=gbp`, link đặt chỗ `https://thehot.vn/reservation?utm_source=google&utm_medium=gbp&utm_campaign=booking` · M5 · làm cùng TK01: link từ hồ sơ Google giúp Google gắn site với quán khi tìm tên quán
- [ ] TK08 Trả lời các câu hỏi ở mục [Câu hỏi chờ chủ quán](#câu-hỏi-chờ-chủ-quán) · chặn M2
- [ ] TK15 TripAdvisor: nhận (claim) trang của quán rồi sửa danh mục (đang là Events/Attraction, cần nhà hàng hoặc quán bar), giờ mở cửa (đang 16:30, đúng là 17:30), ghim bản đồ (lệch khoảng 40 m), thêm website `https://thehot.vn` · M5 · [002-T62](../specs/002-onpage-seo/tasks.md) · gấp: AI Overview đọc giờ từ đây; trang này đứng thứ 2 khi tìm tên quán
- [ ] TK16 Thêm `https://thehot.vn` vào tiểu sử Instagram, TikTok và mục Website của trang Facebook `thehot.dalat` (UTM theo [004 mục 4.2](../specs/004-analytics/spec.md#42-quy-ước-utm) nếu muốn đo) · M5 · [002-T61](../specs/002-onpage-seo/tasks.md) · vì: ba trang này đang đứng trên site khi tìm tên quán; link chính chủ từ đó trỏ về site giúp Google nhận site là website chính thức
- [ ] TK17 Sau khi PR #10 lên production: Rich Results Test cho `https://thehot.vn/`, rồi Search Console → URL Inspection → `https://thehot.vn/` → Request indexing · M2 · [002-T26, 002-T27](../specs/002-onpage-seo/tasks.md)
- [x] TK18 Chọn cách xử lý âm thanh video hero: B1 chỉ faststart (giữ âm thanh trong file, khách vẫn chưa nghe được), B2 nút bật tiếng trên video, B3 nút "Xem video có tiếng" mở trình phát riêng · M3 · [Q15](#câu-hỏi-chờ-chủ-quán), [003-T35](../specs/003-performance/tasks.md) · chọn B1, 2026-10-15

### Tiếp theo

- [ ] TK09 Gửi ảnh gốc rộng từ 1600 px, có ảnh ngang (16:9, 4:3) và vuông (1:1) · M2 · [001-T40](../specs/001-sitemap-automation/tasks.md)
- [x] TK10 Cloudflare: Browser Cache TTL "Respect Existing Headers" và Cache Rule "Cache Next images" cho `/_next/image` · M3 · [003-T20, 003-T21](../specs/003-performance/tasks.md) · xong 2026-10-15 (chủ quán)
- [ ] TK11 Tạo GA4 (account, property `thehot.vn`, web stream), gửi Measurement ID · M4 · [004-T20](../specs/004-analytics/tasks.md)
- [ ] TK12 In mã QR link xin đánh giá, đặt ở bàn hoặc kèm hoá đơn · M5
- [ ] TK13 Sửa thông tin quán cho thống nhất trên Facebook, Instagram, TikTok, Bing Places, Apple Business Connect; tạo hoặc nhận trang Foody / ShopeeFood, TripAdvisor · M5
- [ ] TK14 Xem Core Web Vitals của khách thật ở Cloudflare → Analytics & Logs → Web Analytics; quyết định giữ hay tắt khi có Umami · M3, M4

## Dev

### Đang làm, tiếp theo

- [x] TK20 Gỡ nhãn minh hoạ cho sự kiện 16/10 (Friday on Fire) và 17/10 (Hot Saturday), đã được xác nhận là thật; đổi link Facebook và Messenger sang `thehot.dalat` · M2 · [002-T20](../specs/002-onpage-seo/tasks.md) · xong 2026-10-15: PR #8, `ed262e4`, Jenkins build #17
- [ ] TK21 Đo lại PageSpeed sau PR #4 (cùng TK05), đo mốc còn thiếu (Desktop, `/menu`, MB trong 10 s đầu) · M1, M3 · [003-T03, 003-T14](../specs/003-performance/tasks.md)
- [ ] TK22 Facebook Sharing Debugger: Scrape Again cho 7 URL · M1 · [002-T14](../specs/002-onpage-seo/tasks.md)
- [ ] TK23 JSON-LD đợt 1 chỉ với thông tin đã xác nhận (`geo`, `sameAs`, `hasMap`, `WebSite`, `Event` cho sự kiện thật) và `/favicon.ico` · M2 · [002-T21, 002-T22, 002-T26](../specs/002-onpage-seo/tasks.md) · **PR #10 chờ duyệt** (validator.schema.org 0 lỗi, 0 cảnh báo) · xong khi: PR #10 merge, deploy, `/favicon.ico` trả 200
- [x] TK24 Header cache cho tệp `public/` ở reverse proxy · M3 · [003-T22](../specs/003-performance/tasks.md) · xong 2026-10-15: PR #7 của repo `qkenn04/infra-qkenn` (7 ngày); kèm PR #9 (`images.minimumCacheTTL` 7 ngày, build #19)
- [x] TK25 Video hero bước nhanh: faststart, **giữ âm thanh** (`-map 0 -c copy`, mọi track giữ nguyên từng byte; cần `ffmpeg`); nếu chủ quán chọn B2 hoặc B3 thì thêm phần giao diện · M3 · [003-T30, 003-T31, 003-T36](../specs/003-performance/tasks.md) · gộp vào PR #16 (AV1 + 720p faststart, hoãn tải; chủ quán chọn B1), PR #16 merge 2026-10-15, deploy build #27
- [x] TK26 Sửa mục "Tùy chọn hiển thị" đang sai ở `/privacy` (nói về `sessionStorage` đã bỏ từ `d0a8e34`): gộp vào 003 phần E hoặc 004 PR A, tuỳ cái nào làm trước · [003-T51](../specs/003-performance/tasks.md), [004-T15](../specs/004-analytics/tasks.md) · PR #13 merge 2026-10-15
- [x] TK27 Hạ tầng Umami (repo hạ tầng riêng, private), lấy Website ID (2026-10-15) · M4 · [004-T03](../specs/004-analytics/tasks.md)
- [ ] TK28 Dọn tệp template NOKTO không còn dùng trong `public/sites/nokto/` · M2 · [002-T32](../specs/002-onpage-seo/tasks.md)
- [x] TK30 Menu Premium: tab thứ hai ở `/menu` (12 trang ảnh) và `/menu/list` (104 món kèm giá, tên tiếng Anh) · M2 · PR #15 merge 2026-10-15, deploy build #25; mô tả mới áp dụng 2026-10-15; còn chờ chủ quán trả lời Q16–Q24 ([002-T16](../specs/002-onpage-seo/tasks.md))
- [ ] TK29 Theo dõi kết quả tìm tên quán "the hot beer garden đà lạt": vị trí của `thehot.vn`, tiêu đề mới, biểu tượng The Hot thay quả địa cầu (dịch vụ favicon của Google đã trả logo từ 2026-10-15) · M2, M6 · [002-T60, 002-T63](../specs/002-onpage-seo/tasks.md)

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
| Q9 | Điện thoại: phát video hero (hoãn tải) hay chỉ hiện poster? Đề xuất: phát. **Trả lời 2026-10-15: phát, hoãn tải** | 003 phần B | — (PR #16) | 2026-10-14 |
| Q10 | Duyệt chất lượng video sau encode. **Trả lời 2026-10-15: AV1 CRF 48, H.264 720p CRF 27** | 003 phần B | — (PR #16) | khi có bản encode |
| Q11 | Duyệt màn hình chờ ngắn hơn và chữ hero hiện ngay (cùng `kennle04`) | 003 phần E | 003-T50 | khi có bản thử |
| Q12 | Duyệt đổi subset font (lệch kerning nhẹ) | 003 phần F | 003-T52 | 2026-10-14 |
| Q13 | Thông tin cho hỏi đáp: chỗ để xe, nhóm đông tối đa bao nhiêu người | 002 phần F | 002-T40 | 2026-10-14 |
| Q14 | Các câu hỏi về analytics (tài khoản GA4, thời gian lưu, ai xem số liệu, chữ banner, `/privacy`, Cloudflare Web Analytics) | 004 | 004-T02 | 2026-10-14 |
| Q15 | Âm thanh video hero (chủ quán muốn giữ): B1 chỉ faststart, B2 nút bật tiếng, hay B3 trình phát "Xem video có tiếng"? **Trả lời 2026-10-15: B1** | 003 phần B, [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md) | — (PR #16) | 2026-10-15 |
| Q16 | Giá bia trong menu vẫn chỉ áp dụng Chủ nhật đến thứ Năm? (PDF menu không ghi điều kiện này; website đang ghi theo `site.beerOffer`) | `/menu`, `/menu/list`, mô tả trang `/menu` | Giữ nguyên `site.beerOffer` tới khi có trả lời; 002-T16 | 2026-10-15 |
| Q17 | Giá rượu, vang và tháp trong menu Premium tính theo chai hay ly? Rượu mơ / táo mèo 55 là ly hay chai? Theo bố cục trang, website hiểu 670 là giá vang Rivage, 759 là giá Chateau du Pin, 55 là giá chung của rượu mơ và rượu táo mèo: đúng không? | `/menu/list` phần đồ uống | Ghi đơn vị giá đồ uống | 2026-10-15 |
| Q18 | Trang menu "Răng mực sốt bơ cay" (trang Món ăn chơi về mực) dùng nhầm ảnh món bắp sốt bơ cay; chủ quán có sửa ảnh trên Canva và đăng lại không? | Ảnh trang menu lật sách | Thay ảnh trang đó | 2026-10-15 |
| Q19 | Link menu PDF trên Google Drive đang dùng ở đâu (QR trên bàn, Google Business, bio Instagram)? Đề xuất đổi sang `https://thehot.vn/menu` khi website có đủ menu | QR, Google Business, mạng xã hội | Đổi link menu | 2026-10-15 |
| Q20 | Menu Premium in trùng hai dòng: "Mực một nắng cháy tỏi 213" (trang Mồi bén lai rai) và "Tôm sú cháy kim chi 278" (trang Chuyện nhà tôm), mỗi dòng hai lần; website ghi mỗi món một lần. Dòng thứ hai có phải là món khác bị in nhầm tên không? ("Mực 1 nắng cháy tiêu xanh 213" trong hình ở trang mồi được ghi là một món riêng) | `/menu/list`, file Canva | Sửa bản chữ nếu là món khác | 2026-10-15 |
| Q21 | Tên tiếng Anh có thể sai, website đang giữ chữ in: "Mực cơm chiên mắm" = Fried Rice Field Squid With Fish Sauce; "Mực khô lắc mắm khoai lang" = Grilled Dried Squid With Sweet Potato Fish Sauce; "Ba chỉ một nắng cuốn lá mơ" = … With Hog Plum Leaves; "Cơm chiên dưa bò" = Beef & Pickled Cucumber Fried Rice. Sửa thành gì? | Tên tiếng Anh ở `/menu/list`, file Canva | — | 2026-10-15 |
| Q22 | Tên món trong combo khác tên ở trang món lẻ, có phải cùng món không: "Bò xào luklak" / "Bò lúc lắc"; "Gỏi tai heo bóp rau răm" / "Tai heo bóp gỏi rau răm"; "Mực khô lắc khoai lang" / "Mực khô lắc mắm khoai lang"; "Nem chả trộn chua cay" / "… kiểu Huế"? Bia trong combo (6 hoặc 8 Tiger) là loại nào (ảnh là Tiger Crystal)? | Mô tả combo ở `/menu/list` | — | 2026-10-15 |
| Q23 | "Thố tiềm tam sung sung" (508): tên đúng chưa, thuộc nhóm lẩu ("Sục sôi") hay canh ("Hồi sức")? Website đang xếp vào "Hồi sức" | `/menu/list` | — | 2026-10-15 |
| Q24 | Mỗi mẹt (gà rực lửa, núi rừng Tây Bắc, The Hot) cho mấy người, có tên tiếng Anh không? "Jager Bomb Tower" in thành phần không có Jagermeister: đúng không? | `/menu/list` | — | 2026-10-15 |

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
- [x] Sự kiện 16/10, 17/10 bỏ nhãn minh hoạ; link Facebook, Messenger sang `thehot.dalat` · PR #8, `ed262e4`, Jenkins build #17 (2026-10-15)
- [x] Bộ tài liệu dự án vào `main` · PR #7, merge `eee3c04` (2026-10-15)
- [x] Cache: Cloudflare Browser Cache TTL + Cache Rule `/_next/image` (chủ quán); header 7 ngày cho `/videos`, `/images`, `/sites` (repo `qkenn04/infra-qkenn` PR #7); `images.minimumCacheTTL` 7 ngày (PR #9, `6c246e1`, Jenkins build #19); lần gọi thứ hai `cf-cache-status: HIT` (2026-10-15)
