# 003: Tốc độ trang, kế hoạch kỹ thuật

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [tasks.md](tasks.md), [Hiệu năng: số đo](../../dev/perf.md), [Triển khai](../../ops/deployment.md), [Mục lục ADR](../../adr/README.md) (ADR 0006, ADR 0008)

## 1. Tóm tắt cách làm

Mốc đo cho thấy site đã khá tốt (90 điểm); chỉ LCP vượt ngưỡng, và nguyên nhân là **ưu tiên tải** của một ảnh nhỏ (17 KB) chứ không phải dung lượng. Vì vậy thứ tự được đổi so với ghi chú ban đầu: sửa ưu tiên tải và logo trước (PR #4, không đổi giao diện), đo lại, rồi mới tới cache, video và các thay đổi cần duyệt. Video hero vẫn làm vì nó tốn dữ liệu thật của khách (tới 83,7 MB), dù ít ảnh hưởng điểm lab. Tính tới 2026-10-15: PR #4 và cache (bước 1, 3) xong; video chờ chủ quán chọn cách xử lý âm thanh.

## 2. Thiết kế

### 2.1 Đã xây: PR #4

| File | Thay đổi |
|---|---|
| `src/components/sites/nokto/chrome/Backdrop.tsx` | Prop `priority` thay `preload`: `loading="eager"` + `fetchPriority="high"`; React vẫn sinh một preload link mỗi trang, giờ có `fetchPriority="high"` |
| `Preloader.tsx`, `PersistentChrome.tsx` | Gọi `Backdrop` với `priority` |
| `src/components/sites/nokto/chrome/BrandMark.tsx` | Bỏ `unoptimized`; `sizes` theo biến thể (mặc định `(min-width: 640px) 107px, 86px`); `loading="eager"` + `fetchPriority="low"`; khoá `aspectRatio` để bề rộng không đổi |
| `PersistentChrome.tsx` (`NavLogo`) | Dùng lại `sizes` của logo để trúng file đã nén |

Kiểm trước merge: lint, typecheck, `check:sitemap`, build, `docker build --target check`; HTML của 7 trang so với `main` chỉ khác ở preload trong `<head>`, thẻ `<img>` của ảnh nền và logo. Lighthouse không chạy được trên máy dev (Chrome chạy ngầm thiếu thư viện hệ thống), nên cần đo lại bằng PageSpeed sau deploy.

Không đổi trong PR #4 (đã điều tra): font (phần F); các ảnh `unoptimized` còn lại là trình xem toàn màn hình (lightbox, đọc menu, gallery About), cố ý giữ.

### 2.2 Video hero (phần B)

Chủ quán muốn **giữ âm thanh** (2026-10-15): track AAC khoảng 129 kbps chỉ 1,7 MB trên 83,7 MB, bỏ đi chỉ bớt khoảng 2%. Mọi lệnh dưới giữ track âm thanh.

```bash
# Bước nhanh (B1): faststart, copy nguyên mọi track (hình và tiếng giữ nguyên từng byte)
ffmpeg -i public/videos/main.mp4 -map 0 -c copy -movflags +faststart main.faststart.mp4

# AV1 1080x1920 (Chrome, Edge, Firefox, Android, Safari trên máy có chip AV1); âm thanh copy nguyên
ffmpeg -i public/videos/main.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libsvtav1 -preset 5 -crf 36 -g 240 -pix_fmt yuv420p -c:a copy \
  -movflags +faststart main.v2.av1.mp4

# H.264 720x1280 dự phòng (iPhone cũ, Mac Intel/M1/M2); âm thanh copy nguyên
ffmpeg -i public/videos/main.mp4 -map 0:v:0 -map 0:a:0 -vf scale=720:-2 \
  -c:v libx264 -preset slow -crf 25 -profile:v high -level:v 4.0 -pix_fmt yuv420p -c:a copy \
  -movflags +faststart main.v2.720.mp4
```

- Kiểm bước nhanh: `ffprobe` thấy đủ track hình và tiếng như bản gốc; hộp `moov` nằm trước `mdat`; trình duyệt phát được khi mới tải phần đầu (DevTools: không có request `Range` tới cuối file).
- Cho khách nghe tiếng (chờ chủ quán chọn, [spec phần B](spec.md#phần-b-video-hero-chưa-làm-cần-chủ-quán-chọn-cách-xử-lý-âm-thanh-và-duyệt-chất-lượng)): **B1** chỉ faststart, giao diện không đổi, khách vẫn không nghe được (tự phát bắt buộc `muted`). **B2** nút bật/tắt tiếng trong `HeroVideo`: bỏ `muted` khi khách bấm (trình duyệt cho phép vì là thao tác của người dùng). **B3** nút "Xem video có tiếng" mở trình phát riêng (`<video controls>` không `muted`) dùng cùng file. B2, B3 cần duyệt thiết kế, quay màn hình trước/sau.
- Kiểm có encoder AV1: `ffmpeg -hide_banner -encoders | grep -E 'libsvtav1|libaom'`; không có thì chạy ffmpeg trong image Docker có SVT-AV1.
- `crf` là điểm bắt đầu: encode 2–3 mức, chọn mức nhỏ nhất mà mắt không thấy khác, rồi chủ quán duyệt. Ước tính (kiểm lại sau khi encode): AV1 khoảng 13–20 MB, H.264 720p khoảng 20–30 MB.
- Chuỗi codec cho thuộc tính `type` lấy bằng `ffprobe` (profile, level, bit depth), ví dụ `video/mp4; codecs=av01.0.08M.08` như video About; file có âm thanh thì thêm codec âm thanh vào chuỗi (ví dụ `mp4a.40.2` nếu `ffprobe` báo AAC-LC).
- Xoá `main.mp4` khỏi `public/videos/` (lịch sử git vẫn giữ); cập nhật `sources` của trang chủ trong `seo/sitemap-pages.json`.
- `videos.ts`: `heroVideo.sources = [AV1 kèm codecs, H.264 720p]` (`heroVideo` đã có từ PR #3).
- `HeroVideo.tsx`: nhận `sources` như `FixedVideo`; `preload="none"`, chưa gắn nguồn lúc đầu; gắn sau `load`/idle **và** sau khi màn hình chờ xong (`data-splash` là `exit` hoặc `done`); bỏ qua khi `useReducedMotion`, `navigator.connection.saveData`, `effectiveType` là `2g`/`slow-2g`.
- Poster: bản nén (WebP/AVIF, rộng khoảng 720 px), `<link rel="preload" as="image" fetchpriority="high">` vì trên điện thoại poster phủ màn hình đầu và nhiều khả năng là phần tử LCP sau khi đổi; nhánh dự phòng `next/image` dùng `preload` (Next 16 thay `priority` bằng `preload`), không lazy.
- Hiệu ứng: poster opacity 1 ngay; chỉ lớp video mờ dần khi bắt đầu phát.

### 2.3 Cache (phần C)

Xong 2026-10-15. Chính sách ở [spec phần C](spec.md#phần-c-cache-xong-2026-10-15).

1. Reverse proxy: header `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` cho `/videos`, `/images`, `/sites` (thay `max-age=0` của Next.js). PR #7 của repo hạ tầng `qkenn04/infra-qkenn`, đã merge và áp lên VPS. 7 ngày chứ không 1 năm vì tên tệp chưa đổi theo nội dung.
2. Cloudflare (zone `thehot.vn`, chủ quán làm): Caching → Configuration → Browser Cache TTL → "Respect Existing Headers"; Caching → Cache Rules → rule "Cache Next images": *When* `URI Path` starts with `/_next/image`; *Then* Eligible for cache.
3. `next.config.ts`: `images.minimumCacheTTL: 604800` (PR #9, mục 2.4), nên `/_next/image` trả `max-age=604800`.
4. Kiểm: `curl -sI` cùng một URL hai lần, lần hai `cf-cache-status: HIT` (đạt 003-AC-07; số liệu ở [Hiệu năng, mục 4.1](../../dev/perf.md#41-cache-đã-kiểm-2026-10-15)).
5. Thay tệp mà giữ tên: purge URL trên Cloudflare ([Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)).

### 2.4 Ảnh (phần D)

`next.config.ts`: `images.minimumCacheTTL: 604800` (7 ngày; xong, PR #9, `5fda453`, merge `6c246e1`, Jenkins build #19). Ban đầu đề xuất 30 ngày; chọn 7 ngày cho khớp thời hạn của ảnh gốc ở reverse proxy, vì tên tệp chưa đổi theo nội dung. Còn lại: `images.formats: ["image/avif", "image/webp"]`; rà `sizes` trong gallery và menu bằng DevTools.

### 2.5 Màn hình chờ và chữ hero (phần E)

`SPLASH_SCRIPT` trong `src/app/layout.tsx` và `Preloader`: giới hạn 1,5 s; ghi `sessionStorage` để chỉ chạy lần đầu trong phiên. Hiệu ứng chữ hero chỉ `transform`. Cập nhật mục "Tùy chọn hiển thị" ở `src/components/sites/nokto/legal/content.ts` cho khớp. Quay video màn hình trước/sau để duyệt.

## 3. Thay đổi kéo theo

| Loại | Thay đổi | Tài liệu |
|---|---|---|
| Số đo | Mỗi lần đo | [Hiệu năng: số đo](../../dev/perf.md), [tiến độ](../../plan/progress.md#đo-lường) |
| Vận hành | Header cache ở reverse proxy; Cloudflare rule | Repo hạ tầng; [Triển khai](../../ops/deployment.md) |
| Quy ước repo | Đổi nội dung tệp `public/` thì đổi tên; lỡ giữ tên thì purge URL trên Cloudflare | README; [Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên) |
| Quyền riêng tư | Màn hình chờ dùng `sessionStorage` (phần E) | `/privacy`, [004](../004-analytics/spec.md) |
| Sitemap | Đổi tên file video | `seo/sitemap-pages.json` |

## 4. Thứ tự làm

| # | Việc | Cần duyệt | Ước lượng thô | Lùi lại |
|---|---|---|---|---|
| 1 | Ưu tiên LCP, logo (PR #4) | Không | xong | Revert |
| 2 | Đo lại sau PR #4: Mobile và Desktop `/`, Mobile `/menu`, MB trong 10 s đầu | — | 30 phút | — |
| 3 | Cache: Cloudflare + header ở reverse proxy | Không | xong 2026-10-15 | Tắt rule; revert cấu hình hạ tầng |
| 4 | Video bước nhanh: faststart, giữ âm thanh (B1); thêm nút bật tiếng (B2) hoặc trình phát có tiếng (B3) nếu chủ quán chọn | Chủ quán chọn B1/B2/B3; B2, B3 cần duyệt thiết kế | 30 phút (B1); B2, B3 chưa ước lượng | Revert, file cũ còn trong git |
| 5 | Ảnh: `minimumCacheTTL` (xong, PR #9), AVIF, `sizes` | Không | 1–2 giờ | Revert |
| 6 | Video encode + `HeroVideo` hoãn tải | Chủ quán duyệt chất lượng; quyết định điện thoại | 3–4 giờ | Revert PR |
| 7 | Màn hình chờ + chữ hero | Có (thiết kế) | 2–3 giờ | Revert |
| 8 | Font một subset | Có (giao diện) | chưa ước lượng | Revert |
| 9 | JS/INP | Tuỳ kết quả đo | 2–4 giờ | Revert |
| 10 | `web-vitals` → Umami | Sau [004](../004-analytics/plan.md) | 1 giờ | Revert |

Nếu bước 2 cho LCP < 2,5 s thì mục tiêu LCP đã đạt; các bước sau vẫn làm vì dữ liệu tải và cache, nhưng không gấp.

## 5. Kiểm thử

| Tiêu chí | Kiểm bằng | Loại |
|---|---|---|
| 003-AC-01, 003-AC-02 | https://pagespeed.web.dev, Mobile, 3 lần | E |
| 003-AC-03 → 003-AC-06 | DevTools Network (Fast 4G, tắt cache, Preserve log); iPhone thật | M |
| 003-AC-07 | `curl -sI` hai lần | E |
| 003-AC-08 | Search Console Test live URL | E |
| 003-AC-09 | View source | E |
| Mọi PR | `npm run check`, `ci/smoke-test.sh` | S, I |

Đo lặp lại không phụ thuộc lượt miễn phí của PageSpeed API (đã gặp lỗi 429): cài thư viện hệ thống cho Chrome chạy ngầm trên máy dev rồi chạy `npx lighthouse https://thehot.vn --preset=perf --form-factor=mobile`.

## 6. Rủi ro và cách lùi

| Rủi ro | Dấu hiệu | Giảm thiểu | Lùi lại |
|---|---|---|---|
| Video encode mất chất lượng | Chủ quán thấy khác | Encode nhiều mức, duyệt cạnh nhau | Giữ bản faststart |
| Poster trở thành phần tử LCP và chậm | LCP không giảm | Poster nén + preload ưu tiên cao | Revert |
| Cache dài giữ tệp cũ sau khi thay nội dung | Khách thấy ảnh cũ | Đổi tên khi đổi nội dung; cache 7 ngày thay vì 1 năm; purge URL ([Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)) | Purge |
| AVIF làm CPU VPS tăng lúc nén lần đầu | Deploy chậm, CPU cao | Theo dõi; Cloudflare cache giảm số lần nén | Bỏ AVIF |
| Repo nặng thêm 30–50 MB vì video mới (pack hiện khoảng 118 MiB) | Clone chậm | Chấp nhận; tách video khỏi git để sau | — |

## 7. Ước lượng

Bước 2–7 và 9–10: khoảng 11–16 giờ dev (ước lượng thô), chưa tính thời gian chờ duyệt; bước 8 chưa ước lượng.

## 8. Câu hỏi mở

Xem [spec.md mục 12](spec.md#12-câu-hỏi-mở). Chưa rõ: lỗi console mà PageSpeed báo (mọi 38 URL tài nguyên trên trang chủ đều trả 200, đã kiểm 2026-10-14; có thể do autoplay video trong máy đo).
