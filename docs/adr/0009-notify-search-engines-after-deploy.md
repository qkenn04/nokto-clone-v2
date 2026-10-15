# ADR 0009: Báo máy tìm kiếm sau mỗi deploy: gửi lại sitemap cho Google, gửi URL đã đổi qua IndexNow, không dùng Indexing API

> Trạng thái: Đề xuất · Cập nhật: 2026-10-15 · Liên quan: [ADR 0004](0004-automate-sitemap-from-page-config-and-git.md), [Spec 001](../specs/001-sitemap-automation/spec.md), [Triển khai](../ops/deployment.md), [Cấu hình](../dev/configuration.md), [Mô hình đe doạ](../security/threat-model.md)

## Trạng thái

Đề xuất.

## Ngày

- Đề xuất: 2026-10-15
- Người quyết định: chủ repo (`qkenn04`)

## Bối cảnh

- Từ [ADR 0004](0004-automate-sitemap-from-page-config-and-git.md), mỗi trang trong `/sitemap.xml` có `<lastmod>` lấy từ git. Google tự đọc lại sitemap theo lịch riêng; endpoint "ping" sitemap của Google đã bị bỏ từ 2023, Bing cũng bỏ ping và khuyên dùng IndexNow.
- Quy trình trước ADR này ([Triển khai, mục 6.3](../ops/deployment.md#63-kiểm-sau-deploy)): sau mỗi PR đổi trang, chủ quán vào Search Console → URL Inspection → Request indexing bằng tay. Bước này dễ quên, chỉ báo cho Google, và Search Console giới hạn số lần mỗi ngày.
- Bing Webmaster Tools đã import property từ Search Console (2026-10-14). Bing, Yandex, Seznam, Naver và các máy khác nhận **IndexNow**: một request POST liệt kê URL đã đổi; khoá xác minh là một file văn bản công khai trên chính site. Google không dùng IndexNow.
- **Google Indexing API** chỉ dành cho trang có `JobPosting` hoặc `BroadcastEvent` (video phát trực tiếp). Site không có loại trang này; dùng cho trang thường là trái chính sách của Google.
- **Search Console API** có `sitemaps.submit`, tương đương nút Submit trong mục Sitemaps. Cần một tài khoản là user "Full" của property. Service account của Google Cloud dùng được mà không cần quyền Google Cloud nào: chỉ bật Search Console API và thêm service account làm user của property.
- Pipeline deploy tự động, không có bước duyệt tay; chỉ chạy trên `main` ([Triển khai](../ops/deployment.md)).
- Thử ngày 2026-10-15 với service account: `sitemaps.submit` trả HTTP 204, Search Console cập nhật "last submitted" và Google tải lại sitemap khoảng 2 giây sau đó. Sitemap báo 6 URL trang, 37 ảnh, 0 lỗi, 0 cảnh báo.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ nguyên: Request indexing bằng tay | Không thêm gì | Dễ quên, chậm, chỉ có Google, bị giới hạn mỗi ngày | Loại |
| 2 | Google Indexing API cho từng trang đổi | Báo từng URL, nhanh | Chỉ cho `JobPosting`, `BroadcastEvent`; dùng cho trang thường là trái chính sách, có thể bị bỏ qua hoặc mất quyền | Loại |
| 3 | Gửi lại sitemap qua Search Console API (`sitemaps.submit`) sau deploy, khi có trang đổi | Google hỗ trợ chính thức; Google đọc ngay `<lastmod>` đã đúng theo ADR 0004; service account không cần quyền Google Cloud | Không báo từng URL, Google vẫn tự quyết khi nào crawl; thêm một khoá bí mật trên máy CI | Chọn (cho Google) |
| 4 | IndexNow cho các URL có `<lastmod>` đổi | Một request cho nhiều máy tìm kiếm; không tài khoản, khoá công khai nên không có bí mật | Google không dùng; gửi lại URL không đổi nhiều lần có thể bị coi là spam (HTTP 429) | Chọn (cho các máy còn lại) |
| 5 | Ping sitemap kiểu cũ | Không cần khoá | Google và Bing đều đã bỏ | Loại |

## Quyết định

Jenkins báo máy tìm kiếm sau mỗi deploy bằng `ci/notify-search.sh`, chạy ở hai stage mới trong `Jenkinsfile`:

1. **`Sitemap snapshot`**, ngay trước `Deploy`: đọc `https://thehot.vn/sitemap.xml` đang chạy, giữ cặp URL trang → `<lastmod>`.
2. **`Notify search engines`**, sau `Deploy`:
   1. Đợi sitemap trên production khớp đúng ngày của build vừa deploy (`src/generated/sitemap-lastmod.json`), thử tối đa 6 lần cách nhau 10 giây; không khớp thì không gửi gì.
   2. Trang đổi = URL trang (không tính ảnh) mới xuất hiện hoặc có `<lastmod>` khác bản chụp ở bước 1. Không có trang đổi thì không gửi gì. Không có bản chụp thì coi mọi trang là đã đổi.
   3. Google: `sitemaps.submit` cho `https://thehot.vn/sitemap.xml` trên property `sc-domain:thehot.vn`, xác thực bằng service account (JWT RS256, scope `https://www.googleapis.com/auth/webmasters`).
   4. IndexNow: POST `https://api.indexnow.org/indexnow` với `host`, `key`, `keyLocation`, `urlList` là các URL đổi. Khoá là tên file `public/<32 ký tự hex>.txt`, nội dung file đúng bằng khoá.
3. Stage báo không bao giờ làm hỏng deploy: bọc `catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE')`. Thiếu khoá, API lỗi hay quá 5 phút chỉ làm stage vàng; build vẫn xanh và tin Discord ghi "chưa báo được công cụ tìm kiếm".
4. Request indexing bằng tay chỉ còn dùng cho trang hoàn toàn mới cần lên nhanh hoặc bản sửa gấp.

Quy tắc rút ra:

1. Không gọi Google Indexing API.
2. Không gửi IndexNow cho URL có `<lastmod>` không đổi.
3. Khoá service account chỉ nằm trong Jenkins Credentials, không bao giờ vào repo; service account không có quyền Google Cloud nào, chỉ là user của property Search Console. Cách tạo, xoay vòng, thu hồi: repo `qkenn04/infra-qkenn`.
4. Khoá IndexNow là thông tin công khai; đổi khoá bằng cách đổi tên file trong `public/` (và nội dung theo tên mới).

## Hệ quả

### Tốt

- Không còn bước Request indexing tay sau mỗi PR; Bing và các máy dùng IndexNow biết ngay URL đổi.
- Google đọc lại sitemap ngay sau deploy, nên `<lastmod>` đúng theo trang (ADR 0004) được dùng sớm hơn.
- Script chỉ đọc sitemap đang chạy, không cần quyền gì trên VPS.

### Xấu (cái giá chấp nhận trả)

- Thêm một bí mật trên máy CI. Lộ khoá thì người khác gửi hoặc xoá được sitemap và đọc được số liệu Search Console của `thehot.vn` (không sửa được site, không có quyền Google Cloud). Phải xoay vòng khoá hằng năm.
- `<lastmod>` vẫn ước lượng dư: `src/seo/page-meta.ts` nằm trong `shared`, nên sửa tiêu đề hay mô tả của một trang làm đổi ngày của mọi trang; `videos.ts` là nguồn của bốn trang. IndexNow sẽ nhận thêm vài URL mà nội dung nhìn thấy không đổi.
- Gửi sitemap không buộc Google crawl ngay.
- Deploy có thêm tối đa khoảng 1 phút chờ sitemap khớp (chỉ khi sitemap chưa khớp) và vài giây gọi API (ước lượng thô).

### Cần theo dõi

- Stage `Notify search engines` vàng nhiều build liền nhau: khoá hết hạn hoặc bị thu hồi, IndexNow trả 403, 422 hoặc 429. Người xem: dev, khi đọc tin Discord.
- Bing Webmaster Tools → IndexNow có URL gửi lên; Search Console → Sitemaps có "Last read" sau mỗi deploy đổi trang.

## Điều kiện xem lại

- Google nhận IndexNow, hoặc mở Indexing API cho trang thường.
- Site có nhiều trang động (sự kiện, bài viết): xem lại cách tính trang đổi và giới hạn số URL mỗi lần gửi.
- IndexNow thường xuyên trả 429.

## Liên quan

- ADR: [0004](0004-automate-sitemap-from-page-config-and-git.md) (ngày `lastmod` mà ADR này dựa vào)
- Spec: [001](../specs/001-sitemap-automation/spec.md), mục "Báo máy tìm kiếm sau deploy"
- Vận hành: [Triển khai, mục 5](../ops/deployment.md#5-ci)

## Nguồn/bằng chứng

- File: `ci/notify-search.sh`, `Jenkinsfile` (stage `Sitemap snapshot`, `Notify search engines`), `public/797740c8b300e12454994d21d7c1c1b5.txt`
- Thử 2026-10-15: `sitemaps.submit` HTTP 204; chạy thử (`DRY_RUN=1`) trên production; IndexNow thử với endpoint giả trả 200, 202, 400, 403, 422, 429, 500; Jenkins thử (cùng image controller) với credential thiếu, file khoá rỗng và script lỗi: stage `UNSTABLE`, build `SUCCESS`.
- Tài liệu ngoài: Google Indexing API, phạm vi dùng (https://developers.google.com/search/apis/indexing-api/v3/quickstart); `sitemaps.submit` (https://developers.google.com/webmaster-tools/v1/sitemaps/submit); Google bỏ ping sitemap (https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping); IndexNow (https://www.indexnow.org/documentation).

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-15 | Tạo, trạng thái Đề xuất |
