/**
 * Utility to load and parse @solidiom/bench report data.
 *
 * In the SPA, loads from /bench-report.json (placed in public/ or generated at build time).
 * Falls back to sample data for development.
 */

import { parseReport, type BenchReport } from "@solidiom/bench"

const REPORT_URL = "/bench-report.json"

/**
 * Fetch the latest bench report. Returns sample data if no report exists.
 */
export async function loadReport(): Promise<BenchReport> {
  try {
    const res = await fetch(REPORT_URL)
    if (!res.ok) return createSampleReport()
    const json = await res.text()
    return parseReport(json)
  } catch {
    return createSampleReport()
  }
}

/**
 * Sample report for development when no real report exists.
 */
export function createSampleReport(): BenchReport {
  const now = new Date().toISOString()
  return {
    version: 1,
    generatedAt: now,
    interaction: [
      {
        name: "Dialog open/close",
        metrics: { "time-to-open": 12, "time-to-close": 8 },
        timestamp: now,
      },
      {
        name: "Select 100 items scroll",
        metrics: { "scroll-fps": 58, "re-renders": 2 },
        timestamp: now,
      },
    ],
    throughput: [
      {
        name: "createControllableValue",
        opsPerSecond: 1_200_000,
        avgNs: 833,
        samples: 50000,
        timestamp: now,
      },
      {
        name: "store draft setter (10 keys)",
        opsPerSecond: 800_000,
        avgNs: 1250,
        samples: 40000,
        timestamp: now,
      },
      {
        name: "signal read/write cycle",
        opsPerSecond: 5_000_000,
        avgNs: 200,
        samples: 100000,
        timestamp: now,
      },
    ],
    bundle: [
      {
        name: "@solidiom/runtime (full)",
        sizeBytes: 24_000,
        gzipBytes: 8_200,
        limitBytes: 30_000,
        passed: true,
        timestamp: now,
      },
      {
        name: "@solidiom/dialog",
        sizeBytes: 6_400,
        gzipBytes: 2_100,
        limitBytes: 5_000,
        passed: true,
        timestamp: now,
      },
      {
        name: "@solidiom/select",
        sizeBytes: 9_800,
        gzipBytes: 3_400,
        limitBytes: 6_000,
        passed: true,
        timestamp: now,
      },
    ],
  }
}
