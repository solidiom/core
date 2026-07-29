import { expect, test } from "@playwright/test"

test("skip link targets the unique main landmark and transfers focus", async ({ page }) => {
  await page.goto("/")

  const skipLink = page.getByRole("link", { name: "Skip to main content" })
  const focusRoot = page.locator("main#main-content.focus-root")

  await expect(skipLink).toHaveAttribute("href", "#main-content")
  await expect(focusRoot).toHaveCount(1)
  await expect(page.locator("#main-content")).toHaveCount(1)
  await expect(page.getByRole("main")).toHaveCount(1)
  await expect(page.locator("main main")).toHaveCount(0)

  // Explicit focus models keyboard activation across engines. WebKit's
  // browser-level “Tab through all controls” preference is not exposed by
  // Playwright, but an actually focusable skip link must still transfer focus.
  await skipLink.focus()
  await expect(skipLink).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(focusRoot).toBeFocused()
  await expect(page).toHaveURL(/#main-content$/)
})
