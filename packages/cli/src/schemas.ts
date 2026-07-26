/**
 * CLI schemas — zod schemas for .solidiom/config.json and .solidiom/policy.json.
 */

import { z } from "zod"

export const ConfigSchema = z.object({
  /** The positioning adapter to use. */
  positioningAdapter: z.string().optional().default("@solidiom/adapter-positioning-floating-ui"),
  /** Source install target directory. */
  sourceDir: z.string().optional().default("src/ui/primitives"),
  /** Runtime target directory for source installs. */
  runtimeDir: z.string().optional().default("src/ui/_runtime"),
  /** Package install mode: "package" or "source". */
  defaultMode: z.enum(["package", "source"]).optional().default("package"),
})

export type Config = z.infer<typeof ConfigSchema>

export const PolicySchema = z.object({
  /** Signature verification mode. */
  signatureMode: z.enum(["sigstore", "trusted-keys", "none"]).optional().default("none"),
  /** Allowed primitive version ranges. */
  allowedPrimitiveVersions: z.record(z.string()).optional().default({}),
  /** Trusted identities for sigstore verification. */
  trustedIdentities: z.array(z.string()).optional().default([]),
})

export type Policy = z.infer<typeof PolicySchema>
