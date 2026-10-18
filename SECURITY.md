# Security Policy

This repository is the source of https://thehot.vn, the website of The Hot Beer
Garden in Đà Lạt. The repository is public, and every commit merged to `main` is
built and deployed to the live site automatically.

## Supported versions

Only the live site is supported: https://thehot.vn, built from the latest commit
on `main`. There are no releases or older versions to patch; a fix ships when it
is merged to `main`.

## What the site handles

- There are no user accounts, logins or passwords.
- There is no database and no API of its own.
- The reservation form does **not** send any data. Submission is simulated in
  the browser, and the last screen asks guests to call or message the venue to
  confirm.

The most likely issues are therefore in the pages themselves (for example
injected content or unsafe links), in third-party scripts the site loads, in the
build and deploy scripts in this repository, or in secrets committed by mistake.

## Reporting a vulnerability

Please do **not** put vulnerability details in a public issue, pull request,
discussion or comment.

1. **Preferred:** GitHub private vulnerability reporting for this repository:
   <https://github.com/qkenn04/thehot/security/advisories/new>.
   As of 2026-10-15 this feature is **not enabled** in the repository
   settings, so the form may not be available.
2. **If the form is not available:** open a
   [new issue](https://github.com/qkenn04/thehot/issues/new) titled
   "Request for a private security contact" and include **no details**: no
   description of the problem, no affected URL or file, no proof of concept.
   A maintainer will reply with a private way to send the report.

Once you have a private channel, please include, when available:

- A clear description of the issue and its impact
- The affected URL, file, commit or configuration
- Steps to reproduce, or a minimal proof of concept
- Any suggested fix or mitigation
- Whether and how you would like to be credited

## What to expect

This is a small project maintained on a best-effort basis. There is no bug
bounty.

- We aim to acknowledge a report within about 7 days.
- We will investigate, keep you updated, and tell you when a fix is live.
- We will coordinate with you before anything is disclosed publicly, and ask
  you to do the same.

## Scope

In scope:

- The site code in this repository as served at https://thehot.vn: pages,
  components, metadata and structured data, `next.config.ts`
- The build, CI and helper scripts in this repository: `Dockerfile`,
  `Jenkinsfile`, `ci/`, `seo/`, `scripts/`
- Repository configuration, and secrets or credentials committed to this
  repository by mistake
- Scripts or requests added by the site that send visitor data somewhere not
  described on https://thehot.vn/privacy

The server and CI configuration behind the site is kept in a separate private
repository. You can still report problems you observe on https://thehot.vn (for
example response headers or redirects) through the channel above.

Out of scope:

- Third-party services and their own vulnerabilities: Cloudflare, Facebook,
  Messenger, Instagram, TikTok, Zalo, Google (Maps, Business Profile, Search),
  TripAdvisor, GitHub
- Denial of service, load or stress testing, and high-volume automated scanning
- Social engineering or phishing of the venue's staff, the owner or the
  maintainers
- Physical attacks on the venue or on any equipment
- Automated scanner output without a demonstrated impact on this site

## Testing rules

- Test against your own local copy whenever possible (`npm ci && npm run dev`,
  or the Docker image described in [README.md](README.md#cicd)).
- Do not test against production in ways that affect visitors or data: no
  denial of service, no high-volume or automated scanning, no attempts to change
  site content, no attempts to reach other people's data.
- Do not try to access the CI or server infrastructure.
- If you come across data that is not yours, stop, do not keep it, and report
  it.
- Give us reasonable time to fix the issue before any public disclosure.
