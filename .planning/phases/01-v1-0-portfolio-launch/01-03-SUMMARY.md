---
phase: 01-v1-0-portfolio-launch
plan: 03
subsystem: css-isolation-fonts
tags: [css, fonts, next-font, isolation, portfolio]
dependency_graph:
  requires: [01-01]
  provides: [app/work/layout.tsx, app/work/portfolio.css, app/work/fonts.ts]
  affects: [app/work/page.tsx (Plan 04), app/work/[slug]/page.tsx (Plan 04)]
tech_stack:
  added: []
  patterns:
    - next/font/google self-hosting for Inter, VT323, Geist Mono
    - .htm-portfolio CSS scoping prefix (every canonical selector prefixed)
    - CSS custom property font vars (--font-inter, --font-vt323, --font-geist-mono)
    - Route-segment CSS import via app/work/layout.tsx
key_files:
  created:
    - app/work/fonts.ts
    - app/work/portfolio.css
    - app/work/layout.tsx
  modified: []
key_decisions:
  - Decision A3-adobe: ArgentPixelCF deferred to Adobe Fonts web kit; VT323 graceful fallback
  - Font vars rewired from literal family names to next/font CSS custom properties
  - Inter weights expanded to include 100+200 for stat/gallery elements in canonical
metrics:
  duration_minutes: 35
  completed_date: "2026-05-31"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 0
---

# Phase 01 Plan 03: CSS Isolation + Font Loading Foundation Summary

CSS isolation and font loading foundation for the portfolio sub-app. Scoped canonical CSS (374 `.htm-portfolio` prefixed rules, zero leaks) + centralized next/font loading for Inter/VT323/Geist Mono + Adobe Fonts seam for ArgentPixelCF.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create app/work/fonts.ts | eeee267 | app/work/fonts.ts |
| 2 | Create portfolio.css + layout.tsx | 5d6dae8 | app/work/portfolio.css, app/work/layout.tsx |

## Verification Results

- **Leak audit (awk script):** Zero `LEAK:` lines. All 374 `.htm-portfolio` prefixed rules pass.
- **Unprefixed root selectors:** `grep -cE "^body\s*\{|^:root\s*\{"` returns 0
- **@font-face / @import strips:** `grep -cE "@import.*fonts.googleapis|@font-face"` returns 0
- **globals.css diff:** Empty - file untouched
- **Em-dash audit:** PASS - no user-facing em/en dashes in any of the three files
- **Build:** `next build` exits 0 (route segment compiles; /work shows no page yet, expected - that is Plan 04's surface)
- **Line count:** portfolio.css is 1173 lines (well above 500-line threshold)
- **Prefixed selector count:** 374 occurrences of `.htm-portfolio`
- **TODO(adobe-fonts-kit) marker:** Present and greppable in layout.tsx

## Deviations from Plan

### Auto-fixed Issues

None - no bugs encountered.

### Intentional Adaptations (not bugs, plan adjustments)

**1. [A3-adobe Decision] ArgentPixelCF deferred to Adobe Fonts kit (overrides plan's A1/A2 language)**
- **Found during:** Task 1 (per DECISION_A_RESOLVED in prompt)
- **Issue:** ArgentPixelCF is being loaded via Adobe Fonts web project kit (user's Creative Cloud subscription), not via next/font/local OTF copy
- **Fix:** No `public/fonts/` OTF files; no `next/font/local` import. In `fonts.ts`, added a comment documenting the deferral. In `portfolio.css`, `--font-display` set to `"argent-pixel-cf", var(--font-vt323), monospace`. In `layout.tsx`, added greppable `TODO(adobe-fonts-kit)` marker.
- **Files modified:** app/work/fonts.ts, app/work/portfolio.css, app/work/layout.tsx

**2. [Rule 2 - Missing functionality] Font vars rewired from literal family names to next/font CSS variables**
- **Found during:** Task 2 (advisor review)
- **Issue:** Canonical `:root` uses literal `'Inter'`, `'VT323'`, `'Geist Mono'` family strings. `next/font/google` with `variable:` does NOT register under those names - fonts only resolve via CSS custom properties. Verbatim port would cause all fonts to fall back to system sans/mono, breaking visual fidelity.
- **Fix:** In `.htm-portfolio {}` vars block: `--font-sans: var(--font-inter), sans-serif`, `--font-mono: var(--font-vt323), monospace`, `--font-codey: var(--font-geist-mono), 'JetBrains Mono', 'VT323', monospace`. This matches the existing repo pattern (`app/layout.tsx` uses `var(--font-body)`, never `'Roboto Mono'`).
- **Files modified:** app/work/portfolio.css
- **Commit:** 5d6dae8

**3. [Rule 2 - Missing functionality] Inter weights 100 + 200 added**
- **Found during:** Task 1 (advisor review)
- **Issue:** Plan template listed weights 300-900 only. Canonical uses `font-weight: 100` (stat `.num` elements) and `font-weight: 200` (gallery h2, several display elements). The canonical Google Fonts link requests `wght@100;200;300;400;500;700;800;900`.
- **Fix:** Added `'100'` and `'200'` to Inter's weight array in `fonts.ts`.
- **Files modified:** app/work/fonts.ts
- **Commit:** eeee267

**4. [Rule 1 - Bug] `→` arrow in `detail ul li::before` replaced with Unicode escape**
- **Found during:** Task 2
- **Issue:** Canonical used literal `'→'` as the CSS `content` string. CSS `content` property requires either a string literal or `\2192`. Using literal UTF-8 arrows in CSS `content` values can cause encoding issues in some build pipelines.
- **Fix:** Replaced with `'\2192'` (Unicode escape for rightward arrow).
- **Files modified:** app/work/portfolio.css
- **Commit:** 5d6dae8

**5. [A3-adobe Adaptation] `--font-display` fallback uses `var(--font-vt323)` not literal `"VT323"`**
- **Found during:** Task 2 (per DECISION_A_RESOLVED + advisor guidance)
- **Issue:** Decision A3-adobe specifies `"argent-pixel-cf", "VT323", monospace` as the font stack for display lockups. However, literal `"VT323"` won't resolve to the self-hosted next/font instance - it would fall through to any system-installed VT323 or monospace. To honor the intent ("VT323 graceful fallback until the kit loads"), the fallback must use the next/font variable.
- **Fix:** `--font-display: "argent-pixel-cf", var(--font-vt323), monospace` in the `.htm-portfolio {}` vars block.
- **Files modified:** app/work/portfolio.css
- **Commit:** 5d6dae8

## PENDING: Adobe Fonts kit (Argent Pixel CF)

**Status:** Blocked on user providing Adobe Fonts web project kit ID.

**What is needed before Wave 5 deploy:**
1. Insert `<link rel="stylesheet" href="https://use.typekit.net/<KITID>.css" />` in `app/work/layout.tsx` at the marked seam. The marker is greppable:
   ```
   grep -n "TODO(adobe-fonts-kit)" app/work/layout.tsx
   ```
2. Confirm the Adobe project's assigned CSS font-family name is `argent-pixel-cf` (Adobe's conventional slug for this face). If the kit assigns a different name, update `--font-display` in `app/work/portfolio.css` accordingly.
3. The `<link>` can be added to the layout's JSX return as a Next.js `<link>` element, or via `app/work/layout.tsx` exporting `metadata.other` with a link preload.

**Current behavior pre-kit:** `--font-display` falls back to `var(--font-vt323)` (self-hosted via next/font). Display lockups render in VT323 monospace rather than ArgentPixelCF. This is the intended graceful degradation per Decision A3-adobe.

**Files requiring update when kit arrives:**
- `app/work/layout.tsx` - insert `<link>` tag at TODO(adobe-fonts-kit) seam
- `app/work/portfolio.css` - confirm `--font-display` family name matches kit

## Known Stubs

None. No hardcoded empty values, placeholder text, or unwired data sources in the three files. The `TODO(adobe-fonts-kit)` marker is an intentional documented seam (not a content stub) - the fallback VT323 renders cleanly until the kit is provided.

## Threat Flags

No new security-relevant surface introduced. All three files are build-time assets with no runtime network egress, no new endpoints, no auth paths.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| app/work/fonts.ts exists | FOUND |
| app/work/portfolio.css exists | FOUND |
| app/work/layout.tsx exists | FOUND |
| Commit eeee267 exists | FOUND |
| Commit 5d6dae8 exists | FOUND |
