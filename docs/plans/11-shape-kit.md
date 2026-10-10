# Cleanup PR 1: Shape kit, gallery and screenshots

First of five PRs in the 3D cleanup ([10-3d-cleanup.md](10-3d-cleanup.md)). It adds the tools; no scene looks different yet.

## Scope

- **Shape kit** (`src/design/shapes.tsx`): `Block` (rounded box), `Round` (bevelled or tapered cylinder), `Capsule`, `Profile` (extruded outline), `Lathe`, `Rock` (noise-displaced icosphere) and `Pine` (three-tier conifer).
- **Geometry builders** (`src/design/geometry.ts`): each geometry is cached by its arguments, so repeated parts share buffers. Plus `archOutline` for doorway shapes.
- **Shared materials** (`src/design/materials.ts`): one material per colour and shading style. Kit shapes are smooth-shaded by default so bevels read as soft edges; `flat` keeps facets. `Rock`, `Pine` and `Profile` are always faceted.
- `LowPolyMaterial` gains a `smooth` option for meshes not yet moved to the kit.
- **Model gallery** (`src/dev/`): `/?gallery` in development shows one model at a time on a turntable. It currently lists the shape kit, the locomotive, the five cars and the records office, all in their present (pre-cleanup) form. `&angle=0.6` holds the turntable still.
- **Screenshots** (`scripts/shots.mjs`, `npm run shots -- <label>`): every gallery model from two angles and every section at several scroll stops on desktop and phone, into the git-ignored `shots/<label>/`.

## Notes

- The gallery is behind `import.meta.env.DEV`, so it is not in the production build. Checked: the built assets do not contain it, and the entry chunk is unchanged at 77.5 kB gzipped.
- Cached geometries and materials are never disposed. There are a few dozen of each at most.
- `shots/before/` on my machine holds the baseline for the next four PRs. It is not committed.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run size && npm run test:e2e`

- Unit tests cover the geometry builders: caching, stated sizes (including thin boxes and extrusions), axis orientation, and that a rock has no gaps between faces.
- The browser tests are unchanged and pass.
- Checked by screenshot: the shape kit and the existing locomotive in the gallery.
