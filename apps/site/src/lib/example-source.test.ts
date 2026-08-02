import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { extractNamedExport } from "./example-source"

const __dirname = dirname(fileURLToPath(import.meta.url))

describe("extractNamedExport", () => {
  it("extracts a function declaration export, excluding unrelated file content", () => {
    const source = [
      'import { helper } from "./helper"',
      "",
      "const UNRELATED_TABLE = { a: 1 }",
      "",
      "export function Example(props: { name: string }) {",
      "  return <div>{props.name}</div>",
      "}",
      "",
      "function notExported() {}",
    ].join("\n")

    const result = extractNamedExport(source, "Example")
    expect(result.fallback).toBe(false)
    expect(result.code).toContain("export function Example")
    expect(result.code).toContain("return <div>{props.name}</div>")
    expect(result.code).not.toContain("UNRELATED_TABLE")
    expect(result.code).not.toContain("notExported")
    expect(result.code).not.toContain("import { helper }")
  })

  it("extracts a const arrow-function export with nested braces", () => {
    const source = [
      "const other = 1",
      "",
      "export const Example = (props: { open: boolean }) => {",
      "  if (props.open) {",
      "    return <span>open</span>",
      "  }",
      "  return null",
      "}",
      "",
      "export const AnotherExample = () => <div />",
    ].join("\n")

    const result = extractNamedExport(source, "Example")
    expect(result.fallback).toBe(false)
    expect(result.code).toContain("export const Example")
    expect(result.code).toContain("return <span>open</span>")
    expect(result.code).not.toContain("AnotherExample")
  })

  it("extracts a single-line const export", () => {
    const source = ["export const VERSION = 1", "", "export const OTHER = 2"].join("\n")
    const result = extractNamedExport(source, "VERSION")
    expect(result.fallback).toBe(false)
    expect(result.code.trim()).toBe("export const VERSION = 1")
  })

  it("falls back to the full source when the export name is not found", () => {
    const source = "export function Something() {}\n"
    const result = extractNamedExport(source, "DoesNotExist")
    expect(result.fallback).toBe(true)
    expect(result.code).toBe(source)
  })

  it("distinguishes between two same-shaped exports by name", () => {
    const source = [
      "export function First() {",
      '  return "first"',
      "}",
      "",
      "export function Second() {",
      '  return "second"',
      "}",
    ].join("\n")

    const first = extractNamedExport(source, "First")
    const second = extractNamedExport(source, "Second")
    expect(first.code).toContain('"first"')
    expect(first.code).not.toContain('"second"')
    expect(second.code).toContain('"second"')
    expect(second.code).not.toContain('"first"')
  })

  it("extracts DialogExample from the real canonical example file", () => {
    const filePath = join(__dirname, "..", "components", "DialogExample.tsx")
    const source = readFileSync(filePath, "utf8")
    const result = extractNamedExport(source, "DialogExample")

    expect(result.fallback).toBe(false)
    expect(result.code).toContain("export function DialogExample(props: DialogExampleProps)")
    expect(result.code).toContain("<Dialog.Root>")
    expect(result.code).toContain("</Dialog.Root>")
    // The COPY localization table and unrelated top-level content must not
    // leak into the displayed example — it is not part of what a consumer
    // copies to reproduce the behavior.
    expect(result.code).not.toContain("const COPY:")
    expect(result.code).not.toContain('trigger: "Open confirmation dialog"')
  })
})
