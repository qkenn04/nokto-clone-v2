# Hiệu năng: số đo

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Yêu cầu phi chức năng](../product/nfr.md), [Kiểm thử](testing.md), [Tiến độ](../plan/progress.md)

<!--
File này chỉ chứa số ĐÃ ĐO, kèm cách đo đủ để người khác lặp lại. Ngân sách (mục tiêu) nằm ở product/nfr.md;
ước lượng không có chỗ ở đây. Tạo file khi có lần đo đầu tiên.
Mỗi số đo ghi: ngày, commit, máy hoặc môi trường, dữ liệu, lệnh.
-->

## 1. Cách đo

| Chỉ số (mã NFR) | Công cụ | Môi trường đo | Dữ liệu | Lệnh tái lập |
|---|---|---|---|---|
| PERF-01 | <…> | <máy, số CPU, RAM; mạng> | <kích thước dữ liệu mẫu> | `<lệnh>` |

Điều kiện chung: <khởi động nóng hay lạnh; số lần lặp; lấy trung vị hay p95; bỏ lần đầu>.

## 2. Kết quả mới nhất so với ngân sách

| Mã | Chỉ số | Ngân sách | Đo được | Ngày | Commit | Đạt |
|---|---|---|---|---|---|---|
| PERF-01 | <…> | <…> | <…> | YYYY-MM-DD | `<sha7>` | có / không |

Cập nhật cột "Trạng thái" tương ứng ở [yêu cầu phi chức năng](../product/nfr.md) sau mỗi lần đo.

## 3. Lịch sử đo

| Ngày | Commit | Mã | Giá trị | Ghi chú (thay đổi gì trước lần đo này) |
|---|---|---|---|---|
| YYYY-MM-DD | `<sha7>` | PERF-01 | <…> | <…> |

## 4. Điểm nóng đã biết

| Chỗ | Triệu chứng | Đo bằng | Việc liên quan |
|---|---|---|---|
| <…> | <…> | <…> | TK## |

## 5. Thử nghiệm tối ưu

<!-- Giả thuyết → thay đổi → số trước / sau → giữ hay bỏ. Giữ cả thử nghiệm thất bại để không làm lại. -->

| Ngày | Giả thuyết | Thay đổi | Trước | Sau | Kết luận |
|---|---|---|---|---|---|
| YYYY-MM-DD | <…> | <…> | <…> | <…> | Giữ / Bỏ |
