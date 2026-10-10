# NOKTO clone (v2)

A Next.js recreation of the public [NOKTO restaurant template](https://nokto-template.vercel.app/), rebuilt from scratch with the [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template) `clone-website` workflow (template v0.6.1). It replaces the earlier `nokto-clone` attempt, which is kept separately for comparison.

## Run locally

Requires Node.js 24 or newer.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
```

`scripts/download-nokto-assets.mjs` re-downloads the images, SVGs, fonts, and icons from the source site.

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

## How it is built

- Design tokens, fonts, and spacing come from the source stylesheet (`src/app/globals.css`). Type sizes are fluid in both viewport width and height, as on the source.
- `src/components/sites/nokto/` holds the site: `ui.tsx` (typography/layout primitives), `motion.ts` (shared animation values), `site.ts` (site data), `chrome/` (navigation dialog, fixed menu button, backdrop, footer, preloader, cursor, page transition, Lenis smooth scrolling), and one folder per page.
- Motion (`motion/react`) drives entrances and scroll reveals; Lenis provides smooth wheel scrolling.

## Reservation form

The form reproduces the source's three steps, validation, and confirmation screen, but **sends nothing**: submission is simulated locally and the confirmation screen says so. The source posts to its own API and email provider.

## Notes

- Inspection notes and the build brief: `docs/research/nokto/brief.md`. Comparison screenshots: `docs/design-references/nokto/`.
- The legal pages reproduce the source template's sample text; they do not describe this app.
- Images, logo, fonts, and copy belong to the source template's owner. Keep the repository private and check the template's licence before any public use.
