import { describe, it, expect } from "vitest"
import { rewriteImportsAst } from "./ast-transform"

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

    it("rewrites default import from @solidiom/runtime", () => {
      const content = `import Button from "@solidiom/runtime"\nexport function Dialog() {}`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/index")
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("handles multiple named and namespace imports from same package", () => {
      const content = [
        `import { createSignal } from "@solidiom/runtime"`,
        `import * as runtime from "@solidiom/runtime"`,
      ].join("\n")
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.rewritten).toHaveLength(2)
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("rewrites side-effect import to relative path", () => {
      const content = `import "@solidiom/runtime/side-effect"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/side-effect")
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("rewrites deeply nested runtime subpath", () => {
      const content = `import { createRoot } from "@solidiom/runtime/reactive/roots"`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/reactive/roots")
      expect(result.code).not.toContain("@solidiom/runtime")
    })

    it("only rewrites solidiom imports alongside non-solidiom imports", () => {
      const content = [
        `import { createSignal } from "@solidiom/runtime"`,
        `import { onMount } from "solid-js"`,
      ].join("\n")
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(true)
      expect(result.code).toContain("_runtime/index")
      expect(result.code).not.toContain("@solidiom/runtime")
      expect(result.code).toContain(`from "solid-js"`)
    })

    it("does not rewrite dynamic import expressions (static-only)", () => {
      const content = `const mod = await import("@solidiom/runtime")`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(false)
      expect(result.code).toBe(content)
    })

    it("handles comment-only file without crashing", () => {
      const content = `// this is just a comment\n/* another comment */`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.ts",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(false)
      expect(result.code).toBe(content)
    })

    it("returns unchanged content for malformed JSX that fails AST parse", () => {
      const content = `<div class="test" {invalid: "jsx"}>`
      const result = rewriteImportsAst({
        content,
        filePath: "/project/src/ui/primitives/dialog/index.tsx",
        runtimeDir: "/project/src/ui/_runtime",
      })
      expect(result.changed).toBe(false)
      expect(result.code).toBe(content)
    })
  })
})
