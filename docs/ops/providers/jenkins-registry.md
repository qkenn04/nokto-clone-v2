# CI/CD provider: Jenkins + Harbor

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-18 · Liên quan: [Chính sách CI/CD](../ci-cd-core.md), [Triển khai](../deployment.md), [VPS + Docker Compose](../runtimes/vps-docker-compose.md)

Áp dụng [chính sách CI/CD](../ci-cd-core.md) bằng Jenkins Pipeline (`Jenkinsfile` ở gốc repo) và registry Harbor, cả hai chạy trên máy CI riêng. Cài đặt Jenkins (JCasC, plugin, job), Harbor và tài khoản robot nằm ở `qkenn04/infra-qkenn` (`ci/`). Tính tới 2026-10-14.

## 1. Ánh xạ khái niệm

| Khái niệm chung | Jenkins nói chung | Ở dự án này |
|---|---|---|
| Review thay đổi | Quy tắc PR ở Git host; Jenkins báo status check | PR trên GitHub; Jenkins không báo status check cho PR |
| Runner | Agent theo nhãn và vùng tin cậy | Agent nhãn `docker`, Docker riêng cho build |
| Kích hoạt | Webhook hoặc poll | `pollSCM('H/5 * * * *')` trên nhánh `main` |
| Registry | Registry riêng; publish và deploy theo digest | Harbor, image `nokto/web:<commit sha>`; deploy theo tag |
| Cổng duyệt production | `input` hoặc hệ thống quản lý release | Không có: commit trên `main` tự deploy |
| Bí mật | Jenkins Credentials, bind theo stage | `withCredentials` chỉ trong stage Existing image, Push, Deploy, Notify search engines và khối thông báo |
| Khoá deploy | Lockable Resources hoặc tương đương, cộng khoá ở runtime | `disableConcurrentBuilds()`; khoá trong script deploy trên VPS |
| Bằng chứng | Build record, test report, manifest | Log build Jenkins (giữ 20 build), thông báo Discord |

## 2. Pipeline

```text
main (sau merge) → Existing image (commit đã có image trên Harbor: kéo về, nhảy tới Smoke test)
→ Sitemap dates → Check → Build (một lần) → Smoke test image
→ Push Harbor → Sitemap snapshot → Deploy (SSH, forced command) → healthcheck trên VPS, lỗi thì quay về image trước
→ Notify search engines (Google sitemaps.submit, IndexNow; lỗi chỉ làm stage vàng)
```

Chi tiết từng stage: [Triển khai, mục 5](../deployment.md#5-ci). Không chạy mã của PR chưa merge trên agent có quyền push registry hay deploy (hiện PR không được build).

## 3. Agent và bí mật

| Stage | Agent | Bí mật được bind |
|---|---|---|
| Existing image | Agent `docker` | Tài khoản robot của stage Push, chỉ để kéo image; đăng xuất ngay sau khi kéo |
| Sitemap dates, Check, Build, Smoke test | Agent `docker` | Không |
| Push | Agent `docker` | Tài khoản robot chỉ có quyền push và pull trong project này, đăng xuất trong `post { always }` |
| Sitemap snapshot | Agent `docker` | Không |
| Deploy | Agent `docker` | Khoá SSH chỉ chạy được lệnh deploy; file host key đã ghim (`StrictHostKeyChecking=yes`, không bao giờ tắt) |
| Notify search engines | Agent `docker` | File khoá service account Google (user của property Search Console, không có quyền Google Cloud). Thiếu credential thì vẫn chạy phần IndexNow, stage vàng |
| Thông báo (`post`) | Agent `docker` | URL webhook Discord |

Tên credential, cách xoay vòng và quyền của tài khoản robot: repo infra. Agent `docker` dùng một Docker daemon riêng của Jenkins (chú thích đầu `Jenkinsfile`), không dùng chung Docker với việc khác; quyền Docker vẫn gần tương đương root trong môi trường build đó, nên chỉ code đã merge vào `main` được chạy ở đây.

## 4. Hợp đồng của job

1. Checkout đúng commit trên `main` với **lịch sử đầy đủ** (không shallow clone): stage Sitemap dates cần `git log` ([ADR 0004](../../adr/0004-automate-sitemap-from-page-config-and-git.md)).
2. Agent có `git`, `jq`, `bash`, `docker`.
3. Build image một lần, smoke test chính image đó, push với tag là `$GIT_COMMIT`. Commit đã có image trên Harbor thì kéo image đó về và smoke test, không build và push lần nữa: build lại không ra image giống từng byte, và project chưa bật tag immutability nên push lại sẽ thay image dưới cùng tag.
4. Gọi deploy với đúng `$GIT_COMMIT`; script trên VPS kéo đúng tag đó.
5. Dọn image khỏi Docker của máy CI sau build và dọn build cache cũ hơn 7 ngày (`post { cleanup }`).

## 5. Duyệt, khoá và phục hồi

- Không có bước duyệt tay; merge vào `main` là quyết định deploy.
- Build không chạy chồng (`disableConcurrentBuilds`); timeout 30 phút.
- Máy CI hoặc Jenkins khởi động lại giữa build: build dở bị huỷ, VPS chỉ bị đụng nếu đã tới stage Deploy. Cache git của Jenkins có thể hỏng sau khi máy tắt đột ngột: [runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md).

## 6. Thông tin của dự án

| Mục | Giá trị |
|---|---|
| Quy tắc Git và status check | PR vào `main`; không có status check từ Jenkins. `main` chưa bật branch protection (kiểm 2026-10-15; chủ quán chưa cần, khuyến nghị cân nhắc sau). |
| Agent và vùng tin cậy | Agent nhãn `docker` trên máy CI, trong mạng riêng |
| `Jenkinsfile`, người review | `Jenkinsfile`, `Dockerfile`, `ci/` đi qua PR như code |
| Registry và lưu giữ | Harbor trên máy CI, project `nokto`, repository `web`; chính sách giữ image ở repo infra |
| Lệnh kiểm, build | `bash ci/sitemap-lastmod.sh`; `docker build --target check`; `docker build --target runner --pull`; `ci/smoke-test.sh` |
| Quét, ký, xác minh | Chưa có trong pipeline ([chính sách, mục 0](../ci-cd-core.md#0-áp-dụng-ở-dự-án-này)) |
| Lưu bằng chứng | Log build Jenkins (20 build gần nhất), thông báo Discord |
| Người duyệt, khoá deploy | Không duyệt tay; `disableConcurrentBuilds` và khoá trên VPS |
| Smoke test và rollback | `ci/smoke-test.sh`; rollback ở [Triển khai, mục 7](../deployment.md#7-rollback) |

Tài liệu tham khảo: [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/), [Credentials](https://www.jenkins.io/doc/book/using/using-credentials/), [Docker với Pipeline](https://www.jenkins.io/doc/book/pipeline/docker/).
