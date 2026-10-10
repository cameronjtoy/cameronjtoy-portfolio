# PR 6: Earlier experience

Part of the plan in [00-overview.md](00-overview.md).

## Scope

Develop for Good and University at Buffalo share one section. It plays four beats, one per highlight, each a small vignette shown in the same spot (`src/sections/earlier/`):

1. Develop for Good, deployment: image tiles arc from a server (EC2) into a storage bucket (S3).
2. Develop for Good, passwordless sign-in: emailed links fly to a gate while a grid of verified users fills. Each of the 50 squares is ten users.
3. University at Buffalo, data profiler: a histogram binned with `d3-array` rises bar by bar, and a processing-time bar drops by 20%.
4. University at Buffalo, visualisation: a chart's points plot and its line draws, and a rendering-time bar drops by 25%.

- DOM: the entry that owns the current beat shows, with one highlight card and its headline number.
- Chart data is illustrative, generated from a fixed seed.

## Shared changes

- `src/engine/beats.ts`: `makeBeats(count)` gives a section its beat functions. The Stony Brook timeline now uses it, and its tests moved to `beats.test.ts`.
- `src/engine/fit.ts`: `fitSplit` sizes and places a scene in the `split` layout. Taken from the Stony Brook scene, which now uses it.
- `ExperienceEntry` is removed; every experience entry now renders through `StepEntry`.

## Deferred to the styling pass

The vignettes are built to be legible, not polished. Things to revisit: the deploy scene is sparse, the sign-in gate is a plain slab, and the charts have no axes or labels.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

- Unit tests cover the beat functions for three and four beats, and the chart layouts.
- A browser test scrolls through two beats and checks the entry and the card both switch.
- Checked by screenshot: desktop at all four beats, and phone size.
