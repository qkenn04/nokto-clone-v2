# Đặc tả sản phẩm: The Hot Beer Garden

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Yêu cầu phi chức năng](nfr.md), [Thuật ngữ](glossary.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Lộ trình](../plan/roadmap.md), [Mục lục ADR](../adr/README.md)

<!--
File này trả lời: xây gì, cho ai, vì sao, cố ý không làm gì, và thế nào là xong.
Viết cho người đọc chưa biết gì về dự án (kể cả chính bạn sáu tháng sau, và agent AI).
Cấp SẢN PHẨM: hành vi chi tiết của từng tính năng nằm ở specs/NNN-<name>/spec.md, không ở đây.
Thay đổi chậm; mỗi lần đổi mục tiêu hay phạm vi nên có ADR hoặc ít nhất một dòng ở "Lịch sử thay đổi".
-->

## 1. Tóm tắt một đoạn

<!-- 4–6 câu: sản phẩm là gì, cho ai, giải quyết vấn đề gì, khác cách làm hiện tại ở đâu, quy mô công sức (ước lượng thô). -->

The Hot Beer Garden là <…>. Người dùng chính là <…>. Hôm nay họ <cách làm hiện tại và điều khó>. Sản phẩm giúp <…>. Ước lượng thô: <N tuần hoặc N buổi làm>.

## 2. Bối cảnh và vấn đề

<!-- Điều đang xảy ra, số liệu có nguồn (ghi "tính tới YYYY-MM-DD"), vì sao làm bây giờ. Chỉ ghi điều đã biết; điều chưa biết ghi [CẦN XÁC NHẬN: …]. -->

| Hiện trạng | Vấn đề | Bằng chứng |
|---|---|---|
| <…> | <…> | <số liệu, link, commit> |

## 3. Người dùng

<!-- Mỗi nhóm người dùng hoặc hệ thống tương tác: họ làm gì, cần gì, và điều họ KHÔNG được làm (ranh giới quyền). Tính cả người vận hành và agent AI nếu có. -->

| Ai | Làm gì với hệ thống | Cần gì | Không được làm gì |
|---|---|---|---|
| *Ví dụ:* Người dùng cuối | <…> | <…> | <…> |
| *Ví dụ:* Người vận hành | Deploy, rollback, xử lý sự cố | Runbook rõ, cảnh báo khi hỏng | Sửa dữ liệu trực tiếp khi chưa có bản sao lưu |

## 4. Mục tiêu

<!-- Mỗi mục tiêu đo được, có mốc phải đạt. Tối đa ~7 mục; nhiều hơn là dấu hiệu phạm vi quá rộng. -->

| # | Mục tiêu | Cách đo | Mốc |
|---|---|---|---|
| G1 | <…> | <…> | M# |
| G2 | *Ví dụ:* Không có lỗi câm: mọi thao tác thất bại đều hiện cho người dùng và báo cho người vận hành | Test ép lỗi; cảnh báo tới kênh đã chọn | M# |

## 5. Không làm

<!-- Danh sách có chủ đích để chống phình phạm vi. Muốn đưa một mục vào phạm vi thì cần ADR. -->

| # | Không làm | Vì sao | Nếu sau này cần |
|---|---|---|---|
| NG1 | <…> | <…> | ADR mới |
| NG2 | *Ví dụ:* Nhiều vai trò và phân quyền | Chỉ có một nhóm người dùng; mỗi vai trò thêm bề mặt tấn công | ADR mới |

## 6. Phạm vi phiên bản đầu

<!-- Nhóm tính năng → spec → mốc. Spec nằm ở specs/NNN-<name>/ (nếu dự án dùng thư mục specs). -->

| Nhóm | Tính năng (spec) | Mốc chính |
|---|---|---|
| <…> | `001-<name>`, `002-<name>` | M1 |

## 7. Tiêu chí nghiệm thu cấp sản phẩm

<!-- Điều kiện để coi phiên bản đầu là xong. Mỗi dòng kiểm được: ai kiểm, bằng gì. Tiêu chí của từng tính năng nằm trong spec của tính năng. -->

| # | Tiêu chí | Kiểm bằng |
|---|---|---|
| AC-01 | <…> | <test tự động, lệnh, số liệu, kiểm tay có ghi lại> |
| AC-02 | *Ví dụ:* Khôi phục được từ bản sao lưu gần nhất trong thời gian RTO | Diễn tập restore, ghi thời gian vào tiến độ |

## 8. Definition of Done

<!-- Điều kiện chung cho MỌI thay đổi (một PR, một việc). Điều chỉnh cho dự án; giữ ngắn và kiểm được. -->

Một thay đổi được coi là xong khi:

1. Tiêu chí nghiệm thu liên quan có test tự động (hoặc bước kiểm tay có ghi lại) và đều đạt trong CI.
2. Đã được review; thay đổi nhạy cảm (xác thực, dữ liệu người dùng, deploy, xoá dữ liệu) có thêm một lượt kiểm độc lập.
3. Tài liệu cập nhật trong cùng PR theo [Definition of Done cho tài liệu](../README.md#definition-of-done-cho-tài-liệu).
4. Không làm hỏng ngân sách trong [yêu cầu phi chức năng](nfr.md); nếu đổi ngân sách thì ghi lý do.
5. Đã chạy trên môi trường thật (hoặc staging) và kiểm từ bên ngoài; có đường lùi (rollback) đã biết.
6. Lỗi mới có thể xảy ra được ghi log và có cảnh báo; không có tiến độ giả hay "bỏ qua êm".

## 9. Tín hiệu nên dừng hoặc thu hẹp

<!-- Tuỳ chọn nhưng nên có với dự án dài: dấu hiệu nào thì dừng lại xem xét, và phản ứng là gì. -->

| Tín hiệu | Phản ứng |
|---|---|
| *Ví dụ:* Một mốc vượt ước lượng cao hơn 50% | Dừng, cắt phạm vi mốc đó, ghi vào lộ trình trước khi làm tiếp |
| <…> | <…> |

## 10. Câu hỏi mở

- [CẦN XÁC NHẬN: <câu hỏi>] (ảnh hưởng: <mục tiêu, mốc>)

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo từ docs-template |
