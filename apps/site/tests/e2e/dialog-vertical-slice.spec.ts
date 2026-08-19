import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
  }, theme)
}

async function waitForDialogExample(page: Page): Promise<void> {
  const example = page.locator("[data-dialog-example]")
  await example.scrollIntoViewIfNeeded()
  await expect(example.and(page.locator('[data-hydrated="true"]'))).toBeVisible({ timeout: 15_000 })
}

test.describe("VS-001 Dialog vertical slice", () => {
  test("renders the complete English and Spanish static route set with install metadata", async ({
    page,
  }) => {
    for (const [locale, prefix, installLabel] of [
      ["en", "", "Install"],
      ["es", "/es", "Instalar"],
    ] as const) {
      for (const view of ["", "/api", "/examples", "/accessibility"] as const) {
        const response = await page.goto(`${prefix}/primitives/dialog${view}/`)
        expect(response?.status()).toBe(200)
        await expect(page.locator("html")).toHaveAttribute("lang", locale)
        await expect(page.locator(".primitive-tabs")).toBeVisible()
      }

      await page.goto(`${prefix}/primitives/dialog/`)
      await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible()
      await expect(page.getByText(installLabel, { exact: true })).toBeVisible()
      await expect(
        page.getByText("pnpm add @solidiom/dialog", { exact: true }).first(),
      ).toBeVisible()
      await page.goto(`${prefix}/primitives/dialog/examples/`)
      await expect(
        page.getByText(locale === "en" ? "View source" : "Ver código fuente"),
      ).toBeVisible()
      await page.goto(`${prefix}/primitives/dialog/accessibility/`)
      await expect(
        page.getByText(locale === "en" ? "Axe scan summary" : "Resumen del análisis axe"),
      ).toBeVisible()
      await expect(page.getByText("axe-dialog-scan-v1")).toBeVisible()
    }
  })

  test("includes the English and Spanish Dialog documentation in Pagefind", async ({ page }) => {
    for (const [url, query] of [
      ["/primitives/dialog/examples/", "confirmation"],
      ["/es/primitives/dialog/examples/", "confirmación"],
    ] as const) {
      await page.goto(url)
      const urls = await page.evaluate(async (term) => {
        const moduleUrl = "/pagefind/pagefind.js"
        const pagefind = (await import(/* @vite-ignore */ moduleUrl)) as {
          search: (query: string) => Promise<{
            results: Array<{ data: () => Promise<{ url: string }> }>
          }>
        }
        const search = await pagefind.search(term)
        const data = await Promise.all(search.results.map((result) => result.data()))
        return data.map((result) => result.url)
      }, query)
      expect(urls.some((result) => result.includes("/primitives/dialog/examples/"))).toBe(true)
    }
  })

  test("opens, dismisses, and restores focus for the localized live example", async ({ page }) => {
    await page.goto("/primitives/dialog/examples/")
    const trigger = page.getByRole("button", { name: "Open confirmation dialog" })
    await expect(trigger).toBeVisible()
    await waitForDialogExample(page)
    await trigger.click()

    const dialog = page.getByRole("dialog", { name: "Delete workspace?" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute("aria-modal", "true")
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await trigger.press("Enter")
    await expect(dialog).toBeVisible()
    await page.getByRole("button", { name: "Cancel" }).click()
    await expect(dialog).toBeHidden()

    await page.goto("/es/primitives/dialog/examples/")
    const spanishTrigger = page.getByRole("button", { name: "Abrir diálogo de confirmación" })
    await waitForDialogExample(page)
    await spanishTrigger.click()
    await expect(page.getByRole("dialog", { name: "¿Eliminar espacio de trabajo?" })).toBeVisible()
    await page.getByRole("button", { name: "Cancelar" }).click()
    await expect(page.getByRole("dialog")).toBeHidden()
  })

  for (const theme of ["light", "dark"] as const) {
    test(`${theme} Dialog example has no serious or critical Axe violations`, async ({ page }) => {
      await page.goto("/primitives/dialog/examples/")
      await setTheme(page, theme)
      await waitForDialogExample(page)
      await page.getByRole("button", { name: "Open confirmation dialog" }).click()
      const results = await new AxeBuilder({ page })
        .include("[data-dialog-example]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      const blocking = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      )
      expect(blocking).toEqual([])
    })
  }
})
