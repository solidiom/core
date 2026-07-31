import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { emitThemeCss } from "./theme-emit-css"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const CSS_PATH = join(ROOT, "packages/themes/src/css/solidiom-default.css")

describe("emitThemeCss", () => {
  it("is up to date relative to the committed output (run pnpm run theme:emit:css if this fails)", async () => {
    const upToDate = await emitThemeCss({ check: true })
    expect(upToDate).toBe(true)
  })

  it("emits both a light and a dark data-theme block", () => {
    const css = readFileSync(CSS_PATH, "utf8")
    expect(css).toContain(':root[data-theme="light"]')
    expect(css).toContain(':root[data-theme="dark"]')
  })

  it("declares --ui-surface exactly once per mode block despite two identities sharing that spelling", () => {
    const css = readFileSync(CSS_PATH, "utf8")
    const lightBlock = css.split(':root[data-theme="dark"]')[0]!
    const occurrences = lightBlock.match(/--ui-surface:/g) ?? []
    expect(occurrences).toHaveLength(1)
  })

  it("does not declare a token identity with no css namespace spelling", () => {
    const css = readFileSync(CSS_PATH, "utf8")
    // surface-sunken has namespaces.css === null in recipe-contract-tokens.ts
    expect(css).not.toContain("--ui-surface-sunken")
  })

  it("resolves focus-ring's { ref: primary } to the literal primary colour, not the ref object", () => {
    const css = readFileSync(CSS_PATH, "utf8")
    expect(css).not.toContain("[object Object]")
    expect(css).toMatch(/--ui-focus-ring:\s*#[0-9a-f]{6};/i)
  })
})
