/**
 * Throughput harness — mitata-compatible microbenchmark runner.
 *
 * Wraps mitata's bench/run API with Solidiom-specific reporting format.
 * Measures ops/sec for pure logic (state transitions, collection ops, etc.).
 */
/** A throughput benchmark definition. */
export interface ThroughputBenchmark {
    /** Name of the benchmark. */
    name: string;
    /** The function to benchmark. */
    fn: () => void | Promise<void>;
    /** Optional setup function called once before iterations. */
    setup?: () => void | Promise<void>;
    /** Optional teardown function called once after all iterations. */
    teardown?: () => void | Promise<void>;
}
/** Result of a throughput benchmark run. */
export interface ThroughputResult {
    name: string;
    opsPerSecond: number;
    avgNs: number;
    samples: number;
    timestamp: string;
}
/** Configuration for the throughput harness. */
export interface ThroughputHarnessConfig {
    /** Minimum sample time in ms. Default: 500. */
    minTime: number;
    /** Maximum iterations. Default: 1_000_000. */
    maxIterations: number;
}
/**
 * Creates a throughput harness configuration with defaults.
 */
export declare function createThroughputHarness(overrides?: Partial<ThroughputHarnessConfig>): ThroughputHarnessConfig;
/**
 * Runs a simple synchronous benchmark and returns the result.
 *
 * This is a minimal built-in runner. For production benchmarks,
 * use mitata directly with this harness providing the config/reporting layer.
 */
export declare function runSimpleBench(benchmark: ThroughputBenchmark, config?: ThroughputHarnessConfig): ThroughputResult;
//# sourceMappingURL=throughput-harness.d.ts.map