# Thuật ngữ

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Đặc tả sản phẩm](spec.md), [Kiến trúc](../architecture/ARCHITECTURE.md), [Tài liệu](../README.md)

<!--
Tầng T1*: bắt buộc khi dự án có từ viết tắt, thuật ngữ miền, hoặc từ thông dụng được dùng với nghĩa riêng
(ví dụ "bài" vs "bản dịch", "release" vs "deploy"). Dự án không có thì xoá file và hàng tương ứng trong docs/README.md.
Mỗi thuật ngữ: tên (giữ tiếng Anh nếu là tên kỹ thuật), cách gọi tiếng Việt, nghĩa ngắn, và nó ứng với cái gì trong dự án này.
Dùng thuật ngữ nhất quán trong mọi tài liệu và trong code; đổi tên thì đổi ở đây trước.
-->

Mục lục: [Miền nghiệp vụ](#miền-nghiệp-vụ) · [Kỹ thuật](#kỹ-thuật) · [Quy trình và tài liệu](#quy-trình-và-tài-liệu)

## Miền nghiệp vụ

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| <thuật ngữ> | <…> | <…> | <thực thể, màn hình, module tương ứng> |

## Kỹ thuật

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| *Ví dụ:* **Idempotent** | Lặp lại không đổi kết quả | Gọi một thao tác nhiều lần cho cùng kết quả như gọi một lần | <thao tác nào cần tính chất này> |
| *Ví dụ:* **RPO / RTO** | Mức mất dữ liệu / thời gian khôi phục tối đa | Hai chỉ số của kế hoạch sao lưu và khôi phục | Ngưỡng ở [yêu cầu phi chức năng](nfr.md) |

## Quy trình và tài liệu

| Thuật ngữ | Cách gọi | Nghĩa | Trong dự án này |
|---|---|---|---|
| **ADR** | Bản ghi quyết định kiến trúc | Một file ngắn ghi một quyết định, các phương án đã cân nhắc và hệ quả; không sửa sau khi chấp nhận | Thư mục [adr/](../adr/README.md) |
| **Spec** | Đặc tả tính năng | Hành vi và tiêu chí nghiệm thu của một tính năng | Thư mục `specs/` (nếu có) |
| **RFC** | Đề xuất để bàn | Đề xuất lớn cần ý kiến trước khi quyết; có thể sinh ra nhiều ADR | Thư mục `design/` (nếu có) |
| **Runbook** | Sổ tay xử lý | Các bước làm theo khi gặp một tình huống vận hành | [ops/runbooks/](../ops/runbooks/README.md) |
| **Postmortem** | Phân tích sau sự cố | Ghi lại sự cố theo tinh thần không đổ lỗi: dòng thời gian, nguyên nhân gốc, việc cần làm | [ops/postmortems/](../ops/postmortems/README.md) |
| **Definition of Done** | Điều kiện xong | Danh sách điều kiện để một thay đổi được coi là xong | [Đặc tả sản phẩm](spec.md#8-definition-of-done) |
| **Walking skeleton** | Bộ khung chạy được | Phiên bản nhỏ nhất đi hết đường: code → CI → deploy → chạy → rollback | Thường là mốc M0 ở [lộ trình](../plan/roadmap.md) |
| **[CẦN XÁC NHẬN: …]** | Chỗ chưa chắc | Đánh dấu điều chưa biết thay vì đoán | Tìm bằng `grep -rn "CẦN XÁC NHẬN" docs` |
