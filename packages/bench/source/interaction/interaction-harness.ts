/**
 * Interaction harness — configuration for Playwright-based interaction benchmarks.
 *
 * Captures traces with debug-only observer/listener probes to measure
 * event handler execution time, layout thrashing, and re-render counts.
 */

/** An interaction benchmark definition. */
export interface InteractionBenchmark {
  /** Name of the benchmark. */
  name: string
  /** Target URL or component route. */
  url: string
  /** Playwright actions to perform. */
  actions: InteractionAction[]
  /** Expected metrics to capture. */
  metrics: InteractionMetric[]
}

/** A single Playwright action in a benchmark. */
export interface InteractionAction {
  type: "click" | "keyboard" | "focus" | "hover" | "wait"
  selector?: string
  key?: string
  delay?: number
}

/** A metric captured during interaction. */
export interface InteractionMetric {
  name: string
  unit: "ms" | "count" | "bytes"
}

/** Result of running an interaction benchmark. */
export interface InteractionResult {
  name: string
  metrics: Record<string, number>
  tracePath?: string
  timestamp: string
}

/** Configuration for the interaction harness. */
export interface InteractionHarnessConfig {
  /** Base URL for the test server. */
  baseUrl: string
  /** Directory to write trace files. */
  traceDir: string
  /** Whether to capture full Playwright traces. */
  captureTraces: boolean
}

/**
 * Creates an interaction harness configuration with defaults.
 */
export function createInteractionHarness(
  overrides: Partial<InteractionHarnessConfig> = {},
): InteractionHarnessConfig {
  return {
    baseUrl: "http://localhost:3000",
    traceDir: "./bench/traces",
    captureTraces: true,
    ...overrides,
  }
}

/**
 * Formats interaction results into a standard report entry.
 */
export function formatInteractionResult(
  benchmark: InteractionBenchmark,
  metrics: Record<string, number>,
  tracePath?: string,
): InteractionResult {
  return {
    name: benchmark.name,
    metrics,
    tracePath,
    timestamp: new Date().toISOString(),
  }
}
