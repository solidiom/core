/**
 * Migration transform tests — verifies AST rewriting, fixture correctness,
 * idempotence, and diagnostic behavior.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { transform } from "./transform"

const FIXTURES_DIR = join(import.meta.dirname ?? __dirname, "fixtures")
const POSITIVE_DIR = join(FIXTURES_DIR, "positive")
const NEGATIVE_DIR = join(FIXTURES_DIR, "negative")

// ─── Positive fixtures ─────────────────────────────────────────────────────

describe("positive fixtures", () => {
  const inputs = readdirSync(POSITIVE_DIR).filter((f) => f.endsWith(".input.tsx"))

  for (const inputFile of inputs) {
    const name = inputFile.replace(".input.tsx", "")
    const outputFile = `${name}.output.tsx`

    it(`transforms ${name}`, () => {
      const input = readFileSync(join(POSITIVE_DIR, inputFile), "utf8")
      const expected = readFileSync(join(POSITIVE_DIR, outputFile), "utf8")

      const result = transform(input, { filePath: inputFile })
      expect(result.changed).toBe(true)
      expect(result.code.trim()).toBe(expected.trim())
    })

    it(`${name} is idempotent`, () => {
      const input = readFileSync(join(POSITIVE_DIR, inputFile), "utf8")
      const firstPass = transform(input, { filePath: inputFile })
      const secondPass = transform(firstPass.code, { filePath: inputFile })

      // Second pass should produce no changes
      expect(secondPass.changed).toBe(false)
      expect(secondPass.code).toBe(firstPass.code)
    })
  }
})

// ─── Negative fixtures ─────────────────────────────────────────────────────

describe("negative fixtures", () => {
  const inputs = readdirSync(NEGATIVE_DIR).filter((f) => f.endsWith(".input.tsx"))

  for (const inputFile of inputs) {
    const name = inputFile.replace(".input.tsx", "")

    it(`produces diagnostics for ${name}`, () => {
      const input = readFileSync(join(NEGATIVE_DIR, inputFile), "utf8")
      const result = transform(input, { filePath: inputFile })

      // Should still transform what it can
      expect(result.changed).toBe(true)
      // But should produce warnings/errors for unsupported parts
      expect(result.diagnostics.length).toBeGreaterThan(0)
      expect(
        result.diagnostics.some(
          (d) => d.severity === "warning" || d.severity === "error",
        ),
      ).toBe(true)
    })
  }
})

// ─── No-op for non-dialog files ────────────────────────────────────────────

describe("no-op behavior", () => {
  it("does not transform files without shadcn-solid dialog imports", () => {
    const source = `
import { createSignal } from "solid-js"
export function App() { return <div>Hello</div> }
`
    const result = transform(source)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(source)
    expect(result.diagnostics).toHaveLength(0)
  })

  it("does not transform @solidiom/dialog imports (already migrated)", () => {
    const source = `
import { Root, Trigger, Content } from "@solidiom/dialog"
export function App() { return <Root><Trigger>Open</Trigger></Root> }
`
    const result = transform(source)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(source)
  })
})

// ─── Dry-run / patch-only behavior ─────────────────────────────────────────

describe("dry-run behavior", () => {
  it("reports changes without mutating in dry-run mode", () => {
    const source = readFileSync(
      join(POSITIVE_DIR, "namespace-usage.input.tsx"),
      "utf8",
    )
    const result = transform(source, { dryRun: true })
    // dry-run still returns the transformed code for diffing,
    // but the caller is responsible for not writing it
    expect(result.changed).toBe(true)
    expect(result.code).not.toBe(source)
  })
})
