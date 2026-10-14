# Postmortem 001: WSL của máy CI tự tắt giữa build, cache git của Jenkins hỏng, không deploy được 26 phút

> Trạng thái: Nháp · Cập nhật: 2026-10-15 · Liên quan: [Mục lục postmortem](README.md), [Runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md), [Jenkins + Harbor](../providers/jenkins-registry.md), [Triển khai](../deployment.md), [Chính sách CI/CD](../ci-cd-core.md)

Mọi mốc giờ theo giờ Việt Nam (UTC+7), ngày 2026-10-14, trừ khi ghi khác. Repo công khai: đường dẫn trên máy CI, tên job, cách vào container Jenkins và cấu hình máy CI nằm ở `qkenn04/infra-qkenn`.

## 1. Tóm tắt

| Mục | Giá trị |
|---|---|
| Ngày | 2026-10-14 |
| Mức | P2 (không deploy được; site đang chạy không bị ảnh hưởng) |
| Bắt đầu ảnh hưởng | 2026-10-14 18:21 (UTC+7), khi WSL của máy CI tự tắt giữa build #12 |
| Phát hiện | Không muộn hơn khoảng 18:43 (UTC+7), bởi người đang theo dõi Jenkins; không có cảnh báo tự động. Giờ chính xác: `[CẦN XÁC NHẬN]` |
| Khắc phục (cầm máu) | 2026-10-14 khoảng 18:44 (UTC+7): xoá cache git của job trên controller và workspace của job trên agent, chạy build mới |
| Xử lý xong | 2026-10-14 18:47 (UTC+7): build #16 thành công, deploy `90f1882` |
| Ảnh hưởng | Không deploy được khoảng 26 phút (18:21–18:47); thay đổi của PR #4 và #5 lên production khoảng 29 phút sau khi merge. Khách truy cập không bị ảnh hưởng, không mất dữ liệu, các dự án khác trên cùng Jenkins không bị ảnh hưởng |
| Người xử lý | Người vận hành (chủ repo) |

WSL của máy CI tự tắt (không do người vận hành; nguyên nhân gốc chưa xác định) khi Jenkins đang chạy build #12. Các file object git được ghi ngay trước đó còn rỗng, ở cả cache git của controller lẫn workspace của job trên agent, nên ba build tiếp theo hỏng ngay ở bước checkout. Xoá hai bản sao hỏng để Jenkins clone lại từ GitHub; build #16 chạy hết pipeline và deploy commit mới nhất trên `main`.

## 2. Dòng thời gian

| Thời điểm | Sự kiện | Bằng chứng |
|---|---|---|
| 18:18 | Chủ repo merge PR #4 (`6316298`) và PR #5 (`afce6d1`) vào `main` | `git log --merges` |
| 18:21:10 | Jenkins bắt đầu build #12 (nguyên nhân: SCM change, tức poll thấy commit mới) | Trang build #12 trên Jenkins |
| 18:21:10–18:21:56 | WSL của máy CI tự tắt trong lúc build #12 đang chạy. Không ai tắt tay; nguyên nhân chưa xác định | Người vận hành xác nhận; thời điểm khởi động bên dưới |
| 18:21:56 | WSL khởi động lại; Jenkins và Harbor tự chạy lại theo cấu hình | Thời điểm khởi động của WSL trên máy CI |
| Khoảng 18:22 | Jenkins resume build #12 và chờ agent kết nối lại | Log build #12 |
| 18:32 | Build #12 thất bại: tiến trình shell của bước đang chạy đã mất cùng WSL (phụ lục, mục A) | Log build #12 |
| 18:33:46 | PR #6 merge (`90f1882`) | `git log --merges` |
| 18:34 | Build #13 hỏng ở lightweight checkout (đọc `Jenkinsfile`), trước stage đầu tiên: `error: object file .git/objects/af/ce6d14… is empty` | Log build #13; phụ lục, mục B |
| 18:36 | Build #14 hỏng, cùng nhóm lỗi | Log build #14 |
| 18:41 | Build #15 hỏng, cùng nhóm lỗi | Log build #15 |
| Khoảng 18:43 | Chẩn đoán: cache git của controller cho job này có 60 file object rỗng, workspace của job trên agent cũng 60; cache của các job khác: 0 | Lệnh đếm ở [runbook 001, mục "Kiểm nhanh"](../runbooks/001-jenkins-git-cache-corrupted.md#kiểm-nhanh) |
| Khoảng 18:44 | Xoá thư mục cache của job và workspace của job, bấm Build Now | Các bước nay là [runbook 001, mục "Xử lý"](../runbooks/001-jenkins-git-cache-corrupted.md#xử-lý) |
| 18:47:00 | Build #16 SUCCESS, deploy `90f1882` (gồm PR #4, #5, #6) | Trang build #16 trên Jenkins |
| 19:18 | Runbook 001 được commit | Commit `d1e0f9c` |

Object đầu tiên bị báo rỗng, `af/ce6d14…`, chính là merge commit của PR #5 (`git rev-parse afce6d1` → `afce6d1444db…`): commit mới nhất trên `main` lúc build #12 bắt đầu, tức object vừa được lấy về khi WSL tắt.

## 3. Ảnh hưởng

- **Deploy:** không đưa được commit nào lên production từ 18:21 tới 18:47, khoảng 26 phút. PR #4 và #5 (merge 18:18) lên production lúc 18:47, khoảng 29 phút sau khi merge; bình thường khoảng 10 phút (ước lượng thô ở [Triển khai](../deployment.md)). PR #6 (merge 18:33) lên production khoảng 13 phút sau khi merge.
- **Khách truy cập:** không bị ảnh hưởng. Site chạy trên VPS từ image đã kéo về; mọi build hỏng trước stage Deploy nên VPS không bị đụng (yêu cầu AVAIL-03 ở [yêu cầu phi chức năng](../../product/nfr.md) giữ đúng).
- **Dữ liệu:** không mất gì. Cache và workspace chỉ là bản sao của GitHub; image cũ trong Harbor và trên VPS còn nguyên.
- **Dự án khác trên cùng Jenkins:** không bị ảnh hưởng; cache git của chúng không có object rỗng.

## 4. Nguyên nhân

### 4.1 Nguyên nhân trực tiếp

Cache git của controller (dùng cho lightweight checkout để đọc `Jenkinsfile`) và workspace của job trên agent mỗi nơi chứa 60 file object rỗng (0 byte). Git không đọc được các object đó nên mọi lần checkout của job này đều hỏng, trước khi pipeline kịp chạy stage nào.

### 4.2 Nguyên nhân gốc

1. Vì sao không deploy được? Vì build #13, #14, #15 đều hỏng ở bước checkout với lỗi object rỗng.
2. Vì sao có object rỗng? Vì WSL tắt đột ngột khi build #12 vừa lấy commit mới về: file object đã được tạo nhưng nội dung chưa được ghi xuống đĩa. Cơ chế có khả năng nhất (chưa kiểm): dữ liệu còn nằm trong bộ đệm ghi của hệ điều hành khi máy ảo WSL dừng, nên file còn tên mà không còn nội dung.
3. Vì sao WSL tắt khi đang build? Chưa xác định. Người vận hành không tắt WSL; WSL tự tắt. Máy CI là WSL trên một máy để bàn Windows, có thể dừng vì những lý do nằm ngoài Jenkins (cập nhật Windows, WSL tự dừng máy ảo, thiếu bộ nhớ, lỗi WSL), và không có gì bảo vệ build đang chạy khỏi việc đó. Việc tìm nguyên nhân: mục 6, việc 1.
4. Vì sao lỗi lặp lại ở mọi build sau? Vì git không tự sửa object rỗng, còn Jenkins dùng lại cache của controller và workspace của agent qua các build mà không kiểm tính toàn vẹn và không tự làm mới khi checkout lỗi.
5. Vì sao mất 26 phút? Vì không có cảnh báo (mục 4.3) và chưa có runbook: ba build hỏng giống nhau trước khi có người nhìn vào cache.

**Điều kiện hệ thống cần sửa:** CI chạy trên một máy có thể dừng bất cứ lúc nào, trong khi các bản sao git mà Jenkins giữ lại không được kiểm hay tự làm mới sau một lần dừng đột ngột, và build hỏng không báo cho ai.

### 4.3 Yếu tố góp phần

- **Máy CI là WSL trên máy để bàn.** Có thể tắt hoặc khởi động lại bất cứ lúc nào; build đang chạy không được bảo vệ.
- **Git không tự chữa, Jenkins tái dùng cache.** Một lần dừng đột ngột làm hỏng mọi build sau đó cho tới khi có người xoá tay.
- **Không có thông báo build lỗi.** Khối `post` của `Jenkinsfile` chỉ gửi Discord khi Jenkins có webhook; lúc sự cố webhook chưa được cấu hình, nên cả bốn build hỏng (#12–#15) không báo cho ai. Tài liệu lại ghi là đã có: OPS-01 ở [yêu cầu phi chức năng](../../product/nfr.md) và [runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md) mô tả thông báo Discord như thể đang chạy. Sự cố chỉ được thấy vì có người đang xem Jenkins.
- **Không có cổng trước merge.** PR không được build trước khi merge và `main` không có branch protection, nên PR #6 vẫn merge lúc 18:33 khi CI đang hỏng; thay đổi dồn lại chờ deploy. Không làm sự cố nặng hơn lần này, nhưng che mất tín hiệu "CI đang hỏng" với người merge.
- **Chưa có runbook** cho lỗi cache git lúc sự cố xảy ra.

## 5. Điều gì chạy tốt, chưa tốt, và may mắn

- Tốt: thiết kế "lỗi trước stage Deploy không chạm VPS" giữ đúng; khách không thấy gì.
- Tốt: Jenkins và Harbor tự chạy lại sau khi WSL khởi động; không phải dựng lại CI bằng tay.
- Tốt: chỉ một job hỏng; cache của các job khác sạch.
- Tốt: khi đã nhìn đúng chỗ, sửa nhanh và an toàn (khoảng 4 phút từ chẩn đoán tới build xanh; chỉ xoá bản sao của GitHub). Build #16 đưa cả ba PR lên một lần.
- Tốt: [runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md) được viết ngay tối đó, kèm lệnh đếm object rỗng và các bước xoá an toàn.
- Chưa tốt: build hỏng im lặng; không có cảnh báo nào.
- Chưa tốt: build #12 treo khoảng 10 phút (18:22–18:32) chờ agent trước khi báo lỗi; ba build sau hỏng giống nhau mà không có bước nào tự nhận ra "lỗi do cache, không do commit".
- Chưa tốt: chưa biết vì sao WSL tự tắt, nên chưa loại được khả năng lặp lại.
- May mắn (lần sau có thể không có): có người đang xem Jenkins đúng lúc.
- May mắn: không có bản sửa gấp cho production đang chờ deploy trong khoảng đó; nếu có, cách lùi nhanh nhất lúc ấy là lùi image tay trên VPS ([Triển khai, mục 7](../deployment.md#7-rollback)).
- May mắn: WSL tắt ở đầu build. Trường hợp WSL tắt đúng lúc stage Deploy đang gọi VPS chưa được kiểm.

## 6. Việc cần làm

| # | Việc | Loại | Người | Hạn | Trạng thái | Link |
|---|---|---|---|---|---|---|
| 1 | Tìm nguyên nhân WSL tự tắt lúc khoảng 18:21 ngày 2026-10-14: Windows Event Viewer (nhật ký System quanh thời điểm đó), lịch sử Windows Update, `wsl --version` và `.wslconfig` (`vmIdleTimeout`), dấu hiệu WSL bị crash hoặc thiếu bộ nhớ trên máy CI. Ghi kết quả vào mục 4.2 của file này | phòng ngừa | `[CẦN XÁC NHẬN: người vận hành máy CI]` | `[CẦN XÁC NHẬN]` | Mở | — |
| 2 | Cấu hình webhook Discord cho Jenkins để mọi build (thành công, hỏng) đều có thông báo; thử bằng một build hỏng có chủ đích. Xong thì sửa trạng thái OPS-01 và câu về Discord trong runbook 001 | phát hiện | `[CẦN XÁC NHẬN]` | `[CẦN XÁC NHẬN]` | Mở | `qkenn04/infra-qkenn` |
| 3 | Tự kiểm object git rỗng trước checkout (hoặc bằng job định kỳ, hoặc khi WSL khởi động) và tự xoá cache, workspace hỏng; cân nhắc bật `core.fsync` cho git trên máy CI. Làm ở repo infra; cập nhật runbook 001 khi xong | giảm nhẹ | `[CẦN XÁC NHẬN]` | `[CẦN XÁC NHẬN]` | Mở | `qkenn04/infra-qkenn` |
| 4 | Cân nhắc chuyển CI sang một máy luôn bật thay cho WSL trên máy để bàn; quyết định (chuyển hay giữ) ghi thành ADR | phòng ngừa | `[CẦN XÁC NHẬN]` | `[CẦN XÁC NHẬN]` | Mở | — |
| 5 | Viết runbook cho lỗi cache git của Jenkins | giảm nhẹ | Người vận hành | 2026-10-14 | Xong | [Runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md) |

Khuyến nghị cân nhắc sau (không phải việc cần làm của postmortem này): bật branch protection cho `main` (bắt buộc PR, và bắt buộc build xanh nếu sau này PR được build). Chủ repo cho là chưa cần ở thời điểm 2026-10-15; xem [CONTRIBUTING.md](../../../CONTRIBUTING.md#protecting-main).

## 7. Bài học

- Cache của CI là thứ vứt đi được; khi "xoá rồi clone lại" luôn an toàn thì nên để máy tự làm, không chờ người.
- Khi CI chạy trên máy để bàn, máy tắt đột ngột là chuyện bình thường, không phải ngoại lệ; mọi thứ CI giữ lại trên đĩa phải chịu được việc đó.
- Đường thông báo là một phần của pipeline: một khối `post` không có webhook cũng như không có thông báo. Kiểm cả cấu hình, không chỉ code.
- Tách CI khỏi đường phục vụ (VPS chạy image đã kéo về) giới hạn ảnh hưởng: CI hỏng chỉ làm chậm deploy, không làm sập site.

## 8. Phụ lục

### A. Build #12 (18:32)

```text
wrapper script does not seem to be touching the log file … durable task process was terminated externally
ERROR: script returned exit code -1
```

### B. Build #13, #14, #15 (lightweight checkout)

```text
error: object file .git/objects/af/ce6d14… is empty
fatal: cannot read existing object info
fatal: fetch-pack: invalid index-pack output
```

### C. Chẩn đoán và xử lý

Lệnh đếm object rỗng và các bước xoá nằm ở [runbook 001](../runbooks/001-jenkins-git-cache-corrupted.md). Kết quả lúc chẩn đoán:

| Nơi | File object rỗng |
|---|---|
| Cache git của controller cho job này | 60 |
| Workspace của job trên agent | 60 |
| Cache git của các job khác | 0 |

## Lịch sử thay đổi

| Ngày | Thay đổi |
|---|---|
| 2026-10-15 | Tạo bản nháp. Chủ repo xác nhận WSL tự tắt, không do người vận hành; nguyên nhân gốc chưa xác định |
