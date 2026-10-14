# Runbook 001: Build Jenkins hỏng ngay ở bước checkout với lỗi "object file … is empty"

> Trạng thái: Đang áp dụng · Cập nhật: 2026-10-14 · Liên quan: [Mục lục runbook](README.md), [Triển khai](../deployment.md), [Jenkins + Harbor](../providers/jenkins-registry.md), [Postmortem](../postmortems/README.md)

**Mức:** P2 (không deploy được; site đang chạy không bị ảnh hưởng, vì mọi lỗi trước stage Deploy không chạm VPS).

**Dấu hiệu:** sau khi máy CI tắt hoặc khởi động lại không sạch (mất điện, WSL bị tắt khi đang chạy, Windows khởi động lại), mọi build của job này hỏng trước stage đầu tiên. Log build có dòng như:

```text
error: object file .git/objects/af/ce6d14… is empty
fatal: cannot read existing object info
```

Thông báo Discord: "Build THẤT BẠI — VPS không bị đụng". Build sau vẫn hỏng y như vậy, dù commit mới không liên quan.

**Nguyên nhân:** khi máy tắt đột ngột giữa lúc git đang ghi, các file object vừa tạo trong `.git/objects/` còn rỗng (0 byte). Jenkins giữ hai bản sao repo của job: **cache git của controller** (dùng để đọc `Jenkinsfile`, kiểu lightweight checkout) và **workspace của job trên agent**. Một trong hai, hoặc cả hai, chứa object rỗng thì mọi lần checkout sau đều hỏng; Jenkins không tự dọn.

Đường dẫn thật của thư mục Jenkins (`JENKINS_HOME` của controller, thư mục làm việc của agent), cách vào container Jenkins và tên job nằm ở tài liệu `ci/` của `qkenn04/infra-qkenn`. Các lệnh dưới dùng biến shell; đặt biến theo tài liệu đó trước khi chạy.

## Kiểm nhanh

Chạy trên máy CI, ở nơi thấy được thư mục Jenkins (trong container controller, agent, hoặc trên host nơi các thư mục đó được mount).

```bash
: "${JENKINS_HOME:?đặt JENKINS_HOME của controller theo tài liệu repo infra}"
: "${JOB_WORKSPACE:?đặt JOB_WORKSPACE = workspace của job trên agent}"

# 1. Cache git của controller ứng với repo này (tìm theo remote.origin.url)
CACHE_DIR=$(for d in "$JENKINS_HOME"/caches/*/; do
  case "$(git -C "$d" config --get remote.origin.url 2>/dev/null)" in
    *qkenn04/nokto-clone-v2*) printf '%s\n' "${d%/}" ;;
  esac
done)
echo "cache: ${CACHE_DIR:-không tìm thấy}"

# 2. Đếm file object rỗng ở cache đó và ở workspace của job
find "$CACHE_DIR" -path '*objects*' -type f -empty | wc -l
find "$JOB_WORKSPACE" -path '*objects*' -type f -empty | wc -l
```

Kết quả mong đợi khi đúng là tình huống này: bước 1 in ra đúng một thư mục cache; bước 2 đếm được lớn hơn 0 (sự cố 2026-10-14: 60 file rỗng ở mỗi nơi). Nếu cả hai đều 0, lỗi nằm chỗ khác: xem log build đầy đủ và [bảng tra nhanh](README.md#1-bảng-tra-nhanh).

## Xử lý

Xoá hai bản sao hỏng để Jenkins clone lại từ GitHub. Không mất dữ liệu: cả hai chỉ là bản sao của GitHub.

1. Không có build nào của job đang chạy (Jenkins → job → không có build đang chạy).
2. Xoá thư mục cache đã tìm ở bước 1 (chỉ thư mục đó, không xoá cả `caches/`):

   ```bash
   git -C "$CACHE_DIR" config --get remote.origin.url   # phải là repo qkenn04/nokto-clone-v2, và CACHE_DIR chỉ có một dòng
   rm -rf -- "$CACHE_DIR"
   ```

3. Xoá workspace của job trên agent (Jenkins → job → "Wipe Out Current Workspace", hoặc `rm -rf -- "$JOB_WORKSPACE"` sau khi kiểm biến trỏ đúng thư mục của job này).
4. Bấm **Build Now** cho job → mong đợi: checkout thành công, chạy hết các stage, Discord báo thành công.

Nếu job khác trên cùng Jenkins cũng hỏng cùng kiểu, lặp lại cho từng job; mỗi repo có thư mục cache riêng.

## Xong khi

- Build mới chạy hết Sitemap dates, Check, Build, Smoke test, Push, Deploy.
- `curl -sI https://thehot.vn/` trả 200 và nội dung là commit mới nhất trên `main`.
- Lệnh đếm ở bước 2 của "Kiểm nhanh" trả 0.

## Sau đó

- Tránh tắt máy CI hoặc WSL khi Jenkins đang build.
- Ghi lại sự cố ở [mục lục postmortem](../postmortems/README.md); sự cố mức P2 cần postmortem theo quy ước.
- Đề xuất phòng ngừa (chưa làm, chưa chốt): bật `core.fsync` cho git trên máy CI để object được ghi xuống đĩa trước khi git báo xong; hoặc thêm bước tự kiểm object rỗng và xoá cache khi checkout lỗi. Thuộc repo infra.

## Diễn tập

| Ngày | Môi trường | Người | Kết quả | Thời gian |
|---|---|---|---|---|
| 2026-10-14 | Máy CI thật, sự cố thật (không phải diễn tập) | Người vận hành | Đạt: build #16 deploy `90f1882` | `[CẦN XÁC NHẬN: thời gian từ lúc phát hiện tới khi build #16 xanh]` |

## Lịch sử sự cố

**2026-10-14 (giờ Việt Nam, UTC+7):**

- 18:18: PR #4 và PR #5 merge vào `main`.
- 18:21: WSL của máy CI khởi động lại không sạch; build #12 bị giết giữa chừng.
- 18:33: PR #6 merge (`90f1882`).
- Sau đó: build #13, #14, #15 hỏng ở checkout với `error: object file .git/objects/af/ce6d14… is empty` / `fatal: cannot read existing object info`. Cache lightweight checkout của controller và workspace của job trên agent mỗi nơi có 60 file object rỗng.
- Xử lý: xoá thư mục cache của job (tìm theo `remote.origin.url`) và workspace của job, rồi chạy build. Build #16 thành công và deploy `90f1882` (gồm PR #4, #5, #6).
- Ảnh hưởng: deploy của PR #4, #5, #6 bị trễ; site đang chạy không bị ảnh hưởng.

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-14 | Tạo sau sự cố cùng ngày |
