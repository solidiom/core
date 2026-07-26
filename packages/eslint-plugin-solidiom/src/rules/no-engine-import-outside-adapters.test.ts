import { describe, it, expect } from "vitest"
import noEngineImportOutsideAdapters from "./no-engine-import-outside-adapters"

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

describe("no-engine-import-outside-adapters", () => {
  it("allows adapter importing @floating-ui/dom", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { computePosition } from "@floating-ui/dom"`,
      "/project/packages/adapter-positioning-floating-ui/src/index.ts",
    )
    expect(errors).toHaveLength(0)
  })

  it("blocks runtime importing @floating-ui/dom", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { computePosition } from "@floating-ui/dom"`,
      "/project/packages/runtime/src/overlay/portal.ts",
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.specifier).toBe("@floating-ui/dom")
    expect(errors[0].data.layer).toBe("layer:runtime")
  })

  it("blocks primitive importing embla-carousel", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import EmblaCarousel from "embla-carousel"`,
      "/project/packages/carousel/src/index.ts",
    )
    expect(errors).toHaveLength(1)
  })

  it("blocks primitive importing @internationalized/date", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { CalendarDate } from "@internationalized/date"`,
      "/project/packages/calendar/src/index.ts",
    )
    expect(errors).toHaveLength(1)
  })

  it("allows tooling importing engines (test-doubles)", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { computePosition } from "@floating-ui/dom"`,
      "/project/packages/test-doubles/src/positioning.ts",
    )
    expect(errors).toHaveLength(0)
  })

  it("allows non-engine imports anywhere", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { createSignal } from "solid-js"`,
      "/project/packages/runtime/src/state/controllable-value.ts",
    )
    expect(errors).toHaveLength(0)
  })

  it("matches subpath imports of engine packages", () => {
    const errors = runRule(
      noEngineImportOutsideAdapters,
      `import { offset } from "@floating-ui/dom/middleware"`,
      "/project/packages/dialog/src/index.ts",
    )
    expect(errors).toHaveLength(1)
  })
})
