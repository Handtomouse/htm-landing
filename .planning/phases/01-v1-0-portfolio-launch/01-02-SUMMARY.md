---
phase: 01-v1-0-portfolio-launch
plan: 02
subsystem: data
tags: [cases, assets, migration, typescript]
dependency_graph:
  requires: [01-01]
  provides: [lib/cases.ts, public/work/*/]
  affects: [04-gallery, 05-components]
tech_stack:
  added: [vm.runInNewContext sandboxed eval, cases.json as typed JSON source]
  patterns: [lib/ typed wrapper over JSON, per-case asset commit strategy]
key_files:
  created:
    - scripts/extract-cases.mjs
    - lib/cases.json
    - lib/cases.ts
    - public/work/swich/ (24 files)
    - public/work/fishbowl/ (10 files)
    - public/work/sbts/ (11 files)
    - public/work/mdb/ (13 files)
    - public/work/maplemoon/ (10 files)
    - public/work/ferrari/ (11 files)
    - public/work/bankwest/ (7 files)
    - public/work/refundid/ (13 files)
    - public/work/troodpratt/ (11 files)
    - public/work/pureairo/ (13 files)
    - public/work/allianz/ (4 files)
    - public/work/endoca/ (10 files)
    - public/work/hills/ (10 files)
    - public/work/stealth/ (9 files)
    - public/work/softlite/ (8 files)
    - public/work/mullet/ (8 files)
    - public/work/aura/ (5 files)
    - public/work/salesforce/ (7 files)
    - public/work/verde/ (10 files)
  modified: []
decisions:
  - "palette typed as string[][] (not string[]) -- each entry is [colorName, hexValue] tuple as found in canonical"
  - "typography typed as string[][] -- each entry is [role, fontDescription] tuple as found in canonical"
  - "vm.runInNewContext with empty context preserves escaped quotes (S'WICH) and nested array literals correctly"
  - "pre-existing typecheck errors (resend, @vercel/analytics, tailwindcss) are dependency resolution issues unrelated to this plan -- cases.ts itself compiles cleanly"
metrics:
  duration: "~1h10m"
  completed: "2026-05-31"
  tasks_completed: 2
  files_created: 22
  files_modified: 0
---

# Phase 01 Plan 02: Case Data Extraction and Asset Migration Summary

**One-liner:** vm.runInNewContext sandboxed extraction of 19 cases from canonical HTML into typed lib/cases.ts, with all 212MB of case imagery migrated to public/work/.

## What Was Built

### Task 1: Extraction Script + Typed Data Layer

- `scripts/extract-cases.mjs`: One-shot Node ESM extractor using vm.runInNewContext sandboxed eval to handle canonical's escaped quotes (S\'WICH, "It's", Women's) safely. Brace-walker finds matching `]` respecting strings and escapes. Asserts array length === 19 and output bytes >= 50% of input literal. Rewrites `assets/<slug>/` paths to `/work/<slug>/`.
- `lib/cases.json`: 103,292 bytes, 19 entries, all paths rewritten to /work/ prefix.
- `lib/cases.ts`: Typed Case[] wrapper. Exports `cases`, `getCaseBySlug`, `getCaseIndex`, `getPrevCase`, `getNextCase`, and `Case` type. POLISH-04 enabled: no hardcoded "17 cases" or "19 cases" string anywhere -- gallery counter will derive from `cases.length`.

**Type corrections applied (Rule 1):**
- `palette` typed as `string[][]` not `string[]` -- canonical stores [colorName, hexValue] tuples
- `typography` typed as `string[][]` not `string` -- canonical stores [role, fontDescription] tuples

### Task 2: Asset Migration (19 per-case commits)

- All 19 `public/work/<slug>/` directories created and populated via rsync from canonical source
- 194 files total on disk, 212MB
- 184 files referenced by cases.json (heroImg + all images[].src) -- all verified present
- 10 extra files on disk are source-side extras (hero-bg.png, hero-drive.png variants, _old_stilllife/ subfolder in swich) -- not referenced but harmless

**Post-migration audit result:** PASS -- all heroImg and images[].src references resolve to real files.

## Hero Image Verification

All 19 cases have a heroImg that resolves to a real file. No gaps.

| Slug | heroImg | Exists |
|------|---------|--------|
| swich | /work/swich/hero.jpg | Yes |
| fishbowl | /work/fishbowl/hero-drive.png | Yes |
| sbts | /work/sbts/hero.jpg | Yes |
| mdb | /work/mdb/hero-drive.png | Yes |
| maplemoon | /work/maplemoon/hero-drive.png | Yes |
| ferrari | /work/ferrari/hero.jpg | Yes |
| bankwest | /work/bankwest/hero.jpg | Yes |
| refundid | /work/refundid/hero-drive.png | Yes |
| troodpratt | /work/troodpratt/hero-drive.png | Yes |
| pureairo | /work/pureairo/hero.jpg | Yes |
| allianz | /work/allianz/hero.png | Yes |
| endoca | /work/endoca/hero.png | Yes |
| hills | /work/hills/hero.png | Yes |
| stealth | /work/stealth/hero.png | Yes |
| softlite | /work/softlite/hero.png | Yes |
| mullet | /work/mullet/hero.png | Yes |
| aura | /work/aura/hero.png | Yes |
| salesforce | /work/salesforce/hero.png | Yes |
| verde | /work/verde/hero.png | Yes |

## Em-Dash Audit Report

**Audit ran on:** `lib/cases.json lib/cases.ts`

**Result:** 7 flagged instances in `lib/cases.json`. All are EN-dashes (not em-dashes) verbatim from the canonical. Per carry-forward constraint, these have NOT been altered. Orchestrator decision required.

| Line | Field | Value |
|------|-------|-------|
| 111 | swich.assets[2] | `"Animated menu boards (v1-v3)"` |
| 1060 | ferrari.m[0][1] | `"2020 - 2022"` |
| 1269 | bankwest.m[0][1] | `"2020 - 2022"` |
| 1437 | refundid.m[0][1] | `"2021 - 2022"` |
| 2046 | allianz.m[0][1] | `"2020 - 2022"` |
| 2351 | hills.m[0][1] | `"2022 - 2023"` |
| 3159 | salesforce.m[0][1] | `"2021 - 2022"` |

Note: `m[0][1]` is the "Year" field in each case's marker/tag matrix (used for filtering, not testimonial quotes). `assets[2]` is a deliverables-style list entry for swich. These are the authentic strings from the canonical. The `testimonial.q` and `testimonial.a` fields have NO em-dashes or en-dashes in any of the 19 cases.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] palette type was string[] in plan template, actual data is string[][]**
- **Found during:** Task 1 typecheck
- **Issue:** TypeScript error: `Type 'string[][]' is not comparable to type 'string[]'` -- canonical stores palette entries as [colorName, hexValue] tuples
- **Fix:** Changed `palette?: string[]` to `palette?: string[][]` in Case type
- **Files modified:** lib/cases.ts
- **Commit:** fe163cf

**2. [Rule 1 - Bug] typography type was string in plan template, actual data is string[][]**
- **Found during:** Task 1 typecheck (second pass after palette fix)
- **Issue:** TypeScript error on typography field -- canonical stores typography entries as [role, fontDescription] tuples
- **Fix:** Changed `typography?: string` to `typography?: string[][]` in Case type
- **Files modified:** lib/cases.ts
- **Commit:** fe163cf

### Plan Estimate Discrepancy (not a deviation, noting for record)

- Plan stated "sanity floor >= 200 files" and "canonical references 247+ image files"
- Actual: 184 files referenced in cases.json, 194 files on disk
- Post-migration audit confirms ALL 184 referenced files resolve to real disk files
- The 247+ estimate in planning was overstated; actual canonical data has 184 image references

## Metrics

| Metric | Value |
|--------|-------|
| Cases extracted | 19 |
| cases.json size | 103,292 bytes |
| Asset directories | 19 |
| Files on disk | 194 |
| Total asset size | 212MB |
| Commits (task 1) | 1 |
| Commits (task 2) | 19 |
| Total commits | 20 |
| Hero gaps | 0 |
| Em-dash flags in testimonials | 0 |
| Em-dash flags in other fields | 7 (en-dashes in year ranges + version string) |

## Known Stubs

None. All 19 cases have real heroImg and images[] resolved to real files. No placeholder or fake content.

## Threat Flags

None. The extraction script uses vm.runInNewContext with empty context ({}) as specified by T-02-01 mitigation. Asset migration is purely local filesystem copy. No new network endpoints or auth paths introduced.

## Self-Check: PASSED

- scripts/extract-cases.mjs: FOUND
- lib/cases.json: FOUND
- lib/cases.ts: FOUND
- public/work/swich/: FOUND
- public/work/verde/: FOUND
- Commit fe163cf (data extraction): FOUND
- Commit a0008ed (swich assets): FOUND
- Commit b710f70 (verde assets - last): FOUND
