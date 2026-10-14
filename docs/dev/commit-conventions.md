# Quy ước commit

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Tài liệu](../README.md), [Kiểm thử](testing.md), [Triển khai](../ops/deployment.md)

## 1. Mục đích

Commit message cho biết thay đổi nhằm việc gì, để người đọc quét lịch sử, tìm commit liên quan, và biết commit nào đã lên production (mọi commit trên `main` đều được deploy). Repo dùng cấu trúc Conventional Commits, viết bằng tiếng Anh:

```text
<type>(<scope>)<breaking-marker>: <description>

<body tùy chọn>

<footer tùy chọn>
```

`scope`, body và footer là tùy chọn. Dòng đầu phải có type, dấu `: ` và mô tả. `CONTRIBUTING.md` (kế thừa từ template upstream) ghi tiền tố là không bắt buộc; ở repo này thì bắt buộc, theo quy ước dưới đây.

## 2. Type

| Type | Dùng khi | Ví dụ trong repo |
|---|---|---|
| `feat` | Thêm khả năng mới mà khách hoặc máy tìm kiếm thấy | `feat(seo): keyword-focused page titles and descriptions` |
| `fix` | Sửa hành vi đang sai | `fix(seo): give inner pages the shared share-card image` |
| `perf` | Cải thiện hiệu năng, không đổi giao diện | `perf: load the splash backdrop with high fetch priority` |
| `refactor` | Tổ chức lại code, không đổi hành vi | `refactor(seo): expose page image data for the image sitemap` |
| `docs` | Chỉ thay đổi tài liệu | `docs: mention the sitemap check in contributing docs` |
| `ci` | Thay đổi `Jenkinsfile`, `ci/`, cách deploy | `ci: build and deploy with Jenkins + Harbor` |
| `build` | Thay đổi `Dockerfile`, phụ thuộc phục vụ build | |
| `test` | Thêm hoặc sửa script kiểm (`ci/smoke-test.sh`, guard sitemap) | |
| `style` | Định dạng code, không đổi logic; không dùng cho CSS hay giao diện | |
| `chore` | Bảo trì không hợp type nào ở trên | `chore: start from AI Website Cloner Template v0.6.1 (ee3f5a2)` |
| `revert` | Hoàn tác một commit | |

Chọn type theo mục đích chính. Một thay đổi có nhiều mục tiêu độc lập thì tách commit (PR #4 tách ba commit `perf:` cho ảnh nền, logo, logo trong menu). Thay đổi giao diện mà khách thấy là `feat` hoặc `fix`, không phải `style`.

## 3. Scope

Scope ngắn, chỉ phần bị ảnh hưởng. Scope đang dùng hoặc nên dùng:

| Scope | Phần |
|---|---|
| `seo` | Sitemap, metadata, JSON-LD, robots |
| `menu`, `home`, `about`, `reservation`, `legal` | Một trang và module dữ liệu của nó |
| `chrome` | Khung chung: menu điều hướng, màn hình chờ, footer, nút liên hệ |
| `adr` | Một ADR (`docs(adr): add 0009 …`) |

Bỏ scope khi thay đổi áp dụng toàn repo hoặc scope không giúp người đọc hiểu thêm.

## 4. Mô tả

- Tiếng Anh, ngắn, cụ thể; động từ ở thể mệnh lệnh (`add`, `prevent`, `serve`, `reuse`).
- Không kết thúc bằng dấu chấm.
- Không dùng `update`, `fix stuff`, `misc changes`.
- Thông tin tiếng Việt (tên món, câu chữ trên site) đặt trong body khi cần, không thay cho mô tả tiếng Anh.

## 5. Body và footer

Thêm body khi tiêu đề không giải thích lý do, cách làm hoặc hệ quả; để một dòng trống sau tiêu đề. Body tốt trong repo này nói rõ số đo trước và sau (ví dụ `aff2609`: 88,8 KB PNG → 31,2 KB WebP) và hành vi không đổi ("No visual change").

Footer cho thông tin máy đọc được: `Refs: #12`, và trailer `Co-Authored-By:` khi commit được viết cùng agent AI.

## 6. Breaking change

Breaking change ở site này là thay đổi làm hỏng thứ bên ngoài đang dựa vào: URL công khai (link đã chia sẻ, đã được index), build arg mà `Jenkinsfile` truyền, giao kèo với script deploy ở repo infra. Đánh dấu bằng `!` trước `:` hoặc footer `BREAKING CHANGE:`, và nói cách chuyển (ví dụ chuyển hướng 301 cho URL cũ).

## 7. Kiểm tra và ngoại lệ

Không có commitlint hay hook: đây là quy ước kiểm khi review PR. Merge PR trên GitHub tạo commit `Merge pull request #N from …`; tiêu đề PR cũng theo quy ước này. Một số commit cũ (trước 2026-10-14) có mô tả tiếng Việt; không sửa lịch sử.

## 8. Tham khảo

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
