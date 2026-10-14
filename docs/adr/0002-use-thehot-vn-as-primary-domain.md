# ADR 0002: Domain chính `thehot.vn`, tên miền cũ và `www` chuyển hướng 301

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [ADR 0003](0003-allow-search-indexing.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Cấu hình](../dev/configuration.md), [Yêu cầu phi chức năng](../product/nfr.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`)

## Bối cảnh

- Site đã đổi domain hai lần: `nokto.qkenn.cloud` (2026-10-10, bản clone học tập), rồi `thehot.k2-tech.dev` (2026-10-13, sau khi đổi sang nội dung The Hot). Cả hai đều gửi `X-Robots-Tag: noindex`, nên chưa từng được Google index.
- Quán có domain riêng `thehot.vn`. Bản ghi `www` trên Cloudflare được thêm ngày 2026-10-14.
- URL tuyệt đối (canonical, sitemap, `robots.txt`, Open Graph, JSON-LD) được đóng vào bản build từ `NEXT_PUBLIC_SITE_URL`, nên domain chính phải là một giá trị duy nhất, chọn trước khi build.
- Link tới domain cũ có thể đã được chia sẻ (tin nhắn, mạng xã hội) trong vài ngày trước đó.
- Một domain chính với các bản sao không chuyển hướng sẽ tạo nội dung trùng lặp với máy tìm kiếm.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | `thehot.vn` (apex) là domain chính; `www.thehot.vn`, `thehot.k2-tech.dev`, `nokto.qkenn.cloud` chuyển hướng 301 về `https://thehot.vn`, giữ đường dẫn, giữ lâu dài | URL ngắn, khớp domain quán dùng ở mạng xã hội và Google Business Profile; link cũ vẫn chạy | Phải giữ vhost, chứng chỉ và DNS của tên miền cũ lâu dài | **Chọn** |
| 2 | `www.thehot.vn` là domain chính, apex chuyển về `www` | Quen thuộc với một số người dùng | URL dài hơn; Cloudflare đã proxy apex nên không cần `www` vì lý do kỹ thuật | Loại |
| 3 | Phục vụ cùng nội dung ở cả domain mới và cũ, chỉ dựa vào canonical | Không cần chuyển hướng | Nội dung trùng lặp; khách và máy tìm kiếm thấy nhiều địa chỉ | Loại |
| 4 | Tắt hẳn domain cũ | Bớt cấu hình phải giữ | Link đã chia sẻ bị hỏng | Loại |

## Quyết định

1. `NEXT_PUBLIC_SITE_URL=https://thehot.vn` (biến `SITE_URL` trong `Jenkinsfile`); canonical, sitemap, `robots.txt`, Open Graph và JSON-LD lấy từ đó.
2. nginx: `www.thehot.vn` (HTTP và HTTPS) chuyển hướng 301 về `https://thehot.vn$request_uri`.
3. nginx: `thehot.k2-tech.dev` và `nokto.qkenn.cloud` chuyển hướng 301 về `https://thehot.vn$request_uri`, giữ lâu dài.
4. Cấu hình nginx nằm ở `qkenn04/infra-qkenn` (PR #5 của repo đó), không ở repo này.
5. Không dùng "Change of Address" của Search Console: tên miền cũ chưa từng được index nên không có gì để chuyển.

## Hệ quả

### Tốt

- Một địa chỉ chuẩn cho mọi URL tuyệt đối; không có nội dung trùng lặp.
- Link cũ vẫn dẫn tới đúng trang mới.

### Xấu (cái giá chấp nhận trả)

- Phải giữ vhost, chứng chỉ và bản ghi DNS của hai tên miền cũ lâu dài.
- Đổi domain lần nữa cần build lại image (URL nằm trong bản build).

### Cần theo dõi

- Search Console: không có trang nào bị báo trùng lặp do domain cũ hoặc `www`.
- Hạn chứng chỉ của các tên miền cũ (repo infra).

## Điều kiện xem lại

- Tên miền cũ không còn lượt truy cập nào trong một thời gian dài (ngưỡng: `[CẦN XÁC NHẬN]`): cân nhắc bỏ chuyển hướng.
- Quán đổi domain chính.

## Liên quan

- ADR: [0003 Cho Google index](0003-allow-search-indexing.md) (cùng ngày, cùng PR ở repo infra)
- [Kiến trúc](../architecture/ARCHITECTURE.md), SEO-04 ở [yêu cầu phi chức năng](../product/nfr.md)

## Nguồn/bằng chứng

- Commit: `nokto-clone-v2` `7af5058`: ci: deploy to thehot.vn (domain chính mới; thehot.k2-tech.dev, nokto.qkenn.cloud 301)
- Commit: `infra-qkenn` `6f8c8f0` (PR #5): vhost `thehot.vn` với `www` 301 về apex; vhost tên miền cũ chỉ còn 301
- File: `Jenkinsfile` (`SITE_URL`), `src/app/layout.tsx` (`metadataBase`), `src/app/robots.ts`, `src/app/sitemap.ts`
- Kiểm: `curl -sI https://thehot.k2-tech.dev/menu` trả 301 với `Location: https://thehot.vn/menu`

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định đã thực hiện cùng ngày, trạng thái Chấp nhận |
