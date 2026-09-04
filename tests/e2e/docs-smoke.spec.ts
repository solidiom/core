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
    await expect(page.locator(".hero__title")).toContainText("Accessible behavior")
    await expect(page.locator("a[href='/primitives/']").first()).toBeVisible()

    console.assertNoErrors()
    console.assertNoReactivityErrors()
  })

  test("navigates to a primitive page", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/dialog/")
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Dialog", exact: true }),
    ).toBeVisible()
    await expect(page.locator(".primitive-tabs")).toBeVisible()

    console.assertNoErrors()
    console.assertNoReactivityErrors()
  })

  test("listbox page renders without REACTIVE_WRITE errors", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/listbox/")
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Listbox", exact: true }),
    ).toBeVisible()
    await expect(page.locator("[role='listbox']")).toBeVisible()

    console.assertNoReactivityErrors()
    console.assertNoErrors()
  })

  test("popover page renders without STRICT_READ_UNTRACKED warnings", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/primitives/popover/")
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Popover", exact: true }),
    ).toBeVisible()

    console.assertNoUntrackedWarnings()
    console.assertNoErrors()
  })

  test("performance page loads", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/performance/")
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Performance", exact: true }),
    ).toBeVisible()

    console.assertNoErrors()
    console.assertNoReactivityErrors()
  })

  test("SPA navigation between routes produces no errors", async ({ page }) => {
    const console = createConsoleCollector(page)

    await page.goto("/")
    await expect(page.locator(".hero__title")).toContainText("Accessible behavior")

    await page.click("a[href='/primitives/']")
    await expect(page.getByRole("main").getByRole("heading").first()).toBeVisible()

    await page.goBack()
    await expect(page.locator(".hero__title")).toContainText("Accessible behavior")

    console.assertNoErrors()
    console.assertNoReactivityErrors()
  })
})
