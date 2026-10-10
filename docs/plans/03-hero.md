# PR 3: Hero

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- Scene (`src/sections/hero/Scene.tsx`): a low-poly prairie with a rail line running to the horizon, hills, pines, telegraph poles, a sun and a sky.
- Scrolling carries the viewer along the track (sleepers, trees and poles stream past). A slow drift keeps it moving at rest.
- Handoff to BNSF: the landscape slides up and off with the bottom edge of the hero section, leaving the page clear for the train.
- DOM: a "Scroll to follow the tracks" cue under the links, shown only in the 3D experience.

## Engine change

A scene that fills the view to a horizon cannot be slid off screen by moving it, because distant objects barely shift. The registry now takes `selfPositioned: true`; such a scene is left where it is and handles its own exit. The hero pitches its world about the camera so the ground's near edge tracks the section's bottom edge. Camera constants moved to `src/engine/camera.ts` so scenes can use them.

## Not done

- Resume PDF download. The PDF has the phone number on it, which the site leaves out. Add a public copy to `public/` and a link in `resume.ts` once there is a version to publish.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

Checked by screenshot: desktop at four scroll positions through the exit, dark theme, and phone size.
