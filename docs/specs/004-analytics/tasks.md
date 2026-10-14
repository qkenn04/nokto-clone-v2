# 004: Đo lường truy cập, việc

> Trạng thái: Đề xuất · Cập nhật: 2026-10-15 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Việc sắp làm](../../plan/tasks.md)

PR A (Umami) là PR #13, chờ review; Website ID chưa có nên merge PR A chưa bật gì trên production. Hạ tầng Umami: tài liệu ở repo hạ tầng riêng (private); ở đây chỉ ghi việc trong repo website và việc của chủ quán trên giao diện GA4.

## Chuẩn bị

- [x] 004-T01 Chốt hướng: Umami luôn chạy, GA4 sau đồng ý, Google Signals tắt · 2026-10-14
- [ ] 004-T02 Chủ quán trả lời [spec.md mục 12](spec.md#12-câu-hỏi-mở) · xong khi: không còn `[CẦN XÁC NHẬN]` chặn PR A hay PR B
- [ ] 004-T03 Hạ tầng Umami chạy, có Website ID · repo hạ tầng riêng
- [ ] 004-T04 Quyết định giữ hay tắt Cloudflare Web Analytics

## PR A: Umami

- [x] 004-T10 `src/lib/analytics.ts` (`track`, `trackAttrs`, `isAnalyticsEvent`, `cleanProps`, `UMAMI_WEBSITE_ID`, kiểu `window.umami`); `track()` chỉ gửi khoá trong danh sách cho phép, giá trị cắt còn 100 ký tự, có chỗ đánh dấu `── GA4 ──` cho PR B · AC: 004-AC-01 · PR A
- [x] 004-T11 `src/components/analytics/ClickTracker.tsx`, `UmamiScript.tsx`; gắn vào `layout.tsx` ngoài khối màn hình chờ · PR A
- [x] 004-T12 Gắn sự kiện theo bảng vị trí ở spec mục 4.1 · AC: 004-AC-06 (phần trước deploy: kiểm bằng trình duyệt headless với tracker giả) · PR A
- [x] 004-T13 `reservation_complete` chỉ với `party_size` · AC: 004-AC-07 (form điền `TestTen`, `0900000000`: sự kiện chỉ có `party_size`) · PR A
- [x] 004-T14 Biến build `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC` qua `Jenkinsfile` → `Dockerfile` (ID để trống tới khi có Website ID); smoke test nhận Website ID làm tham số thứ ba: có ID thì mọi trang HTML phải có tracker đúng ID, không có ID thì không trang nào có · PR A
- [x] 004-T15 `/privacy`: mục "Thống kê lượt truy cập" (chỉ hiện khi build có Website ID), mục "Thống kê của Cloudflare"; mục "Tùy chọn hiển thị" thay bằng "Cookie và lưu trữ trên trình duyệt" (code không còn dùng `sessionStorage`, `localStorage` hay cookie) · AC: 004-AC-14 (phần Umami, Cloudflare) · PR A · **chữ chờ chủ quán duyệt**
- [x] 004-T16 Kiểm trước merge (plan mục 5) · AC: 004-AC-01 · 2026-10-15, xem nhật ký
- [ ] 004-T19 Có Website ID: điền `UMAMI_WEBSITE_ID` trong `Jenkinsfile` (PR nhỏ), đổi ngày "Cập nhật" của `/privacy` (`legal/content.ts`) vì mục Umami hiện từ build đó; smoke test của build đó kiểm tracker và ID · xong khi: production có tracker, `/privacy` có mục "Thống kê lượt truy cập"
- [ ] 004-T17 Deploy, kiểm Umami Realtime, sự kiện, UTM, không cookie · AC: 004-AC-09, 004-AC-10
- [ ] 004-T18 Chủ quán cùng dev xem dashboard sau 1 tuần

## GA4: chủ quán làm trên giao diện

- [ ] 004-T20 Tạo account "The Hot Beer Garden", property `thehot.vn` (múi giờ Việt Nam, VND), web stream `https://thehot.vn`; gửi Measurement ID cho dev. **Không** dán đoạn mã Google đưa vào web.
- [ ] 004-T21 Enhanced measurement: bật page views (gồm "page changes based on browser history events"), scrolls, outbound clicks; tắt site search, form interactions
- [ ] 004-T22 Data retention 14 tháng; Google Signals tắt
- [ ] 004-T23 Cấp quyền Editor cho dev trong lúc cài, xong hạ xuống Viewer hoặc Analyst
- [ ] 004-T24 Ngày deploy PR B: custom dimension (Event) `method`, `location`, `mode`, `event_id`, `network`
- [ ] 004-T25 24–48 giờ sau deploy: đánh dấu key event `contact_click`, `reservation_complete`; liên kết Search Console; publish collection Search Console
- [ ] 004-T26 Internal traffic: khai IP wifi quán, bộ lọc ở Testing khoảng 1 tuần rồi Active

## PR B: GA4 + banner

- [ ] 004-T30 `consent.ts`, `useConsent`, `useSplashDone`, `useGaAllowed`, `gtag.d.ts`
- [ ] 004-T31 `ga.ts` (`enableGa`, `disableGa`, `deleteGaCookies`, `sendGaEvent` với danh sách thuộc tính cho phép); phần GA4 trong `track()` · AC: 004-AC-04, 004-AC-05
- [ ] 004-T32 `ConsentBanner`, `CookieSettingsButton`; nút nổi dịch lên trên màn hình hẹp · AC: 004-AC-02, 004-AC-03, 004-AC-11, 004-AC-12
- [ ] 004-T33 Footer: link "Bảo mật thông tin · Cài đặt cookie"; `/privacy`: mục GA4, nút Cài đặt cookie · AC: 004-AC-14
- [ ] 004-T34 Biến build `NEXT_PUBLIC_GA_ID`; smoke test kiểm HTML không có `googletagmanager`
- [ ] 004-T35 Kiểm 004-AC-02 đến 004-AC-13 trên production và điện thoại thật (plan mục 5) · AC: 004-AC-08, 004-AC-13
- [ ] 004-T36 Chủ quán duyệt chữ banner và `/privacy` trước khi merge

## Tài liệu

- [x] 004-T40 Viết spec, plan, tasks này (chỉ phần website) · 2026-10-14
- [x] 004-T41 Ghi biến build mới vào [tài liệu cấu hình](../../dev/configuration.md) và [Triển khai](../../ops/deployment.md) · PR A
- [ ] 004-T42 Khi xong: spec chuyển "Đang áp dụng"; cập nhật [tiến độ](../../plan/progress.md)

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Chốt hướng Umami + GA4 sau đồng ý | ADR 0007 ([mục lục ADR](../../adr/README.md)) |
| 2026-10-15 | PR A: `npm run lint`, `typecheck`, `check:sitemap`, `build`, `docker build --target check` qua. Build không biến Umami: không trang nào có tracker, không request tới tên miền analytics; `<body>` 7 trang và trang 404 giống hệt bản `main` (`89957bc`) sau khi bỏ script, mã chunk, mã `useId` và thuộc tính `data-track*`, trừ chữ của `/privacy`. Build có Website ID thử: tracker được chèn với `data-website-id`, `data-domains="thehot.vn"`, `data-exclude-hash="true"`, không `data-exclude-search`. Trình duyệt headless (tracker giả, mọi request ra ngoài bị chặn): đủ 6 sự kiện ở mọi vị trí của spec mục 4.1, link nội bộ vẫn chuyển trang không tải lại, khoá lạ bị bỏ, tracker lỗi không làm hỏng nút. Smoke test: hai image (có, không có ID) qua; ba cách truyền sai ID đều báo FAIL | PR #13 (nhánh `feat/umami-tracking`) |
