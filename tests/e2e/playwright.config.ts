import { resolve } from "node:path"
import { defineConfig, devices } from "@playwright/test"

// Load the project root .env so environment variables like NPM_TOKEN are
// available even when the runner (e.g. mise) doesn't inject them.
try {
  process.loadEnvFile(resolve(import.meta.dirname, "../../.env"))
} catch {
  // .env is optional — CI provides variables through other means.
}

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
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm --filter @solidiom/site dev",
    env: {
      SOLIDIOM_E2E: "1",
    },
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    cwd: "../..",
    timeout: 30_000,
  },
})
