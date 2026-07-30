import { expect, test } from "@playwright/test"

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
