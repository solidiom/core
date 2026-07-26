import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright E2E config for the Solidiom docs app.
 *
 * Run with: npx playwright test --config tests/e2e/playwright.config.ts
 */
export default defineConfig({
  testDir: ".",
  outputDir: "../../test-results/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm --filter docs dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    cwd: "../..",
    timeout: 30_000,
  },
})
