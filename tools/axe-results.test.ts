import { describe, expect, it } from "vitest"
import {
  AXE_RESULTS_SCHEMA_VERSION,
  PUBLIC_PRIMITIVES,
  validateAxeResultsArtifact,
} from "./axe-results"

function validArtifact() {
  return {
    schemaVersion: AXE_RESULTS_SCHEMA_VERSION,
    generatedAt: "2026-07-26T00:00:00.000Z",
    commitSha: "a".repeat(40),
    ciRunUrl: null,
    browser: "chromium",
    results: PUBLIC_PRIMITIVES.map((primitive) => ({
      primitive,
      violations: 0,
      incomplete: 0,
      passes: 1,
    })),
  }
}

describe("axe result validation", () => {
  it("accepts a complete all-pass result set", () => {
    expect(validateAxeResultsArtifact(validArtifact())).toEqual([])
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

  it("rejects violations", () => {
    const artifact = validArtifact()
    artifact.results[0].violations = 1
    expect(validateAxeResultsArtifact(artifact)).toContainEqual(
      expect.stringContaining("axe violation"),
    )
  })
})
