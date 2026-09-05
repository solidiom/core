import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  check,
  currentGateReport,
  initializeGateDiagnostics,
  run,
  writeGateReport,
} from "./gate-helpers"

let temporaryRoot: string | undefined

function initialize() {
  temporaryRoot = mkdtempSync(join(tmpdir(), "solidiom-gate-helper-"))
  initializeGateDiagnostics({
    cachePath: join(temporaryRoot, "cache.json"),
    reportDirectory: join(temporaryRoot, "reports"),
  })
  return temporaryRoot
}

afterEach(() => {
  if (temporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true })
  temporaryRoot = undefined
  delete process.env.SOLIDIOM_GATE_COMMAND_CACHE
  delete process.env.SOLIDIOM_GATE_REPORT_DIR
})

describe("gate helpers", () => {
  it("reuses an exact command result within one initialized gate run", () => {
    const root = initialize()
    const command = `node -e "console.log('Tests 5 passed')"`

    const first = run(command, { cwd: root })
    const second = run(command, { cwd: root })

    expect(first).toMatchObject({ ok: true, cached: false, attempts: 1 })
    expect(second).toMatchObject({ ok: true, cached: true, attempts: 1, durationMs: 0 })
    expect(second.stdout).toContain("Tests 5 passed")
    expect(currentGateReport().commands).toHaveLength(2)
  })

  it("reuses deterministic failures instead of retrying them in nested criteria", () => {
    const root = initialize()
    const command = `node -e "process.stderr.write('assertion failed'); process.exit(1)"`
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)

    const first = run(command, { cwd: root })
    const second = run(command, { cwd: root })

    expect(first).toMatchObject({ ok: false, cached: false, attempts: 1 })
    expect(second).toMatchObject({ ok: false, cached: true, attempts: 1 })
    expect(currentGateReport().commands.at(-1)).toMatchObject({
      cached: true,
      classification: "deterministic",
    })
    consoleError.mockRestore()
  })

  it("writes structured check and command diagnostics", () => {
    const root = initialize()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
    check("example passes", true)
    check("example fails", false, "expected detail")
    run(`node -e "process.stderr.write('authentication failed'); process.exit(1)"`, {
      cwd: root,
    })

    const path = writeGateReport("Test Gate")
    expect(path).not.toBeNull()
    const artifact = JSON.parse(readFileSync(path!, "utf8"))
    expect(artifact).toMatchObject({
      schemaVersion: 1,
      phase: "Test Gate",
      passed: 1,
      failed: 1,
    })
    expect(artifact.commands[0]).toMatchObject({
      ok: false,
      classification: "authentication",
    })
    consoleError.mockRestore()
  })
})
