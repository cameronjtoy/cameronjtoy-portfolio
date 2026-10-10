# PR 9: Robustness, accessibility and launch checks

Part of the plan in [00-overview.md](00-overview.md). Visual styling is deliberately left out; it gets its own pass after this.

## Scope

**Robustness**
- `StageBoundary`: if the three.js chunk fails to load, WebGL fails to start, or a scene throws, the page drops to the plain version instead of going blank.
- A `<noscript>` block gives the name and contact links when JavaScript is off.

**Sharing and search**
- Canonical URL, Open Graph and Twitter card tags, and theme colours for light and dark.
- `public/og.png`: a 1200x630 screenshot of the hero for link previews.
- `VITE_SITE_URL` supplies the absolute address those tags need. `.env` holds the current one and the deploy workflow overrides it with the real Pages address.
- `404.html`, built by Vite so its links carry the right base path. GitHub Pages serves it for unknown addresses.
- `robots.txt` allowing everything.

**Performance**
- `npm run size` (`scripts/check-bundle.mjs`) fails the build if a chunk exceeds its gzipped budget: 95 kB for the entry, 260 kB for the 3D engine, 20 kB for any scene or shared chunk. CI runs it. Current sizes are about 77 kB, 234 kB and at most 11 kB.
- The unused `shadows` quality setting is removed. No light casts shadows.

**Testing**
- Automated accessibility checks (axe) on the 3D experience and the plain page.
- A test that blocks the 3D chunk and checks the plain page appears.
- A test for the not-found page.
- Playwright now has Firefox and WebKit projects. CI stays on Chromium because headless WebGL in the other two on CI runners has not been verified.

## Lighthouse (mobile emulation, local production build)

| Category | Score |
| --- | --- |
| Performance | 52 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 92 |

First contentful paint 3.0 s, largest contentful paint 4.6 s, total blocking time 1,320 ms, layout shift 0. This run was before `robots.txt` was added, which was the SEO deduction.

Caveats on the performance number: Lighthouse throttles the CPU 4x and this run drew WebGL in software, so the blocking time is inflated compared with a real phone's GPU. It has not been measured on a real device.

## Not done, and why

- **Faster first paint.** The page is rendered entirely in the browser, so nothing shows until about 77 kB of JavaScript has loaded and run. Prerendering the plain HTML at build time is the fix and would be the largest single performance gain. It is its own piece of work.
- **Real-device and real-browser pass.** Everything here ran in Playwright's bundled browsers on a Mac. Safari on an iPhone in particular has not been tried.
- **Lighthouse's charset audit** failed although `<meta charset>` is the first tag in the head. Not investigated.
- **Styling.** Collected in the PR 6, 7 and 8 notes under "Deferred to the styling pass".

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run size && npm run test:e2e`
