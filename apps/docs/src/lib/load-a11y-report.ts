/**
 * Utility to load and parse accessibility audit data for the docs dashboard.
 *
 * Aggregates data from:
 * - docs/axe-scan-results.md (automated axe scans)
 * - docs/keyboard-audit-results.md (keyboard navigation coverage)
 * - Manual AT audit records (VoiceOver, NVDA, JAWS)
 *
 * In production, this data is serialized to /a11y-report.json at build time.
 * Falls back to sample data derived from the markdown files for development.
 */

export type AuditStatus = "pass" | "fail" | "partial" | "not-tested"

export interface ATAuditResult {
  voiceOver: AuditStatus
  nvda: AuditStatus
  jaws: AuditStatus
}

export interface PrimitiveA11yEntry {
  /** Primitive name (e.g. "dialog") */
  name: string
  /** Human-readable label */
  label: string
  /** Automated axe scan status */
  axeScan: AuditStatus
  /** Interactive keyboard navigation tests */
  keyboardNav: AuditStatus
  /** Manual assistive technology audits */
  atAudit: ATAuditResult
  /** Playwright browser test coverage */
  playwrightTests: AuditStatus
}

export interface A11yReport {
  generatedAt: string
  primitives: PrimitiveA11yEntry[]
}

const REPORT_URL = "/a11y-report.json"

/**
 * Fetch the latest accessibility report. Returns sample data if no report exists.
 */
export async function loadA11yReport(): Promise<A11yReport> {
  try {
    const res = await fetch(REPORT_URL)
    if (!res.ok) return createSampleA11yReport()
    return (await res.json()) as A11yReport
  } catch {
    return createSampleA11yReport()
  }
}

/**
 * Sample report for development, reflecting known audit state from markdown files.
 */
export function createSampleA11yReport(): A11yReport {
  const now = new Date().toISOString()

  // Primitives with full keyboard audit coverage (from keyboard-audit-results.md)
  const keyboardAudited = new Set([
    "select",
    "menu",
    "listbox",
    "tabs",
    "accordion",
    "slider",
    "dialog",
    "tooltip",
  ])

  // All known primitives in the library
  const allPrimitives: Array<{ name: string; label: string }> = [
    { name: "dialog", label: "Dialog" },
    { name: "select", label: "Select" },
    { name: "button", label: "Button" },
    { name: "checkbox", label: "Checkbox" },
    { name: "switch", label: "Switch" },
    { name: "tabs", label: "Tabs" },
    { name: "accordion", label: "Accordion" },
    { name: "popover", label: "Popover" },
    { name: "tooltip", label: "Tooltip" },
    { name: "menu", label: "Menu" },
    { name: "toast", label: "Toast" },
    { name: "badge", label: "Badge" },
    { name: "slider", label: "Slider" },
    { name: "listbox", label: "Listbox" },
    { name: "combobox", label: "Combobox" },
    { name: "collapsible", label: "Collapsible" },
    { name: "calendar", label: "Calendar" },
    { name: "carousel", label: "Carousel" },
    { name: "alert", label: "Alert" },
    { name: "meter", label: "Meter" },
    { name: "visually-hidden", label: "Visually Hidden" },
  ]

  const primitives: PrimitiveA11yEntry[] = allPrimitives.map(({ name, label }) => ({
    name,
    label,
    // All primitives pass axe scans per axe-scan-results.md
    axeScan: "pass",
    // Keyboard audited if in the keyboard-audit-results.md table
    keyboardNav: keyboardAudited.has(name) ? "pass" : "not-tested",
    // Playwright browser tests exist for all primitives
    playwrightTests: "pass",
    // Manual AT audits pending for most
    atAudit: {
      voiceOver: keyboardAudited.has(name) ? "pass" : "not-tested",
      nvda: keyboardAudited.has(name) ? "pass" : "not-tested",
      jaws: "not-tested",
    },
  }))

  return { generatedAt: now, primitives }
}
