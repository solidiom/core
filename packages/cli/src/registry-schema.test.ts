import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, writeFileSync, existsSync, unlinkSync } from "node:fs"
import { join } from "node:path"
import {
  readRegistryIndex,
  readRegistryManifest,
  RegistrySchemaError,
  DELIVERABLES,
  STYLING_PROFILES,
} from "./registry-schema"

const ROOT = join(import.meta.dirname, "..", "..", "..")
const REGISTRY_DIR = join(ROOT, "registry")

describe("registryManifestSchema round-trip (CLI-002)", () => {
  it("preserves every field the generator emits — no silent stripping", () => {
    const raw = JSON.parse(readFileSync(join(REGISTRY_DIR, "button.json"), "utf8")) as Record<
      string,
      unknown
    >
    const parsed = readRegistryManifest(join(REGISTRY_DIR, "button.json"))

    // Every top-level key present in the generator's raw output must survive
    // schema parsing. A field silently dropped by zod would pass parsing
    // (extra keys are just stripped) but disappear from `parsed` — this
    // assertion catches that class of regression directly.
    for (const key of Object.keys(raw)) {
      expect(parsed).toHaveProperty(key)
    }
  })

  it("validates all 52 committed primitive manifests", () => {
    const files = readdirSync(REGISTRY_DIR).filter(
      (f) => f.endsWith(".json") && f !== "index.json",
    )
    expect(files.length).toBeGreaterThan(0)

    for (const file of files) {
      expect(() => readRegistryManifest(join(REGISTRY_DIR, file))).not.toThrow()
    }
  })

  it("exposes deliverables as a sorted, deduplicated array containing 'primitive'", () => {
    const manifest = readRegistryManifest(join(REGISTRY_DIR, "button.json"))
    expect(manifest.deliverables).toContain("primitive")
    expect(manifest.deliverables).toEqual([...manifest.deliverables].sort())
    expect(new Set(manifest.deliverables).size).toBe(manifest.deliverables.length)
  })

  it("rejects a manifest missing a newly required field (e.g. documentation)", () => {
    const raw = JSON.parse(readFileSync(join(REGISTRY_DIR, "button.json"), "utf8"))
    delete raw.documentation

    const tmpPath = join(ROOT, "registry", ".tmp-invalid-manifest.json")
    try {
      writeFileSync(tmpPath, JSON.stringify(raw))
      expect(() => readRegistryManifest(tmpPath)).toThrow(RegistrySchemaError)
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath)
    }
  })
})

describe("registryIndexSchema round-trip (CLI-002)", () => {
  it("validates the committed registry/index.json", () => {
    expect(() => readRegistryIndex(join(REGISTRY_DIR, "index.json"))).not.toThrow()
  })

  it("every primitive summary's deliverables come from the closed Deliverable set", () => {
    const index = readRegistryIndex(join(REGISTRY_DIR, "index.json"))
    for (const primitive of index.primitives) {
      for (const deliverable of primitive.deliverables) {
        expect(DELIVERABLES).toContain(deliverable)
      }
      for (const output of primitive.stylingOutputs) {
        expect(STYLING_PROFILES).toContain(output)
      }
    }
  })

  it("button is registered as both a primitive and a component deliverable", () => {
    const index = readRegistryIndex(join(REGISTRY_DIR, "index.json"))
    const button = index.primitives.find((p) => p.name === "button")
    expect(button?.deliverables).toEqual(["component", "primitive"])
  })
})
