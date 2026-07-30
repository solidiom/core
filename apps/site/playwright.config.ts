import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for @solidiom/site.
 *
 * SITE-011: covers Chromium, Firefox, and WebKit (Safari) for desktop,
 * plus a mobile viewport project for touch/responsive verification.
 * This satisfies the "current/previous browser support" requirement.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "../../test-results/site-e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
  ],
  webServer: {
    command:
      process.env.PLAYWRIGHT_USE_EXISTING_BUILD === "1"
        ? "pnpm preview --host 127.0.0.1 --port 4322"
        : "pnpm build && pnpm search-index && pnpm preview --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
