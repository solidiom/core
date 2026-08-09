import { createHash } from "node:crypto"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

type Result = { check: string; pass: boolean; detail: string }

function readJson(relPath: string): unknown {
  const abs = join(ROOT, relPath)
  if (!existsSync(abs)) {
    return null
  }
  return JSON.parse(readFileSync(abs, "utf8"))
}

function sha256(relPath: string): string {
  const abs = join(ROOT, relPath)
  const content = readFileSync(abs)
  return createHash("sha256").update(content).digest("hex")
}

async function main(): Promise<Result[]> {
  const results: Result[] = []

  // 1. Read the pointer
  const pointer = readJson("artifacts/beta-pointer.json") as Record<string, unknown> | null
  if (!pointer) {
    results.push({ check: "pointer_exists", pass: false, detail: "artifacts/beta-pointer.json not found" })
    return results
  }
  results.push({ check: "pointer_exists", pass: true, detail: `channel=${pointer.channel} release=${pointer.release}` })

  // 2. Verify catalog hash
  const catalogHash = sha256("artifacts/beta-catalog.json")
  const pointerCatalogHash = pointer.catalogSha256 as string
  results.push({
    check: "catalog_sha256",
    pass: catalogHash === pointerCatalogHash,
    detail:
      catalogHash === pointerCatalogHash
        ? `match: ${catalogHash.slice(0, 16)}…`
        : `mismatch — computed ${catalogHash.slice(0, 16)}… expected ${pointerCatalogHash.slice(0, 16)}…`,
  })

  // 3. Verify registry index hash
  if (existsSync(join(ROOT, "registry/index.json"))) {
    const registryHash = sha256("registry/index.json")
    const pointerRegistryHash = pointer.registryIndexSha256 as string
    results.push({
      check: "registry_index_sha256",
      pass: registryHash === pointerRegistryHash,
      detail:
        registryHash === pointerRegistryHash
          ? `match: ${registryHash.slice(0, 16)}…`
          : `mismatch — computed ${registryHash.slice(0, 16)}… expected ${pointerRegistryHash.slice(0, 16)}…`,
    })
  } else {
    results.push({ check: "registry_index_sha256", pass: false, detail: "registry/index.json not found" })
  }

  // 4. Check registry index signature field
  const registryIdx = readJson("registry/index.json") as Record<string, unknown> | null
  if (registryIdx) {
    const integrity = registryIdx.integrity as Record<string, unknown> | undefined
    const hasSignature = typeof integrity?.signature === "string" && integrity.signature.length > 0
    results.push({
      check: "registry_signature_present",
      pass: hasSignature,
      detail: hasSignature
        ? `signed with keyId=${integrity.signatureKeyId} at ${integrity.signedAt}`
        : "no signature — REGISTRY_SIGN_KEY was not set during build",
    })
  }

  // 5. Try signing if REGISTRY_SIGN_KEY is available
  const signKeyHex = process.env.REGISTRY_SIGN_KEY
  if (signKeyHex) {
    results.push({
      check: "signing_key_available",
      pass: true,
      detail: "REGISTRY_SIGN_KEY is set — run `pnpm registry:build` with this env var to sign",
    })

    try {
      const indexContent = readFileSync(join(ROOT, "registry/index.json"), "utf8")
      const idxParsed = JSON.parse(indexContent)

      if (idxParsed.integrity) {
        delete idxParsed.integrity.signature
        delete idxParsed.integrity.signedAt
        delete idxParsed.integrity.signatureKeyId
      }

      const stable = JSON.stringify(idxParsed, null, 2)
      const privateKeyBuf = Buffer.from(signKeyHex, "hex")
      const pkcs8Header = Buffer.from("302e020100300506032b657004220420", "hex")
      const pkcs8Der = Buffer.concat([pkcs8Header, privateKeyBuf])

      const cryptoKey = await globalThis.crypto.subtle.importKey(
        "pkcs8",
        pkcs8Der,
        "Ed25519",
        true,
        ["sign"],
      )

      const sig = await globalThis.crypto.subtle.sign("Ed25519", cryptoKey, Buffer.from(stable, "utf8"))
      const sigBase64 = Buffer.from(sig).toString("base64")

      const jwk = await globalThis.crypto.subtle.exportKey("jwk", cryptoKey)
      const pubKeyBytes = Buffer.from(
        jwk.x!.replace(/-/g, "+").replace(/_/g, "/") + "==",
        "base64",
      )

      const pubKeyBase64 = pubKeyBytes.toString("base64")
      const trustedKeys = readJson(".solidiom/trusted-keys.json") as Record<string, unknown> | null
      const trustedKeyList = (trustedKeys as { keys?: Array<{ publicKey: string }> })?.keys ?? []
      const keyTrusted = trustedKeyList.some((k: { publicKey: string }) => k.publicKey === pubKeyBase64)

      results.push({
        check: "inline_sign_attempt",
        pass: true,
        detail: `signature generated (${sigBase64.slice(0, 20)}…), publicKey matches trusted key: ${keyTrusted}`,
      })
    } catch (err) {
      results.push({
        check: "inline_sign_attempt",
        pass: false,
        detail: `failed: ${(err as Error).message}`,
      })
    }
  } else {
    results.push({
      check: "signing_key_available",
      pass: false,
      detail: "REGISTRY_SIGN_KEY not set — set it to enable Ed25519 signing",
    })
  }

  return results
}

async function run(): Promise<void> {
  const results = await main()
  console.log("=== Beta Signing Verification ===\n")
  for (const r of results) {
    const icon = r.pass ? "✓" : "✗"
    console.log(`  ${icon} ${r.check}: ${r.detail}`)
  }

  const allPassed = results.every((r) => r.pass)
  console.log(`\n${allPassed ? "All checks passed." : "Some checks failed — review output above."}`)
  process.exit(allPassed ? 0 : 1)
}

run()
