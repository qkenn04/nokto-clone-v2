# 002: SEO trên trang

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Mục lục spec](../README.md), [plan.md](plan.md), [tasks.md](tasks.md), [Mục lục ADR](../../adr/README.md) (ADR 0005), [Lộ trình M1, M2](../../plan/roadmap.md#m2-on-page-và-dữ-liệu-có-cấu-trúc)

Những gì Google, Facebook và Zalo đọc được từ chính các trang của https://thehot.vn: tiêu đề và mô tả trong kết quả tìm kiếm, ảnh khi chia sẻ link, dữ liệu có cấu trúc (JSON-LD) về quán, chữ alt của ảnh và phần chữ giới thiệu trên trang. Mục tiêu là để người tìm "quán nhậu chill Đà Lạt", "beer garden Đà Lạt" hay tên quán thấy đúng trang, với thông tin khớp Google Business Profile.

Hiện thực: phần A (tiêu đề, mô tả) và phần B (ảnh chia sẻ) chạy trên production từ Jenkins build #16 (PR #5, PR #6). Phần C: sự kiện 16/10, 17/10 đã bỏ nhãn minh hoạ (PR #8, Jenkins build #17, 2026-10-15); JSON-LD đợt 1 và `/favicon.ico` ở PR #10, chờ duyệt (2026-10-15); giờ đóng cửa, khoảng giá, thanh toán, nhạc sống chờ chủ quán trả lời (mục 12). Phần D–F chưa làm. Trạng thái chi tiết ở [tasks.md](tasks.md).

## 1. Mục tiêu

1. Mỗi trang có `<title>` chứa cụm từ người ta thật sự tìm, kèm tên quán; trang chủ không tốn nửa tiêu đề cho slogan.
2. Mỗi trang (trừ trang chủ và `/privacy`, giữ nguyên theo chủ quán) có mô tả khoảng 120–155 ký tự, có từ khoá chính, một thông tin thật (địa chỉ, giờ, giá) và lời kêu gọi.
3. Link của mọi trang khi chia sẻ lên Facebook, Messenger, Zalo đều có ảnh.
4. JSON-LD mô tả quán đầy đủ và đúng, qua Rich Results Test không lỗi; chỉ chứa thông tin đã được chủ quán xác nhận.
5. Ảnh có nội dung có alt mô tả; trang chủ có chữ giới thiệu và phần hỏi đáp hiển thị thật.

## 2. Câu chuyện người dùng

| # | Là | Tôi muốn | Để |
|---|---|---|---|
| U1 | Người tìm quán nhậu ở Đà Lạt | thấy tiêu đề và mô tả nói rõ quán là gì, ở đâu, mở mấy giờ | quyết định bấm vào |
| U2 | Khách gửi link menu cho hội bạn qua Zalo | link hiện ảnh và tiêu đề đúng trang | bạn bè mở xem |
| U3 | Google | đọc được toạ độ, giờ, mạng xã hội, sự kiện của quán | ghép đúng website với hồ sơ Google Maps |
| U4 | Chủ quán | site và Google Maps nói cùng một giờ mở cửa | khách không đến sai giờ |

## 3. Giao diện

Phần A–E không đổi giao diện: chỉ thẻ `<head>`, JSON-LD và thuộc tính `alt`. Phần F (chữ giới thiệu, hỏi đáp) thêm nội dung hiển thị, cần duyệt thiết kế (chủ quán và `kennle04`).

**Từ khoá nhắm** (gợi ý tìm kiếm thật của Google, lấy ngày 2026-10-14):

| Nhóm | Từ khoá | Trang nhắm |
|---|---|---|
| Tên quán | the hot beer garden đà lạt, the hot beer garden đà lạt menu | `/`, `/menu` |
| Quán nhậu | quán nhậu đà lạt chill / về đêm / ngon / ngon rẻ, quán nhậu chill đà lạt | `/`, `/about` |
| Bia | quán bia chill / bia lạnh / bia tươi đà lạt, beer garden đà lạt | `/`, `/menu/list` |
| Giải trí | quán nhạc sống đà lạt, đà lạt về đêm có gì chơi / nên đi đâu / ăn gì | Trang mới (M5) |
| Câu hỏi | đà lạt về đêm có lạnh không, đà lạt về đêm bao nhiêu độ | Bài viết mới (M5) |
| "gần đây" | quán nhậu đà lạt gần đây | Chỉ Google Maps quyết định (M5) |

Chỉ nhắm từ khoá đúng với quán: "nhạc sống", "view đẹp", "bình dân" chỉ dùng khi quán thật sự như vậy.

### Phần A: tiêu đề và mô tả (xong)

Trang con có tiêu đề dạng `<tiêu đề> — The Hot Beer Garden Đà Lạt`. Giá trị đã được chủ quán duyệt ngày 2026-10-14:

| Trang | `<title>` | Mô tả |
|---|---|---|
| `/` | The Hot Beer Garden Đà Lạt — Quán nhậu chill, bia lạnh | Giữ nguyên mô tả cũ (slogan + địa chỉ + 17:30 + hotline). Thẻ chia sẻ (Open Graph, Twitter) giữ tiêu đề slogan "The Hot Beer Garden Đà Lạt — Đà Lạt lên đèn, The Hot lên mood." |
| `/menu` | Menu — The Hot Beer Garden Đà Lạt | Menu nhậu The Hot Beer Garden Đà Lạt: món ăn từ 39K, giá đã gồm VAT. Bia ưu đãi từ 19K, Chủ nhật đến thứ Năm. Lật menu, chốt món rồi đặt bàn. |
| `/menu/list` | Bảng giá món nhậu & bia — The Hot Beer Garden Đà Lạt | Bảng giá món nhậu The Hot Đà Lạt: món ăn chơi, salad, gà, mực, heo, bò từ 39.000₫, giá đã gồm VAT. Bia ưu đãi Chủ nhật đến thứ Năm. |
| `/about` | Beer garden chill cho hội bạn — The Hot Beer Garden Đà Lạt | The Hot là beer garden cho hội bạn ở Đà Lạt: chỗ ngồi ngoài trời, mồi bén, bia lạnh, nhạc lên. Ghé 28 Sương Nguyệt Ánh, P. Lâm Viên từ 17:30. |
| `/reservation` | Đặt bàn quán nhậu cho hội bạn — The Hot Beer Garden Đà Lạt | Đặt bàn cho hội bạn tại The Hot Beer Garden Đà Lạt: chọn ngày, giờ, số người rồi chốt qua hotline 0967 539 939 hoặc Facebook. 28 Sương Nguyệt Ánh. |
| `/terms` | Giờ mở cửa & địa chỉ — The Hot Beer Garden Đà Lạt | The Hot Beer Garden Đà Lạt mở cửa từ 17:30 tại 28 Sương Nguyệt Ánh, P. Lâm Viên. Cách đặt bàn, nhóm đông, giá và ưu đãi bia. Hotline 0967 539 939. |
| `/privacy` | Bảo mật thông tin — The Hot Beer Garden Đà Lạt | Giữ nguyên |

H1 và slogan trên giao diện không đổi.

**Mô tả mới cho `/menu` và `/menu/list` (chủ quán duyệt bản xem thử 2026-10-15, đã áp dụng trong `page-meta.ts`).** Từ khi có menu Premium (combo, lẩu, mẹt, rượu), mô tả cũ chỉ nói món ăn chơi. Bản đề xuất bỏ câu "Bia ưu đãi Chủ nhật đến thứ Năm" vì menu PDF không ghi điều kiện này ([Q16](../../plan/tasks.md#câu-hỏi-chờ-chủ-quán)); nếu chủ quán xác nhận ưu đãi còn áp dụng thì thêm lại "Bia từ 19K, Chủ nhật đến thứ Năm":

| Trang | Mô tả | Độ dài |
|---|---|---|
| `/menu` | Menu The Hot Beer Garden Đà Lạt: mồi từ 39K, combo cho 4 và 6 người kèm bia, lẩu, mẹt, rượu và tháp bia. Giá đã gồm VAT. Lật menu, chốt món rồi đặt bàn. | 152 ký tự |
| `/menu/list` | Bảng giá The Hot Đà Lạt: mồi từ 39.000₫, combo cho 4 và 6 người kèm bia Tiger, lẩu, mẹt, món heo, bò, gà, tôm, rượu và vang. Giá đã gồm VAT. | 140 ký tự |

### Phần B: ảnh chia sẻ (xong)

Mọi trang có `og:image` là thẻ chia sẻ chung `/opengraph-image.png` (1200×630). Trang con có alt của ảnh là tiêu đề slogan. Ảnh riêng cho từng trang thuộc phần E.

### Phần C: dữ liệu có cấu trúc (PR #10, chờ duyệt)

Đích (mọi trường đánh dấu `[CẦN XÁC NHẬN]` chỉ thêm khi chủ quán đã trả lời). Cột "PR #10" ghi trường nào đã có trong PR #10 (mở 2026-10-15; validator.schema.org 0 lỗi, 0 cảnh báo):

| Trường | Giá trị | Nguồn | PR #10 |
|---|---|---|---|
| `@type` | `["Restaurant", "BarOrPub"]` | Đề xuất | Có |
| `geo` | `GeoCoordinates` 11.950599, 108.456165 | Toạ độ Google Maps của quán | Có |
| `sameAs` | Instagram `https://www.instagram.com/thehot.dalat/`; TikTok `https://www.tiktok.com/@thehot.dalat`; Facebook `https://www.facebook.com/thehot.dalat/` (cùng trang cũ `thehotbeergardendalat`, đổi tên; PR #8 sửa link trên site); Google `https://www.google.com/search?kgmid=/g/11yff9m3ws`; TripAdvisor `https://www.tripadvisor.com.vn/Attraction_Review-g293922-d33307586-Reviews-The_Hot_Beer_Garden-Da_Lat_Lam_Dong_Province.html` | Trang mạng xã hội của quán; Knowledge Graph ID của hồ sơ Google; trang TripAdvisor đã đối chiếu cùng địa chỉ, điện thoại, trang Facebook | Có |
| `hasMap` | Link hồ sơ Google của quán (`https://share.google/GzxQd0SE6t7QogToT`) | Hồ sơ Google | Có |
| `logo` | Logo của quán (`/sites/the-hot-beer-garden/images/logo.png`; bản SVG nếu có) | `site.ts` | Có (PNG) |
| `image` | 3–5 ảnh thật, ưu tiên ảnh ngang chất lượng cao | Chờ ảnh (001-T40) | Tạm: 5 ảnh gallery + ảnh chia sẻ |
| `openingHoursSpecification` | Mở 17:30 (chủ quán xác nhận 2026-10-14). Giờ đóng cửa và các ngày mở: [CẦN XÁC NHẬN: giờ đóng cửa (00:00 hay 00:30?) và quán mở mọi ngày trong tuần không — chưa xác định, cần chủ quán xác nhận] | Chủ quán | Chưa (`pendingFacts`, để trống) |
| `priceRange` | [CẦN XÁC NHẬN: khoảng giá — chưa xác định, cần chủ quán xác nhận] | Chủ quán | Chưa (`pendingFacts`) |
| `paymentAccepted` | [CẦN XÁC NHẬN: hình thức thanh toán — chưa xác định, cần chủ quán xác nhận] | Chủ quán | Chưa (`pendingFacts`) |
| `amenityFeature` | Chỗ ngồi ngoài trời. Nhạc sống: [CẦN XÁC NHẬN: có nhạc sống không, tối nào — chưa xác định, cần chủ quán xác nhận] | Hồ sơ Google ghi cả hai; chỉ dùng "nhạc sống" khi chủ quán xác nhận | Chỗ ngồi ngoài trời: có. Nhạc sống: chưa (`pendingFacts`) |
| Khác | `acceptsReservations` (URL `/reservation`), `hasMenu` (`/menu`), `servesCuisine`, `currenciesAccepted` | `site.ts` | Có |
| Nút `WebSite` | `name` "The Hot Beer Garden" (tên site Google hiện trong kết quả), `alternateName`, `url`, `inLanguage: vi-VN`, `publisher` trỏ về quán; không có `SearchAction` (site không có ô tìm kiếm) | Đề xuất | Có |
| Nút `Event` | Chỉ cho sự kiện thật (không có `illustrative`). Chủ quán xác nhận hai sự kiện 16/10 (Friday on Fire, 19:00–00:30) và 17/10 (Hot Saturday, 19:30–00:30) là thật; PR #8 (2026-10-15) đã bỏ `illustrative` và nhãn "Chương trình minh hoạ" của hai sự kiện này. Chỉ xuất trên `/`, trang hiện dòng sự kiện | Dữ liệu sự kiện trên trang chủ | Có: 16/10, 17/10 và "Sạc pin đêm" 10/10 (chỉ có ngày); không có `offers` |

Không dùng `FAQPage`: từ 2023 Google chỉ hiện kết quả hỏi đáp cho trang chính phủ và y tế.

### Phần D: alt của ảnh (chưa làm)

Ảnh có nội dung (món ăn, không gian, menu, sự kiện) có alt mô tả, chứa từ khoá tự nhiên. 12 trang ảnh menu Premium đã có alt liệt kê món chính (`menuPages.ts`, 2026-10-15). Ảnh trang trí giữ `alt=""`. Chỉ dùng "nhạc sống" khi chủ quán xác nhận.

### Phần E: ảnh chia sẻ riêng từng trang (chưa làm)

Mỗi trang chính có ảnh chia sẻ 1200×630 riêng, làm từ ảnh ngang thật của quán. Chặn bởi ảnh (001-T40).

### Phần F: chữ trên trang (chưa làm, cần duyệt)

- Đoạn giới thiệu khoảng 200–300 chữ ở trang chủ, chứa tự nhiên các cụm quán nhậu chill Đà Lạt, beer garden, bia lạnh, Đà Lạt về đêm, hội bạn. Chữ hiển thị thật, không giấu chữ.
- Một tiêu đề phụ (H2) có từ khoá bên cạnh H1 dạng slogan.
- Phần hỏi đáp hiển thị (không schema): mở mấy giờ, có nhạc sống không, chỗ để xe, nhóm đông, Đà Lạt tối có lạnh không. Câu trả lời cần thông tin thật từ chủ quán.
- Link nội bộ dùng chữ mô tả rõ, ví dụ "xem menu nhậu", "đặt bàn cho nhóm".

## 4. Dữ liệu

Site không có cơ sở dữ liệu. Thông tin quán lấy từ `src/components/sites/nokto/site.ts` (tên, địa chỉ, hotline, giờ mở, mạng xã hội); tiêu đề và mô tả ở `src/seo/page-meta.ts`; sự kiện ở `src/components/sites/the-hot/home/content.ts` (`homeEvents`). Đề xuất thêm vào `site.ts` khi có xác nhận: toạ độ, các link `sameAs`, giờ đóng cửa, khoảng giá, hình thức thanh toán.

## 5. API

Không có API.

## 6. Quy tắc và kiểm tra

1. Một nguồn cho mỗi thông tin: giờ mở cửa, địa chỉ, hotline chỉ khai ở `site.ts`; tiêu đề, mô tả, JSON-LD và nội dung trang đọc từ đó.
2. JSON-LD chỉ chứa thông tin đã xác nhận; thông tin chưa xác nhận thì bỏ trường, không đoán.
3. Giờ mở cửa trên site, trong JSON-LD và trên Google Business Profile phải giống nhau.
4. `Event` chỉ có cho sự kiện không mang nhãn minh hoạ và có ngày giờ cụ thể.
5. Tiêu đề và mô tả không nhắc thông tin chưa xác nhận (ví dụ "nhạc sống").

## 7. Trạng thái trống, lỗi, đang tải

Không áp dụng (nội dung tĩnh, sinh lúc build). Khi thiếu thông tin chưa xác nhận: bỏ trường JSON-LD tương ứng.

## 8. Tiêu chí nghiệm thu

Loại kiểm: xem [mục lục spec, mục 4](../README.md#4-quy-ước).

| Mã | Cho (Given) | Khi (When) | Thì (Then) | Loại |
|---|---|---|---|---|
| 002-AC-01 | Production | Đọc `<title>` của 7 trang | Đúng chuỗi ở bảng phần A | E |
| 002-AC-02 | Production | Đọc `<meta name="description">` của 5 trang con có mô tả mới | Đúng chuỗi ở bảng phần A, dài 120–155 ký tự | E |
| 002-AC-03 | Production | Đọc `og:image` của 7 trang | URL tuyệt đối, có width/height, ảnh trả 200 `image/png` | E |
| 002-AC-04 | Đã deploy phần C | Rich Results Test và validator.schema.org cho `https://thehot.vn/` | Không lỗi; nhận Local business (và Event nếu có) | E |
| 002-AC-05 | Đã deploy phần C | Đối chiếu từng trường JSON-LD | Mỗi giá trị có nguồn ở `site.ts` hoặc câu trả lời đã ghi của chủ quán | M |
| 002-AC-06 | `homeEvents` có sự kiện minh hoạ | Build | JSON-LD không có `Event` cho sự kiện minh hoạ | M |
| 002-AC-07 | Đã deploy phần D | Rà ảnh trên 7 trang | Ảnh nội dung có alt khác rỗng; ảnh trang trí `alt=""` | M |
| 002-AC-08 | Đã deploy phần B hoặc E | Facebook Sharing Debugger từng URL (bấm Scrape Again) | Hiện ảnh và tiêu đề đúng trang | E |
| 002-AC-09 | Đã deploy phần F | Search Console → URL Inspection → Test live URL trang chủ | Ảnh chụp thấy đoạn giới thiệu và hỏi đáp | E |

## 9. Ngoài phạm vi

- Google Business Profile, đánh giá, trang trích dẫn: M5.
- Trang mới `/su-kien`, bài viết: M5 (spec mới khi bắt đầu).
- Thay ảnh nền template `hero-backdrop.jpg`: chủ quán quyết định giữ (2026-10-14); xem lại khi có ảnh của quán.
- Thứ tự tải và tốc độ: [003](../003-performance/spec.md).

## 10. Phụ thuộc

- Cần: [001](../001-sitemap-automation/spec.md) (quy ước ảnh thật, ảnh mới cho `Restaurant.image`); câu trả lời của chủ quán (mục 12); ảnh ngang chất lượng cao (phần C `image`, phần E).
- Liên quan: M5 sửa giờ mở cửa trên Google Business Profile cho khớp site.

## 11. Mốc

Phần A, B: M1. Phần C–F: M2 ([lộ trình](../../plan/roadmap.md#m2-on-page-và-dữ-liệu-có-cấu-trúc)).

## 12. Câu hỏi mở

- [CẦN XÁC NHẬN: giờ đóng cửa (00:00 hay 00:30?) và các ngày mở trong tuần — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: có nhạc sống không; nếu có thì tối nào (sự kiện thứ Sáu ghi "Live performance") — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: khoảng giá phổ biến (dùng cho `priceRange` và Google Maps) — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: hình thức thanh toán (tiền mặt, chuyển khoản, thẻ, ví) — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: có logo SVG gốc không — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: thông tin cho phần hỏi đáp (chỗ để xe, nhóm đông tối đa bao nhiêu người) — chưa xác định, cần chủ quán xác nhận]

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo từ ghi chú kế hoạch SEO; phần A, B theo bản đã merge (PR #5, #6); trạng thái Đang áp dụng |
| 2026-10-15 | Phần C: nhãn sự kiện 16/10, 17/10 đã gỡ (PR #8); link Facebook mới `thehot.dalat`; thêm TripAdvisor vào `sameAs`; cột trạng thái theo PR #10 (chờ duyệt) |
| 2026-10-15 | Phần A: đề xuất mô tả mới cho `/menu`, `/menu/list` sau khi thêm menu Premium (chờ duyệt); phần D: alt cho 12 trang menu Premium |
