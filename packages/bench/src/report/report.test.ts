import { describe, it, expect } from "vitest"
import { createReport, serializeReport, parseReport, compareReports } from "./report"

describe("report", () => {
  it("creates a report with defaults", () => {
    const report = createReport()
    expect(report.version).toBe(1)
    expect(report.generatedAt).toBeTruthy()
    expect(report.interaction).toEqual([])
    expect(report.throughput).toEqual([])
    expect(report.bundle).toEqual([])
  })

  it("creates a report with provided data", () => {
    const report = createReport({
      commitSha: "abc123",
      throughput: [{ name: "test", opsPerSecond: 1000, avgNs: 1000, samples: 500, timestamp: "" }],
    })
    expect(report.commitSha).toBe("abc123")
    expect(report.throughput).toHaveLength(1)
  })

  it("serializes and parses round-trip", () => {
    const original = createReport({
      throughput: [
        { name: "bench1", opsPerSecond: 5000, avgNs: 200, samples: 1000, timestamp: "t" },
      ],
      bundle: [
        {
          name: "pkg",
          sizeBytes: 1000,
          gzipBytes: 500,
          limitBytes: 600,
          passed: true,
          timestamp: "t",
        },
      ],
    })
    const json = serializeReport(original)
    const parsed = parseReport(json)
    expect(parsed.version).toBe(1)
    expect(parsed.throughput[0]!.name).toBe("bench1")
    expect(parsed.bundle[0]!.gzipBytes).toBe(500)
  })

  it("parseReport throws on invalid version", () => {
    expect(() => parseReport('{"version":99}')).toThrow("Unsupported report version")
  })

  it("compareReports computes deltas for throughput", () => {
    const baseline = createReport({
      throughput: [{ name: "ops", opsPerSecond: 1000, avgNs: 1000, samples: 100, timestamp: "" }],
    })
    const current = createReport({
      throughput: [{ name: "ops", opsPerSecond: 1200, avgNs: 833, samples: 100, timestamp: "" }],
    })
    const deltas = compareReports(baseline, current)
    expect(deltas).toHaveLength(1)
    expect(deltas[0]!.name).toBe("ops")
    expect(deltas[0]!.deltaPercent).toBe(20)
  })

  it("compareReports computes deltas for bundle", () => {
    const baseline = createReport({
      bundle: [
        {
          name: "pkg",
          sizeBytes: 2000,
          gzipBytes: 1000,
          limitBytes: 1500,
          passed: true,
          timestamp: "",
        },
      ],
    })
    const current = createReport({
      bundle: [
        {
          name: "pkg",
          sizeBytes: 2200,
          gzipBytes: 1100,
          limitBytes: 1500,
          passed: true,
          timestamp: "",
        },
      ],
    })
    const deltas = compareReports(baseline, current)
    expect(deltas).toHaveLength(1)
    expect(deltas[0]!.deltaPercent).toBe(10)
  })
})
