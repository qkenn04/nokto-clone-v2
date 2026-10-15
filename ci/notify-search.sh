#!/usr/bin/env bash
# Tells search engines which pages of the site changed, after a deploy (docs/adr/0009-notify-search-engines-after-deploy.md):
#   Google    re-submits the sitemap through the Search Console API (sitemaps.submit); Google then reads the new
#             <lastmod> dates. Its per-URL Indexing API is only allowed for job postings and livestreams, so it is
#             never called.
#   IndexNow  posts the changed page URLs to api.indexnow.org, which passes them on to Bing, Yandex, Seznam, Naver
#             and the other IndexNow engines. The key is the public file public/<32 hex characters>.txt.
#
#   bash ci/notify-search.sh snapshot [site-url]  before the deploy: print the live sitemap's pages as JSON
#                                                 {"<page url>": "<lastmod>"} on stdout; prints nothing if that fails
#   bash ci/notify-search.sh notify [site-url]    after the deploy: compare with the snapshot, notify the changed pages
#   bash ci/notify-search.sh status [site-url]    read only: Google's index status of every sitemap page (URL Inspection
#                                                 API), for manual checks; needs GSC_KEY_FILE
#
# site-url defaults to https://thehot.vn. notify reads these environment variables:
#   SITEMAP_BEFORE    output of `snapshot` from before the deploy. Empty or not valid: every page counts as changed.
#   GSC_KEY_FILE      Google service-account key (JSON) that is a Full user of the Search Console property. Unset or
#                     empty: Google is skipped, with a warning.
#   GSC_SITE          Search Console property, default sc-domain:<host of site-url>.
#   EXPECTED_LASTMOD  the dates this build was made with, default src/generated/sitemap-lastmod.json (written by
#                     ci/sitemap-lastmod.sh). Nothing is sent until the live sitemap shows exactly these dates, that is
#                     until the new version is being served. Set it to "" to skip the check (local dry runs).
#   INDEXNOW_URL      IndexNow endpoint, default https://api.indexnow.org/indexnow (any IndexNow engine's endpoint works).
#   DRY_RUN=1         print what would be sent and send nothing. It still reads the live site and, with a key, asks
#                     Google for a token and reads the sitemap's status in Search Console, which changes nothing.
#
# Exit status of notify and status: 0 when everything worked or nothing changed, 1 when something failed or was
# skipped. The Jenkinsfile then marks only its stage UNSTABLE: notifying search engines never fails a deploy.
# snapshot always exits 0. Needs bash, curl, jq, awk and (for Google) openssl. Never prints the key or a token.
set -uo pipefail
# No `set -e`: each step checks its own result, so a failure at one engine never stops the other.

mode=${1:-}
site_url=$(printf '%s' "${2:-https://thehot.vn}" | sed 's#/*$##')
dry_run=false
case "${DRY_RUN:-}" in 1 | true | yes) dry_run=true ;; esac
status=0

log() { printf 'notify-search: %s\n' "$*" >&2; }
warn() {
  printf 'notify-search: WARNING: %s\n' "$*" >&2
  status=1
}
die() {
  printf 'notify-search: %s\n' "$*" >&2
  exit 1
}

usage="usage: bash ci/notify-search.sh snapshot|notify|status [site-url]"
case "$mode" in snapshot | notify | status) ;; *) die "$usage" ;; esac
[[ $site_url =~ ^https?://[^/]+$ ]] || die "site URL must be an origin like https://thehot.vn (got '$site_url')."
host=${site_url#*://}
gsc_site=${GSC_SITE:-sc-domain:$host}
indexnow_url=${INDEXNOW_URL:-https://api.indexnow.org/indexnow}
sitemap_url="$site_url/sitemap.xml"
cd "$(dirname "${BASH_SOURCE[0]}")/.." || die "cannot cd to the repository root."

for tool in curl jq awk; do
  command -v "$tool" >/dev/null || die "'$tool' is not installed."
done

# --- Sitemap -----------------------------------------------------------------------------------------------------

# Live sitemap → {"<page url>": "<lastmod>"} on stdout. Only <loc> counts; <image:loc> entries are not pages.
# Fails on an HTTP error, or when the body has no page on this site.
live_pages() {
  local xml pages
  xml=$(curl -fsS --max-time 30 --retry 2 --retry-delay 3 -H 'Cache-Control: no-cache' "$sitemap_url") || return 1
  # One record per </url>; mawk and gawk both take a regular expression as RS.
  pages=$(printf '%s' "$xml" | tr -d '\r\n' | awk '
    BEGIN { RS = "</url>" }
    match($0, /<loc>[^<]*<\/loc>/) {
      loc = substr($0, RSTART + 5, RLENGTH - 11)
      lastmod = ""
      if (match($0, /<lastmod>[^<]*<\/lastmod>/)) lastmod = substr($0, RSTART + 9, RLENGTH - 19)
      print loc "\t" lastmod
    }' | jq -Rn '[inputs | split("\t") | {key: (.[0] | gsub("&amp;"; "&") | gsub("^\\s+|\\s+$"; "")),
                                         value: (.[1] // "" | gsub("^\\s+|\\s+$"; ""))}] | from_entries') || return 1
  jq -e --arg origin "$site_url" 'length > 0 and all(keys[]; . == $origin or startswith($origin + "/"))' \
    <<<"$pages" >/dev/null || {
    log "$sitemap_url has no page URL on $site_url."
    return 1
  }
  printf '%s\n' "$pages"
}

# {"<page url>": date} → {"<path>": date}, the shape of src/generated/sitemap-lastmod.json ("https://thehot.vn" → "/").
by_path() {
  jq -c 'with_entries(.key |= (sub("^https?://[^/]+"; "") | if . == "" then "/" else . end))'
}

# --- Google ------------------------------------------------------------------------------------------------------

token=""

# Service-account JWT (RS256) → OAuth access token in $token. $1 = scope.
google_token() {
  local scope=$1 now header claims signature response code body
  command -v openssl >/dev/null || {
    log "'openssl' is not installed; it signs the token request."
    return 1
  }
  b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
  now=$(date +%s)
  header=$(printf '{"alg":"RS256","typ":"JWT"}' | b64url)
  claims=$(jq -cn --arg iss "$(jq -r .client_email "$GSC_KEY_FILE")" --arg scope "$scope" --argjson iat "$now" \
    '{iss: $iss, scope: $scope, aud: "https://oauth2.googleapis.com/token", iat: $iat, exp: ($iat + 600)}' | b64url) || return 1
  # The private key goes to openssl through a pipe, never through a file or an argument.
  signature=$(printf '%s.%s' "$header" "$claims" |
    openssl dgst -sha256 -sign <(jq -r .private_key "$GSC_KEY_FILE") 2>/dev/null | b64url) || {
    log "cannot sign the token request with the key (is it a valid service-account key?)."
    return 1
  }
  response=$(curl -sS --max-time 30 -w '\n%{http_code}' https://oauth2.googleapis.com/token \
    --data-urlencode grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer \
    --data-urlencode "assertion=$header.$claims.$signature")
  code=${response##*$'\n'}
  body=${response%$'\n'*}
  token=$(jq -er '.access_token // empty' <<<"$body" 2>/dev/null) || {
    log "Google token request failed: HTTP ${code:-none} $(jq -r '[.error, .error_description] | map(select(.)) | join(": ")' <<<"$body" 2>/dev/null)"
    return 1
  }
}

# Calls a Google API with the token in an Authorization header that curl reads from stdin (not visible in `ps`).
# $1 = method, $2 = URL, $3 = JSON body (optional). Sets api_code and api_body.
api_code=""
api_body=""
google_api() {
  local response
  local args=(-sS --max-time 30 -K - -X "$1" -w '\n%{http_code}')
  if [ -n "${3:-}" ]; then
    args+=(-H 'Content-Type: application/json' --data-binary "$3")
  else
    args+=(-H 'Content-Length: 0')
  fi
  response=$(printf 'header = "Authorization: Bearer %s"\n' "$token" | curl "${args[@]}" "$2")
  api_code=${response##*$'\n'}
  api_body=${response%$'\n'*}
}

google_error() {
  jq -r '.error | "\(.status // "") \(.message // "")"' <<<"$api_body" 2>/dev/null | head -c 300
}

# Checks GSC_KEY_FILE without printing any of it.
have_google_key() {
  if [ -z "${GSC_KEY_FILE:-}" ] || [ ! -s "$GSC_KEY_FILE" ]; then
    log "no Google service-account key (GSC_KEY_FILE unset or empty file)."
    return 1
  fi
  jq -e '.type == "service_account" and (.client_email | type) == "string" and (.private_key | type) == "string"' \
    "$GSC_KEY_FILE" >/dev/null 2>&1 || {
    log "GSC_KEY_FILE is not a Google service-account key (JSON with type, client_email, private_key)."
    return 1
  }
}

notify_google() {
  local api
  api="https://www.googleapis.com/webmasters/v3/sites/$(jq -rn --arg s "$gsc_site" '$s | @uri')/sitemaps/$(jq -rn --arg s "$sitemap_url" '$s | @uri')"
  google_token https://www.googleapis.com/auth/webmasters || return 1
  if $dry_run; then
    log "Google (dry run): would PUT sitemaps.submit for $sitemap_url on $gsc_site."
  else
    google_api PUT "$api"
    case "$api_code" in
      2??) log "Google: sitemap $sitemap_url re-submitted to $gsc_site (HTTP $api_code)." ;;
      401) log "Google: HTTP 401, the access token was rejected. $(google_error)"; return 1 ;;
      403) log "Google: HTTP 403, the service account is not a Full user of $gsc_site, or the Search Console API is off in its Google Cloud project. $(google_error)"; return 1 ;;
      *) log "Google: sitemaps.submit failed, HTTP ${api_code:-none}. $(google_error)"; return 1 ;;
    esac
  fi
  # Read back what Search Console knows about the sitemap (read only).
  google_api GET "$api"
  if [ "$api_code" = 200 ]; then
    log "Google: Search Console now shows $(jq -r '"last submitted \(.lastSubmitted // "-"), last downloaded \(.lastDownloaded // "-"), pending \(.isPending // false), errors \(.errors // 0), warnings \(.warnings // 0)"' <<<"$api_body")."
  else
    log "Google: could not read the sitemap status back (HTTP ${api_code:-none}); the submit itself worked."
  fi
}

# --- IndexNow ----------------------------------------------------------------------------------------------------

# The key is the name of the one public/<32 lowercase hex>.txt file, and the file holds exactly that key.
indexnow_key() {
  local files=() file key
  for file in public/*.txt; do
    [[ $(basename "$file") =~ ^[0-9a-f]{32}\.txt$ ]] && files+=("$file")
  done
  if [ "${#files[@]}" -ne 1 ]; then
    log "IndexNow: expected exactly one key file public/<32 hex characters>.txt, found ${#files[@]}."
    return 1
  fi
  key=$(basename "${files[0]}" .txt)
  [ "$(cat "${files[0]}")" = "$key" ] || {
    log "IndexNow: ${files[0]} must contain exactly its own name (the key)."
    return 1
  }
  printf '%s\n' "$key"
}

# $1 = JSON array of changed URLs.
notify_indexnow() {
  local urls=$1 key key_url served payload response code body count
  key=$(indexnow_key) || return 1
  key_url="$site_url/$key.txt"
  count=$(jq length <<<"$urls")
  payload=$(jq -cn --arg host "$host" --arg key "$key" --arg loc "$key_url" --argjson urls "$urls" \
    '{host: $host, key: $key, keyLocation: $loc, urlList: $urls}')
  $dry_run && log "IndexNow (dry run): would POST to $indexnow_url: $payload"
  # IndexNow fetches the key file to check the key; without it every submission is refused with 403.
  served=$(curl -fsS --max-time 20 "$key_url" 2>/dev/null)
  if [ "$served" != "$key" ]; then
    log "IndexNow: $key_url does not serve the key (not deployed yet?); not submitting."
    return 1
  fi
  $dry_run && return 0
  response=$(curl -sS --max-time 30 -w '\n%{http_code}' -H 'Content-Type: application/json; charset=utf-8' \
    --data-binary "$payload" "$indexnow_url")
  code=${response##*$'\n'}
  body=$(printf '%s' "${response%$'\n'*}" | tr -s '\r\n' ' ' | head -c 300)
  case "$code" in
    200) log "IndexNow: $count URL(s) submitted (200 OK)." ;;
    202) log "IndexNow: $count URL(s) received (202 Accepted; the key is still being validated)." ;;
    400) log "IndexNow: 400 Bad Request, the request is malformed. $body"; return 1 ;;
    403) log "IndexNow: 403 Forbidden, the key was not accepted ($key_url missing or not matching). $body"; return 1 ;;
    422) log "IndexNow: 422 Unprocessable Entity, a URL is not on $host or the key does not match. $body"; return 1 ;;
    429) log "IndexNow: 429 Too Many Requests, treated as spam; do not resend unchanged URLs. $body"; return 1 ;;
    *) log "IndexNow: unexpected answer HTTP ${code:-none}. $body"; return 1 ;;
  esac
}

# --- Modes -------------------------------------------------------------------------------------------------------

snapshot() {
  local pages
  if pages=$(live_pages); then
    log "snapshot of $sitemap_url: $(jq length <<<"$pages") pages"
    jq -r 'to_entries[] | "  \(.key) \(.value)"' <<<"$pages" >&2
    jq -c . <<<"$pages"
  else
    log "cannot read $sitemap_url before the deploy; every page will count as changed."
  fi
}

# True when the live sitemap ($1, by URL) shows exactly the dates in $expected (by path).
is_this_build() {
  jq -e --argjson want "$expected" '. == $want' <<<"$(by_path <<<"$1")" >/dev/null
}

expected=""

notify() {
  local before=${SITEMAP_BEFORE:-} after="" expected_file=${EXPECTED_LASTMOD-src/generated/sitemap-lastmod.json}
  local tries=6 try mismatch changed removed google=skipped indexnow=skipped
  if $dry_run; then
    tries=1
    log "DRY RUN: nothing will be sent."
  fi

  if [ -z "$expected_file" ]; then
    log "not checking that the live sitemap is this build's (EXPECTED_LASTMOD is empty)."
  elif jq -e 'type == "object" and length > 0' "$expected_file" >/dev/null 2>&1; then
    expected=$(jq -c . "$expected_file")
  else
    warn "$expected_file is missing or not valid; cannot check that the live sitemap is this build's."
  fi

  # Wait until the site serves this build's sitemap, so that crawlers coming right away see the new pages.
  for try in $(seq 1 "$tries"); do
    after=$(live_pages) || after=""
    if [ -n "$after" ] && { [ -z "$expected" ] || is_this_build "$after"; }; then
      break
    fi
    [ "$try" -ge "$tries" ] || sleep 10
  done
  if [ -z "$after" ]; then
    warn "cannot read $sitemap_url after the deploy; nothing sent."
    return
  fi
  if [ -n "$expected" ] && ! is_this_build "$after"; then
    mismatch=$(jq -rn --argjson live "$(by_path <<<"$after")" --argjson want "$expected" \
      '[($want + $live) | keys[] as $p | select($live[$p] != $want[$p])
        | "\($p) live \($live[$p] // "none"), build \($want[$p] // "none")"] | join("; ")')
    if $dry_run; then
      log "note: the live sitemap is not this build's yet ($mismatch); expected in a dry run before the deploy."
    else
      warn "after $tries tries the live sitemap still differs from this build ($mismatch); nothing sent. Is the new version served?"
      return
    fi
  fi

  if [ -n "$before" ] && jq -e 'type == "object" and length > 0' <<<"$before" >/dev/null 2>&1; then
    changed=$(jq -cn --argjson before "$before" --argjson after "$after" \
      '[$after | to_entries[] | select($before[.key] != .value) | .key]')
    removed=$(jq -rn --argjson before "$before" --argjson after "$after" \
      '[$before | keys[] | select($after[.] == null)] | join(" ")')
    [ -z "$removed" ] || log "no longer in the sitemap (not submitted): $removed"
  else
    log "no snapshot from before the deploy; every page counts as changed."
    changed=$(jq -c 'keys' <<<"$after")
  fi

  if [ "$(jq length <<<"$changed")" -eq 0 ]; then
    log "no page changed ($(jq length <<<"$after") pages, same <lastmod> as before the deploy); nothing to send."
    return
  fi
  log "changed pages ($(jq length <<<"$changed")):"
  jq -r --argjson after "$after" '.[] | "  \(.) \($after[.])"' <<<"$changed" >&2

  if ! have_google_key; then
    warn "Google skipped: no usable service-account key."
  elif notify_google; then
    google=ok
  else
    google=failed
    warn "Google was not notified."
  fi
  if notify_indexnow "$changed"; then indexnow=ok; else indexnow=failed; warn "IndexNow was not notified."; fi
  log "done: Google $google, IndexNow $indexnow$($dry_run && printf ' (dry run)')."
}

# Read only: Google's view of every page in the live sitemap (URL Inspection API, 2000 calls a day per property).
inspect() {
  local pages url verdict coverage crawl canonical row='%-30s %-8s %-36s %-26s %s\n'
  have_google_key || die "status needs GSC_KEY_FILE."
  google_token https://www.googleapis.com/auth/webmasters.readonly || die "cannot get a Google token."
  pages=$(live_pages) || die "cannot read $sitemap_url."
  # shellcheck disable=SC2059 # $row is the format
  printf "$row" URL VERDICT COVERAGE LAST_CRAWL GOOGLE_CANONICAL
  while IFS= read -r url; do
    google_api POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect \
      "$(jq -cn --arg url "$url" --arg site "$gsc_site" '{inspectionUrl: $url, siteUrl: $site}')"
    if [ "$api_code" != 200 ]; then
      warn "$url: URL Inspection failed, HTTP ${api_code:-none}. $(google_error)"
      continue
    fi
    IFS=$'\t' read -r verdict coverage crawl canonical < <(jq -r '.inspectionResult.indexStatusResult
      | [.verdict // "-", .coverageState // "-", .lastCrawlTime // "-", .googleCanonical // "-"] | @tsv' <<<"$api_body")
    # shellcheck disable=SC2059
    printf "$row" "$url" "$verdict" "$coverage" "$crawl" "$canonical"
  done < <(jq -r 'keys[]' <<<"$pages")
}

case "$mode" in
  snapshot)
    snapshot
    exit 0
    ;;
  notify) notify ;;
  status) inspect ;;
esac
exit "$status"
