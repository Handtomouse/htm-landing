# Requirements: HTM v2 Portfolio Launch

**Defined:** 2026-05-30
**Core Value:** Ship 19-case portfolio live at `handtomouse.org/work` via Next.js

## v1 Requirements

### Polish (final round-2 fixes on canonical)

- [ ] **POLISH-01**: Testimonial blocks render at correct scale with serif glyph (round-2 SPIN item #10)
- [ ] **POLISH-02**: Deliverables index entries show hover thumbnail and link to the relevant case (round-2 SPIN item #11)
- [x] **POLISH-03**: End-of-book / start-of-book dead card is hidden (round-2 SPIN item #15)
- [x] **POLISH-04**: Gallery counter reads "19 cases" (currently drifted at "17") — fix the static `<span id="caseref">` at line ~1159 of canonical

### Data extraction

- [ ] **DATA-01**: Cases extracted from canonical HTML into structured `cases.json` (or equivalent TS data file) — 19 entries with title, slug, year, category, agency, images[], desc, tags, testimonial (if present)
- [ ] **DATA-02**: Images copied from `~/UFC/spins/htm_v2_5round_loop_20260517/mockups/assets/` into `public/work/{slug}/` with preserved filenames
- [ ] **DATA-03**: Testimonial component renders correctly for cases that have a real attributed quote (currently 6 cases); cases without a quote ship cleanly with no testimonial slot. NO minimum count required — testimonial gating is OUT of scope per 2026-05-30 decision.

### Render (Next.js port)

- [x] **RENDER-01**: Gallery page at `/work` lists all 19 cases with tile imagery, title, year, category
- [x] **RENDER-02**: Per-case routes at `/work/{slug}` resolve and render full case detail (hero, imagery, deliverables, testimonial if present)
- [x] **RENDER-03**: Gallery → case → back navigation works on mobile and desktop
- [x] **RENDER-04**: Visual fidelity matches canonical mockup (palette, type, spacing, card layout)

### Deploy

- [ ] **DEPLOY-01**: Vercel production deploy succeeds from main branch
- [ ] **DEPLOY-02**: Custom domain `handtomouse.org/work` resolves to the deployed gallery
- [ ] **DEPLOY-03**: Per-case URLs (`handtomouse.org/work/{slug}`) resolve and render

### SEO / metadata

- [ ] **META-01**: Per-case OG metadata (title, description, image) renders correctly when shared on iMessage / LinkedIn / Twitter
- [ ] **META-02**: Root `/work` route has gallery-level OG metadata
- [ ] **META-03**: `robots.txt` allows crawl; sitemap.xml lists all 19 case URLs

### QA

- [ ] **QA-01**: Em-dash audit passes — zero em-dashes in any user-facing string (CSS/JS comments OK)
- [ ] **QA-02**: Mobile breakpoint pass at 360px and 768px (no layout breaks, hero crops, text overflows)
- [ ] **QA-03**: Desktop pass at 1280px and 1920px (gallery grid renders correctly, case-detail max-width holds)
- [ ] **QA-04**: All 19 case images load (no 404s in network panel) on production deploy
- [ ] **QA-05**: Gallery → case → back smoke test passes in Chrome + Safari on desktop and mobile

## v2 Requirements (deferred to v1.1)

### 4 new cases

- **CASE-V2-01**: Jac+Jack case shipped (year, category, contact, imagery)
- **CASE-V2-02**: The Char case shipped
- **CASE-V2-03**: Undercard case shipped
- **CASE-V2-04**: Bonds/ARC case shipped

### Outreach (parked entirely)

- **REACH-V2-01**: Lauren Mathieson cross-AKQA email (covers Hill's / Bankwest / Salesforce)
- **REACH-V2-02**: Sive Buckley masthead-quote outreach
- **REACH-V2-03**: Allianz Retire+ client-side contact hunt

## Out of Scope

| Feature | Reason |
|---------|--------|
| claude.design landing-page redesign port | Separate workstream — portfolio v2 ships its own visual system |
| Lighthouse perf optimization beyond baseline | Quality bar focused on visual fidelity + correctness, not perf score |
| Custom CMS for case content | `cases.json` is sufficient for 19 + 4 entries |
| Analytics integration | Defer until launch — track later |
| Newsletter signup / contact form | Out of scope for portfolio launch |
| Fishbowl PSD font recovery (cosmetic) | Defer indefinitely |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| POLISH-01 | Phase 1 | Pending |
| POLISH-02 | Phase 1 | Pending |
| POLISH-03 | Phase 1 | Complete |
| POLISH-04 | Phase 1 | Complete |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| RENDER-01 | Phase 1 | Complete |
| RENDER-02 | Phase 1 | Complete |
| RENDER-03 | Phase 1 | Complete |
| RENDER-04 | Phase 1 | Complete |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 1 | Pending |
| DEPLOY-03 | Phase 1 | Pending |
| META-01 | Phase 1 | Pending |
| META-02 | Phase 1 | Pending |
| META-03 | Phase 1 | Pending |
| QA-01 | Phase 1 | Pending |
| QA-02 | Phase 1 | Pending |
| QA-03 | Phase 1 | Pending |
| QA-04 | Phase 1 | Pending |
| QA-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-05-30*
