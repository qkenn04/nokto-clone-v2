# ADR 0003: Cho máy tìm kiếm index site, tạm giữ ảnh nền của template

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [ADR 0002](0002-use-thehot-vn-as-primary-domain.md), [ADR 0004](0004-automate-sitemap-from-page-config-and-git.md), [ADR 0006](0006-prioritize-lcp-with-fetchpriority.md), [Mô hình đe doạ](../security/threat-model.md), [Đặc tả sản phẩm](../product/spec.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`); giữ ảnh nền template là lựa chọn của chủ quán

## Bối cảnh

- Tới 2026-10-14, nginx gửi `X-Robots-Tag: noindex` cho mọi response, vì bản deploy ban đầu là bản clone học tập của template NOKTO trong một repo công khai, dùng tài sản (ảnh, font, SVG) thuộc chủ template.
- Từ 2026-10-13, nội dung site là nội dung thật của The Hot; từ 2026-10-14 site chạy ở domain của quán ([ADR 0002](0002-use-thehot-vn-as-primary-domain.md)). Mục tiêu số một của site là khách tìm thấy quán trên Google (G1 ở [đặc tả](../product/spec.md#4-mục-tiêu)).
- Tài sản template còn được dùng (2026-10-14): `public/sites/nokto/images/hero-backdrop.jpg` hiện trên mọi trang (ảnh nền trong màn hình chờ, ảnh nền các trang con, ảnh nền phần giới thiệu trang chủ trên màn hình lớn); `path.svg`, `path2.svg` (đường timeline ở `/about`); `path-horizontal.svg` (thanh tiến trình form đặt bàn); `check.svg` (màn hình đặt bàn xong). Các file khác trong `public/sites/nokto/` không còn được tham chiếu nhưng vẫn được phục vụ công khai.
- Chưa có ảnh của quán hay phương án gradient được duyệt để thay ảnh nền. Điều khoản sử dụng tài sản template: `[CẦN XÁC NHẬN]`.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ `noindex` tới khi thay hết tài sản template | Không đưa tài sản template lên kết quả tìm kiếm | Site vô hình trên Google trong lúc chờ ảnh và duyệt thiết kế; trễ mọi việc SEO | Loại |
| 2 | Cho index ngay; tạm giữ ảnh nền và SVG template; không bao giờ khai tài sản template trong sitemap ảnh | Site tìm thấy được ngay; giao diện không đổi | Rủi ro bản quyền khi dùng ảnh của template trên site thương mại đã index | **Chọn** |
| 3 | Cho index và thay ảnh nền ngay bằng gradient CSS hoặc ảnh quán | Sạch về bản quyền | Đổi giao diện, cần ảnh và duyệt thiết kế; chủ quán chọn giữ giao diện hiện tại | Loại lúc này |

## Quyết định

1. Bỏ header `X-Robots-Tag: noindex` ở nginx (repo infra, PR #5).
2. Metadata gốc khai `robots: { index: true, follow: true }`; `robots.txt` cho phép mọi bot và trỏ tới `https://thehot.vn/sitemap.xml`.
3. Tạm giữ `hero-backdrop.jpg`, `path.svg`, `path2.svg`, `path-horizontal.svg`, `check.svg` cho tới khi có phương án thay được chủ quán duyệt.
4. Sitemap ảnh không bao giờ khai ảnh nền template, SVG trang trí, icon, logo hay ảnh OG (quy tắc ghi trong `src/seo/sitemap-images.ts`, bất biến I-05).

## Hệ quả

### Tốt

- Google index được site; đã gửi sitemap và yêu cầu index các trang chính trong Search Console ngày 2026-10-14.

### Xấu (cái giá chấp nhận trả)

- **Rủi ro bản quyền:** ảnh nền của template NOKTO xuất hiện trên mọi trang của một site thương mại đã index; các file template không dùng nữa vẫn tải được công khai.
- Ảnh nền template đang là phần tử LCP trên điện thoại ([ADR 0006](0006-prioritize-lcp-with-fetchpriority.md)): thay ảnh sẽ đổi số đo LCP, phải đo lại.

### Cần theo dõi

- Phản hồi từ chủ template hoặc bất kỳ khiếu nại nào: thay ảnh ngay.
- Chủ quán gửi ảnh hoặc duyệt phương án gradient.

## Điều kiện xem lại

- Có ảnh của quán hoặc phương án gradient được duyệt: viết ADR mới thay quyết định giữ ảnh nền, xoá `public/sites/nokto/` khi không còn file nào được dùng.
- Có khiếu nại về bản quyền.

## Liên quan

- ADR: [0002 Domain chính](0002-use-thehot-vn-as-primary-domain.md), [0004 Sitemap tự động](0004-automate-sitemap-from-page-config-and-git.md), [0006 Ưu tiên tải phần tử LCP](0006-prioritize-lcp-with-fetchpriority.md)
- [Mô hình đe doạ, mục 7](../security/threat-model.md#7-rủi-ro-đã-chấp-nhận); câu hỏi 5 ở [đặc tả](../product/spec.md#10-câu-hỏi-mở)

## Nguồn/bằng chứng

- Commit: `nokto-clone-v2` `7af5058` (README: site thật của quán, cho index); `infra-qkenn` `6f8c8f0` (PR #5): bỏ `X-Robots-Tag noindex`
- File: `src/components/sites/nokto/chrome/Backdrop.tsx`, `home/HeroIntro.tsx`, `about/AboutBody.tsx`, `reservation/ReservationProgress.tsx`, `reservation/ReservationSuccess.tsx`, `src/seo/sitemap-images.ts`
- Kiểm: `curl -sI https://thehot.vn/` không có `X-Robots-Tag`

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định đã thực hiện cùng ngày, trạng thái Chấp nhận |
