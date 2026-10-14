# Runbook NNN: <Tình huống, viết theo điều người trực nhìn thấy>

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mục lục runbook](README.md), [Triển khai](../deployment.md), [Postmortem NNN](../postmortems/NNN-<name>.md)

<!-- check-links: template -->

<!--
MẪU. Khi dùng: copy thành NNN-<name>.md; đổi Trạng thái thành "Nháp"; xoá dòng "check-links: template"; thay mọi placeholder.
Viết cho người đang căng thẳng lúc nửa đêm: câu ngắn, lệnh copy-paste được, mỗi bước có kết quả mong đợi.
Bước phá huỷ (xoá, ghi đè, đổi symlink, restore) phải có dòng kiểm trước và xác nhận rõ.
-->

**Mức:** P1 / P2 / P3 (<khi nào là mức nào>).

**Dấu hiệu:** <cảnh báo nào, người dùng thấy gì, log có dòng gì>.

## Kiểm nhanh

```bash
# Ví dụ: xác định đang ở tình huống này thật (thay bằng lệnh thật)
curl -fsS http://127.0.0.1:3000/health/ready; echo
<lệnh xem trạng thái dịch vụ>
<lệnh xem log gần nhất>
```

Kết quả mong đợi khi đúng là tình huống này: <…>. Không khớp thì xem [bảng tra nhanh](README.md#1-bảng-tra-nhanh).

## Xử lý

Chọn cách đầu tiên còn dùng được.

**Cách A, <điều kiện>:**

1. <bước> → mong đợi: <…>

**Cách B, <điều kiện>:**

```bash
<lệnh>
```

## Xong khi

- <điều kiện kiểm được từ bên ngoài, ví dụ URL trả 200 với đúng phiên bản>

## Sau đó

- Sửa nguyên nhân gốc trước khi làm lại thao tác đã gây sự cố.
- P1 hoặc P2: viết postmortem ([mẫu](../postmortems/000-template.md)).
- Runbook thiếu bước: sửa ngay.

## Diễn tập

| Ngày | Môi trường | Người | Kết quả | Thời gian |
|---|---|---|---|---|
| YYYY-MM-DD | <môi trường an toàn> | <vai trò> | Đạt / Không đạt (vì …) | <…> |

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| YYYY-MM-DD | Tạo |
