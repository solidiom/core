import { expect, test } from "@playwright/test"

test.describe("Theme Builder E2E", () => {
  test("builder page loads with 200", async ({ page }) => {
    const response = await page.goto("/themes/builder/")
    expect(response?.status()).toBe(200)
  })

  test("Spanish builder page loads with 200", async ({ page }) => {
    const response = await page.goto("/es/themes/builder/")
    expect(response?.status()).toBe(200)
  })

  test("builder shell renders", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder-shell")).toBeVisible({ timeout: 10_000 })
  })

  test("editor panel renders", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__panel-editor")).toBeVisible({ timeout: 10_000 })
  })

  test("preview panel renders", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__panel-preview")).toBeVisible({ timeout: 10_000 })
  })

  test("export button exists", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__btn-export")).toBeVisible({ timeout: 10_000 })
  })

  test("share button exists", async ({ page }) => {
    await page.goto("/themes/builder/")
    await expect(page.locator(".theme-builder__btn-share")).toBeVisible({ timeout: 10_000 })
  })

  test("Spanish builder shows localized title", async ({ page }) => {
    await page.goto("/es/themes/builder/")
    await expect(page.locator(".theme-builder__title")).toBeVisible({ timeout: 10_000 })
    await expect(page.locator(".theme-builder__title")).toContainText("Editor de Temas")
  })
})
