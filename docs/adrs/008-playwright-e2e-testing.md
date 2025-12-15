# ADR 008: Playwright for E2E Testing

## Status
Accepted

## Date
2025-01-01 (retrospective)

## Context

The application needed end-to-end testing that:
- Tests real user flows in a browser
- Works with Next.js development server
- Supports parallel test execution
- Can test API routes
- Provides good debugging tools

## Decision

Use **Playwright** for end-to-end testing with worker-based test data isolation.

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 10,
  timeout: 90000,
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'PORT=3000 npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE: 'true',
    }
  },
})
```

### Test Data Isolation

Each parallel worker gets its own data file to avoid conflicts:

```typescript
// src/lib/announcements.ts
export function getDataFile(request?: NextRequest): string {
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE === 'true' && request) {
    const workerHeader = request.headers.get('x-playwright-worker-id')
    if (workerHeader) {
      return path.join(process.cwd(), 'data', `announcements-test-${workerHeader}.json`)
    }
  }
  return path.join(process.cwd(), 'data', 'announcements.json')
}
```

### Test Reset Script

```javascript
// reset-test-data.js
// Cleans up test data files before each run
```

### NPM Scripts

```json
{
  "scripts": {
    "test": "node reset-test-data.js && playwright test",
    "test:ui": "node reset-test-data.js && playwright test --ui",
    "test:debug": "node reset-test-data.js && playwright test --debug",
    "test:headed": "node reset-test-data.js && playwright test --headed"
  }
}
```

### Test Structure

```
tests/
├── homepage.spec.ts          # Home page tests
├── announcements.spec.ts     # Announcements feature
├── admin.spec.ts             # Admin panel
├── admin-create-modal.spec.ts
├── admin-integration.spec.ts
└── api.spec.ts               # API route tests
```

### Example Test

```typescript
// tests/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Community Allotment/)
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Announcements')
  await expect(page).toHaveURL('/announcements')
})
```

## Consequences

### Positive
- **Real browser testing** - Tests actual user experience
- **Parallel execution** - Fast test runs with 10 workers
- **Auto-waiting** - Built-in smart waiting for elements
- **Debugging tools** - UI mode, trace viewer, headed mode
- **Cross-browser support** - Can test Chrome, Firefox, Safari
- **API testing** - Can test API routes directly

### Negative
- **Slower than unit tests** - Requires browser and server
- **Test data complexity** - Need isolation strategy
- **Flakiness potential** - Network and timing issues
- **No component testing** - Need separate tool for unit tests

### Test Isolation Strategy

The worker-based file isolation approach:

1. Each Playwright worker gets unique ID
2. Worker ID sent in `x-playwright-worker-id` header
3. Server creates separate data file per worker
4. Tests don't interfere with each other
5. `reset-test-data.js` cleans up before runs

### Current Coverage

| Area | Tested |
|------|--------|
| Homepage | ✅ |
| Announcements | ✅ |
| Admin CRUD | ✅ |
| API Routes | ✅ |
| Garden Planner | ❌ (needs tests) |
| AI Advisor | ❌ (requires API mocking) |

### Future Improvements

- Add component tests with Vitest or Testing Library
- Add visual regression tests
- Mock AI API for advisor tests
- Add garden planner E2E tests

