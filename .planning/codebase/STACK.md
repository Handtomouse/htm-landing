# Technology Stack

**Analysis Date:** 2026-04-13

## Languages

**Primary:**
- TypeScript 5.9.3 - Used throughout all application code, strict mode enabled
- React 18.3.1 - UI component framework (Server Components + Client Components)
- CSS (Tailwind + plain CSS) - Styling with globals.css for custom variables

**Secondary:**
- JavaScript (Node.js) - Build scripts and Next.js configuration

## Runtime

**Environment:**
- Node.js (version not pinned in package.json)

**Package Manager:**
- npm (lockfile: package-lock.json present in repo)

## Frameworks

**Core:**
- Next.js 15.5.9 - Full-stack React framework with App Router (default for v15)
  - Server-Side Rendering (SSR) and Static Generation (SSG)
  - API Routes at `app/api/*`
  - Image optimization and font loading built-in

**Testing:**
- None configured (no Jest, Vitest, or Playwright in dependencies)

**Build/Dev:**
- TypeScript Compiler (tsc) - Type checking in build process
- ESLint 9 - Linting via `eslint-config-next`
- Tailwind CSS 4 - Utility-first CSS framework with PostCSS plugin

## Key Dependencies

**Critical:**
- `@vercel/analytics` 1.5.0 - Web vitals tracking and deployment analytics
- `resend` 6.4.0 - Email delivery service for contact/subscribe forms
  - Currently sending from `onboarding@resend.dev` (test domain)
  - Requires `RESEND_API_KEY` environment variable (optional, falls back to logging)

**Infrastructure:**
- `next/font/google` (built-in) - VT323, Pixelify_Sans, Roboto_Mono fonts loaded from Google Fonts
- `next/script` (built-in) - JSON-LD structured data injection
- `typekit` fonts loaded via external stylesheet (via layout.tsx)

## Configuration

**Environment:**
- Development: Uses `.env.local` (not tracked, see `.gitignore`)
- Environment variables validated in `lib/env.ts` at build/route load time
- No required environment variables (all optional)
- Optional variables:
  - `RESEND_API_KEY`: Email delivery API key
  - `NOTIFICATION_EMAIL`: Recipient for form submissions (default: hello@handtomouse.org)
  - `NODE_ENV`: Runtime environment

**Build:**
- `tsconfig.json`: ES2017 target, strict mode enabled, path aliases configured (`@/*`)
- `next.config.js`: Security headers, cache control, redirects from old Squarespace URLs
- No `.prettierrc` or `.eslintrc.json` detected (using ESLint config-next defaults)

## Platform Requirements

**Development:**
- Node.js runtime
- Git for version control
- npm for dependency management

**Production:**
- Deployment target: Vercel (indicated by `@vercel/analytics` and `.vercel/` directory)
- Content Security Policy headers set in Next.js config
- Supports edge function deployment on Vercel

---

*Stack analysis: 2026-04-13*
