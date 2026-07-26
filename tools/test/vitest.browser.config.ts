import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"

/**
 * Vitest config for browser-mode component tests.
 * Uses @vitest/browser with Playwright (Chromium) provider.
 * Used by: primitives, component-shaped recipes, integration tests.
 */
export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    include: ["src/**/*.browser.{test,spec}.{ts,tsx}"],
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
