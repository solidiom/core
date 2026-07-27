/**
 * Types for the adapter authoring kit.
 */

/** Describes a capability an adapter provides. */
export interface CapabilityDeclaration {
  /** Capability name (e.g. "positioning", "virtualization"). */
  name: string
  /** Capability version (semver major). */
  version: number
}

/** Manifest for an adapter package. */
export interface AdapterManifest {
  /** Package name (e.g. "@solidiom/adapter-positioning-floating-ui"). */
  name: string
  /** Human-readable label. */
  label: string
  /** Brief description. */
  description: string
  /** The framework-neutral engine this adapter wraps. */
  engine: string
  /** Capabilities provided by this adapter. */
  capabilities: CapabilityDeclaration[]
  /** Entry point relative to package root. */
  entry: string
}

/** Forbidden dependency patterns for adapter packages (§23 #6–#14). */
export const FORBIDDEN_ADAPTER_DEPS = [
  // Primitive systems — §23 #1, #7
  /^@kobalte\//,
  /^@corvu\//,
  /^@ark-ui\//,
  /^@zag-js\//,
  /^@radix-ui\//,
  /^@base-ui\//,
  /^react-aria/,
  /^@react-aria\//,
  // Solid framework bindings — adapters must be framework-neutral
  /^solid-js$/,
  /^@solidjs\//,
] as const

/** Forbidden output patterns in adapter source code (§23 #9, #10). */
export const FORBIDDEN_OUTPUT_PATTERNS = [
  // Classes / styles — §23 #10
  { pattern: /className\s*[:=]/, reason: "Adapter must not output class names (§23 #10)" },
  { pattern: /classList\s*[:=]/, reason: "Adapter must not output classList (§23 #10)" },
  { pattern: /style\s*[:=]\s*\{/, reason: "Adapter must not output style objects (§23 #10)" },
  // ARIA attributes — §23 #10
  { pattern: /["']aria-/, reason: "Adapter must not output ARIA attributes (§23 #10)" },
  // data-* semantic attributes — §23 #10
  { pattern: /["']data-scope["']/, reason: "Adapter must not output data-scope attributes (§23 #10)" },
  { pattern: /["']data-part["']/, reason: "Adapter must not output data-part attributes (§23 #10)" },
  // Role attributes — §23 #10
  { pattern: /["']role["']\s*:/, reason: "Adapter must not output role attributes (§23 #10)" },
] as const
