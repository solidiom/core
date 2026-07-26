import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"

/**
 * Root vitest browser config — cross-browser matrix for component tests.
 * Runs with Playwright provider across chromium, firefox, and webkit.
 */
export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    include: ["packages/**/src/**/*.browser.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
})
