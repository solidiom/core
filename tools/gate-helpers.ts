/**
 * Shared helpers for phase gate scripts.
 *
 * Provides subprocess execution, per-release command de-duplication, structured
 * diagnostics, test result parsing, and consistent pass/fail reporting.
 */

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

export const ROOT = join(import.meta.dirname ?? __dirname, "..")

export type FailureClassification =
  "authentication" | "deterministic" | "infrastructure" | "timeout"

export interface GateCommandRecord {
  command: string
  cwd: string
  ok: boolean
  timedOut: boolean
  attempts: number
  durationMs: number
  cached: boolean
  classification?: FailureClassification
}

export interface GateReport {
  startedAt: string
  passed: number
  failed: number
  checks: Array<{ name: string; ok: boolean; detail?: string }>
  commands: GateCommandRecord[]
}

const createReport = (): GateReport => ({
  startedAt: new Date().toISOString(),
  passed: 0,
  failed: 0,
  checks: [],
  commands: [],
})

let report = createReport()

export interface GateDiagnosticsOptions {
  cachePath?: string
  reportDirectory?: string
  reset?: boolean
}

/** Initialize one top-level gate run. Child gate processes inherit these paths. */
export function initializeGateDiagnostics(options: GateDiagnosticsOptions = {}): void {
  const cachePath = options.cachePath ?? join(ROOT, ".tmp", "gate-command-cache.json")
  const reportDirectory = options.reportDirectory ?? join(ROOT, "artifacts", "gate-reports")
  mkdirSync(dirname(cachePath), { recursive: true })
  mkdirSync(reportDirectory, { recursive: true })
  if (options.reset !== false) {
    rmSync(cachePath, { force: true })
    rmSync(reportDirectory, { recursive: true, force: true })
    mkdirSync(reportDirectory, { recursive: true })
  }
  process.env.SOLIDIOM_GATE_COMMAND_CACHE = cachePath
  process.env.SOLIDIOM_GATE_REPORT_DIR = reportDirectory
  report = createReport()
}

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

function reportSlug(phase: string): string {
  return phase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Persist the current process's checks and command timings. */
export function writeGateReport(phase: string): string | null {
  const directory = process.env.SOLIDIOM_GATE_REPORT_DIR
  if (!directory) return null
  mkdirSync(directory, { recursive: true })
  const path = join(directory, `${reportSlug(phase)}.json`)
  const payload = {
    schemaVersion: 1,
    phase,
    generatedAt: new Date().toISOString(),
    ...report,
  }
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
  return path
}

/** Print summary, persist diagnostics, and exit with the appropriate code. */
export function summarize(phase: string): never {
  const reportPath = writeGateReport(phase)
  console.log(`\n${"═".repeat(50)}`)
  console.log(`${phase}: ${report.passed} passed, ${report.failed} failed`)
  if (reportPath) console.log(`Structured diagnostics: ${reportPath}`)
  if (report.failed > 0) {
    console.error(`\n⚠ ${phase} FAILED — fix issues above.`)
    process.exit(1)
  }
  console.log(`\n✓ ${phase} PASSED`)
  process.exit(0)
}

export interface RunOptions {
  cwd?: string
  timeout?: number
  retries?: number
  cache?: boolean
}

export interface RunResult {
  ok: boolean
  stdout: string
  stderr: string
  timedOut?: boolean
  attempts: number
  durationMs: number
  cached?: boolean
}

type CommandCache = Record<string, RunResult>

function outputTail(output: string, maxLines = 80): string {
  const lines = output.trimEnd().split("\n")
  return lines.slice(-maxLines).join("\n")
}

function boundedCacheOutput(output: string, maxBytes = 512 * 1024): string {
  return output.length <= maxBytes ? output : output.slice(-maxBytes)
}

function cacheKey(cwd: string, command: string): string {
  return JSON.stringify([cwd, command])
}

function readCommandCache(): CommandCache {
  const path = process.env.SOLIDIOM_GATE_COMMAND_CACHE
  if (!path || !existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, "utf8")) as CommandCache
  } catch {
    return {}
  }
}

function writeCommandCache(key: string, result: RunResult): void {
  const path = process.env.SOLIDIOM_GATE_COMMAND_CACHE
  if (!path) return
  mkdirSync(dirname(path), { recursive: true })
  // Re-read immediately before writing so a parent process cannot overwrite
  // entries produced by a nested structural/acceptance gate.
  const cache = readCommandCache()
  cache[key] = {
    ...result,
    stdout: boundedCacheOutput(result.stdout),
    stderr: boundedCacheOutput(result.stderr),
    cached: false,
  }
  const temporary = `${path}.${process.pid}.tmp`
  writeFileSync(temporary, `${JSON.stringify(cache)}\n`, "utf8")
  renameSync(temporary, path)
}

function classifyFailure(result: RunResult): FailureClassification | undefined {
  if (result.ok) return undefined
  if (result.timedOut) return "timeout"
  const output = `${result.stdout}\n${result.stderr}`
  if (/\b(401|403|authentication|invalid access token|permission denied)\b/i.test(output)) {
    return "authentication"
  }
  if (
    /\b(ECONN|ENETUNREACH|EAI_AGAIN|socket timeout|network|registry unavailable)\b/i.test(output)
  ) {
    return "infrastructure"
  }
  return "deterministic"
}

function recordCommand(command: string, cwd: string, result: RunResult): void {
  report.commands.push({
    command,
    cwd,
    ok: result.ok,
    timedOut: result.timedOut === true,
    attempts: result.attempts,
    durationMs: result.durationMs,
    cached: result.cached === true,
    classification: classifyFailure(result),
  })
}

/** Run a shell command and return its captured result. */
export function run(cmd: string, opts?: RunOptions): RunResult {
  const cwd = opts?.cwd ?? ROOT
  const timeout = opts?.timeout ?? 300_000
  const maxAttempts = (opts?.retries ?? 0) + 1
  const key = cacheKey(cwd, cmd)
  const cacheEnabled = opts?.cache !== false && Boolean(process.env.SOLIDIOM_GATE_COMMAND_CACHE)

  if (cacheEnabled) {
    const cached = readCommandCache()[key]
    if (cached) {
      const result = { ...cached, durationMs: 0, cached: true }
      console.log(`  ↪ reused successful-or-final result: ${cmd}`)
      recordCommand(cmd, cwd, result)
      return result
    }
  }

  const startedAt = Date.now()
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const stdout = execSync(cmd, {
        cwd,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout,
        maxBuffer: 64 * 1024 * 1024,
      })
      const result: RunResult = {
        ok: true,
        stdout,
        stderr: "",
        attempts: attempt,
        durationMs: Date.now() - startedAt,
        cached: false,
      }
      if (cacheEnabled) writeCommandCache(key, result)
      recordCommand(cmd, cwd, result)
      return result
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string; status?: number; signal?: string }
      // execSync kills the process with SIGTERM and sets `signal` (not `status`) on timeout.
      const timedOut = e.signal === "SIGTERM" || e.signal === "SIGKILL"
      const result: RunResult = {
        ok: false,
        stdout: e.stdout ?? "",
        stderr: e.stderr ?? "",
        timedOut,
        attempts: attempt,
        durationMs: Date.now() - startedAt,
        cached: false,
      }

      if (attempt < maxAttempts) {
        console.warn(
          `  ↻ command failed${timedOut ? " (timed out)" : ""}; retrying ${cmd} (${attempt + 1}/${maxAttempts})`,
        )
        continue
      }

      if (cacheEnabled) writeCommandCache(key, result)
      recordCommand(cmd, cwd, result)
      const captured = [result.stdout, result.stderr].filter(Boolean).join("\n")
      console.error(
        `\n--- failed command (${attempt}/${maxAttempts}${timedOut ? ", timed out" : ""}): ${cmd} ---`,
      )
      if (captured) console.error(outputTail(captured))
      console.error("--- end failed command ---\n")
      return result
    }
  }

  throw new Error(`unreachable: no attempt made for ${cmd}`)
}

/** Run package tests and verify a minimum passing count with zero failures. */
export function runTests(
  pkg: string,
  minTests: number,
  opts?: { timeout?: number; retries?: number },
): boolean {
  const result = run(`pnpm --filter ${pkg} test`, {
    cwd: ROOT,
    timeout: opts?.timeout,
    retries: opts?.retries,
  })
  const combined = (result.stdout + result.stderr).replace(/\x1B\[[0-9;]*m/g, "")
  const failMatch = combined.match(/(\d+)\s+failed/)
  if (failMatch && parseInt(failMatch[1], 10) > 0) return false
  if (!result.ok && !combined.match(/\d+\s+passed/)) return false
  const testsLine = combined.match(/Tests\s+.*?(\d+)\s+passed/)
  if (testsLine) return parseInt(testsLine[1], 10) >= minTests
  const fallback = combined.match(/(\d+)\s+passed/)
  return fallback ? parseInt(fallback[1], 10) >= minTests : false
}

/** Route typechecks through Nx so dependency builds are ordered correctly. */
export function runTypecheck(pkg: string, opts?: { timeout?: number }): boolean {
  return run(`pnpm exec nx typecheck ${pkg}`, { cwd: ROOT, timeout: opts?.timeout }).ok
}

/** Route builds through Nx so dependency builds are ordered and cached. */
export function runBuild(pkg: string, opts?: { timeout?: number }): boolean {
  return run(`pnpm exec nx build ${pkg}`, { cwd: ROOT, timeout: opts?.timeout }).ok
}

/** Verify a file exists and contains a string or regular-expression pattern. */
export function fileContains(path: string, pattern: string | RegExp): boolean {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  if (!existsSync(fullPath)) return false
  const content = readFileSync(fullPath, "utf8")
  return typeof pattern === "string" ? content.includes(pattern) : pattern.test(content)
}

export function fileExists(path: string): boolean {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  return existsSync(fullPath)
}

export function readJSON<T = unknown>(path: string): T | null {
  const fullPath = path.startsWith("/") ? path : join(ROOT, path)
  try {
    return JSON.parse(readFileSync(fullPath, "utf8")) as T
  } catch {
    return null
  }
}

export function noDepsMatching(pkgJsonPath: string, pattern: RegExp): boolean {
  const pkg = readJSON<Record<string, unknown>>(pkgJsonPath)
  if (!pkg) return false
  const allDeps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.peerDependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  }
  return !Object.keys(allDeps).some((dependency) => pattern.test(dependency))
}

/** Exposed for focused tests and report aggregation. */
export function currentGateReport(): GateReport {
  return structuredClone(report)
}
