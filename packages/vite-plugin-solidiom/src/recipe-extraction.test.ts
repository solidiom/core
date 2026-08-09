/**
 * Behavioral coverage for static recipe extraction (v1.1).
 * Verifies that static cva() calls are replaced with pre-computed lookup maps.
 */
import { describe, expect, it } from "vitest"
import { solidiomPlugin } from "./index"

function transform(code: string): string | null {
  const plugin = solidiomPlugin({ recipeExtraction: true })
  const result = (plugin.transform as (code: string, id: string) => { code: string } | null)(
    code,
    "test.tsx",
  )
  return result?.code ?? null
}

describe("static recipe extraction", () => {
  it("replaces a static cva() call with inlined constants", () => {
    const code = `
import { cva } from "class-variance-authority"
const buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: { default: "solidiom-btn--default", destructive: "solidiom-btn--destructive" },
    size: { md: "solidiom-btn--md", sm: "solidiom-btn--sm" }
  },
  defaultVariants: { variant: "default", size: "md" }
})
`
    const result = transform(code)
    expect(result).not.toBeNull()
    expect(result).toContain("__solidiom_buttonVariants_base")
    expect(result).toContain("__solidiom_buttonVariants_map")
    expect(result).toContain("__solidiom_buttonVariants_defaults")
  })

  it("removes the cva import when all calls are replaced", () => {
    const code = `
import { cva } from "class-variance-authority"
const buttonVariants = cva("solidiom-btn", {
  variants: { size: { md: "md", sm: "sm" } },
  defaultVariants: { size: "md" }
})
`
    const result = transform(code)
    expect(result).not.toContain('from "class-variance-authority"')
  })

  it("preserves type imports from class-variance-authority", () => {
    const code = `
import { cva, type VariantProps } from "class-variance-authority"
const buttonVariants = cva("solidiom-btn", {
  variants: { size: { md: "md", sm: "sm" } },
  defaultVariants: { size: "md" }
})
export type ButtonVariants = VariantProps<typeof buttonVariants>
`
    const result = transform(code)
    expect(result).not.toBeNull()
    expect(result).toContain("VariantProps")
  })

  it("leaves dynamic cva() calls untouched", () => {
    const code = `
import { cva } from "class-variance-authority"
const buttonVariants = cva(baseClass, {
  variants: { size: computedVariants },
  defaultVariants: { size: "md" }
})
`
    const result = transform(code)
    // Dynamic code should not be transformed
    expect(result).toBeNull()
  })

  it("does not transform files without @solidiom or cva", () => {
    const code = `export const hello = "world"`
    const result = transform(code)
    expect(result).toBeNull()
  })
})
