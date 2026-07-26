/**
 * Bundle harness — size-limit compatible configuration for bundle size tracking.
 *
 * Defines entry points and size budgets per package. Results are emitted
 * as part of the unified bench report.
 */
/** A bundle size check definition. */
export interface BundleSizeCheck {
    /** Human-readable name. */
    name: string;
    /** Path to the entry file (relative to repo root). */
    path: string;
    /** Maximum allowed size in bytes (gzip). */
    limitBytes: number;
    /** Whether to include tree-shaking (import only used exports). */
    import?: string;
}
/** Result of a bundle size check. */
export interface BundleSizeResult {
    name: string;
    sizeBytes: number;
    gzipBytes: number;
    limitBytes: number;
    passed: boolean;
    timestamp: string;
}
/** Configuration for the bundle harness. */
export interface BundleHarnessConfig {
    /** Checks to run. */
    checks: BundleSizeCheck[];
}
/**
 * Creates default bundle size checks for Solidiom packages.
 */
export declare function createBundleHarness(): BundleHarnessConfig;
/**
 * Formats a bundle size result.
 */
export declare function formatBundleSizeResult(check: BundleSizeCheck, sizeBytes: number, gzipBytes: number): BundleSizeResult;
//# sourceMappingURL=bundle-harness.d.ts.map