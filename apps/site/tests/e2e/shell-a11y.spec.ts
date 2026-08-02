import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

type Rgb = [number, number, number]

function parseColor(value: string): Rgb {
  const normalized = value.trim().toLowerCase()
  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1)
    const expanded = hex.length === 3 ? [...hex].map((part) => `${part}${part}`).join("") : hex
    return [
      Number.parseInt(expanded.slice(0, 2), 16),
      Number.parseInt(expanded.slice(2, 4), 16),
      Number.parseInt(expanded.slice(4, 6), 16),
    ]
  }

  const channels = normalized
    .match(/\d+(?:\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number)
  if (!channels || channels.length !== 3) throw new Error(`Unsupported CSS color: ${value}`)
  return channels as Rgb
}

function relativeLuminance([red, green, blue]: Rgb): number {
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(parseColor(foreground))
  const backgroundLuminance = relativeLuminance(parseColor(background))
  const [lighter, darker] = [foregroundLuminance, backgroundLuminance].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
  }, theme)
}

async function visibleFocusableOrder(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        if (element.classList.contains("skip-link")) return "skip"
        if (element.classList.contains("site-header__brand")) return "brand"
        if (element.classList.contains("theme-toggle")) return "theme"
        if (element.classList.contains("site-header__hamburger-button")) return "menu"
        if (element.closest("footer")) return "footer"
        if (element.closest("nav")) return "navigation"
        if (element.closest("main")) return "main"
        return "other"
      })
  })
}

/** SITE-011: shell accessibility verification across the configured engines. */
test.describe("Shell landmarks", () => {
  test("has banner, main, and contentinfo landmarks in correct order", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("banner")).toHaveCount(2)
    await expect(page.getByRole("main")).toHaveCount(1)
    await expect(page.getByRole("contentinfo")).toHaveCount(1)

    const order = await page.evaluate(() => {
      const header = document.querySelector("header")
      const main = document.querySelector("main")
      const footer = document.querySelector("footer")
      return (
        !!header &&
        !!main &&
        !!footer &&
        header.compareDocumentPosition(main) === Node.DOCUMENT_POSITION_FOLLOWING &&
        main.compareDocumentPosition(footer) === Node.DOCUMENT_POSITION_FOLLOWING
      )
    })
    expect(order).toBe(true)
  })

  test("exposes labeled primary and community navigation landmarks", async ({ page }) => {
    await page.goto("/")
    const hamburger = page.locator(".site-header__hamburger-button").first()
    const drawerPrimary = page.locator('nav.site-header__drawer-nav[aria-label="Primary"]')
    const community = page.locator('footer nav[aria-label="Community"]')

    if (await hamburger.isVisible()) {
      await expect
        .poll(async () => {
          if ((await hamburger.getAttribute("data-state")) !== "open") await hamburger.click()
          return hamburger.getAttribute("data-state")
        })
        .toBe("open")
      await expect(drawerPrimary).toBeVisible()
      await expect(drawerPrimary.locator("a").first()).toBeVisible()
    } else {
      await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(1)
    }

    await expect(community).toHaveCount(1)
  })

  test("does not nest equivalent page landmarks", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("main main, header header, footer footer")).toHaveCount(0)
  })
})

test.describe("Keyboard and focus", () => {
  test("keeps visible shell controls in a logical DOM tab order", async ({ page }) => {
    await page.goto("/")
    const order = await visibleFocusableOrder(page)

    expect(order[0]).toBe("skip")
    expect(order.indexOf("brand")).toBeGreaterThan(order.indexOf("skip"))
    expect(order.indexOf("theme")).toBeGreaterThan(order.indexOf("brand"))
    expect(order.indexOf("footer")).toBeGreaterThan(order.indexOf("theme"))
    // On desktop: navigation before theme. On mobile: navigation hidden or after theme (in drawer).
    expect(
      order.indexOf("navigation") === -1 ||
        order.indexOf("navigation") < order.indexOf("theme") ||
        order.indexOf("menu") > order.indexOf("theme"),
    ).toBe(true)
    expect(order.indexOf("menu") === -1 || order.indexOf("menu") > order.indexOf("theme")).toBe(
      true,
    )
  })

  test("has no positive tabindex and can reach the footer without a focus trap", async ({
    page,
  }, testInfo) => {
    await page.goto("/")
    const positiveTabindex = await page
      .locator('[tabindex]:not([tabindex="-1"])')
      .evaluateAll(
        (elements) =>
          elements.filter(
            (element) => Number.parseInt(element.getAttribute("tabindex") ?? "0", 10) > 0,
          ).length,
      )
    expect(positiveTabindex).toBe(0)

    const footerLink = page.locator("footer a").first()
    if (["webkit", "mobile-safari"].includes(testInfo.project.name)) {
      // Playwright cannot enable Safari's optional full-keyboard-access
      // preference; direct focus still verifies that footer controls are not
      // inert or trapped by application code.
      await footerLink.focus()
      await expect(footerLink).toBeFocused()
      return
    }

    for (let index = 0; index < 30; index += 1) {
      await page.keyboard.press("Tab")
      if (await footerLink.evaluate((element) => document.activeElement === element)) return
    }
    throw new Error("Tab navigation did not reach a footer link.")
  })

  test("opens and closes the mobile drawer with keyboard focus restoration", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    const trigger = page.locator(".site-header__hamburger-button").first()
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.locator(".site-header__drawer-content")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.locator(".site-header__drawer-content")).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe("Zoom, reflow, and motion", () => {
  for (const [label, viewport] of [
    ["200%", { width: 640, height: 480 }],
    ["400%", { width: 320, height: 568 }],
  ] as const) {
    test(`${label} equivalent reflow has no shell-region horizontal overflow`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto("/")
      const overflows = await page.evaluate(() =>
        ["header", "main", "footer"].some((selector) => {
          const element = document.querySelector<HTMLElement>(selector)
          return !!element && element.scrollWidth > element.clientWidth
        }),
      )
      expect(overflows).toBe(false)
      await expect(page.getByRole("main")).toBeVisible()
    })
  }

  test("removes skip-link and theme-control motion when requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const transitions = await page.evaluate(() => [
      getComputedStyle(document.querySelector(".skip-link")!).transition,
      getComputedStyle(document.querySelector(".theme-toggle")!).transition,
    ])
    expect(transitions.every((transition) => /none|0s|^$/.test(transition))).toBe(true)
  })
})

test.describe("Computed contrast and automated accessibility", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`${theme} shell text and focus indicators meet contrast thresholds`, async ({ page }) => {
      await page.goto("/")
      await setTheme(page, theme)

      const colors = await page.evaluate(() => {
        const background = getComputedStyle(document.body).backgroundColor
        return {
          background,
          body: getComputedStyle(document.body).color,
          brand: getComputedStyle(document.querySelector(".site-header__brand")!).color,
          muted: getComputedStyle(document.querySelector(".site-footer__copy")!).color,
          focus: getComputedStyle(document.documentElement).getPropertyValue("--focus-ring"),
        }
      })

      expect(contrastRatio(colors.body, colors.background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(colors.brand, colors.background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(colors.muted, colors.background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(colors.focus, colors.background)).toBeGreaterThanOrEqual(3)
    })

    test(`${theme} shell has no serious or critical Axe violations`, async ({ page }) => {
      await page.goto("/")
      await setTheme(page, theme)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude(".beta-banner, .beta-banner *")
        .exclude(".maturity-badge, .maturity-badge__label, .maturity-badge *")
        .exclude(".home-page__area-link")
        .analyze()
      const blocking = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      )
      expect(blocking).toEqual([])
    })
  }
})

test.describe("Mobile, touch, and forced colors", () => {
  test("mobile controls are visible, distinct, and at least 44×44 CSS pixels", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    const hamburger = page.locator(".site-header__hamburger-button").first()
    await expect(hamburger).toBeVisible()
    await expect(page.locator(".site-header__desktop-nav")).toHaveCSS("display", "none")

    for (const selector of [".site-header__hamburger-button", ".theme-toggle"]) {
      const size = await page
        .locator(selector)
        .first()
        .evaluate((element) => {
          const rect = element.getBoundingClientRect()
          return { width: rect.width, height: rect.height }
        })
      expect(size.width).toBeGreaterThanOrEqual(44)
      expect(size.height).toBeGreaterThanOrEqual(44)
    }
  })

  test("keeps focus indicators visible in forced-colors mode", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" })
    await page.goto("/")
    await page.locator(".skip-link").focus()
    const outline = await page
      .locator(".skip-link")
      .evaluate((element) => getComputedStyle(element).outlineStyle)
    expect(outline).not.toBe("none")
  })
})
