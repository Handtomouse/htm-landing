---
phase: 1
slug: v1-0-portfolio-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Static-content portfolio site with no test framework — validation is manual + headless-screenshot heavy.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed (per CONVENTIONS + STACK) |
| **Config file** | none — no Wave 0 install needed; project intentionally framework-free |
| **Quick run command** | `npm run lint && npm run build` (lint + typecheck via Next build) |
| **Full suite command** | `npm run build && npx playwright screenshot ...` (headless screenshot capture; ad-hoc per plan) |
| **Estimated runtime** | ~30s for build/lint; ~60s for headless screenshot batch |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npm run build` — catches type errors, lint failures, build breakages
- **After every plan wave:** Run headless screenshot batch for any UI-touching changes; visual diff against canonical mockup
- **Before `/gsd-verify-work`:** Manual cross-browser smoke (Chrome + Safari, desktop + mobile) + em-dash audit grep
- **Max feedback latency:** ~30 seconds for build/lint; ~60 seconds for screenshot capture

---

## Per-Task Verification Map

> Planner populates this table during PLAN.md generation. Each plan task gets a row mapping it to the REQ-ID it satisfies + the verification command + manual check (if any).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| _populated during planning_ | | | | | | | | | |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework install — explicit project decision, intentionally framework-free for static content
- [ ] Headless screenshot utility (`npx playwright` ad-hoc, no install needed via npx) — confirm available before Wave 1
- [ ] `scripts/em-dash-audit.sh` — grep helper for QA-01 em-dash audit (creates if absent during planning)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual fidelity matches canonical | RENDER-04 | Subjective comparison, no programmatic diff threshold | Open canonical + deployed in side-by-side Chrome windows; eyeball palette, type, spacing, drop-cap, gallery grid |
| Em-dash audit clean | QA-01 | Already-shipped grep helper, run by hand | `grep -rnE "[—–]" app/work/ public/work/ | grep -v "\\.css\\|\\.js comment"` |
| Mobile breakpoint pass | QA-02 | Cross-device subjective check | Chrome DevTools device emulation at 360px and 768px; check hero crops, text overflows, card layouts |
| Desktop breakpoint pass | QA-03 | Cross-device subjective check | Chrome DevTools at 1280px and 1920px; check gallery grid fills, case-detail max-width |
| Image load (no 404s) | QA-04 | Production-only verification | Open deployed `/work` + 3 random case URLs in Chrome; Network panel filter to Images; confirm all 200s |
| Gallery→case→back smoke | QA-05 | Cross-browser subjective check | Chrome + Safari on Mac, mobile Safari + Chrome iOS via Sauce Labs or local devices; navigate gallery → case → back |
| OG metadata renders | META-01 | Third-party render verification | Paste case URL into iMessage compose window; paste into LinkedIn post draft; visual confirm preview |

---

## Known Validation Gaps

- No automated visual regression — relies on manual eyeball pass. Acceptable for one-off portfolio launch; revisit if v1.1 doubles surface area
- No automated cross-browser test matrix — Safari mobile testing is bottlenecked on physical device or Sauce Labs
- No automated link checker for case-to-case nav — verified manually during QA-05 smoke

---

## Notes

This is a static-content site with no auth, no user input, no API surface. Traditional unit/integration test coverage adds little value relative to the manual verification effort. Validation strategy is intentionally manual-heavy with build/lint as the only automated layer.
