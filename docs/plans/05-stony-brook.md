# PR 5: Stony Brook medical office

Part of the plan in [00-overview.md](00-overview.md).

## Scope

- Scene (`src/sections/stony-brook/`): a medical records office as a corner diorama, with a desk, monitor, printer, a transform unit, two filing cabinets, a wall board and a pile of legacy paper charts.
- Scrolling plays three beats, one per resume highlight and in the same order (`timeline.ts`):
  1. EMR dashboard: the monitor comes up. A header and role badge appear, the records table fills row by row, then the audit log.
  2. REST APIs: the paper charts leave the pile one at a time, pass through the transform unit, come out as uniform records tagged by category, and drop into that category's drawer. The drawers open for this and close after.
  3. Operations: pairs of duplicate cards on the wall board merge into single cards with a green mark, then an invoice feeds out of the printer.
- Everything on screen is abstract shapes. There is no text and nothing resembling patient data.
- DOM: the header with one highlight card at a time, matching the beat.

## Shared changes

- `src/sections/StepEntry.tsx`: the header plus one-card-at-a-time list, extracted from the BNSF section so both sections use it. CSS classes renamed from `bnsf__*` to `steps*`.
- `ScrollSection` gains `layout="split"`: bare content beside the scene on wide screens and above it on phones, 450vh of scroll.
- `src/design/math.ts`: `clamp01`, `lerp`, `smooth`. `clamp01` moved here from the BNSF folder.

## Changes from the overview

- The beats follow the resume's bullet order (dashboard, APIs, operations) so the cards read top to bottom, although the migration would come first in real life.
- A wall board shows the duplicate merge, rather than sheets merging in mid-air.

## Notes

- The scene adds its own fill light. Lights are global in three.js, so it also touches a neighbouring scene for the moment both are on screen.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

- Unit tests cover the timeline: beats run in order and each finishes before the next starts.
- A browser test scrolls to the middle of the section and checks the second highlight is the one showing.
- Checked by screenshot: desktop across all three beats, and phone size.
