# Kiểm thử

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Đặc tả sản phẩm](../product/spec.md), [Yêu cầu phi chức năng](../product/nfr.md), [Cấu hình](configuration.md), [Kiến trúc](../architecture/ARCHITECTURE.md)

<!--
File này trả lời: test những gì, ở tầng nào, chạy bằng lệnh gì, và tiêu chí nghiệm thu nào được test nào bảo vệ.
Ghi lệnh chạy được thật (copy-paste từ gốc repo). Test không bao giờ chạy vào dữ liệu hay thư mục của môi trường thật.
-->

## 1. Chiến lược theo tầng

<!-- Ký hiệu một chữ dùng trong cột "Loại test" của tiêu chí nghiệm thu ở mọi spec. -->

| Tầng | Ký hiệu | Kiểm gì | Công cụ | Chạy ở đâu | Khi nào | Thời gian mục tiêu |
|---|---|---|---|---|---|---|
| Unit | U | Hàm, module, không I/O thật | <…> | Máy dev, CI | Mỗi lần lưu, mỗi PR | < 1 phút |
| Tích hợp | I | Module + cơ sở dữ liệu tạm, thư mục tạm | <…> | CI | Mỗi PR | < 5 phút |
| Đầu cuối | E | Luồng người dùng trên bản build | <…> | CI | Mỗi PR hoặc trước phát hành | < 10 phút |
| Hợp đồng API | C | Hình dạng request, response, mã lỗi | <…> | CI | Mỗi PR | |
| Kiểm tay | M | Điều chưa tự động được; ghi lại người kiểm, ngày, kết quả | Checklist mục 6 | Môi trường thật hoặc staging | Trước phát hành | |

## 2. Lệnh

| Việc | Lệnh |
|---|---|
| Chạy toàn bộ test | `<lệnh>` |
| Chạy một file hoặc một test | `<lệnh>` |
| Test tích hợp (cần dịch vụ phụ) | `<lệnh dựng dịch vụ tạm>` rồi `<lệnh test>` |
| Đo độ phủ | `<lệnh>` |
| Kiểm link tài liệu | `python3 scripts/check-links.py .` |

## 3. Tiêu chí nghiệm thu và test

<!-- Mỗi tiêu chí nghiệm thu (AC-NN cấp sản phẩm, NNN-AC-NN của spec) chỉ tới ít nhất một test hoặc một bước kiểm tay. Tiêu chí không có test là tiêu chí chưa được bảo vệ. -->

| Tiêu chí | Loại | Test | Ghi chú |
|---|---|---|---|
| AC-01 | I | `<đường dẫn test>` | |
| `001-AC-01` | E | `<đường dẫn test>` | |

## 4. Dữ liệu test và môi trường

- Dữ liệu mẫu: <nằm ở đâu, sinh thế nào>. Không dùng bản sao dữ liệu thật có thông tin cá nhân.
- Dịch vụ phụ cho test tích hợp: <cơ sở dữ liệu tạm, container dùng xong bỏ>; tên project và cổng riêng, không trùng môi trường khác.
- Test ghi file chỉ ghi vào thư mục tạm và tự kiểm đường dẫn nằm trong thư mục tạm đó.
- Thời gian và ngẫu nhiên: cố định đồng hồ và seed trong test.

## 5. Cổng chất lượng trong CI

| Cổng | Chặn merge khi | Lệnh |
|---|---|---|
| Lint, kiểu | Có lỗi | `<lệnh>` |
| Test U, I, C | Có test đỏ | `<lệnh>` |
| Ngân sách hiệu năng | Vượt ngưỡng PERF ở [yêu cầu phi chức năng](../product/nfr.md) | `<lệnh>` |
| Link tài liệu | Có link hỏng | `python3 scripts/check-links.py .` |
| Quét secret | Có phát hiện | `<lệnh>` |

## 6. Kiểm tay (M)

- [ ] <bước kiểm, kết quả mong đợi>

## 7. Nợ test

<!-- Phần chưa có test mà biết là cần; mỗi mục có lý do và kế hoạch. -->

| Phần | Vì sao chưa có | Kế hoạch |
|---|---|---|
| <…> | <…> | TK## hoặc spec `NNN` |
