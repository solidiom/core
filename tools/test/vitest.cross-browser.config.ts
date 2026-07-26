/**
 * Vitest cross-browser config — runs browser-mode tests across
 * chromium, firefox, and webkit for parity certification (§23 #36, Task 65).
 */
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "cross-browser",
    include: ["packages/**/src/**/*.browser.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
  },
})
