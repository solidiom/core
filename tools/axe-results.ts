export const PUBLIC_PRIMITIVES = [
  "accordion",
  "alert",
  "badge",
  "button",
  "calendar",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command-palette",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "field",
  "input-otp",
  "label",
  "listbox",
  "menu",
  "meter",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable-panels",
  "scroll-area",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree",
  "virtual-list",
  "visually-hidden",
] as const

export type PublicPrimitive = (typeof PUBLIC_PRIMITIVES)[number]

export const AXE_RESULT_PREFIX = "__SOLIDIOM_AXE_RESULT__:"
export const AXE_RESULTS_SCHEMA_VERSION = 1

export interface AxeScanResult {
  primitive: PublicPrimitive
  violations: number
  incomplete: number
  passes: number
}

export interface AxeResultsArtifact {
  schemaVersion: typeof AXE_RESULTS_SCHEMA_VERSION
  generatedAt: string
  commitSha: string | null
  ciRunUrl: string | null
  browser: "chromium"
  results: AxeScanResult[]
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
    }
    if (typeof scan.primitive === "string") {
      if (seen.has(scan.primitive)) {
        errors.push(`Duplicate primitive result: ${scan.primitive}`)
      }
      seen.add(scan.primitive)
    }
    for (const key of ["violations", "incomplete", "passes"] as const) {
      if (!Number.isInteger(scan[key]) || (scan[key] ?? -1) < 0) {
        errors.push(`${String(scan.primitive)} has invalid ${key} count`)
      }
    }
    if ((scan.violations ?? 0) > 0) {
      errors.push(`${String(scan.primitive)} has ${scan.violations} axe violation(s)`)
    }
  }

  for (const primitive of PUBLIC_PRIMITIVES) {
    if (!seen.has(primitive)) {
      errors.push(`Missing primitive result: ${primitive}`)
    }
  }

  return errors
}
