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
