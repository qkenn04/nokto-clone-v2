# 001: Sitemap tự động, việc

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Việc sắp làm](../../plan/tasks.md)

## Chuẩn bị

- [x] 001-T01 Chốt đưa `/terms` vào sitemap, để `/privacy` ngoài · chốt khi duyệt và merge PR #3, 2026-10-14
- [x] 001-T02 Kiểm agent Jenkins có `git`, `jq`, `bash` và workspace đủ lịch sử · 2026-10-14 (git 2.47, jq 1.7, bash 5.2; không shallow)

## Làm

- [x] 001-T03 Cấu hình duy nhất `seo/sitemap-pages.json`, kiểm lệch, thêm `/terms` · AC: 001-AC-01, 001-AC-05 · `bfbdd16`
- [x] 001-T04 Tách `menuPages` khỏi `MenuBook.tsx`, thêm `heroVideo` vào `videos.ts` · `f22785c`
- [x] 001-T05 Sitemap ảnh từ dữ liệu trang · AC: 001-AC-07, 001-AC-08 · `8c8807d`
- [x] 001-T06 `lastmod` từ git (`--first-parent`) + stage Jenkins `Sitemap dates` · AC: 001-AC-02, 001-AC-03, 001-AC-04, 001-AC-06 · `0aba912`
- [x] 001-T07 Siết kiểm tra, phủ ảnh của mọi trang (kể cả `/reservation`, `/terms`), mở rộng smoke test · `13d4d60`

## Kiểm

- [x] 001-T10 Chạy lại toàn bộ luồng Jenkins (Sitemap dates → Check → Build → Smoke test) trong Docker; mọi bước xanh · 2026-10-14
- [x] 001-T11 Kiểm âm: trang chưa khai → `check` đỏ; clone nông → script thoát 1; image không có ngày → smoke test đỏ; sai đường dẫn ảnh → build đỏ · 2026-10-14
- [x] 001-T12 Kiểm hành vi trong bản clone tạm: chỉ sửa about → chỉ `/about` đổi; sửa README/docs/CI → không trang nào đổi; sửa `site.ts` → mọi trang đổi; merge `--no-ff` → ngày merge · 2026-10-14
- [x] 001-T13 HTML của cả 7 trang giống hệt `main` (che hash script/chunk): không đổi giao diện · 2026-10-14

## Tài liệu

- [x] 001-T20 Nhắc bước kiểm sitemap trong tài liệu đóng góp · `3c4f113`
- [x] 001-T21 Viết spec, plan, tasks này theo bản đã merge · 2026-10-14

## Phát hành

- [x] 001-T30 Merge PR #3 (`b8e2665`), Jenkins build #11 deploy; production có 6 URL, 6 `<lastmod>`, 25 mục ảnh · 2026-10-14
- [x] 001-T31 Chủ quán: Search Console → URL Inspection → `https://thehot.vn/terms` → Request indexing (trang mới vào sitemap; 5 URL kia đã gửi ngày 14/10) · không cần nữa: URL Inspection API ngày 2026-10-15 báo `/terms` "Submitted and indexed" (crawl 2026-10-14)
- [x] 001-T32 Chủ quán: Search Console → Sitemaps kiểm *Success* và 6 trang được khám phá · AC: 001-AC-09 · 2026-10-15 qua Search Console API (`sitemaps.get`): 6 URL trang, 37 ảnh, 0 lỗi, 0 cảnh báo

## Báo máy tìm kiếm sau deploy (mở rộng 2026-10-15)

[Spec, mục 13](spec.md#13-báo-máy-tìm-kiếm-sau-deploy) · [ADR 0009](../../adr/0009-notify-search-engines-after-deploy.md) (Đề xuất)

- [x] 001-T50 `src/seo/page-meta.ts` vào `shared` của `seo/sitemap-pages.json`: PR #17 (mô tả mới của `/menu`, `/menu/list`, merge `3e99c5e`) đã không đổi `lastmod` của hai trang đó · AC: 001-AC-04
- [x] 001-T51 `ci/notify-search.sh` (`snapshot`, `notify`, `status`) và stage `Sitemap snapshot`, `Notify search engines` trong `Jenkinsfile` · AC: 001-AC-10, 001-AC-11, 001-AC-12
- [x] 001-T52 Khoá IndexNow `public/<khoá>.txt` · AC: 001-AC-13
- [x] 001-T53 Kiểm trước PR: chạy thử `DRY_RUN=1` trên production, một lần `sitemaps.submit` thật (HTTP 204), IndexNow với endpoint giả, đoạn stage chạy trên Jenkins tạm cùng image (credential có, rỗng, không có; script lỗi và quá giờ), `npm run check`, smoke test · 2026-10-15 ([plan, mục 10](plan.md#10-phần-mở-rộng-2026-10-15-báo-máy-tìm-kiếm-sau-deploy))
- [ ] 001-T54 Repo hạ tầng: credential khoá service account trong Jenkins (PR #10 của repo hạ tầng), áp lên Jenkins **trước** khi merge PR #18 (thiếu thì stage chỉ vàng và bỏ qua Google)
- [ ] 001-T55 Sau lần deploy đầu: log stage Notify search engines có Google HTTP 2xx và IndexNow 200 hoặc 202 cho các trang đổi (lần đầu là cả 6 trang vì `page-meta.ts` vừa vào `shared`); Bing Webmaster Tools → IndexNow thấy URL
- [ ] 001-T56 Chủ repo: chấp nhận hoặc bác ADR 0009

## Việc tiếp theo: PR 2, đổi tên ảnh và ảnh độ phân giải cao

Chờ chủ quán gửi ảnh. Bây giờ là lúc tốt nhất để đổi tên: Google chưa index ảnh nào nên đổi tên không mất gì và không cần chuyển hướng.

- [ ] 001-T40 Chủ quán: gửi ảnh gốc rộng từ 1600 px trở lên, có cả ảnh ngang (16:9, 4:3) và vuông (1:1). Ảnh hiện có chỉ 720×1280, dọc.
- [ ] 001-T41 Dev: báo trước cho `kennle04` (PR này đụng nhiều file nội dung, dễ xung đột với nhánh `dev`).
- [ ] 001-T42 Dev: `git mv` sang tên mới, sửa tham chiếu `hotImage(...)` trong các `content.ts`, `menuPages.ts`, `videos.ts`; cập nhật `sources` trong `seo/sitemap-pages.json`. Ảnh mới thay nội dung file nhưng giữ tên mới.
- [ ] 001-T43 Dev: ảnh lớn đầu trang tải ưu tiên, không lazy-load.
- [ ] 001-T44 Dev: rà alt và `Restaurant.image` trong JSON-LD: làm cùng [002](../002-onpage-seo/tasks.md).

Tên đề xuất (đặt lại theo nội dung thật của ảnh mới):

| Hiện tại | Tên mới đề xuất |
|---|---|
| `space.jpg` | `san-khau-the-hot-beer-garden-da-lat.jpg` |
| `friends.jpg` | `hoi-ban-tai-the-hot-da-lat.jpg` |
| `kitchen.jpg` | `mon-nhau-the-hot-beer-garden.jpg` |
| `welcome.jpg` | `quay-bar-the-hot-da-lat.jpg` |
| `night.jpg` | `the-hot-da-lat-ve-dem.jpg` |
| `facebook-post-menu-2026-09/01-…` đến `10-…` | `menu/menu-the-hot-01-<mon-chinh>.jpg` … (theo alt từng trang menu) |

Ước lượng PR 2: 1,5–2 giờ sau khi có ảnh (ước lượng thô).

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Merge và deploy sitemap tự động | PR #3, `b8e2665`, Jenkins build #11 |
| 2026-10-14 | Bản đang chạy sau các PR khác | `90f1882`, Jenkins build #16 |
| 2026-10-15 | Search Console qua API: sitemap 6 URL trang, 37 ảnh, 0 lỗi; 5/6 trang "Submitted and indexed", `/reservation` "Discovered - currently not indexed" | `sitemaps.get`, URL Inspection API (`bash ci/notify-search.sh status`) |
| 2026-10-15 | Mở PR #18 báo máy tìm kiếm sau deploy (001-T50 đến T53) | PR #18 |
