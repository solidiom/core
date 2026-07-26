/**
 * Bundle harness — size-limit compatible configuration for bundle size tracking.
 *
 * Defines entry points and size budgets per package. Results are emitted
 * as part of the unified bench report.
 */

/** A bundle size check definition. */
export interface BundleSizeCheck {
  /** Human-readable name. */
  name: string
  /** Path to the entry file (relative to repo root). */
  path: string
  /** Maximum allowed size in bytes (gzip). */
  limitBytes: number
  /** Whether to include tree-shaking (import only used exports). */
  import?: string
}

/** Result of a bundle size check. */
export interface BundleSizeResult {
  name: string
  sizeBytes: number
  gzipBytes: number
  limitBytes: number
  passed: boolean
  timestamp: string
}

/** Configuration for the bundle harness. */
export interface BundleHarnessConfig {
  /** Checks to run. */
  checks: BundleSizeCheck[]
}

/**
 * Creates default bundle size checks for Solidiom packages.
 */
export function createBundleHarness(): BundleHarnessConfig {
  return {
    checks: [
      {
        name: "@solidiom/runtime (full)",
        path: "packages/runtime/dist/index.js",
        limitBytes: 30_000,
      },
      {
        name: "@solidiom/runtime (controllable-value only)",
        path: "packages/runtime/dist/index.js",
        import: "{ createControllableValue }",
        limitBytes: 2_000,
      },
    ],
  }
}

/**
 * Formats a bundle size result.
 */
export function formatBundleSizeResult(
  check: BundleSizeCheck,
  sizeBytes: number,
  gzipBytes: number,
): BundleSizeResult {
  return {
    name: check.name,
    sizeBytes,
    gzipBytes,
    limitBytes: check.limitBytes,
    passed: gzipBytes <= check.limitBytes,
    timestamp: new Date().toISOString(),
  }
}
