# PR 1: Foundation and deploy

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- Vite + React 19 + TypeScript scaffold with oxlint, Prettier, Vitest, and Playwright.
- `src/content/resume.ts`: the typed source of truth for every piece of resume text.
- A plain, accessible, responsive HTML rendering of the whole resume. Later PRs layer 3D scenes on top; this layout stays as the fallback for reduced motion and no WebGL.
- CI (`.github/workflows/ci.yml`) and GitHub Pages deploy (`.github/workflows/deploy.yml`).

## Change from the overview

The overview assumed a `cameronjtoy.github.io` user-site repo. The repo is `cameronjtoy/cameronjtoy-portfolio`, so the site is served from `/cameronjtoy-portfolio/`. The deploy workflow passes the Pages base path to Vite through `BASE_PATH`, so a later rename or custom domain needs no code change. All asset URLs must go through `import.meta.env.BASE_URL` or be imported.

## Content edits made while copying the resume

- The phone number is not published.
- Skills are regrouped; the duplicate "Angular" is removed; "MySql" and "Cuda" are written "MySQL" and "CUDA".
- University at Buffalo: "reducing runtime performance and achieving a 25% reduction in rendering time" now reads "achieving a 25% reduction in rendering time"; "innovating a data profiler" reads "building a data profiler".
- "BNSF Railways" is written "BNSF Railway", the company's name.
- TypeScript is added to Languages, since Prem is written in it.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

## One-time setup after merge

Repository Settings → Pages → Source: GitHub Actions.
