// src/interaction/interaction-harness.ts
function createInteractionHarness(overrides = {}) {
  return {
    baseUrl: "http://localhost:3000",
    traceDir: "./bench/traces",
    captureTraces: true,
    ...overrides
  };
}
function formatInteractionResult(benchmark, metrics, tracePath) {
  return {
    name: benchmark.name,
    metrics,
    tracePath,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// src/throughput/throughput-harness.ts
function createThroughputHarness(overrides = {}) {
  return {
    minTime: 500,
    maxIterations: 1e6,
    ...overrides
  };
}
function runSimpleBench(benchmark, config = createThroughputHarness()) {
  const { minTime, maxIterations } = config;
  for (let i = 0; i < 10; i++) benchmark.fn();
  let iterations = 0;
  const startTime = performance.now();
  const deadline = startTime + minTime;
  while (performance.now() < deadline && iterations < maxIterations) {
    benchmark.fn();
    iterations++;
  }
  const elapsed = performance.now() - startTime;
  const avgNs = elapsed * 1e6 / iterations;
  const opsPerSecond = Math.round(iterations / elapsed * 1e3);
  return {
    name: benchmark.name,
    opsPerSecond,
    avgNs: Math.round(avgNs * 100) / 100,
    samples: iterations,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// src/bundle/bundle-harness.ts
function createBundleHarness() {
  return {
    checks: [
      {
        name: "@solidiom/runtime (full)",
        path: "packages/runtime/dist/index.js",
        limitBytes: 3e4
      },
      {
        name: "@solidiom/runtime (controllable-value only)",
        path: "packages/runtime/dist/index.js",
        import: "{ createControllableValue }",
        limitBytes: 2e3
      }
    ]
  };
}
function formatBundleSizeResult(check, sizeBytes, gzipBytes) {
  return {
    name: check.name,
    sizeBytes,
    gzipBytes,
    limitBytes: check.limitBytes,
    passed: gzipBytes <= check.limitBytes,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// src/report/report.ts
function createReport(options = {}) {
  return {
    version: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    commitSha: options.commitSha,
    interaction: options.interaction ?? [],
    throughput: options.throughput ?? [],
    bundle: options.bundle ?? []
  };
}
function serializeReport(report) {
  return JSON.stringify(report, null, 2);
}
function parseReport(json) {
  const parsed = JSON.parse(json);
  if (parsed.version !== 1) {
    throw new Error(`Unsupported report version: ${parsed.version}`);
  }
  return parsed;
}
function compareReports(baseline, current) {
  const deltas = [];
  for (const curr of current.throughput) {
    const base = baseline.throughput.find((b) => b.name === curr.name);
    if (base) {
      deltas.push({
        name: curr.name,
        type: "throughput",
        baseline: base.opsPerSecond,
        current: curr.opsPerSecond,
        deltaPercent: (curr.opsPerSecond - base.opsPerSecond) / base.opsPerSecond * 100
      });
    }
  }
  for (const curr of current.bundle) {
    const base = baseline.bundle.find((b) => b.name === curr.name);
    if (base) {
      deltas.push({
        name: curr.name,
        type: "bundle",
        baseline: base.gzipBytes,
        current: curr.gzipBytes,
        deltaPercent: (curr.gzipBytes - base.gzipBytes) / base.gzipBytes * 100
      });
    }
  }
  return deltas;
}
export {
  compareReports,
  createBundleHarness,
  createInteractionHarness,
  createReport,
  createThroughputHarness,
  formatBundleSizeResult,
  formatInteractionResult,
  parseReport,
  runSimpleBench,
  serializeReport
};
//# sourceMappingURL=index.js.map