# Roadmap: HTM v2 Portfolio Launch

## Overview

A single-phase milestone (v1.0) ships the existing 19-case portfolio canonical (`04_portfolio_v2.html`) from a standalone HTML mockup into the htm-landing Next.js repo, deployed live to `handtomouse.org/work` with per-case routes, embedded testimonials, and full OG/SEO metadata. v1.1 adds the 4 deferred cases and (optionally) reactivates outreach.

## Phases

- [ ] **Phase 1: v1.0 Portfolio Launch** — Polish + extract + port + deploy 19 cases to `handtomouse.org/work`
- [ ] **Phase 2: v1.1 Expansion** — Add 4 deferred cases (Jac+Jack / The Char / Undercard / Bonds-ARC)

## Phase Details

### Phase 1: v1.0 Portfolio Launch
**Goal**: Ship `handtomouse.org/work` live with 19 cases, per-case routes, testimonials rendered where present (no floor), and OG metadata.
**Depends on**: Nothing (first phase)
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04, DATA-01, DATA-02, DATA-03, RENDER-01, RENDER-02, RENDER-03, RENDER-04, DEPLOY-01, DEPLOY-02, DEPLOY-03, META-01, META-02, META-03, QA-01, QA-02, QA-03, QA-04, QA-05
**Success Criteria** (what must be TRUE):
  1. `handtomouse.org/work` loads a gallery of all 19 cases on desktop and mobile
  2. Clicking any case opens `handtomouse.org/work/{slug}` with full case detail
  3. Testimonial component renders correctly on the 6 cases that have an attributed quote; remaining cases render cleanly without a testimonial slot
  4. Sharing any case URL on iMessage/LinkedIn/Twitter renders correct OG preview
  5. Zero em-dashes appear in any user-facing string
**Plans**: 7 plans across 6 waves (0-5)

Plans:
- [x] 01-01-PLAN.md — Wave 0: Pre-flight scripts (em-dash audit, headless screenshot, image-200 checker) + ArgentPixelCF/`_heroes.js` decisions
- [x] 01-02-PLAN.md — Wave 1: Extract cases.ts via vm.runInNewContext + migrate 19 case asset folders (DATA-01, DATA-02, POLISH-04)
- [x] 01-03-PLAN.md — Wave 1: CSS isolation (app/work/portfolio.css scoped under .htm-portfolio) + next/font setup (RENDER-04 foundation)
- [x] 01-04-PLAN.md — Wave 2: Gallery + case-detail routes with generateStaticParams + 5 components (RENDER-01..04, POLISH-03, POLISH-04)
- [ ] 01-05-PLAN.md — Wave 3: Testimonial (POLISH-01 + DATA-03 graceful absence) + DeliverablesIndex (POLISH-02)
- [ ] 01-06-PLAN.md — Wave 4: Per-route OG metadata + sitemap + robots extension (META-01, META-02, META-03)
- [ ] 01-07-PLAN.md — Wave 5: Deploy to Vercel + QA sweep (DEPLOY-01..03, QA-01..05) + VALIDATION.md populated

### Phase 2: v1.1 Expansion
**Goal**: Add 4 deferred cases (Jac+Jack / The Char / Undercard / Bonds-ARC) to the live gallery.
**Depends on**: Phase 1
**Requirements**: CASE-V2-01, CASE-V2-02, CASE-V2-03, CASE-V2-04
**Success Criteria** (what must be TRUE):
  1. Gallery shows 23 cases
  2. Each new case has imagery, deliverables, and testimonial slot populated
  3. Existing 19 cases unaffected
**Plans**: TBD

Plans:
- [ ] 02-XX: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. v1.0 Portfolio Launch | 3/7 | In Progress|  |
| 2. v1.1 Expansion | 0/TBD | Not started | - |
