#!/usr/bin/env python3
"""Kiểm link tương đối và anchor heading trong mọi file Markdown của một repo.

Dùng:
    python3 scripts/check-links.py <repo-root> [--exclude GLOB ...] [--quiet]

Kiểm gì:
  - Link Markdown dạng [chữ](đích) và ![alt](đích), cùng định nghĩa tham chiếu [id]: đích.
  - Đích tương đối (hoặc bắt đầu bằng "/" = tính từ gốc repo) phải tồn tại.
  - Đích có "#anchor" trỏ tới file .md: anchor phải khớp một heading (cách GitHub sinh slug)
    hoặc một <a name|id="...">. "#anchor" đơn lẻ được kiểm trong chính file đó.
  - Bỏ qua: link ngoài (http:, https:, mailto:, ...), khối code (``` và ~~~), code trong dòng,
    comment HTML.
  - File trong topics/<nhóm>/<tên>/files/ được kiểm như khi chép vào template/.

Đánh dấu (comment HTML đứng riêng một dòng):
  <!-- check-links: template -->   File là mẫu để chép: cho phép đích có placeholder
                                    (chứa "<", ">", "NNN", "YYYY"). Chỉ hợp lệ khi tên file hoặc
                                    thư mục cha chứa "template"; còn sót trong file thật là lỗi.
  <!-- check-links: off --> ... <!-- check-links: on -->   Bỏ kiểm một đoạn (dùng hạn chế).

Mã thoát: 0 khi không có lỗi, 1 khi có lỗi, 2 khi sai tham số.
"""
import argparse
import fnmatch
import os
import re
import sys
from urllib.parse import unquote

SKIP_DIRS = {
    ".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build",
    ".next", ".turbo", "coverage", "vendor", "target",
}
TEMPLATE_MARKER = "<!-- check-links: template -->"
OFF_MARKER = "<!-- check-links: off -->"
ON_MARKER = "<!-- check-links: on -->"

FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
HEADING = re.compile(r"^ {0,3}(#{1,6})[ \t]+(.*?)[ \t]*#*[ \t]*$")
INLINE_LINK = re.compile(
    r"!?\[(?:[^\[\]]|\[[^\]]*\])*\]\(\s*(<[^>\n]*>|[^)\s]+)"
    r"(?:\s+(?:\"[^\"]*\"|'[^']*'|\([^)]*\)))?\s*\)"
)
REF_DEF = re.compile(r"^ {0,3}\[[^\]]+\]:\s*(<[^>\n]*>|\S+)")
HTML_ANCHOR = re.compile(r"<a\s[^>]*?(?:name|id)=\"([^\"]+)\"", re.IGNORECASE)
HTML_TAG = re.compile(r"</?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?/?>")
SCHEME = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
PLACEHOLDER = re.compile(r"[<>]|NNN|YYYY")


INLINE_CODE = re.compile(r"(`+)(.+?)\1")


def mask_code_spans(text):
    """Thay code trong dòng bằng khoảng trắng, giữ nguyên vị trí ký tự."""
    return INLINE_CODE.sub(lambda m: " " * len(m.group(0)), text)


def visible_lines(lines):
    """Trả về (dòng hiển thị, tập chỉ số dòng trong vùng off).

    Dòng nằm trong khối code có rào (``` hoặc ~~~) trả về None. Comment HTML bị bỏ;
    khối code và code trong dòng được ưu tiên hơn comment, giống CommonMark.
    """
    out, off_lines = [], set()
    fence = None
    in_comment = False
    off = False
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if stripped == OFF_MARKER:
            off = True
        if off:
            off_lines.add(idx)
        if stripped == ON_MARKER:
            off = False
        if not in_comment:
            m = FENCE.match(line)
            if fence is None and m:
                fence = m.group(1)
                out.append(None)
                continue
            if fence is not None:
                if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence) \
                        and stripped == m.group(1):
                    fence = None
                out.append(None)
                continue
        masked = mask_code_spans(line)
        parts, pos, n = [], 0, len(line)
        while pos < n:
            if in_comment:
                end = line.find("-->", pos)
                if end < 0:
                    pos = n
                else:
                    pos = end + 3
                    in_comment = False
            else:
                start = masked.find("<!--", pos)
                if start < 0:
                    parts.append(line[pos:])
                    pos = n
                else:
                    parts.append(line[pos:start])
                    pos = start + 4
                    in_comment = True
        out.append("".join(parts))
    return out, off_lines


def strip_inline_code(text):
    return INLINE_CODE.sub("", text)


def heading_text(raw):
    """Chữ hiển thị của heading, gần với cách GitHub render."""
    t = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", raw)
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    parts = re.split(r"(`+[^`]*`+)", t)
    cleaned = []
    for p in parts:
        if p.startswith("`") and p.endswith("`") and len(p) > 1:
            cleaned.append(p.strip("`"))
        else:
            p = HTML_TAG.sub("", p)
            p = p.replace("*", "")
            # Chỉ bỏ dấu _ của cặp nhấn mạnh (_chữ_, __chữ__). Dấu _ lẻ, ví dụ trong
            # NEXT_PUBLIC_*, được GitHub giữ lại trong slug.
            p = re.sub(r"(?<!\w)(_{1,2})(?=\S)(.+?)(?<=\S)\1(?!\w)", r"\2", p)
            cleaned.append(p)
    return "".join(cleaned)


def github_slug(raw):
    t = heading_text(raw).strip().lower()
    t = re.sub(r"[^\w\- ]", "", t)
    return t.replace(" ", "-")


class Repo:
    def __init__(self, root, excludes):
        self.root = os.path.abspath(root)
        self.excludes = excludes
        self._anchors = {}

    def rel(self, path):
        return os.path.relpath(path, self.root).replace(os.sep, "/")

    def link_base(self, path):
        """Topic payloads giữ đường dẫn tương đối như khi được chép vào template/docs/."""
        parts = self.rel(path).split("/")
        if len(parts) > 4 and parts[0] == "topics" and parts[3] == "files":
            return os.path.join(self.root, "template", *parts[4:])
        return path

    def excluded(self, rel):
        return any(fnmatch.fnmatch(rel, g) or fnmatch.fnmatch(rel + "/", g) for g in self.excludes)

    def markdown_files(self):
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = sorted(
                d for d in dirnames
                if d not in SKIP_DIRS and not self.excluded(self.rel(os.path.join(dirpath, d)))
            )
            for name in sorted(filenames):
                if name.lower().endswith(".md"):
                    path = os.path.join(dirpath, name)
                    if not self.excluded(self.rel(path)):
                        yield path

    def anchors(self, path):
        if path in self._anchors:
            return self._anchors[path]
        found, counts = set(), {}
        with open(path, encoding="utf-8") as fh:
            lines = fh.read().split("\n")
        visible, _ = visible_lines(lines)
        for line in visible:
            if line is None:
                continue
            m = HEADING.match(line)
            if m:
                base = github_slug(m.group(2))
                n = counts.get(base, 0)
                counts[base] = n + 1
                found.add(base if n == 0 else f"{base}-{n}")
            for a in HTML_ANCHOR.findall(line):
                found.add(a)
        self._anchors[path] = found
        return found


def is_template_file(path):
    name = os.path.basename(path).lower()
    parent = os.path.basename(os.path.dirname(path)).lower()
    return "template" in name or "template" in parent


def check_file(repo, path, problems):
    rel = repo.rel(path)
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    lines = text.split("\n")
    template_marker = any(l.strip() == TEMPLATE_MARKER for l in lines)
    if template_marker and not is_template_file(path):
        problems.append(f"{rel}: còn marker '{TEMPLATE_MARKER}' trong file không phải mẫu "
                        "(xoá marker và điền hết placeholder)")
    visible, off_lines = visible_lines(lines)
    checked = 0
    for idx, line in enumerate(visible):
        if line is None or idx in off_lines:
            continue
        line = strip_inline_code(line)
        targets = [m.group(1) for m in INLINE_LINK.finditer(line)]
        m = REF_DEF.match(line)
        if m:
            targets.append(m.group(1))
        for raw in targets:
            checked += 1
            where = f"{rel}:{idx + 1}"
            target = raw[1:-1] if raw.startswith("<") and raw.endswith(">") and len(raw) > 2 else raw
            if PLACEHOLDER.search(raw):
                if not template_marker:
                    problems.append(f"{where}: link còn placeholder ({raw})")
                continue
            if SCHEME.match(target):
                continue
            path_part, _, anchor = target.partition("#")
            path_part = unquote(path_part)
            if path_part == "":
                dest = path
            elif path_part.startswith("/"):
                dest = os.path.normpath(os.path.join(repo.root, path_part.lstrip("/")))
            else:
                dest = os.path.normpath(os.path.join(os.path.dirname(path), path_part))
                if not os.path.exists(dest) and repo.link_base(path) != path:
                    dest = os.path.normpath(os.path.join(os.path.dirname(repo.link_base(path)), path_part))
            if not os.path.exists(dest):
                problems.append(f"{where}: không có file {target}")
                continue
            if anchor and dest.lower().endswith(".md") and os.path.isfile(dest):
                if unquote(anchor).lower() not in repo.anchors(dest):
                    problems.append(f"{where}: không có anchor #{anchor} trong {repo.rel(dest)}")
    return checked


def main(argv):
    parser = argparse.ArgumentParser(
        description="Kiểm link tương đối và anchor heading trong các file Markdown.")
    parser.add_argument("root", help="thư mục gốc của repo")
    parser.add_argument("--exclude", action="append", default=[], metavar="GLOB",
                        help="bỏ qua đường dẫn (tính từ gốc) khớp GLOB; dùng được nhiều lần")
    parser.add_argument("--quiet", action="store_true", help="chỉ in lỗi")
    args = parser.parse_args(argv)
    if not os.path.isdir(args.root):
        print(f"check-links: không có thư mục {args.root}", file=sys.stderr)
        return 2
    repo = Repo(args.root, args.exclude)
    problems, files, links = [], 0, 0
    for path in repo.markdown_files():
        files += 1
        links += check_file(repo, path, problems)
    for p in problems:
        print(p)
    if not args.quiet or problems:
        print(f"check-links: {files} file, {links} link, {len(problems)} lỗi")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
