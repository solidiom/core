import { describe, expect, it } from "vitest"
import {
  AXE_RESULTS_SCHEMA_VERSION,
  PUBLIC_PRIMITIVES,
  axeEvidenceId,
  createAxeScanResult,
  validateAxeResultsArtifact,
} from "./axe-results"

function validArtifact() {
  return {
    schemaVersion: AXE_RESULTS_SCHEMA_VERSION,
    generatedAt: "2026-07-26T00:00:00.000Z",
    commitSha: "a".repeat(40),
    ciRunUrl: null,
    browser: "chromium" as const,
    results: PUBLIC_PRIMITIVES.map((primitive) =>
      createAxeScanResult({ primitive, violations: 0, incomplete: 0, passes: 1 }),
    ),
  }
}

describe("axe result validation", () => {
  it("accepts a complete all-pass result set with stable evidence IDs", () => {
    const artifact = validArtifact()
    expect(validateAxeResultsArtifact(artifact)).toEqual([])
    expect(artifact.results.map((result) => result.evidence.id)).toEqual(
      PUBLIC_PRIMITIVES.map(axeEvidenceId),
    )
  })

  it("rejects a missing public primitive", () => {
    const artifact = validArtifact()
    artifact.results.pop()
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("Missing primitive result"),
    )
  })

  it("rejects duplicate primitive results", () => {
    const artifact = validArtifact()
    artifact.results.push({ ...artifact.results[0] })
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("Duplicate primitive result"),
    )
  })

  it("rejects an evidence ID that is not stable for its primitive", () => {
    const artifact = validArtifact()
    artifact.results[0].evidence.id = "axe-dialog-scan-v1"
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("unstable or invalid evidence ID"),
    )
  })

  it("rejects a summary with an outcome that disagrees with its violations", () => {
    const artifact = validArtifact()
    artifact.results[0].evidence.summary.outcome = "fail"
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("invalid evidence outcome"),
    )
  })

  it("rejects violations", () => {
    const artifact = validArtifact()
    artifact.results[0].evidence.summary.violations = 1
    artifact.results[0].evidence.summary.outcome = "fail"
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("axe violation"),
    )
  })
})
