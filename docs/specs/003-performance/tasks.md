# 003: Tốc độ trang, việc

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Hiệu năng: số đo](../../dev/perf.md)

## Chuẩn bị

- [x] 003-T01 Đo mốc PageSpeed Mobile `/` · 2026-10-14 16:41: 90 / LCP 2,9 s / CLS 0 / TBT 40 ms / SI 5,6 s; phần tử LCP là ảnh nền màn hình chờ
- [x] 003-T02 Chủ quán quyết định giữ đủ 103 s video hero và giữ ảnh nền template · 2026-10-14
- [ ] 003-T03 Đo mốc còn thiếu: Desktop `/`, Mobile `/menu`, MB tải trong 10 s đầu (DevTools, Fast 4G, tắt cache) · xong khi: ghi vào [Hiệu năng: số đo](../../dev/perf.md)
- [ ] 003-T04 Chủ quán trả lời [spec.md mục 12](spec.md#12-câu-hỏi-mở)

## Phần A: ưu tiên LCP, logo

- [x] 003-T10 Ảnh nền tải với `fetchPriority="high"` · AC: 003-AC-09 · `3469ca1`
- [x] 003-T11 Logo qua `next/image` đúng kích thước, không preload · `aff2609`
- [x] 003-T12 Logo trong menu dùng lại file đã nén · `9308df6`
- [x] 003-T13 Merge PR #4 (`6316298`), deploy Jenkins build #16 · 2026-10-14
- [ ] 003-T14 Đo lại PageSpeed Mobile `/` sau build #16 (3 lần, trung vị) và so với mốc · AC: 003-AC-01, 003-AC-02 · ghi vào [tiến độ](../../plan/progress.md#đo-lường)

## Phần C: cache

- [x] 003-T20 Cloudflare: Browser Cache TTL "Respect Existing Headers" · AC: 003-AC-07 · chủ quán, 2026-10-15
- [x] 003-T21 Cloudflare: Cache Rule "Cache Next images" (`URI Path` bắt đầu bằng `/_next/image` → Eligible for cache) · AC: 003-AC-07 · chủ quán, 2026-10-15
- [x] 003-T22 Header cache `public, max-age=604800, stale-while-revalidate=86400` cho `/videos`, `/images`, `/sites` ở reverse proxy · PR #7 của repo hạ tầng `qkenn04/infra-qkenn`, đã merge và áp lên VPS · 2026-10-15
- [ ] 003-T23 Ghi quy tắc "đổi nội dung thì đổi tên tệp `public/`" vào README · cách purge khi lỡ giữ tên đã ghi ở [Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)
- [x] 003-T24 Kiểm trên production: lần gọi thứ hai `cf-cache-status: HIT` cho tệp `public/` và `/_next/image`; HTML vẫn `DYNAMIC` · AC: 003-AC-07 · 2026-10-15, [Hiệu năng, mục 4.1](../../dev/perf.md#41-cache-đã-kiểm-2026-10-15)
- [ ] 003-T25 Đo PageSpeed Mobile `/` sau cache (`6c246e1`, build #19), 3 lần, trung vị · ghi hàng "Sau cache" ở [tiến độ](../../plan/progress.md#đo-lường)

## Phần B: video hero

- [ ] 003-T30 Cài `ffmpeg` có encoder AV1 (hoặc dùng image Docker)
- [ ] 003-T31 Bước nhanh (B1): faststart cho `main.mp4`, giữ nguyên mọi track (`ffmpeg -i main.mp4 -map 0 -c copy -movflags +faststart`; hình và tiếng giống hệt từng byte) · AC: 003-AC-04 (phần không còn `Range` tới cuối file) · chặn bởi 003-T30 và 003-T35
- [ ] 003-T32 Encode AV1 1080p và H.264 720p, 2–3 mức `crf`, giữ track âm thanh (`-c:a copy`) · chủ quán duyệt chất lượng
- [ ] 003-T33 `HeroVideo` nhận `sources`, hoãn tải, bỏ qua khi giảm chuyển động / `saveData` / 2g, poster ưu tiên cao · AC: 003-AC-04, 003-AC-05, 003-AC-06 · chặn bởi quyết định phát video trên điện thoại
- [ ] 003-T34 Thử trên iPhone thật (Safari, không AV1) và Android
- [ ] 003-T35 Chủ quán chọn cách xử lý âm thanh (giữ âm thanh, đã chốt 2026-10-15): B1 chỉ faststart, B2 nút bật tiếng, B3 trình phát "Xem video có tiếng" · [TK18, Q15](../../plan/tasks.md)
- [ ] 003-T36 Nếu chọn B2 hoặc B3: dựng nút bật tiếng hoặc trình phát có tiếng, quay màn hình trước/sau để duyệt · chặn bởi 003-T35

## Phần D: ảnh

- [x] 003-T40 `images.minimumCacheTTL` 7 ngày (604 800 giây, thay mặc định 4 giờ; 7 ngày thay vì 30 cho khớp ảnh gốc ở reverse proxy) · PR #9, `5fda453`, merge `6c246e1`, Jenkins build #19 · 2026-10-15
- [ ] 003-T42 `images.formats` AVIF + WebP; theo dõi CPU VPS lần đầu
- [ ] 003-T41 Rà `sizes` của gallery và menu

## Phần E, F: cần duyệt

- [ ] 003-T50 Màn hình chờ tối đa 1,5 s, chỉ lần đầu trong phiên; chữ hero hiện ngay · AC: 003-AC-08 · chủ quán và `kennle04` duyệt video trước/sau
- [ ] 003-T51 Sửa mục "Tùy chọn hiển thị" ở `/privacy` cho khớp hành vi màn hình chờ
- [ ] 003-T52 Font một subset mỗi weight · chờ duyệt

## Phần G, H

- [ ] 003-T60 Đo INP bằng DevTools Performance (CPU chậm 4×): mở Menu, bấm Đặt bàn, lật menu, mở gallery; chỉ sửa khi có long task > 50 ms đáng kể
- [ ] 003-T61 Xem lỗi console mà PageSpeed báo
- [ ] 003-T62 Xem Core Web Vitals thật ở Cloudflare Web Analytics
- [ ] 003-T63 Gửi `web-vitals` về Umami · chặn bởi [004](../004-analytics/tasks.md)

## Tài liệu

- [x] 003-T70 Viết spec, plan, tasks này · 2026-10-14
- [ ] 003-T71 Mỗi lần đo: ghi vào [Hiệu năng: số đo](../../dev/perf.md)

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Đo mốc PageSpeed Mobile | 90 / LCP 2,9 s (trước PR #4, commit `7af5058`) |
| 2026-10-14 | Ưu tiên LCP và logo | PR #4, merge `6316298`; deploy `90f1882`, Jenkins build #16 |
| 2026-10-15 | Cloudflare Browser Cache TTL + Cache Rule `/_next/image` | Chủ quán |
| 2026-10-15 | Header cache 7 ngày cho `/videos`, `/images`, `/sites` | PR #7 của repo `qkenn04/infra-qkenn`, áp lên VPS |
| 2026-10-15 | `images.minimumCacheTTL` 7 ngày | PR #9, `5fda453`, merge `6c246e1`, Jenkins build #19 |
| 2026-10-15 | Lần hai `cf-cache-status: HIT`; HTML `DYNAMIC` | `curl -sI`, [Hiệu năng, mục 4.1](../../dev/perf.md#41-cache-đã-kiểm-2026-10-15) |
| 2026-10-15 | Âm thanh video hero: 1,7 MB / 83,7 MB; chủ quán muốn giữ; chờ chọn B1/B2/B3 | `ffprobe`; [ADR 0008](../../adr/0008-compress-hero-video-without-trimming.md) |
