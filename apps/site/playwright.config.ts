import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for @solidiom/site.
 *
 * SITE-011: covers Chromium, Firefox, and WebKit (Safari) for desktop,
 * plus a mobile viewport project for touch/responsive verification.
 * This satisfies the "current/previous browser support" requirement.
 *
 * Firefox, WebKit, and mobile projects are scoped to tests that exercise
 * browser-specific behavior (shell UI, accessibility, theme). Tests that
 * verify server responses, static assets, or metadata only run in Chromium.
 */

/** Tests that exercise browser-specific rendering or interaction. */
const BROWSER_SPECIFIC_TESTS = [
  "shell-smoke.spec.ts",
  "shell-a11y.spec.ts",
  "theme-toggle.spec.ts",
  "focus-root.spec.ts",
]

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "../../test-results/site-e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["line"], ["github"], ["json", { outputFile: "../../test-results/site-e2e-results.json" }]]
    : "list",
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
      testMatch: BROWSER_SPECIFIC_TESTS,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: BROWSER_SPECIFIC_TESTS,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testMatch: ["shell-smoke.spec.ts", "shell-a11y.spec.ts"],
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
      testMatch: ["shell-smoke.spec.ts", "shell-a11y.spec.ts"],
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
