#!/usr/bin/env bash
# Writes src/generated/sitemap-lastmod.json: for every page in seo/sitemap-pages.json, the date of
# the last commit that touched one of its "sources" or a "shared" file, e.g.
#   { "/": "2026-10-14T09:39:54+07:00", "/about": "2026-10-12T15:02:11+07:00", ... }
# src/app/sitemap.ts reads it at build time for <lastmod>; without the file it omits <lastmod>.
#
# Runs on the Jenkins agent before the Docker build, because .dockerignore keeps .git out of the
# build context (the generated file goes in with the rest of it). Locally, from any directory:
#   bash ci/sitemap-lastmod.sh
# Only committed changes count; uncommitted edits do not move a date.
set -euo pipefail
shopt -s inherit_errexit # a failing command inside $(...) stops the script too

config=seo/sitemap-pages.json
out=src/generated/sitemap-lastmod.json

die() {
  echo "sitemap-lastmod: $*" >&2
  exit 1
}
trap 'echo "sitemap-lastmod: failed at line $LINENO: $BASH_COMMAND" >&2' ERR

for tool in git jq; do
  command -v "$tool" >/dev/null || die "'$tool' is not installed; it is required to compute the sitemap dates."
done

cd "$(dirname "${BASH_SOURCE[0]}")/.."
[ "$(git rev-parse --is-inside-work-tree 2>/dev/null)" = true ] || die "$PWD is not a git checkout."
# Never leave an old file behind if this run fails.
rm -f "$out"

# A shallow clone has lost the commits that dated each page, so every page would get the date of
# the newest fetched commit. Stop instead of publishing wrong dates.
shallow=$(git rev-parse --is-shallow-repository)
[ "$shallow" = false ] ||
  die "the repository is a shallow clone; fetch the full history (git fetch --unshallow) or turn off shallow clone in the Jenkins job."

jq -e '
  (.pages | type == "array" and length > 0)
  and all(.pages[]; (.path | type == "string")
    and (.sources | type == "array" and length > 0 and all(.[]; type == "string")))
  and ((.shared // []) | type == "array" and all(.[]; type == "string"))
' "$config" >/dev/null || die "$config must have a non-empty \"pages\" array of { path, sources[] } and an optional \"shared\" array."

# Paths in the config are plain paths, never globs.
export GIT_LITERAL_PATHSPECS=1

# --first-parent follows only the checked-out branch's own line of history; on main that is the
# direct commits plus one merge commit per merged PR, and each merge is compared with its first
# parent only, so it counts as touching every file the PR changed. A page changed through a PR
# therefore gets the date the PR landed on main (the merge commit), which is when the change went
# live, instead of the date the feature commit was made on its branch, possibly days earlier.
# %cI is the committer date in strict ISO 8601 with the UTC offset.
last_commit() {
  git log -1 --first-parent --format="$1" -- "${@:2}"
}

# Every listed path must have at least one commit; otherwise it is a typo or a file that was never
# committed, and the page's date would silently ignore it.
unknown=()
all_paths=$(jq -r '[(.shared // [])[], .pages[].sources[]] | unique | .[]' "$config")
while IFS= read -r path; do
  commit=$(last_commit %H "$path")
  [ -n "$commit" ] || unknown+=("$path")
done <<<"$all_paths"
if [ "${#unknown[@]}" -gt 0 ]; then
  die "no commit touches these paths in $config (typo, or not committed yet?): ${unknown[*]}"
fi

shared=()
shared_list=$(jq -r '(.shared // [])[]' "$config")
[ -z "$shared_list" ] || mapfile -t shared <<<"$shared_list"

# Loops read from here-strings, not pipes or <(...), so they run in this shell and die() ends the script.
entries=()
pages=$(jq -c '.pages[]' "$config")
while IFS= read -r page; do
  page_path=$(jq -r '.path' <<<"$page")
  sources_list=$(jq -r '.sources[]' <<<"$page")
  mapfile -t sources <<<"$sources_list"
  date=$(last_commit %cI "${sources[@]}" "${shared[@]}")
  [ -n "$date" ] || die "$page_path: no commit touches its sources or the shared files."
  entries+=("$page_path"$'\t'"$date")
done <<<"$pages"

json=$(printf '%s\n' "${entries[@]}" | jq -Rn '[inputs | split("\t") | {(.[0]): .[1]}] | add')
mkdir -p "$(dirname "$out")"
printf '%s\n' "$json" >"$out"
echo "sitemap-lastmod: wrote $out (${#entries[@]} pages)"
printf '%s\n' "$json"
