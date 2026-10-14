# Kiểm thử

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Đặc tả sản phẩm](../product/spec.md), [Yêu cầu phi chức năng](../product/nfr.md), [Cấu hình](configuration.md), [Số đo hiệu năng](perf.md), [Triển khai](../ops/deployment.md)

Site không có unit test hay test trình duyệt tự động. Lớp bảo vệ là các bước kiểm tĩnh (lint, typecheck, guard sitemap), build, và **smoke test trên chính image sẽ được deploy**. Hiệu năng, SEO và giao diện được kiểm tay, có ghi lại. Tính tới 2026-10-14.

## 1. Chiến lược theo tầng

| Tầng | Ký hiệu | Kiểm gì | Công cụ | Chạy ở đâu | Khi nào |
|---|---|---|---|---|---|
| Tĩnh | S | Lỗi lint, kiểu TypeScript (strict), `seo/sitemap-pages.json` lệch với `src/app` | ESLint 9, `tsc --noEmit`, `seo/check-sitemap-pages.mjs` | Máy dev (`npm run check`); Jenkins stage Check (`docker build --target check`) | Trước khi mở PR; mỗi commit trên `main` |
| Build | B | Next.js build được bản production | `next build` trong stage `builder` của `Dockerfile` | Máy dev; Jenkins stage Build | Như trên |
| Smoke test image | E | Image khởi động và qua healthcheck; mọi trang trả đúng mã; `robots.txt` và `sitemap.xml` đúng; tracker Umami có hay không đúng theo Website ID | `ci/smoke-test.sh` | Jenkins stage Smoke test; máy dev có Docker | Mỗi commit trên `main`, trước khi push image |
| Kiểm tay | M | Điều chưa tự động: hiệu năng, dữ liệu cấu trúc, ảnh chia sẻ, giao diện trên điện thoại | Checklist mục 6 | `https://thehot.vn` sau deploy, hoặc bản build trên máy | Khi PR chạm phần đó |

## 2. Lệnh

Chạy từ gốc repo. Cần Node.js 24 trở lên (`.nvmrc`).

| Việc | Lệnh |
|---|---|
| Cài phụ thuộc | `npm ci` |
| Toàn bộ kiểm trên máy (lint, typecheck, guard sitemap, build) | `npm run check` |
| Từng bước | `npm run lint` · `npm run typecheck` · `npm run check:sitemap` · `npm run build` |
| Tính ngày sitemap như CI | `bash ci/sitemap-lastmod.sh` (cần `git`, `jq`, lịch sử git đầy đủ) |
| Chạy lại đúng các bước Jenkins bằng Docker | xem khối lệnh dưới bảng |
| Kiểm link tài liệu | `python3 scripts/check-links.py .` |

```bash
# Giống Jenkins: Sitemap dates → Check → Build → Smoke test
bash ci/sitemap-lastmod.sh
docker build --target check .
docker build --target runner --build-arg NEXT_PUBLIC_SITE_URL=https://thehot.vn -t nokto:local .
ci/smoke-test.sh nokto:local
```

## 3. Smoke test kiểm gì

`ci/smoke-test.sh <image> [site-url] [umami-website-id]` (mặc định `https://thehot.vn`, không có Website ID) chạy image trong một container tạm, rồi gọi từ bên trong container (image slim không có `curl`):

1. Đợi Docker `HEALTHCHECK` báo `healthy` (tối đa 30 lần × 2 s); không khoẻ thì in 50 dòng log cuối và dừng.
2. `/`, `/menu`, `/menu/list`, `/about`, `/reservation`, `/terms`, `/privacy`, `/sitemap.xml` trả 200; `/smoke-test-missing-page` trả 404.
3. `robots.txt` chứa `<site-url>/sitemap.xml` (bắt lỗi quên build arg `NEXT_PUBLIC_SITE_URL`).
4. `sitemap.xml` có ít nhất một `<url>` và số `<lastmod>` bằng số `<url>` (bắt lỗi build thiếu file ngày).
5. Mọi `<loc>` và `<image:loc>` là URL tuyệt đối trên đúng origin của site, trả 200 khi gọi không theo chuyển hướng; ảnh có `content-type` bắt đầu bằng `image/`.
6. Tracker Umami ([spec 004](../specs/004-analytics/spec.md)), trên mọi trang HTML ở bước 2 kể cả trang 404: có Website ID thì HTML phải có tracker với đúng ID, `data-domains="thehot.vn"`, `data-exclude-hash="true"`, không `data-exclude-search`, kèm `<link rel="preload" as="script">` tới URL tracker; không có ID thì không trang nào có tracker. `next/script` (`afterInteractive`) chỉ chèn thẻ `<script>` trên trình duyệt sau khi hydrate, nên bước này đọc thuộc tính của nó trong payload React của HTML. Jenkins truyền cùng `UMAMI_WEBSITE_ID` cho build và cho bước này.

Container tạm luôn bị xoá khi script kết thúc.

## 4. Tiêu chí nghiệm thu và cách kiểm

| Tiêu chí | Loại | Kiểm bằng | Ghi chú |
|---|---|---|---|
| AC-01 (trang trả đúng mã) | E | `ci/smoke-test.sh`, bước 2 | Thêm route mới thì thêm vào danh sách trong script |
| AC-02 (sitemap đúng, đủ ngày, URL sống) | S, E | `check-sitemap-pages.mjs`; smoke test bước 4–5 | |
| AC-03 (index được) | M | `curl -sI https://thehot.vn/` không có `X-Robots-Tag`; xem nguồn: `<meta name="robots" content="index, follow">`, canonical | Header do nginx quyết định (repo infra) |
| AC-04 (thông tin quán nhất quán) | M | Rich Results Test; so footer, `/terms`, Google Business Profile | Bất biến I-01, I-02 ở [mô hình dữ liệu](../architecture/data-model.md) |
| AC-05 (nút liên hệ trên mọi trang) | M | Điện thoại thật, từng trang | |
| AC-06 (form không gửi dữ liệu) | M | DevTools → Network khi bấm "Liên hệ chốt bàn": không có request mới chứa dữ liệu form | |
| AC-07 (ngân sách hiệu năng) | M | PageSpeed Mobile, ghi vào [perf.md](perf.md) | |

## 5. Cổng chất lượng

Jenkins chỉ build nhánh `main` (sau merge); PR không được build tự động. Vì vậy `npm run check` trên máy người làm là cổng trước merge, và các stage Jenkins là cổng trước deploy.

| Cổng | Chặn deploy khi | Lệnh |
|---|---|---|
| Sitemap dates | Shallow clone, đường dẫn trong cấu hình chưa có commit, thiếu `git`/`jq` | `bash ci/sitemap-lastmod.sh` |
| Check | Lỗi lint, kiểu, guard sitemap | `docker build --target check .` |
| Build | Next.js build lỗi | `docker build --target runner …` |
| Smoke test | Mục 3 | `ci/smoke-test.sh` |
| Link tài liệu | Chưa có trong CI (`.dockerignore` loại `docs/`); chạy tay | lệnh ở mục 2 |
| Ngân sách hiệu năng, quét secret | Chưa có cổng tự động | — |

## 6. Kiểm tay (M)

Sau deploy một PR chạm phần tương ứng:

- [ ] Trang đã sửa hiện đúng trên `https://thehot.vn` ở điện thoại và máy tính.
- [ ] Đổi trang hoặc nội dung: `curl -s https://thehot.vn/sitemap.xml` có trang và ngày đúng.
- [ ] Đổi tiêu đề, mô tả, ảnh chia sẻ: xem nguồn trang; Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) → Scrape Again.
- [ ] Đổi JSON-LD hoặc thông tin quán: https://search.google.com/test/rich-results.
- [ ] Đổi phần ảnh hưởng tải trang: PageSpeed Mobile 3 lần, ghi trung vị vào [perf.md](perf.md).
- [ ] Đổi video hero: DevTools → Network (lọc `videos`, tắt cache) tải `/`: request `main.v2.*` chỉ có sau sự kiện `load` và sau màn hình chờ; bật *Emulate prefers-reduced-motion* thì không có request video ([003-AC-04, 003-AC-05](../specs/003-performance/spec.md#8-tiêu-chí-nghiệm-thu)).
- [ ] Đổi trang mới hoặc URL: Search Console → URL Inspection → Request indexing.

## 7. Nợ test

| Phần | Vì sao chưa có | Kế hoạch |
|---|---|---|
| Logic trạng thái sự kiện (`getEventStatus`, `filterEvents`) | Chưa có bộ chạy unit test trong repo | Thêm khi sự kiện có lịch thật và logic phức tạp hơn `[CẦN XÁC NHẬN: chọn công cụ test]` |
| Luồng trên trình duyệt (form đặt bàn, menu lật, nút liên hệ) | Chưa có test trình duyệt | Kiểm tay (mục 6) |
| Ngân sách hiệu năng tự động | PageSpeed API giới hạn lượt; máy dev chưa chạy được Lighthouse | Spec hiệu năng `003-performance` |
| Quét secret | Chưa cài công cụ | `[CẦN XÁC NHẬN: chọn công cụ quét secret cho repo công khai]` |
