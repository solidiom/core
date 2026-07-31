/**
 * CLI schemas — zod schemas for .solidiom/config.json and .solidiom/policy.json.
 */
import { z } from "zod";
export declare const ConfigSchema: z.ZodObject<{
    /** The positioning adapter to use. */
    positioningAdapter: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Source install target directory. */
    sourceDir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Runtime target directory for source installs. */
    runtimeDir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Source install target directory for "component" deliverables (CLI-004). */
    componentDir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Source install target directory for "block" deliverables (CLI-004). */
    blockDir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Source install target directory for "theme" deliverables (CLI-004). */
    themeDir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    /** Package install mode: "package" or "source". */
    defaultMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["package", "source"]>>>;
    /**
     * Styling profile chosen at `init` time. No default — a project has no
     * styling profile until one is explicitly chosen (CLI-004). Left optional
     * here; wiring an init-time prompt for this is out of scope for CLI-004.
     */
    stylingProfile: z.ZodOptional<z.ZodEnum<["css", "tailwind", "unocss"]>>;
}, "strip", z.ZodTypeAny, {
    positioningAdapter: string;
    sourceDir: string;
    runtimeDir: string;
    componentDir: string;
    blockDir: string;
    themeDir: string;
    defaultMode: "package" | "source";
    stylingProfile?: "css" | "tailwind" | "unocss" | undefined;
}, {
    positioningAdapter?: string | undefined;
    sourceDir?: string | undefined;
    runtimeDir?: string | undefined;
    componentDir?: string | undefined;
    blockDir?: string | undefined;
    themeDir?: string | undefined;
    defaultMode?: "package" | "source" | undefined;
    stylingProfile?: "css" | "tailwind" | "unocss" | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const PolicySchema: z.ZodObject<{
    /** Signature verification mode. */
    signatureMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["sigstore", "trusted-keys", "none"]>>>;
    /** Allowed primitive version ranges. */
    allowedPrimitiveVersions: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    /** Trusted identities for sigstore verification. */
    trustedIdentities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    /** When true, `solidiom verify --registry` fails closed if the registry index is unsigned. */
    registrySignatureRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** HMAC keys accepted when verifying the registry index signature. */
    registryTrustedKeys: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    /** When true (the default), source installs must pass byte-level verification against the registry manifest before any file is written (CLI-003). */
    requireVerifiedSource: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** HMAC keys accepted when verifying source-install byte-level integrity (CLI-003). */
    sourceInstallTrustedKeys: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    signatureMode: "sigstore" | "trusted-keys" | "none";
    allowedPrimitiveVersions: Record<string, string>;
    trustedIdentities: string[];
    registrySignatureRequired: boolean;
    registryTrustedKeys: string[];
    requireVerifiedSource: boolean;
    sourceInstallTrustedKeys: string[];
}, {
    signatureMode?: "sigstore" | "trusted-keys" | "none" | undefined;
    allowedPrimitiveVersions?: Record<string, string> | undefined;
    trustedIdentities?: string[] | undefined;
    registrySignatureRequired?: boolean | undefined;
    registryTrustedKeys?: string[] | undefined;
    requireVerifiedSource?: boolean | undefined;
    sourceInstallTrustedKeys?: string[] | undefined;
}>;
export type Policy = z.infer<typeof PolicySchema>;
//# sourceMappingURL=schemas.d.ts.map