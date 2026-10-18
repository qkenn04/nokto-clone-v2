# 002: SEO trên trang, việc

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-18 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Việc sắp làm](../../plan/tasks.md)

## Chuẩn bị

- [x] 002-T01 Chủ quán duyệt tiêu đề và mô tả; trang chủ giữ mô tả cũ và tiêu đề slogan khi chia sẻ; tiêu đề `/menu` là "Menu" · 2026-10-14
- [x] 002-T02 Chủ quán xác nhận giờ mở cửa là 17:30 (Google Maps đang ghi 16:30, phải sửa: xem [việc sắp làm](../../plan/tasks.md)) · 2026-10-14
- [x] 002-T03 Chủ quán xác nhận sự kiện 16/10 (Friday on Fire, 19:00–00:30, live performance) và 17/10 (Hot Saturday, 19:30–00:30, DJ set) là thật · 2026-10-14
- [x] 002-T05 Trang Facebook của quán đổi tên thành `facebook.com/thehot.dalat` (cùng trang, khớp Instagram và TikTok `@thehot.dalat`) · 2026-10-15
- [ ] 002-T04 Chủ quán trả lời các câu hỏi ở [spec.md mục 12](spec.md#12-câu-hỏi-mở) · xong khi: không còn `[CẦN XÁC NHẬN]` chặn phần C

## Phần A, B: tiêu đề, mô tả, ảnh chia sẻ

- [x] 002-T10 Gom tiêu đề và mô tả về `src/seo/page-meta.ts`, áp cho 7 trang · AC: 002-AC-01, 002-AC-02 · `a367729`, PR #5 (merge `afce6d1`)
- [x] 002-T11 Khai ảnh chia sẻ chung cho trang con · AC: 002-AC-03 · `8cf0ced`, PR #6 (merge `90f1882`); bản xem trước thẻ chia sẻ (trước/sau) được duyệt trước khi merge
- [x] 002-T12 Kiểm trước merge: lint, typecheck, `check:sitemap`, build, `docker build --target check`; so chuỗi chính xác title/description/OG/Twitter trên 7 trang; `<body>` giống `main` · 2026-10-14
- [x] 002-T13 Deploy (Jenkins build #16) và kiểm trên production: `/menu` có `<title>Menu — The Hot Beer Garden Đà Lạt</title>` và `og:image` · 2026-10-14
- [ ] 002-T14 Facebook Sharing Debugger: Scrape Again cho 7 URL để làm mới ảnh xem trước · AC: 002-AC-08
- [x] 002-T16 Chủ quán duyệt mô tả mới cho `/menu`, `/menu/list` có combo, lẩu, mẹt, rượu ([spec.md phần A](spec.md#phần-a-tiêu-đề-và-mô-tả-xong)); duyệt xong thì sửa `src/seo/page-meta.ts` trong PR nhỏ · duyệt và áp dụng 2026-10-15; câu ưu đãi bia thêm lại nếu Q16 xác nhận
- [ ] 002-T15 Sau khi Google crawl lại: Search Console → Performance kiểm tiêu đề mới hiện trong kết quả (theo dõi hằng tuần ở M6)

## Phần C: JSON-LD

- [x] 002-T20 Gỡ `illustrative: true` (nhãn "Chương trình minh hoạ" trên thẻ và chú thích lightbox) của sự kiện 16/10 và 17/10 trong `home/content.ts`; đổi `socialHref`, `messengerHref` sang `thehot.dalat` · `46025ad`, PR #8 (merge `ed262e4`), Jenkins build #17 · 2026-10-15. Alt poster vẫn ghi "ảnh minh hoạ chương trình …": để 002-T30
- [x] 002-T21 Thêm vào `site.ts`: toạ độ, `sameAs` (Instagram, TikTok, Facebook, Google kgmid, TripAdvisor), link bản đồ · xong khi: các giá trị khớp bảng ở spec phần C · PR #10 (merge `aafd52b`, Jenkins build #20)
- [x] 002-T22 Module `src/seo/structured-data.ts`: `@graph` gồm `Restaurant`/`BarOrPub`, `WebSite`, `Event` (chỉ sự kiện thật, chỉ trên `/`) · AC: 002-AC-05, 002-AC-06 · PR #10 (`8d9ec01`, merge `aafd52b`, Jenkins build #20)
- [ ] 002-T23 Thêm giờ đóng cửa, `priceRange`, `paymentAccepted`, nhạc sống khi chủ quán đã trả lời (điền `pendingFacts` trong `site.ts`, có sẵn từ PR #10) · chặn bởi 002-T04
- [x] 002-T24 Rich Results Test + validator.schema.org không lỗi · AC: 002-AC-04 · validator.schema.org trên bản build của PR #10: 0 lỗi, 0 cảnh báo (2026-10-15); trên production, Google tự đọc: URL Inspection API ngày 2026-10-15 báo Events PASS, 0 lỗi, chỉ cảnh báo thiếu `offers`, `performer`
- [ ] 002-T25 `Restaurant.image` 3–5 ảnh thật · chặn bởi 001-T40 (ảnh ngang) · PR #10 tạm dùng 5 ảnh gallery + ảnh chia sẻ
- [x] 002-T26 `public/favicon.ico` (16/32/48 px) cho request thẳng tới `/favicon.ico` (đang 404) · PR #10 (`6680248`, merge `aafd52b`) · 2026-10-15: production trả 200 `image/x-icon` · xong khi: `curl -sI https://thehot.vn/favicon.ico` trả 200 `image/x-icon`
- [x] 002-T27 Sau khi PR #10 deploy: Rich Results Test `https://thehot.vn/` (nhận Local business; Event nếu Google hiện), rồi Search Console → URL Inspection → `https://thehot.vn/` → Request indexing · AC: 002-AC-04 · [TK17](../../plan/tasks.md)

## Phần D, E: ảnh

- [ ] 002-T30 Rà alt ảnh nội dung trên 7 trang · AC: 002-AC-07 · làm cùng 001-T42 nếu ảnh mới đã có · gồm alt poster "ảnh minh hoạ chương trình …" của sự kiện 16/10, 17/10 (sự kiện đã là thật)
- [ ] 002-T31 Ảnh chia sẻ 1200×630 riêng cho `/menu`, `/about`, `/reservation` · chặn bởi 001-T40
- [ ] 002-T32 Dọn tệp template NOKTO không còn dùng trong `public/sites/nokto/` (giữ `hero-backdrop.jpg` và các SVG còn dùng; chủ quán quyết định giữ ảnh nền, 2026-10-14)

## Phần F: chữ trên trang

- [ ] 002-T40 Viết đoạn giới thiệu 200–300 chữ, H2 có từ khoá, phần hỏi đáp · chặn bởi 002-T04 · chủ quán duyệt câu chữ
- [ ] 002-T41 Dựng component, quay màn hình trước/sau cho chủ quán và `kennle04` duyệt · AC: 002-AC-09
- [ ] 002-T42 Rà chữ của link nội bộ ("xem menu nhậu", "đặt bàn cho nhóm")

## Phần G: link trang ở footer

- [ ] 002-T70 Dòng link 6 trang ở footer (`site.footerNav`), khoảng đệm dưới footer cho cụm nút liên hệ nổi, tracking `booking_cta_click` (`location: footer`) cho link Đặt bàn · AC: 002-AC-10, 002-AC-11 · PR `seo/footer-page-links` (chờ duyệt)

## Xếp hạng khi tìm tên quán

Tình trạng 2026-10-15 (ảnh chụp của chủ quán): tìm "the hot beer garden đà lạt" thì Instagram #1, TripAdvisor #2, Facebook #3, `thehot.vn/about` #4, còn tiêu đề cũ và biểu tượng quả địa cầu. Trang chủ `/` đã được index ("URL is on Google"). AI Overview hiện giờ mở 4:30 PM–12 AM, lấy từ Google Maps và TripAdvisor. Mục tiêu: `thehot.vn` (trang chủ) đứng đầu cho tên quán, với tiêu đề mới, logo The Hot và giờ 17:30 ở mọi nơi.

- [ ] 002-T60 Theo dõi hằng tuần vị trí của `thehot.vn` cho truy vấn tên quán và trang nào hiện (`/` hay `/about`) · ghi ở [tiến độ](../../plan/progress.md#đo-lường) (M6)
- [ ] 002-T61 Chủ quán thêm `https://thehot.vn` vào tiểu sử Instagram, TikTok và mục Website của trang Facebook (ba trang đang đứng trên site; link chính chủ trỏ về site giúp Google nhận site là website chính thức) · [TK16](../../plan/tasks.md)
- [ ] 002-T62 Chủ quán nhận (claim) trang TripAdvisor: danh mục đang là Events/Attraction (cần nhà hàng hoặc quán bar), giờ 16:30 (đúng 17:30), ghim bản đồ lệch khoảng 40 m, thêm website · [TK15](../../plan/tasks.md)
- [ ] 002-T63 Biểu tượng trong kết quả tìm kiếm: dịch vụ favicon của Google (`https://www.google.com/s2/favicons?domain=thehot.vn&sz=64`) đã trả logo The Hot (2026-10-15); kiểm lại sau vài ngày rằng kết quả không còn quả địa cầu · [TK29](../../plan/tasks.md)
- [ ] 002-T64 Google Business Profile: giờ 17:30 và website `thehot.vn` để AI Overview và Google Maps hết hiện 16:30 · [TK01, TK07](../../plan/tasks.md)
- [ ] 002-T65 Tên site "The Hot Beer Garden" và dữ liệu có cấu trúc: hoàn tất bằng 002-T27 (PR #10) · dữ liệu đã lên production và Google đã đọc `/` (2026-10-15); còn chờ Google hiện tên site trong kết quả tìm kiếm

## Tài liệu

- [x] 002-T50 Viết spec, plan, tasks này · 2026-10-14
- [ ] 002-T51 Khi phần C–F xong: cập nhật bảng "Theo spec" ở [tiến độ](../../plan/progress.md)

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Tiêu đề và mô tả mới | PR #5, `a367729` |
| 2026-10-14 | Ảnh chia sẻ cho trang con | PR #6, `8cf0ced` |
| 2026-10-14 | Deploy cả hai | `90f1882`, Jenkins build #16 |
| 2026-10-15 | Bỏ nhãn minh hoạ sự kiện 16/10, 17/10; link Facebook, Messenger `thehot.dalat`; deploy | PR #8, `46025ad`, merge `ed262e4`, Jenkins build #17 |
| 2026-10-15 | Mở PR #10: JSON-LD đợt 1 + `/favicon.ico`; validator.schema.org 0 lỗi, 0 cảnh báo; chờ duyệt | PR #10, `8d9ec01`, `6680248` |
| 2026-10-15 | PR #10 merge và deploy; Google crawl lại `/` lúc 05:55 (giờ VN): Events PASS cho 3 sự kiện, cảnh báo thiếu `offers`, `performer`; `/favicon.ico` 200 | merge `aafd52b`, Jenkins build #20, URL Inspection API |
| 2026-10-15 | Ghi tình trạng tìm tên quán (`/about` #4) và việc cho chủ quán (TripAdvisor, tiểu sử mạng xã hội, giờ trên Google) | Ảnh chụp của chủ quán; mục Xếp hạng khi tìm tên quán |
| 2026-10-15 | Menu Premium lên `/menu` (tab thứ hai, 12 trang ảnh có alt, sitemap ảnh thêm 12 mục) và `/menu/list` (104 món dạng chữ); đề xuất mô tả mới cho hai trang menu, chờ duyệt | PR #15 (chờ duyệt) |
| 2026-10-18 | Mở PR: dòng link 6 trang ở footer, khoảng đệm dưới footer cho cụm nút liên hệ nổi, tracking link Đặt bàn ở footer; HTML server của 7 trang có đủ 6 link (trước: trang chủ có 3) | Nhánh `seo/footer-page-links` (chờ duyệt) |
