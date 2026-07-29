/**
 * A11Y-001: Generate stable accessibility evidence IDs from axe scan results.
 *
 * Reads artifacts/axe-results.json and produces artifacts/a11y-evidence.json
 * with deterministic evidence identifiers for traceability.
 *
 * Evidence ID format: axe-<primitive-name>-<rule-id>-<hash>
 * where hash is first 8 chars of SHA-256 of (primitive + rule + target).
 *
 * Usage:
 *   tsx tools/a11y-evidence.ts
 */

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { type AxeResultsArtifact, type AxeScanResult, validateAxeResultsArtifact } from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const INPUT = join(ROOT, "artifacts/axe-results.json")
const OUTPUT = join(ROOT, "artifacts/a11y-evidence.json")

interface EvidencePrimitive {
  evidenceIds: string[]
  summary: {
    passes: number
    violations: number
    incomplete: number
  }
  lastRun: string
}

interface EvidenceOutput {
  generatedAt: string
  primitives: Record<string, EvidencePrimitive>
}

function computeEvidenceId(primitive: string, ruleId: string, target: string): string {
  const input = `${primitive}:${ruleId}:${target}`
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 8)
  return `axe-${primitive}-${ruleId}-${hash}`
}

function generateEvidenceForPrimitive(
  result: AxeScanResult,
  generatedAt: string,
): EvidencePrimitive {
  const evidenceIds: string[] = []

  // Generate evidence IDs from passes (since the existing schema only has counts,
  // we generate synthetic IDs based on the primitive name and pass count to ensure
  // stable identification)
  if (result.passes > 0) {
    evidenceIds.push(computeEvidenceId(result.primitive, "pass-summary", result.primitive))
  }
  if (result.violations > 0) {
    evidenceIds.push(computeEvidenceId(result.primitive, "violation-summary", result.primitive))
  }
  if (result.incomplete > 0) {
    evidenceIds.push(computeEvidenceId(result.primitive, "incomplete-summary", result.primitive))
  }

  return {
    evidenceIds,
    summary: {
      passes: result.passes,
      violations: result.violations,
      incomplete: result.incomplete,
    },
    lastRun: generatedAt,
  }
}

function main(): void {
  if (!existsSync(INPUT)) {
    console.error(`✗ Axe results artifact not found: ${INPUT}`)
    console.error("  Run 'pnpm run test:a11y' first to generate axe scan results.")
    process.exit(1)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(INPUT, "utf8"))
  } catch (error) {
    console.error(`✗ Unable to parse axe results: ${String(error)}`)
    process.exit(1)
  }

  const errors = validateAxeResultsArtifact(parsed)
  if (errors.length > 0) {
    console.error(`✗ Invalid axe results artifact:\n- ${errors.join("\n- ")}`)
    process.exit(1)
  }

  const artifact = parsed as AxeResultsArtifact
  const generatedAt = new Date().toISOString()

  const primitives: Record<string, EvidencePrimitive> = {}

  for (const result of artifact.results) {
    primitives[result.primitive] = generateEvidenceForPrimitive(result, artifact.generatedAt)
  }

  const output: EvidenceOutput = {
    generatedAt,
    primitives,
  }

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8")

  const totalPrimitives = Object.keys(primitives).length
  const totalEvidence = Object.values(primitives).reduce(
    (sum, p) => sum + p.evidenceIds.length,
    0,
  )
  console.log(`✓ Generated ${OUTPUT}`)
  console.log(`  ${totalPrimitives} primitives, ${totalEvidence} evidence IDs`)
}

try {
  main()
} catch (error) {
  console.error(`✗ Unexpected error: ${String(error)}`)
  process.exit(1)
}
