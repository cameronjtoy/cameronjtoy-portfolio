# 3D cleanup: from blocky placeholders to refined low-poly

## Context

The nine-PR portfolio build is done and deployed. Every scene works, but the 3D objects read as placeholder geometry: nearly everything is a raw `boxGeometry`, `coneGeometry` or 8-sided cylinder with hard edges. Cameron's feedback is that they look clunky, specifically the **blocky shapes**, across **all scenes equally**. The chosen direction is **refined low-poly**: still built entirely in code with no model files, but with shapes that look deliberate.

Scope is shape and silhouette. Lighting and shadows, scroll-motion smoothing, and framing were not flagged and are left alone, apart from the one material change that bevelled shapes need to read correctly.

## Why it looks blocky today

- Bodies are single boxes: the locomotive is about six boxes, each car one or two, the office furniture one each.
- Edges are perfectly sharp, so nothing catches a highlight and adjacent boxes merge into slabs.
- Round things use 5 to 8 segments (wheels, the tank, tree trunks), so they read as polygons, not as stylised round.
- Silhouettes carry no profile: no sloped nose on the locomotive, no trapezoid on the hopper, no arch on the tunnel, single-cone trees, perfect-cone hills.
- `LowPolyMaterial` (`src/design/LowPolyMaterial.tsx`) forces `flatShading` on everything, which makes any rounded edge look faceted.

## Approach

### 1. A shared shape kit: `src/design/shapes.tsx`

Small components that replace raw geometry everywhere. Geometries are cached by their arguments so repeated parts share one buffer.

| Component | Built from | Replaces |
|---|---|---|
| `Block` | `RoundedBoxGeometry` from `three/addons` (no new dependency) | every `boxGeometry` body |
| `Round` | cylinder with 20+ segments and a bevelled rim, or `CapsuleGeometry` for domed ends | wheels, tank, posts, pots |
| `Profile` | `ExtrudeGeometry` of a 2D `Shape` with a bevel | anything with a side silhouette: cab and nose, hopper body, tunnel arch, envelope, bucket |
| `Lathe` | `LatheGeometry` | wheels with flanges, pawns, plant pot |
| `Rock` | subdivided icosahedron displaced by seeded noise (`src/design/random.ts`) | hills, the ridge, coal load |
| `Pine` | three stacked, slightly rotated tiers on a trunk | all single-cone trees |

`LowPolyMaterial` gains a `smooth` prop (`flatShading={false}`). Manufactured objects use smooth shading on bevelled shapes; organic ones (`Rock`, `Pine`) keep facets. That contrast is what makes the style look intended.

### 2. A model gallery for review: `src/dev/Gallery.tsx`

A dev-only page at `?gallery` showing each model alone on a slow turntable, without scrolling to find it. It is loaded behind `import.meta.env.DEV`, so it is not in the production build. It makes before/after review quick for both of us.

`scripts/shots.mjs` (`npm run shots`) captures a fixed set of views: each gallery model, plus each section at its key scroll stops on desktop and phone. Output goes to a git-ignored folder. This replaces the throwaway screenshot scripts used during the build.

### 3. Remodel scene by scene

Animation logic, timelines, DOM and tests stay as they are. Only the meshes change, and each animated part keeps the same ref structure so the `useFrame` code keeps working.

**Train** (`src/sections/bnsf/`, also used by the closing scene)
- `parts.tsx`: lathe wheels with flanges, truck side frames with axle boxes, knuckle-shaped couplers.
- `Locomotive.tsx`: extruded cab with a sloped nose and raked windscreen, rounded long hood with radiator grilles, cylindrical fuel tank, handrails and steps, number boards, ditch lights.
- `HopperCar.tsx`: trapezoid body with sloped discharge bays and ribs; `Rock` coal load.
- `WellCar.tsx`: corrugated containers (instanced ribs) with corner castings.
- `BoxCar.tsx`: door on rails, roof walk, end ladders.
- `FlatCar.tsx`: stake pockets, a framed board.
- `TankCar.tsx`: capsule tank with bands, a domed manway, a ladder and walkway.
- `Scenery.tsx`: rails with a head-and-foot profile, bevelled sleepers, `Pine` trees, a proper crossbuck.

**Landscape** (`src/sections/hero/Scene.tsx`, `src/sections/closing/Scene.tsx`)
- `Rock` hills in two depth layers, `Pine` trees, telegraph poles with crossarms and insulators, a round sun.
- Closing: an arched stone portal (`Profile`) and a `Rock` ridge in place of the 7-sided cylinder.

**Office** (`src/sections/stony-brook/`)
- `Room.tsx`: skirting board and a window on the wall, a desk with a drawer unit, a chair, a scanner-style transform unit with a sloped feed tray, a leafy plant.
- `Monitor.tsx`, `Printer.tsx`, `Cabinet.tsx`: rounded casings, bezels, recessed drawer fronts with label holders.
- `Papers.tsx`, `Board.tsx`: unchanged in behaviour; sheets get a slight thickness bevel.

**Vignettes** (`src/sections/earlier/`, `src/sections/personal/`)
- `Deploy.tsx`: a rack with rounded bays; a tapered bucket (`Lathe`).
- `Auth.tsx`: an extruded envelope with a real flap; a shield-shaped gate.
- `shared.tsx` `ChartPanel`: a rounded card with a bezel and axis ticks; rounded bars and dots in `Profiler.tsx` and `Rendering.tsx`.
- `ClusterView.tsx`: links as thin tubes instead of 1px lines, messages as small pills, a cleaner leader ring.
- `ChainView.tsx`: rounded blocks joined by actual torus chain links.
- `PodiumView.tsx`: rounded podium steps; lathe pawns.

### 4. Delivery

Five PRs, each staged for Cameron to commit (per the standing workflow), each branched from updated `main`:

1. Shape kit, `smooth` material option, gallery and `npm run shots`. No scene changes yet.
2. Train (changes the BNSF and closing scenes).
3. Landscape (hero, closing portal and ridge).
4. Office.
5. Vignettes.

Order follows what is on screen longest. PRs 2 to 5 depend only on PR 1.

### Guardrails

- **Size:** `npm run size` budgets stay as they are (20 kB gzipped per scene chunk; BNSF is at 10.9 kB today). If the train exceeds it, the shape kit moves to its own shared chunk rather than raising the limit.
- **Draw cost:** repeated parts (ribs, sleepers, handrail posts, corrugation) use `instancedMesh`, as the sleepers already do. Rounded boxes use 2 bevel segments, enough to catch light without multiplying triangles.
- **No behaviour change:** timelines, DOM and the 14 browser tests are untouched and must pass unmodified.

## Not included

- Shadows and lighting changes, scroll-motion smoothing, and layout/framing fixes (including the phone and contact-block issues noted in `docs/plans/06` to `08`). These were not what was flagged. Soft contact shadows would add a lot of depth once the shapes are right, and are the natural follow-up.
- Model files (GLTF). Everything stays procedural.

## Verification

- `npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run size && npm run test:e2e` passes on every PR with no test edits.
- `npm run shots` before and after each PR; I review each pair and include the notable ones in the hand-off.
- Cameron reviews models at `npm run dev` then `/?gallery`, and scrolls the real page once per PR, since I can only check stills.
- After the train PR, check frame rate by eye on the BNSF section, the heaviest scene.
