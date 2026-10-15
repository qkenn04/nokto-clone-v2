# 002: SEO trên trang, kế hoạch kỹ thuật

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [tasks.md](tasks.md), [Mục lục ADR](../../adr/README.md) (ADR 0005)

## 1. Tóm tắt cách làm

Tiêu đề và mô tả của mọi trang gom về một file `src/seo/page-meta.ts`; mỗi `page.tsx` chỉ gọi `pageMetadata(path)`. Thông tin quán (giờ, địa chỉ, hotline) đọc từ `site.ts`, nên sửa một chỗ là đổi cả tiêu đề, mô tả, footer và JSON-LD. Ảnh chia sẻ của trang con được khai rõ trong `pageMetadata()`. JSON-LD dựng từ cùng nguồn dữ liệu đó, chỉ với thông tin đã xác nhận: đợt 1 ở PR #10 (chờ duyệt, 2026-10-15).

## 2. Thiết kế

### 2.1 Đã xây (PR #5, PR #6)

| Thành phần | Vai trò |
|---|---|
| `src/seo/page-meta.ts` | `brandName` ("The Hot Beer Garden Đà Lạt"), `homeTitle`, bảng `pageMeta` (tiêu đề, mô tả từng trang con), `pageMetadata(path)` trả `title`, `description`, `canonical`, `openGraph` |
| `src/app/layout.tsx` | `title: { default: homeTitle, template: "%s — <brandName>" }`; Open Graph của trang chủ giữ tiêu đề slogan (`site.rootTitle`); `twitter` chỉ có `card`, để Next.js chép tiêu đề và mô tả từ Open Graph của từng trang |
| `page.tsx` của 6 trang con | `export const metadata = pageMetadata("/…")` |
| Ảnh chia sẻ | Next.js chỉ áp `src/app/opengraph-image.png` cho trang **không** có `openGraph` riêng; mọi trang con đều có, nên `pageMetadata()` khai `images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: site.rootTitle }]` |

Hệ quả phụ (đã chấp nhận ở PR #5): thẻ Twitter của trang con giờ lấy theo Open Graph của chính trang đó (trước đây mọi trang mang thẻ của trang chủ); tiêu đề trang 404 theo tiêu đề mặc định mới.

### 2.2 Phần C (JSON-LD)

Đã xây:

| PR | Thay đổi |
|---|---|
| PR #8 (merge `ed262e4`, Jenkins build #17, 2026-10-15) | `home/content.ts`: bỏ `illustrative` của Friday on Fire (16/10) và Hot Saturday (17/10), nên thẻ và chú thích lightbox không còn "Chương trình minh hoạ"; After Hours và Acoustic & Chill giữ nhãn. `site.ts`: `socialHref` → `https://www.facebook.com/thehot.dalat/`, `messengerHref` → `https://m.me/thehot.dalat` (cùng trang Facebook, đã đổi tên). Alt poster của hai sự kiện vẫn ghi "ảnh minh hoạ chương trình …" (ảnh không gian quán dùng làm poster), rà ở phần D |

Chờ duyệt: PR #10 (`8d9ec01`, `6680248`, mở 2026-10-15):

- `src/seo/structured-data.ts` (mới) dựng JSON-LD từ `site.ts` và dữ liệu trang chủ, thay hằng `restaurantSchema` trong `layout.tsx`. Root layout xuất một `@graph` trên mọi trang: nút `Restaurant` + `BarOrPub` (`@id` `/#restaurant`) và nút `WebSite` (`@id` `/#website`). Trường cụ thể ở [spec phần C](spec.md#phần-c-dữ-liệu-có-cấu-trúc-đợt-1-xong-pr-10).
- `Event`: chỉ trang chủ xuất (Google muốn dữ liệu sự kiện nằm trên trang hiện sự kiện), một `@graph` thứ hai cho mọi phần tử của `homeEvents` không có `illustrative` và có lịch hợp lệ; sự kiện chỉ có ngày (`dateOnly`) dùng ngày không kèm giờ. Không có `offers` (chưa biết giá vé). Trang tĩnh, nên danh sách là bản trong `content.ts` lúc build.
- `site.ts`: `pendingFacts` (giờ mở cửa, `priceRange`, `paymentAccepted`, nhạc sống) có kiểu nhưng **để trống**; chỉ xuất khi chủ quán xác nhận. Không đặt giá trị chưa xác nhận làm giá trị mặc định.
- JSON được escape (`<` thành `\u003c`) theo hướng dẫn JSON-LD của Next.js.
- `public/favicon.ico` (16/32/48 px, khoảng 5,6 KB) cho trình duyệt và crawler gọi thẳng `/favicon.ico` (đang 404). Là tệp tĩnh trong `public/`, không phải `app/favicon.ico`, nên Next.js không thêm `<link>` mới; link `/icon.png` giữ nguyên để Google tiếp tục đọc cùng URL favicon.
- Kiểm trước merge: validator.schema.org cho JSON-LD trang chủ 0 lỗi, 0 cảnh báo; JSON đọc được trên 7 trang; mọi URL tuyệt đối và trả 200; `@id` trỏ đúng; ngày theo ISO 8601; sự kiện minh hoạ bị loại. `<body>` của 7 trang giống `main` trừ thẻ JSON-LD sự kiện mới trên `/`. Lint, typecheck, `check:sitemap`, build, `docker build --target check` đạt.
- Hệ quả phụ: `site.ts` là nguồn sitemap dùng chung, nên merge PR #10 đưa `<lastmod>` của mọi trang về ngày merge.
- Rich results cho sự kiện thường cần một trang cho mỗi sự kiện: dòng sự kiện ở trang chủ hợp lệ nhưng có thể không hiện kết quả Event (trang `/su-kien` dự kiến ở M5).

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

1. Gỡ nhãn minh hoạ của sự kiện 16/10, 17/10 (đã xác nhận là thật). Xong: PR #8, 2026-10-15.
2. Lấy câu trả lời của chủ quán (spec mục 12).
3. PR JSON-LD (phần C) với các trường đã xác nhận: PR #10, chờ duyệt (validator.schema.org đạt). Sau deploy: Rich Results Test trên production, Request indexing `/`. Các trường ở `pendingFacts` thêm bằng PR nhỏ khi chủ quán trả lời.
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

Phần A, B: xong trong ngày 2026-10-14. Phần C: nhãn sự kiện và JSON-LD đợt 1 làm trong đêm 2026-10-14 sang 2026-10-15. Phần D–F: chưa ước lượng; phụ thuộc thời gian chờ câu trả lời và ảnh.

## 9. Câu hỏi mở

Xem [spec.md mục 12](spec.md#12-câu-hỏi-mở).
