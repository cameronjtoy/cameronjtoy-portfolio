# PR 8: Skills, education, contact

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- **Skills tree** (`src/sections/closing/`): the skills drawn as a left-to-right tree, one branch per group, laid out with `d3-hierarchy` (`cluster`) and `d3-shape` (`linkHorizontal`). The branches draw in and the labels fade up when the section becomes the active one. `treeLayout.ts` is the pure layout; `SkillTree.tsx` draws the SVG.
- The tree is decorative (`aria-hidden`). The same skills stay in a real list, which screen readers get. The plain page shows that list as tags and hides the tree.
- **Education** and a **Contact** footer with the email, LinkedIn and GitHub links and a link to this repo.
- **Closing scene:** the BNSF locomotive from PR 4, seen from behind at an angle, pulls a tank car down the track and into a tunnel as the page reaches its end.

## Shared changes

- `Scenery` (BNSF) takes a `length`, so the closing scene can use a short strip of track.
- The placeholder scene and the registry's placeholder entry are removed: every section now has its own scene.
- `Skills.tsx` and `Education.tsx` are folded into the closing section.
- `resume.ts` gains `source`, the link to the repo.

## Deferred to the styling pass

- On an 800px-tall desktop window the panel is slightly taller than the screen, so the contact block only comes into view at the very end of the page.
- On phones the panel covers most of the scene.
- The near end of the track runs off the bottom-right of the screen.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

- Unit tests cover the tree layout: one leaf per skill in order, a link per non-root node, unique ids, everything inside the drawing.
- Browser tests: the tree draws at the end of the page and the contact links are there; with reduced motion the list shows and the tree does not.
- Checked by screenshot: desktop at three scroll positions, phone size, and the plain page.
