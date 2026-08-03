import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"

import { writeReportWithStableStamp } from "./report-stamp"

const OLD_STAMP = "Generated: 2020-01-01T00:00:00.000Z"
const NEW_STAMP = "Generated: 2099-12-31T23:59:59.000Z"

function report(stamp: string, body: string): string[] {
  return ["# Example Audit", "", stamp, "", "## Summary", "", body, ""]
}

describe("writeReportWithStableStamp", () => {
  let dir: string
  let file: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "report-stamp-"))
    file = join(dir, "nested", "report.md")
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it("creates the parent directory and writes when no report exists", () => {
    writeReportWithStableStamp(file, report(NEW_STAMP, "0 violations"))
    expect(existsSync(file)).toBe(true)
    expect(readFileSync(file, "utf8")).toContain(NEW_STAMP)
  })

  // The defect this guards: a wall-clock stamp rewrites the file on every run, so
  // verifying dirties the tree and any committed-vs-generated comparison reports a
  // difference that committing cannot resolve.
  it("keeps the recorded stamp when only the stamp would change", () => {
    writeReportWithStableStamp(file, report(OLD_STAMP, "0 violations"))
    const first = readFileSync(file, "utf8")

    writeReportWithStableStamp(file, report(NEW_STAMP, "0 violations"))
    const second = readFileSync(file, "utf8")

    expect(second).toBe(first)
    expect(second).toContain(OLD_STAMP)
    expect(second).not.toContain(NEW_STAMP)
  })

  it("is idempotent across repeated writes", () => {
    writeReportWithStableStamp(file, report(OLD_STAMP, "0 violations"))
    const baseline = readFileSync(file, "utf8")

    for (const _ of [1, 2, 3]) {
      writeReportWithStableStamp(file, report(NEW_STAMP, "0 violations"))
    }

    expect(readFileSync(file, "utf8")).toBe(baseline)
  })

  it("advances the stamp when the report's substance changes", () => {
    writeReportWithStableStamp(file, report(OLD_STAMP, "0 violations"))
    writeReportWithStableStamp(file, report(NEW_STAMP, "1 violation"))

    const contents = readFileSync(file, "utf8")
    expect(contents).toContain(NEW_STAMP)
    expect(contents).toContain("1 violation")
    expect(contents).not.toContain(OLD_STAMP)
  })

  it("writes fresh when the previous report carries no stamp line", () => {
    writeReportWithStableStamp(file, ["# Example Audit", "", "no stamp here", ""])
    writeReportWithStableStamp(file, report(NEW_STAMP, "0 violations"))

    expect(readFileSync(file, "utf8")).toContain(NEW_STAMP)
  })
})
