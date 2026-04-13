# Coding Conventions

**Analysis Date:** 2026-04-13

## Naming Patterns

**Files:**
- PascalCase for React components: `BattleSystem.tsx`, `TerminalTypewriter.tsx`, `FooterCTAs.tsx`
- camelCase for utility/hook files: `validation.ts`, `hooks.ts`, `env.ts`
- kebab-case for route files: `opengraph-image.tsx`, `not-found.tsx`
- Lowercase with hyphens for page routes: `/app/wormhole`, `/app/services`

**Functions:**
- camelCase for all function names: `fireProjectile()`, `calculateFingertipPosition()`, `checkCollision()`
- Verb-prefix pattern for actions: `get*()`, `check*()`, `handle*()`, `validate*()`
- Example: `getProjectileX()`, `getClientIp()`, `handleEmailSubmit()`

**Variables:**
- camelCase for all variables and state: `projectiles`, `muzzleFlashes`, `handState`, `screenShake`
- UPPER_SNAKE_CASE for constants: `SHOT_COOLDOWN`, `PROJECTILE_SPEED`, `TELEGRAPH_DURATION`
- Descriptive names reflecting purpose: `animationStartTime`, `telegraphTimeoutRef`, `charCount`

**Types & Interfaces:**
- PascalCase for interfaces: `Props`, `Projectile`, `Impact`, `MuzzleFlash`, `HandState`, `ContactFormData`
- Union types use PascalCase: `HandState = 'alive' | 'dying' | 'respawning' | 'invincible'`
- Props interfaces follow pattern: `ComponentNameProps` (e.g., `FooterCTAsProps`, `ContactModalProps`)

## Code Style

**Formatting:**
- TypeScript strict mode enabled (`tsconfig.json` strict: true)
- 2-space indentation (inferred from source)
- Single quotes for strings: `'use client'`, `'alive'`
- Trailing semicolons on statements

**Linting:**
- ESLint 9 configured via `eslint-config-next`
- No custom `.eslintrc` file found - uses Next.js defaults
- TypeScript type checking enforced in build: `tsc --noEmit` runs before build
- Build command: `tsc --noEmit && next build`

**Type Safety:**
- Strict TypeScript throughout (`strict: true` in tsconfig)
- Explicit type annotations on function parameters and returns
- Type guards used for API responses: `as ContactFormData`, `as SubscribeFormData`
- Unknown error types caught and narrowed: `catch (error: unknown)`

## Import Organization

**Order:**
1. React hooks and utilities: `import { useState, useEffect, memo } from 'react'`
2. Next.js utilities: `import dynamic from 'next/dynamic'`, `import type { Metadata } from 'next'`
3. External packages: `import { Resend } from 'resend'`
4. Absolute imports (path aliases): `import BattleSystem from '@/components/BattleSystem'`
5. Local utilities/libs: `import { validateEnv } from '@/lib/env'`

**Path Aliases:**
- Configured in `tsconfig.json`: `"@/*": ["./*"]`
- Used consistently for imports across all files
- Enables cleaner relative path handling

**Dynamic Imports:**
- Used for large components to reduce initial bundle: `const ContactModal = dynamic(() => import('@/components/ContactModal'), { ssr: false, loading: () => null })`
- Pattern: Lazy load with explicit `ssr: false` for client-only components
- Example in `app/page.tsx` line 11-14

## Error Handling

**Patterns:**
- Try-catch blocks on async operations: API routes wrap POST handlers in try-catch
- Environment validation on module load: `validateEnv()` called at top of API routes
- Graceful degradation for optional services: Resend API key optional, falls back to console logging
- Development-only logging: `if (process.env.NODE_ENV === 'development') { console.error(...) }`
- Type-safe error handling: `catch (error: unknown)` with narrowing

**API Routes:**
- Input validation before processing: Check honeypot, timestamp, rate limit
- Clear error messages returned to client: `{ error: 'Please enter a valid email address' }`
- HTTP status codes used correctly: 400 for validation, 429 for rate limit, 500 for server error
- Response structure: `{ success: true, message: '...' }` or `{ error: 'error message' }`

**Client Error Handling:**
- ErrorBoundary class component wraps components to catch render errors
- Silent failures for optional features: Haptic feedback fails silently if API unavailable
- Development logging for debugging: Errors logged only in development mode

## Logging

**Framework:** `console` (browser/Node.js native)

**Patterns:**
- Development-only logging: All logging gated by `if (process.env.NODE_ENV === 'development')`
- No logging in production for performance and privacy
- Contextual logging with prefixes: `console.log('[CONTACT FORM]', { ... })`, `console.log('[EMAIL SIGNUP]', { ... })`
- Error logging: `console.error('Component error:', error)`
- Configuration logging on startup: `validateEnv()` logs available environment variables with status indicators

**Examples:**
- `app/api/contact/route.ts` line 183: Logs contact form submissions with all details
- `app/api/subscribe/route.ts` line 129: Logs email signups with timestamp
- `app/layout.tsx` line 104-109: Comments document performance optimizations

## Comments

**When to Comment:**
- Performance optimizations: `// #3: Font preconnect optimization`, `// #5: Lazy load decorative effects`
- Complex algorithms or non-obvious logic: Comments in game loop explaining collision detection
- Browser/mobile-specific fixes: `// MOBILE FIX: Reduced to 72px for proper spacing on 320px screens`
- Magic numbers explained: `// 1 second between shots`, `// Telegraph charge time (increased for better anticipation)`
- Security considerations: `// Honeypot check (simple spam prevention)`

**JSDoc/TSDoc:**
- Used for exported utility functions: `export function isValidEmail(email: string): boolean`
- Includes purpose, parameter docs, and return description
- Example in `lib/validation.ts`:
  ```typescript
  /**
   * Validates an email address using a standard regex pattern
   * Checks for: non-empty, contains @, has domain part
   */
  export function isValidEmail(email: string): boolean
  ```

**Inline Comments:**
- Single-line comments for clarification: `// Escape HTML to prevent XSS attacks`
- Rarely used - code is written to be self-documenting
- Technical notes marked with `#` prefix for cross-reference: `#2: Standardized border-radius`

## Function Design

**Size:** 
- Small, focused functions preferred
- Game loop in `BattleSystem.tsx` is ~80 lines - largest function due to animation logic
- Most utility functions 10-20 lines
- API route handlers split logic into helper functions (checkHoneypot, checkRateLimit, etc.)

**Parameters:**
- Destructure object parameters when multiple: `({ children }: Props)`, `{ onEmailSubmit }: { onEmailSubmit?: (email: string) => void }`
- Single parameter for simple cases: `(pattern: number | number[] = 10)`
- Default values used: `(maxLength: number = 1000)`

**Return Values:**
- Explicit return types on all functions: `function checkHoneypot(body: ContactFormData): boolean`
- Objects returned from validation: `{ allowed: boolean; retryAfter?: number }`
- Status tuples from complex operations: State updates via `setProjectiles(prev => [...prev, newProjectile])`
- Conditional rendering returns JSX or null

## Module Design

**Exports:**
- Named exports for utilities: `export function isValidEmail()`, `export function escapeHtml()`
- Default exports for React components: `export default function ContactModal()`
- Component memoization with `memo()`: `const BattleSystem = memo(function BattleSystem({ children }: Props) { ... })`

**Barrel Files:**
- Not used in this codebase
- Each file exports one or few related items
- `/lib` directory contains focused utility modules

**Component Structure:**
- Functional components using hooks (React 18.3.1)
- Client components marked with `'use client'` directive where needed
- Props interface defined at top of file
- Component logic flows: State → Effects → Handlers → Render

**File Organization:**
- Component imports at top
- Type definitions after imports (interfaces, types)
- Constant values after types
- Utility functions before main component
- useEffect hooks grouped logically
- Render JSX at bottom

---

*Convention analysis: 2026-04-13*
