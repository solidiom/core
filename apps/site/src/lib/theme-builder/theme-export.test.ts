import { describe, expect, it } from "vitest"
import { SOLIDIOM_DEFAULT_THEME } from "../../../../../tools/theme-contract-definitions"
import {
  exportToJson,
  exportToCss,
  exportToTailwind,
  exportToUnoCss,
  exportTheme,
} from "./theme-export"

describe("exportToJson", () => {
  it("produces valid JSON that round-trips", () => {
    const json = exportToJson(SOLIDIOM_DEFAULT_THEME)
    const parsed = JSON.parse(json)
    expect(parsed).toEqual(SOLIDIOM_DEFAULT_THEME)
  })

  it("produces pretty-printed output", () => {
    const json = exportToJson(SOLIDIOM_DEFAULT_THEME)
    expect(json).toContain("\n  ")
  })

  it("contains theme metadata", () => {
    const json = exportToJson(SOLIDIOM_DEFAULT_THEME)
    expect(json).toContain("Solidiom Default")
    expect(json).toContain("solidiom-default")
  })
})

describe("exportToCss", () => {
  it("produces light mode block with correct selector", () => {
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain(':root,\n:root[data-theme="light"]')
  })

  it("produces dark mode block with correct selector", () => {
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain(':root[data-theme="dark"]')
  })

  it("includes theme name comment header", () => {
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("Theme: Solidiom Default")
    expect(css).toContain("solidiom-default")
  })

  it("outputs CSS custom properties for each token", () => {
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("--sol-surface:")
    expect(css).toContain("--sol-primary:")
    expect(css).toContain("--sol-radius:")
  })

  it("resolves ref tokens to their literal values", () => {
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    const lightPrimary = SOLIDIOM_DEFAULT_THEME.modes.light["focus-ring"]
    if (typeof lightPrimary !== "string" && lightPrimary?.ref === "primary") {
      const primaryValue = SOLIDIOM_DEFAULT_THEME.modes.light.primary
      if (typeof primaryValue === "string") {
        expect(css).toContain(`--sol-focus-ring: ${primaryValue}`)
      }
    }
  })
})

describe("exportToTailwind", () => {
  it("produces @theme block", () => {
    const css = exportToTailwind(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("@theme {")
    expect(css).toContain("}")
  })

  it("includes theme name comment header", () => {
    const css = exportToTailwind(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("Theme: Solidiom Default")
  })

  it("namespaces color tokens under --color-", () => {
    const css = exportToTailwind(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("--color-surface:")
    expect(css).toContain("--color-primary:")
  })

  it("namespaces radius tokens under --radius-", () => {
    const css = exportToTailwind(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("--radius-: var(--sol-radius,")
    expect(css).toContain("--radius-radius-sm:")
  })

  it("namespaces shadow tokens under --shadow-", () => {
    const css = exportToTailwind(SOLIDIOM_DEFAULT_THEME)
    expect(css).toContain("--shadow-shadow-sm:")
  })
})

describe("exportToUnoCss", () => {
  it("produces CSS output", () => {
    const css = exportToUnoCss(SOLIDIOM_DEFAULT_THEME)
    expect(typeof css).toBe("string")
    expect(css.length).toBeGreaterThan(0)
  })

  it("delegates to exportToCss", () => {
    const uno = exportToUnoCss(SOLIDIOM_DEFAULT_THEME)
    const css = exportToCss(SOLIDIOM_DEFAULT_THEME)
    expect(uno).toBe(css)
  })
})

describe("exportTheme", () => {
  it("delegates to correct export for each format", () => {
    expect(exportTheme(SOLIDIOM_DEFAULT_THEME, "json")).toBe(
      exportToJson(SOLIDIOM_DEFAULT_THEME),
    )
    expect(exportTheme(SOLIDIOM_DEFAULT_THEME, "css")).toBe(
      exportToCss(SOLIDIOM_DEFAULT_THEME),
    )
    expect(exportTheme(SOLIDIOM_DEFAULT_THEME, "tailwind")).toBe(
      exportToTailwind(SOLIDIOM_DEFAULT_THEME),
    )
    expect(exportTheme(SOLIDIOM_DEFAULT_THEME, "unocss")).toBe(
      exportToUnoCss(SOLIDIOM_DEFAULT_THEME),
    )
  })
})