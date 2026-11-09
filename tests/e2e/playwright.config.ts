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
    // `E2E_PORT` lets a run point at a dev server on a free port when the
    // default 4321 is occupied by an unrelated process on the machine.
    baseURL: `http://localhost:${process.env.E2E_PORT ?? 4321}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // `--ignore-lock` + the explicit port keep the dev server bound to
    // E2E_PORT: astro's lock file is per-project, so without it a server
    // already holding the lock (e.g. one on the default 4321) makes this
    // command exit immediately and Playwright waits forever on `url`.
    command: `pnpm --filter @solidiom/site exec astro dev --ignore-lock --port ${process.env.E2E_PORT ?? 4321}`,
    env: {
      ASTRO_DEV_BACKGROUND: "0",
      SOLIDIOM_E2E: "1",
    },
    url: `http://localhost:${process.env.E2E_PORT ?? 4321}`,
    // Astro 7's `astro dev` daemonizes by default (prints the URL, exits 0),
    // so the spawned process always "exits early" from Playwright's view.
    // Reuse a server that is already up, including in CI, where the port is
    // owned by this same job.
    reuseExistingServer: true,
    cwd: "../..",
    timeout: 120_000,
  },
})
