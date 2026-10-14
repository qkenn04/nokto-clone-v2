# 003: Tốc độ trang, việc

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Hiệu năng: số đo](../../dev/perf.md)

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

- [ ] 003-T20 Cloudflare: Browser Cache TTL "Respect Existing Headers" · AC: 003-AC-07
- [ ] 003-T21 Cloudflare: Cache Rule cho `/_next/image` · AC: 003-AC-07
- [ ] 003-T22 Header cache cho `/videos`, `/images`, `/sites` ở reverse proxy (PR ở repo hạ tầng riêng)
- [ ] 003-T23 Ghi quy tắc "đổi nội dung thì đổi tên tệp `public/`" vào README

## Phần B: video hero

- [ ] 003-T30 Cài `ffmpeg` có encoder AV1 (hoặc dùng image Docker)
- [ ] 003-T31 Bước nhanh: faststart + bỏ âm thanh cho `main.mp4` · AC: 003-AC-04 (phần không còn `Range` tới cuối file)
- [ ] 003-T32 Encode AV1 1080p và H.264 720p, 2–3 mức `crf` · chủ quán duyệt chất lượng
- [ ] 003-T33 `HeroVideo` nhận `sources`, hoãn tải, bỏ qua khi giảm chuyển động / `saveData` / 2g, poster ưu tiên cao · AC: 003-AC-04, 003-AC-05, 003-AC-06 · chặn bởi quyết định phát video trên điện thoại
- [ ] 003-T34 Thử trên iPhone thật (Safari, không AV1) và Android

## Phần D: ảnh

- [ ] 003-T40 `images.minimumCacheTTL`, `images.formats` AVIF + WebP; theo dõi CPU VPS lần đầu
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
