/**
 * Byte-level source-install verification (CLI-003).
 *
 * verifyRegistry() (../commands/verify.ts) verifies index-level trust and
 * recomputes each manifest's filesHash FROM its recorded fileDigests — but it
 * never hashes real file bytes on disk (or in memory, for files about to be
 * written). That means a tampered/corrupted source tree can still pass
 * verifyRegistry even though the actual bytes don't match what the registry
 * claims they should be.
 *
 * verifySourceIntegrity closes that gap: given the actual byte content of
 * every file about to be installed, it (a) delegates to verifyRegistry for
 * index-level trust, then (b) computes a fresh SHA-256 digest of each passed
 * file's real content and compares it against the manifest's
 * integrity.fileDigests[relPath]. A mismatch, a file with no corresponding
 * digest entry, or a digest entry with no corresponding file are all
 * violations.
 *
 * This function is PURE — it only reads the registry manifest from disk and
 * compares digests in memory. It never writes anything.
 */

import { existsSync } from "node:fs"
import { join } from "node:path"
import {
  readRegistryIndex,
  readRegistryManifest,
  RegistrySchemaError,
  type RegistryManifest,
} from "../registry-schema"
import { verifyRegistry } from "../commands/verify"
import { computeDigest } from "./lock"

export interface SourceVerifyResult {
  verified: boolean
  violations: string[]
  manifestFilesHash?: string
  signatureKeyId?: string
  verifiedAt: string
}

export interface VerifySourceIntegrityOptions {
  cwd: string
  registryDir?: string
  primitive: string
  files: Map<string, string> | Array<{ relPath: string; content: string }>
  /** Ed25519 public keys (base64-encoded raw) accepted when verifying the registry index signature (see verifyRegistry). */
  verifyKeys?: string[]
  /** When true, verifyRegistry fails closed if the registry index is unsigned. */
  requireSignature?: boolean
}

/**
 * Resolve the registry directory the same way plan.ts's loadRegistry does:
 * custom override, then env var, then monorepo-relative, then node_modules,
 * then the local registry cache. Returns the first candidate directory that
 * actually contains an index.json, or null if none do.
 */
function resolveRegistryDir(cwd: string, registryDirOverride?: string): string | null {
  const candidates = [
    registryDirOverride ?? null,
    process.env["SOLIDIOM_REGISTRY_PATH"] ?? null,
    join(cwd, "..", "..", "registry"),
    join(cwd, "node_modules", "@solidiom", "registry"),
  ].filter(Boolean) as string[]

  for (const dir of candidates) {
    if (existsSync(join(dir, "index.json"))) return dir
  }

  return null
}

/**
 * Resolve the primitive's manifest path, mirroring inspect.ts's
 * resolveManifestPath candidate order, with a final fallback to the local
 * .solidiom/registry-cache.json-adjacent manifest (per-primitive manifests
 * living alongside the cached index).
 */
function resolveManifestPath(
  primitive: string,
  cwd: string,
  registryDirOverride?: string,
): string | null {
  const registryDir = resolveRegistryDir(cwd, registryDirOverride)
  const candidates = [
    registryDirOverride ? join(registryDirOverride, `${primitive}.json`) : null,
    process.env["SOLIDIOM_REGISTRY_PATH"]
      ? join(process.env["SOLIDIOM_REGISTRY_PATH"], `${primitive}.json`)
      : null,
    registryDir ? join(registryDir, `${primitive}.json`) : null,
    join(cwd, "..", "..", "registry", `${primitive}.json`),
    join(cwd, "node_modules", "@solidiom", "registry", `${primitive}.json`),
    join(cwd, ".solidiom", "registry-cache", `${primitive}.json`),
  ].filter(Boolean) as string[]

  return candidates.find((path) => existsSync(path)) ?? null
}

/** Normalize the `files` param into a Map, regardless of which shape the caller passed. */
function toFileMap(
  files: Map<string, string> | Array<{ relPath: string; content: string }>,
): Map<string, string> {
  if (files instanceof Map) return files
  const map = new Map<string, string>()
  for (const { relPath, content } of files) map.set(relPath, content)
  return map
}

export function verifySourceIntegrity(options: VerifySourceIntegrityOptions): SourceVerifyResult {
  const {
    cwd,
    registryDir: registryDirOverride,
    primitive,
    files: filesInput,
    verifyKeys = [],
    requireSignature = false,
  } = options
  const verifiedAt = new Date().toISOString()
  const files = toFileMap(filesInput)

  // (b) Index-level trust via verifyRegistry.
  const registryDir = resolveRegistryDir(cwd, registryDirOverride) ?? undefined
  const registryResult = verifyRegistry({
    cwd,
    registryDir,
    verifyKeys,
    requireSignature,
  })

  if (!registryResult.verified) {
    return {
      verified: false,
      violations:
        registryResult.violations.length > 0 ? registryResult.violations : [registryResult.reason],
      verifiedAt,
    }
  }

  // (a) Resolve the primitive's manifest.
  const manifestPath = resolveManifestPath(primitive, cwd, registryDirOverride)
  if (!manifestPath) {
    return {
      verified: false,
      violations: [`No registry manifest found for primitive "${primitive}"`],
      verifiedAt,
    }
  }

  let manifest: RegistryManifest
  try {
    manifest = readRegistryManifest(manifestPath)
  } catch (err) {
    const reason = err instanceof RegistrySchemaError ? err.message : String(err)
    return {
      verified: false,
      violations: [`Manifest for "${primitive}" failed schema verification: ${reason}`],
      verifiedAt,
    }
  }

  // (c) Byte-level comparison of the ACTUAL passed-in file content against
  // the manifest's recorded fileDigests.
  const violations: string[] = []
  const fileDigests = manifest.integrity.fileDigests

  for (const [relPath, content] of files) {
    const expected = fileDigests[relPath]
    if (expected === undefined) {
      violations.push(
        `${relPath}: present in source files but has no entry in manifest fileDigests`,
      )
      continue
    }
    const actual = computeDigest(content)
    if (actual !== expected) {
      violations.push(`${relPath}: content digest mismatch — expected ${expected}, got ${actual}`)
    }
  }

  for (const relPath of Object.keys(fileDigests)) {
    if (!files.has(relPath)) {
      violations.push(`${relPath}: present in manifest fileDigests but missing from source files`)
    }
  }

  // Surface the index's signatureKeyId (when the registry index is signed) —
  // this is the "signing key id" a LockEntry should carry, distinct from the
  // per-manifest manifestSignature field.
  let signatureKeyId: string | undefined
  if (registryDir) {
    try {
      const index = readRegistryIndex(join(registryDir, "index.json"))
      signatureKeyId = index.integrity.signatureKeyId
    } catch {
      // Already validated via verifyRegistry above; if this somehow throws,
      // just omit signatureKeyId rather than failing a verification we've
      // already determined passed.
    }
  }

  return {
    verified: violations.length === 0,
    violations,
    manifestFilesHash: manifest.integrity.filesHash,
    ...(signatureKeyId ? { signatureKeyId } : {}),
    verifiedAt,
  }
}
