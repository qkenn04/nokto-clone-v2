# Đặc tả sản phẩm: The Hot Beer Garden (thehot.vn)

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Yêu cầu phi chức năng](nfr.md), [Thuật ngữ](glossary.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Mô hình dữ liệu nội dung](../architecture/data-model.md), [Mục lục ADR](../adr/README.md)

## 1. Tóm tắt một đoạn

https://thehot.vn là website chính thức của The Hot Beer Garden, một beer garden (quán nhậu, bia, nhạc) ở 28 Sương Nguyệt Ánh, P. Lâm Viên, Đà Lạt. Người dùng chính là khách đang tìm chỗ đi chơi buổi tối ở Đà Lạt, phần lớn mở trang trên điện thoại từ Google, Google Maps hoặc Facebook. Site giúp họ tìm thấy quán, xem không gian và menu kèm giá, rồi liên hệ chốt bàn qua hotline, Facebook/Messenger hoặc Zalo. Site là một ứng dụng Next.js dựng từ bản clone template NOKTO, đã thay toàn bộ nội dung bằng nội dung của quán (2026-10-13) và chuyển sang domain chính `thehot.vn`, cho Google index từ 2026-10-14 ([ADR 0002](../adr/0002-use-thehot-vn-as-primary-domain.md), [ADR 0003](../adr/0003-allow-search-indexing.md)).

## 2. Bối cảnh và vấn đề

Tính tới 2026-10-14:

| Hiện trạng | Vấn đề | Bằng chứng |
|---|---|---|
| Trước 2026-10-14 site chạy ở `thehot.k2-tech.dev` và gửi `X-Robots-Tag: noindex` | Google không index nên khách không tìm thấy site | [ADR 0002](../adr/0002-use-thehot-vn-as-primary-domain.md), [ADR 0003](../adr/0003-allow-search-indexing.md); commit `7af5058` |
| Sitemap viết tay, `lastmod` gõ cứng, thiếu `/terms` | Google nhận ngày sai, bỏ sót trang thông tin đặt bàn | Đã sửa ở PR #3 ([ADR 0004](../adr/0004-automate-sitemap-from-page-config-and-git.md)) |
| Tiêu đề trang chủ chỉ là slogan | Không chứa từ khách tìm ("quán nhậu", "bia lạnh", "Đà Lạt") | Đã sửa ở PR #5 ([ADR 0005](../adr/0005-separate-search-titles-from-headings.md)) |
| LCP trên điện thoại 2,9 s (PageSpeed Mobile, 2026-10-14) | Vượt ngưỡng "tốt" 2,5 s của Core Web Vitals | [Số đo](../dev/perf.md); PR #4 ([ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md)) |
| Video đầu trang chủ nặng khoảng 80 MB | Tốn dữ liệu di động của khách | [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md) (Đề xuất) |
| Google Maps ghi giờ mở cửa 16:30–00:00, site ghi "từ 17:30" | Thông tin quán không nhất quán, ảnh hưởng SEO địa phương và lòng tin của khách | Mục 10, câu hỏi 1 |
| Chưa có công cụ đo lượt truy cập ngoài Cloudflare Web Analytics | Không biết khách đến từ đâu, bấm liên hệ bao nhiêu | [ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md) |
| Ảnh nền `hero-backdrop.jpg` của template NOKTO vẫn hiện trên mọi trang | Ảnh thuộc chủ template | [ADR 0003](../adr/0003-allow-search-indexing.md), mục Hệ quả |

## 3. Người dùng

| Ai | Làm gì với hệ thống | Cần gì | Không được làm gì |
|---|---|---|---|
| Khách (hội bạn đi chơi tối ở Đà Lạt, theo nội dung site; nhóm khách chính xác: Chưa xác định — cần chủ quán xác nhận) | Tìm quán, xem menu và giá, xem không gian, sự kiện; bấm gọi, nhắn, đặt bàn | Trang nhanh trên điện thoại; giờ, địa chỉ, giá đúng; liên hệ được bằng một chạm | Không có thao tác ghi nào: site không nhận hay lưu dữ liệu của khách |
| Chủ quán, người quản lý | Cung cấp nội dung (menu, ảnh, lịch sự kiện), duyệt thay đổi giao diện và nội dung; quản lý Google Business Profile, Search Console, zone Cloudflare | Thay đổi được duyệt trước khi lên site; số liệu khách truy cập | Sửa nội dung trực tiếp trên máy chủ (nội dung nằm trong code, đi qua PR) |
| Người phát triển, agent AI | Sửa code và nội dung qua PR vào `main` | [AGENTS.md](../../AGENTS.md), tài liệu này, CI xanh | Push thẳng `main` khi chưa review; đưa chi tiết hạ tầng riêng vào repo công khai |
| Người vận hành | Theo dõi Jenkins, deploy, rollback ([Triển khai](../ops/deployment.md)) | Runbook rõ, thông báo khi build hoặc deploy hỏng | Sửa máy chủ ngoài `qkenn04/infra-qkenn` |
| Máy tìm kiếm (Googlebot, Bingbot) | Đọc `robots.txt`, `sitemap.xml`, HTML, JSON-LD | Trang index được, dữ liệu cấu trúc khớp nội dung hiển thị | — |

## 4. Mục tiêu

| # | Mục tiêu | Cách đo | Trạng thái (2026-10-14) |
|---|---|---|---|
| G1 | Khách tìm thấy site khi tìm tên quán và các cụm như "quán nhậu Đà Lạt", "beer garden Đà Lạt" | Search Console: mọi trang trong sitemap được index; truy vấn tên quán ra `thehot.vn` | Đã gửi sitemap và yêu cầu index; chờ Google xử lý |
| G2 | Khách xem được menu và giá đúng (đã gồm VAT) | `/menu` (sách lật từ 10 ảnh menu) và `/menu/list` (bảng giá) khớp menu giấy; kiểm tay mỗi lần đổi menu | Đạt theo menu tháng 9/2026 |
| G3 | Khách liên hệ chốt bàn bằng một chạm từ mọi trang | Nút liên hệ nổi (Messenger, Facebook, Zalo, Gọi) và nút Đặt bàn trên mọi trang; sau khi có analytics: sự kiện `contact_click` | Đạt (kiểm tay); chưa đo được |
| G4 | Tên, địa chỉ, hotline, giờ mở cửa giống nhau ở site, JSON-LD và Google Business Profile | Kiểm tay; Rich Results Test | Chưa đạt: giờ mở cửa lệch Google Maps (mục 10) |
| G5 | Trang nhanh trên điện thoại | Ngân sách PERF ở [yêu cầu phi chức năng](nfr.md) | Chưa đạt: LCP 2,9 s trước PR #4; số sau PR #4 chưa đo |
| G6 | Biết khách đến từ đâu và bao nhiêu người bấm liên hệ | Umami và GA4 theo [ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md) | Chưa triển khai |
| G7 | Cho khách thấy không gian và chương trình của quán | Gallery và dòng sự kiện ở trang chủ; sự kiện có lịch thật thay cho chương trình minh hoạ | Một sự kiện có ngày thật (10/10/2026), bốn chương trình đang là minh hoạ (`illustrative: true`) |

## 5. Không làm

| # | Không làm | Vì sao | Nếu sau này cần |
|---|---|---|---|
| NG1 | Đặt món, giao hàng hay thanh toán trực tuyến | Quán phục vụ tại chỗ; thanh toán kéo theo dữ liệu thẻ, bảo mật và pháp lý | ADR mới và spec riêng |
| NG2 | Form đặt bàn gửi dữ liệu đi (API, email, lưu cơ sở dữ liệu) | Form chỉ giúp khách chuẩn bị thông tin; bàn chỉ được xác nhận khi khách gọi hoặc nhắn quán. Không có hệ thống phía sau và không giữ dữ liệu cá nhân của khách | ADR mới, spec, cập nhật `/privacy` và [mô hình đe doạ](../security/threat-model.md) |
| NG3 | Tài khoản người dùng, đăng nhập, trang quản trị nội dung (CMS) | Nội dung ít đổi và đi qua PR; không có tài khoản thì không có bề mặt tấn công đăng nhập | ADR mới |
| NG4 | Đăng lịch sự kiện bịa, hoặc dữ liệu cấu trúc (JSON-LD) không khớp nội dung hiển thị | Sai sự thật với khách; Google có thể phạt dữ liệu cấu trúc gây hiểu nhầm. Schema `Event` chỉ thêm khi có lịch thật | Có lịch thật từ chủ quán |

## 6. Phạm vi hiện tại

| Nhóm | Trang hoặc tính năng | Tài liệu |
|---|---|---|
| Trang chủ | `/`: video hero, slogan, gallery ảnh quán, dòng sự kiện | [Mô hình dữ liệu](../architecture/data-model.md) |
| Menu | `/menu` (sách lật 10 trang ảnh menu), `/menu/list` (bảng giá theo nhóm món); `/the-hot/menu` chuyển hướng 308 về `/menu` | [Mô hình dữ liệu](../architecture/data-model.md) |
| Giới thiệu, đặt bàn | `/about`, `/reservation` (form 3 bước, không gửi dữ liệu), `/terms` ("Thông tin đặt bàn": địa chỉ, giờ, cách đặt), `/privacy` | NG2 |
| Liên hệ | Nút liên hệ nổi và nút Đặt bàn trên mọi trang | G3 |
| SEO | Sitemap tự động, tiêu đề và mô tả cho tìm kiếm, ảnh chia sẻ, JSON-LD `Restaurant` | Spec `001-sitemap-automation`, `002-onpage-seo` |
| Hiệu năng | Core Web Vitals trên điện thoại, video hero | Spec `003-performance` |
| Đo lường | Umami, GA4 sau đồng ý | Spec `004-analytics` |

Spec của từng tính năng:

<!-- check-links: off -->
<!-- Link tới docs/plan/ và docs/specs/ (viết ở nhánh khác). Bỏ cặp marker này khi hai nhánh đã merge. -->
- [001 Sitemap tự động](../specs/001-sitemap-automation/) · [002 SEO trên trang](../specs/002-onpage-seo/) · [003 Hiệu năng](../specs/003-performance/) · [004 Analytics](../specs/004-analytics/)
- Thứ tự làm: [Lộ trình](../plan/roadmap.md); trạng thái: [Tiến độ](../plan/progress.md)
<!-- check-links: on -->

## 7. Tiêu chí nghiệm thu cấp sản phẩm

| # | Tiêu chí | Kiểm bằng |
|---|---|---|
| AC-01 | 7 trang (`/`, `/menu`, `/menu/list`, `/about`, `/reservation`, `/terms`, `/privacy`) và `/sitemap.xml` trả 200; đường dẫn lạ trả 404 | `ci/smoke-test.sh`, mỗi build trên Jenkins |
| AC-02 | `/sitemap.xml` liệt kê đúng các trang trong `seo/sitemap-pages.json`; mỗi URL có `<lastmod>`; mọi `<loc>` và `<image:loc>` trả 200 trên đúng domain | `npm run check:sitemap` (bước Check) và `ci/smoke-test.sh` |
| AC-03 | Không trang nào gửi `X-Robots-Tag: noindex`; thẻ robots là `index, follow`; canonical trỏ về `https://thehot.vn/...` | `curl -sI https://thehot.vn/` và xem nguồn trang; Search Console, URL Inspection |
| AC-04 | Tên, địa chỉ, hotline, giờ mở cửa giống nhau ở footer, `/terms`, JSON-LD và Google Business Profile | Kiểm tay; https://search.google.com/test/rich-results |
| AC-05 | Mọi trang có nút liên hệ nhanh (Messenger, Facebook, Zalo, Gọi) và nút Đặt bàn, không che nội dung chính trên điện thoại | Kiểm tay trên điện thoại thật |
| AC-06 | Hoàn thành form đặt bàn không tạo request mạng nào chứa dữ liệu khách; màn hình cuối nói rõ thông tin chưa được gửi và hướng khách gọi hoặc nhắn | DevTools Network, kiểm tay; review `src/components/sites/nokto/reservation/ReservationForm.tsx` |
| AC-07 | Ngân sách PERF-01 đến PERF-03 đạt trên PageSpeed Mobile của trang chủ | [Số đo](../dev/perf.md) |

## 8. Definition of Done

Một thay đổi được coi là xong khi:

1. Đi qua PR vào `main`; `npm run check` xanh trên máy; Jenkins chạy hết Sitemap dates, Check, Build, Smoke test, Push, Deploy.
2. Thay đổi nội dung hoặc giao diện mà khách thấy đã được chủ quán (hoặc người được giao) duyệt trước khi merge.
3. Tài liệu cập nhật trong cùng PR theo [Definition of Done cho tài liệu](../README.md#definition-of-done-cho-tài-liệu).
4. Không làm hỏng ngân sách trong [yêu cầu phi chức năng](nfr.md); thay đổi nhắm vào hiệu năng có số đo trước và sau ở [dev/perf.md](../dev/perf.md).
5. Đã kiểm trên https://thehot.vn sau deploy (trang liên quan, sitemap nếu đổi trang); có đường lùi đã biết ([Triển khai, mục Rollback](../ops/deployment.md#7-rollback)).
6. Thông tin kinh doanh mới (giờ, giá, sự kiện) có nguồn từ chủ quán; chưa có nguồn thì không đưa lên site.

## 9. Tín hiệu nên dừng hoặc thu hẹp

| Tín hiệu | Phản ứng |
|---|---|
| Một thay đổi làm LCP hoặc CLS trên điện thoại xấu đi so với lần đo trước | Revert hoặc sửa trước khi làm tiếp; ghi số vào [dev/perf.md](../dev/perf.md) |
| Search Console báo trang bị loại khỏi index hoặc lỗi dữ liệu cấu trúc | Dừng thay đổi SEO khác, xử lý lỗi trước |
| Thông tin trên site lệch với thông tin quán xác nhận | Sửa site ngay (đi qua PR), cập nhật Google Business Profile cùng lúc |

## 10. Câu hỏi mở

1. Giờ mở cửa đúng là 16:30 (Google Maps) hay 17:30 (site)? Chưa xác định — cần chủ quán xác nhận. Ảnh hưởng: G4, AC-04, JSON-LD `openingHoursSpecification`, khung giờ trong form đặt bàn.
2. Quán có nhạc sống mỗi tối, chỉ cuối tuần, hay chỉ DJ/playlist? Chưa xác định — cần chủ quán xác nhận. Ảnh hưởng: nội dung SEO, thuộc tính Google Business Profile.
3. Khoảng giá phổ biến (`priceRange`)? Chưa xác định — cần chủ quán xác nhận.
4. Lịch sự kiện thật thay cho 4 chương trình minh hoạ ở trang chủ? Chưa xác định — cần chủ quán xác nhận. Ảnh hưởng: G7, NG4.
5. Thay ảnh nền template `hero-backdrop.jpg` bằng ảnh của quán hay gradient CSS, và khi nào? Chủ quán chọn giữ tạm ([ADR 0003](../adr/0003-allow-search-indexing.md)); thời hạn thay: Chưa xác định — cần chủ quán xác nhận.
6. Đoạn video hero dùng lâu dài và có phát video trên điện thoại hay chỉ hiện ảnh poster? Chưa xác định — cần chủ quán xác nhận ([ADR 0008](../adr/0008-compress-hero-video-without-trimming.md)).
7. Site có cần bản tiếng Anh cho khách du lịch không? Chưa xác định — cần chủ quán xác nhận.

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo từ docs-template, điền theo hiện trạng site và các kế hoạch SEO, sitemap, hiệu năng, analytics ngày 2026-10-14 |
