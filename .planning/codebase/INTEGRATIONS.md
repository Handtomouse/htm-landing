# External Integrations

**Analysis Date:** 2026-04-13

## APIs & External Services

**Email Delivery:**
- Resend - Email submission service for contact and subscription forms
  - SDK/Client: `resend` package v6.4.0
  - Auth: `RESEND_API_KEY` environment variable
  - Currently uses onboarding domain (`onboarding@resend.dev`) - requires production upgrade
  - Endpoints: `/api/contact` and `/api/subscribe` routes

**Web Analytics:**
- Vercel Analytics - Web vitals tracking and performance monitoring
  - SDK/Client: `@vercel/analytics` v1.5.0
  - Auto-initialized in root layout (`app/layout.tsx`)
  - Tracks Core Web Vitals (LCP, CLS, FID)
  - Endpoint: `vitals.vercel-insights.com` (CSP allowlisted)

**Font Delivery:**
- Google Fonts - Hosted font loading
  - VT323 (monospace, pixel art aesthetic)
  - Pixelify_Sans (heading font, pixel art aesthetic)
  - Roboto_Mono (body font)
  - Connected via `use.typekit.net` (Adobe TypeKit integration)

## Data Storage

**Databases:**
- None configured - Landing page is stateless
- Form submissions sent via email only (no persistence layer)

**File Storage:**
- Local filesystem only - Static assets in `public/` directory
  - SVG graphics: HTM logos, hand sprites, projectile/muzzle flash graphics
  - PDF: Portfolio document (`NateDon_Portfolio_2025.pdf`)
  - Images: OG image for social sharing (`og-image.png`)

**Caching:**
- HTTP caching via Next.js `next.config.js` headers
  - Static assets (images, SVG, PDF): 1 year cache with immutable flag
  - HTML pages: Standard cache headers with revalidation

## Authentication & Identity

**Auth Provider:**
- None - Landing page is fully public
- No user accounts, login, or identity system

## Monitoring & Observability

**Error Tracking:**
- None configured (no Sentry, LogRocket, or Rollbar)

**Logs:**
- Console logging in development mode only
  - Environment configuration logged at startup
  - Form submission data logged if Resend fails
  - Errors logged only in NODE_ENV=development

## CI/CD & Deployment

**Hosting:**
- Vercel - Primary hosting platform
  - Deployed via git push (automatic builds)
  - `.vercel/project.json` configuration present
  - Environment variables configured in Vercel dashboard

**CI Pipeline:**
- Build command: `tsc --noEmit && next build`
- Type checking runs before Next.js build
- Automatic deployments on git push to main
- No GitHub Actions or external CI service configured

## Environment Configuration

**Required env vars:**
- None - Site functions without any environment variables

**Optional env vars:**
- `RESEND_API_KEY`: Email API key from Resend (enables email sending, otherwise logs)
- `NOTIFICATION_EMAIL`: Where to send form submissions (default: hello@handtomouse.org)
- `NODE_ENV`: Runtime environment (development/production)

**Secrets location:**
- `.env.local` (local machine only, git-ignored)
- Vercel dashboard for production environment

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- Email notifications to `NOTIFICATION_EMAIL` when:
  - Contact form submitted (`/api/contact`)
  - Email subscription submitted (`/api/subscribe`)

## Security Considerations

**Content Security Policy:**
- Strict CSP headers configured in `next.config.js`
- Allows:
  - Scripts: `use.typekit.net`, `vitals.vercel-insights.com`, `va.vercel-scripts.com`
  - Fonts: Google Fonts and TypeKit
  - Images: Self, data URIs, blob
  - Connections: Self, Vercel Analytics
- Frame-ancestors restricted to self

**HTTPS & Transport Security:**
- Strict-Transport-Security header with max-age 63072000 (2 years)
- HSTS preload list included

**Form Security:**
- Email validation with regex pattern
- HTML escaping on all user input before sending via email
- Rate limiting on both API routes (3/hour for contact, 5/hour for subscribe)
- Honeypot field (`website`) for bot detection
- Timestamp validation (must take 2+ seconds to submit)

---

*Integration audit: 2026-04-13*
