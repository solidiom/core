import { describe, it, expect } from "vitest"
import noCrossLayerImport from "./no-cross-layer-import"

// Minimal RuleTester-like harness for unit testing ESLint rules without eslint dep
function runRule(rule: any, code: string, filename: string) {
  const errors: any[] = []
  const context = {
    filename,
    report(err: any) {
      errors.push(err)
    },
  }
  const visitors = rule.create(context)
  // Simulate ImportDeclaration nodes
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g
  let match
  while ((match = importRegex.exec(code)) !== null) {
    const node = { source: { value: match[1] } }
    visitors.ImportDeclaration?.(node)
  }
  return errors
}

describe("no-cross-layer-import", () => {
  it("allows runtime importing from solid-js (external)", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { createSignal } from "solid-js"`,
      "/project/packages/runtime/src/state/controllable-value.ts",
    )
    expect(errors).toHaveLength(0)
  })

  it("blocks runtime importing from a primitive package", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { Dialog } from "@solidiom/dialog"`,
      "/project/packages/runtime/src/overlay/layer-stack.ts",
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.sourceLayer).toBe("layer:runtime")
    expect(errors[0].data.targetLayer).toBe("layer:primitive")
  })

  it("blocks runtime importing from an adapter", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { pos } from "@solidiom/adapter-positioning-floating-ui"`,
      "/project/packages/runtime/src/dom/something.ts",
    )
    expect(errors).toHaveLength(1)
  })

  it("allows primitive importing from runtime", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { createControllableValue } from "@solidiom/runtime"`,
      "/project/packages/dialog/src/index.ts",
    )
    expect(errors).toHaveLength(0)
  })

  it("blocks primitive importing from legacy", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { old } from "@solidiom/legacy-shadcn-solid"`,
      "/project/packages/dialog/src/index.ts",
    )
    expect(errors).toHaveLength(1)
  })

  it("blocks adapter importing from primitives", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { Dialog } from "@solidiom/dialog"`,
      "/project/packages/adapter-positioning-floating-ui/src/index.ts",
    )
    expect(errors).toHaveLength(1)
  })

  it("allows adapter importing from runtime", () => {
    const errors = runRule(
      noCrossLayerImport,
      `import { createStableId } from "@solidiom/runtime"`,
      "/project/packages/adapter-positioning-floating-ui/src/index.ts",
    )
    expect(errors).toHaveLength(0)
  })
})
