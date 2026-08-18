import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"
import { playwright } from "@vitest/browser-playwright"

const supportedBrowsers = ["chromium", "firefox", "webkit"] as const
type SupportedBrowser = (typeof supportedBrowsers)[number]

const configuredBrowsers = process.env.VITEST_BROWSERS?.split(",")
  .map((browser) => browser.trim())
  .filter(Boolean)
const selectedBrowsers = configuredBrowsers?.length ? configuredBrowsers : [...supportedBrowsers]

if (!selectedBrowsers.every((browser) => supportedBrowsers.includes(browser as SupportedBrowser))) {
  throw new Error(
    `VITEST_BROWSERS must contain only: ${supportedBrowsers.join(", ")}. Received: ${selectedBrowsers.join(", ")}`,
  )
}

const browserInstances = selectedBrowsers.map((browser) => ({
  browser: browser as SupportedBrowser,
}))

/**
 * `VITEST_BROWSERS` may limit CI to a comma-separated subset (for example,
 * `chromium`); absent that variable, the complete cross-browser matrix runs.
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
      instances: browserInstances,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
})
