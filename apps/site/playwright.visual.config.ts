import { defineConfig, devices } from "@playwright/test"

/**
 * TEST-003: Separate Playwright config for visual regression tests.
 *
 * Uses chromium-only for pixel-consistent baselines.
 * Snapshots are stored in tests/visual/__screenshots__/.
 * Set UPDATE_SNAPSHOTS=1 to update baseline images.
 *
 * TEST-005: baselines are environment-sensitive — font rasterisation differs
 * between macOS and Linux (all 36 images differ), so the same commit renders
 * differently per platform. Capture and verify them only through the pinned
 * Playwright image, via `pnpm run visual:container` /
 * `pnpm run visual:update:container`, or by dispatching
 * .github/workflows/visual-baselines.yml. Running `test:visual:update` directly
 * on a non-Linux host will produce baselines that CI cannot reproduce.
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
  // A visual run must never create a baseline implicitly. Reference images
  // change only through the explicit `test:visual:update` command or an
  // intentional UPDATE_SNAPSHOTS=1 invocation.
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === "1" ? "all" : "none",
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
