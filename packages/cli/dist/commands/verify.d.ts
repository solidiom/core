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
import { Command } from "clipanion";
export interface VerifyOptions {
    cwd: string;
    artifact: string;
    noNetwork?: boolean;
}
export interface VerifyResult {
    verified: boolean;
    mode: "sigstore" | "trusted-keys" | "none";
    reason: string;
    identity?: string;
}
export interface RegistryVerifyResult {
    verified: boolean;
    reason: string;
    primitivesChecked: number;
    violations: string[];
}
/**
 * Fail-closed verification of the registry catalog:
 *   1. registry/index.json must parse against the supported schema version
 *      (readRegistryIndex throws RegistrySchemaError otherwise).
 *   2. Every per-primitive manifest referenced by the index must exist, parse
 *      against the supported manifest schema, and its recorded `filesHash`
 *      must match a fresh SHA-256 recomputation of its `fileDigests`.
 *   3. If `.solidiom/policy.json` requires a signed registry
 *      (`policy.registrySignatureRequired`), `index.integrity.signature` must
 *      be present and verify against `REGISTRY_VERIFY_KEY` (or
 *      `policy.registryTrustedKeys`, tried in order) via HMAC-SHA256 over the
 *      canonical pre-signature JSON. Any failure — missing file, schema
 *      mismatch, digest mismatch, missing/invalid signature — is reported as
 *      a violation and `verified` is false. No partial trust is extended.
 */
export declare function verifyRegistry(options: {
    cwd: string;
    registryDir?: string;
    verifyKeys?: string[];
    requireSignature?: boolean;
}): RegistryVerifyResult;
export declare function runVerify(options: VerifyOptions): Promise<VerifyResult>;
export declare class VerifyCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    artifact: string | undefined;
    noNetwork: boolean;
    json: boolean;
    registry: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=verify.d.ts.map