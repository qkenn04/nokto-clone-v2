# 002: SEO trên trang, việc

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Việc sắp làm](../../plan/tasks.md)

## Chuẩn bị

- [x] 002-T01 Chủ quán duyệt tiêu đề và mô tả; trang chủ giữ mô tả cũ và tiêu đề slogan khi chia sẻ; tiêu đề `/menu` là "Menu" · 2026-10-14
- [x] 002-T02 Chủ quán xác nhận giờ mở cửa là 17:30 (Google Maps đang ghi 16:30, phải sửa: xem [việc sắp làm](../../plan/tasks.md)) · 2026-10-14
- [x] 002-T03 Chủ quán xác nhận sự kiện 16/10 (Friday on Fire) và 17/10 (Hot Saturday) là thật · 2026-10-14
- [ ] 002-T04 Chủ quán trả lời các câu hỏi ở [spec.md mục 12](spec.md#12-câu-hỏi-mở) · xong khi: không còn `[CẦN XÁC NHẬN]` chặn phần C

## Phần A, B: tiêu đề, mô tả, ảnh chia sẻ

- [x] 002-T10 Gom tiêu đề và mô tả về `src/seo/page-meta.ts`, áp cho 7 trang · AC: 002-AC-01, 002-AC-02 · `a367729`, PR #5 (merge `afce6d1`)
- [x] 002-T11 Khai ảnh chia sẻ chung cho trang con · AC: 002-AC-03 · `8cf0ced`, PR #6 (merge `90f1882`); bản xem trước thẻ chia sẻ (trước/sau) được duyệt trước khi merge
- [x] 002-T12 Kiểm trước merge: lint, typecheck, `check:sitemap`, build, `docker build --target check`; so chuỗi chính xác title/description/OG/Twitter trên 7 trang; `<body>` giống `main` · 2026-10-14
- [x] 002-T13 Deploy (Jenkins build #16) và kiểm trên production: `/menu` có `<title>Menu — The Hot Beer Garden Đà Lạt</title>` và `og:image` · 2026-10-14
- [ ] 002-T14 Facebook Sharing Debugger: Scrape Again cho 7 URL để làm mới ảnh xem trước · AC: 002-AC-08
- [ ] 002-T15 Sau khi Google crawl lại: Search Console → Performance kiểm tiêu đề mới hiện trong kết quả (theo dõi hằng tuần ở M6)

## Phần C: JSON-LD

- [ ] 002-T20 Gỡ `illustrative: true` và chữ "ảnh minh hoạ" của sự kiện 16/10 và 17/10 trong `home/content.ts` · làm trước 16/10
- [ ] 002-T21 Thêm vào `site.ts`: toạ độ, `sameAs` (Facebook, Instagram, TikTok, Google kgmid), link bản đồ · xong khi: các giá trị khớp bảng ở spec phần C
- [ ] 002-T22 Module `src/seo/structured-data.ts`: `@graph` gồm `Restaurant`/`BarOrPub`, `WebSite`, `Event` (chỉ sự kiện thật) · AC: 002-AC-05, 002-AC-06
- [ ] 002-T23 Thêm giờ đóng cửa, `priceRange`, `paymentAccepted`, nhạc sống khi chủ quán đã trả lời · chặn bởi 002-T04
- [ ] 002-T24 Rich Results Test + validator.schema.org không lỗi · AC: 002-AC-04
- [ ] 002-T25 `Restaurant.image` 3–5 ảnh thật · chặn bởi 001-T40 (ảnh ngang)

## Phần D, E: ảnh

- [ ] 002-T30 Rà alt ảnh nội dung trên 7 trang · AC: 002-AC-07 · làm cùng 001-T42 nếu ảnh mới đã có
- [ ] 002-T31 Ảnh chia sẻ 1200×630 riêng cho `/menu`, `/about`, `/reservation` · chặn bởi 001-T40
- [ ] 002-T32 Dọn tệp template NOKTO không còn dùng trong `public/sites/nokto/` (giữ `hero-backdrop.jpg` và các SVG còn dùng; chủ quán quyết định giữ ảnh nền, 2026-10-14)

## Phần F: chữ trên trang

- [ ] 002-T40 Viết đoạn giới thiệu 200–300 chữ, H2 có từ khoá, phần hỏi đáp · chặn bởi 002-T04 · chủ quán duyệt câu chữ
- [ ] 002-T41 Dựng component, quay màn hình trước/sau cho chủ quán và `kennle04` duyệt · AC: 002-AC-09
- [ ] 002-T42 Rà chữ của link nội bộ ("xem menu nhậu", "đặt bàn cho nhóm")

## Tài liệu

- [x] 002-T50 Viết spec, plan, tasks này · 2026-10-14
- [ ] 002-T51 Khi phần C–F xong: cập nhật bảng "Theo spec" ở [tiến độ](../../plan/progress.md)

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Tiêu đề và mô tả mới | PR #5, `a367729` |
| 2026-10-14 | Ảnh chia sẻ cho trang con | PR #6, `8cf0ced` |
| 2026-10-14 | Deploy cả hai | `90f1882`, Jenkins build #16 |
