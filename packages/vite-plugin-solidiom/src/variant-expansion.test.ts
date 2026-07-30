/**
 * Behavioral coverage for static variant expansion (v1.2), including compound
 * variants. Before RECIPE-002, `extractVariantDefs` had no `compoundVariants` branch,
 * so a generated cva() call with compound variants would statically expand with the
 * compound's classes silently missing — a correctness bug, not a build failure.
 */
import { describe, expect, it } from "vitest"
import { solidiomPlugin } from "./index"

function transform(code: string): string | null {
  const plugin = solidiomPlugin({ variantExpansion: true })
  const result = (plugin.transform as (code: string, id: string) => { code: string } | null)(
    code,
    "test.tsx",
  )
  return result?.code ?? null
}

describe("static variant expansion — single-axis variants", () => {
  it("inlines a call with only string-literal args", () => {
    const code = `
const buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: { default: "solidiom-btn--default", destructive: "solidiom-btn--destructive" },
    size: { md: "solidiom-btn--md", sm: "solidiom-btn--sm" }
  },
  defaultVariants: { variant: "default", size: "md" }
})
const cls = buttonVariants({ variant: "destructive", size: "sm" })
`
    const result = transform(code)
    expect(result).toContain('"solidiom-btn solidiom-btn--destructive solidiom-btn--sm"')
  })

  it("falls back to defaults for an omitted axis", () => {
    const code = `
const buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: { default: "solidiom-btn--default", destructive: "solidiom-btn--destructive" },
    size: { md: "solidiom-btn--md", sm: "solidiom-btn--sm" }
  },
  defaultVariants: { variant: "default", size: "md" }
})
const cls = buttonVariants({ variant: "destructive" })
`
    const result = transform(code)
    expect(result).toContain('"solidiom-btn solidiom-btn--destructive solidiom-btn--md"')
  })

  it("leaves a call with a dynamic argument untouched", () => {
    const code = `
const buttonVariants = cva("solidiom-btn", {
  variants: { size: { md: "solidiom-btn--md", sm: "solidiom-btn--sm" } },
  defaultVariants: { size: "md" }
})
const cls = buttonVariants({ size: props.size })
`
    expect(transform(code)).toBeNull()
  })
})

describe("static variant expansion — compound variants", () => {
  const BUTTON_WITH_COMPOUNDS = `
const buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: { ghost: "solidiom-btn--ghost", link: "solidiom-btn--link" },
    size: { icon: "solidiom-btn--icon", md: "solidiom-btn--md" }
  },
  defaultVariants: { variant: "ghost", size: "md" },
  compoundVariants: [
    { variant: "ghost", size: "icon", class: "solidiom-btn--ghost-icon" },
    { variant: "link", size: "md", class: "solidiom-btn--link-md" }
  ]
})
`

  it("appends a compound's class when every condition in `when` matches the call", () => {
    const code = `${BUTTON_WITH_COMPOUNDS}\nconst cls = buttonVariants({ variant: "ghost", size: "icon" })\n`
    const result = transform(code)
    expect(result).toContain(
      '"solidiom-btn solidiom-btn--ghost solidiom-btn--icon solidiom-btn--ghost-icon"',
    )
  })

  it("does not append a compound's class when only some conditions match", () => {
    const code = `${BUTTON_WITH_COMPOUNDS}\nconst cls = buttonVariants({ variant: "ghost", size: "md" })\n`
    const result = transform(code)
    const clsLine = result?.split("\n").find((line) => line.startsWith("const cls ="))
    expect(clsLine).toBe('const cls = "solidiom-btn solidiom-btn--ghost solidiom-btn--md"')
  })

  it("resolves a compound against a default-filled axis, not just explicit call args", () => {
    // variant defaults to "ghost"; only size is passed explicitly.
    const code = `${BUTTON_WITH_COMPOUNDS}\nconst cls = buttonVariants({ size: "icon" })\n`
    const result = transform(code)
    expect(result).toContain("solidiom-btn--ghost-icon")
  })

  it("supports cva's className alias for the compound's class field", () => {
    const code = `
const buttonVariants = cva("solidiom-btn", {
  variants: { variant: { ghost: "solidiom-btn--ghost" }, size: { icon: "solidiom-btn--icon" } },
  defaultVariants: { variant: "ghost", size: "icon" },
  compoundVariants: [
    { variant: "ghost", size: "icon", className: "solidiom-btn--ghost-icon" }
  ]
})
const cls = buttonVariants({ variant: "ghost", size: "icon" })
`
    const result = transform(code)
    expect(result).toContain("solidiom-btn--ghost-icon")
  })
})
