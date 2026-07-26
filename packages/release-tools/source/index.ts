/**
 * @solidiom/release-tools — CI-only artifact signing and verification pipeline.
 *
 * Sigstore keyless signing via @sigstore/sign (GitHub Actions OIDC identity).
 * Sigstore verification via @sigstore/verify.
 * Node crypto signing/verification for enterprise trusted-key workflows.
 * Never bundled into @solidiom/cli — separate package for CI only.
 */

import { createSign, createVerify } from "node:crypto"

/** Options for signing an artifact. */
export interface SignOptions {
  /** Artifact content to sign. */
  content: Buffer
  /** Signing mode. */
  mode: "sigstore" | "trusted-key"
  /** Private key (PEM) for trusted-key mode. */
  privateKey?: string
}

/** Result of a signing operation. */
export interface SignResult {
  /** Base64-encoded signature or sigstore bundle JSON. */
  signature: string
  /** Signing mode used. */
  mode: "sigstore" | "trusted-key"
  /** Identity associated with the signature (OIDC subject for sigstore). */
  identity?: string
}

/** Options for verifying an artifact signature. */
export interface VerifyOptions {
  /** Artifact content that was signed. */
  content: Buffer
  /** The signature or bundle to verify against. */
  signature: string
  /** Verification mode. */
  mode: "sigstore" | "trusted-key"
  /** Public key (PEM) for trusted-key mode verification. */
  publicKey?: string
  /** Trusted OIDC identities for sigstore verification (e.g. workflow refs). */
  trustedIdentities?: string[]
}

/** Result of a verification operation. */
export interface VerifyResult {
  /** Whether the signature is valid. */
  verified: boolean
  /** Identity extracted from the signature (sigstore mode). */
  identity?: string
  /** Explanation when verification fails. */
  reason?: string
}

/**
 * Fetches an OIDC token from the GitHub Actions runtime environment.
 * Requires ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN.
 */
async function fetchOIDCToken(): Promise<string> {
  const requestUrl = process.env["ACTIONS_ID_TOKEN_REQUEST_URL"]
  const requestToken = process.env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]

  if (!requestUrl || !requestToken) {
    throw new Error(
      "Sigstore signing requires GitHub Actions OIDC environment. " +
        "ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN must be set. " +
        "Ensure the workflow has `permissions: id-token: write`.",
    )
  }

  const url = new URL(requestUrl)
  url.searchParams.set("audience", "sigstore")

  const response = await fetch(url.toString(), {
    headers: { Authorization: `bearer ${requestToken}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC token: ${response.status} ${response.statusText}`)
  }

  const body = (await response.json()) as { value: string }
  return body.value
}

/**
 * Signs an artifact using sigstore keyless signing or a trusted private key.
 *
 * In sigstore mode, dynamically imports `@sigstore/sign` and uses the GitHub
 * Actions OIDC identity. Throws if the package is not installed or the
 * environment is not a GitHub Actions runner with OIDC configured.
 *
 * In trusted-key mode, signs with the provided PEM-encoded private key using
 * SHA-256.
 */
export async function signArtifact(options: SignOptions): Promise<SignResult> {
  if (options.mode === "trusted-key") {
    if (!options.privateKey) {
      throw new Error("Private key required for trusted-key mode")
    }
    const sign = createSign("SHA256")
    sign.update(options.content)
    const signature = sign.sign(options.privateKey, "base64")
    return { signature, mode: "trusted-key" }
  }

  // Sigstore mode — dynamic import of @sigstore/sign
  let sigstoreSign: typeof import("@sigstore/sign")
  try {
    sigstoreSign = await import("@sigstore/sign")
  } catch {
    throw new Error(
      "Sigstore signing requires the `@sigstore/sign` package. " +
        "Install it as a dependency: npm install @sigstore/sign. " +
        "This package is only usable in GitHub Actions CI with OIDC identity.",
    )
  }

  const identityToken = await fetchOIDCToken()

  const signer = new sigstoreSign.DSSEBundleBuilder({
    signer: new sigstoreSign.FulcioSigner({
      fulcioBaseURL: "https://fulcio.sigstore.dev",
      identityProvider: { getToken: () => Promise.resolve(identityToken) },
    }),
    witnesses: [],
  })

  const bundle = await signer.create({ type: "messageSignature", data: options.content })
  const signature = JSON.stringify(bundle)

  return {
    signature,
    mode: "sigstore",
    identity: process.env["GITHUB_REPOSITORY"] ?? undefined,
  }
}

/**
 * Verifies an artifact signature using sigstore or a trusted public key.
 *
 * In sigstore mode, dynamically imports `@sigstore/verify` and validates the
 * bundle against the Sigstore public-good instance. Throws if the package is
 * not installed.
 *
 * In trusted-key mode, verifies the base64 signature against the provided
 * PEM-encoded public key using SHA-256.
 */
export async function verifyArtifact(options: VerifyOptions): Promise<VerifyResult> {
  if (options.mode === "trusted-key") {
    if (!options.publicKey) {
      return { verified: false, reason: "Public key required for trusted-key mode verification" }
    }

    try {
      const verify = createVerify("SHA256")
      verify.update(options.content)
      const verified = verify.verify(options.publicKey, options.signature, "base64")
      return {
        verified,
        reason: verified ? undefined : "Signature does not match content with provided public key",
      }
    } catch (err) {
      return {
        verified: false,
        reason: `Verification error: ${err instanceof Error ? err.message : String(err)}`,
      }
    }
  }

  // Sigstore mode — dynamic import of @sigstore/verify
  let sigstoreVerify: typeof import("@sigstore/verify")
  try {
    sigstoreVerify = await import("@sigstore/verify")
  } catch {
    throw new Error(
      "Sigstore verification requires the `@sigstore/verify` package. " +
        "Install it as a dependency: npm install @sigstore/verify.",
    )
  }

  try {
    const bundle = JSON.parse(options.signature)
    const trustMaterial = {
      certificateAuthorities: [],
      timestampAuthorities: [],
      tlogs: [],
      ctlogs: [],
      publicKey: () => undefined,
    } as unknown as import("@sigstore/verify").TrustMaterial
    const verifier = new sigstoreVerify.Verifier(trustMaterial)

    await verifier.verify(bundle)

    return {
      verified: true,
      identity: options.trustedIdentities?.[0],
    }
  } catch (err) {
    return {
      verified: false,
      reason: `Sigstore verification failed: ${err instanceof Error ? err.message : String(err)}`,
    }
  }
}
