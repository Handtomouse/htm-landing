# HTM v2 Portfolio Launch

**Initialized:** 2026-05-30
**Owner:** Nate Don (HandToMouse Studio)
**Repo:** `~/Documents/GitHub/htm-landing/`
**Live target:** `handtomouse.org/work`

## Core Value

Ship a 19-case visual portfolio for HandToMouse Studio live at `handtomouse.org/work` — moving the current canonical from a single-file HTML mockup into a deployed Next.js site with per-case routes, embedded testimonials, and production hosting.

## Why this matters

The current portfolio canonical (`~/UFC/spins/htm_v2_5round_loop_20260517/mockups/04_portfolio_v2.html`) is a fully-built single-file mockup that has been through 5 rounds of design polish + 3 rounds of reviewer feedback. It works as an offline file but is not discoverable, shareable via a URL, or referenced by any outbound outreach. Without a live URL, the entire portfolio is invisible to inbound networks and unusable in pitches.

## Scope locks (from /Users/handtomouse/UFC/spins/htm_v2_orchestrator_20260519/launch_scope_locked_20260530.md)

| Decision | Value |
|---|---|
| Cases at v1 | **19** (4 new — Jac+Jack / The Char / Undercard / Bonds-ARC — deferred to v1.1) |
| Testimonial bar | **None** — render where present (currently 6 cases), no floor required |
| Outreach | **Parked** — no new chasing, use what's already in pipeline |
| Deadline | **None** — quality bar wins |
| Source of truth | `~/UFC/spins/htm_v2_5round_loop_20260517/mockups/04_portfolio_v2.html` |
| Target repo | `~/Documents/GitHub/htm-landing/` (Next.js 15 App Router, Tailwind 4) |
| Live URL | `handtomouse.org/work` (custom domain via Vercel) |

## Constraints

- **No em-dashes in user-facing strings** (CSS/JS comments OK)
- All email sends require explicit Nate approval
- iMessage sends go through `~/bin/imessage_gate.sh`
- Sign-off as "Nate", never "Don"
- Visual changes: verify in Chrome before claiming done
- No fake/placeholder content — every quote, image, and case detail must be real

## Key Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-30 | Ship 19 cases first, defer 4 new cases to v1.1 | Get live URL up before 1+ week of new-case content work |
| 2026-05-30 | No testimonial floor — ship with what's organically present (6 attributed quotes currently) | Outreach parked; gating on testimonial count would block launch indefinitely |
| 2026-05-30 | Port to htm-landing Next.js, not standalone HTML | Existing repo already has Vercel + domain wiring |
| 2026-05-30 | claude.design landing-page redesign OUT of scope | Separate workstream; portfolio v2 ships its own visual system |
| 2026-05-30 | No hard deadline | Quality bar wins over speed |
