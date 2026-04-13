# Testing Patterns

**Analysis Date:** 2026-04-13

## Test Framework

**Status:** No test framework currently configured

**Current Approach:**
- No testing dependencies installed (Jest, Vitest, Testing Library not in `package.json`)
- No test configuration files present (`jest.config.js`, `vitest.config.ts`, etc.)
- No `.test.ts` or `.spec.ts` files found in codebase
- Type checking enforced via TypeScript: `tsc --noEmit` in build pipeline

**Type Safety as Testing:**
- TypeScript strict mode active - enforces type correctness at compile time
- All function signatures include explicit parameter and return types
- Interface validation prevents runtime type errors
- Build fails if type errors exist: `tsc --noEmit && next build`

## Build-Time Validation

**Type Checking:**
- Command: `npm run typecheck` runs `tsc --noEmit`
- Runs before build: `npm run build` executes `tsc --noEmit && next build`
- Catches type errors early without building full bundle

**ESLint Integration:**
- Command: `npm run lint` runs `next lint`
- Uses `eslint-config-next` (ESLint v9)
- No custom ESLint configuration file
- Enforces code style and best practices

## Test File Organization

**Current Status:** No test files exist

**Recommended Patterns (if testing added):**
- Co-locate tests with source code: `ComponentName.tsx` and `ComponentName.test.tsx` in same directory
- Test utilities: `lib/validation.test.ts` alongside `lib/validation.ts`
- API route tests: `app/api/contact/route.test.ts` alongside `app/api/contact/route.ts`

**Expected Location Structure:**
```
components/
├── BattleSystem.tsx
├── BattleSystem.test.tsx
├── ContactModal.tsx
├── ContactModal.test.tsx
└── ...

lib/
├── validation.ts
├── validation.test.ts
├── env.ts
└── hooks.ts

app/
├── api/
│   ├── contact/
│   │   ├── route.ts
│   │   └── route.test.ts
│   └── subscribe/
│       ├── route.ts
│       └── route.test.ts
```

## Test Structure Patterns

**No existing test patterns found** - The following represent recommended patterns for this codebase based on its structure:

**Unit Test Pattern (for utilities):**
```typescript
// Example: lib/validation.test.ts pattern
import { isValidEmail, escapeHtml, sanitizeInput } from '@/lib/validation'

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;')
  })
})
```

**API Route Test Pattern:**
```typescript
// Example: app/api/contact/route.test.ts pattern
import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

describe('POST /api/contact', () => {
  it('validates email before processing', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('enforces rate limiting', async () => {
    // Test multiple submissions from same IP
    // Verify 3rd submission returns 429
  })
})
```

## Mocking

**Recommended Approach (not currently used):**

**External Service Mocking:**
```typescript
// Mock Resend email service
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ success: true })
    }
  }))
}))
```

**Browser API Mocking:**
```typescript
// Mock Vibration API for haptic feedback
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn()
})

// Mock matchMedia for prefers-reduced-motion
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}))
```

**What to Mock:**
- External APIs: Resend email service
- Browser APIs: navigator.vibrate, window.matchMedia, requestAnimationFrame
- Date/Time: Use jest.useFakeTimers() for timeout testing
- Fetch calls: Mock window.fetch in component tests

**What NOT to Mock:**
- Validation logic: Test actual isValidEmail() and escapeHtml()
- Core game logic: Test BattleSystem collision detection with real DOM
- State management: Test useState hooks with actual state updates

## Fixtures and Factories

**Recommended Pattern (not currently used):**

**Test Data Factory:**
```typescript
// Example test-fixtures.ts
export const createMockContactFormData = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'This is a test message with sufficient length',
  ...overrides
})

export const createMockProjectile = (overrides = {}) => ({
  id: 'projectile-left-1',
  side: 'left' as const,
  x: 100,
  y: 50,
  startTime: Date.now(),
  active: true,
  ...overrides
})
```

**Location:** Create `__fixtures__/` or `test-utils/` directory at project root

## Coverage

**Current Status:** No coverage tools configured

**If Adding Coverage:**
- Create `jest.config.js` with coverage settings
- Target: Minimum 70% coverage for lib utilities, 60% for components
- Exclude from coverage: `.next/`, `node_modules/`, type definitions

**Coverage Focus Areas (by priority):**
1. **High priority:** API route validation logic (`app/api/*/route.ts`)
2. **High priority:** Utility functions (`lib/validation.ts`, `lib/env.ts`)
3. **Medium priority:** Form components (ContactModal, EmailModal)
4. **Medium priority:** Game logic (BattleSystem collision detection)
5. **Low priority:** Layout and page components

**View Coverage (if configured):**
```bash
npm run test:coverage
# Generates coverage/index.html for detailed report
```

## Test Types

**Unit Tests (Recommended):**
- **Scope:** Individual functions and hooks
- **Approach:** Test validation functions, utility helpers, custom hooks
- **Examples:**
  - `isValidEmail()` with various email formats
  - `escapeHtml()` with special characters
  - `checkRateLimit()` with multiple requests
  - `useHapticFeedback()` hook behavior
  - Game constants and collision math

**Integration Tests (Recommended):**
- **Scope:** API routes with dependencies
- **Approach:** Test POST endpoints with form validation pipeline
- **Examples:**
  - Contact form submission: validation → rate limiting → email sending
  - Email subscription: validation → Resend integration fallback
  - Environment validation on app startup

**Component Tests (Recommended for complex components):**
- **Scope:** Interactive components with state
- **Approach:** Use React Testing Library for behavior testing
- **Examples:**
  - ContactModal form submission flow
  - BattleSystem collision detection and animation timing
  - TerminalTypewriter typing animation state

**E2E Tests:**
- **Status:** Not currently configured
- **Could add:** Cypress or Playwright for user workflows
- **Scenarios:** Full contact form submission, navigation flow, game interaction

## Common Patterns

**Async Testing (if added):**
```typescript
// Pattern for testing async API routes
it('handles async form submission', async () => {
  const request = new NextRequest(...)
  const response = await POST(request)
  const data = await response.json()
  expect(data.success).toBe(true)
})
```

**Error Testing (if added):**
```typescript
// Pattern for testing error cases
it('rejects invalid input', async () => {
  const request = new NextRequest('...', {
    method: 'POST',
    body: JSON.stringify({ name: '', email: 'invalid' })
  })
  const response = await POST(request)
  expect(response.status).toBe(400)
  const data = await response.json()
  expect(data.error).toContain('valid')
})
```

**Mock Timers (for game loop testing):**
```typescript
// Pattern for testing animation and timing
beforeEach(() => {
  jest.useFakeTimers()
})

it('updates projectile position over time', () => {
  const projectile = createMockProjectile()
  jest.advanceTimersByTime(1000)
  // Verify projectile moved by expected distance
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})
```

## Adding Tests

**Setup Steps (if testing added):**

1. **Install testing dependencies:**
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest
   ```

2. **Create jest.config.js:**
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
     collectCoverageFrom: ['app/**/*.ts(x)?', 'components/**/*.ts(x)?', 'lib/**/*.ts']
   }
   ```

3. **Add test scripts to package.json:**
   ```json
   "test": "jest",
   "test:watch": "jest --watch",
   "test:coverage": "jest --coverage"
   ```

4. **Create test files** alongside source files following co-location pattern

---

*Testing analysis: 2026-04-13*
