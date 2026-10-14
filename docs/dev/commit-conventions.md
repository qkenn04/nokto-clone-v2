# Quy ước commit

> Trạng thái: Đề xuất · Cập nhật: 2026-10-14

## 1. Mục đích

Commit message mô tả mục đích thay đổi để người đọc có thể quét lịch sử, tìm commit liên quan và tự động tạo changelog hoặc release notes khi project cần.

Dùng cấu trúc Conventional Commits:

```text
<type>(<scope>)<breaking-marker>: <description>

<body tùy chọn>

<footer tùy chọn>
```

`scope`, body và footer là tùy chọn. Dòng đầu phải có type, dấu `: ` và mô tả.

## 2. Type

| Type | Dùng khi |
|---|---|
| `feat` | Thêm khả năng mới cho người dùng hoặc API. |
| `fix` | Sửa hành vi đang sai. |
| `docs` | Chỉ thay đổi tài liệu. |
| `refactor` | Tổ chức lại code mà không đổi hành vi bên ngoài. |
| `test` | Thêm hoặc sửa test. |
| `style` | Thay đổi hình thức code, không đổi logic; không dùng cho CSS hay giao diện. |
| `perf` | Cải thiện hiệu năng. |
| `build` | Thay đổi build system hoặc dependency phục vụ build. |
| `ci` | Thay đổi cấu hình CI/CD. |
| `chore` | Công việc bảo trì không phù hợp type cụ thể hơn. |
| `revert` | Hoàn tác một thay đổi trước đó. |

Chọn type theo mục đích chính. Nếu một thay đổi chứa nhiều mục tiêu độc lập, tách commit khi hợp lý. Các type ngoài `feat`, `fix` là quy ước của project; chúng không tự quy định mức tăng phiên bản theo đặc tả Conventional Commits.

## 3. Scope

Scope ngắn gọn, đặt trong ngoặc đơn, chỉ phần bị ảnh hưởng. Dùng tên ổn định có thật trong repo, chẳng hạn `web`, `api`, `auth`, `infra` hoặc `docs`.

```text
feat(timesheet): add monthly closing summary
fix(api): reject duplicate closing requests
docs(infra): explain nginx rollback
```

Bỏ scope nếu thay đổi áp dụng toàn repo hoặc scope không giúp người đọc hiểu thêm:

```text
chore: update dependency lockfile
```

## 4. Mô tả

- Viết ngắn, cụ thể và bằng tiếng Anh để lịch sử nhiều repo nhất quán.
- Mô tả thay đổi, không chỉ ghi tên file hay trạng thái chung chung.
- Không kết thúc mô tả bằng dấu chấm.
- Ưu tiên động từ rõ như `add`, `prevent`, `remove`, `document`, `update`.

```text
fix(web): prevent banner from covering the dialog
```

Tránh `update`, `fix stuff`, `misc changes` vì chúng không nói người đọc cần biết điều gì.

## 5. Body và footer

Thêm body khi tiêu đề không giải thích lý do, cách làm hoặc hệ quả. Để một dòng trống sau tiêu đề.

```text
fix(api): reject closing dates outside the active month

The previous validation accepted dates from a different payroll period.
Validate the requested date before saving the closing record.
```

Footer có thể liên kết issue hoặc ghi thông tin máy đọc được:

```text
Refs: #123
Reviewed-by: reviewer-name
```

## 6. Breaking change

Breaking change làm người dùng, API client hoặc quy trình triển khai phải sửa cách sử dụng. Đánh dấu bằng `!` ngay trước `:` hoặc bằng footer `BREAKING CHANGE:`.

```text
feat(api)!: require employeeId in closing requests

BREAKING CHANGE: clients must include employeeId in the request body.
```

Có thể dùng `!` mà không có footer nếu mô tả dòng đầu giải thích rõ thay đổi. Không đánh dấu breaking change chỉ vì code nội bộ được refactor.

## 7. Kiểm tra và ngoại lệ

Review commit để kiểm tra type, scope, mô tả và ghi chú breaking change. Chỉ ghi rằng format được kiểm tự động khi repo thực sự cấu hình commitlint, hook hoặc CI gate. Nếu chưa có, đây là quy ước review.

Conventional Commits không định nghĩa một quy tắc riêng cho revert. Project có thể dùng `revert:` và footer tham chiếu commit bị hoàn tác.

## 8. Tham khảo

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
