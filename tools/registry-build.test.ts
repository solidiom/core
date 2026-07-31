import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { execSync } from "node:child_process"
import { createHash, createHmac } from "node:crypto"

import { computeFilesHash, computeEntriesHash, generateKeywords } from "./registry-build"

// ─── Unit Tests ──────────────────────────────────────────────────────────────

describe("computeFilesHash", () => {
  let tempDir: string

  beforeAll(() => {
    tempDir = mkdtempSync(join(tmpdir(), "registry-test-"))
    writeFileSync(join(tempDir, "a.ts"), "const a = 1;\n")
    writeFileSync(join(tempDir, "b.ts"), "const b = 2;\n")
    mkdirSync(join(tempDir, "nested"))
    writeFileSync(join(tempDir, "nested", "c.ts"), "const c = 3;\n")
  })

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it("returns a valid SHA-256 hash string", () => {
    const result = computeFilesHash(tempDir, ["src/a.ts", "src/b.ts"])
    expect(result.hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it("returns per-file digests for each file", () => {
    const result = computeFilesHash(tempDir, ["src/a.ts", "src/b.ts"])
    expect(result.fileDigests).toHaveProperty("src/a.ts")
    expect(result.fileDigests).toHaveProperty("src/b.ts")
    expect(result.fileDigests["src/a.ts"]).toMatch(/^[0-9a-f]{64}$/)
  })

  it("per-file digest matches manual SHA-256 of file content", () => {
    const result = computeFilesHash(tempDir, ["src/a.ts"])
    const expected = createHash("sha256").update("const a = 1;\n").digest("hex")
    expect(result.fileDigests["src/a.ts"]).toBe(expected)
  })

  it("produces consistent output regardless of input order", () => {
    const result1 = computeFilesHash(tempDir, ["src/b.ts", "src/a.ts"])
    const result2 = computeFilesHash(tempDir, ["src/a.ts", "src/b.ts"])
    expect(result1.hash).toBe(result2.hash)
    expect(result1.fileDigests).toEqual(result2.fileDigests)
  })

  it("handles nested files with src/ prefix stripping", () => {
    const result = computeFilesHash(tempDir, ["src/nested/c.ts"])
    expect(result.fileDigests["src/nested/c.ts"]).toMatch(/^[0-9a-f]{64}$/)
    const expected = createHash("sha256").update("const c = 3;\n").digest("hex")
    expect(result.fileDigests["src/nested/c.ts"]).toBe(expected)
  })

  it("skips missing files gracefully", () => {
    const result = computeFilesHash(tempDir, ["src/a.ts", "src/missing.ts"])
    expect(Object.keys(result.fileDigests)).toHaveLength(1)
    expect(result.fileDigests).toHaveProperty("src/a.ts")
  })
})

describe("computeEntriesHash", () => {
  it("returns a valid SHA-256 hash", () => {
    const result = computeEntriesHash([
      { name: "button", filesHash: "abc123" },
      { name: "accordion", filesHash: "def456" },
    ])
    expect(result).toMatch(/^[0-9a-f]{64}$/)
  })

  it("produces consistent output regardless of input order", () => {
    const entries = [
      { name: "button", filesHash: "abc123" },
      { name: "accordion", filesHash: "def456" },
    ]
    const reversed = [...entries].reverse()
    expect(computeEntriesHash(entries)).toBe(computeEntriesHash(reversed))
  })

  it("produces different hash for different inputs", () => {
    const a = computeEntriesHash([{ name: "button", filesHash: "abc" }])
    const b = computeEntriesHash([{ name: "button", filesHash: "def" }])
    expect(a).not.toBe(b)
  })
})

describe("generateKeywords", () => {
  it("extracts words longer than 2 characters", () => {
    const keywords = generateKeywords("Button", "A clickable button component", "input", [], [])
    expect(keywords).toContain("button")
    expect(keywords).toContain("clickable")
    expect(keywords).toContain("component")
    expect(keywords).toContain("input")
    // "a" is too short
    expect(keywords).not.toContain("a")
  })

  it("returns sorted unique keywords", () => {
    const keywords = generateKeywords("Button", "button component", "input", [], [])
    const sorted = [...keywords].sort()
    expect(keywords).toEqual(sorted)
    // "button" appears twice in input but should only be in result once
    expect(keywords.filter((k) => k === "button")).toHaveLength(1)
  })

  it("includes capability names", () => {
    const capabilities = [
      { name: "positioning", version: 1, default: "@solidiom/adapter-positioning-floating-ui" },
    ]
    const keywords = generateKeywords("Popover", "overlay component", "overlay", capabilities, [])
    expect(keywords).toContain("positioning")
  })

  it("includes dependency names without @solidiom/ prefix", () => {
    const keywords = generateKeywords(
      "Dialog",
      "modal dialog",
      "overlay",
      [],
      ["@solidiom/runtime"],
    )
    expect(keywords).toContain("runtime")
  })

  it("splits on various separators", () => {
    const keywords = generateKeywords("Date-Picker", "date_picker/component", "form.input", [], [])
    expect(keywords).toContain("date")
    expect(keywords).toContain("picker")
    expect(keywords).toContain("component")
    expect(keywords).toContain("form")
    expect(keywords).toContain("input")
  })
})

// ─── Snapshot & Determinism Tests ────────────────────────────────────────────

describe("registry build determinism (REG-004)", () => {
  const ROOT = join(import.meta.dirname, "..")
  const REGISTRY_DIR = join(ROOT, "registry")

  it("produces byte-identical output on repeated runs with fixed timestamp", () => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }

    // Run the build twice
    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const indexRun1 = readFileSync(join(REGISTRY_DIR, "index.json"), "utf8")

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const indexRun2 = readFileSync(join(REGISTRY_DIR, "index.json"), "utf8")

    expect(indexRun1).toBe(indexRun2)
  })

  it("snapshot: registry/index.json matches expected structure", () => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const index = readFileSync(join(REGISTRY_DIR, "index.json"), "utf8")

    expect(index).toMatchSnapshot()
  })
})

// ─── REG-005: Signing Tests ──────────────────────────────────────────────────

describe("registry index signing (REG-005)", () => {
  const ROOT = join(import.meta.dirname, "..")
  const REGISTRY_DIR = join(ROOT, "registry")

  it("adds signature fields when REGISTRY_SIGN_KEY is set", () => {
    const signKey = "test-secret-key-for-registry"
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
      REGISTRY_SIGN_KEY: signKey,
    }

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))

    expect(index.integrity.signature).toBeDefined()
    expect(index.integrity.signature).toMatch(/^[0-9a-f]{64}$/)
    expect(index.integrity.signedAt).toBe("2025-01-01T00:00:00.000Z")
    expect(index.integrity.signatureKeyId).toMatch(/^[0-9a-f]{16}$/)

    // Verify signatureKeyId is the first 16 chars of SHA-256 of the key
    const expectedKeyId = createHash("sha256").update(signKey).digest("hex").slice(0, 16)
    expect(index.integrity.signatureKeyId).toBe(expectedKeyId)
  })

  it("does not include signature fields when REGISTRY_SIGN_KEY is not set", () => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }
    delete env.REGISTRY_SIGN_KEY

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))

    expect(index.integrity.signature).toBeUndefined()
    expect(index.integrity.signedAt).toBeUndefined()
    expect(index.integrity.signatureKeyId).toBeUndefined()
  })

  it("signature is a valid HMAC-SHA256 of the pre-signature index content", () => {
    const signKey = "verify-hmac-key"
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
      REGISTRY_SIGN_KEY: signKey,
    }

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))
    const signature = index.integrity.signature

    // Reconstruct the pre-signature content (without signature, signedAt, signatureKeyId)
    const preSigIndex = { ...index, integrity: { ...index.integrity } }
    delete preSigIndex.integrity.signature
    delete preSigIndex.integrity.signedAt
    delete preSigIndex.integrity.signatureKeyId
    const preSigContent = JSON.stringify(preSigIndex, null, 2)

    const expectedSignature = createHmac("sha256", signKey).update(preSigContent).digest("hex")
    expect(signature).toBe(expectedSignature)
  })
})

// ─── REG-005: Per-file Digests Tests ─────────────────────────────────────────

describe("per-file digests in manifests (REG-005)", () => {
  const ROOT = join(import.meta.dirname, "..")
  const REGISTRY_DIR = join(ROOT, "registry")

  it("each primitive manifest includes fileDigests and algorithm", () => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }
    delete env.REGISTRY_SIGN_KEY

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })

    // Check a known primitive (button should exist in most setups)
    const files = execSync(`ls ${REGISTRY_DIR}/*.json`, { encoding: "utf8" }).trim().split("\n")
    const primitiveFiles = files.filter((f) => !f.endsWith("index.json"))

    expect(primitiveFiles.length).toBeGreaterThan(0)

    for (const file of primitiveFiles.slice(0, 5)) {
      const manifest = JSON.parse(readFileSync(file, "utf8"))
      expect(manifest.integrity.algorithm).toBe("sha256")
      expect(manifest.integrity.fileDigests).toBeDefined()
      expect(typeof manifest.integrity.fileDigests).toBe("object")

      // Each file digest should be a valid sha256 hex string
      for (const [path, digest] of Object.entries(manifest.integrity.fileDigests)) {
        expect(path).toMatch(/^src\//)
        expect(digest).toMatch(/^[0-9a-f]{64}$/)
      }
    }
  })

  it("index integrity includes algorithm field", () => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }
    delete env.REGISTRY_SIGN_KEY

    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))

    expect(index.integrity.algorithm).toBe("sha256")
    expect(index.integrity.entriesHash).toMatch(/^[0-9a-f]{64}$/)
  })
})

// ─── REG-003: Provenance, Styling, Keywords Tests ────────────────────────────

describe("REG-003 manifest fields", () => {
  const ROOT = join(import.meta.dirname, "..")
  const REGISTRY_DIR = join(ROOT, "registry")

  beforeAll(() => {
    const env = {
      ...process.env,
      REGISTRY_TIMESTAMP: "2025-01-01T00:00:00.000Z",
    }
    delete env.REGISTRY_SIGN_KEY
    execSync("pnpm exec tsx tools/registry-build.ts", { cwd: ROOT, env, encoding: "utf8" })
  })

  it("each primitive manifest includes provenance", () => {
    const files = execSync(`ls ${REGISTRY_DIR}/*.json`, { encoding: "utf8" }).trim().split("\n")
    const primitiveFiles = files.filter((f) => !f.endsWith("index.json"))

    for (const file of primitiveFiles.slice(0, 5)) {
      const manifest = JSON.parse(readFileSync(file, "utf8"))
      expect(manifest.provenance).toBeDefined()
      expect(manifest.provenance.repository).toBe("https://github.com/solidiom/solidiom")
      expect(manifest.provenance.directory).toMatch(/^packages\//)
    }
  })

  it("primitives with recipes have styling.outputs populated", () => {
    // button has both css and tailwind recipes based on directory listing
    const buttonPath = join(REGISTRY_DIR, "button.json")
    if (existsSync(buttonPath)) {
      const manifest = JSON.parse(readFileSync(buttonPath, "utf8"))
      expect(manifest.styling.outputs).toContain("css")
      expect(manifest.styling.outputs).toContain("tailwind")
    }
  })

  it("index primitives include stylingOutputs and searchKeywords arrays", () => {
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))

    for (const primitive of index.primitives) {
      expect(Array.isArray(primitive.stylingOutputs)).toBe(true)
      expect(Array.isArray(primitive.searchKeywords)).toBe(true)
      // keywords should be sorted
      const sorted = [...primitive.searchKeywords].sort()
      expect(primitive.searchKeywords).toEqual(sorted)
    }
  })

  it("sources registry fields from package metadata and authored documentation", () => {
    const dialog = JSON.parse(readFileSync(join(REGISTRY_DIR, "dialog.json"), "utf8"))
    const index = JSON.parse(readFileSync(join(REGISTRY_DIR, "index.json"), "utf8"))
    const dialogIndex = index.primitives.find(
      (primitive: { name: string }) => primitive.name === "dialog",
    )

    expect(dialog.status).toBe("preview")
    expect(dialog.deliverables).toEqual(["primitive"])
    expect(dialog.styling.themeCompatible).toEqual(["site"])
    expect(dialog.search.keywords).toEqual(
      expect.arrayContaining(["modal", "overlay", "focus", "superposición"]),
    )
    expect(dialog.documentation.locales).toEqual({
      en: { status: "draft" },
      es: { status: "draft" },
    })
    expect(dialog.provenance).toEqual({
      repository: "https://github.com/solidiom/solidiom",
      directory: "packages/dialog",
    })
    expect(dialogIndex).toMatchObject({
      accessibility: { reviewStatus: "automated", evidenceIds: ["axe-dialog-scan-v1"] },
      documentationLocales: dialog.documentation.locales,
      themeCompatible: ["site"],
      provenance: dialog.provenance,
    })
  })

  it("search keywords include capability names when present", () => {
    // Find a primitive with capabilities (e.g. popover, navigation-menu have positioning)
    const files = execSync(`ls ${REGISTRY_DIR}/*.json`, { encoding: "utf8" }).trim().split("\n")
    const primitiveFiles = files.filter((f) => !f.endsWith("index.json"))

    for (const file of primitiveFiles) {
      const manifest = JSON.parse(readFileSync(file, "utf8"))
      if (manifest.capabilities && manifest.capabilities.length > 0) {
        for (const cap of manifest.capabilities) {
          expect(manifest.search.keywords).toContain(cap.name)
        }
        break // Only need to verify one
      }
    }
  })
})
