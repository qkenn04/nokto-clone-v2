# Hiệu năng: số đo

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Yêu cầu phi chức năng](../product/nfr.md), [Kiểm thử](testing.md), [ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md), [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md)

Chỉ chứa số **đã đo**, kèm cách đo. Ngân sách (mục tiêu) nằm ở [yêu cầu phi chức năng](../product/nfr.md#2-hiệu-năng-core-web-vitals-trên-điện-thoại). Kế hoạch tối ưu chi tiết thuộc spec `003-performance`.

## 1. Cách đo

| Chỉ số (mã NFR) | Công cụ | Môi trường đo | Lệnh tái lập |
|---|---|---|---|
| PERF-01 LCP, PERF-02 CLS, PERF-03 TBT, PERF-04 điểm Performance; Speed Index, FCP | PageSpeed Insights (Lighthouse giả lập) | Chế độ Mobile: Moto G Power, Slow 4G | https://pagespeed.web.dev → `https://thehot.vn` → Mobile |
| PERF-03 INP, LCP và CLS của khách thật | Cloudflare Web Analytics (Core Web Vitals); Search Console → Core Web Vitals khi đủ lượt truy cập | Khách thật | Cloudflare dashboard → Analytics & Logs → Web Analytics |
| Dung lượng file | `ls -l`, DevTools → Network | Máy dev | `du -h public/videos/*` |
| Cache ở Cloudflare và trình duyệt | `curl -sI` cùng một URL hai lần, đọc `cache-control` và `cf-cache-status` | Máy cá nhân, không từ VPS | `curl -sI <URL> \| grep -iE '^(cache-control\|cf-cache-status)'` |

Điều kiện chung: chạy PageSpeed 3 lần, lấy trung vị (lần đo mốc dưới đây là một lần chạy). Ghi kèm commit đang chạy trên production lúc đo. Máy dev chưa chạy được Lighthouse (Chrome chạy ngầm thiếu thư viện hệ thống) và PageSpeed API hết lượt miễn phí, nên đo qua giao diện web.

## 2. Kết quả mới nhất so với ngân sách

| Mã | Chỉ số | Ngân sách | Đo được | Ngày | Commit | Đạt |
|---|---|---|---|---|---|---|
| PERF-01 | LCP (Mobile, lab) | < 2,5 s | 2,9 s | 2026-10-14 | `7af5058` | không |
| PERF-02 | CLS | < 0,1 | 0 | 2026-10-14 | `7af5058` | có |
| PERF-03 | TBT (thay INP khi chưa có field data) | < 200 ms | 40 ms | 2026-10-14 | `7af5058` | có |
| PERF-04 | Điểm Performance (Mobile) | Không thấp hơn lần trước | 90 | 2026-10-14 | `7af5058` | mốc |

## 3. Lịch sử đo

| Ngày | Commit | Trang, thiết bị | Performance | LCP | CLS | TBT | Speed Index | Phần tử LCP | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-14 16:41 | `7af5058` | `/`, Mobile | 90 | 2,9 s | 0 | 40 ms | 5,6 s | Ảnh nền template `hero-backdrop.jpg` trong màn hình chờ | Mốc. FCP 1,7 s; Accessibility 100, Best Practices 96, SEO 100. LCP gồm TTFB 150 ms, chờ bắt đầu tải 550 ms, tải 710 ms, render 90 ms. Chẩn đoán: preload ảnh LCP không có `fetchpriority=high` |
| Chưa đo | `90f1882` (gồm PR #4, deploy ở build #16) | `/`, Mobile | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Lần đo sau PR #4 ([ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md)): điền khi đo |
| Chưa đo | | `/`, Desktop | | | | | | | Mốc Desktop chưa đo |
| Chưa đo | | `/menu`, Mobile | | | | | | | Mốc `/menu` chưa đo |
| Chưa đo | `6c246e1` (cache xong, deploy ở build #19) | `/`, Mobile | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Chưa đo | Lần đo sau cache (003 phần C): điền khi đo. Header cache đã kiểm ở mục 4.1 |

Cập nhật cột "Trạng thái" ở [yêu cầu phi chức năng](../product/nfr.md) sau mỗi lần đo.

## 4. Điểm nóng đã biết

Tính tới 2026-10-15.

| Chỗ | Triệu chứng | Đo bằng | Việc liên quan |
|---|---|---|---|
| Ảnh nền trong màn hình chờ (`Backdrop` trong `Preloader`) | Là phần tử LCP; file chỉ khoảng 17 KB (WebP w=640 q=55) nhưng chờ 550 ms mới bắt đầu tải | PageSpeed, mục LCP breakdown | PR #4: `fetchPriority="high"` ([ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md)) |
| Logo `logo.png` | PNG 640×479, 88,8 KB, tải nguyên bản (`unoptimized`, có preload) cho ô hiển thị khoảng 86 px trên điện thoại | `ls -l`; tải thử qua `/_next/image`: WebP w=128 10,9 KB, w=256 31,2 KB, w=384 57,8 KB, w=640 111,7 KB | PR #4: next/image với `sizes` đúng; điện thoại DPR 1,75 tải w=256 |
| Video hero `public/videos/main.mp4` | 83,7 MB, 103 s, 1080×1920, H.264 kèm track âm thanh AAC (khoảng 129 kbps, 1,7 MB, khoảng 2% file; chủ quán muốn giữ), khoảng 6,5 Mbps, không faststart (`moov` ở cuối file); tự phát cả trên điện thoại | `ffprobe`, thứ tự box MP4 | [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md) (Đề xuất). PageSpeed không bắt lỗi vì `preload="metadata"`, nhưng khách vẫn tốn dữ liệu |
| Video about và kitchen | about 11,5 MB (H.264) / 8,2 MB (AV1), 53 s; kitchen 9,1 / 5,1 MB, 22 s; đã faststart | `ffprobe` | Đã có bản AV1, chỉ tải trên màn hình lớn và khi không bật giảm chuyển động |
| Font | Ngoài 5 file được preload, CSS còn tải Be Vietnam Pro 500 và 600 (3 subset) khoảng 110 KiB; subset `latin-ext` tải vì ký tự tiếng Việt nằm ở cả hai unicode-range | PageSpeed | Không đổi ở PR #4 (mục 5) |
| Cache | Trước 2026-10-15: file trong `public/` trả `Cache-Control: public, max-age=0` nên Cloudflare hỏi lại máy chủ mỗi lần; `/_next/image` không được Cloudflare cache (`DYNAMIC`); bộ nhớ ảnh đã tối ưu mất sau mỗi lần deploy. **Đã sửa 2026-10-15** (mục 4.1) | `curl -sI`, header `cf-cache-status` | Spec `003-performance` phần C, D; header ở nginx thuộc repo infra (PR #7 của `qkenn04/infra-qkenn`); Cloudflare do chủ quán cài |
| Màn hình chờ | Giữ tối đa 6 s; chữ hero vào bằng hiệu ứng từ trong suốt | Speed Index 5,6 s | Cần duyệt thiết kế; spec `003-performance` |

### 4.1 Cache đã kiểm (2026-10-15)

Sau khi chủ quán cài Cloudflare (Browser Cache TTL = "Respect Existing Headers", Cache Rule "Cache Next images" cho `/_next/image`), repo infra thêm header cho `public/` (PR #7 của `qkenn04/infra-qkenn`) và PR #9 đặt `images.minimumCacheTTL` 7 ngày (`6c246e1`, build #19). Gọi `curl -sI` cùng một URL hai lần từ máy cá nhân, 2026-10-15 khoảng 00:52:

| Loại | URL thử | `cache-control` | `cf-cache-status` lần 1 → lần 2 |
|---|---|---|---|
| Tệp `public/` | `/sites/the-hot-beer-garden/images/logo.png` | `public, max-age=604800, stale-while-revalidate=86400` | `REVALIDATED` → `HIT` |
| Ảnh đã tối ưu | `/_next/image?url=%2Fsites%2Fthe-hot-beer-garden%2Fimages%2Flogo.png&w=256&q=75` | `public, max-age=604800, must-revalidate` | `MISS` → `HIT` |
| HTML | `/` | `s-maxage=31536000` (do Next.js gửi; Cloudflare không cache HTML) | `DYNAMIC` → `DYNAMIC` |

Đạt 003-AC-07. Thời hạn 7 ngày (không phải 1 năm) vì tên tệp chưa đổi theo nội dung; thay tệp mà giữ tên thì purge URL ([Triển khai, mục 6.4](../ops/deployment.md#64-thay-ảnh-hoặc-video-giữ-nguyên-tên)). Chưa đo PageSpeed sau thay đổi này (mục 3).

## 5. Thử nghiệm tối ưu

| Ngày | Giả thuyết | Thay đổi | Trước | Sau | Kết luận |
|---|---|---|---|---|---|
| 2026-10-14 | LCP chậm vì ảnh LCP được tải ở mức ưu tiên thấp, không phải vì file nặng | `Backdrop` dùng `loading="eager"` + `fetchPriority="high"` thay `preload` (PR #4, `3469ca1`) | LCP 2,9 s; chờ tải 550 ms | Chưa đo | Giữ (đã merge); xác nhận khi đo |
| 2026-10-14 | Logo tải to hơn cần ở mọi trang và tranh băng thông với ảnh LCP | Bỏ `unoptimized`, thêm `sizes` theo kích thước hiển thị, `fetchPriority="low"`, không preload (PR #4, `aff2609`, `9308df6`) | 88,8 KB PNG mỗi trang | 31,2 KB WebP (đo file, điện thoại DPR 1,75) | Giữ |
| 2026-10-14 | Bỏ subset font `latin-ext` để giảm byte | Phân tích (không merge): gỡ chồng lấn unicode-range giữa `latin-ext` và `vietnamese` | — | Sẽ lệch kerning khoảng 83 chỗ (thay đổi nhìn thấy được) | Bỏ; chỉ làm lại khi có duyệt thiết kế. Weight 500, 600 có dùng thật |
| 2026-10-15 | Ảnh và video tải lại từ máy chủ quá thường xuyên vì không được cache | Header 7 ngày cho `/videos`, `/images`, `/sites` (repo infra); Cloudflare Browser Cache TTL theo header + Cache Rule `/_next/image`; `images.minimumCacheTTL` 4 giờ → 7 ngày (PR #9) | `max-age=0` (tệp `public/`); `/_next/image` `DYNAMIC` | Lần hai `cf-cache-status: HIT` (mục 4.1); PageSpeed chưa đo | Giữ |
| 2026-10-15 | Bỏ track âm thanh của video hero giảm đáng kể dung lượng | Phân tích bằng `ffprobe` (không đổi file) | 83,7 MB | Track âm thanh AAC khoảng 129 kbps chỉ 1,7 MB (khoảng 2%) | Không bỏ: lợi ích nhỏ, chủ quán muốn giữ âm thanh ([ADR 0008](../adr/0008-compress-hero-video-without-trimming.md)) |
