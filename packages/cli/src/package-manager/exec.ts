/**
 * Package-manager execution boundary (CLI-005).
 *
 * The only place in the CLI that should ever invoke a package-manager
 * binary. Uses `execFile` with an argv array — never a shell string built
 * via interpolation — so package names, versions, or any other value
 * derived from registry data or user input cannot be interpreted as shell
 * syntax. Do not add a `exec`/`spawn` call with `shell: true` anywhere else
 * in this codebase as a substitute for this module.
 */

import { execFile } from "node:child_process"
import type { PackageManagerCommand } from "./commands"

export interface RunPackageManagerOptions {
  command: PackageManagerCommand
  cwd: string
  /** Defaults to `process.env`. */
  env?: Record<string, string | undefined>
  /**
   * When true, does not execute — returns immediately with the command that
   * would have been run. Callers that only want to print a command (the
   * default behavior of `solidiom add` in package mode) should prefer
   * `formatCommand` from commands.ts instead of setting this; `dryRun` here
   * exists so a single call site can support both without a branch.
   */
  dryRun?: boolean
  /** Maximum time to allow the command to run, in milliseconds. */
  timeoutMs?: number
}

export interface RunPackageManagerResult {
  code: number
  stdout: string
  stderr: string
  /** True when `dryRun` was set and the command was not actually executed. */
  skipped: boolean
}

/**
 * Runs a package-manager command via `execFile` (argv array, no shell).
 * Resolves rather than rejects on a non-zero exit — callers decide how to
 * treat failure, consistent with how `runVerify`/`runPlan` return failure
 * information rather than throwing for expected failure modes.
 */
export function runPackageManager(
  options: RunPackageManagerOptions,
): Promise<RunPackageManagerResult> {
  const { command, cwd, env = process.env, dryRun = false, timeoutMs = 5 * 60 * 1000 } = options

  if (dryRun) {
    return Promise.resolve({ code: 0, stdout: "", stderr: "", skipped: true })
  }

  return new Promise((resolve) => {
    execFile(
      command.bin,
      command.args,
      { cwd, env, timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error && typeof (error as NodeJS.ErrnoException).code === "string") {
          // The binary itself could not be found/spawned (e.g. the manager
          // isn't installed) — surface as a synthetic non-zero exit rather
          // than throwing, so callers have one failure path to handle.
          resolve({ code: 127, stdout, stderr: stderr || String(error), skipped: false })
          return
        }
        const code = error && typeof error.code === "number" ? error.code : error ? 1 : 0
        resolve({ code, stdout, stderr, skipped: false })
      },
    )
  })
}
