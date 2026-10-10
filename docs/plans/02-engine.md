# PR 2: 3D engine and scroll system

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- One fixed `<Canvas>` behind the page (`src/engine/Stage.tsx`), loaded lazily so the plain page never downloads three.js.
- Six scroll sections (`src/engine/sections.ts`): hero, bnsf, stony-brook, earlier, personal, closing.
- Scroll state kept outside React (`src/engine/scroll.ts`). Scenes call `getSection(id)` inside `useFrame` to read `progress` (0..1) and never re-render on scroll.
- `SceneSlot` moves each scene with its section: the scene scrolls in, stays pinned while `progress` runs, then scrolls out. The maths is the pure function in `src/engine/measure.ts`.
- Scene registry (`src/engine/registry.ts`) with one lazy chunk per scene. Only sections within half a viewport of the screen are mounted.
- Fallback: `prefers-reduced-motion` or no WebGL 2 renders the plain page from PR 1.
- Quality tier for phones and low-core devices (lower pixel ratio, no shadows, no antialiasing).
- Shared look in `src/design/`: palette, lighting rig, flat-shaded material.
- Section nav rail on wide screens.
- A placeholder scene per section that rotates and fills a row of cubes with `progress`.

## How a later PR adds a scene

1. Write `src/sections/<name>/Scene.tsx` with a default export taking `SceneProps`.
2. Point that section's entry in `registry.ts` at it.
3. Replace the section's children in `App.tsx` if the DOM content changes.

## Changes from the overview

- No `zustand`: the scroll store is about 100 lines with `useSyncExternalStore`.
- No `@react-three/drei` yet; it is added by the first scene that needs it.

## Known limits, left for the section PRs

- On phones a long panel (BNSF) is taller than the screen and covers the scene. PR 4 shows one bullet at a time.
- The canvas ignores pointer input. PR 7 turns it on for the cluster.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

Browser tests cover: the canvas appears, the rail follows the active section, and reduced motion gives the plain page with no canvas.
