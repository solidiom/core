import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"
import { playwright } from "@vitest/browser-playwright"

/**
 * Root Vitest browser configuration — cross-browser component matrix.
 * HMR is disabled because this is a one-shot test environment.
 */
export default defineConfig({
  plugins: [solidPlugin({ hot: false })],
  test: {
    include: ["packages/**/src/**/*.browser.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
})
