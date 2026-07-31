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
  /** Source install target directory for "component" deliverables (CLI-004). */
  componentDir: z.string().optional().default("src/ui/components"),
  /** Source install target directory for "block" deliverables (CLI-004). */
  blockDir: z.string().optional().default("src/ui/blocks"),
  /** Source install target directory for "theme" deliverables (CLI-004). */
  themeDir: z.string().optional().default("src/ui/themes"),
  /** Package install mode: "package" or "source". */
  defaultMode: z.enum(["package", "source"]).optional().default("package"),
  /**
   * Styling profile chosen at `init` time. No default — a project has no
   * styling profile until one is explicitly chosen (CLI-004). Left optional
   * here; wiring an init-time prompt for this is out of scope for CLI-004.
   */
  stylingProfile: z.enum(["css", "tailwind", "unocss"]).optional(),
})

export type Config = z.infer<typeof ConfigSchema>

export const PolicySchema = z.object({
  /** Signature verification mode. */
  signatureMode: z.enum(["sigstore", "trusted-keys", "none"]).optional().default("none"),
  /** Allowed primitive version ranges. */
  allowedPrimitiveVersions: z.record(z.string()).optional().default({}),
  /** Trusted identities for sigstore verification. */
  trustedIdentities: z.array(z.string()).optional().default([]),
  /** When true, `solidiom verify --registry` fails closed if the registry index is unsigned. */
  registrySignatureRequired: z.boolean().optional().default(false),
  /** HMAC keys accepted when verifying the registry index signature. */
  registryTrustedKeys: z.array(z.string()).optional().default([]),
  /** When true (the default), source installs must pass byte-level verification against the registry manifest before any file is written (CLI-003). */
  requireVerifiedSource: z.boolean().optional().default(true),
  /** HMAC keys accepted when verifying source-install byte-level integrity (CLI-003). */
  sourceInstallTrustedKeys: z.array(z.string()).optional().default([]),
})

export type Policy = z.infer<typeof PolicySchema>
