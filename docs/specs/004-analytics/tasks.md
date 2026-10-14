# 004: Đo lường truy cập, việc

> Trạng thái: Đề xuất · Cập nhật: 2026-10-14 · Liên quan: [spec.md](spec.md), [plan.md](plan.md), [Tiến độ](../../plan/progress.md), [Việc sắp làm](../../plan/tasks.md)

Chưa bắt đầu. Hạ tầng Umami: tài liệu ở repo hạ tầng riêng (private); ở đây chỉ ghi việc trong repo website và việc của chủ quán trên giao diện GA4.

## Chuẩn bị

- [x] 004-T01 Chốt hướng: Umami luôn chạy, GA4 sau đồng ý, Google Signals tắt · 2026-10-14
- [ ] 004-T02 Chủ quán trả lời [spec.md mục 12](spec.md#12-câu-hỏi-mở) · xong khi: không còn `[CẦN XÁC NHẬN]` chặn PR A hay PR B
- [ ] 004-T03 Hạ tầng Umami chạy, có Website ID · repo hạ tầng riêng
- [ ] 004-T04 Quyết định giữ hay tắt Cloudflare Web Analytics

## PR A: Umami

- [ ] 004-T10 `src/lib/analytics.ts` (`track`, `trackAttrs`, `isAnalyticsEvent`, kiểu `window.umami`) · AC: 004-AC-01
- [ ] 004-T11 `ClickTracker`, `UmamiScript`; gắn vào `layout.tsx` ngoài khối màn hình chờ
- [ ] 004-T12 Gắn sự kiện theo bảng vị trí ở spec mục 4.1 · AC: 004-AC-06
- [ ] 004-T13 `reservation_complete` chỉ với `party_size` · AC: 004-AC-07
- [ ] 004-T14 Biến build `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC` qua `Jenkinsfile` → `Dockerfile`; smoke test kiểm Website ID
- [ ] 004-T15 `/privacy`: mục "Thống kê lượt truy cập"; sửa mục "Tùy chọn hiển thị" · AC: 004-AC-14 (phần Umami)
- [ ] 004-T16 Kiểm trước merge (plan mục 5) · AC: 004-AC-01
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
- [ ] 004-T41 Ghi biến build mới vào tài liệu cấu hình và [Triển khai](../../ops/deployment.md)
- [ ] 004-T42 Khi xong: spec chuyển "Đang áp dụng"; cập nhật [tiến độ](../../plan/progress.md)

## Nhật ký

| Ngày | Việc | Bằng chứng |
|---|---|---|
| 2026-10-14 | Chốt hướng Umami + GA4 sau đồng ý | ADR 0007 ([mục lục ADR](../../adr/README.md)) |
