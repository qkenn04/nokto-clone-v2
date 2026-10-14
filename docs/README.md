# Tài liệu The Hot Beer Garden (thehot.vn)

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-15 · Liên quan: [README repo](../README.md), [AGENTS.md](../AGENTS.md), [Đặc tả sản phẩm](product/spec.md), [Kiến trúc](architecture/ARCHITECTURE.md)

Bộ tài liệu của website https://thehot.vn, trang chính thức của quán The Hot Beer Garden Đà Lạt. Site là một ứng dụng Next.js 16 dựng từ bản clone template NOKTO, đã thay nội dung bằng nội dung thật của quán từ 2026-10-13. Tài liệu theo khung phân tầng của docs-template (hồ sơ STANDARD): mỗi thư mục trả lời một câu hỏi, mỗi loại thông tin có đúng một nơi là nguồn sự thật.

**Repo này công khai.** Tài liệu chỉ mô tả hạ tầng ở mức đã thấy trong `Jenkinsfile`; địa chỉ máy chủ, cổng nội bộ, đường dẫn trên máy chủ, tên bí mật, quy trình quản trị và sao lưu nằm ở repo riêng tư `qkenn04/infra-qkenn`.

## Đọc gì trước

| Bạn là | Đọc theo thứ tự |
|---|---|
| Người mới vào dự án | [Đặc tả sản phẩm](product/spec.md) → [Kiến trúc](architecture/ARCHITECTURE.md) → [Mục lục ADR](adr/README.md) → [Kế hoạch và spec](#kế-hoạch-và-spec-tính-năng) |
| Agent AI hoặc người sắp sửa code | [AGENTS.md](../AGENTS.md) → spec của việc đang làm → [Front-end](dev/frontend.md) → [Mô hình dữ liệu nội dung](architecture/data-model.md) → [Kiểm thử](dev/testing.md) → [Cấu hình](dev/configuration.md) |
| Người vận hành | [Triển khai](ops/deployment.md) → [Runbook](ops/runbooks/README.md) → [Mô hình đe doạ](security/threat-model.md) |
| Người review một thay đổi | [Definition of Done cho tài liệu](#definition-of-done-cho-tài-liệu) → spec và ADR được link trong PR |
| Chủ quán, người quản lý nội dung | [Đặc tả sản phẩm](product/spec.md) (mục "Câu hỏi mở") → [Kế hoạch và spec](#kế-hoạch-và-spec-tính-năng) |

## Bản đồ tài liệu

| Câu hỏi | Nơi trả lời | Tầng |
|---|---|---|
| Xây gì, cho ai, vì sao, xong khi nào? | [product/spec.md](product/spec.md): mục tiêu, không làm, tiêu chí nghiệm thu, Definition of Done | T1 |
| Phải tốt tới mức nào? | [product/nfr.md](product/nfr.md): ngân sách hiệu năng (Core Web Vitals), SEO, riêng tư, sẵn sàng, bảo mật | T1 |
| Từ này nghĩa là gì? | [product/glossary.md](product/glossary.md) | T1\* |
| Hệ thống ra sao? | [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md), [quy ước sơ đồ](architecture/diagrams/README.md), [mô hình dữ liệu nội dung](architecture/data-model.md) | T1 |
| Vì sao chọn vậy? | [adr/](adr/README.md): mỗi quyết định một file | T1 |
| Code, test, cấu hình thế nào? | [dev/frontend.md](dev/frontend.md), [dev/testing.md](dev/testing.md), [dev/configuration.md](dev/configuration.md), [dev/perf.md](dev/perf.md) (số đo thật), [dev/commit-conventions.md](dev/commit-conventions.md) | T2 |
| Rủi ro bảo mật và riêng tư ở đâu? | [security/threat-model.md](security/threat-model.md) | T2 |
| Làm theo thứ tự nào, tới đâu rồi? Từng tính năng làm thế nào? | [Kế hoạch và spec tính năng](#kế-hoạch-và-spec-tính-năng) (`docs/plan/`, `docs/specs/`) | T2 |
| Code đi lên production thế nào, lùi lại thế nào? | [ops/deployment.md](ops/deployment.md); chính sách CI/CD: [ops/ci-cd-core.md](ops/ci-cd-core.md), [Jenkins + registry](ops/providers/jenkins-registry.md), [VPS + Docker Compose](ops/runtimes/vps-docker-compose.md) | T2 |
| Xử lý sự cố thế nào? | [Runbook](ops/runbooks/README.md) (T2); [postmortem](ops/postmortems/README.md) sau mỗi sự cố P1/P2 (T1\*) | T2 |

Tầng: **T1** bắt buộc · **T1\*** bắt buộc có điều kiện · **T2** nên có khi dự án có khía cạnh đó. Ô không dùng ở dự án này: `api/` (site không có API), `dev/design-system.md` (token nằm trong `src/app/globals.css`, chưa tách tài liệu), `design/` (RFC, T3).

### Kế hoạch và spec tính năng

Lộ trình, việc và tiến độ cấp dự án, cùng spec của từng tính năng, được viết trên một nhánh riêng:

- Kế hoạch: [Lộ trình](plan/roadmap.md) · [Việc](plan/tasks.md) · [Tiến độ](plan/progress.md)
- Spec: [001 Sitemap tự động](specs/001-sitemap-automation/) · [002 SEO trên trang](specs/002-onpage-seo/) · [003 Hiệu năng](specs/003-performance/) · [004 Analytics](specs/004-analytics/)

Trạng thái dự án (mốc nào xong, việc nào đang làm) chỉ ghi ở `docs/plan/progress.md`, không chép vào các file khác.

### Thư mục riêng của dự án (ngoài khung)

| Thư mục | Trả lời câu hỏi | Ghi chú |
|---|---|---|
| [archify/](archify/nokto-architecture.html) | Sơ đồ trình bày (HTML) của kiến trúc và luồng CI/CD; [luồng CI/CD](archify/nokto-cicd.html) | Cập nhật lần cuối 2026-10-13, trước khi đổi domain: còn ghi `thehot.k2-tech.dev` và header `noindex`. Bản đúng hiện tại là Mermaid trong [ARCHITECTURE.md](architecture/ARCHITECTURE.md). Sửa file `*.json` cạnh HTML rồi chạy lại Archify (lệnh trong [README repo](../README.md#cicd)) |
| [research/nokto/brief.md](research/nokto/brief.md) | Ghi chép khảo sát template NOKTO lúc dựng bản clone (2026-10-10) | Lịch sử; nội dung site hiện nay là của The Hot |
| [design-references/nokto/](design-references/nokto/) | Ảnh chụp template NOKTO gốc để so sánh lúc clone | Ảnh thuộc chủ template; chỉ dùng để tham chiếu, không đưa lên site |

## Quy ước

- **Ngôn ngữ.** Văn xuôi tiếng Việt; tên file, định danh, lệnh, tên sản phẩm và commit message tiếng Anh ([quy ước commit](dev/commit-conventions.md)). Không emoji. `README.md`, `CONTRIBUTING.md` và `SECURITY.md` ở gốc repo giữ tiếng Anh.
- **Tên file.** ASCII, kebab-case, tiếng Anh: `threat-model.md`, `0004-automate-sitemap-from-page-config-and-git.md`. Giữ nguyên chữ hoa quen thuộc: `README.md`, `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`.
- **Đầu mỗi file.** `# Tiêu đề`, rồi một dòng metadata `> Trạng thái: … · Cập nhật: YYYY-MM-DD · Liên quan: …`. Đổi ngày `Cập nhật` khi sửa nội dung (sửa link hỏng, chính tả thì không cần).
- **Link** giữa các tài liệu dùng đường dẫn tương đối. Kiểm bằng `python3 scripts/check-links.py .` (xem [Kiểm thử](dev/testing.md#2-lệnh)).
- **Chưa biết** thì không đoán: chi tiết kỹ thuật ghi `[CẦN XÁC NHẬN: …]`; thông tin kinh doanh của quán (giờ mở cửa, nhạc sống, lịch sự kiện…) ghi "Chưa xác định — cần chủ quán xác nhận". **Ước lượng** ghi "ước lượng thô". **Số liệu** ghi nguồn và "tính tới YYYY-MM-DD".
- **Sơ đồ** viết bằng Mermaid trong Markdown để sửa được bằng tay ([quy ước sơ đồ](architecture/diagrams/README.md)).
- **Công khai được.** Không secret, token, mật khẩu, IP, hostname nội bộ, cổng nội bộ, đường dẫn trên máy chủ, tên bí mật trong CI, dữ liệu cá nhân, chi tiết lỗ hổng chưa vá. Những thứ đó thuộc `qkenn04/infra-qkenn`.

### Trạng thái tài liệu

| Trạng thái | Nghĩa | Người đọc làm gì |
|---|---|---|
| Nháp | Đang viết, chưa dùng để ra quyết định | Góp ý; chưa làm theo |
| Đề xuất | Viết xong, chờ người có quyền chốt | Góp ý; chưa phải luật |
| Đang áp dụng | Là sự thật hiện tại | Làm theo; code lệch tài liệu là lỗi của một trong hai bên |
| Đã thay thế | Có tài liệu mới thay; dòng metadata link tới tài liệu thay thế | Chỉ đọc làm lịch sử |
| Lưu trữ | Thứ nó mô tả đã ngừng hoặc bị bác, không có tài liệu thay | Chỉ đọc làm lịch sử; không sửa nội dung |

### Mã định danh

| Mã | Dùng cho | Nơi định nghĩa |
|---|---|---|
| `G1`, `NG1` | Mục tiêu, điều không làm | product/spec.md |
| `AC-01` | Tiêu chí nghiệm thu cấp sản phẩm | product/spec.md |
| `PERF-01`, `SEO-01`, `PRIV-01`, `AVAIL-01`, `SEC-01`, `A11Y-01`, `OPS-01` | Yêu cầu phi chức năng | product/nfr.md |
| `I-01` | Bất biến của dữ liệu nội dung | architecture/data-model.md |
| `NNN-AC-01`, `NNN-T01` | Tiêu chí nghiệm thu, việc của spec số NNN | specs/NNN-name/ |
| `M0`, `M1`, … | Mốc | plan/roadmap.md |
| `TK01` | Việc cấp dự án | plan/tasks.md |
| `TS1`, `A1`, `T01`, `L1` | Tài sản, tác nhân, đe doạ, lớp bảo vệ | security/threat-model.md |
| `NNNN` (4 số) | ADR | adr/ |
| `NNN` (3 số) | Spec, runbook, postmortem | specs/, ops/runbooks/, ops/postmortems/ |

## Definition of Done cho tài liệu

Một thay đổi chỉ xong khi tài liệu tương ứng đã sửa **trong cùng PR**. Bản dạng checklist nằm trong mẫu PR `.github/PULL_REQUEST_TEMPLATE.md`.

| Khi thay đổi | Cập nhật |
|---|---|
| Hành vi người dùng thấy | Spec của tính năng (`specs/NNN-<name>/spec.md`) hoặc [product/spec.md](product/spec.md); tiêu chí nghiệm thu khớp cách kiểm |
| Quyết định kiến trúc, chọn hoặc bỏ công nghệ, dịch vụ ngoài | ADR mới từ [mẫu](adr/0000-template.md); ADR cũ chuyển "Đã thay thế"; [mục lục ADR](adr/README.md) |
| Biến môi trường, build arg | [dev/configuration.md](dev/configuration.md) |
| Hình dạng dữ liệu nội dung (`site.ts`, menu, sự kiện, ảnh), `seo/sitemap-pages.json` | [architecture/data-model.md](architecture/data-model.md) |
| Thành phần, luồng, ranh giới | [ARCHITECTURE.md](architecture/ARCHITECTURE.md) và sơ đồ liên quan |
| Cách deploy, CI, hạ tầng, thao tác vận hành | [ops/deployment.md](ops/deployment.md), runbook liên quan; chi tiết máy chủ sửa ở `qkenn04/infra-qkenn` |
| Bề mặt tấn công, bên thứ ba (script, beacon), bí mật, quyền | [security/threat-model.md](security/threat-model.md); trang `/privacy` khi thêm bên thứ ba nhận dữ liệu khách |
| Ngân sách hoặc số đo hiệu năng | [product/nfr.md](product/nfr.md) (ngân sách), [dev/perf.md](dev/perf.md) (số đo) |
| Cấu trúc thư mục front-end, luật import | [dev/frontend.md](dev/frontend.md) |
| Thuật ngữ mới | [product/glossary.md](product/glossary.md) |
| Cách kiểm, lệnh kiểm | [dev/testing.md](dev/testing.md) |
| Xong việc, đổi mốc | `plan/progress.md`, `plan/tasks.md`, `tasks.md` của spec |
| Sự cố P1/P2 đã xử lý | Postmortem từ [mẫu](ops/postmortems/000-template.md); sửa runbook nếu thiếu bước |
| Mọi thay đổi tài liệu | Ngày `Cập nhật`; link tương đối; `check-links.py` sạch; không secret, không chi tiết hạ tầng riêng |

## Quy tắc tách file

Một mục trong README (hoặc trong file khác) được tách thành file riêng, đúng ô của khung, khi:

1. mục đó dài quá khoảng 80 dòng, **hoặc**
2. tài liệu khác cần link tới nó.

Khi tách: chép file mẫu từ bộ khuôn (docs-template) để có đủ mục; ở chỗ cũ để lại một câu tóm tắt và link; thêm file vào [Bản đồ tài liệu](#bản-đồ-tài-liệu).

## Cách giữ tài liệu sống

| Khi | Làm gì |
|---|---|
| Mỗi PR | Theo [Definition of Done cho tài liệu](#definition-of-done-cho-tài-liệu); chạy lệnh kiểm link ở mục [Quy ước](#quy-ước) trên máy (Jenkins chưa chạy lệnh này, vì `.dockerignore` loại `docs/` khỏi bước Check) |
| Đóng một mốc | Cập nhật `plan/progress.md`; rà quyết định nào chưa thành ADR, chỗ `[CẦN XÁC NHẬN]` và "Chưa xác định" nào đã có câu trả lời |
| Mỗi tháng hoặc mỗi mốc | Liệt kê file theo ngày cập nhật (lệnh dưới); file cũ mà code liên quan đã đổi thì sửa hoặc chuyển "Lưu trữ" |
| Có sự cố P1/P2 | Postmortem trong 5 ngày làm việc; sửa runbook |
| Tính năng hoặc hệ thống ngừng | Chuyển tài liệu sang "Lưu trữ"; không xoá |

```bash
# Liệt kê file tài liệu theo ngày "Cập nhật", cũ nhất trước
grep -rHo --include='*.md' 'Cập nhật: [0-9-]*' docs | sed 's/:Cập nhật: / /' | sort -k2 | head -n 20

# Tìm chỗ còn chờ trả lời
grep -rn 'CẦN XÁC NHẬN\|Chưa xác định' docs
```
