# Architecture

**Analysis Date:** 2026-04-13

## Pattern Overview

**Overall:** Multi-layer Next.js 15 app with Server Components, Client Components, and API Routes

**Key Characteristics:**
- Server-first architecture leveraging Next.js App Router
- Client-side interactivity isolated to specific components with `'use client'`
- Stateless API layer for form handling
- Performance-optimized with dynamic imports and lazy loading
- Comprehensive SEO with structured data (Schema.org) throughout

## Layers

**Server Components (SSR/SSG):**
- Purpose: Render HTML on server, minimal JavaScript sent to client
- Location: `app/layout.tsx`, `app/page.tsx`, `app/*/page.tsx`, `app/*/opengraph-image.tsx`
- Contains: Page metadata, SEO configurations, structured data scripts
- Depends on: `lib/env.ts`, `lib/validation.ts` for utility functions
- Used by: Next.js routing system, browser rendering

**Client Components (Interactive):**
- Purpose: Handle user interactivity, state management, animations
- Location: `components/*.tsx` (all marked with `'use client'`)
- Contains: Modal logic, form handling, battle system animations, typewriter effects
- Depends on: React hooks, browser APIs (Vibration API, localStorage, Fetch API)
- Used by: Server components and other client components

**API Routes:**
- Purpose: Backend endpoints for form processing and email delivery
- Location: `app/api/contact/route.ts`, `app/api/subscribe/route.ts`
- Contains: Form validation, rate limiting, email delivery via Resend
- Depends on: `lib/env.ts`, `lib/validation.ts`, Resend SDK
- Used by: Client-side fetch calls from form components

**Utilities:**
- Purpose: Shared validation and configuration logic
- Location: `lib/*.ts`
- Contains: Email validation, HTML escaping, environment validation, custom hooks
- Depends on: None
- Used by: API routes and client components

## Data Flow

**Contact Form Submission:**

1. User fills form in `ContactModal` (client component)
2. Client validates input with `lib/validation.ts` helpers
3. Form start time tracked for bot detection
4. User clicks submit, form sends POST to `/api/contact`
5. Server validates: honeypot, timestamp, rate limit, field lengths
6. If Resend key configured: sends email via `resend.emails.send()`
7. Fallback: logs to console if Resend fails or not configured
8. Response: success/error JSON back to client

**Email Subscription Flow:**

1. User enters email in `TerminalTypewriter` (client component)
2. Client validates with `lib/validation.ts` helpers
3. Form sends POST to `/api/subscribe` with timestamp and email
4. Server validates: honeypot, timestamp, rate limit, email format
5. If Resend key configured: sends notification email
6. Fallback: logs to console if Resend not configured
7. Response: success message to client

**Page Navigation:**

1. User clicks link to route (e.g., `/about`, `/portfolio`)
2. Next.js server renders page component from `app/*/page.tsx`
3. Page metadata and structured data injected in `<head>`
4. HTML streamed to browser, client hydrates interactive components
5. Client components (like `ContactModal`) become interactive on hydration

**State Management:**

- Client-side: React hooks (useState, useContext) in client components
- No global state management library (Redux, Zustand, etc.)
- Modal state lifted to parent component (`page.tsx`) and passed as props
- Form data stored locally in component state, cleared on submit

## Key Abstractions

**TerminalTypewriter Component:**
- Purpose: Animated terminal/retro typewriter effect for main hero content
- Location: `components/TerminalTypewriter.tsx`
- Pattern: React functional component with memo optimization, useEffect for animation sequencing
- Features:
  - Multi-stage loading animation (fade-in → center-hold → slide-up → complete)
  - Character-by-character typewriter effect with configurable speeds
  - Reduced motion support via `prefers-reduced-motion` media query
  - Email submission handling with debounce protection

**BattleSystem Component:**
- Purpose: Interactive combat animation system with hand sprites and projectiles
- Location: `components/BattleSystem.tsx`
- Pattern: Complex state machine using React hooks for projectile/impact/muzzle flash tracking
- Features:
  - Animation loop with requestAnimationFrame
  - Collision detection between projectiles and screen center
  - Screen shake and flash effects on impact
  - Hand state transitions (alive → dying → respawning → invincible)
  - Touch and keyboard controls

**ContactModal Component:**
- Purpose: Form interface for contact submissions
- Location: `components/ContactModal.tsx` (790 lines)
- Pattern: Client component with extensive validation and error handling
- Features:
  - Real-time field validation with debouncing
  - Character count for message field
  - Accessibility: focus trap, ARIA labels, keyboard navigation
  - Mobile viewport height handling for mobile keyboards
  - Consent checkbox for GDPR compliance

**ErrorBoundary Component:**
- Purpose: React error boundary for graceful error handling
- Location: `components/ErrorBoundary.tsx`
- Pattern: Class component catching child component errors
- Fallback UI displayed on error

**FooterCTAs Component:**
- Purpose: Button layout for primary actions (Portfolio, Email, Wormhole, Instagram)
- Location: `components/FooterCTAs.tsx`
- Pattern: Memoized functional component with configuration arrays
- Features: Customizable button lists, disabled states, special action handling

## Entry Points

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Route `/`
- Responsibilities:
  - Renders server metadata (title, OG tags, SEO schema)
  - Dynamically imports ContactModal (code splitting)
  - Wraps BattleSystem + TerminalTypewriter + FooterCTAs
  - Injects JSON-LD structured data for WebSite, Organization, Person, LocalBusiness, ProfessionalService

**API Contact Route:**
- Location: `app/api/contact/route.ts`
- Triggers: POST `/api/contact` from ContactModal
- Responsibilities:
  - Validates form data (name, email, subject, message)
  - Implements honeypot and timestamp-based bot detection
  - Rate limits by IP (3 per hour)
  - Sends email via Resend or logs to console
  - Returns success/error JSON

**API Subscribe Route:**
- Location: `app/api/subscribe/route.ts`
- Triggers: POST `/api/subscribe` from TerminalTypewriter
- Responsibilities:
  - Validates email format
  - Implements honeypot and timestamp-based bot detection
  - Rate limits by IP (5 per hour)
  - Sends notification email via Resend or logs to console
  - Returns success/error JSON

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: All routes
- Responsibilities:
  - Loads Google Fonts (VT323, Pixelify_Sans, Roboto_Mono) with display=swap
  - Preloads critical assets (SVGs, TypeKit fonts)
  - DNS prefetch for external services (Resend API, Vercel Analytics)
  - Injects Analytics component from @vercel/analytics
  - Sets global CSS custom variables and font stacks

## Error Handling

**Strategy:** Graceful degradation with fallbacks

**Patterns:**
- Forms: Catch validation errors, display field-specific messages to user
- Email delivery: If Resend fails or not configured, log to console in development
- API routes: Try-catch wrapping with 500 status code fallback
- Client errors: ErrorBoundary component catches React component errors
- Bot detection: Return 400 status on honeypot/timestamp failures
- Rate limiting: Return 429 status with retry-after information

**Example (from `api/contact/route.ts`):**
```typescript
try {
  // Validation logic
  if (!checkHoneypot(body)) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  
  // Resend send attempt
  if (resend) {
    try {
      await resend.emails.send({ ... })
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      // Fall through to console logging
    }
  }
  
  // Fallback: console log if Resend fails
  if (process.env.NODE_ENV === 'development') console.log('[CONTACT FORM]', { ... })
  return NextResponse.json({ success: true }, { status: 200 })
} catch (error) {
  return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 })
}
```

## Cross-Cutting Concerns

**Logging:**
- Development only: Conditional console.log calls checking `process.env.NODE_ENV === 'development'`
- No structured logging or logging library
- Environment config logged at app startup via `lib/env.ts`
- Form submissions logged if email delivery fails

**Validation:**
- Shared utility functions in `lib/validation.ts`: `isValidEmail()`, `escapeHtml()`, `sanitizeInput()`
- API routes validate both format and content length for all inputs
- Client components validate before submit, server validates again (defense in depth)
- HTML escaping applied to all user input before email delivery

**Authentication:**
- Not applicable - landing page is fully public
- No user identity, login, or protected routes

**Performance Optimization:**
- Dynamic imports for heavy components (`ContactModal` lazy-loaded)
- Component memoization with React.memo for TerminalTypewriter, BattleSystem, FooterCTAs
- Deferred effect loading (showEffects state delays decorative elements)
- Fonts loaded with `display: swap` for font display optimization
- CSS custom variables instead of inline styles where possible
- requestAnimationFrame for smooth animation loops in BattleSystem

**SEO:**
- Metadata exported from page components
- Comprehensive JSON-LD structured data injected on home page
- Sitemap.xml generated dynamically
- Robots.txt control
- Open Graph and Twitter Card tags
- Canonical URLs set in metadata

---

*Architecture analysis: 2026-04-13*
