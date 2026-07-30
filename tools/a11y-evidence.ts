/**
 * A11Y-001: Publish stable, per-primitive axe evidence from executed scans.
 *
 * The source artifact already contains the stable evidence ID and
 * machine-readable summary. This script republishes that executed evidence in
 * the aggregate artifact and alongside authored primitive documentation.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import {
  type AxePrimitiveEvidence,
  type AxeResultsArtifact,
  validateAxeResultsArtifact,
} from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const INPUT = join(ROOT, "artifacts/axe-results.json")
const OUTPUT = join(ROOT, "artifacts/a11y-evidence.json")
export const A11Y_EVIDENCE_SCHEMA_VERSION = 1
export const PUBLISHED_EVIDENCE_SCHEMA_VERSION = 2

export interface EvidencePrimitive {
  evidenceIds: string[]
  summary: AxePrimitiveEvidence["summary"]
  lastRun: string
}

export interface EvidenceOutput {
  schemaVersion: typeof A11Y_EVIDENCE_SCHEMA_VERSION
  generatedAt: string
  source: {
    artifactSchemaVersion: AxeResultsArtifact["schemaVersion"]
    commitSha: string | null
    ciRunUrl: string | null
  }
  primitives: Record<string, EvidencePrimitive>
}

export interface PublishedEvidence extends EvidencePrimitive {
  schemaVersion: typeof PUBLISHED_EVIDENCE_SCHEMA_VERSION
  primitive: string
  provenance: {
    browser: AxeResultsArtifact["browser"]
    commitSha: string | null
    ciRunUrl: string | null
  }
}

export function evidenceForArtifact(artifact: AxeResultsArtifact): EvidenceOutput {
  const primitives: Record<string, EvidencePrimitive> = {}

  for (const result of artifact.results) {
    primitives[result.primitive] = {
      evidenceIds: [result.evidence.id],
      summary: result.evidence.summary,
      lastRun: artifact.generatedAt,
    }
  }

  return {
    schemaVersion: A11Y_EVIDENCE_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    source: {
      artifactSchemaVersion: artifact.schemaVersion,
      commitSha: artifact.commitSha,
      ciRunUrl: artifact.ciRunUrl,
    },
    primitives,
  }
}

export function publishedEvidence(
  primitive: string,
  evidence: EvidencePrimitive,
  artifact: AxeResultsArtifact,
): PublishedEvidence {
  return {
    schemaVersion: PUBLISHED_EVIDENCE_SCHEMA_VERSION,
    primitive,
    evidenceIds: evidence.evidenceIds,
    summary: evidence.summary,
    lastRun: evidence.lastRun,
    provenance: {
      browser: artifact.browser,
      commitSha: artifact.commitSha,
      ciRunUrl: artifact.ciRunUrl,
    },
  }
}

function serializePublishedEvidence(evidence: PublishedEvidence): string {
  return `${[
    "{",
    `  \"schemaVersion\": ${evidence.schemaVersion},`,
    `  \"primitive\": ${JSON.stringify(evidence.primitive)},`,
    `  \"evidenceIds\": ${JSON.stringify(evidence.evidenceIds)},`,
    '  "summary": {',
    `    \"passes\": ${evidence.summary.passes},`,
    `    \"violations\": ${evidence.summary.violations},`,
    `    \"incomplete\": ${evidence.summary.incomplete},`,
    `    \"outcome\": ${JSON.stringify(evidence.summary.outcome)}`,
    "  },",
    `  \"lastRun\": ${JSON.stringify(evidence.lastRun)},`,
    '  "provenance": {',
    `    \"browser\": ${JSON.stringify(evidence.provenance.browser)},`,
    `    \"commitSha\": ${JSON.stringify(evidence.provenance.commitSha)},`,
    `    \"ciRunUrl\": ${JSON.stringify(evidence.provenance.ciRunUrl)}`,
    "  }",
    "}",
  ].join("\n")}\n`
}

function main(): void {
  if (!existsSync(INPUT)) {
    throw new Error(`Axe results artifact not found: ${INPUT}. Run 'pnpm run test:a11y' first.`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(INPUT, "utf8"))
  } catch (error) {
    throw new Error(`Unable to parse axe results: ${String(error)}`)
  }

  const errors = validateAxeResultsArtifact(parsed)
  if (errors.length > 0) {
    throw new Error(`Invalid axe results artifact:\n- ${errors.join("\n- ")}`)
  }

  const artifact = parsed as AxeResultsArtifact
  const output = evidenceForArtifact(artifact)
  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8")

  const published = Object.entries(output.primitives).flatMap(([primitive, evidence]) => {
    const outputPath = join(ROOT, "packages", primitive, "docs", "accessibility", "evidence.json")
    if (!existsSync(dirname(outputPath))) return []

    writeFileSync(
      outputPath,
      serializePublishedEvidence(publishedEvidence(primitive, evidence, artifact)),
      "utf8",
    )
    return [outputPath]
  })

  const totalEvidence = Object.values(output.primitives).reduce(
    (sum, primitive) => sum + primitive.evidenceIds.length,
    0,
  )
  console.log(`✓ Generated ${OUTPUT}`)
  console.log(`  ${artifact.results.length} primitives, ${totalEvidence} stable evidence IDs`)
  for (const outputPath of published) console.log(`  ✓ Published ${outputPath}`)
}

const isMainModule =
  process.argv[1]?.endsWith("a11y-evidence.ts") || process.argv[1]?.endsWith("a11y-evidence")

if (isMainModule) {
  try {
    main()
  } catch (error) {
    console.error(`✗ Unable to publish accessibility evidence: ${String(error)}`)
    process.exit(1)
  }
}
