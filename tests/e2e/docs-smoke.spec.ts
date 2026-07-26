import { test, expect } from "@playwright/test"
import { createConsoleCollector } from "./utils/console-assertions"

/**
 * Docs app smoke tests — verifies key routes load without errors.
 *
 * Each test asserts:
 * 1. Page loads and renders expected content
 * 2. No console errors (especially Solid 2 reactivity crashes)
 */

test.describe("Docs app navigation", () => {
  test("home page loads with primitive list", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Build your component library")
    await expect(page.locator("[role='link'], a").first()).toBeVisible()

    console.assertClean()
  })

  test("navigates to a primitive page", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/dialog")
    await expect(page.locator("h1")).toContainText("Dialog")
    await expect(page.locator("text=Usage")).toBeVisible()

    console.assertClean()
  })

  test("listbox page renders without REACTIVE_WRITE errors", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/listbox")
    await expect(page.locator("h1")).toContainText("Listbox")
    await expect(page.locator("[role='listbox']")).toBeVisible()

    console.assertNoReactivityErrors()
    console.assertNoErrors()
  })

  test("popover page renders without STRICT_READ_UNTRACKED warnings", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/popover")
    await expect(page.locator("h1")).toContainText("Popover")

    console.assertNoUntrackedWarnings()
    console.assertNoErrors()
  })

  test("performance page loads", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/performance")
    await expect(page.locator("h1")).toBeVisible()

    console.assertClean()
  })

  test("SPA navigation between routes produces no errors", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Build your component library")

    await page.click("a[href*='/primitives/']")
    await expect(page.locator("h1")).toBeVisible()

    await page.goBack()
    await expect(page.locator("h1")).toContainText("Build your component library")

    console.assertClean()
  })
})
