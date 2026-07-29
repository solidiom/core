import { defineConfig } from "vitest/config"

/**
 * TEST-001: Site-specific unit test configuration.
 *
 * Decoupled from the root vitest.config.ts which covers packages/* and tools/.
 * This config targets site utility functions and build-time logic only —
 * Playwright handles browser/e2e testing (see playwright.config.ts).
 */
export default defineConfig({
  test: {
    name: "@solidiom/site",
    root: ".",
    include: ["src/**/*.test.{ts,tsx}", "tools/**/*.test.ts"],
    exclude: ["node_modules", "dist", "tests/e2e"],
    environment: "node",
  },
})
