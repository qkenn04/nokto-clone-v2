# ADR 0006: Ưu tiên tải phần tử LCP bằng `fetchPriority="high"`, logo đúng kích thước, giữ nguyên font

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Số đo hiệu năng](../dev/perf.md), [Yêu cầu phi chức năng](../product/nfr.md), [Front-end](../dev/frontend.md), [ADR 0003](0003-allow-search-indexing.md), [ADR 0008](0008-compress-hero-video-without-trimming.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14 (PR #4 merge 18:18, UTC+7; lên production ở build #16)
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`)

## Bối cảnh

- PageSpeed Mobile ngày 2026-10-14 (commit `7af5058`): Performance 90, **LCP 2,9 s** (ngân sách < 2,5 s), CLS 0, TBT 40 ms, Speed Index 5,6 s ([số đo](../dev/perf.md)).
- Phần tử LCP là ảnh nền template trong màn hình chờ (`Backdrop` trong `Preloader`), file chỉ khoảng 17 KB. LCP gồm TTFB 150 ms, **chờ bắt đầu tải 550 ms**, tải 710 ms, render 90 ms. Lighthouse chẩn đoán: "fetchpriority=high should be applied to the image preload request".
- `Backdrop` dùng prop `preload` của `next/image`. Link preload mà prop này sinh ra không có `fetchpriority`, nên Chrome tải ảnh ở mức ưu tiên thấp. Tài liệu `next/image` của Next 16 khuyên dùng `loading="eager"` + `fetchPriority="high"` cho ảnh LCP thay vì `preload`.
- Logo `logo.png` (PNG bảng màu 640×479, 88,8 KB) được tải nguyên bản (`unoptimized`) và preload ở mọi trang, cho ô hiển thị khoảng 86 px trên điện thoại, tranh băng thông với ảnh LCP. Đo qua `/_next/image`: WebP w=256 là 31,2 KB; w=640 là 111,7 KB (lớn hơn PNG), nên lợi ích đến từ đúng kích thước, không phải định dạng.
- Font: ngoài 5 file được preload, trình duyệt còn tải các file `latin-ext` vì ký tự tiếng Việt nằm trong unicode-range của cả `latin-ext` lẫn `vietnamese`. Gỡ chồng lấn sẽ làm lệch kerning khoảng 83 chỗ (thay đổi nhìn thấy được). Weight 500 và 600 có dùng thật.
- Đổi màn hình chờ hay ảnh nền là thay đổi giao diện, cần chủ quán duyệt.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ `preload` | Không đổi gì | Ảnh LCP vẫn tải ở mức ưu tiên thấp | Loại |
| 2 | Ảnh LCP dùng `loading="eager"` + `fetchPriority="high"` (prop `priority` của `Backdrop`) ở màn hình chờ và trang con | Đúng chẩn đoán và đúng tài liệu Next 16; React vẫn sinh link preload, nay có `fetchpriority="high"`; không đổi giao diện | Chưa có số đo sau | **Chọn** |
| 3 | Nén ảnh nền nhỏ hơn (AVIF) | Ít byte hơn | File đã khoảng 17 KB; nút thắt là thứ tự ưu tiên, không phải dung lượng | Loại |
| 4 | Rút ngắn hoặc bỏ màn hình chờ, thay ảnh nền | Có thể giảm LCP và Speed Index nhiều hơn | Đổi giao diện, cần duyệt thiết kế | Loại khỏi PR này; thuộc spec hiệu năng |

Logo:

| # | Phương án | Kết luận |
|---|---|---|
| a | Giữ PNG nguyên bản, preload | Loại: tốn khoảng 58 KB mỗi trang trên điện thoại |
| b | `next/image` có tối ưu, `sizes` theo kích thước hiển thị từng biến thể, `loading="eager"` + `fetchPriority="low"`, không preload, ghim `aspect-ratio` để bề rộng không đổi; logo trong menu điều hướng dùng cùng `sizes` để trúng file đã cache | **Chọn** |
| c | Logo SVG | Tốt nhất nhưng chưa có file vector gốc (`[CẦN XÁC NHẬN: chủ quán có file logo vector không]`) |

Font:

| # | Phương án | Kết luận |
|---|---|---|
| a | Gỡ chồng lấn unicode-range để không tải `latin-ext` | Loại khi chưa có duyệt thiết kế: lệch kerning nhìn thấy được |
| b | Giữ nguyên | **Chọn** |

## Quyết định

1. Ảnh đã đo là phần tử LCP dùng `loading="eager"` + `fetchPriority="high"`, không dùng prop `preload`. `Backdrop` nhận prop `priority`; `Preloader` và `PersistentChrome` (ảnh nền trang con) bật nó.
2. Logo dùng `next/image` có tối ưu với `sizes` theo kích thước hiển thị (mặc định `(min-width: 640px) 107px, 86px`), tải sớm ở mức ưu tiên thấp, không preload. `NavLogo` dùng chung `LOGO_SIZES`.
3. `unoptimized` chỉ còn ở trình xem toàn màn hình và SVG trang trí ([Front-end](../dev/frontend.md#3-quy-tắc-đã-rút-ra)).
4. Font giữ nguyên tới khi có duyệt thiết kế.

## Hệ quả

### Tốt

- Ảnh LCP được tải ở mức ưu tiên cao; logo trên điện thoại DPR 1,75 giảm từ 88,8 KB PNG xuống 31,2 KB WebP (giữ kênh alpha), ở mọi trang.
- Không đổi giao diện: HTML build của 7 trang chỉ khác ở link preload trong `<head>` và thuộc tính của thẻ `<img>` ảnh nền, logo.

### Xấu (cái giá chấp nhận trả)

- Chưa đo lại sau PR #4 (Lighthouse không chạy được trên máy dev): hiệu quả thật chưa biết.
- Các ảnh lớn khác còn dùng `preload` (`FixedPhoto`, poster `FixedVideo`, `HeroPhoto`, trang đầu `MenuBook`) chưa được đánh giá lại.
- Khoảng 110 KiB font `latin-ext` và weight 500/600 vẫn tải.
- LCP vẫn gắn với ảnh nền template ([ADR 0003](0003-allow-search-indexing.md)); thay ảnh nền sẽ đổi phần tử LCP.

### Cần theo dõi

- Đo PageSpeed Mobile sau PR #4, điền dòng chờ ở [dev/perf.md](../dev/perf.md#3-lịch-sử-đo).

## Điều kiện xem lại

- LCP sau PR #4 vẫn từ 2,5 s trở lên: chuyển sang màn hình chờ và chữ hero (cần duyệt thiết kế).
- Ảnh nền được thay, hoặc một trang khác có phần tử LCP là ảnh đang dùng `preload`.
- Next.js đổi khuyến nghị về ưu tiên tải ảnh.

## Liên quan

- ADR: [0003](0003-allow-search-indexing.md), [0008](0008-compress-hero-video-without-trimming.md)
- PERF-01 ở [yêu cầu phi chức năng](../product/nfr.md#2-hiệu-năng-core-web-vitals-trên-điện-thoại)
- Spec: [003 Hiệu năng](../specs/003-performance/)

## Nguồn/bằng chứng

- PR: https://github.com/qkenn04/nokto-clone-v2/pull/4 (merge `6316298`)
- Commit: `3469ca1` perf: load the splash backdrop with high fetch priority
- Commit: `aff2609` perf: serve a correctly sized optimized logo; `9308df6` perf: reuse the optimized logo in the navigation menu
- File: `src/components/sites/nokto/chrome/Backdrop.tsx`, `BrandMark.tsx`, `PersistentChrome.tsx`, `Preloader.tsx`
- Số liệu: PageSpeed Mobile 2026-10-14 16:41; dung lượng logo đo qua `/_next/image` ngày 2026-10-14

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định đã thực hiện cùng ngày (PR #4), trạng thái Chấp nhận |
