import { expect, test, type Page } from "@playwright/test"

type ThemePreference = "system" | "light" | "dark"
type EffectiveTheme = "light" | "dark"

declare global {
  interface Window {
    __getSystemThemeListenerCountForTest(): number
    __setSystemThemeForTest(isDark: boolean): void
  }
}

function expectedTheme(preference: ThemePreference, systemTheme: EffectiveTheme): EffectiveTheme {
  return preference === "system" ? systemTheme : preference
}

async function installSystemThemeMediaQuery(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const query = "(prefers-color-scheme: dark)"
    const listeners = new Set<EventListenerOrEventListenerObject>()
    let matches = false

    const mediaQuery = {
      get matches() {
        return matches
      },
      media: query,
      onchange: null,
      addEventListener(type: string, listener: EventListenerOrEventListenerObject | null) {
        if (type === "change" && listener) listeners.add(listener)
      },
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null) {
        if (type === "change" && listener) listeners.delete(listener)
      },
      addListener(listener: EventListenerOrEventListenerObject) {
        listeners.add(listener)
      },
      removeListener(listener: EventListenerOrEventListenerObject) {
        listeners.delete(listener)
      },
      dispatchEvent() {
        return true
      },
    } as MediaQueryList

    window.matchMedia = (value: string) =>
      value === query
        ? mediaQuery
        : ({
            matches: false,
            media: value,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent() {
              return true
            },
          } as MediaQueryList)

    Object.assign(window, {
      __getSystemThemeListenerCountForTest() {
        return listeners.size
      },
      __setSystemThemeForTest(isDark: boolean) {
        matches = isDark
        const event = { matches, media: query } as MediaQueryListEvent
        for (const listener of listeners) {
          if (typeof listener === "function") listener.call(mediaQuery, event)
          else listener.handleEvent(event)
        }
      },
    })
  })
}

async function prepareThemeBootstrap(
  page: Page,
  preference: ThemePreference,
  systemTheme: EffectiveTheme,
): Promise<string[]> {
  const consoleMessages: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleMessages.push(message.text())
    }
  })

  await page.emulateMedia({ colorScheme: systemTheme })
  await page.addInitScript((storedPreference) => {
    localStorage.removeItem("solidiom-theme")
    if (storedPreference !== "system") {
      localStorage.setItem("solidiom-theme", storedPreference)
    }
  }, preference)

  return consoleMessages
}

async function navigateWithBootstrap(
  page: Page,
  preference: ThemePreference,
  systemTheme: EffectiveTheme,
): Promise<string[]> {
  const consoleMessages = await prepareThemeBootstrap(page, preference, systemTheme)
  const expected = expectedTheme(preference, systemTheme)
  const navigation = page.goto("/", { waitUntil: "commit" })
  const root = page.locator("html")

  // The inline bootstrap runs synchronously in <head>. This assertion happens
  // before waiting for DOM content or the client island, proving the root
  // theme is established at the earliest observable document state.
  await expect(root).toHaveAttribute("data-theme-preference", preference)
  await expect(root).toHaveAttribute("data-theme", expected)
  await expect(root).toHaveCSS("color-scheme", expected)
  await navigation
  await expect(page.locator("button.theme-toggle")).toBeVisible()

  return consoleMessages
}

test.describe("SITE-009: Theme toggle", () => {
  test("defaults to the system preference when storage is empty", async ({ page }) => {
    await navigateWithBootstrap(page, "system", "light")
    await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "system")
  })

  test("cycles through system → light → dark → system", async ({ page }) => {
    await navigateWithBootstrap(page, "system", "light")
    const toggle = page.locator("button.theme-toggle")
    const html = page.locator("html")

    // The button is SSR-rendered and visible before hydration attaches the
    // onClick handler. Poll-click until the first transition proves the
    // handler is wired up, then proceed normally.
    await expect(async () => {
      await toggle.click()
      await expect(html).toHaveAttribute("data-theme-preference", "light", { timeout: 500 })
    }).toPass({ timeout: 5000 })
    await expect(html).toHaveAttribute("data-theme", "light")

    await toggle.click()
    await expect(html).toHaveAttribute("data-theme-preference", "dark")
    await expect(html).toHaveAttribute("data-theme", "dark")

    await toggle.click()
    await expect(html).toHaveAttribute("data-theme-preference", "system")
    await expect(html).toHaveAttribute("data-theme", "light")
  })

  test("persists an explicit preference through navigation", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.removeItem("solidiom-theme"))
    await page.reload()

    const toggle = page.locator("button.theme-toggle")
    await toggle.click()
    await toggle.click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    expect(await page.evaluate(() => localStorage.getItem("solidiom-theme"))).toBe("dark")

    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "dark")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  })

  test("tracks operating-system changes only while preference is system", async ({ page }) => {
    await installSystemThemeMediaQuery(page)
    await navigateWithBootstrap(page, "system", "light")
    await expect
      .poll(async () => page.evaluate(() => window.__getSystemThemeListenerCountForTest()))
      .toBe(1)
    const html = page.locator("html")

    await page.evaluate(() => {
      window.__setSystemThemeForTest(true)
    })
    await expect(html).toHaveAttribute("data-theme", "dark")

    await page.locator("button.theme-toggle").click()
    await expect(html).toHaveAttribute("data-theme-preference", "light")
    await page.evaluate(() => {
      window.__setSystemThemeForTest(false)
    })
    await page.evaluate(() => {
      window.__setSystemThemeForTest(true)
    })
    await expect(html).toHaveAttribute("data-theme", "light")
  })

  test("uses a safe light/system fallback when localStorage is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new Error("storage unavailable")
        },
      })
    })
    await page.goto("/")

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "system")
  })

  test("has an accessible state label", async ({ page }) => {
    await navigateWithBootstrap(page, "system", "dark")
    await expect(page.locator("button.theme-toggle")).toHaveAttribute(
      "aria-label",
      "Theme: system (dark). Click to switch to light.",
    )
  })

  for (const systemTheme of ["light", "dark"] as const) {
    for (const preference of ["system", "light", "dark"] as const) {
      test(`applies ${preference} before paint without hydration diagnostics on ${systemTheme} system`, async ({
        page,
      }) => {
        const consoleMessages = await navigateWithBootstrap(page, preference, systemTheme)
        const theme = expectedTheme(preference, systemTheme)

        await expect(page.locator("button.theme-toggle")).toHaveAttribute(
          "aria-label",
          preference === "system"
            ? `Theme: system (${theme}). Click to switch to light.`
            : `Theme: ${preference}. Click to switch to ${preference === "light" ? "dark" : "system"}.`,
        )
        expect(consoleMessages.filter((message) => /hydration|mismatch/i.test(message))).toEqual([])
      })
    }
  }
})
