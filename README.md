# thehot.vn — The Hot Beer Garden

A Next.js recreation of the public [NOKTO restaurant template](https://nokto-template.vercel.app/), rebuilt from scratch with the [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template) `clone-website` workflow (template v0.6.1). It replaces the earlier `nokto-clone` attempt, which is kept separately for comparison.

## Documentation (Tài liệu)

Project documentation, written in Vietnamese, starts at [`docs/README.md`](docs/README.md): product spec and non-functional budgets, architecture, content data model, ADRs, testing, configuration, deployment, runbooks and threat model. This repo is public, so server addresses, paths and secrets are documented only in the private [`qkenn04/infra-qkenn`](https://github.com/qkenn04/infra-qkenn).

## Run locally

Requires Node.js 24 or newer.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + sitemap check + production build
```

`scripts/download-nokto-assets.mjs` re-downloads the images, SVGs, fonts, and icons from the source site.

## CI/CD

Every push to `main` is built and deployed to https://thehot.vn (the old https://thehot.k2-tech.dev and https://nokto.qkenn.cloud redirect there):

```
GitHub main ──poll 5 min──▶ Jenkins (qkenn-ci, WSL) ──push──▶ Harbor (qkenn-ci) ◀──pull── VPS
                            sitemap dates → check → build → smoke test              deploy.sh
                            after the deploy: notify search engines (Google Search Console, IndexNow)
```

- `Jenkinsfile` — write the sitemap dates (`ci/sitemap-lastmod.sh`, below), `docker build --target check` (lint + typecheck + `check:sitemap`), build the `runner` image with `NEXT_PUBLIC_SITE_URL` and the Umami build args (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC`; no website ID means no tracker), run `ci/smoke-test.sh` (which also checks the tracker matches the website ID), push `thehot/web:<commit sha>` to Harbor, then SSH to the VPS with `deploy <sha>`.
- Search engines: the *Sitemap snapshot* stage reads the live sitemap just before the deploy, and the *Notify search engines* stage after it runs `ci/notify-search.sh`: it waits until the live sitemap shows this build's dates, works out which page URLs are new or have a new `<lastmod>`, re-submits the sitemap to Google through the Search Console API (`sitemaps.submit`, with a service-account key held in Jenkins) and posts those URLs to IndexNow (Bing and others; the key is the public file `public/<key>.txt`). Google's Indexing API is never used (it only allows job postings and livestreams). The stage cannot fail the build: any problem marks it UNSTABLE and the Discord message says so. Try it without sending anything: `DRY_RUN=1 EXPECTED_LASTMOD= bash ci/notify-search.sh notify` ([docs/dev/testing.md](docs/dev/testing.md#31-báo-máy-tìm-kiếm-chạy-thử), [ADR 0009](docs/adr/0009-notify-search-engines-after-deploy.md)).
- Sitemap `<lastmod>`: the *Sitemap dates* stage runs `ci/sitemap-lastmod.sh`, which gives each page in `seo/sitemap-pages.json` the date of the last commit on `main` that touched its `sources` or `shared` paths (`git log --first-parent`, so a merged PR counts from its merge commit) and writes it to `src/generated/sitemap-lastmod.json` (git-ignored). It runs on the agent because the Docker build context has no `.git`; the file goes into the build with the rest of the context and `src/app/sitemap.ts` reads it at build time. The stage fails on a shallow clone or a listed path with no commits. Without the file (a plain local `npm run build`) the sitemap just has no `<lastmod>`, and `ci/smoke-test.sh` fails on that image.
- The VPS side (forced-command `deploy.sh`, compose stack, Nginx vhost) and the Jenkins/Harbor setup live in [`qkenn04/infra-qkenn`](https://github.com/qkenn04/infra-qkenn) (`stacks/thehot/`, `ci/`).
- `deploy.sh` waits for the container healthcheck and rolls back to the previous image if it fails; it keeps the last 3 images for manual rollback.
- Diagrams (Archify, open the HTML in a browser): [`docs/archify/nokto-architecture.html`](docs/archify/nokto-architecture.html) for the system architecture and [`docs/archify/nokto-cicd.html`](docs/archify/nokto-cicd.html) for the pipeline and its failure paths. Edit the `*.json` beside them, then run `node ~/.claude/skills/archify/bin/archify.mjs finalize <architecture|workflow> <spec.json> <out.html> --quality showcase` from `docs/archify/`.
- Test the image locally the way CI does:

  ```bash
  bash ci/sitemap-lastmod.sh
  docker build --target check .
  docker build --target runner --build-arg NEXT_PUBLIC_SITE_URL=https://thehot.vn -t thehot:local .
  ci/smoke-test.sh thehot:local
  ```

## Routes

| Source | Local |
| --- | --- |
| `https://nokto-template.vercel.app/` | `/` |
| `/menu` | `/menu` |
| `/about` | `/about` |
| `/reservation` | `/reservation` |
| `/terms` | `/terms` |
| `/privacy` | `/privacy` |
| unknown paths | custom 404 |

To add or remove a page, update `seo/sitemap-pages.json` (the build fails if it drifts from `src/app`).

## How it is built

- Design tokens, fonts, and spacing come from the source stylesheet (`src/app/globals.css`). Type sizes are fluid in both viewport width and height, as on the source.
- `src/components/sites/nokto/` holds the site: `ui.tsx` (typography/layout primitives), `motion.ts` (shared animation values), `site.ts` (site data), `chrome/` (navigation dialog, fixed menu button, backdrop, footer, preloader, cursor, page transition, Lenis smooth scrolling), and one folder per page.
- Motion (`motion/react`) drives entrances and scroll reveals; Lenis provides smooth wheel scrolling.

## Reservation form

The form reproduces the source's three steps, validation, and confirmation screen, but **sends nothing**: submission is simulated locally and the confirmation screen says so. The source posts to its own API and email provider.

## Notes

- Inspection notes and the build brief: `docs/research/nokto/brief.md`. Comparison screenshots: `docs/design-references/nokto/`.
- The legal pages (`/terms`, `/privacy`) carry The Hot's own booking information and privacy notice (`src/components/sites/nokto/legal/content.ts`). `/privacy` describes Cloudflare Web Analytics, and Umami only in builds that load the Umami tracker (see [`docs/security/threat-model.md`](docs/security/threat-model.md)).
- Analytics (spec [`004-analytics`](docs/specs/004-analytics/spec.md)): every custom event goes through `track()` in `src/lib/analytics.ts`, which only sends allow-listed properties. Links and buttons carry `data-track*` attributes (`trackAttrs()`, usable in Server Components) and one `ClickTracker` listener sends them; Umami's own `data-umami-event` is not used because it reloads the page on same-tab links.
- Since 2026-10-14 the deployment at thehot.vn is The Hot Beer Garden's real site and search engines may index it (the `noindex` header was removed). The pages use The Hot's own content, but some NOKTO template files under `public/sites/nokto/` are still in use: `images/hero-backdrop.jpg` is the backdrop on every page (splash screen, inner pages and the desktop home intro), and `images/path.svg`, `path2.svg`, `path-horizontal.svg` and `check.svg` decorate the about and reservation pages. The owner chose to keep the backdrop for now; replacing it is planned ([ADR 0003](docs/adr/0003-allow-search-indexing.md)). The other files in that folder are no longer referenced but are still served. All of them belong to the template's owner: do not reuse them for anything new, and remove each one once nothing references it.
