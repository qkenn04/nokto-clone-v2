# ADR 0005: Tiêu đề và mô tả cho tìm kiếm tách khỏi H1 và slogan; trang con dùng chung ảnh chia sẻ

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mô hình dữ liệu nội dung](../architecture/data-model.md), [Front-end](../dev/frontend.md), [ADR 0004](0004-automate-sitemap-from-page-config-and-git.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14 (PR #5 merge 18:18, PR #6 merge 18:33, UTC+7)
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`); nội dung tiêu đề và mô tả do chủ quán duyệt, ảnh chia sẻ trước và sau do chủ quán xem

## Bối cảnh

- `<title>` trang chủ là slogan "The Hot Beer Garden Đà Lạt — Đà Lạt lên đèn, The Hot lên mood.": một nửa độ dài dành cho slogan, không có các cụm khách thật sự tìm ("quán nhậu", "bia lạnh", "beer garden Đà Lạt"). Tiêu đề `/menu/list` ("Thực đơn dạng danh sách") cạnh tranh với `/menu`.
- Chủ quán muốn giữ slogan và các H1 hiện có trên giao diện.
- Next.js: layout gốc có title template `%s — <brandName>`; template này không đi vào Open Graph. Một trang khai `openGraph` riêng thì **thay** toàn bộ `openGraph` của layout, kể cả ảnh từ file `src/app/opengraph-image.png`. Một trang khai `twitter` riêng thì thay `twitter` của layout và mất `twitter-image.png`.
- Trước PR #6, mọi trang con khai `openGraph` (để có tiêu đề, mô tả riêng) nên không có `og:image`: link `/menu`, `/about`… dán vào Facebook, Messenger, Zalo không có ảnh.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Đổi H1 và chữ hiển thị sang câu chứa từ khoá | Một chỗ cho cả người đọc và Google | Đổi giọng thương hiệu và giao diện; cần duyệt thiết kế | Loại |
| 2 | Giữ slogan làm `<title>` | Không phải làm gì | Tiêu đề yếu cho tìm kiếm | Loại |
| 3 | Tách tiêu đề và mô tả cho tìm kiếm vào một module (`src/seo/page-meta.ts`); giao diện giữ H1 và slogan; Open Graph và Twitter của trang chủ giữ tiêu đề slogan | Tối ưu tìm kiếm mà không đổi giao diện; một nơi để sửa | Mỗi trang có hai "tiêu đề" (cho Google và trên trang) phải giữ cùng ý | **Chọn** |

Ảnh chia sẻ cho trang con:

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| a | Thiết kế ảnh OG riêng cho từng trang | Ảnh đúng nội dung từng trang | Cần thiết kế và ảnh; chưa có | Loại lúc này |
| b | Liệt kê tường minh ảnh chia sẻ của trang chủ (1200×630) trong `openGraph.images` của mọi trang con | Mọi link có ảnh ngay; một dòng code | Mọi trang con dùng chung một ảnh | **Chọn** |
| c | Bỏ `openGraph` ở trang con để kế thừa của layout | Tự có ảnh | Mất tiêu đề và mô tả chia sẻ riêng của từng trang | Loại |

## Quyết định

1. `src/seo/page-meta.ts` là nơi duy nhất chứa tiêu đề và mô tả cho tìm kiếm: `homeTitle` ("The Hot Beer Garden Đà Lạt — Quán nhậu chill, bia lạnh"), `pageMeta` cho 6 trang con, `brandName` dùng cho hậu tố " — The Hot Beer Garden Đà Lạt".
2. Mọi `page.tsx` lấy metadata bằng `pageMetadata(path)`: title, description, canonical, Open Graph (tiêu đề đầy đủ vì template không áp vào Open Graph) kèm ảnh `/opengraph-image.png` (1200×630, alt = tiêu đề slogan).
3. Trang chủ: `<title>` là `homeTitle`; Open Graph và Twitter giữ tiêu đề slogan `site.rootTitle` và mô tả hiện có.
4. Layout gốc chỉ khai `twitter: { card: "summary_large_image" }`; Next.js lấy tiêu đề và mô tả Twitter từ Open Graph của từng trang. Không khai `twitter` ở cấp trang.
5. H1, slogan và chữ hiển thị nằm ở module giao diện, không ở `page-meta.ts` (bất biến I-09).

## Hệ quả

### Tốt

- Tiêu đề nhắm đúng truy vấn thật (gợi ý tìm kiếm của Google ngày 2026-10-14) mà giao diện không đổi.
- Mọi trang có `og:image`; tiêu đề và mô tả Twitter của trang con khớp Open Graph của chính trang đó (trước đó mọi trang con thừa hưởng của trang chủ).

### Xấu (cái giá chấp nhận trả)

- Ảnh chia sẻ của mọi trang con giống nhau.
- Mô tả `/reservation` gõ lại một phần địa chỉ thay vì đọc từ `site.ts` (lệch I-01).
- Tiêu đề trang 404 theo tiêu đề mặc định mới.
- Facebook giữ bản xem trước cũ tới khi bấm "Scrape Again" trong Sharing Debugger.

### Cần theo dõi

- Search Console → Performance: truy vấn có nhiều lượt hiển thị nhưng ít lượt bấm, xem mỗi tháng để chỉnh tiêu đề và mô tả.

## Điều kiện xem lại

- Có ảnh OG riêng cho từng trang.
- Chủ quán muốn đổi H1 hoặc slogan.

## Liên quan

- [Mô hình dữ liệu nội dung, mục 5.6](../architecture/data-model.md#56-tiêu-đề-và-mô-tả-cho-tìm-kiếm-srcseopage-metats), bất biến I-09
<!-- check-links: off -->
<!-- Link tới docs/plan/ và docs/specs/ (viết ở nhánh khác). Bỏ cặp marker này khi hai nhánh đã merge. -->
- Spec: [002 SEO trên trang](../specs/002-onpage-seo/)
<!-- check-links: on -->

## Nguồn/bằng chứng

- PR: https://github.com/qkenn04/nokto-clone-v2/pull/5 (merge `afce6d1`), commit `a367729` feat(seo): keyword-focused page titles and descriptions
- PR: https://github.com/qkenn04/nokto-clone-v2/pull/6 (merge `90f1882`), commit `8cf0ced` fix(seo): give inner pages the shared share-card image
- File: `src/seo/page-meta.ts`, `src/app/layout.tsx`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`
- Kiểm trong PR: tiêu đề, mô tả, Open Graph, Twitter của 7 trang so khớp từng chuỗi; HTML `<body>` của 7 trang không đổi so với `main`; ảnh chia sẻ trả 200 `image/png`

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định đã thực hiện cùng ngày (PR #5, #6), trạng thái Chấp nhận |
