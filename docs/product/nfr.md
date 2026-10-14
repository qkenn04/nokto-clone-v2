# Yêu cầu phi chức năng

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Đặc tả sản phẩm](spec.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Kiểm thử](../dev/testing.md), [Mô hình đe doạ](../security/threat-model.md), [Triển khai](../ops/deployment.md)

<!--
File này trả lời: hệ thống phải tốt tới mức nào, đo bằng gì.
Mỗi yêu cầu có: mã, ngưỡng cụ thể, cách đo, nguồn (vì sao con số này), và trạng thái đo.
Đây là NGÂN SÁCH (mục tiêu). Số đo thật để ở dev/perf.md (nếu có); ở đây chỉ ghi kết quả gần nhất và link.
Con số nằm rải rác ở tài liệu khác thì gom về đây và để tài liệu kia trỏ tới, tránh hai nơi hai số.
Ví dụ trong bảng là ví dụ: thay bằng số của dự án hoặc xoá dòng.
-->

## 1. Cách đọc

| Cột | Nghĩa |
|---|---|
| Ngưỡng | Giá trị phải đạt, có đơn vị và điều kiện đo (máy, dữ liệu, phân vị) |
| Cách đo | Lệnh, công cụ, test hoặc dashboard; ai đo, khi nào |
| Nguồn | Vì sao là con số này: ADR, yêu cầu người dùng, giới hạn phần cứng; "ước lượng thô" nếu chưa có cơ sở |
| Trạng thái | `Chưa đo` · `Đạt (YYYY-MM-DD)` · `Chưa đạt (YYYY-MM-DD)` · `[CẦN XÁC NHẬN]` |

## 2. Hiệu năng và ngân sách PERF

<!-- Ngân sách là giới hạn trên mà CI hoặc người review dùng để chặn thay đổi. Chọn ít chỉ số nhưng đo được thường xuyên. -->

| Mã | Chỉ số | Ngưỡng | Cách đo | Nguồn | Trạng thái |
|---|---|---|---|---|---|
| PERF-01 | *Ví dụ:* thời gian phản hồi API đọc, p95 | < 300 ms với 10 người dùng đồng thời | Test tải trong CI, dữ liệu mẫu | ước lượng thô | Chưa đo |
| PERF-02 | *Ví dụ:* JavaScript tải ở trang công khai (gzip) | ≤ 50 KB | Kiểm kích thước bản build trong CI | Mục tiêu trang nhẹ | Chưa đo |
| PERF-03 | *Ví dụ:* Largest Contentful Paint trên di động | < 2,5 s | Lighthouse trên bản build | Ngưỡng "tốt" của Core Web Vitals | Chưa đo |
| PERF-04 | *Ví dụ:* thời gian chạy CI cho một PR | < 10 phút | Thời lượng run CI | Giữ vòng phản hồi ngắn | Chưa đo |

## 3. Sẵn sàng và phục hồi

| Mã | Chỉ số | Ngưỡng | Cách đo | Nguồn | Trạng thái |
|---|---|---|---|---|---|
| AVAIL-01 | *Ví dụ:* tỉ lệ sẵn sàng theo tháng | ≥ 99,5% | Monitor uptime từ bên ngoài | <…> | Chưa đo |
| AVAIL-02 | *Ví dụ:* RPO (dữ liệu tối đa có thể mất) | 24 giờ | Lịch sao lưu | <…> | Chưa đo |
| AVAIL-03 | *Ví dụ:* RTO (thời gian khôi phục tối đa) | 2 giờ | Diễn tập restore, ghi thời gian | <…> | Chưa đo |

## 4. Bảo mật

<!-- Chỉ ghi yêu cầu có thể kiểm; mô hình đe doạ và lớp bảo vệ chi tiết nằm ở security/threat-model.md. -->

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| SEC-01 | *Ví dụ:* mọi route quản trị trả 401 khi không có phiên hợp lệ | Test hợp đồng API | Chưa đo |
| SEC-02 | *Ví dụ:* khoá đăng nhập N phút sau M lần sai | Test tích hợp | Chưa đo |
| SEC-03 | *Ví dụ:* không có secret trong repo | Công cụ quét secret trong CI | Chưa đo |

## 5. Tiếp cận

| Mã | Yêu cầu | Cách kiểm | Trạng thái |
|---|---|---|---|
| A11Y-01 | *Ví dụ:* đạt WCAG 2.1 mức AA ở các màn chính | Công cụ kiểm tự động + kiểm tay bằng bàn phím | Chưa đo |
| A11Y-02 | *Ví dụ:* tương phản chữ thường ≥ 4,5:1 ở cả giao diện sáng và tối | Test tương phản trên design token | Chưa đo |

## 6. Vận hành và giám sát

| Mã | Yêu cầu | Ngưỡng | Cách kiểm | Trạng thái |
|---|---|---|---|---|
| OPS-01 | *Ví dụ:* thời gian từ khi hỏng tới khi có cảnh báo | < 5 phút | Diễn tập tắt dịch vụ | Chưa đo |
| OPS-02 | *Ví dụ:* log có mã lỗi và request id, không chứa secret | 100% | Test logger | Chưa đo |
| OPS-03 | *Ví dụ:* rollback về bản trước | < 5 phút | Diễn tập rollback | Chưa đo |

## 7. Tài nguyên và giới hạn

<!-- RAM, CPU, đĩa, chi phí hằng tháng, giới hạn của dịch vụ ngoài (rate limit, dung lượng miễn phí). -->

| Mã | Tài nguyên | Giới hạn | Cách theo dõi |
|---|---|---|---|
| OPS-10 | *Ví dụ:* RAM của tiến trình ứng dụng | ≤ 512 MB | Giới hạn container, giám sát |
| OPS-11 | <…> | <…> | <…> |

## 8. Tương thích, dữ liệu và riêng tư

- Nền tảng hoặc trình duyệt hỗ trợ: <…>
- Dữ liệu cá nhân thu thập, thời gian giữ, cách xoá theo yêu cầu: <…>
- Múi giờ, ngôn ngữ, định dạng số: <…>

## 9. Mâu thuẫn và chỗ chưa chốt

<!-- Khi hai tài liệu ghi hai con số khác nhau, ghi cả hai ở đây kèm nguồn, chọn một, và sửa tài liệu kia. -->

| Chỉ số | Giá trị A (nguồn) | Giá trị B (nguồn) | Chọn | Ghi chú |
|---|---|---|---|---|
| <…> | <…> | <…> | [CẦN XÁC NHẬN] | |
