---
phase: 01-v1-0-portfolio-launch
plan: "06"
subsystem: seo-metadata
tags: [metadata, og, twitter, sitemap, robots, meta-tags]
dependency_graph:
  requires: [01-04, 01-05]
  provides: [META-01, META-02, META-03]
  affects: [app/work/[slug]/page.tsx, app/work/page.tsx, app/sitemap.ts, app/robots.ts]
tech_stack:
  added: []
  patterns:
    - Next.js 15 generateMetadata() async function for per-route OG metadata
    - node:fs existsSync at module top-level for build-time curated-OG detection
    - Unicode escapes in regex to avoid literal em/en dashes in source ([—–])
    - Additive sitemap extension via cases.map() spread into existing entries array
key_files:
  created: []
  modified:
    - app/work/[slug]/page.tsx
    - app/work/page.tsx
    - app/sitemap.ts
    - app/robots.ts
key_decisions:
  - "Gallery OG source: cases[0].heroImg (swich -- /work/swich/hero.jpg) -- og-work.png absent from public/"
  - "sanitize() regex uses unicode escapes ([—–]) so no literal em/en dash in source file passes em-dash-audit"
  - "sitemap.ts and robots.ts edited additively -- all pre-existing entries preserved verbatim"
  - "Worktree fast-forwarded from b3fcd50 to 01253de before task execution"
metrics:
  duration: "~18 minutes"
  completed_date: "2026-05-31T09:15:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 4
---

# Phase 01 Plan 06: Per-Route OG/Twitter/Canonical Metadata + Sitemap/Robots Extension Summary

**One-liner:** Next.js 15 generateMetadata for all 19 case routes + gallery, additive sitemap and robots extension, em-dash-safe with unicode-escape sanitize helper.

## What Was Built

### Task 1: generateMetadata on case routes + expanded gallery metadata (META-01 + META-02)

**app/work/[slug]/page.tsx** -- `generateMetadata` added immediately after `generateStaticParams`:
- Returns `title`, `description`, `openGraph` (type: article, images from `c.heroImg`, canonical URL), `twitter` (summary_large_image), and `alternates.canonical`
- `sanitize()` helper strips U+2014 (em dash) and U+2013 (en dash) from case outcome text before inserting into description -- uses `[—–]` unicode escapes (no literal dash characters in source, so `bash scripts/em-dash-audit.sh app/work/` exits 0)
- Description capped at 200 characters; fallback if `c.o` absent: `"${c.t}: selected studio work from HandToMouse."`
- Hero image path normalised to absolute URL: `https://handtomouse.org${heroPath}`
- Canonical: `https://handtomouse.org/work/${c.k}`

**app/work/page.tsx** -- static `metadata` export expanded with OG + Twitter + canonical:
- Gallery OG image source selection logic (documented inline with comment block):
  1. If `public/og-work.png` exists (checked via `existsSync` at build time) -- use it. Curated gallery card.
  2. Otherwise default to `cases[0].heroImg` -- see Gallery OG section below.
- Single call-site: `galleryOgImage` variable. Swap = drop `public/og-work.png` into the repo, zero code edit.

### Task 2: sitemap.ts + robots.ts extended additively (META-03)

**app/sitemap.ts** -- existing `/` and `/wormhole` entries (including their `images[]` sub-arrays) preserved verbatim in `existing` array; 20 new entries appended:
- `/work` gallery: `changeFrequency: 'monthly'`, `priority: 0.9`
- 19 `/work/<slug>` cases: `changeFrequency: 'monthly'`, `priority: 0.7`, via `cases.map()`

**app/robots.ts** -- `/work` and `/work/*` added to the `allow` array. All existing rules preserved:
- `allow` before: `['/$', '/wormhole', '/NateDon_Portfolio_2025.pdf']`
- `allow` after: `['/$', '/wormhole', '/work', '/work/*', '/NateDon_Portfolio_2025.pdf']`
- `disallow` unchanged: `['/about', '/services', '/faq', '/portfolio', '/testimonials', '/api/']`

## Gallery OG Selection (META-02 -- documented as required by plan)

**Source chosen at build time:** `cases[0].heroImg` = `/work/swich/hero.jpg`
- Full OG URL: `https://handtomouse.org/work/swich/hero.jpg`
- cases[0] slug: `swich`
- cases[0] title: `S'WICH`

**Why cases[0]:** `og-work.png` was NOT present in `public/` at build time (only `og-image.png` existed). The fallback is `cases[0].heroImg` which is the studio's chosen lead case -- the bartender-school hospitality brand -- and the most representative single-image answer to "what is HandToMouse" for cold link-share previews.

**Swap procedure (one line, no code edit):**
```bash
cp /path/to/curated-collage.png public/og-work.png
```
On next build, `existsSync(join(process.cwd(), 'public', 'og-work.png'))` returns true and `galleryOgImage` automatically resolves to `https://handtomouse.org/og-work.png`. No code changes needed.

## Verification Results

### Static checks
- `grep -c "generateMetadata" app/work/[slug]/page.tsx` -- 1
- `grep -c "openGraph" app/work/[slug]/page.tsx` -- 1
- `grep -c "twitter" app/work/[slug]/page.tsx` -- 1
- `grep -c "alternates" app/work/[slug]/page.tsx` -- 1
- `grep -c "sanitize" app/work/[slug]/page.tsx` -- 2
- `grep -c "openGraph" app/work/page.tsx` -- 1
- `grep -c "galleryOgImage" app/work/page.tsx` -- 4
- `grep -c "og-work.png" app/work/page.tsx` -- 4
- `bash scripts/em-dash-audit.sh app/work/` -- **OK: exits 0**
- `npm run build` -- **exits 0**

### Live checks (PORT=3055)
- `/work/swich` og:image: `https://handtomouse.org/work/swich/hero.jpg` -- PASS
- `/work/swich` canonical: `https://handtomouse.org/work/swich` -- PASS
- `/work` og:image count: 1 -- PASS
- All 19 case routes og:image loop: **no MISSING** -- PASS
- `/sitemap.xml` total /work URLs: **20** (1 gallery + 19 cases) -- PASS
- `/sitemap.xml` unique case slugs: 19 -- PASS
- `/robots.txt` disallow /work check: **(none)** -- PASS
- `/robots.txt` allows /work and /work/*: PASS

### Additive diff confirmation
- `git diff app/sitemap.ts` -- purely additive (import + workGallery + workCases appended; existing entries untouched)
- `git diff app/robots.ts` -- purely additive (two entries added to allow array; disallow unchanged)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] sanitize() regex literal em-dash fails em-dash audit**
- **Found during:** Task 1 post-edit em-dash audit
- **Issue:** The plan's code sample contained literal U+2014 and U+2013 characters inside the regex character class `/[—–]/g`. The `em-dash-audit.sh` script greps for literal em/en dash in non-comment lines -- the sanitize() const is not a comment, so the line triggered a FAIL.
- **Fix:** Replaced with unicode escapes: `s.replace(/[—–]/g, ' ')` -- identical runtime behavior, zero literal dash characters in source.
- **Files modified:** `app/work/[slug]/page.tsx`
- **Commit:** included in `108a620`

**2. [Rule 2 - Existing imports] Avoided duplicate import declarations in app/work/page.tsx**
- **Found during:** Task 1 planning review (advisor pre-check)
- **Issue:** The plan's replacement block re-declared `import { cases }` and `import type { Metadata }` which already existed in the file.
- **Fix:** Only added the two new imports (`existsSync` from `node:fs`, `join` from `node:path`); reused existing imports.
- **Files modified:** `app/work/page.tsx`

**3. [Rule 3 - Port constraint] All live checks ran on PORT=3055, not 3000**
- **Found during:** Pre-execution environment check
- **Issue:** Plan's verify commands hardcode `localhost:3000`. A sibling process occupies port 3000.
- **Fix:** All dev server starts used `PORT=3055 npm run dev`; all curls targeted `http://localhost:3055`.

## Known Stubs

None -- all metadata fields use real case data from `lib/cases.json`.

## Threat Flags

None -- no new network endpoints, auth paths, or schema changes introduced. OG metadata is intentionally public marketing copy.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| Task 1 | `108a620` | feat(01-06): per-case + gallery OG/Twitter/canonical metadata (META-01 + META-02) |
| Task 2 | `571ee3d` | feat(01-06): extend sitemap.ts + robots.ts for /work surface (META-03) |
