#!/usr/bin/env tsx
/**
 * A11Y-004 coverage gate.
 *
 * Fails when a registry primitive at GA status ("stable") is missing
 * published accessibility evidence, or when its published evidence is
 * stale relative to the most recently executed axe scan.
 *
 * "Missing" covers:
 *   - No `packages/<name>/docs/accessibility/evidence.json` file.
 *   - A file that fails PublishedEvidence schema validation.
 *   - `registry/index.json`'s own `hasAccessibilityEvidence`/`evidenceIds`
 *     flags disagreeing with the published evidence file.
 *
 * "Stale" means the published evidence's provenance does not match the
 * latest executed scan recorded in `artifacts/axe-results.json` — i.e. the
 * primitive was scanned again (source changed) but its published evidence
 * was never republished. Evidence with axe violations (`outcome: "fail"`)
 * is also treated as a failure: GA primitives must have a passing scan, not
 * just a present one.
 *
 * This intentionally does not gate non-GA (experimental/preview/deprecated)
 * primitives: A11Y-001/002/003 evidence and contracts are being built up
 * incrementally across the catalog, and only GA is a conformance promise.
 *
 * Run after `pnpm run test:a11y` and `pnpm run report:a11y-evidence` so
 * `artifacts/axe-results.json` reflects the current commit.
 *
 * Usage: tsx tools/a11y-coverage-gate.ts
 */
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { PublishedEvidence } from "./a11y-evidence"
import { PUBLISHED_EVIDENCE_SCHEMA_VERSION } from "./a11y-evidence"
import { type AxeResultsArtifact, validateAxeResultsArtifact } from "./axe-results"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const REGISTRY_INDEX_PATH = join(ROOT, "registry", "index.json")
const AXE_RESULTS_PATH = join(ROOT, "artifacts", "axe-results.json")

/** GA is the only registry status that promises accessibility conformance. */
const GA_STATUS = "stable"

export interface RegistryPrimitiveSummary {
  name: string
  status: string
  hasAccessibilityEvidence: boolean
  accessibility: { evidenceIds: string[] }
}

export type GateFailureReason =
  | "missing-evidence-file"
  | "invalid-evidence-schema"
  | "primitive-name-mismatch"
  | "registry-evidence-flag-mismatch"
  | "no-executed-scan"
  | "stale-evidence"
  | "scan-has-violations"

export interface GateFailure {
  primitive: string
  reason: GateFailureReason
  detail: string
}

export interface GateSuccess {
  primitive: string
  provenance: PublishedEvidence["provenance"]
  evidenceIds: string[]
}

export interface GateReport {
  failures: GateFailure[]
  successes: GateSuccess[]
}

function isPublishedEvidence(value: unknown): value is PublishedEvidence {
  if (!value || typeof value !== "object") return false
  const evidence = value as Partial<PublishedEvidence>
  return (
    evidence.schemaVersion === PUBLISHED_EVIDENCE_SCHEMA_VERSION &&
    typeof evidence.primitive === "string" &&
    Array.isArray(evidence.evidenceIds) &&
    typeof evidence.lastRun === "string" &&
    !!evidence.summary &&
    Number.isInteger(evidence.summary.passes) &&
    Number.isInteger(evidence.summary.violations) &&
    Number.isInteger(evidence.summary.incomplete) &&
    (evidence.summary.outcome === "pass" || evidence.summary.outcome === "fail") &&
    !!evidence.provenance &&
    (evidence.provenance.commitSha === null || typeof evidence.provenance.commitSha === "string") &&
    (evidence.provenance.ciRunUrl === null || typeof evidence.provenance.ciRunUrl === "string")
  )
}

/**
 * Checks one GA primitive's published evidence against the registry's own
 * evidence flags and the latest executed scan artifact.
 */
export function checkPrimitiveEvidence(
  primitive: RegistryPrimitiveSummary,
  evidencePath: string,
  latestScan: AxeResultsArtifact | undefined,
): GateFailure | GateSuccess {
  if (!existsSync(evidencePath)) {
    return {
      primitive: primitive.name,
      reason: "missing-evidence-file",
      detail: `No published evidence at ${evidencePath}`,
    }
  }

  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(evidencePath, "utf8"))
  } catch (error) {
    return {
      primitive: primitive.name,
      reason: "invalid-evidence-schema",
      detail: `Unable to parse ${evidencePath}: ${String(error)}`,
    }
  }

  if (!isPublishedEvidence(raw)) {
    return {
      primitive: primitive.name,
      reason: "invalid-evidence-schema",
      detail: `${evidencePath} does not match the published evidence schema`,
    }
  }

  if (raw.primitive !== primitive.name) {
    return {
      primitive: primitive.name,
      reason: "primitive-name-mismatch",
      detail: `${evidencePath} declares primitive "${raw.primitive}", expected "${primitive.name}"`,
    }
  }

  if (
    !primitive.hasAccessibilityEvidence ||
    primitive.accessibility.evidenceIds.length === 0 ||
    !primitive.accessibility.evidenceIds.every((id) => raw.evidenceIds.includes(id))
  ) {
    return {
      primitive: primitive.name,
      reason: "registry-evidence-flag-mismatch",
      detail: `registry/index.json evidence flags for "${primitive.name}" disagree with ${evidencePath}`,
    }
  }

  if (!latestScan) {
    return {
      primitive: primitive.name,
      reason: "no-executed-scan",
      detail: "No executed axe scan artifact found to verify evidence freshness against",
    }
  }

  const latestResult = latestScan.results.find((result) => result.primitive === primitive.name)
  if (!latestResult) {
    return {
      primitive: primitive.name,
      reason: "no-executed-scan",
      detail: `Latest executed scan does not include a result for "${primitive.name}"`,
    }
  }

  if (latestResult.evidence.summary.violations > 0 || raw.summary.violations > 0) {
    return {
      primitive: primitive.name,
      reason: "scan-has-violations",
      detail: `"${primitive.name}" has ${Math.max(latestResult.evidence.summary.violations, raw.summary.violations)} axe violation(s); GA primitives require a passing scan`,
    }
  }

  // Evidence is considered current when its substance (evidenceIds, summary,
  // outcome) matches the latest scan. Provenance fields (commitSha, lastRun)
  // are intentionally NOT compared because they advance on every invocation
  // even when the scan results are identical — comparing them would create an
  // unresolvable loop where committing evidence moves HEAD and invalidates the
  // file just committed. See withPreservedProvenance() in a11y-evidence.ts.
  const publishedSubstance = JSON.stringify([raw.evidenceIds, raw.summary])
  const scannedSubstance = JSON.stringify([
    [latestResult.evidence.id],
    latestResult.evidence.summary,
  ])

  if (publishedSubstance !== scannedSubstance) {
    return {
      primitive: primitive.name,
      reason: "stale-evidence",
      detail: `Published evidence for "${primitive.name}" does not match the latest executed scan results; republish with 'pnpm run report:a11y-evidence'`,
    }
  }

  return { primitive: primitive.name, provenance: raw.provenance, evidenceIds: raw.evidenceIds }
}

function isGateFailure(value: GateFailure | GateSuccess): value is GateFailure {
  return "reason" in value
}

export function runGate(
  primitives: RegistryPrimitiveSummary[],
  latestScan: AxeResultsArtifact | undefined,
  evidencePathFor: (primitive: string) => string = (primitive) =>
    join(ROOT, "packages", primitive, "docs", "accessibility", "evidence.json"),
): GateReport {
  const gaPrimitives = primitives.filter((primitive) => primitive.status === GA_STATUS)
  const failures: GateFailure[] = []
  const successes: GateSuccess[] = []

  for (const primitive of gaPrimitives) {
    const result = checkPrimitiveEvidence(primitive, evidencePathFor(primitive.name), latestScan)
    if (isGateFailure(result)) {
      failures.push(result)
    } else {
      successes.push(result)
    }
  }

  return { failures, successes }
}

function main(): void {
  console.log("A11Y-004 Coverage Gate (GA-status primitives)")
  console.log("=".repeat(50))

  const registry = JSON.parse(readFileSync(REGISTRY_INDEX_PATH, "utf8")) as {
    primitives: RegistryPrimitiveSummary[]
  }

  let latestScan: AxeResultsArtifact | undefined
  if (existsSync(AXE_RESULTS_PATH)) {
    const parsed = JSON.parse(readFileSync(AXE_RESULTS_PATH, "utf8")) as unknown
    const errors = validateAxeResultsArtifact(parsed)
    if (errors.length === 0) {
      latestScan = parsed as AxeResultsArtifact
    } else {
      console.log(`  ⚠ ${AXE_RESULTS_PATH} failed validation and will be treated as absent:`)
      for (const error of errors) console.log(`      - ${error}`)
    }
  }

  const gaCount = registry.primitives.filter((primitive) => primitive.status === GA_STATUS).length
  if (gaCount === 0) {
    console.log('No GA-status ("stable") primitives yet; nothing to gate.')
    return
  }

  const { failures, successes } = runGate(registry.primitives, latestScan)

  for (const success of successes) {
    console.log(
      `  ✓ ${success.primitive}: evidence ${success.evidenceIds.join(", ")} ` +
        `(commit ${success.provenance.commitSha ?? "unknown"}${success.provenance.ciRunUrl ? `, ${success.provenance.ciRunUrl}` : ""})`,
    )
  }
  for (const failure of failures) {
    console.log(`  ✗ ${failure.primitive}: ${failure.reason} — ${failure.detail}`)
  }

  console.log()
  if (failures.length > 0) {
    console.error(
      `A11Y-004: ${failures.length} GA-status primitive(s) with missing or stale accessibility evidence.`,
    )
    process.exitCode = 1
    return
  }

  console.log(`All ${gaCount} GA-status primitive(s) have current, passing accessibility evidence.`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
