# CI/CD Provider Adapter: Jenkins + Container Registry

> Trạng thái: Nháp · Cập nhật: 2026-10-14 · Liên quan: [Core policy](../ci-cd-core.md)

Áp dụng [core policy](../ci-cd-core.md) bằng Jenkins Pipeline và một container registry. Chọn runtime adapter riêng; điền cấu hình Jenkins, plugin và lệnh thật của dự án trước khi sử dụng.

## 1. Mapping

| Core concept | Jenkins |
|---|---|
| Change review | Branch/MR hoặc PR rules ở hệ quản lý Git; Jenkins báo status check |
| CI runner | Agent theo label và vùng tin cậy |
| Artifact registry | Registry riêng; publish và deploy theo digest |
| Environment gate | `input` hoặc approval qua hệ thống quản lý release |
| Credentials | Jenkins Credentials và binding theo stage |
| Deployment lock | Lockable Resources hoặc controller tương đương, cộng lock tại runtime |
| Evidence | Build record, test report, release manifest, signature/provenance |

## 2. Phân tách pipeline

```text
PR/MR: source checks → test; không bind credential publish/deploy
Commit đã merge: test lại → build một lần → test image → scan/SBOM
→ push registry → lấy registry digest → sign/attest → release manifest
→ staging deploy/verify → approval → production deploy/observe
```

Jenkins không thay thế branch protection ở Git host. Cấu hình webhook/status check, owner review cho `Jenkinsfile`, Dockerfile, migration và hạ tầng. Không chạy mã PR không tin cậy trên agent có quyền đọc production credentials hoặc Docker socket dùng chung với production job.

## 3. Agent và credentials

| Stage | Agent/credential |
|---|---|
| PR test | Agent cách ly, chỉ đọc source và dependency cần thiết |
| Build/publish | Agent build riêng; registry write credential chỉ bind trong stage publish |
| Staging | Identity deploy staging và registry read |
| Production | Identity deploy production và registry read, sau approval |

Ưu tiên agent tạm thời, workspace sạch và token ngắn hạn nếu nền tảng hỗ trợ. Không in giá trị credential vào log, environment dump hoặc artifact. Nếu dùng Docker Pipeline, kiểm plugin cần thiết và quyền Docker trên agent; quyền Docker gần tương đương quyền root trên host.

## 4. Release job contract

1. Checkout đúng commit đã merge và cài dependency theo lockfile.
2. Chạy source tests; build image một lần, test chính image đó, scan và tạo SBOM.
3. Push image, lấy digest từ registry, ký/attest theo policy và tạo manifest chứa commit, digest, kết quả test, migration version.
4. Lưu manifest cùng build record với retention phù hợp; deploy job chỉ nhận release từ manifest đã xác minh.
5. Promote cùng digest qua staging và production, không rebuild theo environment.

Không dùng `BUILD_NUMBER`, image ID cục bộ hoặc tag mutable làm định danh deploy. Registry credential dùng để push có thể khác credential chỉ đọc dùng để pull.

## 5. Approval, lock và phục hồi

- Approval production phải ghi người duyệt, thời điểm, release ID và digest được duyệt. Với bước `input`, giới hạn người được bấm và timeout chờ.
- Khoá production deployment và rollback bằng resource duy nhất; nếu không có Lockable Resources, dùng cơ chế serialization tương đương.
- Runtime lock vẫn cần thiết để bao phủ thao tác ngoài Jenkins, migration và đổi traffic.
- Trong lock, kiểm release còn hợp lệ; job cũ được resume sau restart không được ghi đè release mới.
- Khi agent hoặc controller mất kết nối, đọc trạng thái remote và release manifest trước khi chạy lại; không giả định stage thất bại đồng nghĩa host chưa đổi.

## 6. Điều cần điền cho dự án

| Mục | Giá trị |
|---|---|
| Git rules và status check bắt buộc | <…> |
| Agent label và vùng tin cậy | <…> |
| Plugin, Jenkinsfile và owner review | <…> |
| Registry, credential IDs và retention | <…> |
| Lệnh test/build/scan/sign/verify | <…> |
| Manifest store và audit record | <…> |
| Người approve, timeout và deployment lock | <…> |
| Smoke test và runbook rollback | <…> |

Tài liệu tham khảo: [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/), [Docker với Pipeline](https://www.jenkins.io/doc/book/pipeline/docker/), [Credentials](https://www.jenkins.io/doc/book/using/using-credentials/), [Lockable Resources](https://www.jenkins.io/doc/pipeline/steps/lockable-resources/).
