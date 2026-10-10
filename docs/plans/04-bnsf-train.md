# PR 4: BNSF train

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- Scene (`src/sections/bnsf/`): a train passes right to left as the section scrolls. An orange, black and yellow locomotive leads five cars, one per resume highlight.
- Each car plays a small animation as it reaches the centre:
  1. Hopper, demand forecasting: a chart on its side draws its history line, then the projection. Laid out with `d3-scale` and `d3-array`. The series is illustrative, not real data.
  2. Well car, CRUD framework: four identical containers drop into place.
  3. Boxcar, attrition accuracy: a 50-tick gauge fills to 49 ticks (98%).
  4. Flat car, demand metrics: station pins light up along a network map.
  5. Tank car, EDI 404 testing: packets flow along a pipe through an amber queue (IBM MQ) into a teal one (Kafka).
- Wheels turn with the distance travelled. A crossing signal behind the track flashes while the train passes.
- DOM (`Section.tsx`): the company header stays at the top; each highlight is a card with its headline number, shown while its car is passing. All five stay in the accessibility tree. On the plain page they read as the normal bullet list.
- `timeline.ts` is the single mapping from scroll progress to train position and active car, used by both the scene and the DOM.

## Engine changes

- Registry `selfPositioned` became `placement`: `beside` (default), `centered` (this scene) or `self` (hero).
- `ScrollSection` takes `layout="stage"`: content above a full-width scene, 600vh of scroll.
- `useSectionValue(id, select)` lets DOM derive a value from scroll state and re-render only when it changes.
- Hero: hidden once its section has fully left, so no sliver stays at the top edge.

## Notes

- Livery colours nod to BNSF. No logo or lettering is reproduced.
- The scene scales down on narrow screens (to half size at most), so about two cars are visible on a phone.
- This fixes the PR 2 limit where the BNSF panel covered its scene on phones.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

- Unit tests cover the timeline: every car gets a turn, in order, with no gaps.
- A browser test scrolls to the second car and checks its card is the one showing.
- Checked by screenshot: desktop at the start, each car's stop and the exit; phone size; dark theme.
