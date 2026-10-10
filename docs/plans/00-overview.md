# Personal Portfolio: scroll-driven 3D site (React + R3F + D3) on GitHub Pages

## Context

Cameron wants a new personal portfolio that tells the resume as a sequence of scroll-driven 3D scenes instead of a text page: a BNSF train passing by, a medical-office document organizer for Stony Brook, and a personal section that shows an interest in distributed systems and in product. It must be a static site hosted on GitHub Pages. The work is split into independent subplans, one PR each.

Starting state: `/Users/camerontoy/Personal Portfolio` is empty and not a git repo. The repo `cameronjtoy/cameronjtoy.github.io` does not exist yet. `gh` is logged in as `cameronjtoy`. Local Node is v23.1.0.

Decisions already made:

| Topic | Decision |
|---|---|
| Rendering | React Three Fiber for 3D scenes, D3 for data-driven parts |
| Hosting | `cameronjtoy.github.io` user site, served from the domain root |
| Art style | Stylized low-poly, built procedurally in code (no model files) |
| Personal section | Live cluster simulation plus product-framed project cards |

## Architecture (shared by every PR)

**Stack:** Vite, React 19, TypeScript, `three`, `@react-three/fiber`, `@react-three/drei`, `d3` (scale, shape, array, interpolate), `d3-force-3d`, `zustand`, Vitest, Playwright, ESLint, Prettier.

**Page model:** one long native-scroll document. Each resume section is a tall DOM `<section>` with a sticky viewport. A single fixed full-screen `<Canvas>` sits behind the DOM.

- All resume text is real DOM (readable by screen readers, search engines, and with WebGL off). The 3D is an enhancement layer, never the only carrier of content.
- `useSectionProgress(ref)` gives each section a 0..1 scroll progress, written to a ref/store and read inside `useFrame`, so scrolling causes no React re-renders.
- A scene registry maps section id to a lazily loaded scene component (`React.lazy`). Only the scene near the viewport is mounted, so each PR adds one code-split chunk.
- Fallbacks: `prefers-reduced-motion` and no-WebGL both render the plain layout from PR 1. A quality tier (DPR cap, shadow toggle) handles phones.

**Layout:**

```
src/
  content/resume.ts        single typed source of truth for all text
  engine/                  Canvas shell, scroll progress, scene registry, quality tiers
  design/                  palette, low-poly materials, typography tokens
  sections/<name>/         Section.tsx (DOM) + Scene.tsx (3D) + parts
  sim/                     pure-TS cluster simulation (PR 7)
docs/plans/NN-<name>.md    each subplan below, committed in its own PR
.github/workflows/         ci.yml, deploy.yml
```

**PR flow:** every subplan is one branch off `main` and one PR, opened with `gh pr create`. Each PR adds its own `docs/plans/NN-*.md`, keeps CI green, and leaves the deployed site working. PRs 3 to 8 depend only on PRs 1 and 2, so they can be built in any order.

## Subplans

### PR 1: Foundation and deploy
- `git init`, create the public repo `cameronjtoy/cameronjtoy.github.io`, push `main`.
- Scaffold Vite + React + TS; add lint, format, Vitest, Playwright.
- `src/content/resume.ts`: typed data for experience, projects, education, skills, links.
- Plain, accessible, responsive HTML version of the whole resume. This is the permanent fallback.
- `ci.yml` (lint, typecheck, test, build) and `deploy.yml` (`actions/upload-pages-artifact` + `actions/deploy-pages`, Node 22). Set Pages source to GitHub Actions.
- Done when: the plain site is live at `https://cameronjtoy.github.io`.

### PR 2: 3D engine and scroll system
- Fixed Canvas shell, `useSectionProgress`, scene registry with lazy loading, quality tiers, reduced-motion and no-WebGL fallbacks.
- `design/`: palette, flat-shaded materials, lighting rig, shared low-poly helpers.
- Section nav rail (dots with labels) showing scroll position.
- A placeholder scene per section proving the wiring.
- Done when: scrolling drives a placeholder object in each section at 60 fps on a laptop, and the fallback shows with reduced motion on.

### PR 3: Hero
- Name, one-line pitch, links (email, LinkedIn, GitHub), resume PDF download.
- Scene: low-poly landscape with rail tracks running toward the horizon; the camera follows the tracks down into the BNSF section as the handoff.

### PR 4: BNSF train
- Scroll progress moves a train across the screen: an orange-and-black locomotive followed by five cars, one per resume bullet. The DOM card for a bullet appears as its car reaches center.
- Cars reflect the bullet:
  1. Demand forecasting, $1M saved: hopper car with a D3 forecast line drawn on its side.
  2. CRUD framework, ~150 apps: well car stacked with identical containers.
  3. Attrition accuracy 98%: boxcar with a gauge filling to 98%.
  4. Demand metrics, 100+ stations: flat car carrying a station map with pins lighting up.
  5. EDI 404 waybill testing: tank car with message packets flowing through MQ and Kafka pipes.
- Parallax scenery (poles, hills, a station platform) sells the motion.
- Livery is inspired by BNSF colors; the BNSF logo is not reproduced.

### PR 5: Stony Brook medical office
- Scene: low-poly records office diorama with a desk, monitor, and filing cabinets.
- Scroll runs the migration story: a messy pile of legacy paper charts lifts off, sorts by type, and files into labeled drawers. Three beats match the three bullets:
  1. EMR dashboard: the monitor lights up with a records table, a role badge, and an audit log.
  2. REST APIs: papers pass through a "transform" slot and come out as uniform records.
  3. Operations: duplicate sheets merge into one; an invoice prints.
- All on-screen records are obviously fake placeholders. No realistic patient data.

### PR 6: Earlier experience (Develop for Good, University at Buffalo)
- Lighter, D3-led panels rather than full dioramas, to vary the pacing.
- Develop for Good: a magic-link envelope flying to a counter that climbs to 500 verified users; images dropping into a bucket.
- UB Vizier: a D3 data-profiler histogram that assembles on scroll, with before/after bars for the 20% and 25% improvements.

### PR 7: Personal: distributed systems and product
- `src/sim/`: a small Raft-style simulation as a pure TypeScript state machine (leader election, heartbeats, log replication), deterministic and unit-tested in Vitest.
- Scene: five nodes laid out with `d3-force-3d`, messages drawn as moving particles. Visitors can click a node to kill or revive it and cut the network in two, then watch the cluster re-elect and catch up.
- Prem: its tamper-evident audit trail shown as a linked hash chain; editing a block visibly breaks the chain after it.
- Product cards for Prem and VCT Manager, laid out as problem, user, key decision, outcome. I draft these from the resume; Cameron fills in the product reasoning, since the resume does not contain it.

### PR 8: Skills, education, contact
- Skills as a D3 grouped layout (languages, frameworks, cloud and tooling) rather than a comma list.
- Education line, contact footer, closing scene (the train from PR 4 leaving into the distance).

### PR 9: Polish and launch
- Performance: bundle budget per chunk, DPR and shadow tuning, Lighthouse run on mobile.
- Accessibility: keyboard path through all interactive parts, focus states, contrast check.
- SEO and sharing: title, description, Open Graph image, favicon, `404.html`.
- Cross-browser pass (Safari, Firefox, Chrome, iOS Safari).

## Content notes to settle during PR 1
- The phone number is left off the public site by default; email, LinkedIn, and GitHub stay.
- Resume wording to fix before it is copied into `resume.ts`: "Angular" is listed twice under Frameworks; "MySql" and "Cuda" should be "MySQL" and "CUDA"; "reducing runtime performance" in the UB bullet reads as the opposite of what is meant.

## Verification
- Every PR: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, then `npm run preview` and scroll the whole page.
- Playwright smoke test (added in PR 1, extended per section): the page loads, every section heading is present in the DOM, and no console errors occur. Run once with reduced motion on to confirm the fallback.
- PR 7: Vitest covers the simulation (a single leader is elected, a killed leader is replaced, a revived node catches up on the log).
- After each merge: confirm the deploy workflow succeeds and check the live URL on desktop and a phone.
