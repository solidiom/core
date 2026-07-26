/**
 * Report — unified JSON emitter for all benchmark types.
 *
 * Collects interaction, throughput, and bundle results into a single
 * JSON report file for CI comparison and dashboard rendering.
 */
import type { InteractionResult } from "../interaction/interaction-harness";
import type { ThroughputResult } from "../throughput/throughput-harness";
import type { BundleSizeResult } from "../bundle/bundle-harness";
/** A complete benchmark report. */
export interface BenchReport {
    /** Report format version. */
    version: 1;
    /** ISO timestamp when report was generated. */
    generatedAt: string;
    /** Git commit SHA (if available). */
    commitSha?: string;
    /** Interaction benchmark results. */
    interaction: InteractionResult[];
    /** Throughput benchmark results. */
    throughput: ThroughputResult[];
    /** Bundle size results. */
    bundle: BundleSizeResult[];
}
/** Options for creating a report. */
export interface ReportOptions {
    commitSha?: string;
    interaction?: InteractionResult[];
    throughput?: ThroughputResult[];
    bundle?: BundleSizeResult[];
}
/**
 * Creates a complete benchmark report.
 */
export declare function createReport(options?: ReportOptions): BenchReport;
/**
 * Serializes a report to JSON string.
 */
export declare function serializeReport(report: BenchReport): string;
/**
 * Parses a JSON string into a BenchReport.
 * Throws if the format is invalid.
 */
export declare function parseReport(json: string): BenchReport;
/**
 * Compares two reports and returns delta summaries for each metric.
 */
export interface MetricDelta {
    name: string;
    type: "interaction" | "throughput" | "bundle";
    baseline: number;
    current: number;
    deltaPercent: number;
}
export declare function compareReports(baseline: BenchReport, current: BenchReport): MetricDelta[];
//# sourceMappingURL=report.d.ts.map