# Contributing

This repository is the source of https://thehot.vn, the live website of The Hot
Beer Garden in Đà Lạt. It is a Next.js 16 app, not a template: changes here are
changes to a real venue's public site.

> **Merging to `main` deploys to production.** Jenkins polls GitHub every 5
> minutes and runs *sitemap dates → check → build → smoke test → push → deploy*
> on every new commit on `main`. A merged pull request is usually live about 5–7
> minutes later (allow up to about 10). There is no staging environment and no
> manual approval step, and pull requests are not built before merge, so the
> checks you run on your machine are the gate.

Project documentation is in [`docs/`](docs/README.md), written in Vietnamese.
Start at [`docs/README.md`](docs/README.md): product spec, architecture, content
data model, decisions (ADRs), testing and deployment. AI coding agents also read
[`AGENTS.md`](AGENTS.md).

For a change bigger than a small fix, open an issue first so the approach can be
agreed before you spend time on it.

## Development setup

**Prerequisites:** Node.js 24 (see `.nvmrc`; the Docker build pins the exact
version in `NODE_VERSION` in the [`Dockerfile`](Dockerfile)), npm and Git.
Docker is only needed to run the pipeline's image checks locally.

```bash
git clone https://github.com/qkenn04/nokto-clone-v2.git
cd nokto-clone-v2
npm ci
npm run dev        # http://localhost:3000
```

`AGENTS.md` starts with a block between `<!-- BEGIN:nextjs-agent-rules -->` and
`<!-- END:nextjs-agent-rules -->` that `next dev` writes and keeps up to date.
Leave it as it is. If `next dev` changes it (after a Next.js upgrade, for
example), keep that change out of unrelated pull requests.

## Workflow

1. **Branch from an up-to-date `main`** with a prefix that says what the change
   is: `feat/`, `fix/`, `content/`, `seo/`, `perf/` or `docs/` (for example
   `content/confirm-events`, `seo/structured-data`, `perf/image-cache-ttl`).
2. **Keep it focused.** One logical change per pull request.
3. **Commit with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
   in English**: `type(scope): description`, for example
   `fix(seo): give inner pages the shared share-card image`. Types, scopes and
   examples are in [`docs/dev/commit-conventions.md`](docs/dev/commit-conventions.md).
   When an AI agent co-wrote a commit, add a `Co-Authored-By:` trailer.
4. **Run the checks:**

   ```bash
   npm run check                       # lint + typecheck + sitemap check + production build
   python3 scripts/check-links.py .    # when you changed any Markdown file
   ```

   If you changed the `Dockerfile`, `ci/`, `next.config.ts` or anything that
   affects the built image, also run the Docker steps in
   [`docs/dev/testing.md`](docs/dev/testing.md#2-lệnh).
5. **Open a pull request against `main`** and fill in the template. It includes
   the documentation Definition of Done checklist: update the matching docs in
   the same pull request, tick what applies and delete what does not.
6. **Review and merge.** A maintainer reviews the change. Merge only after
   `npm run check` passes and the review is approved.
7. **After the merge,** check the change on https://thehot.vn once Jenkins has
   deployed it, using the manual checklist in
   [`docs/dev/testing.md`](docs/dev/testing.md#6-kiểm-tay-m). If the new version
   works but is wrong, revert the pull request on GitHub; the revert deploys
   like any other commit ([rollback](docs/ops/deployment.md#7-rollback)).

## Rules for this repository

- **Pages and the sitemap.** When you add, remove or move a page under
  `src/app`, update [`seo/sitemap-pages.json`](seo/sitemap-pages.json) (the page
  and its `sources`). The sitemap check, and therefore the build, fails when the
  file drifts from `src/app` or lists a path that no longer exists. Add new
  routes to the list in [`ci/smoke-test.sh`](ci/smoke-test.sh) too.
- **Business facts have one source.** The venue's name, opening hours,
  address, phone number, map link and social links are defined in
  [`src/components/sites/nokto/site.ts`](src/components/sites/nokto/site.ts).
  Import them from `site` instead of typing them into components, metadata or
  structured data, and when a fact changes, search the code for any text that
  still repeats the old value. Do not guess: a fact the owner has not confirmed
  stays unset in `pendingFacts`.
- **Events.** The home page programmes are `homeEvents` in
  [`src/components/sites/the-hot/home/content.ts`](src/components/sites/the-hot/home/content.ts).
  Sample programmes keep `illustrative: true`, which labels them as examples
  on the page and keeps them out of the structured data. Real programmes
  confirmed by the owner do not have the flag and carry real dates with the
  `+07:00` time zone.
- **Replacing images and video.** Files under `public/` and optimized images
  are cached by Cloudflare and browsers for 7 days. A file replaced under the
  same name can keep showing the old version for up to a week unless a
  maintainer purges it on Cloudflare, and even a purge does not clear
  visitors' browsers. Prefer a new file name (for example `main.v2.mp4`) and
  update every reference, including `seo/sitemap-pages.json` when the old path
  is listed there. See [`docs/ops/deployment.md`](docs/ops/deployment.md).
- **Large media.** Compress photos and video before committing them; the
  approach and commands are in
  [`docs/specs/003-performance/`](docs/specs/003-performance/). Raw `.mov`
  masters and `*.orig.*` originals under `public/videos/` are ignored by git and
  must stay out of the repository.
- **Template assets.** Files under `public/sites/nokto/` belong to the owner of
  the NOKTO template. Do not use them for anything new (see the
  [README](README.md#notes)).
- **No secrets, no generated files, no infrastructure details.** This
  repository is public. Never commit `.env` files, tokens, keys or passwords,
  server addresses, internal host names or ports, or server paths. Do not commit
  `src/generated/`: CI writes it before each build. Infrastructure is documented
  in a separate private repository.
- **Third parties.** A change that sends visitor data to a new service (an
  analytics script, an embed) must update the `/privacy` page and
  [`docs/security/threat-model.md`](docs/security/threat-model.md) in the same
  pull request.
- **Decisions.** An architectural decision (adopting or dropping a technology
  or a third-party service, changing how the site is built or deployed) gets an
  ADR in [`docs/adr/`](docs/adr/README.md), copied from
  [`0000-template.md`](docs/adr/0000-template.md), with status "Đề xuất"
  (proposed) until the owner accepts it.
- **Documentation.** Docs live in [`docs/`](docs/README.md): Vietnamese prose,
  with file names, identifiers, commands and commit messages in English. The
  root files (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`) stay in English.

## Protecting `main`

As of 2026-10-15, `main` has no branch protection: collaborators with push
access can push to it directly, and every push deploys. Please go through a pull
request anyway, even for small changes. Worth considering later: requiring a
pull request (and, once pull requests are built by CI, a passing build) before
anything reaches `main`.

## Bugs, ideas and questions

- **Something wrong on the site, or an idea:** open an
  [issue](https://github.com/qkenn04/nokto-clone-v2/issues/new/choose) with the
  bug report or feature request form.
- **A security problem:** do not open a public issue with details; follow
  [SECURITY.md](SECURITY.md).
- **Questions about the code or the docs:** open an issue in this repository.
