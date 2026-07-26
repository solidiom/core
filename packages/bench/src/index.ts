/**
 * @solidiom/bench — Benchmark harness for Solidiom primitives.
 *
 * Provides interaction (Playwright traces), throughput (mitata-compatible),
 * and bundle (size-limit) measurement with unified JSON reporting.
 */

export {
  createInteractionHarness,
  formatInteractionResult,
  type InteractionBenchmark,
  type InteractionAction,
  type InteractionMetric,
  type InteractionResult,
  type InteractionHarnessConfig,
} from "./interaction/interaction-harness"

export {
  createThroughputHarness,
  runSimpleBench,
  type ThroughputBenchmark,
  type ThroughputResult,
  type ThroughputHarnessConfig,
} from "./throughput/throughput-harness"

export {
  createBundleHarness,
  formatBundleSizeResult,
  type BundleSizeCheck,
  type BundleSizeResult,
  type BundleHarnessConfig,
} from "./bundle/bundle-harness"

export {
  createReport,
  serializeReport,
  parseReport,
  compareReports,
  type BenchReport,
  type ReportOptions,
  type MetricDelta,
} from "./report/report"
