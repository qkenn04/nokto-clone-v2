# Sơ đồ

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Kiến trúc](../ARCHITECTURE.md), [Mô hình dữ liệu nội dung](../data-model.md), [Tài liệu](../../README.md)

Quy ước vẽ và mục lục sơ đồ của dự án. Sơ đồ chỉ dùng trong một tài liệu thì để ngay trong tài liệu đó; thư mục này chỉ chứa sơ đồ dùng chung (hiện chưa có).

## 1. Quy ước

- **Mermaid trong Markdown** là bản gốc: sửa được bằng tay, review được trong diff, GitHub hiển thị trực tiếp.
- **Theo mức C4:** mức 1 ngữ cảnh, mức 2 thành phần (thứ chạy riêng hoặc lưu dữ liệu riêng), mức 3 chỉ khi cần. Không vẽ mức 4 (code). Dùng `flowchart` kèm nhãn `[Người]`, `[Container: …]`, `[Hệ thống ngoài]`; cú pháp `C4Context` của Mermaid còn thử nghiệm.
- **Mỗi sơ đồ một câu hỏi,** có dòng "tính tới YYYY-MM-DD" ở tài liệu chứa nó.
- **Nhãn trên mũi tên** ghi hành động hoặc giao thức; hướng mũi tên là hướng của lời gọi.
- **Không dùng `;` và `#`** trong chữ của sơ đồ Mermaid (là ký tự đặc biệt của cú pháp).
- **Công khai được:** không IP, hostname nội bộ, cổng nội bộ, tên tài khoản, đường dẫn trên máy chủ. Repo này công khai.
- **Sơ đồ trình bày** (HTML xuất từ Archify) để ở `docs/archify/`; khi lệch với Mermaid thì Mermaid đúng.

## 2. Mục lục

| Sơ đồ | Mức | Trả lời câu hỏi | Cập nhật |
|---|---|---|---|
| [Ngữ cảnh](../ARCHITECTURE.md#2-sơ-đồ-ngữ-cảnh-c4-mức-1) | C4-1 | Site nói chuyện với ai? | 2026-10-14 |
| [Thành phần](../ARCHITECTURE.md#3-thành-phần-c4-mức-2) | C4-2 | Cái gì chạy ở đâu, gọi nhau thế nào? | 2026-10-14 |
| [Khách mở một trang](../ARCHITECTURE.md#41-khách-mở-một-trang) | Luồng | Request đi qua những lớp nào? | 2026-10-14 |
| [Đưa thay đổi lên production](../ARCHITECTURE.md#42-đưa-một-thay-đổi-lên-production) | Luồng | Pipeline gồm những stage nào, hỏng thì sao? | 2026-10-14 |
| [Ai đọc gì](../data-model.md#3-ai-đọc-gì) | Dữ liệu | Module dữ liệu nào nuôi trang, metadata, sitemap? | 2026-10-14 |
| [Vòng đời sự kiện](../data-model.md#8-vòng-đời-trạng-thái-sự-kiện) | Trạng thái | Sự kiện chuyển trạng thái thế nào? | 2026-10-14 |
| [Kiến trúc (Archify, HTML)](../../archify/nokto-architecture.html) | Trình bày | Bản vẽ trình bày của hệ thống | 2026-10-13, còn ghi domain cũ và `noindex` |
| [CI/CD (Archify, HTML)](../../archify/nokto-cicd.html) | Trình bày | Bản vẽ trình bày của pipeline và đường lỗi | 2026-10-13 |
