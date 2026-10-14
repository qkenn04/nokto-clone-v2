# Front-end: cấu trúc và quy ước

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [Kiến trúc](../architecture/ARCHITECTURE.md), [Mô hình dữ liệu nội dung](../architecture/data-model.md), [Kiểm thử](testing.md), [Số đo hiệu năng](perf.md), [AGENTS.md](../../AGENTS.md)

Site là một ứng dụng Next.js 16 (App Router, React 19, TypeScript strict, Tailwind CSS 4) không có API, không có state phía server. File này trả lời: file mới đặt ở đâu, module nào được import module nào, và các quy tắc đã rút ra từ những lần sửa trước. Mẫu front-end lớn của docs-template (React có API, state) không áp dụng cho site này. Tính tới 2026-10-15.

**Next.js 16 khác nhiều so với bản cũ.** Trước khi viết code, đọc hướng dẫn trong `node_modules/next/dist/docs/` như [AGENTS.md](../../AGENTS.md) yêu cầu.

## 1. Cây thư mục `src/`

```text
src/
├── app/                          route: page.tsx mỗi trang, layout.tsx, sitemap.ts, robots.ts, error.tsx, not-found.tsx,
│                                 icon, ảnh Open Graph/Twitter, globals.css (design token), fonts.css
├── components/
│   ├── analytics/                ClickTracker (một listener click đọc data-track*), UmamiScript (next/script; không
│   │                             render khi build thiếu Website ID) — spec 004
│   ├── sites/nokto/              khung và trang dựng từ template NOKTO (nội dung đã là của The Hot)
│   │   ├── site.ts               thông tin quán: nguồn sự thật của tên, địa chỉ, hotline, giờ
│   │   ├── ui.tsx, motion.ts     primitive (Section, Heading, Text, Stack, ButtonLink, cx) và giá trị hiệu ứng dùng chung
│   │   ├── chrome/               khung mọi trang: menu điều hướng, Backdrop, BrandMark, Preloader, PageTransition,
│   │   │                         SmoothScroll (Lenis), CustomCursor, SiteFooter, FixedPhoto, FixedVideo
│   │   └── home/, menu/, about/, reservation/, legal/   component và module dữ liệu của từng trang; menu/ có
│   │                             MenuTabs (tab "Món ăn chơi" / "Premium", dùng chung cho bảng giá và sách lật)
│   ├── sites/the-hot/            phần làm riêng cho The Hot: HeroVideo, BeerPour, FloatingContact, MenuBook (sách lật
│   │                             hai tab; mỗi tab một FlipBook mới), menuPages.ts (menuBooks), videos.ts,
│   │                             home/ (gallery, dòng sự kiện, lightbox, dữ liệu trang chủ)
│   └── ui/                       primitive shadcn/ui (button)
├── lib/utils.ts                  cn() của shadcn
├── lib/analytics.ts              track(), trackAttrs(), danh sách thuộc tính cho phép, UMAMI_WEBSITE_ID (spec 004)
├── seo/                          page-meta.ts (tiêu đề, mô tả), sitemap-images.ts (sitemap ảnh)
└── generated/                    sitemap-lastmod.json do CI sinh (git-ignored)
```

Tên thư mục `nokto` là dấu vết lịch sử của template, không phải thương hiệu. Phần mới làm riêng cho quán đặt ở `the-hot/`; sửa phần có sẵn thì sửa tại chỗ trong `nokto/`, không chép sang. Tài sản tĩnh: `public/sites/the-hot-beer-garden/` (của quán), `public/sites/nokto/` (của template, chỉ còn ảnh nền và vài SVG được dùng, xem [ADR 0003](../adr/0003-allow-search-indexing.md)).

## 2. Luật phụ thuộc

| Từ | Được import | Không import |
|---|---|---|
| `src/app/**` | Component trong `components/`, `src/seo/*`, module dữ liệu | — |
| Component trong `components/sites/**` | Module dữ liệu, primitive (`nokto/ui.tsx`, `components/ui`), component khác trong `sites/`, `src/lib/analytics.ts` | `src/app/**` |
| Module dữ liệu (`site.ts`, `content.ts`, `data.ts`, `menuPages.ts`, `videos.ts`, `events.ts`) | Module dữ liệu khác, helper `hotImage`/`siteImage`, `UMAMI_WEBSITE_ID` của `src/lib/analytics.ts` | Component React; module có `"use client"` |
| `src/lib/analytics.ts` | Không import gì của site (TS thuần, không `"use client"`) | Mọi thứ trong `components/`, `src/app/**` |
| `src/seo/*`, `src/app/sitemap.ts` | Module dữ liệu, `seo/sitemap-pages.json` | Component có `"use client"` |

Chưa có lint rule nào chặn các luật trên; giữ bằng review. Quy tắc quan trọng nhất là hàng thứ ba: giá trị export từ file `"use client"` chỉ là client reference khi code phía server import, nên dữ liệu mà sitemap hay metadata cần phải nằm trong module thường (lý do `menuPages.ts` được tách khỏi `MenuBook.tsx` ở PR #3).

## 3. Quy tắc đã rút ra

1. **Trang mỏng.** `page.tsx` chỉ khai `metadata` bằng `pageMetadata(path)` và ghép component; chữ hiển thị nằm trong module dữ liệu của trang.
2. **Thêm route** thì cùng PR: khai trong `seo/sitemap-pages.json` (bước Check báo lỗi nếu quên), thêm tiêu đề và mô tả vào `src/seo/page-meta.ts`, thêm đường dẫn vào danh sách của `ci/smoke-test.sh`.
3. **Class:** trong component của `sites/` dùng `cx` của `nokto/ui.tsx`, không dùng `cn`: tailwind-merge trong `cn` bỏ mất `text-h1` khi đi cùng `text-muted` (hai class token tuỳ biến bị coi là xung đột).
4. **Ảnh:** dùng `next/image` với `sizes` khớp kích thước hiển thị. Ảnh đã đo là phần tử LCP dùng `loading="eager"` + `fetchPriority="high"` (prop `priority` của `Backdrop`) thay cho `preload`, vì link preload mà `preload` sinh ra không mang mức ưu tiên ([ADR 0006](../adr/0006-prioritize-lcp-with-fetchpriority.md)). Các ảnh lớn khác còn dùng `preload` (`FixedPhoto`, poster của `FixedVideo`, `HeroPhoto`, trang đầu của `MenuBook`) chưa được đo lại; đổi theo ADR 0006 khi số đo của trang đó cho thấy cần. `unoptimized` chỉ dùng cho trình xem toàn màn hình (lightbox, trang đọc của menu sách lật) và SVG trang trí (đường timeline trong `AboutBody`), nơi tối ưu ảnh không có lợi.
5. **Hiệu ứng:** tôn trọng `prefers-reduced-motion` (`useReducedMotion` của `motion/react`; với video dùng `useMediaQuery` của `FixedVideo`, theo dõi liên tục). Hiệu ứng ở màn hình đầu ưu tiên CSS để chạy ngay từ lần vẽ đầu; trên điện thoại hydrate có thể đến chậm vài giây.
6. **Thời gian hiện tại** không đọc lúc render phía server: dùng `useSyncExternalStore` với snapshot server là `null` (như `EventTimeline.tsx`), tránh lệch hydrate.
7. **File trong `public/`:** đổi nội dung thì đổi tên file, để cache trình duyệt và Cloudflare không giữ bản cũ. Ví dụ: video hero `main.mp4` thành `main.v2.av1.mp4` và `main.v2.720.mp4` (PR #16).
8. **Không gửi dữ liệu khách đi đâu:** form đặt bàn chỉ dùng state React ([Đặc tả, NG2](../product/spec.md#5-không-làm)); thêm bất kỳ request mạng nào chứa dữ liệu khách cần ADR mới.
9. **Sự kiện analytics** ([spec 004](../specs/004-analytics/spec.md)): link và nút gắn `{...trackAttrs("tên", { … })}` (dùng được trong Server Component, `ClickTracker` gửi khi bấm); sự kiện trạng thái (form xong, mở poster, đổi tab menu) gọi `track()` trong Client Component. Không dùng `data-umami-event` (tracker Umami chặn click rồi tự chuyển trang, làm trang tải lại và màn hình chờ chạy lại). Khoá thuộc tính ngoài danh sách cho phép bị bỏ trước khi gửi; thêm khoá hay sự kiện thì sửa spec 004 và `src/lib/analytics.ts` cùng PR.
10. **Video:** HTML từ server không có nguồn video (`<video preload="none">` không `src`, không `<source>`); poster `next/image` nằm dưới và hiện ngay. Phía trình duyệt mới gắn `<source>` (mẫu `FixedVideo`; `HeroVideo` còn chờ sự kiện `load`, màn hình chờ rời đi và lúc rảnh, rồi chọn AV1 hay H.264 bằng `navigator.mediaCapabilities`), đặt `muted = true` trước `play()`, chỉ hiện lớp video khi `playing`. Gỡ nguồn rồi gọi `load()` khi unmount để huỷ tải. Thuộc tính `type` ghi đúng chuỗi codec lấy bằng `ffprobe`, kể cả codec âm thanh ([ADR 0008](../adr/0008-compress-hero-video-without-trimming.md)).

## 4. Quy ước code

Theo [AGENTS.md](../../AGENTS.md): TypeScript strict, không `any`; named export; component PascalCase, tiện ích camelCase; thụt lề 2 dấu cách; ưu tiên Tailwind hoặc CSS module, tránh style nội dòng trừ khi giá trị phải tính lúc chạy; thiết kế cho điện thoại trước.

## 5. Kiểm

`npm run lint` (ESLint 9 với `eslint-config-next` core-web-vitals và TypeScript, gồm luật React Hooks) và `npm run typecheck`. Chi tiết: [Kiểm thử](testing.md).
