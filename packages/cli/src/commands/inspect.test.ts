import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runInspect } from "./inspect"

describe("runInspect", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(
      tmpdir(),
      `solidiom-inspect-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("returns an empty entries list when no lockfile exists", () => {
    const result = runInspect({ cwd, subcommand: "source" })
    expect(result.entries).toHaveLength(0)
  })

  it("filters entries by primitive", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          "src/ui/primitives/dialog/index.tsx": {
            path: "src/ui/primitives/dialog/index.tsx",
            digest: "abc",
            primitive: "dialog",
            version: "0.0.1-next.0",
          },
          "src/ui/primitives/button/index.tsx": {
            path: "src/ui/primitives/button/index.tsx",
            digest: "def",
            primitive: "button",
            version: "0.0.1-next.0",
          },
        },
      }),
    )

    const result = runInspect({ cwd, subcommand: "files", primitive: "dialog" })
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]!.primitive).toBe("dialog")
  })

  describe("manifest subcommand (CLI-002 fail-closed reads)", () => {
    it("returns undefined manifest and no error when no primitive is given", () => {
      const result = runInspect({ cwd, subcommand: "manifest" })
      expect(result.manifest).toBeUndefined()
      expect(result.manifestError).toBeUndefined()
    })

    it("returns undefined manifest and no error when the manifest file does not exist", () => {
      const result = runInspect({ cwd, subcommand: "manifest", primitive: "totally-fake" })
      expect(result.manifest).toBeUndefined()
      expect(result.manifestError).toBeUndefined()
    })

    it("reads a valid manifest via --registry and surfaces its fields", () => {
      const registryDir = join(cwd, "fake-registry")
      mkdirSync(registryDir, { recursive: true })
      writeFileSync(join(registryDir, "widget.json"), JSON.stringify(validManifest("widget")))

      const result = runInspect({
        cwd,
        subcommand: "manifest",
        primitive: "widget",
        registry: registryDir,
      })
      expect(result.manifestError).toBeUndefined()
      expect(result.manifest?.deliverables).toEqual(["primitive"])
      expect(result.manifest?.styling.outputs).toEqual(["css"])
    })

    it("fails closed with manifestError when a manifest is missing a required field", () => {
      const registryDir = join(cwd, "fake-registry")
      mkdirSync(registryDir, { recursive: true })
      const broken = validManifest("widget") as Record<string, unknown>
      delete broken.documentation
      writeFileSync(join(registryDir, "widget.json"), JSON.stringify(broken))

      const result = runInspect({
        cwd,
        subcommand: "manifest",
        primitive: "widget",
        registry: registryDir,
      })
      expect(result.manifest).toBeUndefined()
      expect(result.manifestError).toBeDefined()
      expect(result.manifestError).toContain("documentation")
    })

    it("fails closed with manifestError on an unsupported $schema version", () => {
      const registryDir = join(cwd, "fake-registry")
      mkdirSync(registryDir, { recursive: true })
      const wrongSchema = {
        ...validManifest("widget"),
        $schema: "https://solidiom.dev/schemas/registry-manifest/v99.json",
      }
      writeFileSync(join(registryDir, "widget.json"), JSON.stringify(wrongSchema))

      const result = runInspect({
        cwd,
        subcommand: "manifest",
        primitive: "widget",
        registry: registryDir,
      })
      expect(result.manifest).toBeUndefined()
      expect(result.manifestError).toContain("Unsupported registry manifest schema")
    })
  })

  describe("explain subcommand surfaces deliverables/styling/documentation (CLI-002)", () => {
    it("prints manifest-derived fields when a valid manifest resolves", () => {
      const registryDir = join(cwd, "fake-registry")
      mkdirSync(registryDir, { recursive: true })
      writeFileSync(join(registryDir, "widget.json"), JSON.stringify(validManifest("widget")))

      const result = runInspect({
        cwd,
        subcommand: "explain",
        primitive: "widget",
        registry: registryDir,
      })
      expect(result.manifest?.deliverables).toEqual(["primitive"])
      expect(result.manifest?.documentation.status).toBe("stub")
    })
  })

  describe("provenance subcommand (CLI-003)", () => {
    function writeLockWithProvenance(cwd: string) {
      mkdirSync(join(cwd, ".solidiom"), { recursive: true })
      writeFileSync(
        join(cwd, ".solidiom", "lock.json"),
        JSON.stringify({
          version: 1,
          installed: {
            "src/ui/primitives/dialog/index.tsx": {
              path: "src/ui/primitives/dialog/index.tsx",
              digest: "a".repeat(64),
              primitive: "dialog",
              version: "0.0.1-next.0",
              manifestFilesHash: "b".repeat(64),
              signatureKeyId: "c".repeat(16),
              verifiedAt: "2025-01-01T00:00:00.000Z",
              provenance: "verified",
            },
            "src/ui/primitives/button/index.tsx": {
              path: "src/ui/primitives/button/index.tsx",
              digest: "d".repeat(64),
              primitive: "button",
              version: "0.0.1-next.0",
              manifestFilesHash: "e".repeat(64),
              verifiedAt: "2025-01-01T00:01:00.000Z",
              provenance: "unverified",
            },
          },
        }),
      )
    }

    it("returns lock entries filtered by primitive with provenance metadata", () => {
      writeLockWithProvenance(cwd)

      const result = runInspect({ cwd, subcommand: "provenance", primitive: "dialog" })
      expect(result.entries).toHaveLength(1)
      const entry = result.entries[0]!
      expect(entry.provenance).toBe("verified")
      expect(entry.manifestFilesHash).toBe("b".repeat(64))
      expect(entry.signatureKeyId).toBe("c".repeat(16))
      expect(entry.verifiedAt).toBe("2025-01-01T00:00:00.000Z")
    })

    it("returns all provenance entries when no primitive filter is given", () => {
      writeLockWithProvenance(cwd)

      const result = runInspect({ cwd, subcommand: "provenance" })
      expect(result.entries).toHaveLength(2)
      const unverified = result.entries.find((e) => e.primitive === "button")!
      expect(unverified.provenance).toBe("unverified")
      expect(unverified.signatureKeyId).toBeUndefined()
    })

    it("returns an empty entries list when no lockfile exists", () => {
      const result = runInspect({ cwd, subcommand: "provenance", primitive: "dialog" })
      expect(result.entries).toHaveLength(0)
    })
  })
})

/** A minimal but schema-valid registry manifest fixture (CLI-002). */
function validManifest(name: string) {
  return {
    $schema: "https://solidiom.dev/schemas/registry-manifest/v2.json",
    name,
    version: "0.0.1-next.0",
    package: `@solidiom/${name}`,
    label: "Widget",
    description: "A widget",
    category: "input",
    status: "preview" as const,
    deliverables: ["primitive"],
    capabilities: [],
    cli: { addCommand: `solidiom add ${name}`, installDeps: [] },
    accessibility: { reviewStatus: "none" as const, evidenceIds: [] },
    documentation: { status: "stub" as const, locales: { en: { status: "missing" as const } } },
    styling: { outputs: ["css"], themeCompatible: [] },
    search: { keywords: [name] },
    source: { entry: "src/index.tsx", files: ["src/index.tsx"] },
    dependencies: ["@solidiom/runtime"],
    runtime: [],
    integrity: {
      algorithm: "sha256" as const,
      filesHash: "a".repeat(64),
      fileDigests: { "src/index.tsx": "b".repeat(64) },
      lastGenerated: "2025-01-01T00:00:00.000Z",
    },
    provenance: {
      repository: "https://github.com/solidiom/solidiom",
      directory: `packages/${name}`,
    },
    lastUpdated: "2025-01-01T00:00:00.000Z",
  }
}
