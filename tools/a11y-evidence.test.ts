import { describe, expect, it, beforeEach, afterEach } from "vitest"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
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
  withPreservedProvenance,
  type PublishedEvidence,
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

// BUILD-001 regression guard.
//
// lastRun is wall-clock and provenance.commitSha is HEAD-derived, so
// regenerating identical scan results used to rewrite all 52 evidence files —
// and because registry.accessibility.lastReviewed is fed from lastRun, that
// cascaded into 52 registry manifests as well. These files are inside
// BUILD-001's pathspec, and commitSha is self-referential in the same way the
// registry stamp was: committing the file moves HEAD, which changes what the
// next regeneration writes.
describe("withPreservedProvenance", () => {
  let dir: string
  let file: string

  const evidence = (passes: number, lastRun: string, commitSha: string): PublishedEvidence => ({
    schemaVersion: PUBLISHED_EVIDENCE_SCHEMA_VERSION,
    primitive: "dialog",
    evidenceIds: ["axe-dialog-scan-v1"],
    summary: { passes, violations: 0, incomplete: 0, outcome: "pass" },
    lastRun,
    provenance: { browser: "chromium", commitSha, ciRunUrl: null },
  })

  const OLD = evidence(15, "2020-01-01T00:00:00.000Z", "a".repeat(40))
  const NEW = evidence(15, "2099-12-31T23:59:59.000Z", "b".repeat(40))

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "a11y-evidence-"))
    file = join(dir, "evidence.json")
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it("returns the candidate unchanged when no committed file exists", () => {
    expect(withPreservedProvenance(file, NEW)).toEqual(NEW)
  })

  it("keeps the committed provenance when the evidence is unchanged", () => {
    writeFileSync(file, JSON.stringify(OLD))

    const result = withPreservedProvenance(file, NEW)

    expect(result.lastRun).toBe(OLD.lastRun)
    expect(result.provenance.commitSha).toBe(OLD.provenance.commitSha)
  })

  it("advances provenance when the scan summary changes", () => {
    writeFileSync(file, JSON.stringify(OLD))

    const result = withPreservedProvenance(file, evidence(16, NEW.lastRun, "c".repeat(40)))

    expect(result.summary.passes).toBe(16)
    expect(result.lastRun).toBe(NEW.lastRun)
    expect(result.provenance.commitSha).toBe("c".repeat(40))
  })

  it("advances provenance when the browser differs, since that is different evidence", () => {
    writeFileSync(file, JSON.stringify(OLD))

    const candidate: PublishedEvidence = {
      ...NEW,
      provenance: { ...NEW.provenance, browser: "firefox" },
    }

    expect(withPreservedProvenance(file, candidate).lastRun).toBe(NEW.lastRun)
  })

  it("returns the candidate when the committed file is unreadable", () => {
    writeFileSync(file, "{ not json")

    expect(withPreservedProvenance(file, NEW)).toEqual(NEW)
  })
})
