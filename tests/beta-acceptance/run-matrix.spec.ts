import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import {
  BETA_ACCEPTANCE_MATRIX,
  type AcceptanceArea,
} from "./matrix.js"

async function setTheme(page: import("@playwright/test").Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
  }, theme)
}

/**
 * BETA-002: Beta acceptance matrix — Playwright E2E runner.
 *
 * Iterates over the acceptance matrix areas and runs applicable checks
 * against a live preview server. Reports pass/fail per area.
 */

// ---------------------------------------------------------------------------
// Locales area
// ---------------------------------------------------------------------------
test.describe("BETA-002: Locale parity", () => {
  const localesArea = BETA_ACCEPTANCE_MATRIX.find((a) => a.name === "locales")! as AcceptanceArea

  for (const route of localesArea.routes) {
    const isSpanish = route.startsWith("/es/") || route === "/es/"
    const expectedLang = isSpanish ? "es" : "en"

    test(`${route} — route_exists, renders_html, has_locale_attr`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      await expect(page.locator("html")).toBeVisible()
      await expect(page.locator("html")).toHaveAttribute("lang", expectedLang)
    })
  }

  test("has_hreflang — English home has Spanish alternate", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/es/",
    )
  })

  test("has_hreflang — Spanish home has English alternate", async ({ page }) => {
    await page.goto("/es/")
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/",
    )
  })

  test("has_hreflang — primitives page has alternate", async ({ page }) => {
    await page.goto("/primitives/")
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/es/primitives/",
    )
  })

  test("has_hreflang — Spanish primitives page has alternate", async ({ page }) => {
    await page.goto("/es/primitives/")
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/primitives/",
    )
  })

  test("has_canonical — English pages have canonical links", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/",
    )
  })

  test("has_canonical — Spanish pages have canonical links", async ({ page }) => {
    await page.goto("/es/")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/es/",
    )
  })
})

// ---------------------------------------------------------------------------
// Themes area
// ---------------------------------------------------------------------------
test.describe("BETA-002: Theme modes", () => {
  const themesArea = BETA_ACCEPTANCE_MATRIX.find((a) => a.name === "themes")! as AcceptanceArea

  for (const route of themesArea.routes) {
    test(`${route} — light_mode`, async ({ page }) => {
      await page.goto(route)
      await setTheme(page, "light")
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
      await expect(page.locator("html")).toHaveCSS("color-scheme", "light")
    })

    test(`${route} — dark_mode`, async ({ page }) => {
      await page.goto(route)
      await setTheme(page, "dark")
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
      await expect(page.locator("html")).toHaveCSS("color-scheme", "dark")
    })
  }

  test("no_flash — bootstrap sets data-theme before paint", async ({ page }) => {
    const consoleMessages: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleMessages.push(msg.text())
      }
    })

    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("data-theme")
    await expect(page.locator("html")).toHaveAttribute("data-theme-preference")

    const flashErrors = consoleMessages.filter((msg) => /flash|fovc|theme.*flash/i.test(msg))
    expect(flashErrors).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Search area
// ---------------------------------------------------------------------------
test.describe("BETA-002: Search", () => {
  test("search_dialog_opens — Ctrl+K opens search dialog", async ({ page }) => {
    await page.goto("/primitives/dialog/examples/")
    await expect(page.locator('[data-site-search-hydrated="true"]')).toBeVisible()

    await page.keyboard.press("Control+k")
    const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
    await expect(dialog).toBeVisible()
  })

  test("keyboard_accessible — Tab moves focus within search", async ({ page }) => {
    await page.goto("/primitives/dialog/examples/")
    await page.keyboard.press("Control+k")
    const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
    await expect(dialog).toBeVisible()

    const input = dialog.getByRole("searchbox", { name: "Search documentation" })
    await expect(input).toBeFocused()

    await page.keyboard.press("Tab")
    const focusedAfterTab = page.locator(":focus")
    await expect(focusedAfterTab).not.toHaveAttribute("id", "site-search-input")
  })

  test("keyboard_accessible — Escape closes and restores focus", async ({ page }) => {
    await page.goto("/primitives/dialog/examples/")
    const trigger = page.getByRole("button", { name: "Search" })
    await trigger.click()

    const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
    await expect(dialog).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

// ---------------------------------------------------------------------------
// Tools area
// ---------------------------------------------------------------------------
test.describe("BETA-002: Tools", () => {
  test("builder_loads — theme builder loads", async ({ page }) => {
    const response = await page.goto("/themes/builder/")
    expect(response?.status()).toBe(200)
    await expect(page.locator(".theme-builder-shell")).toBeVisible({ timeout: 10_000 })
  })

  test("editor_panel — editor panel renders", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__panel-editor")).toBeVisible({ timeout: 10_000 })
  })

  test("preview_panel — preview panel renders", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__panel-preview")).toBeVisible({ timeout: 10_000 })
  })

  test("export_button — export button is visible", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__btn-export")).toBeVisible({ timeout: 10_000 })
  })

  test("builder_loads — Spanish builder loads", async ({ page }) => {
    const response = await page.goto("/es/themes/builder/")
    expect(response?.status()).toBe(200)
    await expect(page.locator(".theme-builder__title")).toBeVisible({ timeout: 10_000 })
  })
})

// ---------------------------------------------------------------------------
// A11y area
// ---------------------------------------------------------------------------
test.describe("BETA-002: Accessibility", () => {
  const a11yArea = BETA_ACCEPTANCE_MATRIX.find((a) => a.name === "a11y")! as AcceptanceArea

  for (const route of a11yArea.routes) {
    test(`${route} — no_critical_violations`, async ({ page }) => {
      await page.goto(route)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      const blocking = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      )
      expect(blocking).toEqual([])
    })
  }

  test("has_skip_link — skip link present on home", async ({ page }) => {
    await page.goto("/")
    const skipLink = page.getByRole("link", { name: /skip to main/i })
    await expect(skipLink).toHaveCount(1)

    await skipLink.focus()
    await page.keyboard.press("Enter")
    await expect(page.locator("main#main-content")).toBeFocused()
  })

  test("landmarks_present — home has required landmarks", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("banner")).toHaveCount(1)
    await expect(page.getByRole("main")).toHaveCount(1)
    await expect(page.getByRole("contentinfo")).toHaveCount(1)
  })
})