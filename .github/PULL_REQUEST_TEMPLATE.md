## Summary

<!-- What does this PR do and why? -->

## Related Issue

<!-- Link to the issue this addresses, e.g. Closes #123 -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring
- [ ] Breaking change

## Checklist

- [ ] `npm run check` passes (lint + typecheck + sitemap check + build)

## Definition of Done cho tài liệu

<!-- Tick mục đã làm; mục không áp dụng thì xoá dòng. Chi tiết: docs/README.md, mục "Definition of Done cho tài liệu". -->

- [ ] Hành vi người dùng thấy đổi → spec cập nhật (`docs/specs/NNN-<name>/spec.md` hoặc `docs/product/spec.md`); tiêu chí nghiệm thu khớp cách kiểm
- [ ] Quyết định kiến trúc → ADR mới `docs/adr/NNNN-<name>.md` (trạng thái Đề xuất) và mục lục ADR; ADR bị thay thế đã đổi trạng thái
- [ ] Biến môi trường, build arg hoặc cấu hình → `docs/dev/configuration.md`
- [ ] Dữ liệu nội dung (`site.ts`, menu, sự kiện, ảnh) hoặc `seo/sitemap-pages.json` đổi hình dạng → `docs/architecture/data-model.md`
- [ ] Thành phần, luồng, ranh giới → `docs/architecture/ARCHITECTURE.md` và sơ đồ
- [ ] Deploy, CI, hạ tầng, thao tác vận hành → `docs/ops/deployment.md` và runbook liên quan
- [ ] Bề mặt tấn công, bên thứ ba, bí mật, quyền → `docs/security/threat-model.md` (và trang `/privacy` nếu thêm bên thứ ba)
- [ ] Ngân sách hoặc số đo hiệu năng → `docs/product/nfr.md`, `docs/dev/perf.md`
- [ ] Cấu trúc thư mục front-end, luật import → `docs/dev/frontend.md`
- [ ] Thuật ngữ mới → `docs/product/glossary.md`
- [ ] Cách kiểm hoặc lệnh kiểm → `docs/dev/testing.md`
- [ ] Xong việc hoặc đổi mốc → `docs/plan/progress.md`, `docs/plan/tasks.md`, `tasks.md` của spec
- [ ] Sự cố đã xử lý → postmortem `docs/ops/postmortems/NNN-<name>.md`; runbook đã sửa

## Mọi PR có sửa tài liệu

- [ ] Ngày `Cập nhật:` ở dòng metadata của file đã sửa nội dung là hôm nay
- [ ] `python3 scripts/check-links.py . --exclude CONTRIBUTING.md --exclude SECURITY.md` không báo lỗi
- [ ] Không secret, token, IP, hostname nội bộ, đường dẫn trên máy chủ (repo này công khai; chi tiết hạ tầng nằm ở `qkenn04/infra-qkenn`)
- [ ] Chỗ chưa chắc ghi `[CẦN XÁC NHẬN: …]`; thông tin kinh doanh chưa chốt ghi "Chưa xác định — cần chủ quán xác nhận"; ước lượng ghi "ước lượng thô"
- [ ] File mới đã được link từ `docs/README.md` hoặc mục lục của thư mục chứa nó
