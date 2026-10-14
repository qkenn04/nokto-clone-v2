# Runbook

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mẫu runbook](000-template.md), [Triển khai](../deployment.md), [Cấu hình](../../dev/configuration.md), [Postmortem](../postmortems/README.md)

Mỗi runbook là một tình huống, viết để làm theo từng bước khi đang căng thẳng: dấu hiệu, kiểm nhanh, xử lý, khi nào coi là xong. Runbook ở repo công khai này chỉ ghi phần thuộc về site và pipeline; thao tác trên máy chủ (đường dẫn, tên dịch vụ, lệnh quản trị) nằm ở runbook của `qkenn04/infra-qkenn`.

## 1. Bảng tra nhanh

| Thấy gì | Runbook |
|---|---|
| Mọi build Jenkins hỏng ngay ở checkout với `object file … is empty` sau khi máy CI tắt đột ngột | [001](001-jenkins-git-cache-corrupted.md) |
| Bản mới lên production chạy được nhưng sai (giao diện, nội dung, SEO) | [Triển khai, mục 7: Revert PR](../deployment.md#7-rollback) |
| Deploy báo thất bại, VPS đã tự quay về bản cũ | Xem log build Jenkins và log container (repo infra); sửa bằng PR mới |
| Site không vào được (lỗi 5xx từ Cloudflare) | Runbook của stack trên VPS ở `qkenn04/infra-qkenn` |
| Build hỏng ở stage Sitemap dates vì shallow clone hoặc đường dẫn chưa có commit | Thông báo lỗi của `ci/sitemap-lastmod.sh` ghi cách sửa; [ADR 0004](../../adr/0004-automate-sitemap-from-page-config-and-git.md) |

## 2. Quy ước chung

### 2.1 Mức độ

| Mức | Nghĩa | Phản ứng |
|---|---|---|
| P1 | Khách không vào được site, thông tin sai gây hại (hotline, địa chỉ), nghi bị xâm nhập | Làm ngay. Cầm máu trước (lùi image, revert), tìm nguyên nhân sau |
| P2 | Không deploy được, pipeline hỏng, chức năng quan trọng hỏng (nút liên hệ, menu) | Trong ngày |
| P3 | Cảnh báo sớm, lỗi không ảnh hưởng khách | Trong tuần |

### 2.2 Chạy lệnh ở đâu

- Mỗi runbook ghi rõ lệnh chạy trên máy nào.
- Kiểm URL công khai từ máy cá nhân, không từ chính máy chủ.
- Không dán output có bí mật vào chat hay issue.
- Agent AI làm theo runbook phải dừng và hỏi trước mọi bước xoá, ghi đè hay thay đổi máy CI, VPS hoặc Jenkins.

### 2.3 Biến dùng chung

Đường dẫn trên máy CI và VPS không ghi ở repo này. Runbook dùng biến shell (`JENKINS_HOME`, `JOB_WORKSPACE`, …) kèm dòng kiểm `: "${VAR:?…}"`; giá trị lấy từ tài liệu `ci/` và `stacks/` của repo infra.

## 3. Mục lục

| Số | Tình huống | Mức | Diễn tập lần cuối |
|---|---|---|---|
| [000](000-template.md) | Mẫu | — | — |
| [001](001-jenkins-git-cache-corrupted.md) | Cache git của Jenkins hỏng sau khi máy CI tắt đột ngột | P2 | 2026-10-14 (sự cố thật) |

## 4. Sau mỗi sự cố P1 hoặc P2

1. Viết postmortem từ [mẫu](../postmortems/000-template.md) trong 5 ngày làm việc.
2. Runbook sai hoặc thiếu bước: sửa trong cùng ngày.
3. Tình huống chưa có runbook: viết runbook mới từ [mẫu](000-template.md).

## 5. Cách viết runbook mới

1. Copy [000-template.md](000-template.md) thành `NNN-<name>.md` (3 chữ số, tiếng Anh kebab-case).
2. Đổi trạng thái thành `Nháp`, xoá dòng marker `check-links: template`, điền các mục.
3. Thêm vào bảng tra nhanh (mục 1) và mục lục (mục 3).
4. Diễn tập một lần trên môi trường an toàn, ghi ngày vào mục lục, rồi chuyển `Đang áp dụng`.
