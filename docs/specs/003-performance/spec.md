# 003: Tốc độ trang (Core Web Vitals)

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Mục lục spec](../README.md), [plan.md](plan.md), [tasks.md](tasks.md), [Hiệu năng: số đo](../../dev/perf.md), [Mục lục ADR](../../adr/README.md) (ADR 0006, ADR 0008), [Lộ trình M3](../../plan/roadmap.md#m3-tốc-độ-vòng-2)

Tốc độ trên điện thoại ảnh hưởng tới xếp hạng và tới dữ liệu di động của khách. Spec này đặt mục tiêu đo được cho https://thehot.vn, ghi mốc đo ban đầu và liệt kê các thay đổi theo thứ tự lợi ích. Số đo chính thức (kèm cách đo) nằm ở [Hiệu năng: số đo](../../dev/perf.md); ở đây chỉ trích để giải thích.

Hiện thực: phần A (ưu tiên ảnh LCP, logo đúng kích thước) chạy trên production từ Jenkins build #16 (PR #4). Phần C (cache) xong 2026-10-15: Cloudflare (chủ quán), header 7 ngày ở reverse proxy (repo hạ tầng), `images.minimumCacheTTL` 7 ngày (PR #9, Jenkins build #19); lần gọi thứ hai trúng cache Cloudflare. Chưa đo lại PageSpeed sau PR #4 và sau cache. Phần B chờ chủ quán chọn cách xử lý âm thanh video (chủ quán muốn giữ âm thanh); phần D còn AVIF và `sizes`; E–H chưa làm, nhiều phần cần chủ quán duyệt. Trạng thái chi tiết ở [tasks.md](tasks.md).

## 1. Mục tiêu

| Chỉ số (PageSpeed Insights, Mobile, trung vị 3 lần) | Mục tiêu |
|---|---|
| LCP | < 2,5 s |
| CLS | < 0,1 |
| INP (dữ liệu thật) / TBT (giả lập) | < 200 ms / < 200 ms |
| Dữ liệu tải trong 10 giây đầu ở trang chủ (điện thoại, Fast 4G, tắt cache) | Giảm ít nhất 70% so với mốc |
| `cf-cache-status` của ảnh `/_next/image` ở lần tải thứ hai | `HIT` |
| Ảnh chụp của Google (Test live URL) | Thấy chữ đầu trang trang chủ |

Mọi thay đổi phải đo trước và sau; không sửa theo cảm tính.

**Mốc đo ban đầu** (PageSpeed Mobile, 2026-10-14 16:41, commit `7af5058`, trước PR #4): Performance 90 · LCP 2,9 s · CLS 0 · TBT 40 ms · Speed Index 5,6 s · FCP 1,7 s · Accessibility 100 · Best Practices 96 · SEO 100. Phần tử LCP là ảnh nền `hero-backdrop.jpg` trong màn hình chờ; LCP gồm TTFB 150 ms, chờ bắt đầu tải 550 ms, tải 710 ms, render 90 ms. Chỉ LCP vượt ngưỡng; Speed Index cao.

**Hiện trạng khác** (kiểm 2026-10-14):

| Điểm | Thực tế |
|---|---|
| Video đầu trang chủ `public/videos/main.mp4` | 83,7 MB, 103 s, 1080×1920, H.264 kèm track âm thanh AAC (khoảng 129 kbps, 1,7 MB, khoảng 2% file; đo 2026-10-15; video luôn tắt tiếng khi phát), khoảng 6,5 Mbps, không faststart (`moov` ở cuối file nên trình duyệt phải đọc cuối file mới phát được). PageSpeed không bắt lỗi vì `preload="metadata"`, nhưng khách vẫn tốn dữ liệu thật |
| `HeroVideo` | Một nguồn, không có bản AV1; tự phát cả trên điện thoại; cả khối mờ dần từ opacity 0 trong 1,2 s; nhánh dự phòng khi video lỗi dùng poster `next/image` lazy (Googlebot thấy nhánh này) |
| `FixedVideo` (About, Bếp) | Đã tốt: chỉ gắn nguồn trên màn hình lớn và khi không giảm chuyển động, `preload="none"`, có bản AV1 |
| Cache tệp trong `public/` | Next.js gửi `max-age=0`; Cloudflare hỏi lại origin mỗi lần; trình duyệt nhận TTL mặc định 4 giờ của Cloudflare. Đã sửa 2026-10-15 (phần C) |
| Cache `/_next/image` | Cloudflare `DYNAMIC` (URL không có đuôi file) nên mọi ảnh chạy về origin; bộ nhớ ảnh đã nén của Next.js mất sau mỗi deploy. Đã sửa 2026-10-15 (phần C, D): Cloudflare cache 7 ngày |
| Màn hình chờ | Giữ tối đa 6 s; chữ hero bắt đầu trong suốt; ảnh chụp của Google không thấy chữ đầu trang |
| Font | Ngoài 5 file preload, CSS tải thêm Be Vietnam Pro 500/600 (3 subset), khoảng 110 KiB; `latin-ext` tải vì chữ tiếng Việt nằm trong cả hai `unicode-range` |
| Khác | CSS chặn render khoảng 150 ms; JS legacy khoảng 24 KiB; PageSpeed báo có lỗi console (chưa rõ lỗi gì) |
| Đo thật | Cloudflare Web Analytics đang bật trên zone (beacon tự chèn), có Core Web Vitals của khách thật |

## 2. Câu chuyện người dùng

| # | Là | Tôi muốn | Để |
|---|---|---|---|
| U1 | Khách mở site bằng 4G | thấy nội dung nhanh và không tốn hàng chục MB | không bỏ đi giữa chừng |
| U2 | Khách bật tiết kiệm dữ liệu hoặc giảm chuyển động | site không tải video | đỡ tốn dữ liệu, không bị chóng mặt |
| U3 | Chủ quán | video thương hiệu vẫn đủ 103 s và đẹp | giữ cảm giác của quán |
| U4 | Google | đo LCP dưới ngưỡng và thấy chữ đầu trang | xếp hạng trang tốt trên điện thoại |

## 3. Các phần

### Phần A: ưu tiên LCP và logo (xong, PR #4)

- Ảnh nền màn hình chờ và trang con: `preload` → `priority` (`loading="eager"` + `fetchPriority="high"`), đúng khuyến nghị của PageSpeed và tài liệu Next 16. Không đổi giao diện.
- Logo: bỏ `unoptimized`, `sizes` theo chiều cao hiển thị, `loading="eager"` + `fetchPriority="low"` (không preload, không tranh băng thông với ảnh LCP). Điện thoại tải WebP `w=256` khoảng 31 KB thay cho PNG 88,8 KB.
- Logo trong menu điều hướng dùng lại cùng `sizes`, trúng file đã nén thay vì tải PNG gốc khi mở menu.

### Phần B: video hero (chưa làm; cần chủ quán chọn cách xử lý âm thanh và duyệt chất lượng)

- Giữ đủ 103 s: chủ quán chưa chọn được đoạn cắt (quyết định 2026-10-14). Mọi cách giảm dung lượng không đổi nội dung hay độ dài.
- **Giữ âm thanh** (chủ quán, 2026-10-15). Track âm thanh chỉ 1,7 MB trên 83,7 MB (khoảng 2%), nên bỏ đi gần như không giảm dung lượng. Mọi bản (đóng gói lại hay encode lại) đều giữ track âm thanh.
- Bước nhanh: đưa `moov` lên đầu file (faststart), copy nguyên mọi track (`-map 0 -c copy`): hình và tiếng giữ nguyên từng byte, phát được khi mới tải phần đầu. Cần cài `ffmpeg`.
- Hiện khách không nghe được tiếng: trình duyệt chỉ cho tự phát video đang tắt tiếng (`muted`), và chưa có nút bật tiếng. Cách xử lý, chờ chủ quán chọn ([ADR 0008](../../adr/0008-compress-hero-video-without-trimming.md)):

  | Cách | Làm gì | Khách nghe được tiếng | Thêm việc |
  |---|---|---|---|
  | B1 | Chỉ faststart; âm thanh nằm sẵn trong file | Không | Không đổi giao diện |
  | B2 | Nút bật/tắt tiếng trên video hero | Có, sau khi bấm | Nút mới trên hero, cần duyệt thiết kế |
  | B3 | Nút "Xem video có tiếng" mở trình phát riêng (có điều khiển, phát có tiếng) | Có, trong trình phát | Trình phát mới, cần duyệt thiết kế |

  B2 và B3 vẫn làm bước faststart như B1.
- Encode lại: AV1 1080×1920 cho trình duyệt có AV1; H.264 720×1280 dự phòng (iPhone, Mac không có AV1); cả hai giữ track âm thanh. Tên file có phiên bản (`main.v2.*`) để bật cache dài.
- `HeroVideo` theo mẫu `FixedVideo`: nhiều `<source>` kèm `type` có codec; `preload="none"`; chỉ gắn nguồn và phát sau khi trang tải xong và sau màn hình chờ; poster hiện ngay, tải ưu tiên cao; chỉ lớp video mờ dần, poster không mờ.
- Không tải video khi bật giảm chuyển động, bật tiết kiệm dữ liệu (`saveData`) hoặc mạng `2g`/`slow-2g`: chỉ hiện poster.
- Điện thoại: [CẦN XÁC NHẬN: phát video hero (hoãn tải như trên) hay chỉ hiện poster như `FixedVideo` — chưa xác định, cần chủ quán xác nhận; đề xuất: có phát]

### Phần C: cache (xong 2026-10-15)

- Tệp trong `public/` (`/videos`, `/images`, `/sites`): `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` (7 ngày). Header đặt ở reverse proxy trên VPS: PR #7 của repo hạ tầng `qkenn04/infra-qkenn`, đã merge và áp lên VPS. Không dùng 1 năm (`max-age=31536000, immutable`) vì tên tệp chưa đổi theo nội dung; chỉ chuyển sang 1 năm khi mọi tệp đổi nội dung đều đổi tên.
- Cloudflare (chủ quán làm 2026-10-15): Browser Cache TTL = "Respect Existing Headers"; Cache Rule "Cache Next images": `URI Path` bắt đầu bằng `/_next/image` → Eligible for cache. Query string (`url`, `w`, `q`) nằm trong khoá cache, phân biệt từng ảnh.
- `/_next/image` trả `public, max-age=604800, must-revalidate` nhờ `images.minimumCacheTTL` 7 ngày (phần D, PR #9).
- Kết quả (kiểm 2026-10-15): lần gọi thứ hai cùng URL trả `cf-cache-status: HIT` cho cả tệp `public/` và `/_next/image`; HTML vẫn `DYNAMIC` (Cloudflare không cache HTML). Chi tiết: [Hiệu năng, mục 4.1](../../dev/perf.md#41-cache-đã-kiểm-2026-10-15).
- Quy tắc repo: đổi nội dung tệp trong `public/` thì đổi tên tệp; lỡ thay mà không đổi tên thì purge URL trên Cloudflare ([Triển khai, mục 6.4](../../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)).

### Phần D: ảnh (một phần xong)

- `images.minimumCacheTTL` 7 ngày (604 800 giây; xong, PR #9, Jenkins build #19, 2026-10-15) để `/_next/image` trả `max-age` dài, đi cùng Cache Rule. Ban đầu đề xuất 30 ngày; chọn 7 ngày cho khớp thời hạn của ảnh gốc ở reverse proxy, vì tên tệp chưa đổi theo nội dung (mặc định của Next.js là 4 giờ).
- `images.formats: ["image/avif", "image/webp"]`; kiểm CPU của VPS lúc nén lần đầu.
- Rà `sizes` của gallery và menu: ảnh tải về rộng gần bằng kích thước hiển thị × DPR.
- Tuỳ chọn: giữ `.next/cache` qua các lần deploy nếu thấy CPU tăng lúc deploy.

### Phần E: màn hình chờ và chữ đầu trang (chưa làm; cần duyệt thiết kế)

- Màn hình chờ tối đa 1,5 s, chỉ lần đầu vào site trong phiên (`sessionStorage`). Khi đó mục "Tùy chọn hiển thị" trong `/privacy` đúng trở lại; viết lại cho khớp.
- Chữ hero và nút Đặt bàn hiện ngay khi tải; hiệu ứng chỉ dùng `transform`, không bắt đầu từ opacity 0.

### Phần F: font (chưa làm; đổi giao diện, cần duyệt)

Mỗi weight chỉ tải một subset để bỏ phần trùng `latin-ext`/`vietnamese`. Thay đổi này làm lệch kerning ở khoảng 83 chỗ nên cần duyệt. Weight 500/600 đang được dùng thật, giữ lại.

### Phần G: JavaScript và INP (chỉ làm khi đo thấy kém)

Ứng viên: không gắn `CustomCursor` khi con trỏ thô (`pointer: coarse`); tắt Lenis khi giảm chuyển động hoặc trên cảm ứng nếu gây trễ; tải chậm phần nặng của menu lật sách; `motion` dùng `LazyMotion` nếu bundle lớn; `browserslist` hiện đại để bỏ JS legacy.

### Phần H: đo liên tục

- Ngay bây giờ: Cloudflare → Analytics & Logs → Web Analytics (Core Web Vitals của khách thật).
- Sau [004](../004-analytics/spec.md): gửi LCP, INP, CLS (làm tròn, kèm loại thiết bị) về Umami (và GA4 khi có đồng ý).
- Search Console → Core Web Vitals mỗi tháng khi đủ lượt truy cập.

## 4. Dữ liệu

Không áp dụng.

## 5. API

Không có API.

## 6. Quy tắc và kiểm tra

1. Đo trước và sau mỗi PR bằng cùng một cách (PageSpeed Mobile, 3 lần, trung vị); ghi vào [Hiệu năng: số đo](../../dev/perf.md).
2. Không đổi nội dung hay độ dài video hero khi chưa có quyết định mới của chủ quán.
3. Thay đổi nhìn thấy được (hiệu ứng, màn hình chờ, font) cần duyệt trước khi merge, kèm video màn hình trước/sau.
4. Tệp tĩnh có cache dài phải đổi tên khi đổi nội dung; lỡ giữ tên thì purge URL trên Cloudflare. Chỉ tăng cache lên 1 năm khi quy tắc đổi tên được giữ cho mọi tệp.

## 7. Trạng thái trống, lỗi, đang tải

| Tình huống | Người dùng thấy |
|---|---|
| Trình duyệt không có AV1 | Bản H.264 720p |
| Giảm chuyển động, tiết kiệm dữ liệu, mạng 2g | Poster, không video |
| Video lỗi | Poster (tải ưu tiên, không lazy) |
| JS tắt | Màn hình chờ chạy theo đồng hồ CSS rồi mờ; trang đọc được |

## 8. Tiêu chí nghiệm thu

Loại kiểm: xem [mục lục spec, mục 4](../README.md#4-quy-ước).

| Mã | Cho (Given) | Khi (When) | Thì (Then) | Loại |
|---|---|---|---|---|
| 003-AC-01 | Production | PageSpeed Mobile `/`, 3 lần | Trung vị LCP < 2,5 s | E |
| 003-AC-02 | Production | Như trên | CLS < 0,1; TBT < 200 ms | E |
| 003-AC-03 | Production, đã có mốc "MB trong 10 s đầu" | DevTools Network, Fast 4G, tắt cache, tải `/` | Dữ liệu 10 s đầu giảm ít nhất 70% so với mốc | M |
| 003-AC-04 | Đã deploy phần B | Tải `/` | Request video chỉ xuất hiện sau sự kiện `load` và sau màn hình chờ; không có request `Range` tới cuối file | M |
| 003-AC-05 | Đã deploy phần B; bật *Emulate prefers-reduced-motion* hoặc `saveData` | Tải `/` | Không có request video; poster hiện | M |
| 003-AC-06 | Đã deploy phần B | Mở `/` trên Chrome và trên iPhone không có chip AV1 | Chrome tải bản AV1; iPhone tải bản H.264 720p | M |
| 003-AC-07 | Đã deploy phần C, D | Gọi cùng một URL `/_next/image?…` hai lần | Lần hai `cf-cache-status: HIT` | E |
| 003-AC-08 | Đã deploy phần E | Search Console → Test live URL `/` | Ảnh chụp thấy chữ hero và nút Đặt bàn | E |
| 003-AC-09 | Production (phần A) | Xem HTML trang bất kỳ | Preload ảnh nền có `fetchPriority="high"`; logo qua `/_next/image` với `sizes`, không preload | E |

## 9. Ngoài phạm vi

- Cắt ngắn video hero (chủ quán chưa quyết).
- Thay ảnh nền template (chủ quán giữ, 2026-10-14).
- Đưa video ra khỏi git (Git LFS hoặc lưu trữ ngoài): để sau, ghi ở [lộ trình](../../plan/roadmap.md#4-để-sau-phiên-bản-đầu).
- Header bảo mật (HSTS, CSP, X-Frame-Options, COOP) mà PageSpeed nêu ở Best Practices: việc của repo hạ tầng, không tính điểm tốc độ.

## 10. Phụ thuộc

- Cần: `ffmpeg` có encoder AV1 (máy dev chưa có; hoặc chạy trong Docker); quyết định của chủ quán về âm thanh video (B1/B2/B3). Phần C đã xong (Cloudflare, repo hạ tầng).
- Phần H cần [004](../004-analytics/spec.md).
- Phần E ảnh hưởng thời điểm hiện banner xin đồng ý của [004](../004-analytics/spec.md) (banner hiện sau màn hình chờ).

## 11. Mốc

Phần A: M1. Phần B–H: M3 ([lộ trình](../../plan/roadmap.md#m3-tốc-độ-vòng-2)).

## 12. Câu hỏi mở

- [CẦN XÁC NHẬN: trên điện thoại phát video hero (hoãn tải) hay chỉ hiện poster — chưa xác định, cần chủ quán xác nhận]
- [CẦN XÁC NHẬN: chủ quán duyệt chất lượng video sau khi encode (xem bản gốc và bản mới cạnh nhau trên điện thoại và máy tính)]
- [CẦN XÁC NHẬN: chủ quán và `kennle04` duyệt màn hình chờ ngắn hơn và chữ hero hiện ngay (phần E)]
- [CẦN XÁC NHẬN: duyệt đổi subset font (phần F, lệch kerning nhẹ)]
- [CẦN XÁC NHẬN: âm thanh video hero (chủ quán muốn giữ): B1 chỉ faststart, B2 nút bật tiếng, hay B3 trình phát "Xem video có tiếng" — chưa xác định, cần chủ quán chọn]

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo từ ghi chú kế hoạch tốc độ, cập nhật theo PR #4 đã merge; trạng thái Đang áp dụng |
| 2026-10-15 | Phần C xong (Cloudflare, header 7 ngày ở reverse proxy); phần D: `minimumCacheTTL` 7 ngày thay 30 ngày (PR #9); phần B: giữ âm thanh theo ý chủ quán, thêm các cách B1/B2/B3; bỏ câu hỏi ai làm Cloudflare (chủ quán đã làm) |
