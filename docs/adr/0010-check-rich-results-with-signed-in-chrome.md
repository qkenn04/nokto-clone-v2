# ADR 0010: Kiểm Rich Results Test bằng script điều khiển Chrome đã đăng nhập Google; đọc dữ liệu nhúng trong trang kết quả, giao diện làm dự phòng

> Trạng thái: Đề xuất · Cập nhật: 2026-10-18 · Liên quan: [Kiểm thử, mục 3.2](../dev/testing.md#32-rich-results-test-script-đọc-kết-quả), [Cấu hình, mục 2.6](../dev/configuration.md#26-script-kiểm-rich-results-test-scriptsrich-resultscheckmjs-chạy-trên-máy-dev), [Mô hình đe doạ](../security/threat-model.md), [Spec 002](../specs/002-onpage-seo/spec.md), [ADR 0009](0009-notify-search-engines-after-deploy.md)

## Trạng thái

Đề xuất.

## Ngày

- Đề xuất: 2026-10-18
- Người quyết định: chủ repo (`qkenn04`)

## Bối cảnh

- 002-AC-04 và AC-04 của [đặc tả sản phẩm](../product/spec.md) kiểm bằng Rich Results Test. Trước ADR này việc kiểm làm tay: mở trang, chờ, bấm từng nhóm và từng mục, chép cảnh báo. Agent AI không đọc được kết quả nếu người không chép hay chụp lại.
- Rich Results Test không có API công khai. Chạy test cần đăng nhập Google: profile Chrome chưa đăng nhập bị từ chối ("Something went wrong … Log in and try again"), Chrome chạy không cửa sổ cũng bị từ chối (thử 2026-10-18).
- Mở `https://search.google.com/test/rich-results?url=<URL>` khi đã đăng nhập thì test tự chạy và trang chuyển sang `…/result?id=<ID>`. Trang kết quả ai có ID cũng mở được, không cần cookie, và nhúng sẵn kết quả trong các khối `AF_initDataCallback` (`ds:0`, `ds:3`, `ds:4`, `ds:5`). Định dạng này Google không công bố.
- Search Console **URL Inspection API** (dùng trong `ci/notify-search.sh status`) có phần rich result, nhưng chỉ của bản Google đã index, cần khoá service account (chỉ nằm trên máy CI), và ngày 2026-10-15 chỉ báo Events, không có Local business ([TK17](../plan/tasks.md)).
- validator.schema.org kiểm cú pháp schema.org, không kiểm điều kiện rich result của Google.
- Máy dev có Google Chrome; repo đã dùng Node.js 24.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Giữ kiểm tay | Không thêm gì | Tốn công; agent không tự đọc được; dễ sót cảnh báo lồng như `address.postalCode` | Loại |
| 2 | URL Inspection API | API chính thức, đã có trong `notify-search.sh status` | Chỉ bản đã index (không kiểm ngay sau deploy, không kiểm trang chưa index); khoá chỉ trên máy CI; không thấy Local business | Loại cho việc này; vẫn dùng để theo dõi index |
| 3 | Gọi thẳng request nội bộ của Rich Results Test bằng `curl` kèm cookie đăng nhập | Không cần trình duyệt | Cookie mang quyền đầy đủ của tài khoản Google, phải nằm trong file hay dòng lệnh; request nội bộ có token chống giả mạo, dễ vỡ hơn trang kết quả | Loại |
| 4 | Script Playwright điều khiển Chrome thật, chỉ đọc giao diện | Đọc đúng thứ người thấy | 7–33 giây mỗi kết quả; vỡ khi Google đổi giao diện; không có mã luật, giờ crawl, mã HTTP | Loại làm cách chính; giữ làm dự phòng |
| 5 | Script Playwright chạy test bằng Chrome thật, đọc dữ liệu nhúng trong trang kết quả (tải không kèm cookie), giao diện làm dự phòng | Đọc khoảng 1 giây; có mã luật, mức độ, giờ crawl, mã HTTP, tài nguyên bị chặn; đọc được link Share của người khác | Định dạng không công bố, có thể đổi không báo trước; vẫn cần phiên đăng nhập và màn hình để chạy test | Chọn |

## Quyết định

Kiểm Rich Results Test bằng `scripts/rich-results/check.mjs`, chạy trên máy dev:

1. Package riêng `scripts/rich-results/package.json`: `playwright-core` 1.64.1 (không tải trình duyệt), Node.js 24 trở lên. Không thêm vào `package.json` gốc, nên `npm ci` của Docker và Jenkins không cài; `.dockerignore` loại `scripts/`.
2. Dùng Chrome của máy (`channel: "chrome"`) với profile riêng `~/.local/share/thehot-rrt/chrome-profile` (đổi bằng `RRT_PROFILE`), đăng nhập một lần bằng `check.mjs --login`. Playwright mặc định thêm `--password-store=basic` và `--use-mock-keychain`; script bỏ hai cờ này và dùng `--password-store=gnome-libsecret` (keyring của hệ thống), để mọi lần mở profile dùng cùng một khoá mã hoá cookie. Chrome chạy có cửa sổ.
3. Chạy test: mở `…/rich-results?url=<URL>`, chờ địa chỉ `…/result?id=<ID>` và dòng tóm tắt, tối đa 180 giây; gặp hộp thoại từ chối thì dừng.
4. Đọc kết quả: tải `…/result?id=<ID>` không kèm cookie, đọc `ds:0`, `ds:3`, `ds:4`, `ds:5`. Mỗi mục: số lỗi mức 2 (critical) phải bằng `item[2]`, số cảnh báo mức 1 (non-critical) phải bằng `item[3]`. Lệch số hay sai kiểu thì coi là định dạng đã đổi và chuyển sang đọc giao diện. ID sai hoặc hết hạn thì báo lỗi, không chuyển.
5. In JSON; mã thoát 0 (không mục nào lỗi nghiêm trọng), 1 (có mục lỗi nghiêm trọng), 2 (không có kết quả).
6. Không chạy trong CI.

Quy tắc rút ra:

1. Thà báo "không đọc được" (mã 2) còn hơn báo sai: mọi chỗ đọc đều đối chiếu với số đếm Google ghi kèm.
2. Phiên Google chỉ nằm trong profile riêng; không dùng profile Chrome hằng ngày, không đưa cookie ra file hay dòng lệnh.
3. Đổi cách đọc (thêm mã nhóm, mã mức độ) thì kiểm lại bằng một mẫu hợp lệ và một mẫu lỗi thật.

## Hệ quả

### Tốt

- Một lệnh cho ra kết quả có cấu trúc trong 10–13 giây; agent đọc trực tiếp, kể cả cảnh báo lồng như `address.postalCode`.
- Đọc được link Share (`--id`) mà không cần đăng nhập.
- Có mã thoát để dùng trong script khác.

### Xấu (cái giá chấp nhận trả)

- Phụ thuộc định dạng không công bố của Google; khi đổi, script báo mã 2 hoặc chuyển sang đọc giao diện (chậm hơn) cho tới khi sửa.
- Thêm một tài sản cần bảo vệ trên máy dev: phiên đăng nhập Google trong profile ([mô hình đe doạ, T11](../security/threat-model.md#33-bảng-đe-doạ)).
- Chỉ chạy trên máy có Chrome, màn hình và profile đã đăng nhập; không có trong CI.
- Thêm một phụ thuộc dev (`playwright-core`) với lockfile riêng phải tự cập nhật.
- Điều khiển giao diện Google bằng script có thể bị Google chặn; `[CẦN XÁC NHẬN: điều khoản của Google về truy cập tự động vào công cụ Search Console]`. Script chạy từng test một, theo đúng luồng người dùng.

### Cần theo dõi

- Mã 2 với `page data format changed`, hoặc JSON có `fallbackReason`: Google đã đổi định dạng; sửa `check.mjs` và kiểm lại theo quy tắc 3. Người xem: người chạy script.
- Quá 180 giây nhiều lần liền: Google chậm hoặc bắt đầu chặn.
- Hộp thoại "Log in and try again" dù profile đã đăng nhập: phiên hết hạn, chạy `check.mjs --login`.

## Điều kiện xem lại

- Google công bố API cho Rich Results Test, hoặc URL Inspection API trả đủ các loại rich result kể cả Local business.
- Google chặn trình duyệt điều khiển tự động.
- Cần kiểm trong CI (ví dụ chặn deploy khi JSON-LD có lỗi nghiêm trọng).

## Liên quan

- ADR: [0009](0009-notify-search-engines-after-deploy.md) (URL Inspection API trong `notify-search.sh status`)
- Spec: [002](../specs/002-onpage-seo/spec.md), 002-AC-04
- Kiểm thử: [mục 3.2](../dev/testing.md#32-rich-results-test-script-đọc-kết-quả); cấu hình: [mục 2.6](../dev/configuration.md#26-script-kiểm-rich-results-test-scriptsrich-resultscheckmjs-chạy-trên-máy-dev)

## Nguồn/bằng chứng

- File: `scripts/rich-results/check.mjs`, `scripts/rich-results/package.json`
- Chạy 2026-10-18: production 6 lần (5 lần mã 0, 1 lần quá 180 giây); mẫu Event thiếu `startDate` ở tab CODE: mã 1, trong `ds:4` mục có `item[2] = 1`, `item[3] = 7`, `startDate` mức 2 (luật 9 `MISSING_FIELD_WITHOUT_TYPE`), 7 cảnh báo mức 1 (luật 8 `MISSING_RECOMMENDED_FIELD`); cùng ID, đọc giao diện khớp đọc dữ liệu; profile trống và Chrome không cửa sổ: bị từ chối.
- Tài liệu ngoài: Rich Results Test (https://search.google.com/test/rich-results); URL Inspection API (https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect); Playwright `launchPersistentContext` (https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context).

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-18 | Tạo, trạng thái Đề xuất |
