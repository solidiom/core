/**
 * @solidiom/release-tools — CI-only artifact signing and verification pipeline.
 *
 * Sigstore keyless signing via @sigstore/sign (GitHub Actions OIDC identity).
 * Sigstore verification via @sigstore/verify.
 * Node crypto signing/verification for enterprise trusted-key workflows.
 * Never bundled into @solidiom/cli — separate package for CI only.
 */
/** Options for signing an artifact. */
export interface SignOptions {
    /** Artifact content to sign. */
    content: Buffer;
    /** Signing mode. */
    mode: "sigstore" | "trusted-key";
    /** Private key (PEM) for trusted-key mode. */
    privateKey?: string;
}
/** Result of a signing operation. */
export interface SignResult {
    /** Base64-encoded signature or sigstore bundle JSON. */
    signature: string;
    /** Signing mode used. */
    mode: "sigstore" | "trusted-key";
    /** Identity associated with the signature (OIDC subject for sigstore). */
    identity?: string;
}
/** Options for verifying an artifact signature. */
export interface VerifyOptions {
    /** Artifact content that was signed. */
    content: Buffer;
    /** The signature or bundle to verify against. */
    signature: string;
    /** Verification mode. */
    mode: "sigstore" | "trusted-key";
    /** Public key (PEM) for trusted-key mode verification. */
    publicKey?: string;
    /** Trusted OIDC identities for sigstore verification (e.g. workflow refs). */
    trustedIdentities?: string[];
}
/** Result of a verification operation. */
export interface VerifyResult {
    /** Whether the signature is valid. */
    verified: boolean;
    /** Identity extracted from the signature (sigstore mode). */
    identity?: string;
    /** Explanation when verification fails. */
    reason?: string;
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
export declare function signArtifact(options: SignOptions): Promise<SignResult>;
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
export declare function verifyArtifact(options: VerifyOptions): Promise<VerifyResult>;
//# sourceMappingURL=index.d.ts.map