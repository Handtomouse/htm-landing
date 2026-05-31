---
phase: 01-v1-0-portfolio-launch
plan: 01
subsystem: testing
tags: [bash, shell-scripts, qa-tooling, font-licensing, adobe-fonts, argent-pixel-cf]

# Dependency graph
requires: []
provides:
  - scripts/em-dash-audit.sh (QA-01 enabler)
  - scripts/smoke-screenshot.sh (QA-02/03/05 enabler)
  - scripts/check-image-200s.sh (QA-04 enabler)
  - ArgentPixelCF font licensing decision (A3-adobe: Adobe Fonts web project kit)
  - _heroes.js disposition decision (B1-skip: dead code, not ported)
affects:
  - 01-02 (Plan 02: cases.ts extraction must confirm all 19 heroImg paths resolve)
  - 01-03 (Plan 03: font wiring blocked pending Adobe Fonts kit URL)
  - 01-04 (Plan 04: render, no _heroes.js port required)

# Tech tracking
tech-stack:
  added: [bash scripts for QA automation]
  patterns:
    - "em-dash audit: grep with comment-exclusion regex anchored after grep output prefix (path:linenum:)"
    - "headless screenshot: system Chrome with --virtual-time-budget, fallback to npx playwright"
    - "image-200 check: curl page HTML, extract src URLs, HEAD each for status code"

key-files:
  created:
    - scripts/em-dash-audit.sh
    - scripts/smoke-screenshot.sh
    - scripts/check-image-200s.sh
  modified: []

key-decisions:
  - "A3-adobe: ArgentPixelCF wired via Adobe Fonts web project kit (use.typekit.net), not next/font/local with OTF"
  - "B1-skip: _heroes.js is dead code (all 19 cases have real heroImg), not ported to lib/heroFallbacks.ts"
  - "Plan 03 font task blocked pending Adobe Fonts kit URL from user"

patterns-established:
  - "QA scripts live in scripts/ at repo root, executable, accept optional path argument"
  - "em-dash comment-exclusion regex must anchor after grep output prefix: ^[^:]+:[0-9]+:[[:space:]]*(//|/*|*)"

requirements-completed: [QA-01, QA-02, QA-03, QA-04, QA-05]

# Metrics
duration: multi-session
completed: 2026-05-31
---

# Phase 01 Plan 01: Pre-flight QA Tooling and Wave 0 Decisions Summary

**Three executable QA scripts ship (em-dash audit, headless screenshot, image-200 checker) and two blocking decisions resolved: ArgentPixelCF wired via Adobe Fonts web project (not OTF copy), _heroes.js confirmed dead code and skipped.**

## Performance

- **Duration:** multi-session
- **Started:** 2026-05-31
- **Completed:** 2026-05-31
- **Tasks:** 3 (2 built, 1 decision checkpoint)
- **Files modified:** 3 created

## Accomplishments

- `scripts/em-dash-audit.sh` created and verified: exits 0 on clean tree, exits 1 with file:line list on polluted, correctly excludes comment-line hits
- `scripts/smoke-screenshot.sh` created and verified: captures PNG of any URL via system Chrome (--virtual-time-budget=5000) with npx playwright fallback; confirmed against example.com
- `scripts/check-image-200s.sh` created: curls each of the 19 case pages, extracts img src URLs, asserts HTTP 200 for each; all 19 slugs embedded in SLUGS list
- ArgentPixelCF licensing resolved without cost or OTF copying: Adobe Fonts web project kit approach selected
- _heroes.js confirmed dead code and excluded from port, keeping bundle clean and no fake content risk

## Task Commits

Each task was committed atomically:

1. **Task 1: Build em-dash audit script** - `db2ef68` (feat)
2. **Task 2: Build headless screenshot harness and image-200 checker** - `96710ee` (feat)
3. **Task 3: Resolve font licensing and _heroes.js disposition** - decision recorded in this SUMMARY (no code commit required)

## Files Created/Modified

- `scripts/em-dash-audit.sh` - Audits app/work/, lib/, public/work/ for U+2014/U+2013 outside comments; exits 0 clean, exits 1 polluted
- `scripts/smoke-screenshot.sh` - Headless PNG capture via system Chrome or playwright; args: URL OUTPUT WIDTH HEIGHT
- `scripts/check-image-200s.sh` - Post-deploy image 200 verifier; curls all 19 case pages and asserts each img src returns 200

## Decisions Made

### Decision A: ArgentPixelCF Font Licensing

**Chosen: A3-adobe (Adobe Fonts web project kit)**

Argent Pixel CF by Connary Fagen is available on Adobe Fonts (https://fonts.adobe.com/fonts/argent-pixel-cf) with both Regular and Italic styles for sync AND web use. The full Adobe Fonts library is cleared for personal and commercial use under an active Creative Cloud subscription. This means the font can be embedded on the web with no separate Connary Fagen web licence purchase and no licensing exposure.

**Implementation guidance for Plan 03 (font wiring task):**

- Wire Argent Pixel CF via an ADOBE FONTS WEB PROJECT KIT: add the Adobe Fonts stylesheet `<link rel="stylesheet" href="https://use.typekit.net/<KIT_ID>.css">` in `app/work/layout.tsx` and reference the Adobe-provided font-family name in `app/work/portfolio.css`.
- DO NOT use `next/font/local` with the OTF files. That path requires a separate desktop/web licence and is not the chosen approach.
- DO NOT copy the local OTF files into `public/fonts/`.
- DO NOT fall back to VT323-only for italic display. Argent Pixel CF is being used.
- BLOCKER for Plan 03 font task: the Adobe Fonts web project kit URL / KIT_ID must be provided by the user before the font task in Plan 03 can run. The orchestrator is sourcing this from the user before Plan 03 starts.

**Why not A1-license or A2-fallback:**
- A1-license would require purchasing a separate web licence SKU from Connary Fagen (USD 50-200) and copying OTF files; unnecessary given Adobe CC subscription already covers web use.
- A2-fallback (VT323-only for italic) would visibly degrade case-mark italic display on SWICH wordmark, Fishbowl italic, and similar lockups.

### Decision B: _heroes.js Disposition

**Chosen: B1-skip (do not port)**

`_heroes.js` (134 lines in the canonical) defines HERO_SVGS placeholder SVGs for 9 slugs and exposes a `mountHero` function. That function fires only as the else-branch when a case has no real `heroImg`. All 19 cases in the canonical `cases` array have real `heroImg` paths into `assets/<slug>/<file>`. The file is dead code from an earlier iteration.

Porting it to `lib/heroFallbacks.ts` would:
- Add ~134 lines of code that never executes
- Risk a placeholder SVG reaching production if a case's heroImg is accidentally removed (violates the no-fake-content rule)

**Forward requirement for Plan 02:** Plan 02 must confirm every case in `cases.ts` has a `heroImg` field resolving to a real file under `public/work/<slug>/`. Any case with a missing or unresolved hero image surfaces as a Plan 02 gap, not a _heroes.js fallback.

## Path Forward: Plan 03 and Plan 04

### Plan 03 (Font Wiring)

Plan 03 can proceed with the following:

1. **PREREQUISITE (blocking):** User must create an Adobe Fonts web project at fonts.adobe.com that includes "Argent Pixel CF" (Regular + Italic), then provide the resulting kit URL (format: `https://use.typekit.net/<KIT_ID>.css`) to the Plan 03 executor before the font task runs.
2. Add the Adobe Fonts `<link>` to `app/work/layout.tsx` (not in `next/font`).
3. Reference the Adobe-provided font-family name (typically `"argent-pixel-cf"`) in `app/work/portfolio.css` for italic display lockups.
4. No OTF files are copied. No `next/font/local` call.

### Plan 04 (Render)

Plan 04 can proceed without any changes related to _heroes.js. The hero image for each case comes directly from the `heroImg` field in `cases.ts`. Plan 02 owns the verification that all 19 `heroImg` fields resolve to real files under `public/work/<slug>/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed em-dash comment-exclusion regex**

- **Found during:** Task 1 (em-dash audit script)
- **Issue:** The plan's verbatim comment-exclusion regex `grep -vE '^\s*(//|\*|/\*)'` was incorrect. `grep -r` output lines are prefixed with `path:linenum:`, so a pattern anchored at `^` never matches the `//` or `/*` comment syntax. The filter silently passed all comment lines through as if they were user-facing code, producing false positives on comment-only files.
- **Fix:** Corrected the exclusion regex to anchor after the grep output prefix: `grep -vE '^[^:]+:[0-9]+:[[:space:]]*(//|/\*|\*)'`. This matches the `path:linenum:` prefix then checks the actual line content for comment markers.
- **Files modified:** `scripts/em-dash-audit.sh`
- **Verification:** Verified against three cases: clean file (exit 0), file with user-facing em-dash (exit 1), file with em-dash only inside a `//` comment (exit 0, comment correctly excluded).
- **Committed in:** `db2ef68` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1: bug in comment-exclusion regex)
**Impact on plan:** Necessary for correctness. Without the fix the script would silently flag comment-only hits as failures, making QA-01 unreliable. No scope creep.

## Issues Encountered

None beyond the regex deviation above.

## User Setup Required

**BLOCKER for Plan 03 font task:** Before Plan 03 runs, the user must:
1. Log in to fonts.adobe.com with their Creative Cloud account
2. Create a new web project that includes "Argent Pixel CF" (select both Regular and Italic)
3. Copy the kit stylesheet URL (format: `https://use.typekit.net/<KIT_ID>.css`)
4. Provide the URL to the Plan 03 executor

No other external service configuration required for this plan.

## Next Phase Readiness

- QA tooling complete: all five QA requirements (QA-01 through QA-05) have automated script enablers
- Plan 02 ready to run (cases.ts extraction; must confirm all 19 heroImg paths resolve to real files)
- Plan 03 font task BLOCKED pending Adobe Fonts kit URL from user
- Plan 04 (render) has no blockers from this plan; _heroes.js is confirmed excluded

---
*Phase: 01-v1-0-portfolio-launch*
*Completed: 2026-05-31*
