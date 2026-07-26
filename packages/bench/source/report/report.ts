/**
 * Report — unified JSON emitter for all benchmark types.
 *
 * Collects interaction, throughput, and bundle results into a single
 * JSON report file for CI comparison and dashboard rendering.
 */

import type { InteractionResult } from "../interaction/interaction-harness"
import type { ThroughputResult } from "../throughput/throughput-harness"
import type { BundleSizeResult } from "../bundle/bundle-harness"

/** A complete benchmark report. */
export interface BenchReport {
  /** Report format version. */
  version: 1
  /** ISO timestamp when report was generated. */
  generatedAt: string
  /** Git commit SHA (if available). */
  commitSha?: string
  /** Interaction benchmark results. */
  interaction: InteractionResult[]
  /** Throughput benchmark results. */
  throughput: ThroughputResult[]
  /** Bundle size results. */
  bundle: BundleSizeResult[]
}

/** Options for creating a report. */
export interface ReportOptions {
  commitSha?: string
  interaction?: InteractionResult[]
  throughput?: ThroughputResult[]
  bundle?: BundleSizeResult[]
}

/**
 * Creates a complete benchmark report.
 */
export function createReport(options: ReportOptions = {}): BenchReport {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    commitSha: options.commitSha,
    interaction: options.interaction ?? [],
    throughput: options.throughput ?? [],
    bundle: options.bundle ?? [],
  }
}

/**
 * Serializes a report to JSON string.
 */
export function serializeReport(report: BenchReport): string {
  return JSON.stringify(report, null, 2)
}

/**
 * Parses a JSON string into a BenchReport.
 * Throws if the format is invalid.
 */
export function parseReport(json: string): BenchReport {
  const parsed = JSON.parse(json)
  if (parsed.version !== 1) {
    throw new Error(`Unsupported report version: ${parsed.version}`)
  }
  return parsed as BenchReport
}

/**
 * Compares two reports and returns delta summaries for each metric.
 */
export interface MetricDelta {
  name: string
  type: "interaction" | "throughput" | "bundle"
  baseline: number
  current: number
  deltaPercent: number
}

export function compareReports(baseline: BenchReport, current: BenchReport): MetricDelta[] {
  const deltas: MetricDelta[] = []

  // Compare throughput
  for (const curr of current.throughput) {
    const base = baseline.throughput.find((b) => b.name === curr.name)
    if (base) {
      deltas.push({
        name: curr.name,
        type: "throughput",
        baseline: base.opsPerSecond,
        current: curr.opsPerSecond,
        deltaPercent: ((curr.opsPerSecond - base.opsPerSecond) / base.opsPerSecond) * 100,
      })
    }
  }

  // Compare bundle sizes
  for (const curr of current.bundle) {
    const base = baseline.bundle.find((b) => b.name === curr.name)
    if (base) {
      deltas.push({
        name: curr.name,
        type: "bundle",
        baseline: base.gzipBytes,
        current: curr.gzipBytes,
        deltaPercent: ((curr.gzipBytes - base.gzipBytes) / base.gzipBytes) * 100,
      })
    }
  }

  return deltas
}
