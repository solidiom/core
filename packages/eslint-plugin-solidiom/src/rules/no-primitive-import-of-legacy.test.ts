import { describe, it, expect } from "vitest"
import noPrimitiveImportOfLegacy from "./no-primitive-import-of-legacy"

function runRule(rule: any, code: string, filename: string) {
  const errors: any[] = []
  const context = {
    filename,
    report(err: any) {
      errors.push(err)
    },
  }
  const visitors = rule.create(context)
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g
  let match
  while ((match = importRegex.exec(code)) !== null) {
    const node = { source: { value: match[1] } }
    visitors.ImportDeclaration?.(node)
  }
  return errors
}

describe("no-primitive-import-of-legacy", () => {
  const primitiveFile = "/project/packages/dialog/src/index.ts"
  const adapterFile = "/project/packages/adapter-positioning-floating-ui/src/index.ts"
  const runtimeFile = "/project/packages/runtime/src/state/index.ts"

  it("blocks primitive importing from a legacy facade", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { old } from "@solidiom/legacy-shadcn-solid"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.specifier).toBe("@solidiom/legacy-shadcn-solid")
  })

  it("allows primitive importing from runtime", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { createControllableValue } from "@solidiom/runtime"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("allows primitive importing from solid-js", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { createSignal } from "solid-js"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in adapter packages", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { old } from "@solidiom/legacy-shadcn-solid"`,
      adapterFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in runtime packages", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { old } from "@solidiom/legacy-shadcn-solid"`,
      runtimeFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("allows primitive importing from other primitives", () => {
    const errors = runRule(
      noPrimitiveImportOfLegacy,
      `import { Popover } from "@solidiom/popover"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })
})
