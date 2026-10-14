# ADR 0001: Ghi lại quyết định kiến trúc bằng ADR

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mẫu ADR](0000-template.md), [Tài liệu](../README.md)

<!-- ADR này được tạo sẵn khi dựng bộ tài liệu. Đọc lại, sửa bối cảnh cho đúng dự án (ví dụ số người, cách làm việc với agent AI), rồi giữ nguyên. Sau khi chấp nhận, nội dung không sửa nữa. -->

## Trạng thái

Chấp nhận.

## Ngày

- Quyết định: 2026-10-14
- Người quyết định: <tên hoặc vai trò>

## Bối cảnh

- Quyết định kiến trúc dễ bị quên lý do: commit message ghi cái đã làm, hiếm khi ghi phương án đã bỏ và vì sao.
- Lý do thường nằm rải rác: tin nhắn, ghi chú cá nhân, tài liệu thiết kế bị sửa đè, bộ nhớ của từng người.
- Agent AI không nhớ giữa các phiên làm việc. Nếu không có chỗ ghi "đã bác phương án X vì Y", agent (và người mới) dễ đề xuất lại đúng phương án đã bác.
- Khi đổi hướng, cần thấy được quyết định nào thay quyết định nào mà không phải viết lại lịch sử.
- Tài liệu có thể được công khai cùng repo, nên cách ghi phải công khai được.

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | Không ghi riêng; dựa vào git log và trí nhớ | Không tốn công | Mất phương án đã bỏ; không có trạng thái "đã thay thế"; phải tranh luận lại | Loại |
| 2 | Một tài liệu thiết kế lớn, sửa dần | Một chỗ đọc | Bị sửa đè nên mất lịch sử; không có trạng thái cho từng quyết định | Loại |
| 3 | ADR theo khung của Michael Nygard, mỗi quyết định một file trong `docs/adr/` | Ngắn, có trạng thái và chuỗi thay thế; đi cùng code trong git; đọc được offline | Cần kỷ luật để viết; dễ trùng nội dung với spec nếu không link đúng | **Chọn** |
| 4 | Issue, wiki hoặc công cụ ngoài repo | Có chỗ thảo luận | Nằm ngoài cây code; phụ thuộc quyền truy cập; agent khó đọc | Loại |
| 5 | Công cụ sinh ADR (ví dụ adr-tools) hoặc khung MADR | Có sẵn lệnh, khung | Thêm công cụ; khung tiếng Anh | Loại lúc này; mẫu 0000 tương thích nên có thể đổi sau |

## Quyết định

Dự án ghi mọi quyết định kiến trúc quan trọng thành ADR trong `docs/adr/`, theo khung của Nygard, văn xuôi tiếng Việt:

1. **Định dạng.** Mỗi ADR một file `NNNN-<name>.md`: số 4 chữ số tăng dần theo từng repo, tên tiếng Anh kebab-case. `0000` là mẫu ([0000-template.md](0000-template.md)). Các mục: Trạng thái, Ngày, Bối cảnh, Các phương án đã cân nhắc, Quyết định, Hệ quả (tốt, xấu, cần theo dõi), Điều kiện xem lại, Liên quan, Nguồn/bằng chứng, Lịch sử thay đổi.
2. **Trạng thái.** Đề xuất → Chấp nhận → (Chấp nhận · sẽ bị thay thế) → Đã thay thế; hoặc Bị bác, Ngừng dùng.
3. **Bất biến.** Không sửa nội dung quyết định sau khi chấp nhận. Muốn đổi thì viết ADR mới thay thế; ở ADR cũ chỉ cập nhật trạng thái, "Liên quan" và "Lịch sử thay đổi".
4. **Không xoá, không đánh số lại.**
5. **Ghi lại sau.** Quyết định đã đưa ra trước ngày có ADR được ghi lại với dòng "Ghi lại: YYYY-MM-DD", dùng ngày quyết định thật và chỉ kể điều đã biết lúc đó.
6. **Bằng chứng.** Mỗi ADR có ít nhất một bằng chứng kiểm được: SHA commit, đường dẫn file, số run, số liệu có nguồn.
7. **Người quyết.** Agent AI và người đóng góp viết ADR ở trạng thái Đề xuất; chỉ người có quyền quyết định chuyển sang Chấp nhận.
8. **Nhịp.** Cuối mỗi mốc, rà xem có quyết định nào chưa thành ADR hoặc ADR nào cần đổi trạng thái.

## Hệ quả

### Tốt

- Người mới, agent AI và chính người quyết định sau này đọc được **vì sao**, không chỉ **cái gì**.
- Chuỗi thay thế cho thấy dự án đã đổi hướng thế nào mà không phải viết lại lịch sử.
- Phương án đã bác được ghi lại, nên không phải tranh luận lại từ đầu.

### Xấu

- Tốn công: khoảng 15–30 phút cho một ADR nhỏ (ước lượng thô), lâu hơn khi phải tìm bằng chứng.
- ADR ghi lại sau dễ bị thiên kiến nhìn lại; giảm bằng quy tắc 5 và 6.
- Có thể lệch giữa ADR, spec và kế hoạch nếu sửa một chỗ mà quên link.

### Cần theo dõi

- Sau mỗi mốc: số quyết định đã làm trong code mà chưa có ADR. Thường xuyên lớn hơn 0 thì quy trình đang quá nặng, cần rút gọn mẫu.
- ADR ở trạng thái Đề xuất quá 2 tuần: nhắc người quyết định chốt hoặc bác.

## Điều kiện xem lại

Nếu sau vài mốc ADR không còn được đọc (không spec hay kế hoạch nào link tới, agent không dùng), gộp thành một trang "Quyết định" ngắn.

## Liên quan

- [Mẫu ADR](0000-template.md), [Tài liệu](../README.md)

## Nguồn/bằng chứng

- Michael Nygard, "Documenting Architecture Decisions" (2011): https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- Khung MADR: https://adr.github.io/madr/

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo từ docs-template và chấp nhận |
