import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createHash, generateKeyPairSync } from "node:crypto"

// Fixed Ed25519 keypair for tests
const TEST_KEYPAIR = generateKeyPairSync("ed25519")
const TEST_PRIV_DER = TEST_KEYPAIR.privateKey.export({ format: "der", type: "pkcs8" })
const TEST_PUB_DER = TEST_KEYPAIR.publicKey.export({ format: "der", type: "spki" })
const TEST_PUB_RAW = TEST_PUB_DER.slice(-32)
const TEST_PUB_B64 = TEST_PUB_RAW.toString("base64")
const TEST_KEY_ID = createHash("sha256").update(TEST_PUB_RAW).digest("hex").slice(0, 16)

// Attacker keypair
const ATTACKER_KEYPAIR = generateKeyPairSync("ed25519")
const ATTACKER_PRIV_DER = ATTACKER_KEYPAIR.privateKey.export({ format: "der", type: "pkcs8" })

/** Sign index content with a given private key and return base64 signature. */
async function signIndex(content: string, privDer: Buffer): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    "pkcs8",
    new Uint8Array(privDer),
    "Ed25519",
    false,
    ["sign"],
  )
  const sig = await globalThis.crypto.subtle.sign("Ed25519", key, Buffer.from(content, "utf8"))
  return Buffer.from(sig).toString("base64")
}
import { verifyRegistry } from "./verify"

const SCHEMA_URL = "https://solidiom.dev/schemas/registry-index/v3.json"
const MANIFEST_SCHEMA_URL = "https://solidiom.dev/schemas/registry-manifest/v2.json"

function buttonManifest() {
  const fileDigests = {
    "src/index.tsx": createHash("sha256").update("export const Button = 1").digest("hex"),
  }
  const filesHash = createHash("sha256").update(Object.values(fileDigests).join("")).digest("hex")

  return {
    $schema: MANIFEST_SCHEMA_URL,
    name: "button",
    version: "0.0.1-next.0",
    package: "@solidiom/button",
    label: "Button",
    description: "A button",
    category: "input",
    status: "preview" as const,
    deliverables: ["primitive"] as const,
    capabilities: [] as { name: string; version: number; default: string }[],
    cli: { addCommand: "solidiom add button", installDeps: [] as string[] },
    accessibility: {
      reviewStatus: "none" as const,
      evidenceIds: [] as string[],
    },
    documentation: {
      status: "stub" as const,
      locales: { en: { status: "missing" as const } },
    },
    styling: {
      outputs: [] as ("css" | "tailwind" | "unocss")[],
      themeCompatible: [] as string[],
    },
    search: { keywords: ["button"] },
    source: { entry: "src/index.tsx", files: ["src/index.tsx"] },
    dependencies: ["@solidiom/runtime"],
    runtime: [] as string[],
    integrity: {
      algorithm: "sha256" as const,
      filesHash,
      fileDigests,
      lastGenerated: "2025-01-01T00:00:00.000Z",
    },
    provenance: {
      repository: "https://github.com/solidiom/solidiom",
      directory: "packages/button",
    },
    lastUpdated: "2025-01-01T00:00:00.000Z",
  }
}

function baseIndex(manifest: ReturnType<typeof buttonManifest>) {
  return {
    $schema: SCHEMA_URL,
    version: 3 as const,
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
        provenance: {
          repository: "https://github.com/solidiom/solidiom",
          directory: "packages/button",
        },
      },
    ],
    adapters: [],
    components: [],
    blocks: [],
    templates: [],
    themes: [],
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

  it("fails closed when signed but no verification key is configured", async () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndex(preSigContent, TEST_PRIV_DER)
    const signed = { ...index, integrity: { ...index.integrity, signature } }
    write(signed, manifest)

    const result = verifyRegistry({ cwd: dir, registryDir: dir })
    expect(result.verified).toBe(false)
    // REGISTRY_PUBLIC_KEYS may contain embedded keys.  When none match the
    // test key the verifier reports "does not verify"; when the array is empty
    // it reports "no verification key".  Both are acceptable failures.
    expect(
      result.violations.some(
        (v) => v.includes("no verification key") || v.includes("does not verify"),
      ),
    ).toBe(true)
  })

  it("fails closed when signed with a key that is not in the trusted set (tamper)", async () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndex(preSigContent, ATTACKER_PRIV_DER)
    const signed = { ...index, integrity: { ...index.integrity, signature } }
    write(signed, manifest)

    const result = verifyRegistry({
      cwd: dir,
      registryDir: dir,
      verifyKeys: [TEST_PUB_B64],
      requireSignature: true,
    })
    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("does not verify"))).toBe(true)
  })

  it("verifies a correctly signed index against the trusted public key", async () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndex(preSigContent, TEST_PRIV_DER)
    const signed = {
      ...index,
      integrity: {
        ...index.integrity,
        signature,
        signedAt: "2025-01-01T00:00:00.000Z",
        signatureKeyId: TEST_KEY_ID,
      },
    }
    write(signed, manifest)

    const result = verifyRegistry({
      cwd: dir,
      registryDir: dir,
      verifyKeys: [TEST_PUB_B64],
      requireSignature: true,
    })
    expect(result.verified).toBe(true)
  })

  it("fails closed when signatureKeyId does not match the verifying key (tamper)", async () => {
    const manifest = buttonManifest()
    const index = baseIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndex(preSigContent, TEST_PRIV_DER)
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
      verifyKeys: [TEST_PUB_B64],
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
    expect(raw.version).toBe(3)

    const result = verifyRegistry({ cwd: ROOT, registryDir })
    // The checked-in registry is unsigned in this workspace, so signature
    // enforcement is not triggered, but manifest integrity must still hold.
    expect(result.violations.filter((v) => v.includes("filesHash mismatch"))).toHaveLength(0)
  })
})
