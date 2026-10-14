# CI/CD Runtime Adapter: VPS + Docker Compose
> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Core policy](../ci-cd-core.md)

File này mô tả cách chạy artifact container trên VPS bằng Docker Compose và reverse proxy. Nó bổ sung cho [core policy](../ci-cd-core.md) và provider adapter.

## 1. Khi profile này phù hợp

Phù hợp khi:

- Ứng dụng có ít service hoặc một monolith.
- Lưu lượng chưa cần autoscaling phức tạp.
- Team có thể quản lý OS, Docker, firewall và backup.
- Chấp nhận một VPS là điểm lỗi chung, hoặc đã có kế hoạch nhiều host.

Không tự động có high availability chỉ vì dùng Docker Compose.

## 2. Kiến trúc minh họa

```text
Internet
  ↓
Reverse proxy
  ├── app-blue  :3001  (đang phục vụ)
  └── app-green :3002  (candidate)
        ↓
    PostgreSQL / managed database
```

Chỉ reverse proxy nhận traffic public. Candidate không mở cổng trực tiếp ra Internet.

## 3. Server layout

Ví dụ:

```text
/opt/app/
├── releases/
│   ├── current.json
│   └── previous.json
├── compose/
│   ├── blue.yml
│   └── green.yml
├── deploy/
│   ├── deploy-release.sh
│   ├── rollback.sh
│   └── readiness.sh
└── secrets/
    └── production.env
```

Thư mục secrets phải có owner, permission và backup policy phù hợp. Không commit file secret vào repository.

## 4. Deploy flow

```text
Acquire lock
→ verify release manifest và signature
→ pull đúng digest
→ kiểm tra backup/recovery point
→ chạy migration có lock
→ start candidate
→ readiness
→ internal functional test
→ chuyển reverse proxy
→ smoke test qua domain public
→ quan sát metric
→ ghi nhận thành công hoặc rollback
```

Không dùng tag `latest`, không build trên production và không chạy migration đồng thời từ mọi app instance.

## 5. Blue-green trên một VPS

| Container | Vai trò |
|---|---|
| Blue | Phiên bản đang phục vụ |
| Green | Phiên bản candidate |

Điều kiện:

- Host đủ CPU, memory và disk cho hai phiên bản.
- Session/upload không phụ thuộc filesystem tạm của container.
- Worker/cron có cơ chế tránh chạy trùng.
- WebSocket và long-running request có kế hoạch drain.
- Database schema tương thích với cả bản cũ và bản mới trong thời gian rollback.

Sau khi candidate pass:

1. Reload reverse proxy sang candidate.
2. Smoke test qua domain thật.
3. Giữ bản cũ trong thời gian quan sát.
4. Chỉ dừng bản cũ sau khi release ổn định.

## 6. Lock và chống deploy cũ

Lock phải bao phủ migration, start container, đổi traffic và rollback.

Một VPS có thể dùng lock file hoặc `flock`; nhiều host cần deployment controller hoặc distributed lock. Concurrency ở CI không thay thế lock trên server.

Trong lock cần kiểm tra release còn là release được phép phát hành. Release cũ hoàn thành sau release mới không được tự ý ghi đè production.

## 7. Health checks

- **Liveness**: process còn chạy không?
- **Readiness**: instance đã sẵn sàng phục vụ với dependency cần thiết chưa?
- **Smoke test**: thao tác chính có hoạt động qua domain thật không?

Readiness nên nhẹ, có timeout và kiểm tra dependency thiết yếu. Smoke test phải assert nội dung/schema hoặc hành vi quan trọng, không chỉ kiểm tra HTTP 200.

Ví dụ:

```bash
curl --fail --silent --show-error --max-time 10 \
  http://127.0.0.1:3002/readyz

# Đây chỉ là kiểm tra kết nối qua domain; smoke test thực tế phải assert hành vi.
curl --fail --silent --show-error --max-time 10 \
  https://app.example.com/api/health
```

## 8. Migration và rollback

Migration production phải:

- Đã chạy thử trên staging.
- Có version và migration history.
- Có lock.
- Có backup/PITR hoặc recovery point phù hợp.
- Có kế hoạch partial failure.
- Không yêu cầu rollback database mù quáng sau mọi lỗi HTTP.

Nếu schema không tương thích, chỉ rollback container là chưa đủ. Cần kế hoạch dữ liệu riêng.

## 9. SSH, credentials và runtime secrets

- Deploy bằng user riêng, không dùng root nếu không cần.
- Xác minh host key.
- Giới hạn quyền deploy user.
- Không in secret ra log.
- Cấp database/API secret tại runtime.
- Rotate SSH key và token định kỳ.
- Giới hạn ai có quyền sử dụng Docker trên host vì quyền Docker gần tương đương quyền root.

## 10. Backup và disaster recovery

Backup cần bao gồm:

- Database.
- File upload/object storage metadata.
- Cấu hình reverse proxy và runtime.
- Release manifest và artifact reference.
- Hạ tầng hoặc script tạo lại server.

Phải thử restore trong môi trường cách ly. Ghi thời gian thực tế và so sánh với RPO/RTO. Không coi “backup job chạy thành công” là bằng chứng restore được.

## 11. Runtime checklist

- [ ] Server có deploy user, SSH host verification và firewall.
- [ ] Image được pull bằng digest và verify trước khi chạy.
- [ ] Secrets nằm ngoài image và có permission phù hợp.
- [ ] Có lock cho deploy/migration/rollback.
- [ ] Candidate không mở public port.
- [ ] Readiness và smoke test có timeout.
- [ ] Reverse proxy có cơ chế chuyển traffic và reload an toàn.
- [ ] Giữ bản trước để rollback trong thời gian quan sát.
- [ ] Worker, cron, session, upload và WebSocket có kế hoạch riêng.
- [ ] Backup đã restore thử; RPO/RTO được kiểm chứng.
