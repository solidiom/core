import { expect, test } from "@playwright/test"

test.describe("SITE-009: Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any persisted preference.
    await page.goto("/")
    await page.evaluate(() => localStorage.removeItem("solidiom-theme"))
  })

  test("defaults to system preference with data-theme-preference=system", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html")
    await expect(html).toHaveAttribute("data-theme-preference", "system")
    // data-theme should be either "light" or "dark" depending on system.
    const theme = await html.getAttribute("data-theme")
    expect(theme === "light" || theme === "dark").toBe(true)
  })

  test("cycles through system → light → dark → system", async ({ page }) => {
    await page.goto("/")
    const toggle = page.locator("button.theme-toggle")
    const html = page.locator("html")

    await expect(html).toHaveAttribute("data-theme-preference", "system")

    await toggle.click()
    await expect(html).toHaveAttribute("data-theme-preference", "light")
    await expect(html).toHaveAttribute("data-theme", "light")

    await toggle.click()
    await expect(html).toHaveAttribute("data-theme-preference", "dark")
    await expect(html).toHaveAttribute("data-theme", "dark")

    await toggle.click()
    await expect(html).toHaveAttribute("data-theme-preference", "system")
  })

  test("persists preference in localStorage", async ({ page }) => {
    await page.goto("/")
    const toggle = page.locator("button.theme-toggle")

    await toggle.click() // → light
    const stored = await page.evaluate(() => localStorage.getItem("solidiom-theme"))
    expect(stored).toBe("light")
  })

  test("persisted preference survives navigation (no flash)", async ({ page }) => {
    await page.goto("/")
    const toggle = page.locator("button.theme-toggle")

    // Set to dark
    await toggle.click() // → light
    await toggle.click() // → dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

    // Reload and verify no flash: check data-theme is "dark" immediately.
    await page.reload()
    const theme = await page.locator("html").getAttribute("data-theme")
    expect(theme).toBe("dark")
    await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "dark")
  })

  test("has accessible aria-label describing state", async ({ page }) => {
    await page.goto("/")
    const toggle = page.locator("button.theme-toggle")

    const label = await toggle.getAttribute("aria-label")
    expect(label).toContain("Theme: system")
    expect(label).toContain("Click to switch to light")
  })

  test("no hydration mismatch: initial render matches bootstrap", async ({ page }) => {
    // Emulate dark system preference.
    await page.emulateMedia({ colorScheme: "dark" })
    await page.goto("/")

    const html = page.locator("html")
    await expect(html).toHaveAttribute("data-theme", "dark")
    await expect(html).toHaveAttribute("data-theme-preference", "system")

    // The toggle should show "system" state — its aria-label confirms it
    // read from data-theme-preference (set by bootstrap), not from any
    // async hydration.
    const toggle = page.locator("button.theme-toggle")
    const label = await toggle.getAttribute("aria-label")
    expect(label).toContain("Theme: system (dark)")
  })
})
