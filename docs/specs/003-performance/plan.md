# 003: Tốc độ trang, kế hoạch kỹ thuật

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [tasks.md](tasks.md), [Hiệu năng: số đo](../../dev/perf.md), [Triển khai](../../ops/deployment.md), [Mục lục ADR](../../adr/README.md) (ADR 0006, ADR 0008)

## 1. Tóm tắt cách làm

Mốc đo cho thấy site đã khá tốt (90 điểm); chỉ LCP vượt ngưỡng, và nguyên nhân là **ưu tiên tải** của một ảnh nhỏ (17 KB) chứ không phải dung lượng. Vì vậy thứ tự được đổi so với ghi chú ban đầu: sửa ưu tiên tải và logo trước (PR #4, không đổi giao diện), đo lại, rồi mới tới cache, video và các thay đổi cần duyệt. Video hero vẫn làm vì nó tốn dữ liệu thật của khách (tới 83,7 MB), dù ít ảnh hưởng điểm lab. Tính tới 2026-10-15: PR #4 và cache (bước 1, 3) xong; video (bước 4 và 6) ở PR #16, chờ merge.

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

### 2.2 Video hero (phần B, PR #16)

Chủ quán chốt 2026-10-15: giữ đủ 103 s, **giữ âm thanh**, cách B1 (video vẫn tắt tiếng, không thêm nút), AV1 CRF 48 + H.264 720p CRF 27, điện thoại vẫn phát nhưng hoãn tải, lần phát đầu từ 2,25 s ([ADR 0008](../../adr/0008-compress-hero-video-without-trimming.md)).

Lệnh đã dùng (`ffmpeg` 8.0.1 có `libsvtav1` trên máy dev):

```bash
# Gắn nhãn BT.709 dải hẹp mà không đổi điểm ảnh. Ở ffmpeg 8, tuỳ chọn đầu ra -colorspace/-color_range
# chuyển ma trận màu ngầm (màu lệch), nên dùng bộ lọc setparams.
TAG="setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709"

# AV1 1080x1920; âm thanh copy nguyên
ffmpeg -i main.mp4 -map 0 -c:v libsvtav1 -preset 5 -crf 48 -g 240 -vf "$TAG" -pix_fmt yuv420p \
  -c:a copy -movflags +faststart public/videos/main.v2.av1.mp4

# H.264 720x1280 dự phòng; âm thanh copy nguyên
ffmpeg -i main.mp4 -map 0 -c:v libx264 -preset slow -profile:v high -crf 27 -vf "scale=720:-2,$TAG" \
  -pix_fmt yuv420p -c:a copy -movflags +faststart public/videos/main.v2.720.mp4
```

- Đã encode AV1 CRF 48/52/56 và H.264 CRF 27/29/31 để so; chủ quán chọn CRF 48 (26,8 MB, SSIM Y 0,980 so với bản gốc) và CRF 27 (31,5 MB). Bước "chỉ faststart" (`-map 0 -c copy`) không làm riêng vì bản encode đã faststart.
- Kiểm bằng `ffprobe` (2026-10-15): `moov` trước `mdat`; 102,94 s và 3086 khung hình như bản gốc; nhãn màu `tv/bt709`; MD5 track âm thanh (`ffmpeg -i X -map 0:a -c copy -f md5 -`) giống bản gốc; độ sáng khung hình giống bản gốc (`signalstats`).
- Chuỗi `type` lấy từ hộp `av1C`/`avcC` và `esds` trong file: `video/mp4; codecs="av01.0.08M.08, mp4a.40.2"` (AV1 Main, level 4.0, tier Main, 8 bit) và `video/mp4; codecs="avc1.64001F, mp4a.40.2"` (H.264 High, level 3.1). Bản AV1 trong `videos.ts` kèm thông số luồng hình cho `mediaCapabilities.decodingInfo` (chỉ codec hình, 1080×1920, 1 945 547 bit/s, 30 khung hình/s).
- Xoá `main.mp4` khỏi `public/videos/` (lịch sử git vẫn giữ); `sources` của trang chủ trong `seo/sitemap-pages.json` liệt kê hai file mới.
- `HeroVideo.tsx` nhận `sources` (tốt nhất trước) và `poster`:
  - Server: `next/image` cho poster (`fill`, `sizes="(max-width: 1023px) 100vw, 55vw"`, `loading="eager"`, không `fetchPriority`); `<video>` không `src`, không `<source>`, `preload="none"`. React tự thêm `<link rel="preload" as="image">` (không `fetchpriority`) cho poster; đo được không làm chậm LCP điện thoại, còn `fetchPriority="low"` làm LCP máy tính chậm hơn ([Hiệu năng, mục 5](../../dev/perf.md#5-thử-nghiệm-tối-ưu)).
  - Bỏ qua hẳn (0 byte video) khi giảm chuyển động (`matchMedia`, theo dõi liên tục), `saveData` hoặc `effectiveType` `2g`/`slow-2g`.
  - Chờ lần lượt: sự kiện `load` (tối đa 8 s) → `data-splash` là `exit`/`done` hoặc không có (`MutationObserver`; điều hướng trong site quay về `/` thấy `done` ngay) → `requestIdleCallback` (tối đa 1 s; Safari dùng `setTimeout`).
  - Chọn nguồn: nguồn đầu tiên mà `decodingInfo` báo `supported`, `smooth` và `powerEfficient`; không có API thì `canPlayType` là `"probably"`; nguồn cuối là dự phòng. Gắn nguồn đã chọn và các nguồn sau nó: trình duyệt chỉ chuyển sang nguồn sau khi file không tải hoặc không đọc được, nên không tốn byte; máy đã bị chuyển sang H.264 không bao giờ quay lại AV1.
  - `muted = true`, `load()`, ở `loadedmetadata` đầu tiên đặt `currentTime = 2.25`, `play()` (bị chặn thì poster ở lại). Khi phát lần đầu, lớp video mờ dần 1 s bằng Web Animations (`ease-in-out`, chậm lúc đầu nên vài khung tối trước cảnh sáng ở 2,33 s không lộ ra).
  - Giữ `IntersectionObserver`: cuộn khỏi màn hình thì dừng, quay lại thì phát tiếp. Bấm logo ở `/` (`usePageTick`): quay về 2,25 s và mờ dần lại, không tải lại.
  - Rời trang, hoặc bật giảm chuyển động giữa chừng: dừng, gỡ `<source>`, gọi `load()` để huỷ request đang tải.

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
| 4 | Video bước nhanh: faststart, giữ âm thanh (B1) | Chủ quán chọn B1 (2026-10-15) | gộp vào bước 6 (bản encode đã faststart) | — |
| 5 | Ảnh: `minimumCacheTTL` (xong, PR #9), AVIF, `sizes` | Không | 1–2 giờ | Revert |
| 6 | Video encode + `HeroVideo` hoãn tải | Chủ quán chọn CRF 48 / 27 và phát trên điện thoại (2026-10-15) | 3–4 giờ; PR #16 | Revert PR (`main.mp4` còn trong git) |
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
| Poster trở thành phần tử LCP và chậm | LCP không giảm | Poster nén qua `next/image`, `loading="eager"`; đo lab: điện thoại LCP vẫn là ảnh nền màn hình chờ, máy tính LCP (poster) 1 356 → 760 ms | Revert |
| Cache dài giữ tệp cũ sau khi thay nội dung | Khách thấy ảnh cũ | Đổi tên khi đổi nội dung; cache 7 ngày thay vì 1 năm; purge URL ([Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)) | Purge |
| AVIF làm CPU VPS tăng lúc nén lần đầu | Deploy chậm, CPU cao | Theo dõi; Cloudflare cache giảm số lần nén | Bỏ AVIF |
| Repo nặng thêm 58,3 MB vì video mới (pack trước đó khoảng 118 MiB) | Clone chậm | Chấp nhận (chủ quán); tách video khỏi git để sau | — |
| MB trong 10 s đầu gần như không giảm (Chrome tải trước video nhanh hết đường truyền khi đã phát) | 003-AC-03 không đạt | Đo lab: giảm khoảng 11%; nếu cần đạt thì bản nhỏ hơn cho điện thoại hoặc giới hạn tải trước, quyết định riêng | — |

## 7. Ước lượng

Bước 2–7 và 9–10: khoảng 11–16 giờ dev (ước lượng thô), chưa tính thời gian chờ duyệt; bước 8 chưa ước lượng.

## 8. Câu hỏi mở

Xem [spec.md mục 12](spec.md#12-câu-hỏi-mở). Chưa rõ: lỗi console mà PageSpeed báo (mọi 38 URL tài nguyên trên trang chủ đều trả 200, đã kiểm 2026-10-14; có thể do autoplay video trong máy đo).
