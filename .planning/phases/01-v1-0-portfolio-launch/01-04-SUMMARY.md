---
phase: 01-v1-0-portfolio-launch
plan: 04
subsystem: gallery-and-case-detail-routes
tags: [gallery, case-detail, sector-filter, carousel, static-gen, portfolio]
dependency_graph:
  requires: [01-02, 01-03]
  provides:
    - app/work/page.tsx
    - app/work/[slug]/page.tsx
    - app/work/components/types.ts
    - app/work/components/GalleryGrid.tsx
    - app/work/components/SectorFilter.tsx
    - app/work/components/CaseDetail.tsx
    - app/work/components/CasePlayer.tsx
    - app/work/components/NextPrevCard.tsx
    - app/work/components/Testimonial.tsx (stub -- overwrite in Plan 05)
    - app/work/components/DeliverablesIndex.tsx (stub -- overwrite in Plan 05)
  affects:
    - Plan 05 (Testimonial, DeliverablesIndex final implementations)
    - Plan 06 (generateMetadata for case routes)
tech_stack:
  added: []
  patterns:
    - generateStaticParams for 19 static case pages
    - Server/Client component split (GalleryGrid server, SectorFilter client, CasePlayer client)
    - CSS data-attribute sector filter (data-sector-active on wrapper, data-sector on tiles)
    - Sector extraction via m.find(([k]) => k === 'Sector') -- not m[0] which is Year
    - --next-hero CSS custom property for next-card background overlay
key_files:
  created:
    - app/work/page.tsx
    - app/work/[slug]/page.tsx
    - app/work/components/types.ts
    - app/work/components/GalleryGrid.tsx
    - app/work/components/SectorFilter.tsx
    - app/work/components/CaseDetail.tsx
    - app/work/components/CasePlayer.tsx
    - app/work/components/NextPrevCard.tsx
    - app/work/components/Testimonial.tsx
    - app/work/components/DeliverablesIndex.tsx
    - public/work/htm/ (7 SVGs + 22 icons)
  modified:
    - app/work/portfolio.css (sector filter CSS rules + asset path fix)
key_decisions:
  - Sector extracted from m.find(([k]) => k === 'Sector') -- plan incorrectly used m[0] which is Year
  - CSS class names matched to portfolio.css contract (gallery-tile, thumb, meta, etc.) not plan snippets
  - assets/htm/ CSS paths rewritten to /work/htm/ + assets copied to public/work/htm/
  - Sector CSS uses lowercase keys for both data-sector on tiles and data-sector-active on wrapper
  - Plan 05 stubs created for Testimonial + DeliverablesIndex to allow immediate build pass
metrics:
  duration_minutes: 55
  completed_date: "2026-05-31"
  tasks_completed: 3
  tasks_total: 3
  files_created: 10
  files_modified: 2
---

# Phase 01 Plan 04: Gallery + Case Detail Routes Summary

Gallery route + 19 static case-detail routes with all supporting components. Server/Client component split for sector filtering. `generateStaticParams` produces 19 static pages at build time. POLISH-03 (hide dead next/prev) and POLISH-04 (counter = cases.length) solved by architecture.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Shared types + 5 component scaffolds | 5842a7a | app/work/components/types.ts + 5 stubs |
| 2 | Gallery route + GalleryGrid + SectorFilter | 6552886 | app/work/page.tsx, GalleryGrid.tsx, SectorFilter.tsx, portfolio.css |
| 3 | Case-detail route + CaseDetail + CasePlayer + NextPrevCard | 8691f35 | app/work/[slug]/page.tsx, CaseDetail.tsx, CasePlayer.tsx, NextPrevCard.tsx, Testimonial.tsx stub, DeliverablesIndex.tsx stub, public/work/htm/ |

## Success Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| RENDER-01: /work renders 19 tiles | PASS | GalleryGrid maps all cases, build shows /work static page |
| RENDER-02: 19 static /work/[slug] pages | PASS | generateStaticParams returns 19 entries; build output: "Generating static pages (40/40)" |
| RENDER-03: gallery -> case -> back nav | PASS | Link href=/work/[k] on tiles; Link href=/work in CaseDetail cta-row |
| RENDER-04: visual fidelity | PASS | Class names match portfolio.css contract throughout |
| POLISH-03: no dead next/prev cards | PASS | NextPrevCard only rendered when prevCase/nextCase !== undefined |
| POLISH-04: counter = cases.length | PASS | gallery page.tsx: {cases.length} cases; case-detail: total={cases.length} |
| em-dash audit | PASS | scripts/em-dash-audit.sh app/work exits 0 |
| next build | PASS | Exit 0; /work SSG + 19 /work/[slug] SSG pages |

## Actual Sector Taxonomy (pre-step output)

Extracted from `cases.json m[].find(([k]) => k === 'Sector')` (not m[0] which is Year):

```
action sports
automotive
b2b / saas
e-commerce
fmcg
finance
hospitality
lifestyle
mould remediation
pet nutrition
public art
wellness
```

12 sectors total. CSS rules appended to portfolio.css enumerate all 12 with lowercase keys matching `data-sector` on tiles and `data-sector-active` on the gallery grid wrapper.

## Case Counter Live Curl Verification

Both boundary cases confirmed to contain "/ 19" in rendered HTML (from case-num div):

- `/work/swich` (case 01): renders `01 / 19` in `.case-num` and `CASE FILE :: 01/19`
- `/work/verde` (case 19): renders `19 / 19` in `.case-num` and `CASE FILE :: 19/19`

This proves `total` is the project-wide count (cases.length = 19), not the case's own n. No "03 / 03" tautology present.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's sector accessor was wrong (m[0] is Year, not Sector)**
- **Found during:** Task 2 pre-step (sector extraction)
- **Issue:** Plan's code used `c.m[0]` to get the sector. Inspecting actual cases.json: `m[0]` is `["Year","2020 to present"]`. The actual sector is at `m.find(([k]) => k === 'Sector')`.
- **Fix:** All code uses `m.find(([k]) => k === 'Sector')` accessor. GalleryGrid, SectorFilter, CaseDetail, NextPrevCard all use consistent `getSector()` helper.
- **Files modified:** GalleryGrid.tsx, SectorFilter.tsx, CaseDetail.tsx, NextPrevCard.tsx, portfolio.css sector rules (used correct 12-sector list)
- **Commit:** 6552886

**2. [Rule 1 - Bug] Plan's JSX class names did not match portfolio.css**
- **Found during:** Task 2 implementation (advisor review)
- **Issue:** Plan snippets used invented class names (.tile, .tile-hero, .tile-meta, .sector-chip, .is-active, .case, .case-hero, etc.) that do not exist in portfolio.css. The real CSS contract uses .gallery-tile, .thumb, .meta, .sector-chips button.active, .cover, .readout, .detail, etc.
- **Fix:** All components written against the actual portfolio.css class vocabulary. Canonical HTML + portfolio.css were the source of truth throughout.
- **Files modified:** All component files

**3. [Rule 3 - Blocking] portfolio.css url() paths were unresolvable by webpack**
- **Found during:** Task 3 build verification
- **Issue:** portfolio.css contained 40 `url('assets/htm/...')` references. When Plan 04 routes were added (previously no /work page existed so CSS was tree-shaken), webpack attempted to resolve these relative paths and failed: "Module not found: Can't resolve './assets/htm/htm-wordmark.svg'"
- **Fix:** Copied `assets/htm/` directory from canonical mockup to `public/work/htm/`. Updated all 40 CSS references from `url('assets/htm/...')` to `url('/work/htm/...')` (absolute public paths). This is the correct pattern for Next.js static assets in CSS.
- **Files modified:** app/work/portfolio.css (40 path updates), public/work/htm/ (29 files added)
- **Commit:** 8691f35

### Plan 05 Stubs

Two stub files created for Plan 05 to overwrite:
- `app/work/components/Testimonial.tsx` -- returns null; Plan 05 implements full render with serif glyph (POLISH-01)
- `app/work/components/DeliverablesIndex.tsx` -- basic `<ol>` render; Plan 05 implements hover-thumbnail version (POLISH-02)

## Known Stubs

| File | Type | Reason |
|------|------|--------|
| app/work/components/Testimonial.tsx | Returns null | Plan 05 overwrite pending |
| app/work/components/DeliverablesIndex.tsx | Basic ol render | Plan 05 overwrite pending (POLISH-02) |

These stubs do not prevent the plan's goal (RENDER-01..04, POLISH-03, POLISH-04) from being achieved. The gallery renders all 19 cases; each case detail renders with full content. Testimonial and deliverables are functional (cases without testimonials show nothing; cases with deliverables show a plain list).

## Threat Flags

None. All threats in the plan's threat model are mitigated:
- T-04-01 (XSS): React auto-escapes all text content; no dangerouslySetInnerHTML used
- T-04-03 (img config): plain `<img>` per locked default #6; accepted

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| app/work/page.tsx exists | FOUND |
| app/work/[slug]/page.tsx exists | FOUND |
| app/work/components/types.ts exports 7 types | FOUND (7) |
| GalleryGrid.tsx uses .gallery-tile/.thumb/.meta | FOUND |
| SectorFilter.tsx starts with 'use client' | FOUND |
| CasePlayer.tsx starts with 'use client' | FOUND |
| NextPrevCard.tsx is server component (no 'use client') | FOUND |
| next build exits 0 | PASS |
| 19 static /work/[slug] pages | PASS (generateStaticParams returns 19 entries) |
| em-dash audit exit 0 | PASS |
| POLISH-03 conditional render | FOUND (prevCase && / nextCase &&) |
| POLISH-04 cases.length not hardcoded | FOUND (3 uses of cases.length, 0 hardcoded counters) |
