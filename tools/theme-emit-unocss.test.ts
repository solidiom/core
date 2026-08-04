import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { emitThemeUnocss } from "./theme-emit-unocss"
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import {
  SOLIDIOM_THEME_PREFLIGHTS,
  themePreflight,
} from "../packages/unocss-preset/src/generated-theme-preflights"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
void ROOT

describe("emitThemeUnocss", () => {
  it("is up to date relative to the committed output (run pnpm run theme:emit:unocss if this fails)", async () => {
    const upToDate = await emitThemeUnocss({ check: true })
    expect(upToDate).toBe(true)
  })

  // Derived rather than hardcoded. This previously asserted a literal
  // ["solidiom-default"] and silently went stale when PRESET-001..004 added
  // ocean, forest, slate, and aurora — the emitter was correct and the test was
  // not. Comparing against REFERENCE_THEMES keeps it honest as presets are added.
  it("emits one preflight entry per reference theme", () => {
    expect(SOLIDIOM_THEME_PREFLIGHTS.map((entry) => entry.slug).sort()).toEqual(
      Object.keys(REFERENCE_THEMES).sort(),
    )
  })

  it("themePreflight looks up a shipped theme by slug", () => {
    expect(themePreflight("solidiom-default")?.name).toBe("Solidiom Default")
    expect(themePreflight("does-not-exist")).toBeUndefined()
  })

  it("each preflight's css declares both light and dark blocks", () => {
    const preflight = themePreflight("solidiom-default")!
    expect(preflight.css).toContain('[data-theme="light"]')
    expect(preflight.css).toContain('[data-theme="dark"]')
  })

  it("declares --ui-surface exactly once per mode despite the surface/surface-raised collision", () => {
    const preflight = themePreflight("solidiom-default")!
    const lightBlock = preflight.css.split(':root[data-theme="dark"]')[0]!
    const occurrences = lightBlock.match(/--ui-surface:/g) ?? []
    expect(occurrences).toHaveLength(1)
  })
})
