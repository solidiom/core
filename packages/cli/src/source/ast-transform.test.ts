import { describe, it, expect } from "vitest"
import { rewriteImportsAst } from "../source/ast-transform"

describe("source/ast-transform", () => {
  describe("rewriteImportsAst", () => {
    it("rewrites barrel @solidiom/runtime import to relative path", () => {
      const content = `import { createSignal } from "@solidiom/runtime"\nexport function Dialog() {}`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/index")
      expect(result.code).not.toContain("@solidiom/runtime")
      expect(result.rewritten).toHaveLength(1)
    })

    it("rewrites subpath import to relative path", () => {
      const content = `import { collection } from "@solidiom/runtime/collection/collection"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/select/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/collection/collection")
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("rewrites type imports", () => {
      const content = `import type { PresencePhase, DisclosureReason } from "@solidiom/runtime"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/context.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("rewrites re-exports", () => {
      const content = `export { PresencePhase } from "@solidiom/runtime"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/index")
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("handles deeply nested file paths", () => {
      const content = `import { X } from "@solidiom/runtime"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/sub/nested/deep.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("../../../../_runtime/index")
    })

    it("returns unchanged if no @solidiom/runtime imports", () => {
      const content = `import { createSignal } from "solid-js"\nexport function Button() {}`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/button/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(false)
      expect(result.code).toBe(content)
    })

    it("handles multiple imports from @solidiom/runtime", () => {
      const content = [
        `import { createDisclosureState } from "@solidiom/runtime"`,
        `import { collection } from "@solidiom/runtime/collection/collection"`,
        `import { rovingFocus } from "@solidiom/runtime/collection/roving-focus"`,
      ].join("\n")
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/tabs/tabs.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.rewritten).toHaveLength(3)
      expect(result.code).not.toContain("@solidiom/runtime")
    })
  })
})
