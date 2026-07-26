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
    /** Package install mode: "package" or "source". */
    defaultMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["package", "source"]>>>;
}, "strip", z.ZodTypeAny, {
    positioningAdapter: string;
    sourceDir: string;
    runtimeDir: string;
    defaultMode: "package" | "source";
}, {
    positioningAdapter?: string | undefined;
    sourceDir?: string | undefined;
    runtimeDir?: string | undefined;
    defaultMode?: "package" | "source" | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const PolicySchema: z.ZodObject<{
    /** Signature verification mode. */
    signatureMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["sigstore", "trusted-keys", "none"]>>>;
    /** Allowed primitive version ranges. */
    allowedPrimitiveVersions: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    /** Trusted identities for sigstore verification. */
    trustedIdentities: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    signatureMode: "sigstore" | "trusted-keys" | "none";
    allowedPrimitiveVersions: Record<string, string>;
    trustedIdentities: string[];
}, {
    signatureMode?: "sigstore" | "trusted-keys" | "none" | undefined;
    allowedPrimitiveVersions?: Record<string, string> | undefined;
    trustedIdentities?: string[] | undefined;
}>;
export type Policy = z.infer<typeof PolicySchema>;
//# sourceMappingURL=schemas.d.ts.map