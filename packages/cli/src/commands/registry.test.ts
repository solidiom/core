import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import {
  readRegistryIndex,
  readRegistryManifest,
  RegistrySchemaError,
  SUPPORTED_REGISTRY_INDEX_VERSION,
} from "../registry-schema"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..", "..", "..", "..")

describe("registry", () => {
  it("registry/index.json is valid and has required fields", () => {
    const registry = JSON.parse(readFileSync(join(ROOT, "registry/index.json"), "utf8"))
    expect(registry.version).toBe(2)
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

describe("registry schema version guard (REG-004)", () => {
  let tempDir: string

  function withTempFile(name: string, content: unknown): string {
    const path = join(tempDir, name)
    writeFileSync(path, JSON.stringify(content, null, 2))
    return path
  }

  it("readRegistryIndex accepts the current on-disk registry", () => {
    const index = readRegistryIndex(join(ROOT, "registry/index.json"))
    expect(index.version).toBe(SUPPORTED_REGISTRY_INDEX_VERSION)
    expect(index.primitives.length).toBeGreaterThan(0)
  })

  it("readRegistryManifest accepts the current on-disk dialog manifest", () => {
    const manifest = readRegistryManifest(join(ROOT, "registry/dialog.json"))
    expect(manifest.name).toBe("dialog")
    expect(manifest.integrity.filesHash).toMatch(/^[0-9a-f]{64}$/)
  })

  it("rejects an index with an unsupported schema version", () => {
    tempDir = mkdtempSync(join(tmpdir(), "registry-schema-test-"))
    const path = withTempFile("index.json", {
      $schema: "https://solidiom.dev/schemas/registry-index/v2.json",
      version: 1,
      generatedAt: "2025-01-01T00:00:00.000Z",
      integrity: { algorithm: "sha256", entriesHash: "a".repeat(64) },
      primitives: [],
      adapters: [],
    })
    expect(() => readRegistryIndex(path)).toThrow(RegistrySchemaError)
    rmSync(tempDir, { recursive: true, force: true })
  })

  it("rejects an index missing required integrity fields", () => {
    tempDir = mkdtempSync(join(tmpdir(), "registry-schema-test-"))
    const path = withTempFile("index.json", {
      $schema: "https://solidiom.dev/schemas/registry-index/v2.json",
      version: 2,
      generatedAt: "2025-01-01T00:00:00.000Z",
      primitives: [],
      adapters: [],
    })
    expect(() => readRegistryIndex(path)).toThrow(RegistrySchemaError)
    rmSync(tempDir, { recursive: true, force: true })
  })

  it("rejects a manifest with an unsupported $schema", () => {
    tempDir = mkdtempSync(join(tmpdir(), "registry-schema-test-"))
    const path = withTempFile("dialog.json", {
      $schema: "https://solidiom.dev/schemas/registry-manifest/v1.json",
      name: "dialog",
      version: "0.0.1",
      package: "@solidiom/dialog",
      label: "Dialog",
      description: "",
      category: "overlay",
      status: "preview",
      source: { entry: "src/index.tsx", files: [] },
      dependencies: [],
      integrity: {
        algorithm: "sha256",
        filesHash: "a".repeat(64),
        fileDigests: {},
        lastGenerated: "2025-01-01T00:00:00.000Z",
      },
    })
    expect(() => readRegistryManifest(path)).toThrow(RegistrySchemaError)
    rmSync(tempDir, { recursive: true, force: true })
  })

  it("rejects malformed JSON", () => {
    tempDir = mkdtempSync(join(tmpdir(), "registry-schema-test-"))
    const path = join(tempDir, "index.json")
    writeFileSync(path, "{ not valid json")
    expect(() => readRegistryIndex(path)).toThrow(RegistrySchemaError)
    rmSync(tempDir, { recursive: true, force: true })
  })
})
