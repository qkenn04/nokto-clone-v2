# Cấu hình

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Triển khai](../ops/deployment.md), [Kiểm thử](testing.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Mô hình đe doạ](../security/threat-model.md), [Tài liệu](../README.md)

Ứng dụng gần như không có cấu hình lúc chạy: nội dung nằm trong code, không có cơ sở dữ liệu, không có bí mật. Cấu hình quan trọng nhất là **build arg** `NEXT_PUBLIC_SITE_URL` và file ngày sitemap do CI sinh; hai build arg của Umami bật hoặc tắt thống kê truy cập. Tính tới 2026-10-15.

## 1. Nguyên tắc

1. Biến `NEXT_PUBLIC_*` được Next.js **đóng vào bản build** và gửi xuống trình duyệt: đổi giá trị phải build lại image, và **không bao giờ** dùng chúng cho bí mật.
2. Giá trị cho production chỉ đặt ở `Jenkinsfile`. Không có biến thì build vẫn chạy với giá trị cho máy dev, nên dev, smoke test và image build thử không bao giờ trỏ nhầm vào số liệu hay URL thật.
3. Ứng dụng không cần bí mật lúc chạy. Bí mật của đường giao hàng (đăng nhập registry, khoá deploy, webhook thông báo) nằm trong Jenkins Credentials; tên, nơi giữ và cách xoay vòng ghi ở repo riêng `qkenn04/infra-qkenn`, không ghi ở đây.
4. Repo không có `.env.example` vì ứng dụng không đọc biến bí mật nào; biến dưới đây là toàn bộ danh sách.

## 2. Biến và đầu vào build

### 2.1 Lúc build (image `runner`)

| Biến | Bắt buộc | Mặc định | Ví dụ (vô hại) | Bí mật | Dùng ở | Ghi chú |
|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | có cho production | `http://localhost:3000` | `https://thehot.vn` | không | `src/app/layout.tsx` (`metadataBase`, URL trong JSON-LD), `src/app/robots.ts`, `src/app/sitemap.ts` | Truyền bằng `--build-arg` (Jenkins đặt `SITE_URL = 'https://thehot.vn'`). Không có dấu `/` ở cuối: `sitemap.ts` tự bỏ, còn `layout.tsx` và `robots.ts` thì không |
| `src/generated/sitemap-lastmod.json` (file, không phải biến) | có cho production | không có file | `{ "/": "2026-10-14T09:39:54+07:00" }` | không | `src/app/sitemap.ts` | Sinh bằng `bash ci/sitemap-lastmod.sh` trước `docker build` (cần `git`, `jq`, lịch sử git đầy đủ). Thiếu file: sitemap không có `<lastmod>` và smoke test báo lỗi ([ADR 0004](../adr/0004-automate-sitemap-from-page-config-and-git.md)) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | không (có khi muốn đếm lượt truy cập) | trống: không tải tracker Umami, `/privacy` không có mục "Thống kê lượt truy cập" | `00000000-0000-0000-0000-000000000000` | không (nằm trong HTML) | `src/lib/analytics.ts` (`UMAMI_WEBSITE_ID`), `src/components/analytics/UmamiScript.tsx`, `src/components/sites/nokto/legal/content.ts` | Website ID trong Umami ([ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md), [spec 004](../specs/004-analytics/spec.md)). Jenkins đặt `UMAMI_WEBSITE_ID` (đang để trống tới khi có Website ID) và truyền bằng `--build-arg`; smoke test nhận cùng giá trị để kiểm |
| `NEXT_PUBLIC_UMAMI_SRC` | không | URL tracker trên tên miền con analytics của `thehot.vn` (mặc định trong `UmamiScript.tsx`) | `https://stats.thehot.vn/ht.js` | không (nằm trong HTML) | `src/components/analytics/UmamiScript.tsx` | Chỉ có tác dụng khi có Website ID. Jenkins đặt `UMAMI_SRC` |
| `NEXT_TELEMETRY_DISABLED` | không | `1` trong `Dockerfile` | `1` | không | Next.js CLI | Tắt telemetry ẩn danh của Next.js |

### 2.2 Lúc chạy (container)

| Biến | Bắt buộc | Mặc định | Ví dụ (vô hại) | Bí mật | Dùng ở | Ghi chú |
|---|---|---|---|---|---|---|
| `NODE_ENV` | có | `production` trong image | `production` | không | Next.js | |
| `PORT` | không | `3000` trong image | `3000` | không | `server.js` (standalone) | Cổng bên trong container; cổng phía máy chủ do cấu hình ở `qkenn04/infra-qkenn` quyết định |
| `HOSTNAME` | không | `0.0.0.0` trong image | `0.0.0.0` | không | `server.js` | Nghe mọi interface bên trong container; container chỉ được nối ra máy chủ qua cấu hình compose riêng |

### 2.3 Chạy bằng `docker-compose.yml` trên máy dev

| Biến | Mặc định | Nghĩa |
|---|---|---|
| `PORT` | `3000` | Cổng trên máy dev cho dịch vụ `app` (image `runner`) |
| `DEV_PORT` | `3001` | Cổng trên máy dev cho dịch vụ `dev` (`next dev` có hot reload) |

`docker-compose.yml` đọc thêm `.env.local` và `.env` nếu có (cả hai bị git-ignore). File compose này chỉ dùng trên máy dev; production chạy bằng compose stack ở `qkenn04/infra-qkenn`.

### 2.4 Dự kiến (chưa có trong code)

Theo [ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md), khi triển khai GA4 (spec 004, PR B):

| Biến | Nghĩa | Ghi chú |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Measurement ID của GA4 (`G-…`) | Không có thì không có banner đồng ý và không tải GA4 |

Giá trị này công khai (nằm trong URL `gtag.js`), không phải bí mật. Khi thêm, cập nhật bảng 2.1, `Dockerfile` (`ARG`/`ENV` ở stage `builder`), `Jenkinsfile` và [Triển khai](../ops/deployment.md) trong cùng PR, như hai biến Umami.

## 3. Kiểm cấu hình

Ứng dụng không tự kiểm biến lúc khởi động. Lỗi cấu hình được bắt ở CI:

- Thiếu `NEXT_PUBLIC_SITE_URL` lúc build: `robots.txt` trỏ sitemap về `http://localhost:3000`; `ci/smoke-test.sh` kiểm `robots.txt` chứa `<SITE_URL>/sitemap.xml` nên build dừng trước khi push.
- Thiếu `src/generated/sitemap-lastmod.json`: `sitemap.ts` in cảnh báo và bỏ `<lastmod>`; smoke test kiểm mỗi `<url>` có `<lastmod>` nên build dừng.
- Website ID của Umami không khớp: Jenkins truyền cùng `UMAMI_WEBSITE_ID` cho build và cho smoke test. Có ID mà trang thiếu tracker (hoặc sai ID), hay không có ID mà trang vẫn có tracker, thì smoke test báo lỗi và build dừng.
- `ci/sitemap-lastmod.sh` tự dừng khi repo là shallow clone, khi một đường dẫn trong `seo/sitemap-pages.json` chưa có commit nào, hoặc khi thiếu `git`/`jq`.

## 4. Khác nhau theo môi trường

| Mục | dev | CI (smoke test) | prod |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | không đặt (`http://localhost:3000`) | `https://thehot.vn` | `https://thehot.vn` (cùng image đã qua smoke test) |
| `sitemap-lastmod.json` | chỉ khi tự chạy `bash ci/sitemap-lastmod.sh` | luôn có | luôn có |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | không đặt (không tracker) | như `Jenkinsfile` | như `Jenkinsfile`; tracker chỉ đếm trên `thehot.vn` (`data-domains`) |
| Lệnh chạy | `npm run dev` | `docker run` image `runner` | container do script deploy chạy |

## 5. Bí mật: nơi giữ, xoay vòng, thu hồi

Ứng dụng: không có bí mật.

Đường giao hàng (Jenkins): có bốn loại bí mật — thông tin đăng nhập để push image lên registry, khoá SSH deploy (chỉ chạy được lệnh deploy), file host key đã ghim của VPS, URL webhook Discord. Tất cả giữ trong Jenkins Credentials và chỉ được bind trong stage cần dùng (`withCredentials` trong `Jenkinsfile`). Danh mục, chủ sở hữu và cách xoay vòng: `qkenn04/infra-qkenn`. Lộ một trong số đó: xoay ngay theo tài liệu của repo infra, rồi ghi vào [mô hình đe doạ](../security/threat-model.md) nếu cần thêm lớp bảo vệ.

## 6. Cấu hình trong code

| Cấu hình | Ở đâu | Nghĩa |
|---|---|---|
| `output: "standalone"` | `next.config.ts` | Build bản chạy độc lập cho image |
| `images.qualities: [55, 75, 90]` | `next.config.ts` | Mức chất lượng ảnh được phép (ảnh nền 55, ảnh 75, ảnh nhỏ 90) |
| Chuyển hướng `/the-hot/menu` → `/menu` (308) | `next.config.ts` | Giữ link cũ của menu sách lật |
| `allowedDevOrigins: ["192.168.*.*"]` | `next.config.ts` | Cho điện thoại trong mạng LAN mở bản `next dev` |
| `devIndicators: false` | `next.config.ts` | Ẩn huy hiệu dev khi chụp so sánh |
| Cờ `illustrative` của sự kiện | `src/components/sites/the-hot/home/content.ts` | Đánh dấu chương trình minh hoạ ([mô hình dữ liệu](../architecture/data-model.md)) |

Không có cờ tính năng (feature flag) lúc chạy.
