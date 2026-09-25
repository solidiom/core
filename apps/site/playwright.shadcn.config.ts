import { defineConfig, devices } from "@playwright/test"

/**
 * shadcn parity suite. Chromium-only for pixel-consistent captures.
 *
 * Specs live at the worktree root (tests/shadcn-parity/specs) and are generated
 * by `pnpm run parity:generate` (run from the worktree root) — regenerate after
 * editing tests/shadcn-parity/mapping.json.
 *
 * The reference app must be running on :4333 (tools/shadcn-reference) and the
 * site on :4322 (site preview). Gated out of CI by default (human-in-loop per
 * spec §4); enable with PARITY_IN_CI=1.
 */
export default defineConfig({
  testDir: "../../tests/shadcn-parity/specs",
  outputDir: "../../test-results/site-shadcn-parity",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
})
