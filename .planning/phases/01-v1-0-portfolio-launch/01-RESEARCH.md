# Phase 1: v1.0 Portfolio Launch - Research

**Researched:** 2026-05-30
**Domain:** Next.js 15 App Router port of single-file HTML portfolio mockup (19 cases), Vercel static deploy
**Confidence:** HIGH (stack, route shape, OG patterns, smoke test); MEDIUM (CSS porting strategy, extraction script); LOW where flagged

## Summary

This phase ports a fully-built ~180KB single-file HTML mockup (`04_portfolio_v2.html`) containing 19 cases inline as a JS object literal into the existing htm-landing Next.js 15 App Router repo, ships it at `handtomouse.org/work` via Vercel, and wires per-case OG metadata + sitemap. The codebase is healthy (PR #8 merged 15.5.9 → 15.5.18, Dependabot cleared), tests don't exist, and the deployment target is a route on an already-deployed Vercel project — no domain wiring work needed beyond confirming `/work` resolves.

Three things in this research contradict the upstream `additional_context` brief and the planner must reconcile them before estimating:

1. **DATA-03 (≥10 real testimonials) cannot pass today.** Only 6 cases carry a real attributed quote; 13 carry placeholder strings with empty `a` (author) field. Outreach is parked, so reaching 10 organically may take weeks or never arrive.
2. **Asset size is ~237MB on disk, not 40-50MB.** verde alone is 36MB, stealth 30MB, wbb 26MB. Largest single git commit and largest repo growth ever.
3. **Image mix is jpg/png-heavy (94 jpg, 85 png, 67 svg, 5 webp in canonical references), not "mostly webp".** Changes the `next/image` calculation — these benefit from optimization rather than being already optimized.

**Primary recommendation:** Extract `cases` array via a one-off Node script using `vm.runInNewContext` (not regex — the data has embedded quotes like `S\'WICH` that will silently corrupt). Scope canonical CSS into `app/work/portfolio.css` imported only from `app/work/layout.tsx` so the BB-OS palette in `globals.css` is untouched. Static-generate all 19 case routes via `generateStaticParams`. Use existing `heroImg` per case as the OG image (no runtime `opengraph-image.tsx` needed). Run a headless screenshot smoke test per breakpoint instead of installing a test framework. Apply POLISH-01..04 directly in the Next.js port, not on the canonical first (avoids double-touch).

## Project Constraints (from CLAUDE.md and memory)

No project-root `CLAUDE.md` exists. No `.claude/skills/` or `.agents/skills/` directories. The following carry-forward constraints come from MEMORY.md + scope-lock docs and the planner MUST honor them:

- **No em-dashes in user-facing strings.** CSS/JS comments OK. Em-dash audit must pass (QA-01). Canonical was clean at audit time (36 hits, all in CSS/JS comments per HANDOFF.md).
- **Sign-off as "Nate", never "Don"** — applies if any outbound copy appears (none expected in portfolio surface).
- **No invented stats / no fake content.** Every quote, image, case detail must be real (PROJECT.md constraint).
- **Backup canonical before any in-place batch.** Existing backup at `04_portfolio_v2.html.bak.20260519-2109-pre-r1r2r3-fixes`. If the plan touches canonical again, add another backup.
- **Visual changes: confirm in Chrome before claiming done.** Headless screenshot satisfies for non-interactive verification.
- **Cosmetic decisions default + one-line callout; ASK on load-bearing branches** — per `feedback_cosmetic_decisions_default.md`. The CSS-porting strategy IS load-bearing (changes design system isolation) → ASK. Tile hover rotation amount is cosmetic → default.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| POLISH-01 | Testimonial blocks render at correct scale with serif glyph | Apply directly in Next.js port (`app/work/[slug]/components/Testimonial.tsx`) — see HANDOFF.md spec lines 26-36; sibling `data-num` watermark already in canonical CSS |
| POLISH-02 | Deliverables index hover thumbnail + link to case | Apply directly in Next.js port; use case `heroImg` as hover thumb fallback (HANDOFF.md lines 38-51) |
| POLISH-03 | End-of-book / start-of-book dead card hidden | Trivial in Next.js — only render the card if `prevCase` / `nextCase` exists. Solved-by-architecture. |
| POLISH-04 | Gallery counter reads "19 cases" | Trivial in Next.js — gallery header reads `cases.length`. Solved-by-architecture. |
| DATA-01 | Cases extracted from canonical HTML into `cases.json` (or `cases.ts`) | Section: Standard Stack > Extraction; recommend `vm.runInNewContext` Node script |
| DATA-02 | Images copied to `public/work/{slug}/` with preserved filenames | Section: Architecture Patterns > Asset Migration; ~237MB total |
| DATA-03 | ≥10 cases carry real testimonial quote | **CANNOT PASS TODAY — only 6 real quotes on file.** See Open Questions. |
| RENDER-01 | Gallery at `/work` lists 19 cases | Section: Architecture Patterns > Route Shape |
| RENDER-02 | Per-case routes at `/work/{slug}` | Section: Architecture Patterns > Route Shape; `generateStaticParams` |
| RENDER-03 | Gallery → case → back nav works mobile + desktop | Standard Next.js `<Link>` + `router.back()`; section: Code Examples |
| RENDER-04 | Visual fidelity matches canonical | Section: Architecture Patterns > CSS Porting Strategy; scoped CSS |
| DEPLOY-01 | Vercel production deploy from main | Existing project at `prj_SUJ64aQZySugxkPOfb2BR7Qr8WEK`; auto-deploys on push |
| DEPLOY-02 | `handtomouse.org/work` resolves | Existing Vercel domain wiring covers all subpaths; no extra config |
| DEPLOY-03 | `/work/{slug}` resolves on production | Same — once `generateStaticParams` is in place, Vercel statically pre-renders |
| META-01 | Per-case OG metadata renders correctly | Section: Code Examples > `generateMetadata`; Next.js 15 Metadata API |
| META-02 | Gallery `/work` has OG metadata | Same pattern, static export |
| META-03 | `robots.txt` allows crawl; sitemap lists 19 URLs | Section: Code Examples > sitemap.ts update; currently disallows `/portfolio` not `/work` |
| QA-01 | Em-dash audit passes | Run `rg "—" app/work/ public/work/ lib/cases.*` after extraction |
| QA-02 | Mobile pass at 360px + 768px | Headless screenshot per breakpoint |
| QA-03 | Desktop pass at 1280px + 1920px | Same |
| QA-04 | All 19 case images load on production | Curl-check each `heroImg` URL post-deploy; check Network panel manually |
| QA-05 | Gallery → case → back smoke test in Chrome + Safari, mobile + desktop | Section: Validation Architecture; headless screenshot pattern + manual cross-browser pass |

## User Constraints (no CONTEXT.md exists)

CONTEXT.md was not produced for this phase (no `/gsd-discuss-phase` run). The planner has full discretion across the technical choices in this research, BUT must treat the scope locks below as load-bearing decisions equivalent to a CONTEXT.md ## Decisions block:

### Locked Decisions (from `launch_scope_locked_20260530.md`)

- **19 cases ship, 4 deferred to v1.1** (Jac+Jack / The Char / Undercard / Bonds-ARC)
- **10-testimonial floor** — but see Open Questions, current real count is 6
- **No deadline** — quality bar wins
- **Outreach parked** — no chasing for new quotes
- **Target repo:** `~/Documents/GitHub/htm-landing/` (Next.js 15 App Router, Tailwind 4)
- **Live URL:** `handtomouse.org/work`
- **Source of truth:** `~/UFC/spins/htm_v2_5round_loop_20260517/mockups/04_portfolio_v2.html`

### Claude's Discretion

- Canonical extraction tooling (sandbox-eval vs other approaches)
- CSS porting strategy (scope mechanism)
- Route component structure (server vs client component split)
- Sitemap / robots.ts edits
- Smoke test mechanism

### Deferred Ideas (OUT OF SCOPE)

- 4 new cases (CASE-V2-01..04)
- All outreach (REACH-V2-01..03)
- claude.design landing-page redesign port
- Lighthouse perf optimization beyond Next.js defaults
- Custom CMS, analytics, Fishbowl PSD font recovery, newsletter signup, contact form

## Standard Stack

### Core (already installed in repo — verified via package.json)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.18 | App Router, SSG, metadata API, `next/image`, `next/font` | Already deployed to Vercel, scope-locked. [VERIFIED: package.json] Latest npm: 16.2.6 (Jan 2026) — don't bump, scope is Next 15. [VERIFIED: npm view next version] |
| react / react-dom | 18.3.1 | Server + client components | Pinned in repo. [VERIFIED: package.json] |
| tailwindcss | ^4 (v4) | Utility classes (sparingly used in this repo) | Already configured with `@import 'tailwindcss';` in globals.css. [VERIFIED: package.json + globals.css line 1] |
| typescript | 5.9.3 | Strict mode | Build runs `tsc --noEmit && next build`. [VERIFIED: package.json + tsconfig.json] |

### No new dependencies required for Phase 1.

Confirmed by walking each requirement: every one can be implemented with Next.js built-ins + already-installed packages. **Do not add:**

- A test framework (use headless screenshot pattern instead — see Validation Architecture)
- A CMS / data-fetcher (cases are static JSON, generated at build time)
- An OG image generator package (use existing case `heroImg` files)
- A CSS-in-JS library (scoped CSS file is sufficient)
- An image optimization library (use `next/image`)

### Alternatives Considered

| Instead of | Could Use | Why we don't |
|------------|-----------|--------------|
| Pure SSG with `generateStaticParams` | ISR with `revalidate` | Content is fixed, no per-request data. ISR adds runtime cost for zero benefit. [CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params] |
| `next/image` for all imagery | Static `<img>` tags | jpg/png mix benefits from Next image optimization (responsive sizes, AVIF/WebP serving). Vercel handles this automatically. |
| `opengraph-image.tsx` runtime generation | Static OG using existing `heroImg` | We have real hero photography per case. Runtime generation adds complexity for no fidelity gain. |
| `next/font/google` for Inter, VT323, Geist Mono | External `<link>` to fonts.googleapis.com | Existing CSP blocks external Google Fonts (`font-src 'self' use.typekit.net data:`). `next/font/google` self-hosts at build time → no CSP changes, faster, deterministic. [CITED: nextjs.org/docs/app/api-reference/components/font] **All three fonts are available in `next/font/google`** (verified: Inter, VT323, Geist_Mono). |

**Verification status:** All versions above were verified against `package.json` in the worktree on 2026-05-30. Note: `.planning/codebase/STACK.md` says Next 15.5.9 — this is stale, the actual installed version is 15.5.18 post-PR-#8.

## Architecture Patterns

### Recommended Project Structure

```
htm-landing/
├── app/
│   ├── work/                          # NEW — portfolio routes (scoped)
│   │   ├── layout.tsx                 # Scoping wrapper; imports portfolio.css
│   │   ├── portfolio.css              # Verbatim canonical CSS, scoped
│   │   ├── page.tsx                   # /work gallery (Server Component)
│   │   ├── opengraph-image.png        # Static OG for /work (or use Metadata API image)
│   │   ├── components/                # Portfolio-only UI
│   │   │   ├── GalleryGrid.tsx        # Server Component (no interactivity)
│   │   │   ├── SectorFilter.tsx       # Client Component (filter state)
│   │   │   ├── CasePlayer.tsx         # Client Component (carousel state)
│   │   │   ├── Testimonial.tsx        # Server Component
│   │   │   ├── DeliverablesIndex.tsx  # Client Component (hover thumb)
│   │   │   └── NextPrevCard.tsx       # Server Component
│   │   └── [slug]/
│   │       └── page.tsx               # /work/{slug} detail (Server Component)
│   ├── portfolio/                     # EXISTING — placeholder copy (untouched)
│   ├── ... (existing routes)
│   ├── sitemap.ts                     # EDIT — add 19 work URLs
│   └── robots.ts                      # EDIT — allow /work
├── lib/
│   └── cases.ts                       # NEW — generated from extraction script, exports typed Case[]
├── public/
│   └── work/                          # NEW — case imagery
│       ├── swich/                     # Filenames preserved from canonical assets/
│       ├── fishbowl/
│       └── ... (19 folders)
└── scripts/
    └── extract-cases.mjs              # NEW — one-shot Node script, run manually
```

### Pattern 1: Canonical Extraction via Sandboxed Eval

**What:** Use Node's `vm.runInNewContext` to evaluate the `cases` array as JavaScript in an isolated context, then `JSON.stringify` the result to disk.

**When to use:** Whenever the source data is JS object literals (not JSON) with embedded escapes, nested quotes, or template syntax. Regex parsing of this kind silently corrupts on edge cases like `S\'WICH`, `"It's"`, `Women's` — all of which exist in the canonical.

**Example (run once, manually):**

```js
// scripts/extract-cases.mjs
// Source: Node.js docs https://nodejs.org/api/vm.html#vmruninnewcontextcode-contextobject-options
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(
  '/Users/handtomouse/UFC/spins/htm_v2_5round_loop_20260517/mockups/04_portfolio_v2.html',
  'utf8'
);

// Extract the array literal. The cases array begins at "const cases = ["
// and ends at the matching "];" at the top level of the <script>.
const start = html.indexOf('const cases = [');
if (start < 0) throw new Error('cases array not found');
const arrayStart = html.indexOf('[', start);

// Walk braces to find the matching close, respecting strings.
let depth = 0, inStr = false, strChar = '', escaped = false, end = -1;
for (let i = arrayStart; i < html.length; i++) {
  const ch = html[i];
  if (escaped) { escaped = false; continue; }
  if (ch === '\\') { escaped = true; continue; }
  if (inStr) { if (ch === strChar) inStr = false; continue; }
  if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) throw new Error('matching ] not found');

const literal = html.slice(arrayStart, end);
const cases = vm.runInNewContext('(' + literal + ')', {});

// Byte-count check per feedback_verify_byte_count_after_batch_mutation
const jsonOut = JSON.stringify(cases, null, 2);
if (jsonOut.length < literal.length * 0.5) {
  throw new Error(`Output suspiciously small: ${jsonOut.length} vs input ${literal.length}`);
}

fs.writeFileSync('lib/cases.json', jsonOut);
console.log(`Extracted ${cases.length} cases, ${jsonOut.length} bytes`);
```

Then a tiny `lib/cases.ts`:

```ts
import casesData from './cases.json';
export type Case = typeof casesData[number];
export const cases: Case[] = casesData;
export const getCaseBySlug = (slug: string): Case | undefined =>
  cases.find(c => c.k === slug);
```

**Anti-pattern:** Regex such as `/const cases = (\[[\s\S]*?\]);/` will match the FIRST `]` it sees (inside the first case's `m:[[...]]`) and silently truncate the array. Verified by reading the data: every case has multiple nested arrays in `m`, `palette`, `stats`, `images[].tags`.

### Pattern 2: CSS Porting via Scoped Stylesheet

**What:** Copy canonical's `<style>` block verbatim into `app/work/portfolio.css`. Import only from `app/work/layout.tsx`. The existing globals.css design system (BB-OS palette) stays untouched.

**Why this matters:** Canonical defines `--bg: #000`, `--paper: #050505`, `--amber: #f7a835`. Existing `app/globals.css` defines `--bg: #0b0b0b`, `--accent: #ff9d23`, `--accent-hover: #FFB84D` and uses these across the home page, BattleSystem, ContactModal, etc. Dumping canonical CSS into globals.css will overwrite these vars and break the home page. Putting canonical CSS in a route-scoped file imported from `app/work/layout.tsx` keeps each design system in its own scope.

**Why route-segment CSS works in App Router:** Next.js 15 supports CSS imports at any level in `app/`. CSS imported from `app/work/layout.tsx` is included on the page when any `app/work/**` route is active and is automatically code-split out of other routes. [CITED: nextjs.org/docs/app/getting-started/css#css-modules-and-global-styles]

**Implementation:**

```tsx
// app/work/layout.tsx
import './portfolio.css';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <div className="htm-portfolio">{children}</div>;
}
```

Then in `portfolio.css`, wrap canonical's `:root` block with `.htm-portfolio { ... }` so the variables don't leak globally:

```css
/* portfolio.css */
.htm-portfolio {
  --bg: #000; --paper: #050505; --tile: #0b0b0b;
  --ink: rgba(238, 234, 226, 0.94); --ink-strong: #f6f3ee;
  --amber: #f7a835; --amber-soft: rgba(247, 168, 53, 0.55);
  /* ... all canonical vars ... */
}
.htm-portfolio body { /* canonical body styles */ }
.htm-portfolio .tty { /* canonical .tty styles */ }
/* ... etc ... */
```

Trade-off: every selector needs the `.htm-portfolio` prefix. Roughly 200-300 selectors in canonical CSS. One-time mechanical edit. Confidence: HIGH that this preserves visual fidelity; MEDIUM that it works without conflicts on the body element (canonical's `body { padding: 8px }` conflicts with htm-landing's body styles — keep it scoped to `.htm-portfolio` element, NOT `body`).

**Alternative:** PostCSS `@scope` rule or CSS Modules. Both add tooling complexity. Manual `.htm-portfolio` prefix is the simplest path with zero new tooling.

### Pattern 3: Static-Generated Per-Case Routes

**What:** `app/work/[slug]/page.tsx` exports `generateStaticParams` returning all 19 slugs. At build time, Vercel pre-renders 19 static HTML pages.

**Example (verified pattern):**

```tsx
// app/work/[slug]/page.tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-static-params
import { cases, getCaseBySlug } from '@/lib/cases';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return cases.map(c => ({ slug: c.k }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.t} | HandToMouse Portfolio`,
    description: c.o,
    openGraph: {
      title: c.t,
      description: c.o,
      images: [`/work/${c.k}/${c.heroImg.split('/').pop()}`],
      type: 'article',
    },
    alternates: { canonical: `https://handtomouse.org/work/${c.k}` },
  };
}

export default async function CasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  return <CaseDetail case={c} />;
}
```

**Note on Next.js 15 params type:** As of Next.js 15, `params` is a `Promise<>` and must be `await`ed. [CITED: nextjs.org/docs/app/api-reference/file-conventions/page]

### Pattern 4: Asset Migration with Filename Preservation

**What:** Copy `~/UFC/spins/htm_v2_5round_loop_20260517/mockups/assets/{slug}/*` to `htm-landing/public/work/{slug}/*` preserving filenames. The extracted `cases.json` `images[].src` strings change from `assets/swich/01.jpg` to `/work/swich/01.jpg`.

**Implementation:** Add a post-extraction step to the extraction script that rewrites every `src:` and `heroImg:` path during the extract:

```js
// In extract-cases.mjs, after the eval:
const rewrite = (path) => path?.replace(/^assets\//, '/work/') ?? path;
for (const c of cases) {
  c.heroImg = rewrite(c.heroImg);
  if (c.images) for (const im of c.images) im.src = rewrite(im.src);
}
```

Then rsync the asset folders:

```bash
# Per-folder so failures are isolated; ~237MB total
for slug in swich fishbowl sbts mdb maplemoon ferrari bankwest refundid \
            troodpratt pureairo allianz endoca hills stealth softlite \
            mullet aura salesforce verde; do
  mkdir -p public/work/$slug
  rsync -a "$HOME/UFC/spins/htm_v2_5round_loop_20260517/mockups/assets/$slug/" \
           "public/work/$slug/"
done
```

**Storage impact:** 237MB added to the git repo, permanent. No git LFS configured in htm-landing currently. Vercel serves `public/` as-is without size constraints (the only hard limit is per-deployment ~100MB serverless function bundles, which doesn't apply to static `public/`). [CITED: vercel.com/docs/limits]

**Anti-pattern:** Do NOT use `next/image` with `assets/...` paths in the source dir — `public/` is the only path Next.js serves statically.

### Anti-Patterns to Avoid

- **Regex extraction of the cases array** — see Pattern 1 reasoning.
- **Merging canonical CSS into globals.css** — see Pattern 2 reasoning.
- **Adding the canonical's external Google Fonts `<link>` tag** — current CSP blocks `fonts.googleapis.com` in `style-src` and `fonts.gstatic.com` in `font-src`. Use `next/font/google` instead. ASVS V14 alignment (CSP integrity).
- **Repurposing `/portfolio`** — that route exists with placeholder copy. Leave it alone unless Nate explicitly wants it redirected to `/work` (out of scope flag).
- **Re-running polish fixes on the canonical first** — POLISH-01..04 are tracked at `htm_portfolio_v3_polish_round2_20260520/HANDOFF.md` for the canonical, but the canonical is being retired as a runtime artefact. Apply the fixes ONCE, in the Next.js port. Don't double-touch.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Parsing `cases` array from HTML | Regex / manual transcription | `vm.runInNewContext` | Edge cases (embedded quotes, escaped apostrophes) silently break regex; manual transcription is 19 cases × ~30 fields = ~570 hand-transcribed strings, error-prone |
| Per-page OG metadata | Custom `<meta>` injection | Next.js Metadata API + `generateMetadata` | Type-safe, handles Twitter cards + canonical + alternates automatically [CITED: nextjs.org/docs/app/api-reference/functions/generate-metadata] |
| Self-hosting Inter/VT323/Geist Mono | Manual `@font-face` + downloaded files | `next/font/google` | Auto-subsetting, font-display optimization, zero layout shift, no CSP changes |
| Sitemap.xml | Hand-rolled XML route | Next.js `app/sitemap.ts` already exists | Just extend the existing array with 19 case URLs |
| Robots.txt | Static file | Next.js `app/robots.ts` already exists | Just remove `/portfolio` from disallow and consider adding/removing `/work` |
| Smoke-test runner | Custom Puppeteer harness | Headless Chrome with `--virtual-time-budget` per the `feedback_headless_autotest_pattern` MEMORY rule | Lightweight, no test framework dependency, gives visual evidence |
| Image optimization (responsive sizes, AVIF/WebP serving) | `<img>` + manual `srcset` | `next/image` | Vercel does this automatically for images in `public/` |
| Static route generation | Custom build script | `generateStaticParams` | Next.js pre-renders, Vercel CDN-caches, zero cold start |

**Key insight:** This phase is mostly "wire up existing Next.js primitives correctly + carefully port one big HTML file." There's almost nothing to invent. The two genuinely-novel pieces are (a) the extraction script and (b) the CSS scoping pattern. Everything else is plumbing on top of well-trodden Next.js conventions.

## Runtime State Inventory

> This is partially a refactor phase (the canonical becomes structured data). Runtime state items found:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | **None.** No database, no caches, no user data. Forms in `app/api/contact|subscribe` are stateless. | None |
| Live service config | **None affected.** Vercel project (`prj_SUJ64aQZySugxkPOfb2BR7Qr8WEK`) already exists; deploy is via `git push` to main. Resend API key (optional) lives in Vercel dashboard, no change. | None |
| OS-registered state | **None.** No cron, no scheduled tasks tied to this project. | None |
| Secrets/env vars | `RESEND_API_KEY` and `NOTIFICATION_EMAIL` in Vercel dashboard. Not touched by this phase. | None |
| Build artifacts | `.next/` and `tsconfig.tsbuildinfo` will be regenerated on next build. The existing `/portfolio` route's `opengraph-image.tsx` is unchanged. | None |
| External references | **Search for any URL pointing at `htm-landing/portfolio` that should now point at `/work`.** Likely none (existing `/portfolio` is placeholder, not advertised). Confirm with Nate before adding a redirect. | Verify only |

**The canonical question (re-asked):** *After the Next.js port ships, what runtime systems still reference the old single-file mockup?* Answer: nothing programmatic. The mockup lives in `~/UFC/spins/...` which is Nate's local dev workspace, not deployed anywhere. The mockup remains as a local design reference.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm scripts, extract-cases.mjs | ✓ (assumed — running) | Project requires no specific version | — |
| npm | dependency install | ✓ | — | — |
| Next.js 15.5.18 | build/dev | ✓ in node_modules | 15.5.18 | — |
| Vercel CLI | Optional — manual deploy preview | unknown | — | Use git push for prod deploy (auto) |
| Vercel project access | Production deploy | ✓ (project.json present) | — | — |
| Custom domain `handtomouse.org` | DEPLOY-02 | ✓ (currently serving `/`) | — | — |
| ImageMagick / sharp / Squoosh | Optional image pre-optimization | not required | — | `next/image` handles at build time |
| Headless Chrome (for smoke screenshots) | QA-05 | system Chrome assumed | — | If absent, manual cross-browser pass |
| `rg` (ripgrep) | Em-dash audit (QA-01) | ✓ assumed | — | `grep -rE "—"` works |

**Missing dependencies with no fallback:** None identified.
**Missing dependencies with fallback:** None identified.

## Common Pitfalls

### Pitfall 1: CSP blocks Google Fonts CDN

**What goes wrong:** Canonical loads Inter, VT323, Geist Mono from `fonts.googleapis.com`. Existing `next.config.js` CSP has `style-src 'self' 'unsafe-inline' use.typekit.net;` and `font-src 'self' use.typekit.net data:;` — both reject Google's font CDN.
**Why it happens:** Existing site uses `next/font/google` (self-hosted) so the CSP never needed Google domains.
**How to avoid:** Use `next/font/google` for all three fonts. `Inter`, `VT323`, and `Geist_Mono` are all available. Configure in `app/work/layout.tsx`:

```tsx
import { Inter, VT323, Geist_Mono } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','700','800','900'] });
const vt323 = VT323({ subsets: ['latin'], weight: '400' });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['200','400','600'] });
```
**Warning signs:** Fonts fall back to system serif/sans on production, visual fidelity check fails.

### Pitfall 2: ArgentPixelCF custom font

**What goes wrong:** Canonical loads `ArgentPixelCF-Regular.otf` and `-Italic.otf` from `fonts/` (relative path). This is not a Google Font and not in `next/font/google`. Without it, the case-mark italic display lockups (S'WICH wordmark, Fishbowl italic, etc.) fall back to VT323 (canonical's declared fallback).
**Why it happens:** ArgentPixelCF is a paid commercial font (Connary Fagen Type Design). The OTF files would need to be hosted in `public/fonts/` and loaded via `next/font/local`.
**How to avoid:** EITHER (a) copy `ArgentPixelCF-Regular.otf` and `-Italic.otf` to `public/fonts/`, declare via `next/font/local`, and confirm licensing covers web embedding, OR (b) accept the VT323 fallback that canonical already specifies, document the visual trade-off, and surface to Nate as a cosmetic call.
**Warning signs:** Big italic display text on case covers and chapter spines renders in monospace VT323 instead of italic serif. Compare hero of any case against canonical screenshot.

**Verification needed:** Check whether `fonts/ArgentPixelCF-*.otf` files exist in the canonical's directory, and confirm licensing.

### Pitfall 3: Sector filter & gallery client-side state vs SSG

**What goes wrong:** Canonical's gallery has a sector chip filter that shows/hides tiles via `style.display`. If implemented as a Server Component, the filter doesn't work without client JS.
**Why it happens:** SSG renders HTML, but interactive filtering needs `useState`.
**How to avoid:** Split — `<GalleryGrid>` is a Server Component that renders all 19 tiles; `<SectorFilter>` is a Client Component wrapping the grid that toggles CSS classes (`data-sector-active`). Use CSS to hide non-matching tiles. Total client JS: ~30 lines.

### Pitfall 4: Case carousel (`pStage` player) is fully client-side

**What goes wrong:** The artboards player at canonical lines 1257-1268 is a controlled image carousel with prev/next/strip. Server-rendering won't work.
**Why it happens:** It needs `useState` for current index + click handlers.
**How to avoid:** `CasePlayer.tsx` as a Client Component receives `images: Image[]` as prop. Use `next/image` with `priority` on the current image and lazy on the rest. Add keyboard nav (←/→) for parity with canonical.

### Pitfall 5: 237MB asset commit overwhelms git tooling

**What goes wrong:** A single commit adding 237MB across 200+ files will be slow to push, slow to pull, and bloats the repo permanently. Cloning the repo for the first time will be measurably worse forever.
**Why it happens:** Git stores binary blobs in full, not delta-compressed.
**How to avoid:** Three options, pick one and document:
1. **Just commit.** 237MB is large but not catastrophic for a 1-developer repo. GitHub allows it.
2. **Per-case commits.** 19 commits, ~12MB each on average. Easier to push, easier to bisect if something goes wrong.
3. **Git LFS.** Vercel supports LFS for build inputs. Pros: smaller repo. Cons: new tooling, LFS bandwidth quotas apply.

**Recommendation:** Option 2 (per-case commits) is the lowest-cost middle ground. If quota becomes a concern later, migrate to LFS in a follow-up.
**Warning signs:** `git push` takes >2min, GitHub displays repo size warning (free tier soft-warns at 1GB).

### Pitfall 6: `next/image` requires width + height

**What goes wrong:** `next/image` errors at build time if width/height not provided and the image isn't loaded as a static import.
**Why it happens:** Next.js needs dimensions to reserve layout space (prevent CLS).
**How to avoid:** Either (a) import statically: `import heroImg from '@/public/work/swich/hero.jpg'` — Next auto-computes dimensions, but doesn't work with dynamic slug paths, OR (b) use `<Image>` with `fill` prop + a CSS-sized parent container, which canonical's carousel already does (`stage` div has fixed aspect ratio). Option (b) matches canonical layout.

### Pitfall 7: `params` is a Promise in Next.js 15

**What goes wrong:** `function Page({ params }: { params: { slug: string } })` works in Next 13/14 but produces a TypeScript error and runtime warning in Next 15.5+.
**Why it happens:** Next.js 15 made `params` and `searchParams` async to support Partial Prerendering.
**How to avoid:** `params: Promise<{ slug: string }>` and `await params` before destructuring. See Pattern 3 example. [CITED: nextjs.org/docs/app/building-your-application/upgrading/version-15]

### Pitfall 8: `_heroes.js` external script reference

**What goes wrong:** Canonical line 24 has `<script src="_heroes.js"></script>` — a sibling file referenced but not part of the inline data.
**Why it happens:** This is presumably a build helper or hero image preloader.
**How to avoid:** Read `_heroes.js` before porting. It may contain logic the Next.js port needs to replicate, or it may be dead code from an earlier iteration.

## Code Examples

### Per-Case Metadata + Static Generation

```tsx
// app/work/[slug]/page.tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-static-params
import { cases, getCaseBySlug } from '@/lib/cases';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CaseDetail from '../components/CaseDetail';

export const dynamicParams = false; // 404 for unknown slugs

export async function generateStaticParams() {
  return cases.map(c => ({ slug: c.k }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  const heroPath = c.heroImg.startsWith('/') ? c.heroImg : `/${c.heroImg}`;
  return {
    title: `${c.t} | HandToMouse Portfolio`,
    description: c.o.replace(/—/g, ' '), // em-dash safety strip
    openGraph: {
      title: c.t,
      description: c.o.replace(/—/g, ' '),
      images: [`https://handtomouse.org${heroPath}`],
      type: 'article',
      url: `https://handtomouse.org/work/${c.k}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: c.t,
      description: c.o.replace(/—/g, ' '),
      images: [`https://handtomouse.org${heroPath}`],
    },
    alternates: { canonical: `https://handtomouse.org/work/${c.k}` },
  };
}

export default async function CasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  return <CaseDetail case={c} />;
}
```

### Sitemap Extension (META-03)

```ts
// app/sitemap.ts (edit existing file)
import { MetadataRoute } from 'next';
import { cases } from '@/lib/cases';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://handtomouse.org';
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/wormhole`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...cases.map(c => ({
      url: `${baseUrl}/work/${c.k}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
```

### Robots.ts Update (META-03)

```ts
// app/robots.ts (edit existing file)
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/$', '/wormhole', '/work', '/work/*', '/NateDon_Portfolio_2025.pdf'],
      disallow: ['/about', '/services', '/faq', '/portfolio', '/testimonials', '/api/'],
    },
    sitemap: 'https://handtomouse.org/sitemap.xml',
  };
}
```

### Em-Dash Audit (QA-01)

```bash
# Run after extraction and before deploy. Should return nothing.
rg --no-heading "—" app/work/ lib/cases.json public/work/ \
  --type-add 'data:*.{json,ts,tsx,css}' --type data || echo "Audit clean"

# Or with grep:
grep -rE "—" app/work/ lib/cases.json public/work/ 2>/dev/null
```

### Asset Migration (DATA-02)

```bash
# Per-folder commits — pitfall 5 mitigation
SRC="$HOME/UFC/spins/htm_v2_5round_loop_20260517/mockups/assets"
for slug in swich fishbowl sbts mdb maplemoon ferrari bankwest refundid \
            troodpratt pureairo allianz endoca hills stealth softlite \
            mullet aura salesforce verde; do
  mkdir -p "public/work/$slug"
  rsync -a "$SRC/$slug/" "public/work/$slug/"
  git add "public/work/$slug"
  git commit -m "assets: import $slug case imagery"
done
```

## State of the Art

| Old Approach (in canonical) | Current Approach (target) | When Changed | Impact |
|--------------|------------------|--------------|--------|
| External Google Fonts via `<link>` | `next/font/google` self-hosted | Next.js 13+ | Faster loading, CSP-compliant, no FOIT |
| Inline `<script>` data array | Imported typed JSON from `lib/` | Standard since Next 12 | Tree-shakeable, type-safe access |
| Single-file all-routes-in-DOM SPA | Per-route SSG with `generateStaticParams` | App Router (Next 13) | Per-page metadata, faster TTI, CDN-cached |
| `style.display = 'none'` for filter | CSS classes via Client Component | React 18 | Server-rendered first paint, hydrate later |
| `<img src="...">` | `<Image>` with `fill` | next/image since Next 10 | Auto AVIF/WebP, responsive sizing |
| Custom `<meta>` injection per page | Metadata API + `generateMetadata` | Next 13+ | Type-safe, supports Twitter/OG/canonical |

**Deprecated/outdated:**
- `next/head` is replaced by Metadata API in App Router. The existing `/portfolio/page.tsx` already uses the Metadata API correctly — copy that pattern.
- `pages/` directory: not present in this repo (all routes are `app/`).

## Validation Architecture

> Including this section because `nyquist_validation` config is absent from `.planning/config.json` (file doesn't exist) — default is enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **None installed.** No Jest, Vitest, Playwright, or Cypress in `devDependencies`. |
| Config file | None |
| Quick run command | `npm run typecheck` + `npm run lint` (existing) |
| Full suite command | `npm run build` (runs `tsc --noEmit && next build`) |

The repo has shipped to production for 1+ year without a test framework. This phase does NOT recommend introducing one — the marginal value for a 19-page static portfolio doesn't justify the framework decision. Instead, leverage headless Chrome screenshots for visual + navigation smoke tests.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| POLISH-01 | Testimonial scale + serif glyph | visual | headless screenshot of `/work/swich` at 1280px, compare to canonical hero region | ❌ Wave 0 |
| POLISH-02 | Deliverables hover thumb | manual | move mouse over each deliverable row, confirm thumb shows | n/a |
| POLISH-03 | End/start dead card hidden | visual + DOM | screenshot of `/work/swich` "what's next" section shows only "next" card | ❌ Wave 0 |
| POLISH-04 | Gallery counter "19 cases" | DOM | `curl http://localhost:3000/work \| grep "19 cases"` | n/a |
| DATA-01 | cases extracted | runtime | `node -e "console.log(require('./lib/cases.json').length === 19)"` | ❌ Wave 0 |
| DATA-02 | images at public/work/ | filesystem | `for slug in ...; do test -f public/work/$slug/hero.* && echo OK; done` | ❌ Wave 0 |
| DATA-03 | ≥10 real testimonials | runtime | `node -e "console.log(require('./lib/cases.json').filter(c => c.testimonial.a).length >= 10)"` | **WILL FAIL — see Open Questions** |
| RENDER-01..04 | Routes render | smoke | headless Chrome script visits `/work` and each `/work/{slug}`, screenshots | ❌ Wave 0 |
| DEPLOY-01..03 | Vercel + custom domain | manual | post-deploy `curl -I https://handtomouse.org/work` returns 200 | n/a |
| META-01..02 | OG metadata correct | DOM | `curl https://handtomouse.org/work/swich \| grep "og:image"` | n/a |
| META-03 | sitemap lists 19 URLs | DOM | `curl https://handtomouse.org/sitemap.xml \| grep -c "/work/"` returns 20 (1 gallery + 19 cases) | n/a |
| QA-01 | em-dash audit clean | static | `! grep -rE "—" app/work lib/cases.json public/work` | n/a |
| QA-02..03 | Breakpoint pass | visual | headless Chrome with `--window-size=360,800`, `768,1024`, `1280,800`, `1920,1080` | ❌ Wave 0 |
| QA-04 | All 19 images load | runtime | post-deploy: extract all `src=` from each page, curl-check 200 | ❌ Wave 0 |
| QA-05 | Gallery → case → back nav | smoke | headless Chrome navigates `/work`, clicks first tile, asserts URL = `/work/{slug}`, clicks back, asserts URL = `/work` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run typecheck && npm run lint`
- **Per wave merge:** `npm run build` (catches type errors, missing imports, MDX errors, route-resolution errors)
- **Phase gate:** Headless screenshot suite across 4 breakpoints + manual Chrome+Safari cross-browser pass before `/gsd-verify-work`.

### Wave 0 Gaps

- [ ] `scripts/extract-cases.mjs` — extraction script (DATA-01 enabler)
- [ ] `scripts/smoke-test.sh` — headless Chrome smoke harness for QA-05 (and POLISH-01..03 visual checks). Per `feedback_headless_autotest_pattern.md`: sibling-file copy + injected setTimeout + `--virtual-time-budget` screenshot.
- [ ] `scripts/audit-emdashes.sh` — wrapper for QA-01
- [ ] `scripts/check-image-200s.sh` — post-deploy curl checker for QA-04
- [ ] No test framework installed; no `pytest.ini` / `jest.config.*` / `vitest.config.*` needed.

**Confidence:** HIGH that this validation approach is sufficient for a static 19-page portfolio. Future feature work (forms, interactivity beyond the carousel) would justify a real test framework; this phase doesn't.

## Security Domain

> `security_enforcement` config is absent — default to enabled. Phase is mostly static-content render, so risk surface is small.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | n/a — public portfolio, no users |
| V3 Session Management | no | n/a |
| V4 Access Control | no | n/a — all content public |
| V5 Input Validation | minimal | sector filter is from static enum, not user input. No new form surface in this phase. |
| V6 Cryptography | no | n/a |
| V12 File Resources | yes | All assets served from `public/`, no user upload, no path traversal risk |
| V14 Configuration | yes | CSP already configured in `next.config.js`; adding fonts requires update OR use `next/font/google` (preferred) |
| V13 API Errors | no | no new API routes added |

### Known Threat Patterns for static Next.js portfolio

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via injected case data | Tampering | Data is build-time JSON, no `dangerouslySetInnerHTML`; React auto-escapes |
| Subresource hijack via external fonts CDN | Tampering | Use `next/font/google` (self-hosted) instead of `<link rel=stylesheet>` to Google |
| CSP regression on font load | Configuration weakness | Don't add `fonts.googleapis.com` to CSP unless self-host fails — keep attack surface tight |
| Mixed content on prod (http image refs) | Tampering | All image refs are root-relative `/work/...`, no http://, no external |
| Information leak via OG metadata | Information disclosure | OG images are public case photos already shareable; descriptions are case outcome lines, no PII |

**No new auth/session/crypto surface added.** Phase passes a security review by virtue of being static content with no new input vectors.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `ArgentPixelCF` license permits web embedding | Pitfall 2 | Visual fidelity regresses to VT323 fallback OR licensing violation if embedded without permission |
| A2 | Vercel project `prj_SUJ64aQZySugxkPOfb2BR7Qr8WEK` is the production htm-landing project | Architecture Patterns | Deploy goes to wrong project |
| A3 | Existing custom domain `handtomouse.org` resolves all subpaths to the htm-landing Vercel project | DEPLOY-02 | `/work` returns 404 or wrong site |
| A4 | `_heroes.js` (canonical line 24 external ref) is dead code or replaceable | Pitfall 8 | Port omits behavior canonical relies on |
| A5 | Headless Chrome is installed on Nate's machine for smoke screenshots | Validation Architecture | Fall back to manual cross-browser pass |
| A6 | 237MB binary commit into git is acceptable for this repo | Pitfall 5 | Repo bloat causes future friction; can be migrated to LFS later |
| A7 | Existing `/portfolio` route should remain unchanged (placeholder copy) | Anti-Patterns | If Nate wants `/portfolio` to redirect to `/work`, that's a small additional task |
| A8 | The polish items (POLISH-01..04) are the only remaining canonical-side fixes | Phase Requirements | If more drift exists, port carries it forward |
| A9 | Sector filter UI is in scope (canonical has it) | Architecture Patterns | If out of scope, simpler implementation possible |
| A10 | `lib/cases.ts` location and shape matches existing repo conventions (camelCase utilities under `lib/`) | Code Examples | Easy rename if convention prefers different location |

## Open Questions (RESOLVED)

1. **DATA-03 testimonial floor is unreachable with current data.**
   - **RESOLVED:** 2026-05-30 by Nate decision — "ignore need for quotes". DATA-03 rewritten in REQUIREMENTS.md to "Testimonial component renders correctly for cases that have a real attributed quote (currently 6 cases); cases without a quote ship cleanly with no testimonial slot. NO minimum count required." Plan 01-05 Task 1 encodes the graceful-absence behavior (returns null when `testimonial.a.trim() === ''`).
   - Original context: Only 6 cases (swich, fishbowl, sbts, maplemoon, ferrari, troodpratt) have real attributed quotes. 13 cases have placeholder strings with empty `a` field. Outreach is locked-parked per scope decision Q5.

2. **POLISH-01..04 — apply on canonical or only in port?**
   - **RESOLVED:** Default applied — apply ONLY in the Next.js port, never on canonical. Encoded in Plans 01-04 (POLISH-03 solved-by-architecture via conditional render; POLISH-04 via `cases.length`) and 01-05 (POLISH-01 testimonial scale + serif glyph; POLISH-02 deliverables hover thumb). Canonical mockup stays frozen as design contract.

3. **`/portfolio` route disposition.**
   - **RESOLVED:** Default applied — leave existing `app/portfolio/page.tsx` unchanged for v1.0. Out of scope per scope locks. Future v1.1 cleanup task (redirect to `/work` or delete) can land after launch confirms no inbound traffic to `/portfolio`.

4. **ArgentPixelCF font availability and licensing.**
   - **RESOLVED via Plan 01-01 Task 3 checkpoint** — held as `checkpoint:decision` blocking task. Executor must (a) verify OTF files exist alongside canonical and (b) verify license permits web embedding. If license unclear or files missing, falls back to VT323 (already declared in canonical's @font-face stack). Plan 01-03 Task 1 then wires either `next/font/local` (license-clear path) or skips ArgentPixelCF entirely.

5. **Asset commit strategy: single commit, per-case, or LFS?**
   - **RESOLVED:** Default applied — per-case commits (19 commits, ~12MB each). Encoded in Plan 01-02 Task 2. Migration to LFS deferred indefinitely unless repo size becomes a friction point.

6. **`_heroes.js` external script — port what?**
   - **RESOLVED via Plan 01-01 Task 3 checkpoint** — held as `checkpoint:decision` blocking task with B1-skip default (no port; canonical line 24 reference dropped during extraction). Executor confirms by reading the file. If logic is non-trivial (more than hero preloading), revise plan; if trivial or absent, default-skip is the locked path.

## Sources

### Primary (HIGH confidence)

- `package.json` (htm-landing repo, worktree) — confirmed Next 15.5.18, React 18.3.1, Tailwind 4. [VERIFIED 2026-05-30]
- `next.config.js` — confirmed existing CSP, redirects, headers. [VERIFIED 2026-05-30]
- `app/globals.css` — confirmed BB-OS palette in `:root`, ~2300 lines, design system conflict if merged with canonical. [VERIFIED 2026-05-30]
- `app/portfolio/page.tsx` — confirmed existing route is placeholder copy (not real cases), Metadata API pattern to copy from. [VERIFIED 2026-05-30]
- `app/sitemap.ts`, `app/robots.ts` — confirmed extension points. [VERIFIED 2026-05-30]
- Canonical mockup `04_portfolio_v2.html` — cases array at lines 1364-1873, 19 entries with k/n/t/o/l/m/challenge/solutions/stats/palette/logo/testimonial/deliverables/heroImg/typography/assets/images shape. [VERIFIED 2026-05-30]
- Canonical asset folders — 23 dirs on disk (19 in-scope + 4 extras: `htm`, `wbb`, `bankwest` rolls into `wbb`-related work). Total size 237MB. File mix: 106 jpg, 91 png, 41 svg, 5 webp. [VERIFIED 2026-05-30 via `du -sh` and `find -type f`]
- `npm view next version` → 16.2.6 (current latest, NOT what we use — scope locks Next 15). [VERIFIED 2026-05-30 via npm registry]
- HANDOFF.md (round-2 polish spec for POLISH-01..04). [VERIFIED 2026-05-30]
- launch_scope_locked_20260530.md (scope decisions). [VERIFIED 2026-05-30]

### Secondary (MEDIUM confidence)

- Next.js 15 App Router patterns: `generateStaticParams`, `generateMetadata`, Metadata API, `params` as Promise, `next/font/google`. [CITED: nextjs.org/docs/app/api-reference/* — Next 15 docs pages]
- Tailwind 4 import syntax (`@import 'tailwindcss';`) — single-line v4 directive replacing v3 `@tailwind` triples. [CITED: tailwindcss.com/docs/upgrade-guide]
- Vercel `public/` static asset limits (none functional — only ~100MB serverless function bundle limit applies and doesn't apply to static). [CITED: vercel.com/docs/limits]

### Tertiary (LOW confidence — needs validation)

- ArgentPixelCF font availability and licensing — unverified; needs filesystem + Connary Fagen license check.
- `_heroes.js` contents — unread, needs ~30 seconds of investigation.
- Whether `handtomouse.org` is fully wired in Vercel for all subpaths — assumed YES based on `.vercel/project.json` presence and PR #8 merge to main, but no curl check performed in research.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against package.json + npm registry
- Architecture / route shape / Metadata API: HIGH — directly from Next.js 15 docs, pattern already used in existing `/portfolio/page.tsx`
- CSS porting strategy: MEDIUM — scoped CSS works in App Router (cited), but the mechanical prefix-every-selector pass is unverified to be conflict-free
- Extraction script: MEDIUM — vm.runInNewContext approach is sound, but actual brace-walker code is untested
- Asset migration size: HIGH — measured via `du -sh`
- Testimonial count: HIGH — counted via grep of `testimonial:{q:...,a:''}` empty-author pattern
- Validation Architecture: HIGH — no test framework + headless screenshot pattern is the right shape for this static-content phase
- Security: HIGH — minimal new attack surface, CSP impact understood

**Research date:** 2026-05-30
**Valid until:** 2026-06-30 for stack/framework decisions (Next.js 15.x stable). Asset count valid until next canonical-side change. Testimonial count valid until next organic reply lands. Re-verify before starting if >7 days have passed.
