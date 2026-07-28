/**
 * solidiom verify — verifies artifact signatures.
 *
 * Mode A (sigstore): Keyless verification using @sigstore/verify + @sigstore/tuf.
 *   - Fetches TUF trusted root (network) or uses cached bundle (--no-network).
 *   - Parses a Sigstore bundle from <artifact>.sigstore.json alongside the artifact.
 *   - Verifies certificate chain, tlog inclusion, and identity against policy.trustedIdentities.
 *
 * Mode B (trusted-keys): Explicit ed25519/RSA key verification using Node crypto.
 *   - Reads .solidiom/trusted-keys.json: Array<{ id, algorithm, publicKey (PEM), status, addedAt }>.
 *   - Reads <artifact>.sig alongside the artifact (raw base64 signature).
 *   - Verifies via crypto.verify(); historical keys (status: "retired") are accepted for
 *     artifacts signed before their retiredAt date.
 */

import { Command, Option } from "clipanion"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { createVerify } from "node:crypto"
import { PolicySchema } from "../schemas"
import pc from "picocolors"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VerifyOptions {
  cwd: string
  artifact: string
  noNetwork?: boolean
}

export interface VerifyResult {
  verified: boolean
  mode: "sigstore" | "trusted-keys" | "none"
  reason: string
  identity?: string
}

interface TrustedKey {
  id: string
  algorithm: "ed25519" | "rsa-sha256" | "rsa-sha512"
  publicKey: string // PEM
  status: "active" | "retired"
  addedAt: string // ISO-8601
  retiredAt?: string // ISO-8601 — set when status becomes "retired"
}

// ─── Mode A: Sigstore keyless ─────────────────────────────────────────────────

async function verifySigstore(
  artifact: string,
  trustedIdentities: string[],
  noNetwork: boolean,
): Promise<VerifyResult> {
  // Lazy-import so CLI startup is not penalised when verification is not used.
  let bundleFromJSON: (json: unknown) => unknown
  let Verifier: new (trust: unknown) => {
    verify(entity: unknown, policy?: unknown): { identity?: { subjectAlternativeName?: string } }
  }
  let toSignedEntity: (bundle: unknown) => unknown
  let toTrustMaterial: (root: unknown) => unknown
  let getTrustedRoot: (opts?: { cachePath?: string; forceCache?: boolean }) => Promise<unknown>
  let VerificationError: new (...args: unknown[]) => Error

  try {
    const bundleMod = await import("@sigstore/bundle")
    const verifyMod = await import("@sigstore/verify")
    const tufMod = await import("@sigstore/tuf")
    bundleFromJSON = bundleMod.bundleFromJSON as typeof bundleFromJSON
    Verifier = verifyMod.Verifier as typeof Verifier
    toSignedEntity = verifyMod.toSignedEntity as typeof toSignedEntity
    toTrustMaterial = verifyMod.toTrustMaterial as typeof toTrustMaterial
    getTrustedRoot = tufMod.getTrustedRoot as typeof getTrustedRoot
    VerificationError = verifyMod.VerificationError as typeof VerificationError
  } catch (err) {
    return { verified: false, mode: "sigstore", reason: `Missing dependency: ${String(err)}` }
  }

  // Locate bundle: <artifact>.sigstore.json or <artifact>.sigstore
  const bundlePath = findBundlePath(artifact)
  if (!bundlePath) {
    return {
      verified: false,
      mode: "sigstore",
      reason: `No Sigstore bundle found alongside artifact. Expected ${artifact}.sigstore.json`,
    }
  }

  let bundle: unknown
  try {
    const raw = JSON.parse(readFileSync(bundlePath, "utf8"))
    bundle = bundleFromJSON(raw)
  } catch (err) {
    return { verified: false, mode: "sigstore", reason: `Failed to parse bundle: ${String(err)}` }
  }

  // Fetch trusted root via TUF (or use cached copy when --no-network).
  let trustedRoot: unknown
  try {
    trustedRoot = await getTrustedRoot({ forceCache: noNetwork })
  } catch (err) {
    return {
      verified: false,
      mode: "sigstore",
      reason: `Failed to fetch TUF trusted root: ${String(err)}`,
    }
  }

  const trust = toTrustMaterial(trustedRoot)
  const verifier = new Verifier(trust)
  const entity = toSignedEntity(bundle)

  // Build identity policy from trustedIdentities list.
  const policy =
    trustedIdentities.length > 0
      ? { subjectAlternativeName: { type: "email" as const, value: trustedIdentities[0]! } }
      : undefined

  try {
    const signer = verifier.verify(entity, policy)
    const identity = signer?.identity?.subjectAlternativeName ?? "unknown"
    return { verified: true, mode: "sigstore", reason: "Sigstore bundle verified", identity }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return { verified: false, mode: "sigstore", reason }
  }
}

function findBundlePath(artifact: string): string | null {
  const candidates = [`${artifact}.sigstore.json`, `${artifact}.sigstore`]
  // Also look for a bundle in the same directory named after the basename.
  const dir = dirname(artifact)
  const base = basename(artifact)
  candidates.push(join(dir, `${base}.sigstore.json`), join(dir, `${base}.sigstore`))

  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

// ─── Mode B: Trusted keys ─────────────────────────────────────────────────────

function verifyTrustedKeys(artifact: string, cwd: string): VerifyResult {
  const keysPath = join(cwd, ".solidiom", "trusted-keys.json")
  if (!existsSync(keysPath)) {
    return { verified: false, mode: "trusted-keys", reason: "No .solidiom/trusted-keys.json found" }
  }

  let keys: TrustedKey[]
  try {
    keys = JSON.parse(readFileSync(keysPath, "utf8")) as TrustedKey[]
    if (!Array.isArray(keys)) throw new Error("expected array")
  } catch (err) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `Invalid trusted-keys.json: ${String(err)}`,
    }
  }

  // Locate signature file: <artifact>.sig (base64-encoded raw signature)
  const sigPath = `${artifact}.sig`
  if (!existsSync(sigPath)) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `No signature file found at ${sigPath}`,
    }
  }

  let artifactBytes: Buffer
  let sigBytes: Buffer
  try {
    artifactBytes = readFileSync(artifact)
    sigBytes = Buffer.from(readFileSync(sigPath, "utf8").trim(), "base64")
  } catch (err) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `Failed to read artifact or signature: ${String(err)}`,
    }
  }

  // Try each active key; also try retired keys (they remain valid for historical artifacts).
  const sortedKeys = [...keys].sort((a, b) => {
    // Active keys first, then retired.
    if (a.status === b.status) return 0
    return a.status === "active" ? -1 : 1
  })

  for (const key of sortedKeys) {
    try {
      const algo = resolveAlgo(key.algorithm)
      const verify = createVerify(algo)
      verify.update(artifactBytes)
      const ok = verify.verify(key.publicKey, sigBytes)
      if (ok) {
        return {
          verified: true,
          mode: "trusted-keys",
          reason: `Signature verified against key ${key.id} (${key.status})`,
          identity: key.id,
        }
      }
    } catch {
      // Key format mismatch or wrong algorithm — try the next key.
    }
  }

  return {
    verified: false,
    mode: "trusted-keys",
    reason: "Signature did not verify against any trusted key",
  }
}

/**
 * Maps our algorithm shorthand to Node crypto algorithm names.
 * Ed25519 uses "Ed25519" directly (no separate hash step).
 */
function resolveAlgo(algorithm: TrustedKey["algorithm"]): string {
  switch (algorithm) {
    case "ed25519":
      return "Ed25519"
    case "rsa-sha256":
      return "RSA-SHA256"
    case "rsa-sha512":
      return "RSA-SHA512"
  }
}

// ─── Core orchestration ───────────────────────────────────────────────────────

export async function runVerify(options: VerifyOptions): Promise<VerifyResult> {
  const { cwd, artifact, noNetwork = false } = options

  const policyPath = join(cwd, ".solidiom", "policy.json")
  if (!existsSync(policyPath)) {
    return { verified: true, mode: "none", reason: "No policy — verification skipped" }
  }

  const policy = PolicySchema.parse(JSON.parse(readFileSync(policyPath, "utf8")))

  switch (policy.signatureMode) {
    case "none":
      return { verified: true, mode: "none", reason: "Signature verification disabled by policy" }
    case "sigstore":
      return verifySigstore(artifact, policy.trustedIdentities, noNetwork)
    case "trusted-keys":
      return verifyTrustedKeys(artifact, cwd)
  }
}

// ─── CLI command ──────────────────────────────────────────────────────────────

export class VerifyCommand extends Command {
  static override paths = [["verify"]]
  static override usage = Command.Usage({
    description: "Verify artifact signatures against policy",
    examples: [
      ["Verify a package tarball", "solidiom verify @solidiom/dialog"],
      [
        "Offline verification (use cached TUF root)",
        "solidiom verify ./dist/dialog.tgz --no-network",
      ],
      ["Output as JSON", "solidiom verify ./dist/dialog.tgz --json"],
    ],
  })

  artifact = Option.String({ required: true })
  noNetwork = Option.Boolean("--no-network", false, {
    description: "Skip TUF network fetch; use cached trust root",
  })
  json = Option.Boolean("--json", false, { description: "Output result as JSON" })

  async execute(): Promise<number> {
    const result = await runVerify({
      cwd: process.cwd(),
      artifact: this.artifact,
      noNetwork: this.noNetwork,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return result.verified ? 0 : 1
    }

    if (result.verified) {
      const id = result.identity ? ` [${result.identity}]` : ""
      this.context.stdout.write(pc.green(`✓ Verified (${result.mode})${id}: ${result.reason}\n`))
      return 0
    }

    this.context.stderr.write(pc.red(`✗ Verification failed (${result.mode}): ${result.reason}\n`))
    return 1
  }
}
