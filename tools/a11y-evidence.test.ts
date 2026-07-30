import { describe, expect, it } from "vitest"
import {
  AXE_RESULTS_SCHEMA_VERSION,
  createAxeScanResult,
  type AxeResultsArtifact,
} from "./axe-results"
import {
  A11Y_EVIDENCE_SCHEMA_VERSION,
  PUBLISHED_EVIDENCE_SCHEMA_VERSION,
  evidenceForArtifact,
  publishedEvidence,
} from "./a11y-evidence"

function artifact(): AxeResultsArtifact {
  return {
    schemaVersion: AXE_RESULTS_SCHEMA_VERSION,
    generatedAt: "2026-07-29T00:00:00.000Z",
    commitSha: "a".repeat(40),
    ciRunUrl: "https://github.com/solidiom/solidiom/actions/runs/1",
    browser: "chromium",
    results: [
      createAxeScanResult({ primitive: "dialog", passes: 15, violations: 0, incomplete: 0 }),
    ],
  }
}

describe("A11Y-001 evidence publishing", () => {
  it("preserves the scan's stable evidence ID and machine-readable summary", () => {
    const source = artifact()
    const output = evidenceForArtifact(source)
    const dialog = output.primitives.dialog

    expect(output.schemaVersion).toBe(A11Y_EVIDENCE_SCHEMA_VERSION)
    expect(output.source).toEqual({
      artifactSchemaVersion: AXE_RESULTS_SCHEMA_VERSION,
      commitSha: source.commitSha,
      ciRunUrl: source.ciRunUrl,
    })
    expect(dialog).toEqual({
      evidenceIds: ["axe-dialog-scan-v1"],
      summary: { passes: 15, violations: 0, incomplete: 0, outcome: "pass" },
      lastRun: source.generatedAt,
    })
  })

  it("publishes the same evidence contract beside a primitive's docs", () => {
    const source = artifact()
    const evidence = evidenceForArtifact(source).primitives.dialog

    expect(publishedEvidence("dialog", evidence, source)).toMatchObject({
      schemaVersion: PUBLISHED_EVIDENCE_SCHEMA_VERSION,
      primitive: "dialog",
      evidenceIds: ["axe-dialog-scan-v1"],
      summary: { outcome: "pass", violations: 0 },
      provenance: { browser: "chromium", commitSha: source.commitSha },
    })
  })
})
