# Cấu hình

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Triển khai](../ops/deployment.md), [Runbook](../ops/runbooks/README.md), [Tài liệu](../README.md)

<!--
File này trả lời: ứng dụng đọc những biến cấu hình nào, biến nào là bí mật, giữ ở đâu, xoay vòng và thu hồi thế nào.
CHỈ ghi tên biến và giá trị ví dụ vô hại, KHÔNG BAO GIỜ ghi giá trị bí mật thật.
File .env.example ở gốc repo liệt kê cùng các tên biến (không giá trị bí mật) và phải khớp bảng dưới.
-->

## 1. Nguyên tắc

1. Cấu hình đến từ biến môi trường (hoặc file do môi trường cung cấp), không viết cứng trong code.
2. Thiếu biến bắt buộc hoặc giá trị không an toàn ở môi trường thật thì ứng dụng **từ chối khởi động**, báo tên biến (không in giá trị).
3. Bí mật không vào repo, tài liệu, log, ảnh chụp màn hình hay tin nhắn. Thứ đã lộ qua các kênh đó coi như đã lộ và phải xoay.
4. Mỗi bí mật có chủ sở hữu, nơi giữ bản gốc, và cách xoay vòng hoặc thu hồi.

## 2. Biến môi trường

<!-- Nhóm theo chủ đề. Cột "Bí mật": có = không bao giờ in ra, phải xoay khi lộ. Hàng trong bảng là ví dụ. -->

### 2.1 Lõi

| Biến | Bắt buộc | Mặc định | Ví dụ (vô hại) | Bí mật | Dùng ở | Ghi chú |
|---|---|---|---|---|---|---|
| `APP_ENV` | có | — | `development` | không | toàn ứng dụng | `development`, `test`, `production` |
| `PORT` | không | `3000` | `3000` | không | máy chủ HTTP | |
| `HOST` | không | `127.0.0.1` | `127.0.0.1` | không | máy chủ HTTP | Chỉ nghe loopback; proxy phía trước lo phần công khai |
| `LOG_LEVEL` | không | `info` | `debug` | không | logger | |

### 2.2 Cơ sở dữ liệu

| Biến | Bắt buộc | Mặc định | Ví dụ (vô hại) | Bí mật | Dùng ở | Ghi chú |
|---|---|---|---|---|---|---|
| `DATABASE_URL` | có | — | `postgres://app:<mật-khẩu>@127.0.0.1:5432/app` | có | tầng dữ liệu | |

### 2.3 Dịch vụ ngoài

| Biến | Bắt buộc | Mặc định | Ví dụ (vô hại) | Bí mật | Dùng ở | Ghi chú |
|---|---|---|---|---|---|---|
| <TÊN_BIẾN> | <…> | <…> | <…> | <…> | <…> | <…> |

## 3. Kiểm cấu hình lúc khởi động

<!-- Ứng dụng kiểm gì trước khi nhận request, và thông báo lỗi trông thế nào. -->

- <ví dụ: `APP_ENV=production` mà `HOST` không phải loopback và không có proxy tin cậy → từ chối khởi động>

## 4. Khác nhau theo môi trường

| Biến | dev | CI | staging (nếu có) | prod |
|---|---|---|---|---|
| `APP_ENV` | `development` | `test` | `staging` | `production` |
| <…> | <…> | <…> | <…> | <…> |

## 5. Bí mật: nơi giữ, xoay vòng, thu hồi

| Bí mật | Nơi giữ bản gốc | Ai hoặc gì đọc | Xoay vòng | Thu hồi khi ngừng hệ thống |
|---|---|---|---|---|
| *Ví dụ:* mật khẩu cơ sở dữ liệu | <trình quản lý mật khẩu, kho bí mật> | ứng dụng | Theo runbook, mỗi <số> tháng hoặc khi lộ | Xoá người dùng cơ sở dữ liệu |
| *Ví dụ:* token deploy của CI | <cài đặt bí mật của CI> | workflow deploy | Khi đổi người hoặc khi lộ | Thu hồi ở phía cấp phát |

Quy trình xoay vòng chi tiết: [runbook](../ops/runbooks/README.md).

## 6. Cờ tính năng

| Cờ | Mặc định | Nghĩa | Gỡ khi |
|---|---|---|---|
| <…> | tắt | <…> | <mốc hoặc ngày> |
