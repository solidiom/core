import { describe, it, expect } from "vitest"
import noAdapterJsxAttributes from "./no-adapter-jsx-attributes"

function runRule(rule: any, attrs: string[], filename: string) {
  const errors: any[] = []
  const context = {
    filename,
    report(err: any) {
      errors.push(err)
    },
  }
  const visitors = rule.create(context)
  for (const attr of attrs) {
    const node = { name: { name: attr } }
    visitors.JSXAttribute?.(node)
  }
  return errors
}

describe("no-adapter-jsx-attributes", () => {
  const adapterFile = "/project/packages/adapter-positioning-floating-ui/src/index.tsx"
  const primitiveFile = "/project/packages/dialog/src/content.tsx"

  it("does not enforce in primitive packages", () => {
    const errors = runRule(
      noAdapterJsxAttributes,
      ["data-scope", "role", "aria-label"],
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("blocks data-scope in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["data-scope"], adapterFile)
    expect(errors).toHaveLength(1)
    expect(errors[0].data.attr).toBe("data-scope")
  })

  it("blocks data-part in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["data-part"], adapterFile)
    expect(errors).toHaveLength(1)
  })

  it("blocks data-state in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["data-state"], adapterFile)
    expect(errors).toHaveLength(1)
  })

  it("blocks role in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["role"], adapterFile)
    expect(errors).toHaveLength(1)
  })

  it("blocks aria-* in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["aria-label", "aria-expanded"], adapterFile)
    expect(errors).toHaveLength(2)
  })

  it("blocks class/className in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["class", "className"], adapterFile)
    expect(errors).toHaveLength(2)
  })

  it("blocks custom data-* attributes in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["data-custom-thing"], adapterFile)
    expect(errors).toHaveLength(1)
  })

  it("allows non-semantic attributes in adapter", () => {
    const errors = runRule(noAdapterJsxAttributes, ["style", "id", "ref"], adapterFile)
    expect(errors).toHaveLength(0)
  })
})
