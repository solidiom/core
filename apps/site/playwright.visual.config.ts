import { defineConfig, devices } from "@playwright/test"

/**
 * TEST-003: Separate Playwright config for visual regression tests.
 *
 * Uses chromium-only for pixel-consistent baselines.
 * Snapshots are stored in tests/visual/__screenshots__/.
 * Set UPDATE_SNAPSHOTS=1 to update baseline images.
 */
export default defineConfig({
  testDir: "./tests/visual",
  outputDir: "../../test-results/site-visual",
  snapshotDir: "./tests/visual/__screenshots__",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === "1" ? "all" : "missing",
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm preview --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
