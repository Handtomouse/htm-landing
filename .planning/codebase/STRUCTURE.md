# Codebase Structure

**Analysis Date:** 2026-04-13

## Directory Layout

```
htm-landing/
├── app/                                # Next.js App Router (v15)
│   ├── layout.tsx                      # Root layout - fonts, analytics, metadata
│   ├── page.tsx                        # Home page (/) - hero with battle system
│   ├── globals.css                     # Global styles + CSS custom variables
│   ├── robots.ts                       # Robots.txt generation
│   ├── sitemap.ts                      # Sitemap.xml generation
│   ├── not-found.tsx                   # 404 page
│   │
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts                # POST /api/contact - contact form handler
│   │   └── subscribe/
│   │       └── route.ts                # POST /api/subscribe - email signup handler
│   │
│   ├── about/
│   │   ├── page.tsx                    # /about page with biography
│   │   └── opengraph-image.tsx         # Dynamic OG image for /about
│   │
│   ├── portfolio/
│   │   ├── page.tsx                    # /portfolio page - project showcase
│   │   └── opengraph-image.tsx         # Dynamic OG image for /portfolio
│   │
│   ├── services/
│   │   ├── page.tsx                    # /services page - service offerings
│   │   └── opengraph-image.tsx         # Dynamic OG image for /services
│   │
│   ├── testimonials/
│   │   ├── page.tsx                    # /testimonials page - client testimonials
│   │   └── opengraph-image.tsx         # Dynamic OG image for /testimonials
│   │
│   ├── faq/
│   │   ├── page.tsx                    # /faq page - frequently asked questions
│   │   └── opengraph-image.tsx         # Dynamic OG image for /faq
│   │
│   ├── privacy/
│   │   └── page.tsx                    # /privacy page - privacy policy
│   │
│   ├── terms/
│   │   └── page.tsx                    # /terms page - terms of service
│   │
│   ├── wormhole/
│   │   ├── page.tsx                    # /wormhole page - easter egg content
│   │   └── opengraph-image.tsx         # Dynamic OG image for /wormhole
│   │
│   └── feed.xml/
│       └── route.ts                    # RSS/Atom feed generation
│
├── components/                          # Reusable React components (all 'use client')
│   ├── TerminalTypewriter.tsx           # Hero typewriter animation (500+ lines)
│   ├── BattleSystem.tsx                 # Interactive battle animation system
│   ├── ContactModal.tsx                 # Contact form modal (790 lines)
│   ├── EmailModal.tsx                   # Simple email capture modal
│   ├── FooterCTAs.tsx                   # Footer action buttons
│   ├── WormholeContent.tsx              # Wormhole page content component
│   └── ErrorBoundary.tsx                # React error boundary wrapper
│
├── lib/                                 # Utility functions and helpers
│   ├── env.ts                           # Environment variable validation
│   ├── validation.ts                    # Email & HTML escaping utilities
│   ├── hooks.ts                         # Custom React hooks (useHapticFeedback)
│   └── wormholeData.ts                  # Wormhole content data (easter egg)
│
├── public/                              # Static assets (git-tracked)
│   ├── HTM-LOGO-ICON-WHITE.svg          # Main logo icon
│   ├── HTM-LOGOS-FULLWORDMARK.svg       # Logo with full wordmark
│   ├── HTM-LOGOS-WORDMARK.svg           # Logo wordmark only
│   ├── HTM-PROJECTILE-LINE.svg          # Projectile graphic for battle system
│   ├── HTM-MUZZLE-FLASH.svg             # Muzzle flash effect graphic
│   ├── hand-sprite-left.svg             # Left hand sprite
│   ├── hand-sprite-right.svg            # Right hand sprite
│   ├── og-image.png                     # OpenGraph image for social sharing
│   ├── favicon.ico                      # Favicon
│   ├── NateDon_Portfolio_2025.pdf       # Portfolio document download
│   └── google32edcb2607debf2d.html      # Google Search Console verification
│
├── scripts/
│   └── generate-og-image.js             # Script to generate dynamic OG images
│
├── .planning/
│   └── codebase/                        # This directory - architecture docs
│
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration (strict mode)
├── next.config.js                       # Next.js configuration (headers, redirects)
├── .env.example                         # Example environment variables
├── .gitignore                           # Git ignore rules
├── tailwind.config.ts                   # Tailwind CSS configuration (if present)
├── README.md                            # Project README
├── DEPLOYMENT.md                        # Deployment guide
├── PROJECT_SUMMARY.md                   # High-level project overview
└── REDESIGN_SUMMARY.md                  # Design redesign notes
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router entry point - contains all routes and layouts
- Contains: Server and Client components, API routes, page metadata
- Key files: `page.tsx` files define routes, `layout.tsx` defines wrappers

**components/**
- Purpose: Reusable React components with interactive behavior
- Contains: All files marked with `'use client'` directive
- Key files:
  - `TerminalTypewriter.tsx`: Main hero animation (500+ lines)
  - `BattleSystem.tsx`: Complex state machine for combat effects
  - `ContactModal.tsx`: Full-featured contact form (790 lines)

**lib/**
- Purpose: Utility functions, hooks, and shared logic
- Contains: Validation helpers, environment config, custom hooks, data constants
- Key files:
  - `validation.ts`: Email regex and HTML escaping
  - `env.ts`: Environment variable validation and logging
  - `hooks.ts`: Custom React hooks

**public/**
- Purpose: Static assets delivered as-is without processing
- Contains: SVG graphics, PDF, images, favicon
- Note: All assets included in git (no CDN)

**scripts/**
- Purpose: Build-time and utility scripts
- Contains: OG image generation script

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Home page - main entry point with hero battle system
- `app/layout.tsx`: Root layout - loads fonts, analytics, applies global styles
- `app/api/contact/route.ts`: Contact form API endpoint
- `app/api/subscribe/route.ts`: Email subscription API endpoint

**Configuration:**
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases)
- `next.config.js`: Next.js behavior (security headers, cache, redirects)
- `tailwind.config.ts`: Tailwind CSS settings (if present in repo)
- `.env.example`: Template for environment variables

**Core Logic:**
- `components/TerminalTypewriter.tsx`: Hero content + email signup
- `components/BattleSystem.tsx`: Interactive combat animation
- `components/ContactModal.tsx`: Contact form submission
- `lib/validation.ts`: Input validation and sanitization
- `lib/env.ts`: Environment setup and validation

**Testing:**
- No test files in codebase (no `__tests__`, `*.test.ts`, `*.spec.ts`)

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `TerminalTypewriter.tsx`, `BattleSystem.tsx`)
- Routes/Pages: lowercase with hyphens (e.g., `/api/contact`, `/portfolio`)
- Utilities: lowercase (e.g., `validation.ts`, `env.ts`)
- Styles: Global file is `globals.css`

**Directories:**
- Feature directories: lowercase with hyphens (e.g., `/api/contact`, `/about`)
- Special dirs: `app/`, `components/`, `lib/`, `public/`

**Functions/Variables:**
- Exported functions: camelCase (e.g., `isValidEmail`, `escapeHtml`, `useHapticFeedback`)
- React components: PascalCase (e.g., `TerminalTypewriter`, `BattleSystem`)
- Constants: UPPER_SNAKE_CASE (e.g., `RATE_LIMIT_WINDOW`, `MAIN_MESSAGE`)
- State variables: camelCase (e.g., `isContactModalOpen`, `loadingStage`)

**Types/Interfaces:**
- Interfaces: PascalCase (e.g., `ContactFormData`, `ContactModalProps`)
- Type aliases: PascalCase (e.g., `HandState`)

## Where to Add New Code

**New Page/Route:**
- Create directory under `app/` with route name (e.g., `app/new-page/`)
- Add `page.tsx` file with metadata export and component
- Optionally add `opengraph-image.tsx` for dynamic OG image
- Metadata pattern: Copy from existing page (e.g., `app/about/page.tsx`)

**New Client Component:**
- Create file in `components/ComponentName.tsx`
- Add `'use client'` directive at top of file
- Export default or named component
- Use React hooks (useState, useEffect, useRef, etc.)
- Wrap with `memo()` if component doesn't need frequent re-renders

**New API Route:**
- Create directory under `app/api/` with endpoint name
- Add `route.ts` file with POST/GET/etc. handler function
- Pattern: `export async function POST(request: NextRequest) { ... }`
- Use `lib/validation.ts` helpers for input validation
- Return `NextResponse.json(data, { status })` for responses

**New Utility Function:**
- Add to existing `lib/*.ts` file or create new `lib/feature.ts`
- Export named function (not default)
- Add TypeScript type annotations
- Use from API routes and components via imports

**Styling:**
- Global styles: Add to `app/globals.css` (uses Tailwind + CSS custom variables)
- Component styles: Use Tailwind classes in JSX or inline styles
- Custom CSS variables defined in `:root` in `globals.css`
- Variable naming: `--kebab-case` (e.g., `--accent-color`, `--spacing-unit`)

## Special Directories

**`.planning/codebase/`:**
- Purpose: Architecture and codebase documentation
- Generated: No (manually created)
- Committed: Yes - part of git repo
- Contains: STACK.md, INTEGRATIONS.md, ARCHITECTURE.md, STRUCTURE.md

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes - auto-created by `npm run build`
- Committed: No - included in `.gitignore`
- Contains: Compiled pages, manifests, cache

**`.vercel/`:**
- Purpose: Vercel deployment configuration
- Generated: Partially (project.json pre-created)
- Committed: Yes - git tracked
- Contains: Project ID and deployment settings

**`public/`:**
- Purpose: Static files served as-is (no processing)
- Generated: No - manually maintained
- Committed: Yes - all static assets in git
- Note: Preload critical assets in layout.tsx for performance

## Import Path Aliases

**Configured in `tsconfig.json`:**
```json
"paths": {
  "@/*": ["./*"]
}
```

**Usage:**
- `import Component from '@/components/TerminalTypewriter'`
- `import { isValidEmail } from '@/lib/validation'`
- `import { validateEnv } from '@/lib/env'`

Benefits:
- Avoids relative path imports (`../../components/...`)
- Cleaner, more maintainable import statements
- Works across all files (app, components, lib)

## Building and Running

**Scripts in `package.json`:**
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # TypeScript check + Next.js build (requires tsc --noEmit first)
npm start                # Start production server
npm run lint             # Run ESLint via next lint
npm run typecheck        # Run TypeScript compiler (no emit)
```

**Build Process:**
1. `tsc --noEmit` - Type check all .ts/.tsx files
2. `next build` - Compile Next.js app, create `.next/` output
3. Output ready for `npm start` or Vercel deployment

---

*Structure analysis: 2026-04-13*
