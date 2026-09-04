import { describe, expect, it } from "vitest"
import { solidiomPlugin } from "./index"

function transform(
  code: string,
  options: { recipeExtraction?: boolean; variantExpansion?: boolean },
): string | null {
  const plugin = solidiomPlugin(options)
  const result = (plugin.transform as (code: string, id: string) => { code: string } | null)(
    code,
    "adversarial.tsx",
  )
  return result?.code ?? null
}

describe("static transform parser security", () => {
  it("handles repeated malformed cva declarations in bounded time", () => {
    const input = `// solidiom\n${'const a=cva("",{{'.repeat(20_000)}`
    expect(transform(input, { recipeExtraction: true })).toBeNull()
  }, 1_000)

  it("handles long variant-like identifiers in bounded time", () => {
    const longIdentifier = `${"a".repeat(500_000)}Variants`
    const input = `
// solidiom
const buttonVariants = cva("button", {
  variants: { size: { sm: "small" } },
  defaultVariants: { size: "sm" }
})
const value = ${longIdentifier}({ size: "sm" })
`
    expect(transform(input, { variantExpansion: true })).toBeNull()
  }, 1_000)

  it("handles import-like comment content in bounded time", () => {
    const input = `
// solidiom
/* ${"import{{".repeat(20_000)} */
import { cva } from "class-variance-authority"
const buttonVariants = cva("button", {
  variants: { size: { sm: "small" } },
  defaultVariants: { size: "sm" }
})
`
    const result = transform(input, { recipeExtraction: true })
    expect(result).not.toContain('from "class-variance-authority"')
  }, 1_000)

  it("parses nested static configuration without backtracking", () => {
    const input = `
// solidiom
const buttonVariants = cva("button", {
  variants: {
    tone: { neutral: "neutral", danger: "danger" },
    size: { sm: "small", lg: "large" }
  },
  defaultVariants: { tone: "neutral", size: "sm" }
})
const value = buttonVariants({ tone: "danger", size: "lg" })
`
    const result = transform(input, { variantExpansion: true })
    expect(result).toContain('const value = "button danger large"')
  })
})
