/**
 * Shared helpers for phase gate scripts.
 *
 * Provides subprocess execution, test result parsing, and consistent
 * pass/fail reporting. Gates import this to run real checks.
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

export const ROOT = join(import.meta.dirname ?? __dirname, "..")

export interface GateReport {
  passed: number
  failed: number
  checks: Array<{ name: string; ok: boolean; detail?: string }>
}

const report: GateReport = { passed: 0, failed: 0, checks: [] }

/** Log a passing or failing check. */
export function check(name: string, condition: boolean, detail?: string): boolean {
  report.checks.push({ name, ok: condition, detail })
  if (condition) {
    console.log(`  ✓ ${name}`)
    report.passed++
  } else {
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`)
    report.failed++
  }
  return condition
}

/** Numbered check variant for acceptance criteria. */
export function checkN(id: number, name: string, condition: boolean, detail?: string): boolean {
  return check(`#${id} ${name}`, condition, detail)
}

/** Print summary and exit with appropriate code. */
export function summarize(phase: string): never {
  console.log(`\n${"═".repeat(50)}`)
  console.log(`${phase}: ${report.passed} passed, ${report.failed} failed`)
  if (report.failed > 0) {
    console.error(`\n⚠ ${phase} FAILED — fix issues above.`)
    process.exit(1)
  }
  console.log(`\n✓ ${phase} PASSED`)
  process.exit(0)
}

/** Run a shell command and return { ok, stdout, stderr }. */
export function run(
  cmd: string,
  opts?: { cwd?: string },
): { ok: boolean; stdout: string; stderr: string } {
  const cwd = opts?.cwd ?? ROOT
  try {
    const stdout = execSync(cmd, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 120_000,
    })
    return { ok: true, stdout, stderr: "" }
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number }
    return { ok: false, stdout: e.stdout ?? "", stderr: e.stderr ?? "" }
  }
}

/**
 * Run tests for a package and verify they pass with a minimum count AND zero failures.
 * Returns true only if the test output reports >= minTests passing and 0 failed.
 */
export function runTests(pkg: string, minTests: number): boolean {
  const result = run(`pnpm --filter ${pkg} test`, { cwd: ROOT })

  // Strip ANSI escape codes before matching
  const combined = (result.stdout + result.stderr).replace(/\x1B\[[0-9;]*m/g, "")

  // Check for failures first — any failure count > 0 means the gate fails
  const failMatch = combined.match(/(\d+)\s+failed/)
  if (failMatch && parseInt(failMatch[1], 10) > 0) {
    return false
  }

  // Non-zero exit without parseable output is also a failure
  if (!result.ok && !combined.match(/\d+\s+passed/)) {
    return false
  }

  // Parse vitest output: "N passed" in the Tests summary line
  // Format: "Tests  X failed | Y passed (Z)" or "Tests  Y passed (Z)"
  const testsLine = combined.match(/Tests\s+.*?(\d+)\s+passed/)
  if (testsLine) {
    return parseInt(testsLine[1], 10) >= minTests
  }
  // Fallback: look for "N passed" anywhere
  const fallback = combined.match(/(\d+)\s+passed/)
  if (fallback) {
    return parseInt(fallback[1], 10) >= minTests
  }
  return false
}

/**
 * Run typecheck for a package and verify it passes (exit 0).
 */
export function runTypecheck(pkg: string): boolean {
  const result = run(`pnpm --filter ${pkg} typecheck`, { cwd: ROOT })
  return result.ok
}

/**
 * Run build for a package and verify it passes (exit 0).
 */
export function runBuild(pkg: string): boolean {
  const result = run(`pnpm --filter ${pkg} build`, { cwd: ROOT })
  return result.ok
}

/**
 * Verify a file exists AND contains a specific string pattern.
 */
export function fileContains(path: string, pattern: string | RegExp): boolean {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  if (!existsSync(fullPath)) return false
  const content = readFileSync(fullPath, "utf8")
  if (typeof pattern === "string") return content.includes(pattern)
  return pattern.test(content)
}

/**
 * Verify a file exists.
 */
export function fileExists(path: string): boolean {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  return existsSync(fullPath)
}

/**
 * Read and parse a JSON file. Returns null on failure.
 */
export function readJSON<T = unknown>(path: string): T | null {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  try {
    return JSON.parse(readFileSync(fullPath, "utf8")) as T
  } catch {
    return null
  }
}

/**
 * Verify a package.json has no dependencies matching a pattern.
 */
export function noDepsMatching(pkgJsonPath: string, pattern: RegExp): boolean {
  const pkg = readJSON<Record<string, unknown>>(pkgJsonPath)
  if (!pkg) return false
  const allDeps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.peerDependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  }
  return !Object.keys(allDeps).some((d) => pattern.test(d))
}
