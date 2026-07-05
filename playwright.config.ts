import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. Playwright serves the app from a PRODUCTION build (pre-compiled
 * routes — no dev on-demand compilation, which was a source of first-hit
 * navigation timeouts). The backend is expected on :8080 with demo data seeded
 * (see e2e/README or the root README). `reuseExistingServer` lets a locally
 * running server (dev or prod) be reused so the build is skipped.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  // A safety net for residual transient flakes (network hiccups); deterministic
  // failures still fail. Flaky tests are surfaced in the report.
  retries: process.env.CI ? 2 : 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    navigationTimeout: 30_000,
    trace: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 240_000
  }
});
