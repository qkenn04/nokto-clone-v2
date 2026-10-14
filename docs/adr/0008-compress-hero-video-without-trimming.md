# ADR 0008: Video hero giữ đủ 103 giây và giữ âm thanh, giảm dung lượng bằng AV1 + 720p faststart và hoãn tải

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Số đo hiệu năng](../dev/perf.md), [ADR 0006](0006-prioritize-lcp-with-fetchpriority.md), [Front-end](../dev/frontend.md), [Đặc tả sản phẩm](../product/spec.md), [Spec 003](../specs/003-performance/spec.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-15
- Người quyết định: chủ quán (chất lượng video, phát trên điện thoại, cách cho khách nghe tiếng) và chủ repo (`qkenn04`)

## Bối cảnh

Hiện trạng trước PR #16 (kiểm 2026-10-14 và 2026-10-15):

- `public/videos/main.mp4` (video đầu trang chủ): 83,7 MB, 103 s, 1080×1920, H.264 kèm track âm thanh AAC, khoảng 6,5 Mbps, **không faststart**: hộp `moov` nằm cuối file nên trình duyệt phải đọc tới cuối file mới phát được.
- Track âm thanh chỉ khoảng 129 kbps, **1,7 MB trên 83,7 MB (khoảng 2%)** (đo 2026-10-15). Gần như toàn bộ dung lượng là hình; bỏ âm thanh không giảm đáng kể dung lượng.
- Khách **không nghe được** tiếng: trình duyệt chỉ cho tự phát video đang tắt tiếng (`muted`), và `HeroVideo` không có nút bật tiếng.
- **Chủ quán muốn giữ âm thanh** (2026-10-15).
- `HeroVideo` nhận một nguồn duy nhất (không có bản AV1), `preload="metadata"`, tự phát ngay **cả trên điện thoại**; cả khối video mờ dần từ trong suốt trong 1,2 s; có tạm dừng khi cuộn khỏi màn hình và khi bật giảm chuyển động. Video about và kitchen (`FixedVideo`) đã có bản AV1, faststart, chỉ gắn nguồn trên màn hình lớn và khi không bật giảm chuyển động.
- PageSpeed không bắt lỗi video (vì `preload="metadata"`), nhưng khách thật vẫn có thể tải tới khoảng 80 MB dữ liệu di động.
- Video mở đầu bằng khoảng 2 s rất tối (độ sáng trung bình 16–33 trên 255: mờ dần từ đen vào cảnh biển hiệu ban đêm), cảnh sáng đầu tiên bắt đầu ở 2,33 s; ảnh poster là cảnh trong quán, sáng.
- **Chủ quán quyết định ngày 2026-10-14: chưa cắt độ dài video** (giữ đủ 103 s) vì chưa chọn được đoạn đẹp nhất.
- Video nằm thẳng trong git (pack khoảng 118 MiB); thêm bản encode mới làm repo nặng thêm.
- Máy dev có `ffmpeg` 8.0.1 với `libsvtav1` (2026-10-15). Lưu ý: ở ffmpeg 8, tuỳ chọn đầu ra `-colorspace bt709 -color_range tv` đổi màu ngầm (chuyển ma trận BT.601 sang BT.709); gắn nhãn màu phải dùng bộ lọc `setparams`.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ nguyên | Không tốn công | Tốn dữ liệu khách; video phát chậm vì không faststart | Loại |
| 2 | Cắt thành đoạn lặp vài giây rồi nén (ước lượng thô 3–5 MB) | Giảm nhiều nhất | Chủ quán chưa chọn đoạn; trái quyết định giữ đủ 103 s | Loại lúc này |
| 3 | Giữ đủ 103 s và giữ âm thanh: (a) đóng gói lại có faststart, giữ nguyên mọi track (hình và tiếng), không encode lại; (b) encode lại hình AV1 1080×1920 kèm H.264 720p dự phòng, âm thanh copy nguyên; (c) `HeroVideo` hoãn tải tới sau khi trang tải xong và qua màn hình chờ, không tải khi bật giảm chuyển động, Tiết kiệm dữ liệu (`saveData`) hoặc mạng 2G, poster hiện ngay; (d) đặt tên file có phiên bản (`main.v2.*`) để cache dài | Không đổi nội dung và độ dài; phát được sớm; ít byte hơn | Cần chủ quán duyệt chất lượng; thêm code vào `HeroVideo`; repo nặng thêm cho tới khi video ra khỏi git | **Chọn**, gộp (a) vào (b): bản encode đã faststart nên không làm bản đóng gói lại riêng |
| 4 | Trên điện thoại chỉ hiện ảnh poster, không phát video | Không tốn byte video trên điện thoại | Mất điểm nhấn thương hiệu trên thiết bị đa số khách dùng | Loại (chủ quán, 2026-10-15): điện thoại vẫn tự phát, nhưng hoãn tải |
| 5 | Đưa video ra khỏi git (Git LFS hoặc lưu riêng, phục vụ qua nginx) | Repo nhẹ | Thêm hạ tầng; không giảm byte cho khách | Để sau, quyết định riêng |
| 6 | Bỏ track âm thanh (bản đề xuất ngày 2026-10-14, khi video luôn tắt tiếng) | Bớt 1,7 MB mỗi bản | Chỉ khoảng 2% dung lượng; mất tiếng mà chủ quán muốn giữ; không còn cách cho khách nghe | Loại (2026-10-15) |

Cách cho khách nghe tiếng, đi cùng phương án 3:

| # | Cách | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| B1 | Âm thanh nằm sẵn trong file, video vẫn tắt tiếng; giao diện không đổi | Không thêm code giao diện; giữ đường mở cho B2, B3 sau này | Khách vẫn không nghe được tiếng | **Chọn** (chủ quán, 2026-10-15) |
| B2 | Nút bật/tắt tiếng trên video hero (bỏ `muted` khi khách bấm) | Khách nghe ngay trên hero; trình duyệt cho phép vì là thao tác của người dùng | Thêm nút trên hero, cần duyệt thiết kế | Không làm lúc này; PR riêng nếu chủ quán muốn |
| B3 | Nút "Xem video có tiếng" mở trình phát riêng (có điều khiển, không `muted`), dùng cùng file | Hero giữ nguyên; khách chủ động xem có tiếng, có tua | Thêm trình phát, cần duyệt thiết kế | Không làm lúc này; PR riêng nếu chủ quán muốn |

## Quyết định

Phương án 3 và cách B1, làm trong PR #16:

1. **Encode** (máy dev, ffmpeg 8.0.1), giữ đủ 103 s, cả hai faststart (`moov` trước `mdat`), track âm thanh AAC copy nguyên (`-c:a copy`, giống bản gốc từng byte), gắn nhãn BT.709 dải hẹp bằng `setparams` (không đổi điểm ảnh):
   - `public/videos/main.v2.av1.mp4`: AV1 1080×1920, SVT-AV1 `-preset 5 -crf 48 -g 240`, 26,8 MB; `type` là `video/mp4; codecs="av01.0.08M.08, mp4a.40.2"`.
   - `public/videos/main.v2.720.mp4`: H.264 High 720×1280, x264 `-preset slow -crf 27`, 31,5 MB; `type` là `video/mp4; codecs="avc1.64001F, mp4a.40.2"`.
   - Xoá `public/videos/main.mp4` (lịch sử git vẫn giữ). Tên mới là URL mới, nên cache 7 ngày không cần purge.
2. **`HeroVideo`**:
   - HTML từ server có `<video>` không nguồn (`preload="none"`) và ảnh poster `next/image` nằm dưới, hiện ngay với opacity 1, `loading="eager"`, không `fetchPriority="high"` (ảnh nền màn hình chờ là phần tử LCP trên điện thoại, [ADR 0006](0006-prioritize-lcp-with-fetchpriority.md)).
   - Không tải video (chỉ poster, 0 byte video) khi bật giảm chuyển động (theo dõi liên tục: bật giữa chừng thì dừng và gỡ nguồn), `navigator.connection.saveData`, hoặc `effectiveType` là `2g`/`slow-2g`.
   - Thứ tự chờ: sự kiện `load` của trang (tối đa 8 s sau hydrate) → màn hình chờ đang rời (`data-splash` là `exit` hoặc `done`, hoặc không có) → `requestIdleCallback` (tối đa 1 s).
   - Chọn nguồn: AV1 khi `navigator.mediaCapabilities.decodingInfo` báo `supported` và `smooth`, và trên màn hình hẹp hơn `lg` còn phải `powerEfficient` (thực tế: giải mã phần cứng). Máy tính là màn hình từ `lg` trở lên (`(min-width: 64rem)`, cùng điều kiện `FixedVideo` dùng), đọc một lần khi chọn nguồn: CPU máy tính giải mã AV1 1080p30 bằng phần mềm không vấn đề, còn trên điện thoại giải mã phần mềm tốn pin và nóng máy. Không có API thì `canPlayType` quyết định; còn lại dùng H.264 720p. Gắn nguồn đã chọn cùng các nguồn sau nó (AV1 kèm H.264 dự phòng; máy đã bị chuyển sang H.264 thì chỉ có H.264).
   - Lần phát đầu bắt đầu ở 2,25 s để không chuyển từ poster sáng sang đoạn mở đầu tối; các vòng lặp sau phát đủ 0–103 s. Lớp video mờ dần trong 1 s (`ease-in-out`) khi bắt đầu phát.
   - Tự phát bị chặn (ví dụ chế độ nguồn điện thấp trên iPhone) thì poster ở lại. Rời trang (điều hướng trong site) thì dừng, gỡ nguồn và gọi `load()` để huỷ tải.
3. **Điện thoại**: vẫn tự phát, hoãn tải như trên (chủ quán, 2026-10-15).
4. **Âm thanh**: B1, video luôn tắt tiếng; B2, B3 để PR khác nếu chủ quán muốn.

## Hệ quả

### Tốt

- Mỗi vòng video tải 26,8 MB (AV1) hoặc 31,5 MB (H.264 720p) thay vì 83,7 MB; nội dung, độ dài và âm thanh không đổi.
- Không còn request video trước sự kiện `load` và trước màn hình chờ, nên video không tranh băng thông với lần tải đầu của trang. Đo trong phòng thí nghiệm (mục "Nguồn/bằng chứng"): sự kiện `load` trên điện thoại sớm hơn khoảng 0,7 s; 30 s đầu tải 16,0 MB video thay vì 28,3 MB.
- Trên máy tính, poster là phần tử LCP: LCP lab 1,36 s (poster của thẻ `<video>`) xuống 0,76 s (poster `next/image`).
- Điện thoại và màn hình nhỏ không có giải mã AV1 phần cứng không phải giải mã AV1 bằng CPU. Máy tính không có giải mã phần cứng vẫn nhận bản AV1 1080p: nét hơn bản 720p phóng to trong khung 55% màn hình (nhất là màn hình mật độ điểm ảnh cao) và nhẹ hơn (26,8 so với 31,5 MB).

### Xấu (cái giá chấp nhận trả)

- Repo nặng thêm 58,3 MB cho hai bản encode, cho tới khi video ra khỏi git.
- Dữ liệu trong **10 s đầu** chỉ giảm khoảng 11% trong lab (8,6 MB xuống 7,6 MB, Fast 4G): khi đã bắt đầu phát, Chrome tải trước video nhanh hết mức đường truyền cho phép. Chưa đạt 003-AC-03 (giảm 70%); lợi ích nằm ở khoảng sau và ở việc không tranh băng thông lúc trang tải.
- Video trên điện thoại hiện muộn hơn (sau màn hình chờ, khoảng 3,9 s thay vì khoảng 2,2 s trong lab); trong lúc đó khách thấy poster.
- Máy tính không có giải mã AV1 phần cứng giải mã bằng CPU, tốn CPU hơn H.264 phần cứng. Máy tính bảng xoay ngang rộng từ 64rem cũng tính là máy tính.
- React tự sinh một `<link rel="preload" as="image">` (không `fetchpriority`) cho poster vì ảnh `loading="eager"`. Đo được: LCP trên điện thoại không đổi (vẫn là ảnh nền màn hình chờ); thêm `fetchPriority="low"` để bỏ preload thì LCP trên máy tính chậm lại 1,64 s, nên giữ.
- Thêm logic vào `HeroVideo`; hiệu ứng mờ dần đổi (chỉ lớp video mờ dần, poster không mờ).

### Cần theo dõi

- DevTools Network trên production: request `main.v2.*` chỉ xuất hiện sau sự kiện `load` và sau màn hình chờ; Chrome trên máy tính tải bản AV1; trên điện thoại chỉ tải bản AV1 khi có giải mã phần cứng.
- iPhone thật (Safari) và Android thật: tự phát, bản được chọn, thời điểm bắt đầu 2,25 s (003-T34).
- PageSpeed Mobile trước và sau ([dev/perf.md](../dev/perf.md)).

## Điều kiện xem lại

- Chủ quán chọn được đoạn video: viết ADR mới (cắt video) thay thế ADR này.
- Chủ quán chọn B2 hoặc B3: ghi thiết kế nút hoặc trình phát vào spec `003-performance`; nếu cách phát video đổi hẳn (ví dụ hero không còn tự phát) thì viết ADR mới.
- Cần đạt mục tiêu dữ liệu 10 s đầu (003-AC-03): cân nhắc bản nhỏ hơn cho điện thoại hoặc giới hạn tải trước (Media Source Extensions), quyết định riêng.

## Liên quan

- ADR: [0006 Ưu tiên tải phần tử LCP](0006-prioritize-lcp-with-fetchpriority.md)
- [Số đo hiệu năng, mục 4 và 5](../dev/perf.md#4-điểm-nóng-đã-biết)
- Spec: [003 Hiệu năng](../specs/003-performance/)

## Nguồn/bằng chứng

- File: `public/videos/main.v2.av1.mp4`, `public/videos/main.v2.720.mp4`, `src/components/sites/the-hot/HeroVideo.tsx`, `src/components/sites/the-hot/videos.ts`, `src/components/sites/nokto/chrome/FixedVideo.tsx`
- Số liệu file: `ffprobe` 2026-10-15. Bản gốc: 83 693 902 byte, `moov` ở cuối. AV1: 26 763 674 byte, hình 1 945 547 bit/s, level 4.0 (`av01.0.08M.08`). H.264: 31 532 435 byte, hình 2 314 841 bit/s, High level 3.1 (`avc1.64001F`). Cả ba: 102,94 s, 3086 khung hình, âm thanh AAC-LC 44,1 kHz stereo (`mp4a.40.2`), MD5 track âm thanh (`ffmpeg -map 0:a -c copy -f md5`) giống nhau `ef9dcbb9…`; độ sáng trung bình mỗi khung đo bằng `signalstats`.
- Số đo lab 2026-10-15: Chromium 153 chạy ngầm trên máy dev, image Docker build tại chỗ (không qua Cloudflare), giả lập Pixel 7, DevTools Fast 4G, CPU chậm 4×, tắt cache, trung vị 3 lần; trước = `0e639eb`, sau = PR #16. Chi tiết ở [Hiệu năng, mục 5](../dev/perf.md#5-thử-nghiệm-tối-ưu).
- Ý chủ quán: giữ đủ 103 s (2026-10-14); giữ âm thanh, chọn B1, CRF 48 / 27, điện thoại vẫn phát nhưng hoãn tải, lần phát đầu từ 2,25 s (2026-10-15).

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo, trạng thái Đề xuất |
| 2026-10-15 | Giữ âm thanh theo ý chủ quán: track âm thanh chỉ 1,7 MB (khoảng 2%), bỏ đi không giảm đáng kể; bước (a) đổi thành `-map 0 -c copy`, bước (b) giữ âm thanh; bỏ track âm thanh thành phương án 6 (loại); thêm cách cho khách nghe tiếng B1/B2/B3 (chờ chủ quán). Trạng thái vẫn Đề xuất |
| 2026-10-15 | Chủ quán chốt: phương án 3 (gộp bước (a) vào bản encode), B1, AV1 CRF 48 + H.264 720p CRF 27, điện thoại vẫn phát nhưng hoãn tải, lần phát đầu từ 2,25 s. Trạng thái Chấp nhận; ghi số đo lab của PR #16 |
| 2026-10-15 | Quy tắc chọn nguồn: máy tính (`(min-width: 64rem)`) chỉ cần `supported` và `smooth`; điện thoại và màn hình nhỏ vẫn cần thêm `powerEfficient` (PR #16, trước khi merge) |
