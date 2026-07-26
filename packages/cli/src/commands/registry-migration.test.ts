import { describe, it, expect } from "vitest"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..", "..", "..", "..")

describe("registry", () => {
  it("registry/index.json is valid and has required fields", () => {
    const registry = JSON.parse(readFileSync(join(ROOT, "registry/index.json"), "utf8"))
    expect(registry.version).toBe(1)
    expect(registry.primitives).toBeInstanceOf(Array)
    expect(registry.adapters).toBeInstanceOf(Array)
    expect(registry.primitives.length).toBeGreaterThanOrEqual(4)
    expect(registry.adapters.length).toBeGreaterThanOrEqual(4)
  })

  it("each primitive in registry references valid packages", () => {
    const registry = JSON.parse(readFileSync(join(ROOT, "registry/index.json"), "utf8"))
    for (const p of registry.primitives) {
      expect(p.name).toBeTruthy()
      expect(p.package).toMatch(/^@solidiom\//)
      expect(p.version).toBeTruthy()
    }
  })

  it("each adapter has capability annotation", () => {
    const registry = JSON.parse(readFileSync(join(ROOT, "registry/index.json"), "utf8"))
    for (const a of registry.adapters) {
      expect(a.capability).toMatch(/.+@\d+/)
    }
  })

  it("per-primitive manifests are valid", () => {
    for (const name of ["dialog", "select"]) {
      const path = join(ROOT, `registry/${name}.json`)
      expect(existsSync(path)).toBe(true)
      const manifest = JSON.parse(readFileSync(path, "utf8"))
      expect(manifest.name).toBe(name)
      expect(manifest.dependencies).toContain("@solidiom/runtime")
      expect(manifest.source.entry).toBeTruthy()
    }
  })
})

describe("migration: shadcn-solid-dialog", () => {
  const transformPath = join(ROOT, "migrations/shadcn-solid-dialog/transform.ts")

  it("transform file exists", () => {
    expect(existsSync(transformPath)).toBe(true)
  })

  it("has metadata with from/to package names", () => {
    const source = readFileSync(transformPath, "utf8")
    expect(source).toContain('"shadcn-solid-dialog"')
    expect(source).toContain('"@shadcn-solid/dialog"')
    expect(source).toContain('"@solidiom/dialog"')
  })

  it("maps all key components in importMap", () => {
    const source = readFileSync(transformPath, "utf8")
    expect(source).toContain('Dialog: "Root"')
    expect(source).toContain('DialogTrigger: "Trigger"')
    expect(source).toContain('DialogContent: "Content"')
    expect(source).toContain('DialogClose: "Close"')
  })

  it("has applyTransform function that returns code and changed", () => {
    const source = readFileSync(transformPath, "utf8")
    expect(source).toContain("export function applyTransform")
    expect(source).toContain("code:")
    expect(source).toContain("changed:")
  })

  it("transform uses ts-morph AST manipulation via applyMigration", () => {
    const source = readFileSync(transformPath, "utf8")
    // The function should use the AST-based applyMigration from @solidiom/cli
    expect(source).toContain("@shadcn-solid/dialog")
    expect(source).toContain("@solidiom/dialog")
    expect(source).toContain("applyMigration")
    expect(source).toContain("MigrationSpec")
  })
})
