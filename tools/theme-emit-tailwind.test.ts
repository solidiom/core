import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { emitThemeTailwind } from "./theme-emit-tailwind"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const TAILWIND_PATH = join(ROOT, "packages/themes/src/tailwind/solidiom-default.css")

describe("emitThemeTailwind", () => {
  it("is up to date relative to the committed output (run pnpm run theme:emit:tailwind if this fails)", async () => {
    const upToDate = await emitThemeTailwind({ check: true })
    expect(upToDate).toBe(true)
  })

  it("emits a single @theme block", () => {
    const css = readFileSync(TAILWIND_PATH, "utf8")
    expect(css).toContain("@theme {")
    expect(css.match(/@theme\s*\{/g)).toHaveLength(1)
  })

  it("resolves every declared name through var(--ui-*, ...)", () => {
    const css = readFileSync(TAILWIND_PATH, "utf8")
    for (const match of css.matchAll(/--(?:color|radius|shadow)-[a-z0-9-]+:\s*([^;]+);/g)) {
      // Prettier may wrap a long var() call across lines, so whitespace (including
      // newlines) can appear between "var(" and "--ui-"; strip it before asserting.
      const collapsed = match[1]!.replace(/\s+/g, " ")
      expect(collapsed).toMatch(/var\(\s*--ui-/)
    }
  })

  it("namespaces radius identities under --radius-* and shadows under --shadow-*", () => {
    const css = readFileSync(TAILWIND_PATH, "utf8")
    expect(css).toContain("--radius-radius:")
    expect(css).toContain("--shadow-shadow-md:")
  })

  it("uses this theme's resolved light-mode value as the var() fallback", () => {
    const css = readFileSync(TAILWIND_PATH, "utf8")
    // solidiom-default's light primary is #6D66F1 (see theme-contract-definitions.ts)
    expect(css).toMatch(/--color-primary:\s*var\(--ui-primary,\s*#6d66f1\)/i)
  })
})
