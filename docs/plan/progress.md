# Tiến độ

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Lộ trình](roadmap.md), [Việc sắp làm](tasks.md), [Mục lục spec](../specs/README.md), [Hiệu năng: số đo](../dev/perf.md), [Triển khai](../ops/deployment.md)

Nguồn sự thật duy nhất về trạng thái SEO, tốc độ và đo lường của https://thehot.vn.

## Tóm tắt

Tính tới 2026-10-14:

| Hạng mục | Trạng thái |
|---|---|
| Mốc hiện tại | M1 gần xong (còn 4 ô); M2–M6 chưa bắt đầu |
| Đang chạy ở đâu | https://thehot.vn, commit `90f1882`, Jenkins build #16 |
| Đang bị chặn bởi | Câu trả lời và ảnh của chủ quán (M2); `ffmpeg` và duyệt chất lượng video (M3); hạ tầng Umami và Measurement ID GA4 (M4) |
| Quyết định đang chờ | Giờ đóng cửa, nhạc sống, khoảng giá, thanh toán, chuỗi địa chỉ, video hero trên điện thoại, các câu hỏi analytics ([danh sách](tasks.md#câu-hỏi-chờ-chủ-quán)) |

## Theo mốc

"Thực tế" và "Lệch" chỉ điền khi mốc có ước lượng trước.

| Mốc | Ước lượng thô | Bắt đầu | Xong | Thực tế | Lệch | Bằng chứng | Ghi chú |
|---|---|---|---|---|---|---|---|
| M1 Nền tảng SEO | không ước lượng | 2026-10-14 | — | 1 ngày (tới nay) | — | `7af5058` (build #10), PR #3 (build #11), PR #4–#6 (build #16) | Còn: SSL Full (strict), Request indexing `/terms`, kiểm Sitemaps trong Search Console, đo lại PageSpeed |
| M2 On-page và JSON-LD | chưa ước lượng | | | | | | Chờ chủ quán |
| M3 Tốc độ vòng 2 | 1,5–2 ngày công | | | | | | Việc đầu: đo lại sau PR #4 |
| M4 Analytics | 2–2,5 ngày công (web) | | | | | | Hướng đã chốt 2026-10-14 |
| M5 Local SEO / GBP + nội dung | liên tục | | | | | | Gấp: giờ mở cửa trên Google Maps |
| M6 Off-page + nhịp đo | liên tục | | | | | | |

## Theo spec

| Spec | Mốc | Tài liệu | Hiện thực | Ghi chú |
|---|---|---|---|---|
| [`001-sitemap-automation`](../specs/001-sitemap-automation/spec.md) | M1 | Đang áp dụng | Xong (M1) | Việc tiếp theo: đổi tên ảnh, ảnh độ phân giải cao (chờ ảnh) |
| [`002-onpage-seo`](../specs/002-onpage-seo/spec.md) | M1, M2 | Đang áp dụng | Đang làm | Phần A, B xong (M1); C–F chưa làm |
| [`003-performance`](../specs/003-performance/spec.md) | M1, M3 | Đang áp dụng | Đang làm | Phần A xong (M1); B–H chưa làm |
| [`004-analytics`](../specs/004-analytics/spec.md) | M4 | Đề xuất | Chưa làm | |

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
| Sau cache | | | `/` | Mobile | | | | | | | | 003 phần C |
| Sau video hoãn tải | | | `/` | Mobile | | | | | | | | 003 phần B |
| Sau màn hình chờ | | | `/` | Mobile | | | | | | | | 003 phần E |

Theo dõi hằng tuần (M6), điền từ khi có số:

| Tuần | Search Console: hiển thị / lượt bấm / vị trí TB | Google Business Profile: gọi / chỉ đường / bấm web | Đánh giá: số / điểm | Umami: lượt vào / `contact_click` | Ghi chú |
|---|---|---|---|---|---|
| 2026-W42 | | | | — (chưa có Umami) | Tuần đầu sau khi gửi sitemap |

## Nhật ký

Mới nhất ở trên. Giờ theo giờ Việt Nam (UTC+7).

| Ngày | Việc | Bằng chứng |
|---|---|---|
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
