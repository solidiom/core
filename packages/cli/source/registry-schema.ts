/**
 * Registry v2 schema + versioned reader shared by CLI commands.
 *
 * REG-004: centralizes the schema-version guard so every command that reads
 * registry/index.json or a per-primitive manifest fails closed on an
 * unsupported or malformed schema version instead of silently trusting
 * arbitrary JSON shapes.
 */

import { readFileSync } from "node:fs"
import { z } from "zod"

/** The only registry index schema version this CLI build understands. */
export const SUPPORTED_REGISTRY_INDEX_VERSION = 2 as const

/** The only per-primitive manifest schema this CLI build understands. */
export const SUPPORTED_MANIFEST_SCHEMA_URL = "https://solidiom.dev/schemas/registry-manifest/v2.json"
export const SUPPORTED_INDEX_SCHEMA_URL = "https://solidiom.dev/schemas/registry-index/v2.json"

const integritySchema = z.object({
  algorithm: z.literal("sha256"),
  entriesHash: z.string().regex(/^[0-9a-f]{64}$/),
  signature: z.string().regex(/^[0-9a-f]{64}$/).optional(),
  signedAt: z.string().optional(),
  signatureKeyId: z.string().regex(/^[0-9a-f]{16}$/).optional(),
})

const registryPrimitiveSummarySchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  package: z.string().regex(/^@solidiom\//),
  label: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  status: z.enum(["experimental", "preview", "stable", "deprecated"]),
  deliverables: z.array(z.string()),
  hasAccessibilityEvidence: z.boolean(),
  accessibility: z.object({
    reviewStatus: z.enum(["none", "automated", "manual", "complete"]),
    evidenceIds: z.array(z.string()),
  }),
  documentationStatus: z.enum(["stub", "draft", "review", "complete"]),
  documentationLocales: z.record(
    z.object({
      status: z.enum(["missing", "draft", "stale", "reviewed"]),
      sourceHash: z.string().optional(),
      lastUpdated: z.string().optional(),
    }),
  ),
  stylingOutputs: z.array(z.enum(["css", "tailwind", "unocss"])),
  themeCompatible: z.array(z.string()),
  searchKeywords: z.array(z.string()),
  provenance: z.object({
    repository: z.string(),
    directory: z.string(),
    sourceCommit: z.string().optional(),
  }),
})

const registryAdapterSchema = z.object({
  name: z.string().min(1),
  package: z.string().regex(/^@solidiom\//),
  capability: z.string().regex(/.+@\d+/),
  version: z.string().min(1),
})

export const registryIndexSchema = z.object({
  $schema: z.literal(SUPPORTED_INDEX_SCHEMA_URL),
  version: z.literal(SUPPORTED_REGISTRY_INDEX_VERSION),
  generatedAt: z.string(),
  integrity: integritySchema,
  primitives: z.array(registryPrimitiveSummarySchema),
  adapters: z.array(registryAdapterSchema),
})

export type RegistryIndex = z.infer<typeof registryIndexSchema>
export type RegistryPrimitiveSummary = z.infer<typeof registryPrimitiveSummarySchema>

const manifestIntegritySchema = z.object({
  algorithm: z.literal("sha256"),
  filesHash: z.string().regex(/^[0-9a-f]{64}$/),
  fileDigests: z.record(z.string().regex(/^[0-9a-f]{64}$/)),
  manifestSignature: z.string().optional(),
  lastGenerated: z.string(),
})

export const registryManifestSchema = z.object({
  $schema: z.literal(SUPPORTED_MANIFEST_SCHEMA_URL),
  name: z.string().min(1),
  version: z.string().min(1),
  package: z.string().regex(/^@solidiom\//),
  label: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  status: z.enum(["experimental", "preview", "stable", "deprecated"]),
  source: z.object({
    entry: z.string().min(1),
    files: z.array(z.string()),
  }),
  dependencies: z.array(z.string()),
  integrity: manifestIntegritySchema,
})

export type RegistryManifest = z.infer<typeof registryManifestSchema>

export class RegistrySchemaError extends Error {
  constructor(
    message: string,
    readonly path: string,
  ) {
    super(message)
    this.name = "RegistrySchemaError"
  }
}

/**
 * Parses and validates registry/index.json against the supported schema
 * version. Throws `RegistrySchemaError` — rather than returning a partially
 * trusted object — on any version mismatch or shape violation so callers
 * fail closed instead of operating on unverified data.
 */
export function readRegistryIndex(path: string): RegistryIndex {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, "utf8"))
  } catch (err) {
    throw new RegistrySchemaError(`Failed to read/parse registry index: ${String(err)}`, path)
  }

  if (isRecord(raw) && raw.version !== undefined && raw.version !== SUPPORTED_REGISTRY_INDEX_VERSION) {
    throw new RegistrySchemaError(
      `Unsupported registry index schema version ${JSON.stringify(raw.version)}; this CLI build only supports version ${SUPPORTED_REGISTRY_INDEX_VERSION}`,
      path,
    )
  }

  const result = registryIndexSchema.safeParse(raw)
  if (!result.success) {
    throw new RegistrySchemaError(
      `registry index failed schema validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      path,
    )
  }

  return result.data
}

/**
 * Parses and validates a per-primitive manifest against the supported schema.
 * Same fail-closed behavior as `readRegistryIndex`.
 */
export function readRegistryManifest(path: string): RegistryManifest {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, "utf8"))
  } catch (err) {
    throw new RegistrySchemaError(`Failed to read/parse registry manifest: ${String(err)}`, path)
  }

  if (isRecord(raw) && raw.$schema !== undefined && raw.$schema !== SUPPORTED_MANIFEST_SCHEMA_URL) {
    throw new RegistrySchemaError(
      `Unsupported registry manifest schema ${JSON.stringify(raw.$schema)}; this CLI build only supports ${SUPPORTED_MANIFEST_SCHEMA_URL}`,
      path,
    )
  }

  const result = registryManifestSchema.safeParse(raw)
  if (!result.success) {
    throw new RegistrySchemaError(
      `registry manifest failed schema validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      path,
    )
  }

  return result.data
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
