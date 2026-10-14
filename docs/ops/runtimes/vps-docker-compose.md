# CI/CD runtime: VPS + Docker Compose

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Chính sách CI/CD](../ci-cd-core.md), [Jenkins + Harbor](../providers/jenkins-registry.md), [Triển khai](../deployment.md), [Kiến trúc](../../architecture/ARCHITECTURE.md)

Site chạy thành một container trên một VPS, quản lý bằng Docker Compose, sau nginx và Cloudflare. File này ghi cách runtime đó đáp ứng [chính sách CI/CD](../ci-cd-core.md). Compose stack, script deploy, cấu hình nginx và bố cục thư mục trên VPS nằm ở `qkenn04/infra-qkenn` (`stacks/`, `nginx/`), không ghi lại ở repo công khai này. Tính tới 2026-10-14.

## 1. Vì sao profile này phù hợp

- Một ứng dụng, không cơ sở dữ liệu, không worker, không upload: không cần điều phối nhiều service.
- Lưu lượng của một quán, không cần autoscaling.
- Chấp nhận một VPS là điểm lỗi chung ([mô hình đe doạ, mục 7](../../security/threat-model.md#7-rủi-ro-đã-chấp-nhận)).

## 2. Kiến trúc

```text
Internet → Cloudflare → nginx (VPS, TLS Origin CA) → container Next.js (chỉ nghe trong máy)
```

Chỉ nginx nhận traffic từ ngoài, và chỉ từ Cloudflare. Không có blue-green: bản mới thay bản cũ trong cùng một service.

## 3. Luồng deploy

```text
Jenkins gọi "deploy <commit sha>" qua SSH (forced command)
→ khoá chống chạy chồng
→ kéo image nokto/web:<sha> từ Harbor
→ chạy container mới
→ đợi Docker HEALTHCHECK
→ khoẻ: giữ, dọn image cũ (giữ 3 bản gần nhất)
→ không khoẻ: chạy lại image trước, báo lỗi về Jenkins
```

Không build trên VPS, không dùng tag `latest`, không có migration.

## 4. Health check

| Loại | Ở đây |
|---|---|
| Liveness/readiness | `HEALTHCHECK` trong `Dockerfile`: mỗi 30 s, `node -e "fetch('http://127.0.0.1:3000/')"` phải trả mã 2xx; khởi động cho phép 30 s, 3 lần lỗi liên tiếp là không khoẻ |
| Smoke test trước deploy | `ci/smoke-test.sh` trên máy CI, gọi mọi trang và kiểm sitemap ([Kiểm thử](../../dev/testing.md#3-smoke-test-kiểm-gì)) |
| Kiểm qua domain thật | Tay, sau deploy ([Triển khai, mục 6.3](../deployment.md#63-kiểm-sau-deploy)) |

## 5. SSH và bí mật

- Jenkins SSH bằng khoá chỉ chạy được lệnh deploy (forced command), chỉ dùng được từ mạng riêng; host key của VPS được ghim.
- Lệnh deploy đăng nhập bằng `root` (thấy trong `Jenkinsfile`) nhưng bị giới hạn ở forced command. Cân nhắc user deploy riêng hoặc `PermitRootLogin forced-commands-only` ở repo infra.
- Container không nhận bí mật nào.

## 6. Sao lưu và khôi phục

Không có dữ liệu riêng trên VPS cần sao lưu cho site này: nội dung nằm trong git, image nằm trong Harbor. Mất VPS thì dựng lại stack và nginx theo repo infra rồi deploy lại commit mới nhất. `[CẦN XÁC NHẬN: đã diễn tập dựng lại stack từ repo infra chưa, mất bao lâu]`

## 7. Checklist runtime

- [x] Deploy qua SSH có kiểm host key; khoá deploy bị giới hạn một lệnh.
- [ ] Image được kéo theo digest và được xác minh trước khi chạy. (Đang kéo theo tag commit SHA.)
- [x] Không có bí mật trong image.
- [x] Có khoá cho deploy và rollback.
- [x] Container không mở cổng ra Internet.
- [x] Healthcheck có timeout.
- [x] Giữ bản trước để rollback (3 image).
- [ ] Rollback và dựng lại VPS đã được diễn tập. (`[CẦN XÁC NHẬN]`)
