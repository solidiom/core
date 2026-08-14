import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createHash, generateKeyPairSync } from "node:crypto"
import { verifySourceIntegrity } from "./verify-source"

// Fixed Ed25519 keypair for tests
const TEST_KEYPAIR = generateKeyPairSync("ed25519")
const TEST_PRIV_DER = TEST_KEYPAIR.privateKey.export({ format: "der", type: "pkcs8" })
const TEST_PUB_DER = TEST_KEYPAIR.publicKey.export({ format: "der", type: "spki" })
const TEST_PUB_RAW = TEST_PUB_DER.slice(-32)
const TEST_PUB_B64 = TEST_PUB_RAW.toString("base64")
const TEST_KEY_ID = createHash("sha256").update(TEST_PUB_RAW).digest("hex").slice(0, 16)

const ATTACKER_KEYPAIR = generateKeyPairSync("ed25519")
const ATTACKER_PRIV_DER = ATTACKER_KEYPAIR.privateKey.export({ format: "der", type: "pkcs8" })

async function signIndexContent(content: string, privDer: Buffer): Promise<string> {
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

const INDEX_SCHEMA_URL = "https://solidiom.dev/schemas/registry-index/v3.json"
const MANIFEST_SCHEMA_URL = "https://solidiom.dev/schemas/registry-manifest/v2.json"

function createTmpDir(): string {
  // Nest cwd two levels deep so verifySourceIntegrity's monorepo-relative
  // resolution (join(cwd, "..", "..", "registry")) stays inside the writable
  // temp tree, matching source-install.test.ts's createTmpDir convention.
  const root = join(
    tmpdir(),
    `solidiom-verify-source-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )
  const dir = join(root, "consumer", "app")
  mkdirSync(dir, { recursive: true })
  return dir
}

/** Build a schema-valid manifest fixture for the given file contents. */
function buildManifest(primitive: string, files: Record<string, string>) {
  const fileDigests: Record<string, string> = {}
  for (const [relPath, content] of Object.entries(files)) {
    fileDigests[relPath] = createHash("sha256").update(content, "utf8").digest("hex")
  }
  const sortedDigests = Object.entries(fileDigests).sort(([a], [b]) => a.localeCompare(b))
  const filesHash = createHash("sha256")
    .update(sortedDigests.map(([, digest]) => digest).join(""))
    .digest("hex")

  return {
    $schema: MANIFEST_SCHEMA_URL,
    name: primitive,
    version: "0.0.1-next.0",
    package: `@solidiom/${primitive}`,
    label: primitive,
    description: primitive,
    category: "input",
    status: "preview" as const,
    deliverables: ["primitive"],
    capabilities: [] as { name: string; version: number; default: string }[],
    cli: { addCommand: `solidiom add ${primitive}`, installDeps: [] as string[] },
    accessibility: { reviewStatus: "none" as const, evidenceIds: [] as string[] },
    documentation: { status: "stub" as const, locales: {} },
    styling: { outputs: [] as ("css" | "tailwind" | "unocss")[], themeCompatible: [] as string[] },
    search: { keywords: [primitive] },
    source: { entry: Object.keys(files)[0] ?? "index.tsx", files: Object.keys(files) },
    dependencies: ["@solidiom/runtime"],
    runtime: [] as string[],
    integrity: {
      algorithm: "sha256" as const,
      filesHash,
      fileDigests,
      lastGenerated: "2025-01-01T00:00:00.000Z",
    },
    provenance: {
      repository: "https://github.com/solidiom/core",
      directory: `packages/${primitive}`,
    },
    lastUpdated: "2025-01-01T00:00:00.000Z",
  }
}

/** Build a schema-valid, unsigned index fixture referencing the given manifest. */
function buildIndex(manifest: ReturnType<typeof buildManifest>) {
  return {
    $schema: INDEX_SCHEMA_URL,
    version: 3 as const,
    generatedAt: "2025-01-01T00:00:00.000Z",
    integrity: { algorithm: "sha256" as const, entriesHash: "a".repeat(64) },
    primitives: [
      {
        name: manifest.name,
        version: manifest.version,
        package: manifest.package,
        label: manifest.label,
        description: manifest.description,
        category: manifest.category,
        status: manifest.status,
        deliverables: manifest.deliverables,
        hasAccessibilityEvidence: false,
        accessibility: { reviewStatus: "none" as const, evidenceIds: [] as string[] },
        documentationStatus: "stub" as const,
        documentationLocales: {},
        stylingOutputs: [] as ("css" | "tailwind" | "unocss")[],
        themeCompatible: [] as string[],
        searchKeywords: [manifest.name],
        provenance: manifest.provenance,
      },
    ],
    adapters: [] as unknown[],
    components: [] as unknown[],
    blocks: [] as unknown[],
    templates: [] as unknown[],
    themes: [] as unknown[],
  }
}

describe("verifySourceIntegrity (CLI-003)", () => {
  let cwd: string
  let registryDir: string

  beforeEach(() => {
    cwd = createTmpDir()
    registryDir = join(cwd, "..", "..", "registry")
    mkdirSync(registryDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(join(cwd, "..", ".."), { recursive: true, force: true })
  })

  function write(index: unknown, manifest: unknown, name = "widget") {
    writeFileSync(join(registryDir, "index.json"), JSON.stringify(index, null, 2))
    writeFileSync(join(registryDir, `${name}.json`), JSON.stringify(manifest, null, 2))
  }

  it("succeeds when the manifest is untampered and file bytes match exactly", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: new Map(Object.entries(files)),
    })

    expect(result.verified).toBe(true)
    expect(result.violations).toEqual([])
    expect(result.manifestFilesHash).toBe(manifest.integrity.filesHash)
    expect(result.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it("fails when a source file's content has been mutated relative to its recorded digest", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const tamperedFiles = new Map([["index.tsx", "export const Widget = 999 // tampered"]])
    const result = verifySourceIntegrity({ cwd, primitive: "widget", files: tamperedFiles })

    expect(result.verified).toBe(false)
    expect(
      result.violations.some((v) => v.includes("index.tsx") && v.includes("digest mismatch")),
    ).toBe(true)
  })

  it("fails when the manifest's fileDigests entry itself has been tampered (corrupted manifest)", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    // Corrupt the recorded digest, and recompute filesHash to match the
    // corrupted digest so verifyRegistry's own filesHash<->fileDigests
    // consistency check passes — isolating the byte-level check this test
    // targets (a manifest that is internally consistent but tampered
    // relative to the REAL file content on disk).
    const corruptedDigests = { "index.tsx": "0".repeat(64) }
    const corruptedFilesHash = createHash("sha256")
      .update(Object.values(corruptedDigests).join(""))
      .digest("hex")
    const tamperedManifest = {
      ...manifest,
      integrity: {
        ...manifest.integrity,
        fileDigests: corruptedDigests,
        filesHash: corruptedFilesHash,
      },
    }
    write(buildIndex(manifest), tamperedManifest)

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: new Map(Object.entries(files)),
    })

    expect(result.verified).toBe(false)
    expect(
      result.violations.some((v) => v.includes("index.tsx") && v.includes("digest mismatch")),
    ).toBe(true)
  })

  it("fails with a clear violation, without throwing, when no manifest exists for the primitive", () => {
    // No registry files written at all.
    expect(() =>
      verifySourceIntegrity({
        cwd,
        primitive: "nonexistent",
        files: new Map([["index.tsx", "export const X = 1"]]),
      }),
    ).not.toThrow()

    const result = verifySourceIntegrity({
      cwd,
      primitive: "nonexistent",
      files: new Map([["index.tsx", "export const X = 1"]]),
    })

    expect(result.verified).toBe(false)
    expect(result.violations.length).toBeGreaterThan(0)
  })

  it("fails with a clear violation when the registry exists but has no manifest for this primitive", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest, "widget")

    const result = verifySourceIntegrity({
      cwd,
      primitive: "other-primitive",
      files: new Map(Object.entries(files)),
    })

    expect(result.verified).toBe(false)
    expect(result.violations[0]).toContain("No registry manifest found")
  })

  it("fails when a file is present in source but absent from manifest fileDigests", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const filesWithExtra = new Map(Object.entries(files))
    filesWithExtra.set("extra.tsx", "export const Extra = 1")

    const result = verifySourceIntegrity({ cwd, primitive: "widget", files: filesWithExtra })

    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("extra.tsx") && v.includes("no entry"))).toBe(
      true,
    )
  })

  it("fails when a manifest fileDigests entry has no corresponding file in source", () => {
    const files = { "index.tsx": "export const Widget = 1", "extra.tsx": "export const Extra = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    // Only pass index.tsx — extra.tsx is "missing" from the collected source files.
    const partialFiles = new Map([["index.tsx", files["index.tsx"]!]])
    const result = verifySourceIntegrity({ cwd, primitive: "widget", files: partialFiles })

    expect(result.verified).toBe(false)
    expect(
      result.violations.some((v) => v.includes("extra.tsx") && v.includes("missing from source")),
    ).toBe(true)
  })

  it("fails when the registry index is unsigned but requireSignature (requireVerifiedSource policy) is true", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: new Map(Object.entries(files)),
      requireSignature: true,
    })

    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("not signed"))).toBe(true)
  })

  it("fails when the index is signed with a key that does not match the trusted verification key", async () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    const index = buildIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndexContent(preSigContent, ATTACKER_PRIV_DER)
    const signed = { ...index, integrity: { ...index.integrity, signature } }
    write(signed, manifest)

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: new Map(Object.entries(files)),
      verifyKeys: [TEST_PUB_B64],
      requireSignature: true,
    })

    expect(result.verified).toBe(false)
    expect(result.violations.some((v) => v.includes("does not verify"))).toBe(true)
  })

  it("succeeds and surfaces signatureKeyId when the index is signed with the correct trusted key", async () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    const index = buildIndex(manifest)
    const preSigContent = JSON.stringify(index, null, 2)
    const signature = await signIndexContent(preSigContent, TEST_PRIV_DER)
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

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: new Map(Object.entries(files)),
      verifyKeys: [TEST_PUB_B64],
      requireSignature: true,
    })

    expect(result.verified).toBe(true)
    expect(result.signatureKeyId).toBe(TEST_KEY_ID)
  })

  it("accepts the files param as an array of {relPath, content} in addition to a Map", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const result = verifySourceIntegrity({
      cwd,
      primitive: "widget",
      files: [{ relPath: "index.tsx", content: files["index.tsx"]! }],
    })

    expect(result.verified).toBe(true)
  })

  it("does not write anything to disk (pure function)", () => {
    const files = { "index.tsx": "export const Widget = 1" }
    const manifest = buildManifest("widget", files)
    write(buildIndex(manifest), manifest)

    const before = new Set(readdirSync(registryDir))
    verifySourceIntegrity({ cwd, primitive: "widget", files: new Map(Object.entries(files)) })
    const after = new Set(readdirSync(registryDir))

    expect(after).toEqual(before)
    expect(existsSync(join(cwd, ".solidiom", "lock.json"))).toBe(false)
  })
})
