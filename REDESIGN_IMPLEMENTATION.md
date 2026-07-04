# Redesign Implementation Plan

**Status**: Designs complete, implementation not started.
**Source of designs**: claude.design project `019e30c5-02f1-7592-91b8-928d4e3c209b`
**URL**: https://claude.ai/design/p/019e30c5-8f25-796d-9ae6-536096504f29
**Sibling reference**: https://claude.ai/design/p/019e30fa-a9e1-770c-bb81-475bac86bc88 (htm-bb-mode SPIN, kept as reference only — Path A locked, this site wins)
**Authored**: 2026-05-17 (session checkpoint `~/UFC/memory/checkpoints/checkpoint_20260517_000109_htm_landing_redesign_via_claudedesign.md`)

---

## What's in the design source

The claude.design project contains 6 page files plus shared design files:

| File | Status | Treatments |
|---|---|---|
| `Portfolio Redesign.html` | ✓ | A · GRID (desktop), M-A · STACK + M-B · LIST (mobile). One desktop variation only (chat claimed 3, delivered 1). |
| `About Redesign.html` | ✓ | A · CLASSIC TWO-COL / B · MANIFESTO / C · BRIEF SPEC SHEET (desktop) + 2 mobile. |
| `Services Redesign.html` | ✓ | A · LEDGER STACK / B · TWO-COL CARDS / C · NUMBERED MANIFESTO (desktop) + mobile. |
| `Home Redesign.html` | ✓ | 2-3 desktop treatments + 2 mobile (M-B compresses animation to 110px square). |
| `Testimonials Redesign.html` | ✓ | A · EMPTY STATE / B · POPULATED STATE (system check) + mobile. |
| `FAQ Redesign.html` | ✓ | A · ACCORDION STACK / B · TWO-COL CATEGORY RAIL + mobile. |
| `bbos-components.jsx` | ✓ | Shared component library (17.5KB JSX). |
| `design-canvas.jsx` | ✓ | Host canvas wrapper. |
| `portfolio-data.js` | ✓ | Portfolio data structure. |

## Brand contract (locked in claude.design)

**Palette** (use brandkit canonical, not the live-site drifted version):

| Role | Hex | Token name |
|---|---|---|
| Primary accent | `#F7A835` | HTM Amber |
| Secondary / hover | `#ff9d23` | HTM Bright |
| Background | `#0b0b0b` | Deep Black |
| Panel (elevated) | `#131313` | Panel |
| Ink text | `#EDECEC` | Ink |
| Muted text | `#9A9A9A` | Muted |
| Border | `#2A2A2A` | Grid |

**Typography contract** (claude.design's explicit role-map):

- **Geist Mono** → status bar, bezel label, breadcrumb, meta row (Nº · ROLE · YEAR), tag chips, status pill, HwButton labels, filter rail, ledger headers, stat chip values, footer chips
- **Geist Sans** → page title, project name, problem/outcome body, CTA headlines, intro copy, principle headlines, quote body

**Aesthetic** — BB-OS device chrome (corner bolts, status bar, bezel label, panel surfaces, gradient borders, hardware-button affordances) × Geist editorial clarity. The deliberate tension is retro chrome + modern type. The current live site has retro chrome AND retro type, so brand reads one-dimensional — the redesign splits those.

## Component primitives to extract from `bbos-components.jsx`

~17 primitives expected. Order to extract (dependency order):

1. `DeviceFrame` — corner bolts, inset bezel label, amber glow
2. `StatusBar` — HTM://path + signal/LTE/battery + clock (Geist Mono)
3. `HeroSlot` — striped placeholder with `[IMG SLOT]` mono caption
4. `Tag` / tag chip
5. `StatusPill` — LIVE / SHIPPED / IN PROGRESS variants (amber/green/grey)
6. `BBOSCard` — 1px gradient border (amber→border grey), inset highlight, optional hero on top, 3 sizes
7. `HwButton` — chunky pill, top highlight, bottom shadow, mono label, primary/secondary variants
8. `StatChip` / `StatChipRow` — oversized mono numeral + caption, one can accent amber
9. `StackLedger` — labelled rows with ▸ accent, italic Geist Sans tagline footer
10. `PrincipleCard` — principle headline + proof body + project tag chip, gradient border, no hero slot
11. `AvailabilityPill` — 3 states (TAKING WORK / WAITLIST / BOOKED) with pulsing dot
12. `QuoteBlock` — amber italic open-quote, Geist Sans display body, Geist Mono attribution row
13. `CompanyLogoSlot` — accepts `tint` prop matching project tint system
14. `LedgerRow` — service row pattern (extends StackLedger): mono LABEL · italic NAME · SCOPE · SHIPS · PRICE · TAGS columns
15. `CategoryAccordion` — wraps 2-4 `AccordionItem` with mono eyebrow header
16. `AccordionItem` — mono question number + Geist Sans question + body + LAST REVIEWED chip; FEATURED variant has amber border
17. `HomeBottomNav` — HOME · WORK · ABOUT · FAQ · CONTACT — promote to shared layout, not home-only

## Recommended port order

Implementation should happen in 3 phases:

### Phase 1 — Foundation (1 PR)

Token swap + shared chrome. Touches `app/layout.tsx` + `app/globals.css` + `tailwind.config.ts` (if present) + creates `components/bb-os/`.

- Add Geist Sans + Geist Mono via `next/font/local` or `geist` package (already installed). Remove Adobe Typekit kit `swi6eoo` preload/stylesheet from `app/layout.tsx:122-123`.
- Update `app/globals.css` `--font-heading` / `--font-body` / `--font-mono` to point to the Geist variables. Remove Pixelify Sans + VT323 + Roboto Mono imports (`app/layout.tsx:2`).
- Update primary colour token from `#ff9d23` to `#F7A835` in `app/globals.css`. Keep `#ff9d23` available as `--accent-hover` or `--secondary`.
- Extract `DeviceFrame`, `StatusBar`, `HomeBottomNav` into `components/bb-os/` and wire them into the shared layout so every page renders within the chrome at first paint.
- **Verify**: every existing page now renders with the device frame + status bar + bottom nav, Geist fonts only, amber=#F7A835.

### Phase 2 — Page-by-page port (6 PRs, one per page)

Order by impact:

1. **Portfolio** (P0 — current page is fake-content catastrophic) → variation A · GRID. Extract `BBOSCard`, `HeroSlot`, `Tag`, `StatusPill`. Hardcode the 6 real projects (MapleMoon, Pureairo, S'WICH, Aura, ACA Build, Gumnuts) with bracketed-slot placeholder content for role/year/problem/outcome. Real hero images need to be sourced.
2. **Home** (P0 — first-paint void problem) → SSR the BB-OS shell + animation slot. Apply `[data-anim-slot]` selector to the placeholder. Gate `BattleSystem` mount with `useEffect` + `requestIdleCallback` per claude.design's engineering note. Pick variation A (hero centered) unless decided otherwise.
3. **About** (P0 — wall-of-text fix) → pick A / B / C variation first. Extract `PrincipleCard`, `StatChip`, `StatChipRow`, `StackLedger`, `AvailabilityPill`, `HwButton`.
4. **Services** (P0 — thesaurus loop fix) → pick A / B / C variation. Extract `LedgerRow`. Service rows are deliverables-not-adjectives: Packaging System, Website Build, Naming + Voice, Editorial / Print, Ongoing Retainer. Compare with SPIN's 2×2 discipline-grid (`019e30fa-...`) before locking.
5. **Testimonials** (P2 — empty-state primary) → ship variation A. Render-switch on `QUOTES.length === 0 ? <EmptyState /> : <PopulatedState />`. Same component tree per claude.design's note. Keep B (`PopulatedState`) wired but unused until real quotes land.
6. **FAQ** (P2 — hierarchy fix) → pick A / B variation. Extract `CategoryAccordion` + `AccordionItem`. Categories: SCOPE / WORK / MONEY (FEATURED) / LOGISTICS. Need real questions + answers, especially the MONEY pricing item — verify against your actual rate card before shipping.

### Phase 3 — Cleanup (1 PR)

- Delete legacy components no longer used (`TerminalTypewriter`, `BattleSystem` if replaced or restyled, any orphaned imports).
- Remove `ContactModal` (790 lines) if the new HwButton CTA leads to a separate `/contact` route instead of a modal.
- Audit `app/globals.css` for unused tokens.
- Verify `app/sitemap.ts` / `app/robots.ts` still cover all routes.
- Run `npm audit` clean check.

## Branch + PR strategy

- One branch per Phase / page: `redesign/foundation`, `redesign/portfolio`, `redesign/home`, `redesign/about`, `redesign/services`, `redesign/testimonials`, `redesign/faq`, `redesign/cleanup`.
- Each merges into `main` independently — site stays shippable at every step.
- Vercel will auto-deploy preview branches; review live at the preview URL before merge.
- Don't bundle Phase 1 with Phase 2 — token swap will visibly change every existing page even before page redesigns land, and reviewing them in one PR is too much surface.

## Things that need a human decision before shipping

1. **Pick winning variation** for About, Services, FAQ (each has 2-3 desktop options).
2. **Compare SPIN's discipline-grid Services design** vs parent's A/B/C. If discipline-grid wins, swap it in as variation D before locking Services.
3. **Real positioning headline** for Home — the slot shape is `[Three- or four-word studio statement]` with one word in amber italic. Stronger than the current "Independent creative direction and cultural strategy from Sydney."
4. **Real portfolio entries** — for each of MapleMoon / Pureairo / S'WICH / Aura / ACA Build / Gumnuts: role, year, one-line problem, one-line outcome, tags, hero image.
5. **Real service prices and ship-shapes** — verify `[$X-$Y AUD]` ranges and `[4-6 WKS]` timeline slots against actual rate card.
6. **Real FAQ questions** — especially the MONEY category. Decide if pricing is published transparently or kept generic.
7. **Real testimonials** — or accept the empty state ships first and quotes get added when they exist.
8. **htm-bb-mode disposition** — Path A locks htm-landing as canonical. Decide whether to archive / delete the htm-bb-mode repo and its Vercel project to prevent future confusion. SPIN review docs at `~/.claude/jobs/b1294b01/htm_bb_mode_review/` are preserved for reference.

## Gotchas captured from this session

- Adobe Typekit kit `swi6eoo` referenced in `app/layout.tsx:122-123` preloads `argent-pixel-cf` as the live site's single typeface for headings + body + mono. The Pixelify Sans + Roboto Mono + VT323 imports in `app/layout.tsx:2` are fallbacks only. Both need removal when Geist takes over.
- Live `--font-heading` / `--font-body` / `--font-mono` are defined in `app/globals.css:154-156` — single source of truth for the typography swap.
- The repo is actively maintained by automated Claude sessions (dependabot bumps, PR merges happening during this session). Expect concurrent commits on `main`. Always fetch before pushing.
- Vercel auto-deploys from `main` to production (handtomouse.org alias). Vercel previews fire on every PR.
- 14 Dependabot CVEs (10 Next.js, 2 minimatch, 1 flatted, 1 postcss) were cleared via PR #8 / commit `b3fcd50` during this session. Next + postcss now pinned to safe versions.

## Files generated in this session (reference, not for commit)

- Per-page review and brand seed: `~/.claude/jobs/b1294b01/htm_review/{REVIEW,BRANDKIT_SEED,PRIORITIES}.md` + screenshots (13 live + 13 local).
- htm-bb-mode SPIN findings: `~/.claude/jobs/b1294b01/htm_bb_mode_review/{REVIEW,BRANDKIT_SEED,PRIORITIES}.md` + screenshots (11 desktop + 2 mobile).
- SPIN closeout: `~/UFC/spins/htm_bb_mode_design_review_20260516/SPIN_CLOSEOUT.md`.
- Session checkpoint: `~/UFC/memory/checkpoints/checkpoint_20260517_000109_htm_landing_redesign_via_claudedesign.md`.

These job-dir files are ephemeral (cleaned up with the job). Copy what's useful into the repo before that happens if you want them durable.
