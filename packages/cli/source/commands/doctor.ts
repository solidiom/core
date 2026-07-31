/**
 * solidiom doctor — checks project configuration health.
 */

import { Command, Option } from "clipanion"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { ConfigSchema, PolicySchema } from "../schemas"
import { detectPackageManager } from "../package-manager/detect"
import pc from "picocolors"

export interface DoctorCheck {
  name: string
  status: "pass" | "warn" | "fail"
  detail?: string
}

export interface DoctorResult {
  checks: DoctorCheck[]
  healthy: boolean
}

/**
 * Core doctor logic.
 */
export function runDoctor(cwd: string): DoctorResult {
  const checks: DoctorCheck[] = []

  // Check .solidiom/config.json
  const configPath = join(cwd, ".solidiom", "config.json")
  if (existsSync(configPath)) {
    try {
      ConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8")))
      checks.push({ name: "config.json valid", status: "pass" })
    } catch (e) {
      checks.push({ name: "config.json valid", status: "fail", detail: String(e) })
    }
  } else {
    checks.push({
      name: "config.json exists",
      status: "warn",
      detail: "Run 'solidiom init' to create",
    })
  }

  // Check .solidiom/policy.json
  const policyPath = join(cwd, ".solidiom", "policy.json")
  if (existsSync(policyPath)) {
    try {
      PolicySchema.parse(JSON.parse(readFileSync(policyPath, "utf8")))
      checks.push({ name: "policy.json valid", status: "pass" })
    } catch (e) {
      checks.push({ name: "policy.json valid", status: "fail", detail: String(e) })
    }
  } else {
    checks.push({ name: "policy.json exists", status: "pass", detail: "Optional — using defaults" })
  }

  // Check solid-js dependency
  const pkgPath = join(cwd, "package.json")
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
    const solidDep = pkg.dependencies?.["solid-js"] ?? pkg.devDependencies?.["solid-js"]
    if (solidDep) {
      checks.push({ name: "solid-js dependency", status: "pass", detail: solidDep })
    } else {
      checks.push({
        name: "solid-js dependency",
        status: "fail",
        detail: "solid-js not found in package.json",
      })
    }
  }

  // Check lockfile consistency
  const lockPath = join(cwd, ".solidiom", "lock.json")
  if (existsSync(lockPath)) {
    try {
      const lock = JSON.parse(readFileSync(lockPath, "utf8"))
      if (lock.version === 1) {
        checks.push({ name: "lock.json valid", status: "pass" })
      } else {
        checks.push({
          name: "lock.json valid",
          status: "warn",
          detail: `Unknown version: ${lock.version}`,
        })
      }

      // CLI-003: surface unverified source installs as a warning — this is
      // an explicit escape hatch (--allow-unverified), not an error state.
      const entries: Array<{ provenance?: string }> = Object.values(lock.installed ?? {})
      const unverifiedCount = entries.filter((e) => e.provenance === "unverified").length
      if (unverifiedCount > 0) {
        checks.push({
          name: "source-install provenance",
          status: "warn",
          detail: `${unverifiedCount} unverified entr${unverifiedCount === 1 ? "y" : "ies"} in lock.json`,
        })
      } else {
        checks.push({ name: "source-install provenance", status: "pass" })
      }
    } catch {
      checks.push({ name: "lock.json valid", status: "fail", detail: "Parse error" })
    }
  }

  // Report the detected package manager and how it was determined (CLI-005).
  const pm = detectPackageManager({ cwd })
  checks.push({
    name: "package manager",
    status: "pass",
    detail: `${pm.name}${pm.majorVersion ? `@${pm.majorVersion}` : ""} (via ${pm.source})`,
  })

  const healthy = checks.every((c) => c.status !== "fail")
  return { checks, healthy }
}

export class DoctorCommand extends Command {
  static override paths = [["doctor"]]
  static override usage = Command.Usage({
    description: "Check project configuration health",
  })

  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runDoctor(process.cwd())

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return result.healthy ? 0 : 1
    }

    this.context.stdout.write(pc.bold("solidiom doctor\n\n"))
    for (const check of result.checks) {
      const icon =
        check.status === "pass"
          ? pc.green("✓")
          : check.status === "warn"
            ? pc.yellow("⚠")
            : pc.red("✗")
      const detail = check.detail ? pc.dim(` (${check.detail})`) : ""
      this.context.stdout.write(`  ${icon} ${check.name}${detail}\n`)
    }

    this.context.stdout.write(
      result.healthy ? pc.green("\nHealthy.\n") : pc.red("\nIssues found.\n"),
    )
    return result.healthy ? 0 : 1
  }
}
