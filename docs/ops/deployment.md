# Triển khai

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Cấu hình](../dev/configuration.md), [Runbook](runbooks/README.md), [Postmortem](postmortems/README.md), [Mục lục ADR](../adr/README.md), [Lộ trình](../plan/roadmap.md)

<!--
File này trả lời: code đi từ commit tới môi trường thật như thế nào, chạy ở đâu, và lùi lại bằng cách nào.
Ghi lệnh và tên thật (project, dịch vụ, cổng loopback) nhưng KHÔNG ghi bí mật, IP công khai, hostname nội bộ.
Tình huống sự cố cụ thể để ở runbooks/; file này mô tả đường đi bình thường và các kiểu rollback.
Kiến trúc tổng quan: docs/architecture/ARCHITECTURE.md (nếu có). Mô hình đe doạ: docs/security/threat-model.md (nếu có).
-->

## 0. Tóm tắt một trang

| Câu hỏi | Trả lời |
|---|---|
| Artifact là gì | <image container theo digest, gói hoặc binary theo checksum; kèm mã commit để truy vết> |
| Ai kích hoạt deploy | <push nhánh chính, tag, bấm tay> |
| Chạy ở đâu | <nơi chạy, mô tả chung> |
| Deploy mất bao lâu | <…> (tính tới YYYY-MM-DD) |
| Lùi lại thế nào | mục 7 |
| Bí mật nằm ở đâu | [Cấu hình, mục 5](../dev/configuration.md#5-bí-mật-nơi-giữ-xoay-vòng-thu-hồi) |

## 1. Bức tranh tổng thể

```mermaid
flowchart LR
  dev["Commit / PR"] --> ci["CI<br/>lint, test, build"]
  ci --> art[("Artifact bất biến<br/>digest hoặc checksum")]
  art --> stage["Staging<br/>kiểm cùng artifact"]
  stage --> deploy["Bước deploy<br/>xác minh, migrate, khởi động"]
  deploy --> run["Môi trường thật"]
  deploy -->|"kiểm sức khoẻ lỗi"| rollback["Đánh giá rollback<br/>và xác nhận phục hồi"]
```

## 2. Thành phần chạy ở đâu

| Thành phần | Chạy ở đâu | Quản lý bằng | Cổng (loopback) | Log ở đâu |
|---|---|---|---|---|
| *Ví dụ:* ứng dụng | <container, dịch vụ hệ thống> | <compose, systemd, nền tảng> | `127.0.0.1:3000` | <…> |
| *Ví dụ:* cơ sở dữ liệu | <…> | <…> | không mở ra ngoài | <…> |

## 3. Môi trường

| Môi trường | Kích hoạt | Tên project / dịch vụ | Dữ liệu | Ai truy cập |
|---|---|---|---|---|
| dev | Tay, trên máy | `<tên>-dev` | Mẫu | Người phát triển |
| staging (nếu có) | <sau build, trước prod> | `<tên>-staging` | Dữ liệu thử | <…> |
| prod | <…> | `<tên>` | Thật | <…> |

Quy tắc: mỗi môi trường có tên project, thư mục, cơ sở dữ liệu riêng và tường minh; script không dựa vào giá trị mặc định. Thử script deploy trong thư mục tạm hoặc container, không bao giờ trên thư mục thật.

## 4. Build và artifact

- Ghi mã commit đầy đủ để truy vết, và ghi digest/checksum bất biến để xác định chính xác artifact. Container deploy bằng registry digest; không dùng nhãn trôi như `latest`.
- Phụ thuộc và image nền ghim phiên bản (lockfile, digest).
- Build một lần, kiểm chính artifact đó trên staging rồi promote nguyên artifact sang production (nếu dự án có staging). Không rebuild trong bước promote.
- Ghi nơi lưu release manifest, kết quả test/scan và quy tắc xác minh chữ ký hoặc provenance nếu áp dụng.
- Lệnh build: `<lệnh>`.

## 5. CI

| Job | Chạy khi | Làm gì | Chặn merge |
|---|---|---|---|
| quality | Mỗi PR | Lint, kiểu, test, kiểm link tài liệu | Có |
| build | Nhánh chính | Build artifact, kiểm và đẩy lên kho | — |
| staging (nếu có) | Sau build | Deploy và smoke test đúng artifact | — |
| deploy | Sau khi đủ điều kiện promote | Mục 6 | — |

Biến và bí mật của CI (chỉ tên): `<TÊN_BÍ_MẬT>`, … ([cấu hình](../dev/configuration.md)).

## 6. Deploy

### 6.1 Trình tự

1. <xác minh release manifest, nguồn và digest/checksum của artifact đã kiểm thử>
2. <kiểm quyền promote và chống deploy release cũ; lấy lock nếu cần>
3. <kiểm backup hoặc recovery point trước migration rủi ro>
4. <chạy migration có lock và phương án xử lý lỗi dở dang>
5. <khởi động bản mới, kiểm readiness rồi chuyển traffic>
6. <smoke test qua đường người dùng, theo dõi metric trong N phút>
7. <nếu lỗi, đánh giá điều kiện rollback ở mục 7 rồi lùi hoặc xử lý sự cố>
8. <ghi kết quả: commit, digest/checksum, người duyệt, thời gian, `RESULT=…`>

### 6.2 Các bước và cách hỏng

| Bước | Hỏng thì | Hệ thống làm gì | Người làm gì |
|---|---|---|---|
| Kéo artifact | Không tải được | Dừng, giữ bản cũ | Xem [runbook](runbooks/README.md) |
| Migration | Lỗi SQL | Dừng chuyển traffic; giữ bản cũ nếu schema còn tương thích | Làm theo runbook khôi phục dữ liệu |
| Kiểm sức khoẻ | Không đạt | Lùi artifact chỉ khi đã xác nhận cấu hình và dữ liệu tương thích; sau đó kiểm lại | Nếu không thể lùi an toàn, xử lý theo runbook sự cố |

## 7. Rollback

| Kiểu | Khi nào | Cách làm | Thời gian mục tiêu |
|---|---|---|---|
| Lùi artifact | Bản mới lỗi; artifact cũ còn lưu, cấu hình và schema tương thích | `<lệnh rollback> <digest/checksum bản trước>` rồi kiểm readiness, smoke test và metric | <theo OPS ở yêu cầu phi chức năng> |
| Khôi phục dữ liệu | Migration hỏng dữ liệu | Runbook khôi phục | Theo AVAIL (RTO) ở yêu cầu phi chức năng |
| Tắt cờ tính năng | Tính năng mới lỗi | <cách tắt> | <…> |

Chỉ tự động rollback khi các điều kiện ở bảng đã được kiểm trước và thao tác lùi đã được thử. Sau migration phá vỡ tương thích hoặc lỗi dữ liệu, cần kế hoạch khôi phục riêng; chạy lại container cũ chưa chứng minh dịch vụ đã phục hồi.

## 8. Cài đặt lần đầu

```bash
# Ví dụ: các bước dựng môi trường thật lần đầu (thay bằng lệnh thật, không dán bí mật vào đây)
# 1. Tạo thư mục và quyền
# 2. Tạo file cấu hình từ .env.example; sinh bí mật ngay trên máy đích
# 3. Deploy lần đầu và kiểm sức khoẻ
# 4. Bật sao lưu và khôi phục thử
```

## 9. Điều kiện xong phần vận hành theo mốc

| Mốc | Điều kiện |
|---|---|
| M0 | Deploy và rollback chạy thật một lần; sao lưu và khôi phục thử thành công |
| <…> | <…> |

## 10. Câu hỏi mở

- [CẦN XÁC NHẬN: <câu hỏi>]
