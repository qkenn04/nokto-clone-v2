# Postmortem NNN: <Tóm tắt sự cố trong một cụm từ>

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mục lục postmortem](README.md), [Runbook NNN](../runbooks/NNN-<name>.md), [ADR NNNN](../../adr/NNNN-<name>.md)

<!-- check-links: template -->

<!--
MẪU. Khi dùng: copy thành NNN-<name>.md; đổi Trạng thái thành "Nháp"; xoá dòng "check-links: template"; thay mọi placeholder.
Không đổ lỗi; mọi mốc giờ có múi giờ; mọi khẳng định có bằng chứng (log, lệnh, commit).
-->

## 1. Tóm tắt

| Mục | Giá trị |
|---|---|
| Ngày | YYYY-MM-DD |
| Mức | P1 / P2 |
| Bắt đầu ảnh hưởng | YYYY-MM-DD HH:MM (múi giờ) |
| Phát hiện | YYYY-MM-DD HH:MM, bởi <cảnh báo, người dùng, tình cờ> |
| Khắc phục (cầm máu) | YYYY-MM-DD HH:MM |
| Xử lý xong | YYYY-MM-DD HH:MM |
| Ảnh hưởng | <ai, bao nhiêu, mất gì; dữ liệu có mất không> |
| Người xử lý | <vai trò> |

<2–3 câu: chuyện gì xảy ra, vì sao, đã sửa thế nào.>

## 2. Dòng thời gian

| Thời điểm | Sự kiện | Bằng chứng |
|---|---|---|
| HH:MM | <…> | <log, lệnh, commit> |

## 3. Ảnh hưởng

<Người dùng thấy gì; số liệu (request lỗi, thời gian gián đoạn, dữ liệu ảnh hưởng); điều KHÔNG bị ảnh hưởng.>

## 4. Nguyên nhân

### 4.1 Nguyên nhân trực tiếp

<…>

### 4.2 Nguyên nhân gốc

<!-- Hỏi "vì sao" nhiều lần tới khi ra điều kiện hệ thống sửa được. -->

1. Vì sao <…>? Vì <…>.
2. Vì sao <…>? Vì <…>.

### 4.3 Yếu tố góp phần

- <cảnh báo thiếu, tài liệu sai, mặc định nguy hiểm, áp lực thời gian>

## 5. Điều gì chạy tốt, chưa tốt, và may mắn

- Tốt: <…>
- Chưa tốt: <…>
- May mắn (lần sau có thể không có): <…>

## 6. Việc cần làm

| # | Việc | Loại | Người | Hạn | Trạng thái | Link |
|---|---|---|---|---|---|---|
| 1 | <…> | phòng ngừa / phát hiện / giảm nhẹ | <vai trò> | YYYY-MM-DD | Mở | <việc, PR> |

## 7. Bài học

- <điều mang sang dự án khác được>

## 8. Phụ lục

<!-- Trích log, lệnh đã chạy. Che mọi bí mật, IP, hostname nội bộ. -->

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| YYYY-MM-DD | Tạo bản nháp |
