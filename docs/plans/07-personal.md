# PR 7: Personal: distributed systems and product

Part of the plan in [00-overview.md](00-overview.md).

## Scope

The Projects section plays three beats, each with its own scene in the same spot (`src/sections/personal/`). The first two are interactive and run on their own clock; scrolling only chooses which is showing.

1. **Distributed systems.** A live five-node cluster.
   - `src/sim/raft.ts`: a Raft-style simulation as a pure, deterministic state machine: terms, voting, heartbeats, log matching and commit. No persistence, snapshots or membership changes.
   - Nodes are placed by a 3D force layout (`d3-force-3d`). Leader is amber with a ring, candidates plum, followers blue, stopped nodes grey. Messages travel as small blocks. Each node shows the tail of its log: green committed, white uncommitted.
   - Controls: Stop the leader, Split the network, Restore, and clicking a node stops or restarts it. A split cuts the leader off with one follower; the layout pulls the two sides apart, the majority elects a new leader, and the stale leader's entries never commit.
   - A status line shows term, leader, committed entries and nodes up.
2. **Prem.** The audit trail as a chain of record blocks (`src/sim/hashchain.ts`). Each block shows its hash as four coloured squares. Editing a record changes its hash, breaks the link to the next block, and marks everything after it as failing verification.
3. **VCT Manager.** A five-player team assembles in front of a podium with the third-place step picked out.

## Product briefs

Each project now shows as a short brief (For, What, How, Status or Outcome) on both the 3D and the plain page, replacing the two resume bullets. The text is in `resume.ts` as `brief`, and every statement is taken from the resume. The "For" lines are the nearest thing to new wording and are worth a read.

## Shared changes

- `Stage`: the canvas now takes pointer events from the page root, so scenes can be clicked while the canvas itself stays behind the page.
- `src/engine/Vignette.tsx`: the grow-in/shrink-away wrapper, moved from the earlier-work section so both use it.
- `src/types/d3-force-3d.d.ts`: minimal types; the package ships none.

## Changes from the overview

- The overview's product card was "problem, user, key decision, outcome". The resume does not state a problem or the reasoning behind decisions, so the brief sticks to what it does state.
- Controls are DOM buttons as well as clickable nodes, so they work by keyboard and on phones.

## Known limits

- The hash is 32-bit FNV-1a, to show the mechanism. It is not cryptographic.
- Editing the last record is not offered: with nothing after it, there is no later link to break.
- A click on a DOM button that sits over a 3D object also reaches that object. The layout keeps them apart.
- On phones the project briefs are long, so their scenes are pushed lower on the screen.

## Verification

`npm run lint && npm run format:check && npm run typecheck && npm test && npm run build && npm run test:e2e`

- Simulation tests, each over five seeds: one leader is elected; never two leaders in a term and committed logs always agree, under random stops, restarts, splits and heals; entries replicate; a stopped leader is replaced; a restarted node catches up; a split leaves the majority working and converges after healing; runs are deterministic.
- Hash-chain tests: an intact chain verifies, and an edit breaks the chain at the next block.
- Browser tests: stop the leader and see a new one elected; edit and restore a record.
- Checked by screenshot: cluster running, split, and after stopping the leader; the chain after an edit; the podium; phone size.
