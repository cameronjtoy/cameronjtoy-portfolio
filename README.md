# cameronjtoy-portfolio

Cameron Toy's personal portfolio: a scroll-driven 3D site built with React, React Three Fiber, and D3, hosted on GitHub Pages.

The build plan lives in [docs/plans/](docs/plans/00-overview.md). Each subplan ships as its own PR.

## Develop

```sh
npm install
npm run dev
```

## Check

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npm run test:e2e   # needs `npx playwright install chromium` once
```

## Content

All resume text lives in [src/content/resume.ts](src/content/resume.ts).

## Deploy

Pushing to `main` builds and deploys through [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
