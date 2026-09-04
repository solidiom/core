export const PUBLIC_PRIMITIVES = [
  "accordion",
  "alert",
  "alert-dialog",
  "app-shell",
  "aspect-ratio",
  "attachment",
  "avatar",
  "avatar-group",
  "badge",
  "banner",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "chat-composer",
  "chat-layout",
  "chat-message",
  "chat-message-metadata",
  "chat-system-message",
  "chat-tool-calls",
  "checkbox",
  "code-block",
  "collapsible",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "date-range-input",
  "dialog",
  "direction",
  "drawer",
  "empty-state",
  "field",
  "file-input",
  "grid",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "kbd",
  "label",
  "lightbox",
  "link",
  "listbox",
  "mega-menu",
  "menu",
  "menubar",
  "message-scroller",
  "meter",
  "multi-selector",
  "navigation-menu",
  "number-input",
  "pagination",
  "popover",
  "progress",
  "questionnaire",
  "radio-group",
  "resizable-panels",
  "scroll-area",
  "segmented-control",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "stack",
  "status-dot",
  "switch",
  "table",
  "tabs",
  "time-input",
  "toast",
  "toggle",
  "toggle-group",
  "tokenizer",
  "toolbar",
  "tooltip",
  "tree",
  "typography",
  "virtual-list",
  "visually-hidden",
] as const

export type PublicPrimitive = (typeof PUBLIC_PRIMITIVES)[number]

export const AXE_RESULT_PREFIX = "__SOLIDIOM_AXE_RESULT__:"
export const AXE_RESULTS_SCHEMA_VERSION = 2
export const AXE_EVIDENCE_ID_VERSION = 1

export type AxeScanOutcome = "pass" | "fail"

/** Machine-readable result counts for one isolated primitive scan. */
export interface AxeScanSummary {
  passes: number
  violations: number
  incomplete: number
  outcome: AxeScanOutcome
}

/** Stable evidence reference and its scan summary for one public primitive. */
export interface AxePrimitiveEvidence {
  id: string
  kind: "axe-core-isolated-scan"
  summary: AxeScanSummary
}

export interface AxeScanResult {
  primitive: PublicPrimitive
  evidence: AxePrimitiveEvidence
}

export interface AxeScanResultInput {
  primitive: PublicPrimitive
  passes: number
  violations: number
  incomplete: number
}

export interface AxeResultsArtifact {
  schemaVersion: typeof AXE_RESULTS_SCHEMA_VERSION
  generatedAt: string
  commitSha: string | null
  ciRunUrl: string | null
  browser: "chromium"
  results: AxeScanResult[]
}

/**
 * Stable across runs: it identifies the primitive and evidence format, not a
 * mutable count, timestamp, commit, or axe-core implementation detail.
 */
export function axeEvidenceId(primitive: PublicPrimitive): string {
  return `axe-${primitive}-scan-v${AXE_EVIDENCE_ID_VERSION}`
}

export function createAxeScanResult(input: AxeScanResultInput): AxeScanResult {
  return {
    primitive: input.primitive,
    evidence: {
      id: axeEvidenceId(input.primitive),
      kind: "axe-core-isolated-scan",
      summary: {
        passes: input.passes,
        violations: input.violations,
        incomplete: input.incomplete,
        outcome: input.violations === 0 ? "pass" : "fail",
      },
    },
  }
}

function isNonNegativeInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 0
}

export function validateAxeResultsArtifact(artifact: unknown): string[] {
  if (!artifact || typeof artifact !== "object") {
    return ["Axe result artifact must be an object"]
  }

  const value = artifact as Partial<AxeResultsArtifact>
  const errors: string[] = []

  if (value.schemaVersion !== AXE_RESULTS_SCHEMA_VERSION) {
    errors.push(`Expected schemaVersion ${AXE_RESULTS_SCHEMA_VERSION}`)
  }
  if (!Array.isArray(value.results)) {
    errors.push("Axe result artifact must contain a results array")
    return errors
  }

  const seen = new Set<string>()
  for (const result of value.results) {
    if (!result || typeof result !== "object") {
      errors.push("Axe result entries must be objects")
      continue
    }

    const scan = result as Partial<AxeScanResult>
    if (!PUBLIC_PRIMITIVES.includes(scan.primitive as PublicPrimitive)) {
      errors.push(`Unexpected primitive result: ${String(scan.primitive)}`)
      continue
    }
    if (seen.has(scan.primitive)) {
      errors.push(`Duplicate primitive result: ${scan.primitive}`)
      continue
    }
    seen.add(scan.primitive)

    const evidence = scan.evidence
    if (!evidence || typeof evidence !== "object") {
      errors.push(`${scan.primitive} is missing machine-readable evidence`)
      continue
    }
    if (evidence.id !== axeEvidenceId(scan.primitive)) {
      errors.push(`${scan.primitive} has an unstable or invalid evidence ID`)
    }
    if (evidence.kind !== "axe-core-isolated-scan") {
      errors.push(`${scan.primitive} has an invalid evidence kind`)
    }

    const summary = evidence.summary
    if (!summary || typeof summary !== "object") {
      errors.push(`${scan.primitive} is missing an evidence summary`)
      continue
    }
    for (const key of ["passes", "violations", "incomplete"] as const) {
      if (!isNonNegativeInteger(summary[key])) {
        errors.push(`${scan.primitive} has invalid ${key} count`)
      }
    }
    const expectedOutcome = summary.violations === 0 ? "pass" : "fail"
    if (summary.outcome !== expectedOutcome) {
      errors.push(`${scan.primitive} has an invalid evidence outcome`)
    }
    if (summary.violations > 0) {
      errors.push(`${scan.primitive} has ${summary.violations} axe violation(s)`)
    }
  }

  for (const primitive of PUBLIC_PRIMITIVES) {
    if (!seen.has(primitive)) {
      errors.push(`Missing primitive result: ${primitive}`)
    }
  }

  return errors
}
