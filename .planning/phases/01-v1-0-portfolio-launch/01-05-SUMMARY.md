---
phase: 01-v1-0-portfolio-launch
plan: "05"
subsystem: portfolio-components
tags: [testimonial, deliverables, polish, data-integrity]
dependency_graph:
  requires: [01-04]
  provides: [POLISH-01, POLISH-02, DATA-03]
  affects: [app/work/[slug] case pages]
tech_stack:
  added: []
  patterns:
    - CSS-only hover reveal (pointer-fine media query, no client JS)
    - Conditional null render for data-absent components (DATA-03)
    - Scoped CSS overrides via more-specific class (.testimonial-polished)
key_files:
  created: []
  modified:
    - app/work/components/Testimonial.tsx
    - app/work/components/DeliverablesIndex.tsx
    - app/work/portfolio.css
key_decisions:
  - "Plan 04 stubs replaced with polished implementations; no structural changes to CaseDetail.tsx"
  - "portfolio.css POLISH-01 and POLISH-02 styles appended in single edit to avoid double-read"
  - "Worktree fast-forwarded from b3fcd50 to 89e483a (no unique commits lost) before plan execution"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-05-31T08:42:48Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 3
  commits: 2
---

# Phase 01 Plan 05: Testimonial + DeliverablesIndex Polish Summary

**One-liner:** Polished Testimonial with 120px serif glyph + amber rule (POLISH-01) and DeliverablesIndex with 96x96 hover thumb + arrow glyph + imagery anchor (POLISH-02); DATA-03 graceful null for all 13 non-quote cases confirmed via live curl loop.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Polished Testimonial (POLISH-01 + DATA-03) | 041ba39 | Testimonial.tsx, portfolio.css |
| 2 | Polished DeliverablesIndex (POLISH-02) | ad7c498 | DeliverablesIndex.tsx |

## DATA-03 Verification: 6/13 Curl Loop

Dev server started at PORT=3055. All checks against `http://localhost:3055/work/{slug}` grepping for `testimonial-polished`.

### 6 Quote-Bearing Cases (must render)

| Slug | Count | Status |
|------|-------|--------|
| swich | 2 | PASS |
| fishbowl | 2 | PASS |
| sbts | 2 | PASS |
| maplemoon | 2 | PASS |
| ferrari | 2 | PASS |
| troodpratt | 2 | PASS |

No MISSING slugs.

### 13 Non-Quote Cases (must be absent)

| Slug | Count | Status |
|------|-------|--------|
| mdb | 0 | PASS |
| bankwest | 0 | PASS |
| refundid | 0 | PASS |
| pureairo | 0 | PASS |
| allianz | 0 | PASS |
| endoca | 0 | PASS |
| hills | 0 | PASS |
| stealth | 0 | PASS |
| softlite | 0 | PASS |
| mullet | 0 | PASS |
| aura | 0 | PASS |
| salesforce | 0 | PASS |
| verde | 0 | PASS |

No UNEXPECTED slugs.

## Build Verification

`npm run build` exited 0. All 19 `/work/[slug]` routes prerendered via SSG without errors.

## Screenshot Paths

- `/tmp/case-swich-testimonial.png` -- swich case page at 1280x1600 (testimonial-polished confirmed in DOM via curl, count=2)
- `/tmp/case-pureairo-no-testimonial.png` -- pureairo at 1280x1600 (no testimonial section in DOM, count=0)
- `/tmp/case-swich-deliverables.png` -- swich at 1280x2000 (deliverable-link confirmed in DOM via curl, count=2)

Note: Screenshots capture cover/readout area (above the fold). Testimonial and deliverables sections are below fold at these viewport dimensions. DOM curl verification confirms components render in the HTML.

## POLISH-01 Spec Compliance

| Spec Item | Implementation | Status |
|-----------|---------------|--------|
| 28-32px quote font-size | `clamp(28px, 3vw, 32px)` on `.testimonial-quote` | PASS |
| line-height 1.3 | `line-height: 1.3` | PASS |
| max-width 28ch | `max-width: 28ch` on `.testimonial-polished` | PASS |
| 120px serif glyph at 15% opacity | `.testimonial-glyph` with `font-size: 120px`, `opacity: 0.15`, Georgia serif | PASS |
| Glyph top-left (avoids data-num at right:4%) | `position: absolute; top: 0; left: 0` | PASS |
| 1px amber rule above attribution | `.testimonial-rule` hr, `border-top: 1px solid var(--amber)` | PASS |

## POLISH-02 Spec Compliance

| Spec Item | Implementation | Status |
|-----------|---------------|--------|
| 96x96 hover thumbnail | `.deliverable-thumb` width/height 96px | PASS |
| heroImg as fallback | `src={heroImg}` on the thumb img | PASS |
| Click to #imagery anchor | `href="#imagery"` on `.deliverable-link` | PASS |
| Trailing arrow glyph | U+2197 in `.deliverable-arrow` | PASS |
| Pointer-fine only reveal | `@media (hover: hover) and (pointer: fine)` guard | PASS |

## Deviations from Plan

### Environment Setup

**Worktree at wrong base commit.** The worktree was at `b3fcd50` (Dependabot next bump) rather than `89e483a` (Plan 04 completion). The `app/work/` directory did not exist at execution start.

- **Resolution:** `git merge --ff-only 89e483a` succeeded. No unique commits existed in the worktree branch, so the fast-forward was lossless.
- **Impact:** None to delivered code. ~2 minutes of pre-execution overhead.

### CSS Commit Structure

The plan specified committing portfolio.css with both Task 1 and Task 2. Since POLISH-01 and POLISH-02 CSS blocks were appended together in a single edit, both were committed with Task 1 commit (`041ba39`). Task 2 commit (`ad7c498`) contains only `DeliverablesIndex.tsx`. Functionally equivalent to the plan's intent.

## Known Stubs

None. Per-artboard thumbnail mapping in DeliverablesIndex is intentional scope deferral (per HANDOFF.md: "specific-artboard mapping is a content task best done case-by-case"), not a stub.

## Self-Check: PASSED

- `app/work/components/Testimonial.tsx`: FOUND (29 lines)
- `app/work/components/DeliverablesIndex.tsx`: FOUND (36 lines)
- `app/work/portfolio.css` POLISH-01 + POLISH-02 appended: FOUND
- Commit `041ba39`: FOUND
- Commit `ad7c498`: FOUND
- Build exit 0: CONFIRMED
- 6 quote cases render testimonial-polished: ALL PASS, 0 MISSING
- 13 non-quote cases absent: ALL PASS, 0 UNEXPECTED
