#!/usr/bin/env node
/**
 * Resolves which Playwright browsers can actually launch in this environment
 * and runs the browser test matrix against only those.
 *
 * Why: `vitest.browser.config.ts` defaults to the full chromium + firefox +
 * webkit matrix. A browser that cannot even *start* (for example webkit on a
 * host whose system ICU is mis-linked — `libicu*.so.74` pointing at the 77
 * libraries, which drop the `ureldatefmt_format_74` symbol the webkit build
 * needs) crashes the whole run before a single test executes, so the real
 * signal ("N component tests failed") is buried under a launch error.
 *
 * This script probes each configured browser with a headless launch and:
 *   • runs `pnpm test:browser` with only the browsers that launch,
 *   • prints a clear warning naming any browser it skipped and why,
 *   • fails if *no* browser can launch (an environment with zero browsers is a
 *     genuine break, not something to paper over),
 *   • propagates the test run's exit code.
 *
 * Honors `VITEST_BROWSERS` (comma-separated) to restrict the probe to a
 * subset, exactly as the vitest config does. Falls back to the full matrix.
 *
 * Usage:
 *   node scripts/run-browser-tests.mjs
 *   VITEST_BROWSERS=chromium node scripts/run-browser-tests.mjs
 */

import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const SUPPORTED = ["chromium", "firefox", "webkit"]

const configured = (process.env.VITEST_BROWSERS ?? "")
  .split(",")
  .map((b) => b.trim())
  .filter((b) => SUPPORTED.includes(b))

const candidates = configured.length > 0 ? configured : [...SUPPORTED]

// Resolve `playwright` from the workspace root (pnpm hoists it for the root
// project, which is where this script runs from).
const require = createRequire(import.meta.url)
let playwright
try {
  playwright = require("playwright")
} catch {
  console.error(
    "run-browser-tests: could not resolve the `playwright` package; run from the workspace root.",
  )
  process.exit(2)
}

const LAUNCH_TIMEOUT_MS = 30_000

async function probe(browser) {
  const type = playwright[browser]
  if (!type) return { ok: false, reason: "unknown browser type" }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LAUNCH_TIMEOUT_MS)
  try {
    const context = await type.launch({ headless: true })
    await context.close()
    return { ok: true, reason: "" }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const firstLine = message.split("\n").find((line) => line.trim().length > 0) ?? message
    return { ok: false, reason: firstLine.slice(0, 200) }
  } finally {
    clearTimeout(timer)
  }
}

const results = await Promise.all(
  candidates.map(async (browser) => ({ browser, ...(await probe(browser)) })),
)

const launchable = results.filter((r) => r.ok).map((r) => r.browser)
const skipped = results.filter((r) => !r.ok)

for (const s of skipped) {
  console.warn(
    `run-browser-tests: skipping ${s.browser} — cannot launch in this environment: ${s.reason}`,
  )
}

if (launchable.length === 0) {
  console.error("run-browser-tests: no browsers could launch; refusing to run the browser matrix.")
  process.exit(1)
}

console.log(`run-browser-tests: running browser matrix on: ${launchable.join(", ")}`)

const run = spawnSync("pnpm", ["run", "test:browser"], {
  env: { ...process.env, VITEST_BROWSERS: launchable.join(",") },
  stdio: "inherit",
})

process.exit(run.status ?? 1)
