# Chính sách CI/CD

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Triển khai](deployment.md), [Jenkins + registry](providers/jenkins-registry.md), [VPS + Docker Compose](runtimes/vps-docker-compose.md), [Mô hình đe doạ](../security/threat-model.md)

File gồm hai phần: mục 0 là hiện trạng của dự án so với chính sách (nguồn sự thật cho câu hỏi "pipeline đang thiếu gì"); mục 1–15 là chính sách chung lấy từ docs-template, không phụ thuộc GitHub, Jenkins hay Docker Compose, dùng làm đích khi cải tiến pipeline. Cách làm cụ thể: [Triển khai](deployment.md).

## 0. Áp dụng ở dự án này

Tính tới 2026-10-14, theo `Jenkinsfile`, `Dockerfile`, `ci/` và tài liệu trong repo infra.

| Chính sách | Hiện trạng | Khoảng cách, việc cần làm |
|---|---|---|
| Review thay đổi (mục 4) | Thay đổi đi qua PR vào `main` trên GitHub | `main` chưa bật branch protection, chưa bắt buộc review (kiểm 2026-10-15; chủ quán chưa cần, khuyến nghị cân nhắc sau).. Không có status check: PR không được build trước khi merge |
| Kiểm lại commit sau merge (mục 4, 5) | Mỗi commit trên `main` chạy lại lint, typecheck, guard sitemap, build, smoke test | Không có unit test, test tích hợp, quét secret, quét phụ thuộc |
| Build một lần, artifact bất biến (mục 6) | Build một lần mỗi commit; image đã smoke test là image được deploy; tag = commit SHA đầy đủ | Deploy theo tag, chưa theo digest. `[CẦN XÁC NHẬN: Harbor đã bật tag immutability cho project chưa]` |
| Chuỗi cung ứng (mục 7) | Lockfile + `npm ci`; image nền ghim tag và `--pull` mỗi build; nhãn OCI `revision`, `source` | Chưa có SBOM, chữ ký, provenance; pipeline không chặn theo kết quả quét lỗ hổng; image nền chưa ghim digest |
| Bí mật (mục 8) | Ứng dụng không có bí mật lúc chạy; bí mật CI trong Jenkins Credentials, bind theo stage; không có job PR nào chạm bí mật | — |
| Môi trường và promotion (mục 9) | Chỉ có production | Không có staging; smoke test trên máy CI thay cho bước kiểm trên staging |
| Migration (mục 10) | Không áp dụng: không có cơ sở dữ liệu | — |
| Rollout, rollback (mục 11) | Thay container, đợi healthcheck, tự quay về image trước khi lỗi; VPS giữ 3 image gần nhất | Không có blue-green: có thể có vài giây lỗi 502 khi đổi container (ước lượng thô). `[CẦN XÁC NHẬN: đã diễn tập rollback tự động và lùi tay chưa]` |
| Khoá deploy (mục 11) | `disableConcurrentBuilds` trên Jenkins; script deploy trên VPS có khoá chống chạy chồng (repo infra) | Chưa có kiểm "release cũ không ghi đè release mới" ngoài thứ tự build của Jenkins |
| Quan sát, audit (mục 12) | Thông báo Discord mỗi build; Jenkins giữ 20 build; Cloudflare Web Analytics | Chưa có release manifest; `[CẦN XÁC NHẬN: có monitor uptime cho thehot.vn chưa]` |
| Khôi phục thảm hoạ (mục 13) | Nội dung nằm trong git; image trong Harbor và trên VPS; máy chủ dựng lại theo repo infra | RTO chưa chốt (AVAIL ở [yêu cầu phi chức năng](../product/nfr.md)) |
| DORA (mục 14) | Có dữ liệu thô: commit, thời điểm build và kết quả trong Jenkins | Chưa tính |

## 1. CI/CD là gì?

| Khái niệm | Mục tiêu | Điểm kết thúc |
|---|---|---|
| **Continuous Integration** | Tích hợp thay đổi nhỏ thường xuyên và phát hiện lỗi sớm | Commit/merge pass quality gates |
| **Continuous Delivery** | Luôn giữ một release có thể phát hành an toàn | Artifact đã verify và sẵn sàng promote |
| **Continuous Deployment** | Tự động đưa release đủ điều kiện vào production | Production và post-deploy verification pass |

Continuous Delivery không bắt buộc production phải tự động hoàn toàn. Approval thủ công vẫn phù hợp nếu hệ thống có rủi ro hoặc yêu cầu compliance; approval phải nằm trong policy và audit trail.

## 2. Lifecycle của một release

```text
created → built → tested → verified → staged → approved → deployed → observed
                                      ↘ rejected
                                      deployed → rolled_back
```

Build hoặc push artifact chưa có nghĩa là đã deploy. Mỗi trạng thái cần bằng chứng và điều kiện chuyển trạng thái rõ ràng.

## 3. Release contract

Mỗi release đủ điều kiện phải có:

- `release_id` duy nhất.
- `commit_sha` đầy đủ.
- `artifact_ref` và digest bất biến.
- Kết quả source test và artifact test.
- Scan, SBOM, signature và provenance theo policy.
- Environment đã pass và thời điểm promote.
- Migration/schema version.
- Người hoặc workflow tạo, approve và deploy.
- Kết quả readiness, smoke test, monitoring và rollback nếu có.

Manifest là “hộ chiếu” của release. Không cho deploy chỉ dựa trên một tag mutable hoặc digest người dùng nhập tùy ý.

## 4. Source control và change review

- Mỗi thay đổi đi qua branch và review tương đương.
- Nhánh phát hành có required checks và kiểm soát quyền bypass.
- File pipeline, Dockerfile, hạ tầng và migration có owner review.
- PR chạy các test phù hợp với phạm vi thay đổi.
- Sau merge phải kiểm tra lại chính commit được build.
- Code không tin cậy không được truy cập production secrets hoặc quyền publish/deploy.

## 5. Quality gates

Quality gate nên kiểm tra:

- Format, lint và typecheck.
- Unit test.
- Integration/API test.
- End-to-end hoặc smoke test phù hợp.
- Migration test với database test.
- Secret scan và dependency scan.
- Artifact boot/readiness test.
- Policy về coverage, lỗ hổng và ngoại lệ.

Không nên biến mọi project thành một danh sách tool cố định. Gate phải phản ánh rủi ro của thay đổi.

## 6. Build một lần và artifact bất biến

Một release nên được build một lần, sau đó dùng chính artifact đó ở mọi environment:

```text
Build artifact B
→ test B
→ scan B
→ staging chạy B
→ production chạy B
```

Không rebuild lại khi promote staging sang production. Cùng source vẫn có thể tạo artifact khác nếu dependency hoặc base image thay đổi.

Các định danh cần phân biệt:

| Định danh | Mục đích |
|---|---|
| Git commit SHA | Xác định source |
| Artifact tag | Tìm kiếm và truy vết |
| Artifact digest | Cố định chính xác nội dung để deploy |

Deploy dùng digest đầy đủ: tên image, `@sha256:` và 64 ký tự hex do registry trả về sau khi push (ví dụ `nokto/web@sha256:` + digest), thay vì tag như `nokto/web:<commit sha>`. Dự án này hiện deploy theo tag (mục 0).

## 7. Security supply chain

Software supply chain là chuỗi:

```text
Source → dependency → base image → build worker → artifact → registry → deploy
```

Mỗi mắt xích có thể bị sửa hoặc chứa lỗ hổng. Các kiểm soát cơ bản:

| Kiểm soát | Mục đích |
|---|---|
| Secret scan | Phát hiện credential trong source/artifact |
| Vulnerability scan | Phát hiện lỗ hổng dependency và OS package |
| SBOM | Biết artifact chứa thành phần nào |
| Signature | Xác nhận ai đã ký artifact |
| Provenance | Biết artifact được tạo từ source và build nào |
| Verification | Chặn artifact không đúng nguồn, digest hoặc policy |

Signature không chứng minh code không có bug. Nó chỉ giúp xác định artifact có đúng nguồn và chưa bị thay đổi hay không.

Trước khi bật gate xác minh, ghi rõ registry và artifact được phép, danh tính bên ký, nguồn commit/workflow trong provenance, nơi lưu bằng chứng, thời điểm kiểm tra và cách xử lý khi thiếu hoặc sai bằng chứng. Bản phát hành chỉ được promote khi policy đã định nghĩa cho dự án được thoả mãn.

## 8. Secrets và credentials

Secret là dữ liệu nhạy cảm; credential là thông tin dùng để xác thực hoặc cấp quyền. Ví dụ: database password, API key, SSH key, registry token và OIDC token.

Nguyên tắc:

- Không commit secret vào source.
- Không in secret ra log.
- PR job không được truy cập production secret.
- Staging và production dùng secret riêng.
- Cấp quyền tối thiểu theo job và environment.
- Ưu tiên token ngắn hạn hoặc OIDC khi có thể.
- Secret runtime được cấp lúc deploy, không nhúng vào image.
- Frontend không được chứa secret vì dữ liệu gửi xuống browser có thể bị đọc.

## 9. Environment và promotion

Mỗi environment cần có:

- Configuration riêng.
- Secret riêng.
- Database/data policy riêng.
- Approval policy riêng.
- Artifact và release evidence riêng.

Promotion phải có dạng:

```text
Candidate
→ staging verify
→ staging pass
→ approval/policy
→ production deploy
```

Production không được lấy một artifact khác với artifact đã test ở staging.

## 10. Database migration

Migration phải có:

- Version và migration history.
- Lock để không chạy đồng thời ngoài kiểm soát.
- Test trên database staging.
- Backup hoặc recovery point trước thay đổi rủi ro.
- Timeout và kế hoạch xử lý partial migration.
- Tương thích ngược trong thời gian rollback.

Với thay đổi phá vỡ tương thích, dùng expand-and-contract:

1. Thêm schema mới, vẫn giữ schema cũ.
2. Deploy code tương thích cả hai schema.
3. Backfill và chuyển traffic/read-write.
4. Chỉ xóa schema cũ sau thời gian rollback.

## 11. Rollout và rollback

Rollout là cách đưa phiên bản mới đến người dùng. Các profile thường gặp:

- **Blue-green**: chạy bản cũ và bản mới song song rồi chuyển traffic.
- **Rolling**: thay từng instance.
- **Canary**: đưa một phần traffic vào bản mới trước.

Một rollout tối thiểu:

```text
Verify release
→ migration
→ start candidate
→ readiness
→ internal functional test
→ chuyển traffic
→ smoke test qua domain thật
→ theo dõi metric
→ thành công hoặc rollback
```

Rollback phải kiểm tra artifact cũ, cấu hình tương thích, readiness, smoke test và metric. Start được container cũ chưa đủ để kết luận rollback thành công.

## 12. Observability và audit

Sau deploy cần theo dõi:

- HTTP 5xx.
- Latency/p95.
- CPU, memory, disk.
- Database connection và query latency.
- Queue/worker backlog.
- Application log có timestamp, request ID và release ID.

Audit trail nên ghi commit, digest, người approve, thời điểm deploy, kết quả test, traffic target, rollback và recovery.

## 13. Disaster recovery

Rollback xử lý phiên bản lỗi. Disaster recovery xử lý sự cố lớn như mất server, mất database hoặc mất cả môi trường chạy.

Một kế hoạch recovery cần có:

- Backup database và file bền vững.
- Restore được thử định kỳ.
- Infrastructure as Code hoặc cấu hình có thể tái tạo.
- Runbook từng bước.
- Secrets và network có thể cấp lại.
- Release artifact còn retention để deploy lại.
- RPO: lượng dữ liệu tối đa có thể mất.
- RTO: thời gian mục tiêu để khôi phục.

## 14. DORA metrics

DORA đo kết quả delivery, không phải tool CI/CD. Năm metric hiện dùng:

| Metric | Ý nghĩa |
|---|---|
| **Deployment Frequency** | Tần suất deploy production |
| **Change Lead Time** | Thời gian từ commit đến production |
| **Change Fail Rate** | Tỷ lệ deployment gây incident, rollback hoặc hotfix |
| **Failed Deployment Recovery Time** | Thời gian khôi phục sau deployment lỗi |
| **Deployment Rework Rate** | Tỷ lệ deployment ngoài kế hoạch để xử lý sự cố |

Release event cần có timestamp cho commit, build, test, staging, approval, production, rollback và recovery. Review metric trong retrospective để tìm bottleneck, không dùng để ép deploy nhiều một cách mù quáng.

## 15. Core checklist

Trạng thái ở dự án này (2026-10-14); lý do từng mục ở mục 0.

- [ ] Source review và required checks hoạt động.
- [x] Commit sau merge được kiểm tra lại.
- [ ] Artifact được build một lần và deploy bằng digest. (Build một lần: có; deploy bằng digest: chưa.)
- [ ] Scan, SBOM, signature/provenance có policy.
- [ ] Staging và production dùng cùng artifact. (Không có staging.)
- [x] Secrets tách theo environment và không nằm trong source/image.
- [x] Migration có version, lock và tương thích ngược. (Không áp dụng: không có cơ sở dữ liệu.)
- [ ] Deployment lock và chặn release lỗi thời. (Có khoá; chưa chặn release lỗi thời.)
- [ ] Readiness, smoke test và rollback đã được kiểm thử. (Smoke test: có; diễn tập rollback: chưa xác nhận.)
- [ ] Monitoring, audit, backup, restore drill và RPO/RTO được định nghĩa.
- [ ] Có đủ event để tính 5 DORA metrics.
