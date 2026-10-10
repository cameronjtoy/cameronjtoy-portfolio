# cameronjtoy-portfolio

Cameron Toy's personal portfolio: a scroll-driven 3D site built with React, React Three Fiber and D3, hosted on GitHub Pages at <https://cameronjtoy.github.io/cameronjtoy-portfolio/>.

Each resume section is a scene: a rail line across a prairie, a BNSF train with one car per highlight, a medical records office, four small vignettes for earlier roles, a live Raft cluster and a hash chain for projects, and a D3 skill tree at the end.

Visitors who prefer reduced motion, or whose browser has no WebGL, get a plain page with the same content.

## Develop

```sh
npm install
npm run dev
```

Node 22 is the supported version (see `.nvmrc`).

## Check

```sh
npm run lint
npm run format:check
npm run typecheck
npm test            # unit tests
npm run build
npm run size        # gzipped size budgets for the built chunks
npm run test:e2e    # browser tests; needs `npx playwright install` once
```

`npm run test:e2e` runs Chromium, Firefox and WebKit. CI runs Chromium only.

## Where things are

| Path                                           | What                                                            |
| ---------------------------------------------- | --------------------------------------------------------------- |
| [src/content/resume.ts](src/content/resume.ts) | All resume text. Edit content here.                             |
| [src/engine/](src/engine/)                     | The canvas, scroll tracking, scene registry and layout helpers. |
| [src/sections/](src/sections/)                 | One folder per section: its DOM and its 3D scene.               |
| [src/sim/](src/sim/)                           | The Raft and hash-chain models behind the projects section.     |
| [src/design/](src/design/)                     | Palette, lighting, materials and small maths helpers.           |
| [docs/plans/](docs/plans/00-overview.md)       | The build plan and one note per PR.                             |

To add or replace a scene, write a component taking `SceneProps`, point the section's entry in [src/engine/registry.ts](src/engine/registry.ts) at it, and read scroll state with `getSection(id)` inside `useFrame`.

## Deploy

Pushing to `main` builds and deploys through [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The workflow passes the GitHub Pages base path and address to the build, so renaming the repo or adding a custom domain needs no code change.

The link-preview image is [public/og.png](public/og.png), a screenshot of the hero. Retake it if the hero changes.
