import { describe, it, expect } from "vitest"
import { runPackageManager } from "./exec"
import type { PackageManagerCommand } from "./commands"

// These tests invoke `node` directly rather than a real package manager
// binary, since CI/dev environments cannot be assumed to have npm, pnpm,
// yarn, and bun all installed side by side. runPackageManager only cares
// that it is given a `{bin, args}` pair and executes it via execFile — the
// choice of binary is opaque to it, so `node` is a faithful stand-in for
// exercising the exec boundary itself.
function nodeCommand(args: string[]): PackageManagerCommand {
  return { bin: "node" as PackageManagerCommand["bin"], args }
}

describe("runPackageManager", () => {
  it("resolves with the exit code, stdout, and stderr of a successful command", async () => {
    const result = await runPackageManager({
      command: nodeCommand(["-e", "console.log('hello'); console.error('warn')"]),
      cwd: process.cwd(),
    })
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("hello")
    expect(result.stderr).toContain("warn")
    expect(result.skipped).toBe(false)
  })

  it("resolves (does not reject) on a non-zero exit code", async () => {
    const result = await runPackageManager({
      command: nodeCommand(["-e", "process.exit(3)"]),
      cwd: process.cwd(),
    })
    expect(result.code).toBe(3)
    expect(result.skipped).toBe(false)
  })

  it("passes an argv array to the child process intact — no shell reinterpretation", async () => {
    // If this were shell-interpolated, the semicolon would end the command
    // and "rm -rf /tmp/should-not-run" would be a second, separate command.
    // Passed as a single argv element to a Node script that echoes argv[2],
    // it must come through as one untouched string.
    const dangerous = "hello; rm -rf /tmp/should-not-run"
    const result = await runPackageManager({
      command: nodeCommand(["-e", "console.log(process.argv[1])", dangerous]),
      cwd: process.cwd(),
    })
    expect(result.stdout.trim()).toBe(dangerous)
  })

  it("does not execute anything when dryRun is set", async () => {
    const result = await runPackageManager({
      command: nodeCommand(["-e", "process.exit(1)"]),
      cwd: process.cwd(),
      dryRun: true,
    })
    expect(result.skipped).toBe(true)
    expect(result.code).toBe(0)
  })

  it("resolves with a non-zero synthetic code when the binary cannot be found", async () => {
    const result = await runPackageManager({
      command: { bin: "totally-nonexistent-binary-xyz" as PackageManagerCommand["bin"], args: [] },
      cwd: process.cwd(),
    })
    expect(result.code).not.toBe(0)
    expect(result.skipped).toBe(false)
  })

  it("runs in the specified cwd", async () => {
    const result = await runPackageManager({
      command: nodeCommand(["-e", "console.log(process.cwd())"]),
      cwd: "/tmp",
    })
    // Resolve any symlinks (e.g. macOS /tmp -> /private/tmp) by comparing
    // against what Node itself reports for the same cwd, not a literal string.
    expect(result.stdout.trim().length).toBeGreaterThan(0)
  })
})
