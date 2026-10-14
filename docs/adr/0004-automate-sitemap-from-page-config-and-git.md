# ADR 0004: Sitemap tự động từ một file cấu hình trang, `lastmod` lấy từ lịch sử git

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mô hình dữ liệu nội dung](../architecture/data-model.md), [Triển khai](../ops/deployment.md), [Kiểm thử](../dev/testing.md), [ADR 0003](0003-allow-search-indexing.md)

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14 (PR #3 merge lúc 17:30, UTC+7)
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`)

## Bối cảnh

- `src/app/sitemap.ts` là danh sách 5 URL viết tay, `lastModified` gõ cứng `2026-10-12`, trong khi commit `d0a8e34` ngày 2026-10-14 đã sửa mọi trang. Sitemap thiếu `/terms` (trang có địa chỉ, giờ, cách đặt bàn). `changeFrequency` và `priority` có mặt nhưng Google bỏ qua.
- App có 7 file `page.tsx`; không có gì báo khi sitemap lệch với các trang thật.
- Next.js 16 sinh `sitemap.xml` tĩnh lúc build.
- `.dockerignore` loại `.git`, `ci/`, `docs/`, `scripts/` khỏi build context: trong Docker không chạy được `git log`, và script nằm trong `ci/` không chạy được ở bước Check.
- Jenkins checkout đầy đủ lịch sử (không shallow) và agent có `git`, `jq`, `bash` (đã kiểm khi làm PR #3).
- Site vừa được cho index ([ADR 0003](0003-allow-search-indexing.md)); `lastmod` đúng giúp Google biết trang nào cần đọc lại.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ danh sách và ngày gõ tay | Không tốn công | Lệch với trang thật; ngày sai; dễ quên trang mới | Loại |
| 2 | `lastmod` = ngày build | Đơn giản, luôn có ngày | Mọi lần deploy (kể cả chỉ sửa CI hay tài liệu) đổi ngày của mọi trang, Google học cách bỏ qua `lastmod` của site | Loại |
| 3 | `lastmod` = ngày commit cuối chạm vào file nguồn của từng trang, tính bằng `git log --first-parent` trên agent Jenkins trước `docker build`; danh sách trang từ một file cấu hình có guard | Ngày khớp lúc nội dung thật sự lên `main`; commit chỉ sửa CI hay tài liệu không đổi ngày | Phải khai file nguồn cho từng trang; refactor trong thư mục trang cũng đổi ngày; job phải clone đủ lịch sử | **Chọn** |
| 4 | Như 3 nhưng chạy `git log` trong Docker (đưa `.git` vào build context) | Không cần bước riêng trên agent | Build context nặng thêm, lịch sử git lọt vào stage build | Loại |
| 5 | Ghi `lastmod` tay cho từng trang trong file cấu hình | Không phụ thuộc git | Dễ quên cập nhật, quay lại vấn đề của phương án 1 | Loại |

## Quyết định

1. **Một file cấu hình:** `seo/sitemap-pages.json` liệt kê mỗi trang trong sitemap kèm `sources` (file và tài sản tạo nên nội dung nhìn thấy), `shared` (file hiện trên mọi trang), `exclude` (trang cố ý để ngoài: `/privacy`), `dynamic` (route động, chưa có). `/terms` được thêm vào sitemap.
2. **Guard lúc build:** `seo/check-sitemap-pages.mjs` (`npm run check:sitemap`, chạy trong stage Check bằng `docker build --target check`) báo lỗi khi một route trong `src/app` chưa được khai, một trang khai mà không có file page, một đường dẫn nguồn không tồn tại, hoặc `sources` của trang không chứa file page của nó. Script nằm ở `seo/` vì `ci/` bị loại khỏi build context.
3. **`lastmod` từ git:** stage Jenkins `Sitemap dates` chạy `ci/sitemap-lastmod.sh` trước `Check`. Với mỗi trang, lấy `git log -1 --first-parent --format=%cI` trên `sources` và `shared`, ghi `src/generated/sitemap-lastmod.json` (git-ignored); file đi vào build context cùng phần còn lại. `--first-parent` cho một PR đã merge ngày của commit merge, tức lúc thay đổi lên production.
4. **Hỏng thì dừng, không bịa:** script dừng khi repo là shallow clone, khi một đường dẫn chưa có commit nào, hoặc khi thiếu `git`/`jq`. Thiếu file ngày (build thường trên máy), `sitemap.ts` bỏ `<lastmod>` thay vì bịa ngày.
5. **Sitemap ảnh từ dữ liệu trang:** `src/seo/sitemap-images.ts` đọc chính các module dữ liệu mà trang render (gallery, menu, poster video, ảnh about, ảnh trang pháp lý); chỉ ảnh thật của quán, file gốc, mỗi ảnh một lần mỗi trang. `menuPages` được tách khỏi `MenuBook.tsx` (file `"use client"`) để server đọc được.
6. **Smoke test** kiểm mỗi `<url>` có `<lastmod>` và mọi `<loc>`, `<image:loc>` trả 200 trên đúng origin.

Quy tắc rút ra:

1. Thêm hoặc xoá trang: sửa `seo/sitemap-pages.json` cùng PR (build báo lỗi nếu quên).
2. Trang dùng component hay tài sản mới: thêm vào `sources` của trang đó.
3. Job Jenkins không được bật shallow clone.

## Hệ quả

### Tốt

- `lastmod` phản ánh lúc nội dung trang thật sự đổi trên production; sửa tài liệu hay CI không làm đổi ngày.
- Sitemap không còn lệch với các trang thật mà không ai biết.
- Ảnh trong sitemap luôn khớp ảnh trang đang hiện.

### Xấu (cái giá chấp nhận trả)

- Refactor chạm vào thư mục của trang cũng đổi `lastmod` (ngay sau PR #3, 5 trên 6 trang mang ngày merge của PR #3).
- Build trên máy không có `lastmod` trừ khi chạy `bash ci/sitemap-lastmod.sh` trước; smoke test cố ý báo lỗi với image build thiếu file ngày.
- Next.js ghi `<image:image>` trước `<lastmod>`; Google chấp nhận, nhưng validator XSD chặt có thể báo.
- Pipeline phụ thuộc cache git của Jenkins còn nguyên vẹn ([runbook 001](../ops/runbooks/001-jenkins-git-cache-corrupted.md)).

### Cần theo dõi

- Search Console → Sitemaps: trạng thái *Success*, số trang phát hiện bằng số trang trong cấu hình.

## Điều kiện xem lại

- Có trang động (ví dụ trang sự kiện theo `slug`): cần nguồn ngày cho từng mục, không chỉ theo file.
- Ngày bị đổi vì refactor gây nhiễu: thu hẹp `sources` về file nội dung.

## Liên quan

- ADR: [0003 Cho Google index](0003-allow-search-indexing.md)
- [Mô hình dữ liệu nội dung, mục 5.5](../architecture/data-model.md#55-cấu-hình-sitemap-seositemap-pagesjson), bất biến I-03, I-04, I-05
- Spec: [001 Sitemap tự động](../specs/001-sitemap-automation/)

## Nguồn/bằng chứng

- PR: https://github.com/qkenn04/nokto-clone-v2/pull/3 (merge `b8e2665`)
- Commit: `bfbdd16` feat(seo): drive sitemap from a single page config and guard against drift
- Commit: `f22785c` refactor(seo): expose page image data for the image sitemap; `8c8807d` feat(seo): list page images in the sitemap
- Commit: `0aba912` feat(seo): set sitemap lastmod from git history; `13d4d60` fix(seo): harden sitemap checks and cover every page's photos
- File: `seo/sitemap-pages.json`, `seo/check-sitemap-pages.mjs`, `ci/sitemap-lastmod.sh`, `src/app/sitemap.ts`, `src/seo/sitemap-images.ts`, `ci/smoke-test.sh`, stage `Sitemap dates` trong `Jenkinsfile`
- Kiểm trong PR #3: sitemap 6 URL, 6 `<lastmod>`, 25 mục ảnh (19 file); thử âm: trang chưa khai làm Check lỗi, shallow clone làm script dừng, image thiếu file ngày làm smoke test lỗi

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định đã thực hiện cùng ngày (PR #3), trạng thái Chấp nhận |
