# Postmortem

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mẫu postmortem](000-template.md), [Runbook](../runbooks/README.md), [Triển khai](../deployment.md)

Bắt buộc sau mỗi sự cố P1 hoặc P2 (mức độ định nghĩa ở [mục lục runbook](../runbooks/README.md#21-mức-độ)). Tinh thần không đổ lỗi: hỏi "hệ thống nào đã cho phép lỗi này xảy ra", không hỏi "ai làm sai".

## 1. Khi nào viết

| Sự kiện | Postmortem |
|---|---|
| Sự cố P1, P2 | Bắt buộc, bản nháp trong 2 ngày làm việc, xong trong 5 ngày |
| Suýt xảy ra sự cố (near miss) có bài học rõ | Nên viết, bản ngắn |
| Sự cố P3 | Tuỳ; thường một dòng ở mục lục là đủ |

## 2. Nguyên tắc

1. **Không đổ lỗi.** Ghi hành động và quyết định, kèm thông tin người đó có lúc ấy. Không ghi tên người trong phần nguyên nhân.
2. **Dòng thời gian từ bằng chứng.** Log, lệnh, commit, ảnh chụp; mọi mốc giờ ghi múi giờ.
3. **Nguyên nhân gốc là điều kiện hệ thống,** không phải "người X quên". Hỏi "vì sao" tới khi ra thứ sửa được.
4. **Mỗi việc cần làm có người và hạn,** được theo dõi tới khi xong.
5. **Công khai được:** không bí mật, không IP, không chi tiết khai thác được của lỗ hổng chưa vá. Bản công khai (nếu có) chỉ viết sau khi đã sửa.

## 3. Mục lục

| Số | Ngày | Tóm tắt | Mức | Thời gian ảnh hưởng | Việc còn mở |
|---|---|---|---|---|---|
| [000](000-template.md) | — | Mẫu | — | — | — |
| Chưa viết | 2026-10-14 | WSL của máy CI khởi động lại không sạch lúc 18:21 (UTC+7); cache git của Jenkins có object rỗng, build #13–#15 hỏng ở checkout. Xử lý theo [runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md); build #16 deploy `90f1882` | P2 | Không deploy được từ 18:21 tới build #16 (giờ xong: `[CẦN XÁC NHẬN]`); site đang chạy không bị ảnh hưởng | Viết postmortem (hạn theo quy ước: 2026-10-21); chọn biện pháp phòng ngừa ở runbook 001, mục "Sau đó" |

## 4. Cách viết

1. Copy [000-template.md](000-template.md) thành `NNN-<name>.md` (3 chữ số, tiếng Anh kebab-case, ví dụ `003-expired-tls-certificate.md`).
2. Đổi trạng thái thành `Nháp`, xoá dòng marker `check-links: template`, điền.
3. Rà cùng người liên quan; chuyển `Đang áp dụng` khi việc cần làm đã có người và hạn.
4. Thêm dòng vào mục lục; sửa runbook liên quan.
