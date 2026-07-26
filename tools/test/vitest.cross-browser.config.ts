/**
 * Vitest cross-browser config — runs browser-mode tests across
 * chromium, firefox, and webkit for parity certification.
 * Uses Vitest v4 Playwright provider factory.
 */
import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"
import { playwright } from "@vitest/browser-playwright"

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    name: "cross-browser",
    include: ["packages/**/src/**/*.browser.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
  },
})
