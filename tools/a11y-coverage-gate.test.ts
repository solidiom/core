import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import {
  checkPrimitiveEvidence,
  runGate,
  type RegistryPrimitiveSummary,
} from "./a11y-coverage-gate"
import { PUBLISHED_EVIDENCE_SCHEMA_VERSION, type PublishedEvidence } from "./a11y-evidence"
import {
  AXE_RESULTS_SCHEMA_VERSION,
  type AxeResultsArtifact,
  createAxeScanResult,
} from "./axe-results"

let tmpDir: string

afterEach(() => {
  if (tmpDir) rmSync(tmpDir, { recursive: true, force: true })
})

function primitiveSummary(
  overrides: Partial<RegistryPrimitiveSummary> = {},
): RegistryPrimitiveSummary {
  return {
    name: "dialog",
    status: "stable",
    hasAccessibilityEvidence: true,
    accessibility: { evidenceIds: ["axe-dialog-scan-v1"] },
    ...overrides,
  }
}

function publishedEvidence(overrides: Partial<PublishedEvidence> = {}): PublishedEvidence {
  return {
    schemaVersion: PUBLISHED_EVIDENCE_SCHEMA_VERSION,
    primitive: "dialog",
    evidenceIds: ["axe-dialog-scan-v1"],
    summary: { passes: 15, violations: 0, incomplete: 0, outcome: "pass" },
    lastRun: "2026-07-30T00:00:00.000Z",
    provenance: { browser: "chromium", commitSha: "abc123", ciRunUrl: null },
    ...overrides,
  }
}

function scanArtifact(overrides: Partial<AxeResultsArtifact> = {}): AxeResultsArtifact {
  return {
    schemaVersion: AXE_RESULTS_SCHEMA_VERSION,
    generatedAt: "2026-07-30T00:00:00.000Z",
    commitSha: "abc123",
    ciRunUrl: null,
    browser: "chromium",
    results: [
      createAxeScanResult({ primitive: "dialog", passes: 15, violations: 0, incomplete: 0 }),
    ],
    ...overrides,
  }
}

function writeEvidenceFile(evidence: PublishedEvidence): string {
  tmpDir = mkdtempSync(join(tmpdir(), "a11y-coverage-gate-"))
  const path = join(tmpDir, "evidence.json")
  writeFileSync(path, JSON.stringify(evidence), "utf8")
  return path
}

describe("checkPrimitiveEvidence (A11Y-004)", () => {
  it("succeeds when evidence is current, passing, and matches the registry flags", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toEqual({
      primitive: "dialog",
      provenance: { browser: "chromium", commitSha: "abc123", ciRunUrl: null },
      evidenceIds: ["axe-dialog-scan-v1"],
    })
  })

  it("fails when the evidence file does not exist", () => {
    const result = checkPrimitiveEvidence(
      primitiveSummary(),
      "/nonexistent/evidence.json",
      scanArtifact(),
    )
    expect(result).toMatchObject({ primitive: "dialog", reason: "missing-evidence-file" })
  })

  it("fails when the evidence file is not valid JSON", () => {
    tmpDir = mkdtempSync(join(tmpdir(), "a11y-coverage-gate-"))
    const path = join(tmpDir, "evidence.json")
    writeFileSync(path, "not json", "utf8")
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toMatchObject({ primitive: "dialog", reason: "invalid-evidence-schema" })
  })

  it("fails when the evidence file does not match the published schema", () => {
    tmpDir = mkdtempSync(join(tmpdir(), "a11y-coverage-gate-"))
    const path = join(tmpDir, "evidence.json")
    writeFileSync(path, JSON.stringify({ schemaVersion: 1 }), "utf8")
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toMatchObject({ primitive: "dialog", reason: "invalid-evidence-schema" })
  })

  it("fails when the evidence file's primitive name disagrees with the registry entry", () => {
    const path = writeEvidenceFile(publishedEvidence({ primitive: "combobox" }))
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toMatchObject({ primitive: "dialog", reason: "primitive-name-mismatch" })
  })

  it("fails when registry evidence flags disagree with the published evidence ids", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(
      primitiveSummary({ accessibility: { evidenceIds: ["axe-dialog-scan-v2"] } }),
      path,
      scanArtifact(),
    )
    expect(result).toMatchObject({ primitive: "dialog", reason: "registry-evidence-flag-mismatch" })
  })

  it("fails when hasAccessibilityEvidence is false even if a file exists", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(
      primitiveSummary({ hasAccessibilityEvidence: false }),
      path,
      scanArtifact(),
    )
    expect(result).toMatchObject({ primitive: "dialog", reason: "registry-evidence-flag-mismatch" })
  })

  it("fails when there is no executed scan artifact to verify freshness against", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(primitiveSummary(), path, undefined)
    expect(result).toMatchObject({ primitive: "dialog", reason: "no-executed-scan" })
  })

  it("fails when the latest scan has no result for this primitive", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact({ results: [] }))
    expect(result).toMatchObject({ primitive: "dialog", reason: "no-executed-scan" })
  })

  it("fails when the published evidence predates the latest executed scan (stale)", () => {
    const path = writeEvidenceFile(publishedEvidence({ lastRun: "2026-07-29T00:00:00.000Z" }))
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toMatchObject({ primitive: "dialog", reason: "stale-evidence" })
  })

  it("fails when the latest executed scan has violations", () => {
    const path = writeEvidenceFile(publishedEvidence())
    const result = checkPrimitiveEvidence(
      primitiveSummary(),
      path,
      scanArtifact({
        results: [
          createAxeScanResult({ primitive: "dialog", passes: 10, violations: 2, incomplete: 0 }),
        ],
      }),
    )
    expect(result).toMatchObject({ primitive: "dialog", reason: "scan-has-violations" })
  })

  it("fails when the published evidence itself records violations", () => {
    const path = writeEvidenceFile(
      publishedEvidence({ summary: { passes: 10, violations: 1, incomplete: 0, outcome: "fail" } }),
    )
    const result = checkPrimitiveEvidence(primitiveSummary(), path, scanArtifact())
    expect(result).toMatchObject({ primitive: "dialog", reason: "scan-has-violations" })
  })
})

describe("runGate (A11Y-004)", () => {
  it('only gates GA ("stable") status primitives', () => {
    const report = runGate(
      [
        primitiveSummary({ name: "dialog", status: "preview" }),
        primitiveSummary({ name: "combobox", status: "experimental" }),
      ],
      scanArtifact(),
      () => "/nonexistent/evidence.json",
    )
    expect(report.failures).toEqual([])
    expect(report.successes).toEqual([])
  })

  it("aggregates failures across multiple GA primitives", () => {
    const report = runGate(
      [primitiveSummary({ name: "dialog" }), primitiveSummary({ name: "combobox" })],
      scanArtifact(),
      () => "/nonexistent/evidence.json",
    )
    expect(report.failures).toHaveLength(2)
    expect(report.failures.map((failure) => failure.primitive).sort()).toEqual([
      "combobox",
      "dialog",
    ])
  })
})
