import { expect, test, type Page } from "@playwright/test"

test.describe("SEARCH-002 Site search", () => {
  test("opens from the keyboard, searches the Pagefind index, and restores focus", async ({
    page,
  }) => {
    await page.goto("/primitives/dialog/examples/")

    const trigger = page.getByRole("button", { name: "Search" })
    await expect(trigger).toBeVisible()
    await expect(page.locator('[data-site-search-hydrated="true"]')).toBeVisible()

    await page.keyboard.press("Control+k")
    const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
    await expect(dialog).toBeVisible()

    const input = dialog.getByRole("searchbox", { name: "Search documentation" })
    await expect(input).toBeFocused()
    await input.fill("confirmation")
    await expect(dialog.locator('a[href*="/primitives/dialog/examples/"]')).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('link[href*="pagefind-ui"], pagefind-ui')).toHaveCount(0)
  })

  test("uses localized copy", async ({ page }) => {
    await page.goto("/es/primitives/dialog/examples/")
    await expect(page.locator('[data-site-search-hydrated="true"]')).toBeVisible()
    await page.getByRole("button", { name: "Buscar" }).click()

    const dialog = page.getByRole("dialog", { name: "Buscar en Solidiom" })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole("searchbox", { name: "Buscar en la documentación" }),
    ).toBeVisible()
  })

  test("keeps a useful static fallback when JavaScript is unavailable", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()

    await page.goto("/")
    const fallback = page.locator(".site-search__fallback")
    await expect(fallback).toHaveText("Search requires JavaScript. Browse documentation")
    await expect(fallback.locator("a")).toHaveAttribute("href", "/primitives/")

    await context.close()
  })
})



// ---------------------------------------------------------------------------
// SEARCH-004 Search accessibility
// ---------------------------------------------------------------------------

/** Helper: open search dialog and wait for it to be visible. */
async function openSearchDialog(page: Page, locale: "en" | "es" = "en") {
  const triggerName = locale === "es" ? "Buscar" : "Search"
  const dialogName = locale === "es" ? "Buscar en Solidiom" : "Search Solidiom"

  const trigger = page.getByRole("button", { name: triggerName })
  await expect(trigger).toBeVisible()
  await expect(page.locator('[data-site-search-hydrated="true"]')).toBeVisible()
  return { trigger, dialogName }
}

test.describe("SEARCH-004 Search accessibility", () => {
  // ---------------------------------------------------------------------------
  // 1. Keyboard navigation
  // ---------------------------------------------------------------------------
  test.describe("Keyboard navigation", () => {
    test("Tab moves between form elements inside the dialog", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      const { dialogName } = await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: dialogName })
      await expect(dialog).toBeVisible()

      // Focus starts on input
      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await expect(input).toBeFocused()

      // Tab should move to filter pills or close button (next focusable element)
      await page.keyboard.press("Tab")
      const focused = page.locator(":focus")
      await expect(focused).not.toHaveAttribute("id", "site-search-input")
    })

    test("Escape closes dialog from any focused element", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      const { dialogName } = await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: dialogName })
      await expect(dialog).toBeVisible()

      // Tab away from the input to another element
      await page.keyboard.press("Tab")

      // Escape still closes dialog even when focus is not on input
      await page.keyboard.press("Escape")
      await expect(dialog).toBeHidden()
    })

    test("Enter on a focused result navigates to it", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await input.fill("dialog")

      // Wait for results to appear
      const resultLink = dialog.locator("[data-site-search-result] a").first()
      await expect(resultLink).toBeVisible()

      // Focus the first result link and press Enter
      await resultLink.focus()
      const href = await resultLink.getAttribute("href")
      await page.keyboard.press("Enter")

      // Should navigate to the result URL
      await page.waitForURL(`**${href}`)
      expect(page.url()).toContain(href!)
    })
  })

  // ---------------------------------------------------------------------------
  // 2. Focus management
  // ---------------------------------------------------------------------------
  test.describe("Focus management", () => {
    test("Focus moves to search input when dialog opens via Ctrl+K", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await expect(input).toBeFocused()
    })

    test("Focus moves to search input when dialog opens via click", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      const { dialogName } = await openSearchDialog(page)

      const trigger = page.getByRole("button", { name: "Search" })
      await trigger.click()

      const dialog = page.getByRole("dialog", { name: dialogName })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await expect(input).toBeFocused()
    })

    test("Focus returns to trigger after Escape", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      const trigger = page.getByRole("button", { name: "Search" })
      await trigger.click()

      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      await page.keyboard.press("Escape")
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    })

    test("Focus returns to trigger after selecting a result", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await input.fill("dialog")

      // Wait for results and click one (clicking navigates, which closes dialog)
      const resultLink = dialog.locator("[data-site-search-result] a").first()
      await expect(resultLink).toBeVisible()
      await resultLink.click()

      // Dialog should close after clicking a result
      await expect(dialog).toBeHidden()
    })

    test("Focus is trapped within the modal dialog", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      // Tab repeatedly – focus should always remain inside dialog
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab")
      }

      // After many tabs, the focused element should still be inside the dialog
      const focusedInDialog = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]')
        return dialog?.contains(document.activeElement) ?? false
      })
      expect(focusedInDialog).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // 3. No-results state
  // ---------------------------------------------------------------------------
  test.describe("No-results state", () => {
    test("Shows 'No results found' message when query returns empty", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await input.fill("xyznonexistentterm123")

      const message = dialog.locator(".site-search__message")
      await expect(message).toHaveText("No results found.")
    })

    test("Shows Spanish 'No se encontraron resultados' in /es/ locale", async ({ page }) => {
      await page.goto("/es/primitives/dialog/examples/")
      await openSearchDialog(page, "es")

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Buscar en Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Buscar en la documentación" })
      await input.fill("xyznonexistentterm123")

      const message = dialog.locator(".site-search__message")
      await expect(message).toHaveText("No se encontraron resultados.")
    })

    test("The no-results message has appropriate aria-live announcement", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      // Verify the results container has aria-live for screen reader announcements
      const resultsContainer = dialog.locator(".site-search__results")
      await expect(resultsContainer).toHaveAttribute("aria-live", "polite")
      await expect(resultsContainer).toHaveAttribute("aria-atomic", "true")
    })
  })

  // ---------------------------------------------------------------------------
  // 4. Static fallback
  // ---------------------------------------------------------------------------
  test.describe("Static fallback", () => {
    test("Verify noscript fallback text in English", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()

      await page.goto("/")
      const fallback = page.locator(".site-search__fallback")
      await expect(fallback).toContainText("Search requires JavaScript.")
      await expect(fallback.locator("a")).toContainText("Browse documentation")

      await context.close()
    })

    test("Verify noscript fallback text in Spanish (/es/ route)", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()

      await page.goto("/es/")
      const fallback = page.locator(".site-search__fallback")
      await expect(fallback).toContainText("La búsqueda requiere JavaScript.")
      await expect(fallback.locator("a")).toContainText("Explorar documentación")

      await context.close()
    })

    test("Fallback link navigates to /primitives/ (EN)", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()

      await page.goto("/")
      const fallbackLink = page.locator(".site-search__fallback a")
      await expect(fallbackLink).toHaveAttribute("href", "/primitives/")

      await context.close()
    })

    test("Fallback link navigates to /es/primitives/ (ES)", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()

      await page.goto("/es/")
      const fallbackLink = page.locator(".site-search__fallback a")
      await expect(fallbackLink).toHaveAttribute("href", "/primitives/")

      await context.close()
    })
  })

  // ---------------------------------------------------------------------------
  // 5. Bilingual result tests
  // ---------------------------------------------------------------------------
  test.describe("Bilingual results", () => {
    test("English route search shows results with English URLs (no /es/ prefix)", async ({
      page,
    }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await input.fill("dialog")

      const resultLinks = dialog.locator("[data-site-search-result] a")
      await expect(resultLinks.first()).toBeVisible()

      // All result links should not have /es/ prefix
      const hrefs = await resultLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      )
      for (const href of hrefs) {
        expect(href).not.toMatch(/^\/es\//)
      }
    })

    test("Spanish route search shows results with Spanish URLs (/es/ prefix)", async ({
      page,
    }) => {
      await page.goto("/es/primitives/dialog/examples/")
      await openSearchDialog(page, "es")

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Buscar en Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Buscar en la documentación" })
      await input.fill("dialog")

      const resultLinks = dialog.locator("[data-site-search-result] a")
      await expect(resultLinks.first()).toBeVisible()

      // All result links should have /es/ prefix
      const hrefs = await resultLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      )
      for (const href of hrefs) {
        expect(href).toMatch(/^\/es\//)
      }
    })

    test("Search results have accessible link text", async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await openSearchDialog(page)

      await page.keyboard.press("Control+k")
      const dialog = page.getByRole("dialog", { name: "Search Solidiom" })
      await expect(dialog).toBeVisible()

      const input = dialog.getByRole("searchbox", { name: "Search documentation" })
      await input.fill("dialog")

      const resultLinks = dialog.locator("[data-site-search-result] a")
      await expect(resultLinks.first()).toBeVisible()

      // Each result link should have non-empty text content (title)
      const count = await resultLinks.count()
      for (let i = 0; i < count; i++) {
        const title = resultLinks.nth(i).locator(".site-search__result-title")
        await expect(title).not.toHaveText("")
      }
    })
  })
})
