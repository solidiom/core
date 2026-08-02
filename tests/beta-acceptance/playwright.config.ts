import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./",
  outputDir: "../../test-results/beta-acceptance",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
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
  ],
  webServer: {
    command:
      process.env.PLAYWRIGHT_USE_EXISTING_BUILD === "1"
        ? "pnpm --filter @solidiom/site preview --host 127.0.0.1 --port 4322"
        : "pnpm --filter @solidiom/site build && pnpm --filter @solidiom/site search-index && pnpm --filter @solidiom/site preview --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
