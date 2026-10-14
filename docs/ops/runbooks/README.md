# Runbook

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mẫu runbook](000-template.md), [Triển khai](../deployment.md), [Cấu hình](../../dev/configuration.md), [Postmortem](../postmortems/README.md)

<!--
Mỗi runbook là một tình huống, viết để làm theo từng bước khi đang căng thẳng: dấu hiệu, kiểm nhanh, xử lý, khi nào coi là xong.
File này là bảng tra và quy ước chung. Runbook chưa diễn tập lần nào coi như chưa đáng tin.
-->

## 1. Bảng tra nhanh

| Thấy gì | Runbook |
|---|---|
| *Ví dụ:* ứng dụng lỗi ngay sau một lần deploy | `001-rollback-release.md` |
| *Ví dụ:* cảnh báo đĩa sắp đầy | `002-disk-full.md` |
| *Ví dụ:* cần đổi một bí mật (định kỳ hoặc vì lộ) | `003-rotate-secret.md` |
| *Ví dụ:* nghi bị xâm nhập hoặc lộ dữ liệu | `004-suspected-breach.md` |

<!-- Khi tạo file runbook thật, đổi tên file trong bảng thành link. -->

## 2. Quy ước chung

### 2.1 Mức độ

| Mức | Nghĩa | Phản ứng |
|---|---|---|
| P1 | Người dùng không dùng được, dữ liệu mất hoặc lộ, nghi bị xâm nhập | Làm ngay. Cầm máu trước (rollback, dừng dịch vụ), tìm nguyên nhân sau |
| P2 | Chức năng quan trọng hỏng, deploy hoặc sao lưu hỏng | Trong ngày |
| P3 | Cảnh báo sớm, lỗi không ảnh hưởng người dùng | Trong tuần |

### 2.2 Chạy lệnh ở đâu

- Mỗi runbook ghi rõ lệnh chạy trên máy nào, bằng người dùng nào.
- Kiểm URL công khai từ bên ngoài (máy cá nhân), không từ chính máy chủ.
- Không dán output có bí mật vào chat hay issue; xem tên biến thay vì giá trị.
- Agent AI làm theo runbook phải dừng và hỏi trước mọi bước xoá, ghi đè hay thay đổi môi trường thật.

### 2.3 Biến và hàm dùng chung

```bash
# Ví dụ: dán vào shell trước khi làm theo runbook (thay bằng giá trị thật, không có bí mật)
APP_DIR=<thư mục deploy>
dc() { docker compose --project-directory "$APP_DIR" -f "$APP_DIR/compose.yml" "$@"; }
```

## 3. Mục lục

| Số | Tình huống | Mức | Diễn tập lần cuối |
|---|---|---|---|
| [000](000-template.md) | Mẫu | — | — |

## 4. Sau mỗi sự cố P1 hoặc P2

1. Viết postmortem từ [mẫu](../postmortems/000-template.md) trong 5 ngày làm việc.
2. Runbook sai hoặc thiếu bước: sửa trong cùng ngày.
3. Tình huống chưa có runbook: viết runbook mới từ [mẫu](000-template.md).

## 5. Cách viết runbook mới

1. Copy [000-template.md](000-template.md) thành `NNN-<name>.md` (3 chữ số, tiếng Anh kebab-case).
2. Đổi trạng thái thành `Nháp`, xoá dòng marker `check-links: template`, điền các mục.
3. Thêm vào bảng tra nhanh (mục 1) và mục lục (mục 3).
4. Diễn tập một lần trên môi trường an toàn, ghi ngày vào mục lục, rồi chuyển `Đang áp dụng`.
