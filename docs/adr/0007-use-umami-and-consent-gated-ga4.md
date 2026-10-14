# ADR 0007: Analytics bằng Umami tự cài (luôn chạy) và GA4 chỉ sau khi khách đồng ý

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mô hình đe doạ](../security/threat-model.md), [Yêu cầu phi chức năng](../product/nfr.md), [Cấu hình](../dev/configuration.md), [Đặc tả sản phẩm](../product/spec.md)

## Trạng thái

Chấp nhận (chưa triển khai, tính tới 2026-10-14).

## Ngày

- Quyết định: 2026-10-14
- Ghi lại: 2026-10-14
- Người quyết định: chủ repo (`qkenn04`) cùng chủ quán; kế hoạch analytics ngày 2026-10-14 ghi "Quyết định: dùng cả hai"

## Bối cảnh

- Site chưa có công cụ analytics trong code. Zone Cloudflare `thehot.vn` đang bật **Cloudflare Web Analytics**: Cloudflare tự chèn script `beacon.min.js` vào trang, đếm truy cập không dùng cookie và đo Core Web Vitals của khách thật. Trang `/privacy` chưa nhắc tới nó.
- Câu hỏi cần trả lời: mỗi ngày bao nhiêu người vào; khách đến từ đâu (Google, Maps, Facebook, Instagram, TikTok, QR ở quán, qua tham số UTM); trang nào được xem; bao nhiêu lượt bấm Gọi, Zalo, Messenger, Facebook và ở đâu; bao nhiêu người điền xong form đặt bàn; khách mới hay quay lại; nhân khẩu học khi đủ đông.
- Cloudflare Web Analytics không đếm được sự kiện tuỳ biến (bấm liên hệ, hoàn thành form).
- Luật Bảo vệ dữ liệu cá nhân của Việt Nam có hiệu lực từ 2026-01-01; cookie theo dõi nên chỉ đặt sau khi khách đồng ý (nhận định chung, không phải tư vấn pháp lý).
- Có sẵn VPS để tự cài một dịch vụ nhỏ. Site có màn hình chờ tới 6 s nên script bên thứ ba cần tải sau, không tranh băng thông lúc đầu.
- Form đặt bàn không gửi dữ liệu đi đâu, nên "đặt bàn thành công" trên site chỉ là ý định; việc chốt bàn nằm ở lượt bấm liên hệ ngay sau đó.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | GA4 cho mọi khách, không hỏi đồng ý | Đủ số, ít công | Đặt cookie trước khi đồng ý: rủi ro riêng tư và pháp lý | Loại |
| 2 | Chỉ GA4, sau khi đồng ý | Phân tích sâu, đúng quy tắc đồng ý | Thiếu khách từ chối và khách dùng trình chặn quảng cáo, không biết tổng lượt thật | Loại |
| 3 | Chỉ Umami tự cài | Không cookie, đủ số, dữ liệu nằm trên máy chủ của quán | Không có hành trình nhiều lần ghé, nhân khẩu học, liên kết quảng cáo sau này | Loại (dùng một mình) |
| 4 | Chỉ Cloudflare Web Analytics (đang có) | Không tốn công | Không có sự kiện tuỳ biến; không trả lời được câu hỏi về liên hệ và đặt bàn | Loại (dùng một mình) |
| 5 | Plausible | Gọn, riêng tư như Umami | Lý do không chọn chưa được ghi lại: `[CẦN XÁC NHẬN]` | Loại |
| 6 | Umami luôn chạy + GA4 chỉ sau khi đồng ý (Consent Mode kiểu basic), Google Signals tắt lúc đầu | Umami cho tổng số và sự kiện của mọi khách; GA4 cho phân tích sâu trong nhóm đã đồng ý | Hai công cụ phải duy trì; thêm một stack trên VPS; cần banner đồng ý | **Chọn** |

## Quyết định

1. **Umami** tự cài trên VPS (một subdomain của `thehot.vn`), không cookie, không lưu IP. Script chỉ tải khi có biến build `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC` và chỉ đếm trên domain thật, nên máy dev và smoke test không bị đếm. Stack, sao lưu, bảo mật trang đăng nhập của Umami thuộc `qkenn04/infra-qkenn`.
2. **GA4** chỉ tải sau khi khách bấm **Đồng ý** trên banner (Consent Mode kiểu basic: chưa đồng ý thì không tải `gtag.js`, không gửi gì cho Google). Khi đồng ý: `analytics_storage` granted; `ad_storage`, `ad_user_data`, `ad_personalization` denied. Google Signals tắt cả trong Admin lẫn cấu hình tag. Giữ dữ liệu 14 tháng. Chỉ chạy khi có `NEXT_PUBLIC_GA_ID`.
3. **Banner:** hiện sau màn hình chờ, hai nút Từ chối và Đồng ý ngang hàng, có link chính sách; không chặn thao tác. Link "Cài đặt cookie" ở footer để đổi hoặc rút đồng ý; rút đồng ý thì xoá cookie `_ga`.
4. **Sự kiện** đi qua một hàm chung `track(name, props)`: luôn gửi Umami, gửi GA4 khi đã đồng ý. Tên `snake_case`: `contact_click`, `booking_cta_click`, `reservation_complete`, `menu_view_mode`, `event_view`. Chỉ gửi tham số trong danh sách cho phép; **không bao giờ** gửi tên, số điện thoại hay nội dung khách nhập (PRIV-04).
5. **`/privacy`** được cập nhật trong cùng PR với mỗi công cụ. **Cloudflare Web Analytics** đang chạy phải được ghi vào `/privacy` (hoặc tắt nếu quyết định chỉ dùng Umami).
6. Thứ tự: PR Umami trước, PR GA4 sau (hai PR cùng sửa `layout.tsx`, nội dung `/privacy`, `Jenkinsfile`, `Dockerfile`).

## Hệ quả

### Tốt

- Có tổng lượt truy cập và lượt bấm liên hệ của mọi khách, không cookie.
- Phân tích sâu (khách quay lại, hành trình, liên kết Search Console) với khách đã đồng ý.
- Không gửi gì cho Google trước khi khách đồng ý.

### Xấu (cái giá chấp nhận trả)

- Hai công cụ, hai bộ số: GA4 luôn thấp hơn Umami (thiếu khách từ chối và khách chặn quảng cáo).
- Thêm một dịch vụ trên VPS phải nâng cấp, sao lưu, bảo vệ trang đăng nhập; VPS ngừng thì cả site lẫn thống kê cùng ngừng.
- Banner là thêm một thứ khách thấy ở lần đầu ghé.
- Cloudflare Web Analytics trùng một phần chức năng với Umami.

### Cần theo dõi

- PageSpeed Mobile trước và sau mỗi PR analytics (không được làm hỏng ngân sách PERF).
- Trên trang mới mở: không có request nào tới Google và không có cookie `_ga` trước khi bấm Đồng ý.

## Điều kiện xem lại

- Bắt đầu chạy quảng cáo (Meta Pixel, Google Ads): thêm lựa chọn đồng ý cho quảng cáo, cân nhắc Consent Mode kiểu advanced.
- Lượt truy cập đạt vài nghìn mỗi tháng: cân nhắc bật Google Signals kèm lựa chọn đồng ý riêng.
- Quy định về dữ liệu cá nhân thay đổi.

## Liên quan

- PRIV-02, PRIV-03, PRIV-04 ở [yêu cầu phi chức năng](../product/nfr.md#4-riêng-tư); T04, L7 ở [mô hình đe doạ](../security/threat-model.md); biến dự kiến ở [Cấu hình, mục 2.4](../dev/configuration.md#24-dự-kiến-chưa-có-trong-code)
<!-- check-links: off -->
<!-- Link tới docs/plan/ và docs/specs/ (viết ở nhánh khác). Bỏ cặp marker này khi hai nhánh đã merge. -->
- Spec: [004 Analytics](../specs/004-analytics/)
<!-- check-links: on -->

## Nguồn/bằng chứng

- Kế hoạch analytics ngày 2026-10-14 (bản tổng quan và hai bản chi tiết cho Umami và GA4, soạn ngoài repo; nội dung triển khai chuyển vào spec `004-analytics`)
- PageSpeed Mobile 2026-10-14: thấy `static.cloudflareinsights.com/beacon.min.js` và `/cdn-cgi/rum` trên trang chủ
- File sẽ chạm: `src/app/layout.tsx`, `src/components/sites/nokto/legal/content.ts`, `src/components/sites/the-hot/FloatingContact.tsx`, `src/components/sites/nokto/reservation/ReservationForm.tsx`, `Jenkinsfile`, `Dockerfile`

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Ghi lại quyết định, trạng thái Chấp nhận (chưa triển khai) |
