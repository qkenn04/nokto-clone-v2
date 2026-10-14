# ADR 0008: Video hero giữ đủ 103 giây và giữ âm thanh, giảm dung lượng bằng faststart, AV1 + 720p và hoãn tải

> Trạng thái: Đề xuất · Cập nhật: 2026-10-15 · Liên quan: [Số đo hiệu năng](../dev/perf.md), [ADR 0006](0006-prioritize-lcp-with-fetchpriority.md), [Front-end](../dev/frontend.md), [Đặc tả sản phẩm](../product/spec.md)

## Trạng thái

Đề xuất.

## Ngày

- Quyết định: chưa chốt
- Người quyết định: chủ quán (chất lượng video, phát trên điện thoại, cách cho khách nghe tiếng) và chủ repo (`qkenn04`)

## Bối cảnh

- `public/videos/main.mp4` (video đầu trang chủ): 83,7 MB, 103 s, 1080×1920, H.264 kèm track âm thanh AAC, khoảng 6,5 Mbps, **không faststart**: hộp `moov` nằm cuối file nên trình duyệt phải đọc tới cuối file mới phát được.
- Track âm thanh chỉ khoảng 129 kbps, **1,7 MB trên 83,7 MB (khoảng 2%)** (đo 2026-10-15). Gần như toàn bộ dung lượng là hình; bỏ âm thanh không giảm đáng kể dung lượng.
- Khách hiện **không nghe được** tiếng: trình duyệt chỉ cho tự phát video đang tắt tiếng (`muted`), và `HeroVideo` không có nút bật tiếng.
- **Chủ quán muốn giữ âm thanh** (2026-10-15).
- `HeroVideo` nhận một nguồn duy nhất (không có bản AV1), `preload="metadata"`, tự phát ngay **cả trên điện thoại**; cả khối video mờ dần từ trong suốt trong 1,2 s; có tạm dừng khi cuộn khỏi màn hình và khi bật giảm chuyển động. Video about và kitchen (`FixedVideo`) đã có bản AV1, faststart, chỉ gắn nguồn trên màn hình lớn và khi không bật giảm chuyển động.
- PageSpeed không bắt lỗi video (vì `preload="metadata"`), nhưng khách thật vẫn có thể tải tới khoảng 80 MB dữ liệu di động.
- **Chủ quán quyết định ngày 2026-10-14: chưa cắt độ dài video** (giữ đủ 103 s) vì chưa chọn được đoạn đẹp nhất.
- Video nằm thẳng trong git (pack khoảng 118 MiB); thêm bản encode mới làm repo nặng thêm.
- Máy dev chưa có `ffmpeg`; encoder AV1 cần kiểm (`libsvtav1` hoặc `libaom`).

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ nguyên | Không tốn công | Tốn dữ liệu khách; video phát chậm vì không faststart | Loại |
| 2 | Cắt thành đoạn lặp vài giây rồi nén (ước lượng thô 3–5 MB) | Giảm nhiều nhất | Chủ quán chưa chọn đoạn; trái quyết định giữ đủ 103 s | Loại lúc này |
| 3 | Giữ đủ 103 s và giữ âm thanh: (a) đóng gói lại có faststart, giữ nguyên mọi track (hình và tiếng), không encode lại; (b) encode lại hình AV1 1080×1920 kèm H.264 720p dự phòng, âm thanh copy nguyên; (c) `HeroVideo` hoãn tải tới sau khi trang tải xong và qua màn hình chờ, không tải khi bật giảm chuyển động, Tiết kiệm dữ liệu (`saveData`) hoặc mạng 2G, poster hiện ngay và được ưu tiên tải; (d) đặt tên file có phiên bản (`main.v2.*`) để cache dài | Không đổi nội dung và độ dài; phát được sớm; ít byte hơn | Cần chủ quán duyệt chất lượng; thêm code vào `HeroVideo`; repo nặng thêm cho tới khi video ra khỏi git | **Đề xuất** |
| 4 | Trên điện thoại chỉ hiện ảnh poster, không phát video | Không tốn byte video trên điện thoại | Mất điểm nhấn thương hiệu trên thiết bị đa số khách dùng | Chờ chủ quán chọn (câu hỏi 6 ở [đặc tả](../product/spec.md#10-câu-hỏi-mở)) |
| 5 | Đưa video ra khỏi git (Git LFS hoặc lưu riêng, phục vụ qua nginx) | Repo nhẹ | Thêm hạ tầng; không giảm byte cho khách | Để sau, quyết định riêng |
| 6 | Bỏ track âm thanh (bản đề xuất ngày 2026-10-14, khi video luôn tắt tiếng) | Bớt 1,7 MB mỗi bản | Chỉ khoảng 2% dung lượng; mất tiếng mà chủ quán muốn giữ; không còn cách cho khách nghe | Loại (2026-10-15) |

Cách cho khách nghe tiếng, đi cùng phương án 3 (chờ chủ quán chọn):

| # | Cách | Ưu | Nhược |
|---|---|---|---|
| B1 | Chỉ faststart (bước (a)); âm thanh nằm sẵn trong file, giao diện không đổi | Không thêm code giao diện; giữ đường mở cho B2, B3 sau này | Khách vẫn không nghe được tiếng |
| B2 | Nút bật/tắt tiếng trên video hero (bỏ `muted` khi khách bấm) | Khách nghe ngay trên hero; trình duyệt cho phép vì là thao tác của người dùng | Thêm nút trên hero, cần duyệt thiết kế |
| B3 | Nút "Xem video có tiếng" mở trình phát riêng (có điều khiển, không `muted`), dùng cùng file | Hero giữ nguyên; khách chủ động xem có tiếng, có tua | Thêm trình phát, cần duyệt thiết kế |

## Quyết định

Đề xuất phương án 3, làm theo thứ tự (a) → (b) → (c), mỗi bước một PR có số đo trước và sau. **Giữ âm thanh** trong mọi bản:

1. (a) `ffmpeg -i main.mp4 -map 0 -c copy -movflags +faststart`: đưa `moov` lên đầu; mọi track (hình và tiếng) giữ nguyên từng byte, không encode lại. Cần cài `ffmpeg` trên máy dev.
2. (b) AV1 1080×1920 và H.264 720×1280, cả hai faststart, giữ track âm thanh (copy nguyên, `-c:a copy`); thông số chất lượng chọn mức nhỏ nhất mà mắt không thấy khác, chủ quán duyệt trên điện thoại và máy tính. Ước lượng thô: AV1 13–20 MB, H.264 720p 20–30 MB, cộng khoảng 1,7 MB âm thanh (kiểm lại sau khi encode). Thuộc tính `type` ghi đúng chuỗi codec (kiểm bằng `ffprobe`).
3. (c) `HeroVideo` nhận nhiều nguồn như `FixedVideo`; gắn nguồn và phát sau `load`/idle và sau màn hình chờ; poster hiện ngay với độ mờ 1, chỉ lớp video mờ dần khi bắt đầu phát; không tải video khi giảm chuyển động, `saveData` hoặc mạng 2G.
4. Có phát video trên điện thoại hay không: theo lựa chọn của chủ quán (đề xuất: có, nhưng hoãn tải).
5. Cách cho khách nghe tiếng: B1, B2 hay B3 theo lựa chọn của chủ quán (chưa chọn, 2026-10-15). B1 chỉ là bước (a); B2, B3 thêm phần giao diện sau bước (a).

## Hệ quả

### Tốt

- Video bắt đầu phát khi mới tải phần đầu file; khách tải ít byte hơn nhiều; nội dung, độ dài và âm thanh không đổi.
- Không còn request video tranh băng thông với lần tải đầu của trang.

### Xấu (cái giá chấp nhận trả)

- Repo nặng thêm khoảng 30–50 MB (ước lượng thô) cho các bản encode mới, cho tới khi video ra khỏi git.
- Thêm logic vào `HeroVideo`; thay đổi nhỏ về hiệu ứng mờ dần cần chủ quán duyệt.
- Encode AV1 cần công cụ chưa có trên máy dev.
- Giữ âm thanh: mỗi bản nặng hơn khoảng 1,7 MB so với bỏ tiếng (khoảng 2% bản gốc), chấp nhận.
- B2, B3 thêm thành phần giao diện mới, cần duyệt thiết kế.

### Cần theo dõi

- DevTools Network: request video chỉ xuất hiện sau sự kiện `load`; số MB trong 10 giây đầu ở trang chủ trên điện thoại.
- PageSpeed Mobile trước và sau ([dev/perf.md](../dev/perf.md)).

## Điều kiện xem lại

- Chủ quán chọn được đoạn video: viết ADR mới (cắt video) thay thế ADR này.
- Chủ quán chọn chỉ hiện poster trên điện thoại.
- Chủ quán chọn B2 hoặc B3: ghi thiết kế nút hoặc trình phát vào spec `003-performance`; nếu cách phát video đổi hẳn (ví dụ hero không còn tự phát) thì viết ADR mới.

## Liên quan

- ADR: [0006 Ưu tiên tải phần tử LCP](0006-prioritize-lcp-with-fetchpriority.md)
- [Số đo hiệu năng, mục 4](../dev/perf.md#4-điểm-nóng-đã-biết)
- Spec: [003 Hiệu năng](../specs/003-performance/)

## Nguồn/bằng chứng

- File: `public/videos/main.mp4`, `src/components/sites/the-hot/HeroVideo.tsx`, `src/components/sites/the-hot/videos.ts`, `src/components/sites/nokto/chrome/FixedVideo.tsx`
- Số liệu: đo file video bằng `ffprobe` và thứ tự hộp MP4 ngày 2026-10-14 (kế hoạch hiệu năng ngày 2026-10-14, soạn ngoài repo; nội dung chuyển vào spec `003-performance`); dung lượng và bitrate track âm thanh đo bằng `ffprobe` ngày 2026-10-15
- Ý chủ quán giữ âm thanh: 2026-10-15

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo, trạng thái Đề xuất |
| 2026-10-15 | Giữ âm thanh theo ý chủ quán: track âm thanh chỉ 1,7 MB (khoảng 2%), bỏ đi không giảm đáng kể; bước (a) đổi thành `-map 0 -c copy`, bước (b) giữ âm thanh; bỏ track âm thanh thành phương án 6 (loại); thêm cách cho khách nghe tiếng B1/B2/B3 (chờ chủ quán). Trạng thái vẫn Đề xuất |
