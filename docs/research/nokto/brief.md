# NOKTO build brief

Source: https://nokto-template.vercel.app/ (Next.js App Router + Tailwind v4 + Motion + Lenis).
Inspected: 10 October 2026. Local app: `/home/qkenn/project/nokto-clone-v2`.

## Route map and ownership

| Source | Local route | Owner files |
| --- | --- | --- |
| `/` | `/` | `src/app/page.tsx`, `src/components/sites/nokto/home/*` |
| (404) | not-found | `src/app/not-found.tsx` |
| (runtime error) | error boundary | `src/app/error.tsx` |
| `/menu` | `/menu` | `src/app/menu/page.tsx`, `src/components/sites/nokto/menu/*` |
| `/about` | `/about` | `src/app/about/page.tsx`, `src/components/sites/nokto/about/*` |
| `/reservation` | `/reservation` | `src/app/reservation/page.tsx`, `src/components/sites/nokto/reservation/*` |
| `/terms`, `/privacy` | same | `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/components/sites/nokto/legal/*` |

Shared files (layout, chrome, tokens, primitives) are owned by the integrator; page builders do not edit them.

## Shared foundation (already built)

- `src/app/globals.css` — tokens copied from the source stylesheet. Colours: `background` zinc-950, `surface` zinc-900, `foreground` stone-100, `muted` zinc-400, `subtle` zinc-500, `border` zinc-800, `border-subtle` zinc-900, `accent` amber-200, `error` red-400. Fluid sizes: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-editorial`, `text-body`, `text-label`, `text-small`, `text-category-name`, `text-nav-item`, `text-closing`, `text-stat`, `text-signature`. Utilities: `type-label`, `type-serif-editorial`, `section-pad`, `section-pad-y(-sm|-lg|-lg-tight|-lg-loose)`, `mask-fade-right(-hero)`, `mask-fade-bottom`, `ease-cinema`. Arbitrary values such as `leading-[var(--leading-tight)]` and `duration-[var(--duration-fast)]` work as in the source.
- `src/components/sites/nokto/ui.tsx` — `Section`, `Heading`, `Text`, `Stack`, `buttonClass`, `ButtonLink`, `cx`. These mirror the source's own primitives, so the class strings they produce match the source DOM. Use `cx`, not `cn`: tailwind-merge drops `text-h1` when combined with `text-muted`.
- `src/components/sites/nokto/motion.ts` — `EASE_CINEMA`, `fadeUp`, `revealOnView`, `slideVariants`, `scaleVariants` (the source's helpers). Animation: `motion/react` (Motion 14).
- `src/components/sites/nokto/site.ts` — site data (`site`, `siteImage(file)`).
- `src/components/sites/nokto/chrome/` — `PersistentChrome` (fixed Menu button, navigation dialog, fixed backdrop and fading logo on inner pages), `SiteFooter`/`InfoItem`, `FixedPhoto` (right-half photo pinned on desktop), `Backdrop`, `BrandMark`, `PageTransition` (`useRestartPage`, `usePageTick`), `Preloader`, `CustomCursor`, `SmoothScroll` (Lenis), `ScrollManager`.
- Assets: `public/sites/nokto/{logo.svg,images/*,fonts/*}`; downloaded by `scripts/download-nokto-assets.mjs`.

Inner page shell, as on the source:

```tsx
<main id="main-content" className="relative w-full">
  <FixedPhoto src={siteImage("hero-menu.jpg")} alt="…" />
  <div className="relative z-10 lg:w-1/2">…page content…</div>
  <SiteFooter />
</main>
```

## Source facts that drive the build

- Type sizes depend on viewport width **and height**; compare at several sizes.
- Inner pages: left column (`lg:w-1/2`) scrolls over a fixed right-half photo; the Menu button stays fixed; the top-left logo fades out over the first 220px.
- Smooth scrolling is Lenis (`duration 1.2`, expo easing). Reveals use Motion `whileInView`, `once`, margins around `-10%`/`-15%`.
- The reservation form posts to `/api/reservation` on the source. The local clone does not send data; it reproduces the UI, validation, and confirmation screen as a demo.
