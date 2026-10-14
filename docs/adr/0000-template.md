# ADR 0000: Mẫu ADR

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [ADR 0001](0001-record-architecture-decisions.md), [Tài liệu](../README.md)

<!-- check-links: template -->

File này không phải một quyết định. Đây là mẫu để copy khi viết ADR mới, theo quy tắc ở [ADR 0001](0001-record-architecture-decisions.md). Mục lục ADR nằm ở `docs/adr/README.md` (hồ sơ lite: mục "Quyết định" trong [docs/README.md](../README.md)).

## Cách dùng

1. Copy khối bên dưới vào file mới `docs/adr/NNNN-<name>.md` (số tiếp theo, 4 chữ số; tên tiếng Anh kebab-case).
2. Thay mọi chỗ `<…>`, `NNNN`, `YYYY-MM-DD`. Xoá các dòng hướng dẫn in nghiêng khi đã điền xong.
3. Trạng thái ban đầu luôn là `Đề xuất`. Dòng metadata dùng bộ trạng thái chung của tài liệu: `Đề xuất` → `Đang áp dụng` (khi chấp nhận) → `Đã thay thế` hoặc `Lưu trữ` (bị bác, ngừng dùng).
4. Thêm một dòng vào mục lục ADR.

## Mẫu

~~~markdown
# ADR NNNN: <Quyết định, viết thành cụm danh từ ngắn>

> Trạng thái: Đề xuất · Cập nhật: YYYY-MM-DD · Liên quan: [<tên>](<đường dẫn tương đối>), …

## Trạng thái

Đề xuất | Chấp nhận | Chấp nhận · sẽ bị thay thế bởi [NNNN](NNNN-<name>.md) | Đã thay thế bởi [NNNN](NNNN-<name>.md) | Bị bác | Ngừng dùng

*Giữ một giá trị. Nếu bị thay thế: ghi ADR nào thay và từ ngày hoặc mốc nào.*

## Ngày

- Quyết định: YYYY-MM-DD
- Ghi lại: YYYY-MM-DD *(chỉ ghi khi viết ADR sau khi đã quyết định)*
- Người quyết định: <tên hoặc vai trò>

## Bối cảnh

*Các lực tác động lúc quyết định, viết trung tính, không bênh phương án nào: ràng buộc (người, thời gian,
hạ tầng, ngân sách), vấn đề đang gặp, số liệu có lúc đó và độ tin cậy của số liệu. Chỉ ghi điều ĐÃ biết lúc quyết định.*

## Các phương án đã cân nhắc

| # | Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|---|
| 1 | <phương án> | <…> | <…> | Chọn / Loại (vì …) |
| 2 | <phương án> | <…> | <…> | Chọn / Loại (vì …) |
| 3 | Giữ nguyên / không làm gì | <…> | <…> | Chọn / Loại (vì …) |

*Phương án cần giải thích dài hơn một ô bảng thì thêm mục con "### Phương án N: …".*

## Quyết định

*Viết ở thể khẳng định: "Chúng ta sẽ …" / "Hệ thống …". Đủ cụ thể để kiểm được: tên package và phiên bản,
đường dẫn, lệnh, giá trị cấu hình (không ghi secret).*

Quy tắc rút ra (nếu có):

1. <quy tắc kiểm được>

## Hệ quả

### Tốt

- <…>

### Xấu (cái giá chấp nhận trả)

- <…>

### Cần theo dõi

- <dấu hiệu cho thấy quyết định cần xem lại, và ai kiểm, khi nào>

## Điều kiện xem lại

*Điều gì xảy ra thì mở lại quyết định này (ví dụ: dữ liệu vượt N bản ghi, thời gian build vượt M giây).*

## Liên quan

- ADR: [NNNN](NNNN-<name>.md)
- Spec: [NNN](../specs/NNN-<name>/spec.md)
- Kế hoạch: [Lộ trình](../plan/roadmap.md) (M#)

## Nguồn/bằng chứng

- Commit: `<repo>` `<sha7>`: <tiêu đề commit>
- File: `<đường dẫn>` (dòng hoặc hàm liên quan)
- Run / số liệu: <run CI, thời gian, số đếm>
- Tài liệu ngoài: <link>

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| YYYY-MM-DD | Tạo, trạng thái Đề xuất |
~~~

## Danh sách kiểm trước khi chuyển sang "Chấp nhận"

- [ ] Có ít nhất 2 phương án thật, mỗi phương án có cả ưu lẫn nhược.
- [ ] Mục "Quyết định" đủ cụ thể để người khác (hoặc agent) làm theo mà không phải hỏi lại.
- [ ] Mục "Hệ quả" có cả phần xấu, không chỉ phần tốt.
- [ ] Có ít nhất một bằng chứng kiểm được (commit, file, run, số liệu có nguồn).
- [ ] Chỗ chưa chắc được đánh dấu `[CẦN XÁC NHẬN: …]`; ước lượng ghi "ước lượng thô".
- [ ] Không có secret, token, IP, hostname nội bộ, chi tiết lỗ hổng chưa vá.
- [ ] Đã thêm vào mục lục ADR và link từ spec hoặc kế hoạch liên quan.
- [ ] Người có quyền quyết định đã đọc và đồng ý.
