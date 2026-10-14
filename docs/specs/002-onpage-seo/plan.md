# 002: SEO trên trang, kế hoạch kỹ thuật

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [spec.md](spec.md), [tasks.md](tasks.md), [Mục lục ADR](../../adr/README.md) (ADR 0005)

## 1. Tóm tắt cách làm

Tiêu đề và mô tả của mọi trang gom về một file `src/seo/page-meta.ts`; mỗi `page.tsx` chỉ gọi `pageMetadata(path)`. Thông tin quán (giờ, địa chỉ, hotline) đọc từ `site.ts`, nên sửa một chỗ là đổi cả tiêu đề, mô tả, footer và JSON-LD. Ảnh chia sẻ của trang con được khai rõ trong `pageMetadata()`. Phần JSON-LD còn lại sẽ dựng từ cùng nguồn dữ liệu đó, chỉ với thông tin đã xác nhận.

## 2. Thiết kế

### 2.1 Đã xây (PR #5, PR #6)

| Thành phần | Vai trò |
|---|---|
| `src/seo/page-meta.ts` | `brandName` ("The Hot Beer Garden Đà Lạt"), `homeTitle`, bảng `pageMeta` (tiêu đề, mô tả từng trang con), `pageMetadata(path)` trả `title`, `description`, `canonical`, `openGraph` |
| `src/app/layout.tsx` | `title: { default: homeTitle, template: "%s — <brandName>" }`; Open Graph của trang chủ giữ tiêu đề slogan (`site.rootTitle`); `twitter` chỉ có `card`, để Next.js chép tiêu đề và mô tả từ Open Graph của từng trang |
| `page.tsx` của 6 trang con | `export const metadata = pageMetadata("/…")` |
| Ảnh chia sẻ | Next.js chỉ áp `src/app/opengraph-image.png` cho trang **không** có `openGraph` riêng; mọi trang con đều có, nên `pageMetadata()` khai `images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: site.rootTitle }]` |

Hệ quả phụ (đã chấp nhận ở PR #5): thẻ Twitter của trang con giờ lấy theo Open Graph của chính trang đó (trước đây mọi trang mang thẻ của trang chủ); tiêu đề trang 404 theo tiêu đề mặc định mới.

### 2.2 Đề xuất cho phần C (JSON-LD)

- Dữ liệu: thêm vào `site.ts` các trường đã xác nhận (`geo`, danh sách `sameAs`, giờ đóng cửa, `priceRange`, `paymentAccepted`). Không đặt giá trị chưa xác nhận dưới dạng giá trị mặc định.
- Dựng JSON-LD ở một module riêng (ví dụ `src/seo/structured-data.ts`) thay cho hằng `restaurantSchema` trong `layout.tsx`; xuất một `@graph` gồm nút `Restaurant`/`BarOrPub`, nút `WebSite` và các nút `Event`.
- `Event` sinh từ `homeEvents`: chỉ phần tử không có `illustrative: true` và có `timing.kind === "scheduled"` với giờ cụ thể (không `dateOnly`). Trường: `name`, `startDate`, `endDate`, `location` (trỏ `@id` của quán), `image`, `description`, `eventStatus`, `eventAttendanceMode` (offline). `offers`, `performer` chỉ thêm khi có thông tin thật.
- `Restaurant.image`: 3–5 ảnh thật; tạm giữ ảnh OG cho tới khi có ảnh ngang (001-T40).
- Giữ JSON-LD trong `<body>` của root layout như hiện tại (đã được Rich Results Test nhận: Local business, Organization).

### 2.3 Đề xuất cho phần D–F

- Alt: sửa trong các module nội dung (`content.ts`, `menuPages.ts`, `videos.ts`), không sửa trong component.
- Ảnh chia sẻ riêng: thêm tham số ảnh cho `pageMetadata()`; file 1200×630 trong `public/` với tên có nghĩa.
- Chữ giới thiệu, hỏi đáp: nội dung trong module dữ liệu của trang chủ, component mới theo design system hiện có; câu chữ do chủ quán duyệt.

## 3. Thay đổi kéo theo

| Loại | Thay đổi | Tài liệu |
|---|---|---|
| Dữ liệu quán | Trường mới trong `site.ts` | Spec này, mục 4 |
| Sitemap | Đổi nguồn của trang chủ (component mới) thì thêm vào `sources` | [001](../001-sitemap-automation/plan.md) |
| Giao diện (phần F) | Nội dung hiển thị mới | Duyệt thiết kế trước khi merge |

## 4. File dự kiến chạm (phần C–F)

- `src/components/sites/nokto/site.ts`: trường thông tin quán mới.
- `src/app/layout.tsx`: thay `restaurantSchema` bằng dữ liệu từ module mới.
- `src/seo/structured-data.ts` (mới): dựng `@graph`.
- `src/components/sites/the-hot/home/content.ts`: gỡ `illustrative` cho sự kiện 16/10, 17/10; sửa alt "ảnh minh hoạ" cho đúng.
- `src/seo/page-meta.ts`: ảnh chia sẻ theo trang.
- Component trang chủ cho phần F.

## 5. Thứ tự làm

1. Gỡ nhãn minh hoạ của sự kiện 16/10, 17/10 (đã xác nhận là thật). Làm sớm, trước ngày sự kiện.
2. Lấy câu trả lời của chủ quán (spec mục 12).
3. PR JSON-LD (phần C) với các trường đã xác nhận; kiểm bằng Rich Results Test trên bản preview hoặc bằng cách dán HTML.
4. PR alt (phần D), làm cùng đổi tên ảnh của 001 nếu ảnh đã có.
5. PR ảnh chia sẻ riêng (phần E) khi có ảnh ngang.
6. PR chữ trên trang (phần F) sau khi câu chữ và thiết kế được duyệt.

## 6. Kiểm thử

| Tiêu chí | Kiểm bằng | Loại |
|---|---|---|
| 002-AC-01 → 002-AC-03 | So chuỗi chính xác trên HTML đã render của 7 trang (đã làm ở PR #5, #6); kiểm lại trên production | E |
| 002-AC-04 | https://search.google.com/test/rich-results, https://validator.schema.org | E |
| 002-AC-05, 002-AC-06 | Review PR theo bảng nguồn ở spec phần C | M |
| 002-AC-07 | Rà DOM 7 trang | M |
| 002-AC-08 | https://developers.facebook.com/tools/debug/ | E |
| 002-AC-09 | Search Console → URL Inspection → Test live URL | E |

## 7. Rủi ro và cách lùi

| Rủi ro | Dấu hiệu | Giảm thiểu | Lùi lại |
|---|---|---|---|
| JSON-LD ghi thông tin sai hoặc khác Google Maps | Google hiện giờ hoặc giá sai | Chỉ dùng thông tin đã xác nhận; giờ đọc từ `site.ts` | Revert PR |
| Chữ mới làm vỡ bố cục | Ảnh chụp trước/sau khác ý | Duyệt thiết kế trước merge | Revert PR |
| Xung đột với nhánh `dev` của `kennle04` | Conflict khi rebase | PR nhỏ, báo trước | Rebase |
| Facebook giữ ảnh cũ trong bộ nhớ đệm | Chia sẻ vẫn không có ảnh | Scrape Again từng URL sau deploy | — |

## 8. Ước lượng

Phần A, B: xong trong ngày 2026-10-14. Phần C–F: chưa ước lượng; phụ thuộc thời gian chờ câu trả lời và ảnh.

## 9. Câu hỏi mở

Xem [spec.md mục 12](spec.md#12-câu-hỏi-mở).
