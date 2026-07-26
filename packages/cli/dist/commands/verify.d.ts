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
export declare function runVerify(options: VerifyOptions): Promise<VerifyResult>;
export declare class VerifyCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    artifact: string;
    noNetwork: boolean;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=verify.d.ts.map