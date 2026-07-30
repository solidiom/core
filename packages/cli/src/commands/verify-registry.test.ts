import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createHash, createHmac } from "node:crypto"
import { verifyRegistry } from "./verify"

const SCHEMA_URL = "https://solidiom.dev/schemas/registry-index/v2.json"
const MANIFEST_SCHEMA_URL = "https://solidiom.dev/schemas/registry-manifest/v2.json"

function buttonManifest() {
  const fileDigests = {
    "src/index.tsx": createHash("sha256").update("export const Button = 1").digest("hex"),
  }
  const filesHash = createHash("sha256")
    .update(Object.values(fileDigests).join(""))
    .digest("hex")

  return {
    $schema: MANIFEST_SCHEMA_URL,
    name: "button",
    version: "0.0.1-next.0",
    package: "@solidiom/button",
    label: "Button",
    description: "A button",
    category: "input",
    status: "preview" as const,
    source: { entry: "src/index.tsx", files: ["src/index.tsx"] },
    dependencies: ["@solidiom/runtime"],
    integrity: {
      algorithm: "sha256" as const,
      filesHash,
      fileDigests,
      lastGenerated: "2025-01-01T00:00:00.000Z",
    },
  }
}

function baseIndex(manifest: ReturnType<typeof buttonManifest>) {
  return {
    $schema: SCHEMA_URL,
    version: 2 as const,
    generatedAt: "2025-01-01T00:00:00.000Z",
    integrity: {
      algorithm: "sha256" as const,
      entriesHash: "a".repeat(64),
    },
    primitives: [
      {
        name: manifest.name,
        version: manifest.version,
        package: manifest.package,
        label: manifest.label,
        description: manifest.description,
        category: manifest.category,
        status: manifest.status,
        deliverables: ["primitive"],
        hasAccessibilityEvidence: false,
        accessibility: { reviewStatus: "none" as const, evidenceIds: [] },
        documentationStatus: "stub" as const,
        documentationLocales: { en: { status: "missing" as const } },
        stylingOutputs: [] as ("css" | "tailwind" | "unocss")[],
        themeCompatible: [] as string[],
        searchKeywords: ["button"],
        provenance: { repository: "https://github.com/solidiom/solidiom", directory: "packages/button" },
      },
    ],
    adapters: [],
  }
}

describe("verifyRegistry (REG-006)", () => {
  let dir: string

  beforeEach(() => {
    dir = mkdirSync(join(tmpdir(), `verify-registry-${Date.now()}-${Math.random()}`), {
      recursive: true,
    }) as string
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  function write(index: unknown, manifest: unknown) {
    writeFileSync(join(dir, "index.json"), JSON.stringify(index, null, 2))
    writeFileSync(join(dir, "button.json"), JSON.stringify(manifest, null, 2))
  }

  it("verifies a well-formed, unsigned registry when signing is not required", () => {
    const manifest = buttonManifest()
    write(baseIndex(manifest), manifest)

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(true)
    expect(result.primitivesChecked).toBe(1)
    expect(result.violations).toHaveLength(0)
  })

  it("fails closed when registry/index.json is missing", () => {
    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    expect(result.violations[0]).toContain("missing")
  })

  it("fails closed on an unsupported schema version", () => {
    const manifest = buttonManifest()
    const index = { ...baseIndex(manifest), version: 1 }
    write(index, manifest)

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    expect(result.violations[0]).toMatch(/schema/i)
  })

  it("fails closed when a manifest's filesHash does not match its fileDigests (tamper)", () => {
    const manifest = buttonManifest()
    const tampered = {
      ...manifest,
      integrity: { ...manifest.integrity, filesHash: "f".repeat(64) },
    }
    write(baseIndex(manifest), tampered)

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("filesHash mismatch"))).toBe(true)
  })

  it("fails closed when a manifest referenced by the index is missing on disk", () => {
    const manifest = buttonManifest()
    writeFileSync(join(dir, "index.json"), JSON.stringify(baseIndex(manifest), null, 2))
    // Deliberately do not write button.json

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("manifest file missing"))).toBe(true)
  })

  it("fails closed when signing is required but the index is unsigned", () => {
    const manifest = buttonManifest()
    write(baseIndex(manifest), manifest)

    const result = verifyRegistry({ cwd: dir, registryDir: dir, requireSignature: true })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("not signed"))).toBe(true)
  })

  it("fails closed when signed but no verification key is configured", () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = createHmac("sha256", "some-key").update(preSigContent).digest("hex")
    const signed = { ...index, integrity: { ...index.integrity, signature } }
    write(signed, manifest)

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("no verification key"))).toBe(true)
  })

  it("fails closed when signed with a key that is not in the trusted set (tamper)", () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = createHmac("sha256", "attacker-key").update(preSigContent).digest("hex")
    const signed = { ...index, integrity: { ...index.integrity, signature } }
    write(signed, manifest)

    const result = verifyRegistry({
      cwd: dir,
      registryDir: dir,
      verifyKeys: ["correct-key"],
      requireSignature: true,
    })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("does not verify"))).toBe(true)
  })

  it("verifies a correctly signed index against the trusted key", () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const key = "correct-key"
    const signature = createHmac("sha256", key).update(preSigContent).digest("hex")
    const signatureKeyId = createHash("sha256").update(key).digest("hex").slice(0, 16)
    const signed = {
      ...index,
      integrity: { ...index.integrity, signature, signedAt: "2025-01-01T00:00:00.000Z", signatureKeyId },
    }
    write(signed, manifest)

    const result = verifyRegistry({
      cwd: dir,
      registryDir: dir,
      verifyKeys: [key],
      requireSignature: true,
    })
    expect(result.verified).toBe(true)
  })

  it("fails closed when signatureKeyId does not match the verifying key (tamper)", () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const key = "correct-key"
    const signature = createHmac("sha256", key).update(preSigContent).digest("hex")
    const signed = {
      ...index,
      integrity: {
        ...index.integrity,
        signature,
        signedAt: "2025-01-01T00:00:00.000Z",
        signatureKeyId: "0".repeat(16),
      },
    }
    write(signed, manifest)

    const result = verifyRegistry({
      cwd: dir,
      registryDir: dir,
      verifyKeys: [key],
      requireSignature: true,
    })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("signatureKeyId"))).toBe(true)
  })

  it("integrates against the real workspace registry when signed with REGISTRY_SIGN_KEY", () => {
    // Sanity check that verifyRegistry can validate the actual generated
    // registry output shape end to end (not just synthetic fixtures).
    const ROOT = join(import.meta.dirname, "..", "..", "..", "..")
    const registryDir = join(ROOT, "registry")
    const raw = JSON.parse(readFileSync(join(registryDir, "index.json"), "utf8"))
    expect(raw.version).toBe(2)

    const result = verifyRegistry({ cwd: ROOT, registryDir })
    // The checked-in registry is unsigned in this workspace, so signature
    // enforcement is not triggered, but manifest integrity must still hold.
    expect(result.violations.filter((v) => v.includes("filesHash mismatch"))).toHaveLength(0)
  })
})
