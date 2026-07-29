import { expect, test } from "@playwright/test"

/**
 * TEST-002: Shell smoke tests for the Solidiom site.
 *
 * Validates that core navigation, layout, and interactive shell features
 * work across both English (/) and Spanish (/es/) routes.
 */

const LOCALES = [
  { prefix: "/", name: "English" },
  { prefix: "/es/", name: "Spanish" },
] as const

test.describe("TEST-002: Shell Smoke Tests", () => {
  test.describe("Site loads", () => {
    for (const locale of LOCALES) {
      test(`${locale.name}: responds with 200 on ${locale.prefix}`, async ({ page }) => {
        const response = await page.goto(locale.prefix)
        expect(response?.status()).toBe(200)
      })
    }
  })

  test.describe("Header", () => {
    for (const locale of LOCALES) {
      test(`${locale.name}: header is visible with brand link and navigation`, async ({ page }) => {
        await page.goto(locale.prefix)

        const header = page.getByRole("banner")
        await expect(header).toBeVisible()

        const brand = page.locator(".site-header__brand")
        await expect(brand).toBeVisible()
        await expect(brand).toHaveAttribute("href", locale.prefix)

        // Desktop navigation or mobile hamburger must be present
        const desktopNav = page.locator(".site-header__desktop-nav")
        const hamburger = page.locator(".site-header__hamburger-button").first()
        const hasDesktopNav = await desktopNav.isVisible()
        const hasHamburger = await hamburger.isVisible()
        expect(hasDesktopNav || hasHamburger).toBe(true)
      })
    }
  })

  test.describe("Mobile drawer", () => {
    test("opens and closes on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/")

      const trigger = page.locator(".site-header__hamburger-button").first()
      await expect(trigger).toBeVisible()

      await trigger.click()
      const drawerContent = page.locator(".site-header__drawer-content")
      await expect(drawerContent).toBeVisible()

      const close = page.getByRole("button", { name: "Close menu" })
      await close.click()
      await expect(drawerContent).toBeHidden()
    })

    test("closes with Escape key", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto("/")

      const trigger = page.locator(".site-header__hamburger-button").first()
      await trigger.click()
      await expect(page.locator(".site-header__drawer-content")).toBeVisible()

      await page.keyboard.press("Escape")
      await expect(page.locator(".site-header__drawer-content")).toBeHidden()
    })
  })

  test.describe("Theme toggle", () => {
    test("cycles through theme preferences", async ({ page }) => {
      await page.goto("/")
      const toggle = page.locator("button.theme-toggle")
      const html = page.locator("html")

      await expect(toggle).toBeVisible()

      // system → light → dark → system
      await toggle.click()
      await expect(html).toHaveAttribute("data-theme-preference", "light")

      await toggle.click()
      await expect(html).toHaveAttribute("data-theme-preference", "dark")

      await toggle.click()
      await expect(html).toHaveAttribute("data-theme-preference", "system")
    })
  })

  test.describe("Language switcher", () => {
    test("navigates from English to Spanish and back", async ({ page }) => {
      await page.goto("/")

      const spanishSwitcher = page.getByRole("button", { name: "Switch language to Español" })
      await expect(spanishSwitcher).toBeVisible()
      await spanishSwitcher.focus()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/\/es\/$/)

      const englishSwitcher = page.getByRole("button", { name: "Switch language to English" })
      await expect(englishSwitcher).toBeVisible()
      await englishSwitcher.focus()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/\/$/)
    })
  })

  test.describe("Footer", () => {
    for (const locale of LOCALES) {
      test(`${locale.name}: footer is present with links`, async ({ page }) => {
        await page.goto(locale.prefix)

        const footer = page.getByRole("contentinfo")
        await expect(footer).toBeVisible()

        const footerLinks = footer.locator("a")
        const count = await footerLinks.count()
        expect(count).toBeGreaterThan(0)
      })
    }
  })

  test.describe("404 page", () => {
    test("renders for unknown routes", async ({ page }) => {
      const response = await page.goto("/non-existent-route-xyz/")
      expect(response?.status()).toBe(404)
      await expect(page.locator("h1")).toContainText("404")
    })

    test("renders for unknown Spanish routes", async ({ page }) => {
      const response = await page.goto("/es/non-existent-route-xyz/")
      expect(response?.status()).toBe(404)
      await expect(page.locator("h1")).toContainText("404")
    })
  })

  test.describe("Skip link", () => {
    for (const locale of LOCALES) {
      test(`${locale.name}: skip link focuses main content`, async ({ page }) => {
        await page.goto(locale.prefix)

        const skipLink = page.getByRole("link", { name: /skip to main/i })
        await expect(skipLink).toHaveCount(1)

        await skipLink.focus()
        await expect(skipLink).toBeFocused()
        await page.keyboard.press("Enter")

        const main = page.locator("main#main-content")
        await expect(main).toBeFocused()
      })
    }
  })
})
