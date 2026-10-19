# Thuật ngữ

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-19 · Liên quan: [Đặc tả sản phẩm](spec.md), [Yêu cầu phi chức năng](nfr.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Tài liệu](../README.md)

Chỉ gồm thuật ngữ dùng trong repo và tài liệu này. Dùng thuật ngữ nhất quán trong tài liệu và code; đổi tên thì đổi ở đây trước.

Mục lục: [Miền nghiệp vụ](#miền-nghiệp-vụ) · [Tìm kiếm và chia sẻ](#tìm-kiếm-và-chia-sẻ) · [Hiệu năng](#hiệu-năng) · [Đo lường và riêng tư](#đo-lường-và-riêng-tư) · [Hạ tầng và giao hàng](#hạ-tầng-và-giao-hàng) · [Quy trình và tài liệu](#quy-trình-và-tài-liệu)

## Miền nghiệp vụ

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **NAP** | Tên, địa chỉ, điện thoại | Name, Address, Phone: bộ thông tin nhận diện một địa điểm; phải giống hệt nhau ở mọi nơi để Google tin là một quán | `site` trong `src/components/sites/nokto/site.ts`; bất biến I-01 ở [mô hình dữ liệu](../architecture/data-model.md) |
| **GBP** | Hồ sơ Google của quán | Google Business Profile: hồ sơ quán trên Google Search và Google Maps (giờ, ảnh, đánh giá) | Do chủ quán quản lý, ngoài repo; link website trên GBP dùng UTM |
| **Đặt bàn** | Chốt bàn, chốt kèo | Trên site: khách điền form để chuẩn bị thông tin, rồi gọi hoặc nhắn quán. Bàn chỉ được xác nhận khi quán trả lời | `/reservation`; form không gửi dữ liệu ([Đặc tả, NG2](spec.md#5-không-làm)) |
| **Liên hệ nhanh** | Nút nổi | Cụm nút Messenger, Facebook, Zalo, Gọi và nút Đặt bàn cố định ở góc màn hình trên mọi trang | `src/components/sites/the-hot/FloatingContact.tsx` |
| **Menu sách lật** / **bảng giá** | Menu | Hai cách xem menu: lật trang ảnh menu (`/menu`) hoặc danh sách món kèm giá (`/menu/list`) | `menuPages.ts`, `MenuBook.tsx`; `menu/data.ts` |
| **Món ăn chơi** / **Premium** | Hai tab menu | Hai phần của menu, mỗi phần một tab ở cả sách lật và bảng giá. "Món ăn chơi": mồi 39K–99K, salad, bia (bản PDF gọi là "Menu Luxury"). "Premium": combo, khai vị, mồi, mẹt, món heo, bò, gà, tôm, ếch, lẩu, canh, cơm, rau, rượu, vang, tháp | `MenuGroupId` `an_choi`, `premium` trong `menu/data.ts`; `menuBooks` trong `menuPages.ts`; `MenuTabs.tsx` |
| **Chương trình minh hoạ** | Sự kiện mẫu | Sự kiện hiện ở trang chủ để minh hoạ không khí, chưa có lịch thật từ quán; trên UI có nhãn "Chương trình minh hoạ" | Cờ `illustrative: true` trong `homeEvents` |
| **Màn hình chờ** | Splash, preloader | Hiệu ứng rót bia phủ cả màn hình mỗi lần tải trang, giữ tối đa 6 s | `SPLASH_SCRIPT` trong `src/app/layout.tsx`, `chrome/Preloader.tsx` |
| **Ảnh nền template** | Backdrop | Ảnh `hero-backdrop.jpg` của template NOKTO, mờ dần sang phải phía sau nội dung; là phần tử LCP trên điện thoại | `chrome/Backdrop.tsx`; [ADR 0003](../adr/0003-allow-search-indexing.md) |

## Tìm kiếm và chia sẻ

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **Index** / **noindex** | Cho hoặc cấm lập chỉ mục | Máy tìm kiếm có được đưa trang vào kết quả không. Cấm bằng header `X-Robots-Tag: noindex` hoặc thẻ `<meta name="robots">` | Cho index từ 2026-10-14 ([ADR 0003](../adr/0003-allow-search-indexing.md)) |
| **Canonical** | URL chuẩn | URL mà trang tự khai là bản chính, tránh trùng lặp | `alternates.canonical` trong metadata từng trang |
| **301** / **308** | Chuyển hướng vĩnh viễn | Báo trình duyệt và máy tìm kiếm rằng địa chỉ đã đổi hẳn; 308 giữ nguyên phương thức HTTP | 301: tên miền cũ và `www` về `thehot.vn` (nginx); 308: `/the-hot/menu` về `/menu` (`next.config.ts`) |
| **Sitemap** | Sơ đồ trang | File `sitemap.xml` liệt kê các URL muốn máy tìm kiếm biết | Sinh lúc build từ `seo/sitemap-pages.json` ([ADR 0004](../adr/0004-automate-sitemap-from-page-config-and-git.md)) |
| **`lastmod`** | Ngày sửa cuối | Ngày nội dung một URL trong sitemap đổi lần cuối | Ngày commit cuối trên `main` chạm vào nguồn của trang (`git log --first-parent`) |
| **Sitemap ảnh** | Image sitemap | Thẻ `<image:image>` trong sitemap, khai ảnh thật xuất hiện trên trang | `src/seo/sitemap-images.ts` |
| **JSON-LD** | Dữ liệu cấu trúc | Khối JSON theo từ vựng schema.org nhúng trong HTML, giúp Google hiểu trang mô tả gì | `restaurantSchema` (`@type: Restaurant`) trong `src/app/layout.tsx` |
| **OG image** | Ảnh chia sẻ | Ảnh Open Graph (`og:image`) hiện khi link được dán vào Facebook, Messenger, Zalo; Twitter card là bản tương tự cho X | `src/app/opengraph-image.png`, `twitter-image.png`; trang con dùng chung ảnh trang chủ ([ADR 0005](../adr/0005-separate-search-titles-from-headings.md)) |
| **Search Console** | Google Search Console | Công cụ của Google xem trang nào được index, truy vấn nào ra site, lỗi dữ liệu cấu trúc, Core Web Vitals | Property dạng Domain `thehot.vn`, đã gửi sitemap (2026-10-14); Jenkins gửi lại sitemap qua Search Console API sau mỗi deploy có trang đổi ([ADR 0009](../adr/0009-notify-search-engines-after-deploy.md)) |
| **IndexNow** | IndexNow | Giao thức mở để site báo cho máy tìm kiếm URL vừa thêm, sửa hoặc xoá bằng một request; dùng chung cho Bing, Yandex, Seznam, Naver… (Google không dùng). Khoá xác minh là một file văn bản công khai trên site | Jenkins gửi URL trang có `lastmod` đổi sau mỗi deploy; khoá là `public/<khoá>.txt` ([ADR 0009](../adr/0009-notify-search-engines-after-deploy.md)) |

## Hiệu năng

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **Core Web Vitals** | Chỉ số trải nghiệm | Bộ chỉ số Google dùng để đánh giá trải nghiệm tải trang: LCP, CLS, INP | Ngân sách PERF ở [yêu cầu phi chức năng](nfr.md) |
| **LCP** | Thời gian hiện phần tử lớn nhất | Largest Contentful Paint: lúc phần tử ảnh hoặc chữ lớn nhất trong khung nhìn đầu tiên hiện ra. "Tốt" khi < 2,5 s | Trên điện thoại là ảnh nền trong màn hình chờ ([dev/perf.md](../dev/perf.md)) |
| **CLS** | Độ xô lệch bố cục | Cumulative Layout Shift: tổng mức nội dung bị đẩy lệch khi tải. "Tốt" khi < 0,1 | PERF-02 |
| **INP** / **TBT** | Độ trễ phản hồi | INP (Interaction to Next Paint) đo trên khách thật; TBT (Total Blocking Time) là số giả lập trong phòng thí nghiệm, dùng thay khi chưa có dữ liệu thật | PERF-03 |
| **Speed Index** | Tốc độ hiện nội dung | Nội dung trong khung nhìn hiện đầy nhanh tới mức nào | Theo dõi ở [dev/perf.md](../dev/perf.md) |
| **PageSpeed Insights** | PageSpeed | Công cụ web của Google chạy Lighthouse (giả lập) và hiện field data | Công cụ đo chính |
| **`fetchPriority`** | Mức ưu tiên tải | Thuộc tính báo trình duyệt tải tài nguyên nào trước | `fetchPriority="high"` cho ảnh LCP ([ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md)) |
| **faststart** | Đưa chỉ mục video lên đầu | Đặt hộp `moov` của file MP4 trước dữ liệu để trình duyệt phát được khi mới tải phần đầu | [ADR 0008](../adr/0008-compress-hero-video-without-trimming.md) |
| **AV1** | Chuẩn nén video | Codec video mới, file nhỏ hơn H.264 cùng chất lượng; cần bản H.264 dự phòng | `about.av1.mp4`, `kitchen.av1.mp4` |

## Đo lường và riêng tư

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **UTM** | Tham số nguồn | Tham số `utm_source`, `utm_medium`, `utm_campaign` gắn vào link để công cụ đo biết khách đến từ đâu | Quy ước trong spec `004-analytics` |
| **Consent** | Sự đồng ý | Khách đồng ý (hoặc từ chối) cho site dùng cookie thống kê | GA4 chỉ tải sau khi khách bấm Đồng ý ([ADR 0007](../adr/0007-use-umami-and-consent-gated-ga4.md)) |
| **Consent Mode (basic)** | Chế độ đồng ý cơ bản | Cách tích hợp của Google: chưa đồng ý thì không tải tag Google, không gửi gì | ADR 0007 |
| **Umami** | Công cụ đếm truy cập | Công cụ analytics mã nguồn mở, tự cài, không dùng cookie | ADR 0007 (đang chạy từ 2026-10-15) |
| **GA4** | Google Analytics 4 | Công cụ analytics của Google, dùng cookie `_ga` | ADR 0007 (chưa triển khai) |
| **Cloudflare Web Analytics** | Beacon Cloudflare | Thống kê không cookie và đo Core Web Vitals của khách thật; Cloudflare tự chèn script `beacon.min.js` vào trang | Đang bật trên zone `thehot.vn` (2026-10-14) |

## Hạ tầng và giao hàng

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **Cloudflare proxy** | Đám mây cam | Cloudflare đứng giữa khách và máy chủ: DNS, TLS, cache, chặn bot | Mọi traffic vào `thehot.vn` đi qua Cloudflare |
| **Full (strict)** | Chế độ SSL chặt | Cloudflare kết nối tới máy chủ bằng HTTPS và kiểm chứng chỉ của máy chủ | Máy chủ dùng chứng chỉ Cloudflare Origin CA ([Kiến trúc](../architecture/ARCHITECTURE.md)) |
| **Standalone output** | Bản chạy độc lập | Chế độ build của Next.js gom server và phụ thuộc tối thiểu vào `.next/standalone`, chạy bằng `node server.js` | `output: "standalone"` trong `next.config.ts` |
| **Harbor** | Kho image | Container registry tự cài, lưu image `thehot/web:<commit sha>` | Chạy trên máy CI |
| **Poll** | Hỏi định kỳ | Jenkins tự kiểm GitHub mỗi 5 phút xem `main` có commit mới không | `pollSCM('H/5 * * * *')` |
| **Smoke test** | Kiểm nhanh image | Chạy image vừa build, gọi mọi trang và kiểm sitemap trước khi đẩy lên registry | `ci/smoke-test.sh` |
| **Forced command** | Lệnh bị ép | Khoá SSH chỉ được chạy đúng một lệnh định sẵn trên máy chủ | Jenkins deploy bằng khoá chỉ chạy được script deploy (chi tiết ở `qkenn04/infra-qkenn`) |

## Quy trình và tài liệu

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **ADR** | Bản ghi quyết định kiến trúc | Một file ngắn ghi một quyết định, các phương án đã cân nhắc và hệ quả; không sửa sau khi chấp nhận | Thư mục [adr/](../adr/README.md) |
| **Spec** | Đặc tả tính năng | Hành vi và tiêu chí nghiệm thu của một tính năng | Thư mục `docs/specs/` |
| **Runbook** | Sổ tay xử lý | Các bước làm theo khi gặp một tình huống vận hành | [ops/runbooks/](../ops/runbooks/README.md) |
| **Postmortem** | Phân tích sau sự cố | Ghi lại sự cố theo tinh thần không đổ lỗi: dòng thời gian, nguyên nhân gốc, việc cần làm | [ops/postmortems/](../ops/postmortems/README.md) |
| **Definition of Done** | Điều kiện xong | Danh sách điều kiện để một thay đổi được coi là xong | [Đặc tả sản phẩm](spec.md#8-definition-of-done) |
| **[CẦN XÁC NHẬN: …]** / **Chưa xác định** | Chỗ chưa chắc | Đánh dấu điều chưa biết thay vì đoán; "Chưa xác định — cần chủ quán xác nhận" dùng cho thông tin kinh doanh | `grep -rn "CẦN XÁC NHẬN\|Chưa xác định" docs` |
