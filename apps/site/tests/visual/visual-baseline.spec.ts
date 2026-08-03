import { expect, test, type Page } from "@playwright/test"

/**
 * TEST-003: Visual baseline tests using Playwright's toHaveScreenshot().
 *
 * Matrix: 3 pages × 3 viewports × 2 themes × 2 locales = 36 captures.
 * Uses chromium-only config for pixel-consistent baselines.
 */

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 667 },
] as const

const THEMES = ["light", "dark"] as const

const LOCALES = [
  { name: "en", prefix: "/" },
  { name: "es", prefix: "/es/" },
] as const

const PAGES = [
  { name: "homepage", path: "" },
  { name: "docs", path: "primitives/" },
  { name: "404", path: "this-page-does-not-exist/" },
] as const

async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value
    document.documentElement.dataset.themePreference = value
    document.documentElement.style.colorScheme = value
  }, theme)
  // Allow animations/transitions to settle
  await page.waitForTimeout(100)
}

for (const locale of LOCALES) {
  for (const pageConfig of PAGES) {
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        const testName = `${pageConfig.name}-${viewport.name}-${theme}-${locale.name}`
        const url = `${locale.prefix}${pageConfig.path}`

        test(testName, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          await page.goto(url, { waitUntil: "networkidle" })
          await setTheme(page, theme)

          await expect(page).toHaveScreenshot(`${testName}.png`, {
            fullPage: true,
            animations: "disabled",
          })
        })
      }
    }
  }
}
