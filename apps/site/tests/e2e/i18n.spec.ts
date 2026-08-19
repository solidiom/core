import { expect, test } from "@playwright/test"

function alternate(page: import("@playwright/test").Page, language: string) {
  return page.locator(`link[rel="alternate"][hreflang="${language}"]`)
}

test.describe("I18N-001 through I18N-004", () => {
  test("renders registered home routes with explicit locale context and no redirect", async ({
    page,
  }) => {
    const english = await page.goto("/")
    expect(english?.status()).toBe(200)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
    expect(new URL(page.url()).pathname).toBe("/")

    const spanish = await page.goto("/es/")
    expect(spanish?.status()).toBe(200)
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
    expect(new URL(page.url()).pathname).toBe("/es/")
  })

  test("uses an accessible switcher for a verified non-home equivalent and persists explicit choice", async ({
    page,
  }) => {
    await page.goto("/privacy/")

    const spanishSwitcher = page.getByRole("button", { name: "Switch language to Español" })
    await expect(spanishSwitcher).toBeVisible()
    await expect(spanishSwitcher).toBeEnabled()
    // The button is SSR-rendered before SolidJS hydrates the onClick handler.
    // Poll-click until the navigation proves the handler is wired.
    await expect(async () => {
      await spanishSwitcher.click()
      await expect(page).toHaveURL(/\/es\/privacy\/$/, { timeout: 2000 })
    }).toPass({ timeout: 10000 })
    await expect(page.locator("html")).toHaveAttribute("data-locale-preference", "es")
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("solidiom-locale-preference")))
      .toBe("es")

    const englishSwitcher = page.getByRole("button", { name: "Switch language to English" })
    await expect(englishSwitcher).toBeVisible()
    await expect(englishSwitcher).toBeEnabled()
    await expect(async () => {
      await englishSwitcher.click()
      await expect(page).toHaveURL(/\/privacy\/$/, { timeout: 2000 })
    }).toPass({ timeout: 10000 })
    await expect(page.locator("html")).toHaveAttribute("data-locale-preference", "en")
  })

  test("reads a persisted preference without overriding a direct locale URL", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("solidiom-locale-preference", "es"))
    await page.goto("/")
    expect(new URL(page.url()).pathname).toBe("/")
    await expect(page.locator("html")).toHaveAttribute("data-locale-preference", "es")

    await page.addInitScript(() => localStorage.setItem("solidiom-locale-preference", "en"))
    await page.goto("/es/")
    expect(new URL(page.url()).pathname).toBe("/es/")
    await expect(page.locator("html")).toHaveAttribute("data-locale-preference", "en")
  })

  test("emits exact canonical and hreflang metadata only for registered counterparts", async ({
    page,
  }) => {
    await page.goto("/es/privacy/?source=test#summary")

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/es/privacy/",
    )
    await expect(alternate(page, "en")).toHaveAttribute("href", "https://solidiom.org/privacy/")
    await expect(alternate(page, "es")).toHaveAttribute("href", "https://solidiom.org/es/privacy/")
    await expect(alternate(page, "x-default")).toHaveAttribute(
      "href",
      "https://solidiom.org/privacy/",
    )
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Cómo Solidiom maneja tus datos — qué recopilamos, qué no, y tus derechos.",
    )
  })
})
