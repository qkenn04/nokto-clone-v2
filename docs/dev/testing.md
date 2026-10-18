# Kiểm thử

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-18 · Liên quan: [Đặc tả sản phẩm](../product/spec.md), [Yêu cầu phi chức năng](../product/nfr.md), [Cấu hình](configuration.md), [Số đo hiệu năng](perf.md), [Triển khai](../ops/deployment.md)

Site không có unit test hay test trình duyệt tự động. Lớp bảo vệ là các bước kiểm tĩnh (lint, typecheck, guard sitemap), build, và **smoke test trên chính image sẽ được deploy**. Hiệu năng, SEO và giao diện được kiểm tay, có ghi lại. Tính tới 2026-10-14.

## 1. Chiến lược theo tầng

| Tầng | Ký hiệu | Kiểm gì | Công cụ | Chạy ở đâu | Khi nào |
|---|---|---|---|---|---|
| Tĩnh | S | Lỗi lint (kể cả `<img>`, `<Image>` thiếu thuộc tính `alt`: luật `jsx-a11y/alt-text` ở mức error), kiểu TypeScript (strict), `seo/sitemap-pages.json` lệch với `src/app` | ESLint 9, `tsc --noEmit`, `seo/check-sitemap-pages.mjs` | Máy dev (`npm run check`); Jenkins stage Check (`docker build --target check`) | Trước khi mở PR; mỗi commit trên `main` |
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
| Chạy thử báo máy tìm kiếm, không gửi gì | xem mục 3.1 |
| Rich Results Test cho production, đọc kết quả thành JSON (máy dev có Chrome) | xem mục 3.2 |

```bash
# Giống Jenkins: Sitemap dates → Check → Build → Smoke test
bash ci/sitemap-lastmod.sh
docker build --target check .
docker build --target runner --build-arg NEXT_PUBLIC_SITE_URL=https://thehot.vn -t thehot:local .
ci/smoke-test.sh thehot:local
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

### 3.1 Báo máy tìm kiếm: chạy thử

`ci/notify-search.sh` (stage Sitemap snapshot và Notify search engines, [ADR 0009](../adr/0009-notify-search-engines-after-deploy.md)) không có test tự động; kiểm bằng chế độ chạy thử với production. `DRY_RUN=1` chỉ đọc: tải sitemap đang chạy và file khoá IndexNow, có khoá Google thì xin token và đọc trạng thái sitemap trong Search Console, nhưng không gửi lại sitemap và không gửi IndexNow.

```bash
# Bản chụp sitemap production, như stage Sitemap snapshot
bash ci/notify-search.sh snapshot > /tmp/before.json

# Giả như /menu vừa đổi ngày; EXPECTED_LASTMOD= bỏ bước đợi sitemap khớp build của máy mình
SITEMAP_BEFORE="$(jq -c '.["https://thehot.vn/menu"] = "cũ"' /tmp/before.json)" \
  EXPECTED_LASTMOD= DRY_RUN=1 bash ci/notify-search.sh notify

# Có khoá service account (file JSON, chỉ trên máy được giao giữ khoá): thêm GSC_KEY_FILE=<đường dẫn tới file khoá>
# Trạng thái index trên Google của từng trang trong sitemap (chỉ đọc, URL Inspection API)
GSC_KEY_FILE=<đường dẫn tới file khoá> bash ci/notify-search.sh status
```

Kết quả mong đợi: dòng `changed pages` liệt kê đúng trang đổi; dòng `IndexNow (dry run): would POST …` có `urlList` chỉ gồm các trang đó; trước lần deploy đầu tiên của file khoá, script báo file khoá chưa có trên production và thoát mã 1. Mã thoát 1 trong Jenkins chỉ làm stage vàng.

### 3.2 Rich Results Test: script đọc kết quả

Rich Results Test không có API. `scripts/rich-results/check.mjs` ([ADR 0010](../adr/0010-check-rich-results-with-signed-in-chrome.md)) mở trang test bằng Chrome đã đăng nhập Google, chờ kết quả rồi in JSON, để người hoặc agent đọc mà không phải chép tay từ giao diện. Chỉ chạy trên máy dev: không có trong CI, không vào image (`.dockerignore` loại `scripts/`); phụ thuộc `playwright-core` nằm trong `scripts/rich-results/package.json`, không nằm trong `package.json` gốc.

Cần: Node.js 24, Google Chrome đã cài (script điều khiển Chrome của máy, không tải trình duyệt riêng), màn hình (Google từ chối Chrome chạy không cửa sổ), một tài khoản Google. Biến môi trường: [Cấu hình, mục 2.6](configuration.md#26-script-kiểm-rich-results-test-scriptsrich-resultscheckmjs-chạy-trên-máy-dev).

```bash
# Một lần: cài phụ thuộc, đăng nhập Google trong profile riêng của script (đóng cửa sổ Chrome khi xong)
npm --prefix scripts/rich-results ci
node scripts/rich-results/check.mjs --login

# Kiểm trang chủ production (mặc định https://thehot.vn/); nhiều trang thì liệt kê URL
node scripts/rich-results/check.mjs
node scripts/rich-results/check.mjs https://thehot.vn/ https://thehot.vn/menu

# Đọc một kết quả có sẵn: <ID> là phần sau id= trong link Share; không cần đăng nhập
node scripts/rich-results/check.mjs --id <ID>
```

Script đọc kết quả theo hai cách, cách sau là dự phòng:

1. **Dữ liệu trong trang kết quả** (mặc định, khoảng 1 giây): tải HTML của `https://search.google.com/test/rich-results/result?id=<ID>` không kèm cookie, đọc các khối `AF_initDataCallback`: `ds:0` (URL, giờ crawl), `ds:3` (mã HTTP), `ds:4` (mục và cảnh báo), `ds:5` (tài nguyên). Định dạng này Google không công bố; script so số lỗi và cảnh báo đọc được với số Google ghi kèm từng mục, lệch thì coi như định dạng đã đổi.
2. **Giao diện** (7–33 giây): mở từng nhóm, bấm từng mục, đọc các dòng `Missing field "…"`; dòng có `(optional)` là cảnh báo. Không có giờ crawl, mã HTTP, tài nguyên bị chặn; mỗi dòng có `message`, `rule` để trống; JSON có `fallbackReason` ghi vì sao phải dùng cách này. ID sai hoặc hết hạn thì báo lỗi luôn, không thử giao diện.

`--source data` hoặc `--source ui` ép dùng một cách. Đầu ra lần chạy 2026-10-18 (rút gọn):

```json
[{ "url": "https://thehot.vn/", "ok": true, "source": "data",
   "resultUrl": "https://search.google.com/test/rich-results/result?id=XIwZXeIi-jNzUOIFGNNlhg",
   "crawledAt": "2026-10-18T23:26:44+07:00", "httpStatus": 200,
   "summary": { "items": 5, "valid": 5, "invalid": 0 },
   "groups": [
     { "type": "Events", "items": [{ "name": "Hot Saturday", "valid": true, "issues": [
         { "field": "performer", "rule": "MISSING_RECOMMENDED_FIELD", "severity": "non-critical" },
         { "field": "offers", "rule": "MISSING_RECOMMENDED_FIELD", "severity": "non-critical" }] }] },
     { "type": "Organization", "items": [{ "name": "The Hot Beer Garden", "valid": true, "issues": [
         { "field": "address.postalCode", "rule": "MISSING_RECOMMENDED_FIELD", "severity": "non-critical" }] }] }],
   "blockedResources": [{ "url": "https://stats.thehot.vn/ht.js", "reason": "robots.txt" }],
   "seconds": 11 }]
```

| Mã thoát | Nghĩa |
|---|---|
| 0 | Không mục nào có lỗi nghiêm trọng (cảnh báo không tính) |
| 1 | Có mục lỗi nghiêm trọng: `valid: false`, Google không hiện rich result cho mục đó |
| 2 | Không có kết quả: Google từ chối (chưa đăng nhập), quá 180 giây, định dạng đổi ở cả hai cách đọc, sai tham số |

`severity`: `critical` là mã 2 của Google (ví dụ Event thiếu `startDate`, luật `MISSING_FIELD_WITHOUT_TYPE`); `non-critical` là mã 1 (thiếu trường nên có, `MISSING_RECOMMENDED_FIELD`). Mã khác coi là `critical`, kèm `severityCode`.

Đã kiểm ngày 2026-10-18:

| Trường hợp | Kết quả |
|---|---|
| Production `https://thehot.vn/`, 6 lần (1 lần ép `--source ui`) | Mã 0, 5/5 mục hợp lệ, 10–13 giây (đọc giao diện: 17 giây); 1 lần quá 180 giây (mã 2), chạy lại thì được |
| Mẫu Event thiếu `startDate` (tab CODE của Rich Results Test) | Mã 1: 1 lỗi `startDate` critical, 7 cảnh báo; `data`, `ui`, `auto` cho cùng kết quả |
| Cùng một ID, đọc bằng giao diện so với dữ liệu | Khớp từng mục, từng trường |
| Profile chưa đăng nhập | Mã 2, `Rich Results Test refused: … Log in and try again` |
| ID sai | Mã 2, `no result for id …`, không thử giao diện |

Chưa thử thật: dữ liệu đọc lỗi mà giao diện đọc được (đường dự phòng mới chạy trong trường hợp cả hai cùng lỗi); `--login` khi người dùng tự đóng cửa sổ (mới thử Chrome bị tắt).

## 4. Tiêu chí nghiệm thu và cách kiểm

| Tiêu chí | Loại | Kiểm bằng | Ghi chú |
|---|---|---|---|
| AC-01 (trang trả đúng mã) | E | `ci/smoke-test.sh`, bước 2 | Thêm route mới thì thêm vào danh sách trong script |
| AC-02 (sitemap đúng, đủ ngày, URL sống) | S, E | `check-sitemap-pages.mjs`; smoke test bước 4–5 | |
| AC-03 (index được) | M | `curl -sI https://thehot.vn/` không có `X-Robots-Tag`; xem nguồn: `<meta name="robots" content="index, follow">`, canonical | Header do nginx quyết định (repo infra) |
| AC-04 (thông tin quán nhất quán) | M | Rich Results Test (`scripts/rich-results/check.mjs`, mục 3.2); so footer, `/terms`, Google Business Profile | Bất biến I-01, I-02 ở [mô hình dữ liệu](../architecture/data-model.md) |
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
| Notify search engines | Không bao giờ chặn: lỗi chỉ làm stage vàng sau khi đã deploy | `DRY_RUN=1 bash ci/notify-search.sh notify` (mục 3.1) |
| Link tài liệu | Chưa có trong CI (`.dockerignore` loại `docs/`); chạy tay | lệnh ở mục 2 |
| Ngân sách hiệu năng, quét secret | Chưa có cổng tự động | — |

## 6. Kiểm tay (M)

Sau deploy một PR chạm phần tương ứng:

- [ ] Trang đã sửa hiện đúng trên `https://thehot.vn` ở điện thoại và máy tính.
- [ ] Đổi trang hoặc nội dung: `curl -s https://thehot.vn/sitemap.xml` có trang và ngày đúng.
- [ ] Đổi tiêu đề, mô tả, ảnh chia sẻ: xem nguồn trang; Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) → Scrape Again.
- [ ] Đổi JSON-LD hoặc thông tin quán: `node scripts/rich-results/check.mjs` thoát mã 0 ([mục 3.2](#32-rich-results-test-script-đọc-kết-quả)), đọc các cảnh báo trong `issues`; không chạy được script thì mở https://search.google.com/test/rich-results.
- [ ] Thêm hoặc đổi ảnh: alt tả đúng thứ có trong ảnh, ảnh trang trí `alt=""` ([002-AC-07](../specs/002-onpage-seo/spec.md#8-tiêu-chí-nghiệm-thu)). Lint chỉ bắt thẻ thiếu hẳn `alt`, không bắt alt rỗng hay alt sai lấy từ dữ liệu. Trên từng trang, DevTools → Console: `[...document.images].filter((img) => !img.hasAttribute("alt"))` trả mảng rỗng; `[...document.images].filter((img) => img.getAttribute("alt") === "")` chỉ còn ảnh trang trí. Console đọc trang sau khi JavaScript chạy, nên ảnh của màn hình chờ đã bị gỡ không còn trong danh sách.
- [ ] Đổi phần ảnh hưởng tải trang: PageSpeed Mobile 3 lần, ghi trung vị vào [perf.md](perf.md).
- [ ] Đổi video hero: DevTools → Network (lọc `videos`, tắt cache) tải `/`: request `main.v2.*` chỉ có sau sự kiện `load` và sau màn hình chờ; bật *Emulate prefers-reduced-motion* thì không có request video ([003-AC-04, 003-AC-05](../specs/003-performance/spec.md#8-tiêu-chí-nghiệm-thu)).
- [ ] Đổi trang hoặc nội dung: log stage Notify search engines trong Jenkins có `Google: sitemap … re-submitted` và `IndexNow: … submitted` (hoặc `received`) cho đúng các trang đổi. Stage vàng thì đọc dòng `WARNING`.
- [ ] Trang hoàn toàn mới cần lên Google nhanh, hoặc bản sửa gấp: Search Console → URL Inspection → Request indexing (việc tay, ngoài phần tự động).

## 7. Nợ test

| Phần | Vì sao chưa có | Kế hoạch |
|---|---|---|
| Logic trạng thái sự kiện (`getEventStatus`, `filterEvents`) | Chưa có bộ chạy unit test trong repo | Thêm khi sự kiện có lịch thật và logic phức tạp hơn `[CẦN XÁC NHẬN: chọn công cụ test]` |
| Luồng trên trình duyệt (form đặt bàn, menu lật, nút liên hệ) | Chưa có test trình duyệt | Kiểm tay (mục 6) |
| Ngân sách hiệu năng tự động | PageSpeed API giới hạn lượt; máy dev chưa chạy được Lighthouse | Spec hiệu năng `003-performance` |
| Rich Results Test trong CI | Cần phiên đăng nhập Google và Chrome có cửa sổ; Google từ chối Chrome không cửa sổ | Chạy trên máy dev (mục 3.2) |
| Quét secret | Chưa cài công cụ | `[CẦN XÁC NHẬN: chọn công cụ quét secret cho repo công khai]` |
