# Tài liệu The Hot Beer Garden

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [README repo](../README.md), [AGENTS.md](../AGENTS.md), [Tiến độ](plan/progress.md)

<!-- Trang này là cổng vào của docs/: câu hỏi nào được trả lời ở đâu, và quy ước chung. Giữ ngắn; nội dung nằm ở từng file. Trạng thái dự án KHÔNG chép vào đây, chỉ trỏ tới plan/progress.md. -->

Bộ tài liệu của The Hot Beer Garden theo khung phân tầng: mỗi thư mục trả lời một câu hỏi, mỗi loại thông tin có đúng một nơi là nguồn sự thật. Dự án đang ở đâu: xem [Tiến độ](plan/progress.md).

## Đọc gì trước

| Bạn là | Đọc theo thứ tự |
|---|---|
| Người mới vào dự án | [Đặc tả sản phẩm](product/spec.md) → [Kiến trúc](architecture/ARCHITECTURE.md) → [Mục lục ADR](adr/README.md) → [Lộ trình](plan/roadmap.md) |
| Agent AI hoặc người sắp sửa code | [AGENTS.md](../AGENTS.md) → spec của việc đang làm → [Kiểm thử](dev/testing.md) → [Cấu hình](dev/configuration.md) |
| Người vận hành | [Triển khai](ops/deployment.md) → [Runbook](ops/runbooks/README.md) → [Mô hình đe doạ](security/threat-model.md) |
| Người review một thay đổi | [Definition of Done cho tài liệu](#definition-of-done-cho-tài-liệu) → spec và ADR được link trong PR |

## Bản đồ tài liệu

<!-- Link = file đã có. Đường dẫn dạng `code` = ô của khung chưa có ở dự án này (tuỳ hồ sơ); khi tạo file (chép từ bộ khuôn hoặc chạy lại script với hồ sơ lớn hơn) thì đổi thành link. Xoá hàng không bao giờ dùng. -->

| Câu hỏi | Nơi trả lời | Tầng |
|---|---|---|
| Xây gì, cho ai, vì sao, xong khi nào? | [product/spec.md](product/spec.md): mục tiêu, không làm, tiêu chí nghiệm thu, Definition of Done | T1 |
| Phải tốt tới mức nào? | [product/nfr.md](product/nfr.md): hiệu năng (ngân sách PERF), sẵn sàng, bảo mật, tiếp cận | T1 |
| Từ này nghĩa là gì? | [product/glossary.md](product/glossary.md) | T1\* |
| Hệ thống ra sao? | [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md), [sơ đồ](architecture/diagrams/README.md) (T2); `architecture/data-model.md` (T2); `architecture/principles.md` (T3) | T1 |
| Vì sao chọn vậy? | [adr/](adr/README.md): mỗi quyết định một file | T1 |
| Giao tiếp thế nào? | `api/openapi.yaml`, `api/api.md` | T2 |
| Code, test, cấu hình thế nào? | [dev/testing.md](dev/testing.md), [dev/configuration.md](dev/configuration.md); `dev/design-system.md` (khi có UI); `dev/frontend.md` (cấu trúc front-end, khi có ứng dụng giao diện); `dev/backend-nestjs.md` (mẫu tuỳ chọn khi dùng NestJS); `dev/perf.md` (số đo thật) | T2 |
| Rủi ro bảo mật ở đâu? | [security/threat-model.md](security/threat-model.md) | T2/T3 |
| Làm theo thứ tự nào, tới đâu rồi? | [plan/roadmap.md](plan/roadmap.md), [plan/tasks.md](plan/tasks.md), [plan/progress.md](plan/progress.md) | T2 |
| Từng tính năng làm thế nào? | `specs/NNN-<name>/`: spec.md, plan.md, tasks.md | T2 |
| Đề xuất lớn nào đang bàn? | `design/NNNN-<name>.md` (RFC) | T3 |
| Chạy và xử lý sự cố thế nào? | [ops/deployment.md](ops/deployment.md), [runbook](ops/runbooks/README.md) (T2); [postmortem](ops/postmortems/README.md) sau mỗi sự cố (T1\*). Nếu dùng topic CI/CD: đổi `ops/ci-cd-core.md` và adapter đã chọn thành link sau khi sinh | T2 |

Tầng: **T1** bắt buộc · **T1\*** bắt buộc có điều kiện · **T2** nên có khi dự án có khía cạnh đó · **T3** tuỳ chọn cho dự án lớn.

<!-- Thư mục riêng của dự án (ngoài khung), nếu có, liệt kê ở đây kèm câu hỏi nó trả lời. Ví dụ: content/ (chiến lược nội dung), history/ (nhật ký, bài học). -->

## Quy ước

- **Ngôn ngữ.** Văn xuôi tiếng Việt; tên file, định danh, lệnh, tên sản phẩm và commit message tiếng Anh. Không emoji.
- **Tên file.** ASCII, kebab-case, tiếng Anh: `threat-model.md`, `0007-use-postgres-job-queue.md`. Giữ nguyên chữ hoa theo quy ước chung: `README.md`, `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`.
- **Đầu mỗi file.** `# Tiêu đề`, rồi một dòng metadata `> Trạng thái: … · Cập nhật: YYYY-MM-DD · Liên quan: …`. Đổi ngày `Cập nhật` khi sửa nội dung (sửa link hỏng, chính tả thì không cần).
- **Link** giữa các tài liệu dùng đường dẫn tương đối. Kiểm bằng `python3 scripts/check-links.py .`.
- **Chưa biết** thì ghi `[CẦN XÁC NHẬN: …]`, không đoán. **Ước lượng** luôn ghi "ước lượng thô". **Số liệu** ghi nguồn và "tính tới YYYY-MM-DD".
- **Sơ đồ** viết bằng Mermaid trong Markdown để sửa được bằng tay ([quy ước sơ đồ](architecture/diagrams/README.md)).
- **Công khai được.** Không secret, token, mật khẩu, IP (ngoài loopback), hostname nội bộ, dữ liệu cá nhân, chi tiết lỗ hổng chưa vá.

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
| `PERF-01`, `AVAIL-01`, `SEC-01`, `A11Y-01`, `OPS-01` | Yêu cầu phi chức năng | product/nfr.md |
| `I-01` | Bất biến dữ liệu | architecture/data-model.md |
| `NNN-AC-01`, `NNN-T01` | Tiêu chí nghiệm thu, việc của spec số NNN | specs/NNN-name/ |
| `M0`, `M1`, … | Mốc | plan/roadmap.md |
| `TK01` | Việc cấp dự án | plan/tasks.md |
| `TS1`, `A1`, `T01`, `L1` | Tài sản, tác nhân, đe doạ, lớp bảo vệ | security/threat-model.md |
| `NNNN` (4 số) | ADR, RFC | adr/, design/ |
| `NNN` (3 số) | Spec, runbook, postmortem | specs/, ops/runbooks/, ops/postmortems/ |

## Definition of Done cho tài liệu

Một thay đổi chỉ xong khi tài liệu tương ứng đã sửa **trong cùng PR**. Bản dạng checklist nằm trong mẫu PR `.github/pull_request_template.md`.

| Khi thay đổi | Cập nhật |
|---|---|
| Hành vi người dùng thấy | Spec của tính năng (`specs/NNN-<name>/spec.md`) hoặc [product/spec.md](product/spec.md); tiêu chí nghiệm thu khớp test |
| Quyết định kiến trúc, chọn hoặc bỏ công nghệ | ADR mới từ [mẫu](adr/0000-template.md); ADR cũ chuyển "Đã thay thế"; [mục lục ADR](adr/README.md) |
| Biến môi trường, cờ cấu hình | [dev/configuration.md](dev/configuration.md) và `.env.example` (chỉ tên biến) |
| Endpoint, hợp đồng API | `api/openapi.yaml` và `api/api.md` |
| Schema, migration | `architecture/data-model.md` |
| Thành phần, luồng, ranh giới | [ARCHITECTURE.md](architecture/ARCHITECTURE.md) và sơ đồ liên quan |
| Cách deploy, hạ tầng, thao tác vận hành | [ops/deployment.md](ops/deployment.md), runbook liên quan |
| Bề mặt tấn công, bí mật, quyền | [security/threat-model.md](security/threat-model.md) |
| Ngân sách hoặc số đo hiệu năng | [product/nfr.md](product/nfr.md) (ngân sách), `dev/perf.md` (số đo) |
| Giao diện, design token | `dev/design-system.md` |
| Cấu trúc thư mục front-end, luật import giữa các tầng | `dev/frontend.md` |
| Cấu trúc module NestJS, luật phụ thuộc giữa các feature | `dev/backend-nestjs.md` khi dùng NestJS |
| Thuật ngữ mới | [product/glossary.md](product/glossary.md) |
| Cách test, lệnh test | [dev/testing.md](dev/testing.md) |
| Xong việc, đổi mốc | [plan/progress.md](plan/progress.md), [plan/tasks.md](plan/tasks.md), `tasks.md` của spec |
| Sự cố P1/P2 đã xử lý | Postmortem từ [mẫu](ops/postmortems/000-template.md); sửa runbook nếu thiếu bước |
| Mọi thay đổi tài liệu | Ngày `Cập nhật`; link tương đối; `check-links.py` sạch; không secret |

File đích chưa có ở dự án này: ghi vào mục gần nhất trong tài liệu đang có, rồi tách file khi đủ điều kiện ở [quy tắc tách file](#quy-tắc-tách-file).

## Quy tắc tách file

Một mục trong README (hoặc trong file khác) được tách thành file riêng, đúng ô của khung, khi:

1. mục đó dài quá khoảng 80 dòng, **hoặc**
2. tài liệu khác cần link tới nó.

Khi tách: chép file mẫu từ bộ khuôn (docs-template) để có đủ mục; ở chỗ cũ để lại một câu tóm tắt và link; thêm file vào [Bản đồ tài liệu](#bản-đồ-tài-liệu).

## Cách giữ tài liệu sống

| Khi | Làm gì |
|---|---|
| Mỗi PR | Theo [Definition of Done cho tài liệu](#definition-of-done-cho-tài-liệu); CI chạy `python3 scripts/check-links.py .` |
| Đóng một mốc | Cập nhật [Tiến độ](plan/progress.md); rà quyết định nào chưa thành ADR, chỗ `[CẦN XÁC NHẬN]` nào đã có câu trả lời |
| Mỗi tháng hoặc mỗi mốc | Liệt kê file theo ngày cập nhật (lệnh dưới); file cũ mà code liên quan đã đổi thì sửa hoặc chuyển "Lưu trữ" |
| Có sự cố P1/P2 | Postmortem trong 5 ngày làm việc; sửa runbook |
| Tính năng hoặc hệ thống ngừng | Chuyển tài liệu sang "Lưu trữ"; không xoá |

```bash
# Liệt kê file tài liệu theo ngày "Cập nhật", cũ nhất trước
grep -rHo --include='*.md' 'Cập nhật: [0-9-]*' docs | sed 's/:Cập nhật: / /' | sort -k2 | head -n 20
```
