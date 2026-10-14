# Tiến độ

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Lộ trình](roadmap.md), [Việc sắp làm](tasks.md), [Mục lục spec](../specs/README.md), [Hiệu năng: số đo](../dev/perf.md), [Triển khai](../ops/deployment.md)

Nguồn sự thật duy nhất về trạng thái SEO, tốc độ và đo lường của https://thehot.vn.

## Tóm tắt

Tính tới 2026-10-15:

| Hạng mục | Trạng thái |
|---|---|
| Mốc hiện tại | M1 gần xong (còn 4 ô); M2 đang làm (nhãn sự kiện xong, JSON-LD ở PR #10 chờ duyệt); M3 đang làm (cache xong); M4 đang làm (PR #13 chờ duyệt); M5–M6 chưa bắt đầu |
| Đang chạy ở đâu | https://thehot.vn, commit `6c246e1`, Jenkins build #19 |
| Đang bị chặn bởi | Duyệt PR #10 và câu trả lời, ảnh của chủ quán (M2); chủ quán chọn cách xử lý âm thanh video hero, `ffmpeg`, duyệt chất lượng video (M3); hạ tầng Umami và Measurement ID GA4 (M4) |
| Quyết định đang chờ | Giờ đóng cửa, nhạc sống, khoảng giá, thanh toán, chuỗi địa chỉ, video hero trên điện thoại, âm thanh video hero (B1/B2/B3), các câu hỏi analytics ([danh sách](tasks.md#câu-hỏi-chờ-chủ-quán)) |

## Theo mốc

"Thực tế" và "Lệch" chỉ điền khi mốc có ước lượng trước.

| Mốc | Ước lượng thô | Bắt đầu | Xong | Thực tế | Lệch | Bằng chứng | Ghi chú |
|---|---|---|---|---|---|---|---|
| M1 Nền tảng SEO | không ước lượng | 2026-10-14 | — | 2 ngày (tới nay) | — | `7af5058` (build #10), PR #3 (build #11), PR #4–#6 (build #16) | Còn: SSL Full (strict), Request indexing `/terms`, kiểm Sitemaps trong Search Console, đo lại PageSpeed |
| M2 On-page và JSON-LD | chưa ước lượng | 2026-10-15 | — | — | — | PR #8 (`ed262e4`, build #17); PR #10 (chờ duyệt) | Nhãn sự kiện 16/10, 17/10 và link Facebook xong; JSON-LD đợt 1 + `/favicon.ico` ở PR #10; giờ đóng, giá, thanh toán, nhạc sống chờ chủ quán |
| M3 Tốc độ vòng 2 | 1,5–2 ngày công | 2026-10-15 | — | — | — | Cloudflare (chủ quán); PR #7 repo `qkenn04/infra-qkenn`; PR #9 (`6c246e1`, build #19) | Cache xong; chưa đo lại PageSpeed; video chờ chủ quán chọn B1/B2/B3 |
| M4 Analytics | 2–2,5 ngày công (web) | | | | | | Hướng đã chốt 2026-10-14 |
| M5 Local SEO / GBP + nội dung | liên tục | | | | | | Gấp: giờ mở cửa trên Google Maps |
| M6 Off-page + nhịp đo | liên tục | | | | | | |

## Theo spec

| Spec | Mốc | Tài liệu | Hiện thực | Ghi chú |
|---|---|---|---|---|
| [`001-sitemap-automation`](../specs/001-sitemap-automation/spec.md) | M1 | Đang áp dụng | Xong (M1) | Việc tiếp theo: đổi tên ảnh, ảnh độ phân giải cao (chờ ảnh) |
| [`002-onpage-seo`](../specs/002-onpage-seo/spec.md) | M1, M2 | Đang áp dụng | Đang làm | Phần A, B xong (M1); phần C: nhãn sự kiện xong (PR #8), JSON-LD ở PR #10 chờ duyệt; D–F chưa làm |
| [`003-performance`](../specs/003-performance/spec.md) | M1, M3 | Đang áp dụng | Đang làm | Phần A xong (M1); C xong (2026-10-15); D một phần (`minimumCacheTTL` 7 ngày); B chờ chủ quán chọn cách xử lý âm thanh; E–H chưa làm |
| [`004-analytics`](../specs/004-analytics/spec.md) | M4 | Đề xuất | Đang làm | PR A (Umami, sự kiện, `/privacy`) là PR #13, merge 2026-10-15. Umami chạy, có Website ID; tracker bật khi merge PR điền ID vào `Jenkinsfile`. PR B (GA4, banner) chưa làm |

## Đo lường

Số đo chính thức kèm cách đo nằm ở [Hiệu năng: số đo](../dev/perf.md); bảng này để theo dõi nhanh. PageSpeed Insights, trung vị 3 lần trừ khi ghi khác.

| Lần đo | Ngày | Commit / build | Trang | Thiết bị | Performance | LCP | CLS | TBT | SI | Phần tử LCP | MB trong 10 s đầu | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mốc | 2026-10-14 16:41 | `7af5058`, build #10 | `/` | Mobile (Moto G Power, Slow 4G) | 90 | 2,9 s | 0 | 40 ms | 5,6 s | Ảnh nền màn hình chờ `hero-backdrop.jpg` | chưa đo | Không ghi số lần chạy; FCP 1,7 s, A11y 100, BP 96, SEO 100 |
| Mốc | | `7af5058` | `/` | Desktop | | | | | | | | Chưa đo |
| Mốc | | `7af5058` | `/menu` | Mobile | | | | | | | | Chưa đo |
| Sau PR #4 | | `90f1882`, build #16 | `/` | Mobile | | | | | | | | Chờ đo (TK05, TK21) |
| Sau PR #4 | | `90f1882`, build #16 | `/` | Desktop | | | | | | | | |
| Sau PR #4 | | `90f1882`, build #16 | `/menu` | Mobile | | | | | | | | |
| Sau video bước nhanh | | | `/` | Mobile | | | | | | | | 003 phần B |
| Sau cache | | `6c246e1`, build #19 | `/` | Mobile | | | | | | | | 003 phần C; cache xong 2026-10-15, chưa đo PageSpeed. Header đã kiểm: [Hiệu năng, mục 4.1](../dev/perf.md#41-cache-đã-kiểm-2026-10-15) |
| Sau video hoãn tải | | | `/` | Mobile | | | | | | | | 003 phần B |
| Sau màn hình chờ | | | `/` | Mobile | | | | | | | | 003 phần E |

Theo dõi hằng tuần (M6), điền từ khi có số:

| Tuần | Search Console: hiển thị / lượt bấm / vị trí TB | Google Business Profile: gọi / chỉ đường / bấm web | Đánh giá: số / điểm | Umami: lượt vào / `contact_click` | Ghi chú |
|---|---|---|---|---|---|
| 2026-W42 | | | | — (chưa có Umami) | Tuần đầu sau khi gửi sitemap. 2026-10-15 (ảnh chụp của chủ quán): tìm "the hot beer garden đà lạt", `thehot.vn/about` đứng thứ 4 |

## Nhật ký

Mới nhất ở trên. Giờ theo giờ Việt Nam (UTC+7).

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-15 | Menu Premium từ file PDF menu chủ quán gửi (Canva, tạo 2026-09-06): `/menu` có hai tab "Món ăn chơi" (10 trang cũ) và "Premium" (12 trang mới, 198–271 KB mỗi trang); `/menu/list` thêm 15 nhóm, 104 món kèm giá và tên tiếng Anh; sự kiện `menu_tab_select`; sitemap ảnh thêm 12 mục. Mô tả trang menu chưa đổi (đề xuất ở 002); 9 câu hỏi cho chủ quán (Q16–Q24) | PR #15 (nhánh `feat/menu-premium`, chờ duyệt), [TK30](tasks.md) |
| 2026-10-15 04:15 | Umami chạy trên VPS (repo hạ tầng): 2 container healthy, mật khẩu mặc định bị vô hiệu, nhóm "The Hot", website `thehot.vn`, tài khoản chỉ xem cho chủ quán. Điền Website ID vào `Jenkinsfile` (nhánh `feat/umami-website-id`); merge PR #13 (`/privacy` mới, chưa có tracker) | [004 tasks](../specs/004-analytics/tasks.md) T03, T19 |
| 2026-10-15 | Mở PR #13 (spec 004 PR A): `track()` với danh sách thuộc tính cho phép, `ClickTracker`, tracker Umami qua `next/script` (chỉ khi build có Website ID; `Jenkinsfile` để trống), gắn 6 sự kiện, smoke test kiểm tracker theo Website ID; `/privacy` thêm mục Cloudflare Web Analytics, mục Umami (chỉ khi có tracker), thay mục "Tùy chọn hiển thị". Chữ `/privacy` chờ chủ quán duyệt | PR #13, [004 tasks](../specs/004-analytics/tasks.md) |
| 2026-10-15 | Video hero: track âm thanh chỉ 1,7 MB (AAC khoảng 129 kbps) trên 83,7 MB, bỏ đi chỉ tiết kiệm khoảng 2%. Chủ quán muốn **giữ âm thanh**. Hiện khách không nghe được (autoplay bắt buộc `muted`, không có nút bật tiếng). Chờ chủ quán chọn B1 (chỉ faststart), B2 (nút bật tiếng) hoặc B3 (trình phát "Xem video có tiếng") | `ffprobe`; [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md) |
| 2026-10-15 | Tình trạng trên Google (ảnh chụp của chủ quán): tìm "the hot beer garden đà lạt" thì Instagram #1, TripAdvisor #2, Facebook #3, `thehot.vn/about` #4 (còn tiêu đề cũ, biểu tượng quả địa cầu); `/` đã được index ("URL is on Google"); dịch vụ favicon của Google (`https://www.google.com/s2/favicons?domain=thehot.vn&sz=64`) đã trả logo The Hot, biểu tượng trong kết quả tìm kiếm dự kiến đổi trong vài ngày. AI Overview hiện giờ mở 4:30 PM–12 AM, lấy từ Google Maps và TripAdvisor | Search Console, ảnh chụp kết quả tìm kiếm |
| 2026-10-15 | TripAdvisor có trang của quán nhưng xếp loại Events/Attraction (không phải nhà hàng), giờ 16:30, ghim bản đồ lệch khoảng 40 m: chủ quán cần nhận (claim) trang để sửa | [Việc sắp làm](tasks.md) TK15 |
| 2026-10-15 00:52 | Kiểm cache trên production: tệp `public/` trả `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`, `/_next/image` trả `public, max-age=604800, must-revalidate`; lần gọi thứ hai `cf-cache-status: HIT`; HTML vẫn `DYNAMIC` | `curl -sI`, [Hiệu năng, mục 4.1](../dev/perf.md#41-cache-đã-kiểm-2026-10-15) |
| 2026-10-15 00:44 | Mở PR #10: JSON-LD `Restaurant` + `BarOrPub` (geo, hasMap, logo, ảnh, `acceptsReservations`, chỗ ngồi ngoài trời, `sameAs` Instagram, TikTok, Facebook, Google kgmid, TripAdvisor), nút `WebSite` ("The Hot Beer Garden"), `Event` trên `/` cho sự kiện không minh hoạ; `public/favicon.ico` (16/32/48 px). validator.schema.org: 0 lỗi, 0 cảnh báo. Chờ duyệt | PR #10 (`8d9ec01`, `6680248`) |
| 2026-10-15 00:42 | Merge PR #9: `images.minimumCacheTTL` 4 giờ → 7 ngày; Jenkins build #19 deploy | `5fda453`, merge `6c246e1` |
| 2026-10-15 | Repo hạ tầng `qkenn04/infra-qkenn` PR #7 (merge, đã áp lên nginx của VPS): `/videos`, `/images`, `/sites` trả `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` (7 ngày, không phải 1 năm vì tên tệp chưa đổi theo nội dung) | PR #7 của repo hạ tầng |
| 2026-10-15 | Chủ quán: Cloudflare Browser Cache TTL = *Respect Existing Headers*; Cache Rule "Cache Next images" (`URI Path` bắt đầu bằng `/_next/image` → Eligible for cache) | Cloudflare dashboard |
| 2026-10-15 00:35 | Merge PR #7: bộ tài liệu dự án (`docs/`, ADR 0001–0008, spec 001–004) | merge `eee3c04` |
| 2026-10-15 00:26 | Merge PR #8: sự kiện Friday on Fire (16/10, 19:00–00:30, live performance) và Hot Saturday (17/10, 19:30–00:30, DJ set) chủ quán đã xác nhận, bỏ `illustrative` và nhãn "Chương trình minh hoạ"; After Hours, Acoustic & Chill vẫn giữ nhãn. Trang Facebook đổi tên thành `facebook.com/thehot.dalat` (cùng trang): sửa `socialHref`, `messengerHref` (`m.me/thehot.dalat`) trong `site.ts`. Jenkins build #17 deploy | `46025ad`, merge `ed262e4` |
| 2026-10-14 | Chuyển ghi chú kế hoạch (SEO, sitemap, tốc độ, analytics) thành `docs/plan` và `docs/specs/001`–`004`; chi tiết hạ tầng Umami chuyển sang repo hạ tầng riêng | Nhánh `docs/project-plans` |
| 2026-10-14 | Jenkins build #16 deploy `90f1882`: tiêu đề mới, ảnh chia sẻ trang con, ưu tiên LCP và logo; kiểm trên production (tiêu đề `/menu`, `og:image`, sitemap 6 URL và 25 mục ảnh) | Build #16, `curl` |
| 2026-10-14 | Sự cố CI: WSL khởi động lại lúc 18:21 giết build #12 giữa chừng; lần tắt không sạch để lại object git rỗng trong bộ nhớ đệm git của Jenkins và trong workspace của agent, làm build #13–#15 thất bại. Xoá bộ nhớ đệm và workspace hỏng, build #16 xanh. Site vẫn chạy trong lúc sự cố (máy chủ web không phụ thuộc máy CI); chỉ việc deploy bị trễ | [Runbook 001](../ops/runbooks/001-jenkins-git-cache-corrupted.md) |
| 2026-10-14 18:33 | Merge PR #6: ảnh chia sẻ cho trang con | `8cf0ced`, merge `90f1882` |
| 2026-10-14 18:18 | Merge PR #5: tiêu đề và mô tả theo từ khoá (chủ quán duyệt) | `a367729`, merge `afce6d1` |
| 2026-10-14 18:18 | Merge PR #4: ảnh nền `fetchPriority="high"`, logo tối ưu đúng kích thước, logo menu dùng lại | `3469ca1`, `aff2609`, `9308df6`, merge `6316298` |
| 2026-10-14 17:30 | Merge PR #3: sitemap tự động; Jenkins build #11 deploy; production có 6 URL, 6 `<lastmod>`, 25 mục ảnh | merge `b8e2665` |
| 2026-10-14 16:41 | Đo mốc PageSpeed Mobile: 90 / LCP 2,9 s / CLS 0 / TBT 40 ms / SI 5,6 s; phần tử LCP là ảnh nền màn hình chờ | Mục Đo lường |
| 2026-10-14 | Chủ quán quyết định: giờ mở cửa đúng là 17:30 (Google Maps phải sửa); giữ ảnh nền template; giữ đủ 103 s video hero; sự kiện 16/10 và 17/10 là thật; analytics dùng Umami + GA4 sau đồng ý | Ghi trong spec 002, 003, 004 |
| 2026-10-14 | Chủ quán: Bing Webmaster Tools import từ Search Console | Bing Webmaster Tools |
| 2026-10-14 | Chủ quán: Search Console property Domain `thehot.vn` xác minh bằng DNS TXT; gửi `https://thehot.vn/sitemap.xml`; Request indexing `/`, `/menu`, `/menu/list`, `/about`, `/reservation`; Test live URL tải được, được phép index | Search Console |
| 2026-10-14 | Chủ quán: Cloudflare thêm CNAME `www` (proxied), bật Always Use HTTPS; `www` → apex 301 giữ đường dẫn | `curl -I https://www.thehot.vn/menu` |
| 2026-10-14 13:21 | Tên miền chính `thehot.vn`, bỏ `noindex`; `thehot.k2-tech.dev` và `nokto.qkenn.cloud` 301 giữ đường dẫn | `7af5058`, Jenkins build #10 |
