/**
 * solidiom inspect — inspect installed primitives.
 *
 * Subcommands: source, manifest, explain, files, provenance.
 */

import { Command, Option } from "clipanion"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { readLock, type LockEntry } from "../source-install/install"
import pc from "picocolors"

export interface InspectResult {
  primitive?: string
  mode: string
  entries: LockEntry[]
  manifest?: Record<string, unknown>
}

/**
 * Core inspect logic.
 */
export function runInspect(options: {
  cwd: string
  subcommand: string
  primitive?: string
}): InspectResult {
  const { cwd, subcommand, primitive } = options
  const lock = readLock(cwd)

  const entries = Object.values(lock.installed).filter(
    (e) => !primitive || e.primitive === primitive,
  )

  if (subcommand === "manifest") {
    const registryPath = join(cwd, "..", "..", "registry", `${primitive}.json`)
    const manifest = existsSync(registryPath)
      ? JSON.parse(readFileSync(registryPath, "utf8"))
      : null
    return { primitive, mode: "manifest", entries, manifest }
  }

  return { primitive, mode: subcommand, entries }
}

export class InspectCommand extends Command {
  static override paths = [["inspect"]]
  static override usage = Command.Usage({
    description: "Inspect installed primitive source, manifest, or provenance",
    examples: [
      ["Show installed source files", "solidiom inspect source"],
      ["Show primitive manifest", "solidiom inspect manifest dialog"],
      ["Show file provenance", "solidiom inspect provenance"],
      ["List all installed files", "solidiom inspect files"],
    ],
  })

  subcommand = Option.String({ required: true })
  primitive = Option.String({ required: false })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runInspect({
      cwd: process.cwd(),
      subcommand: this.subcommand,
      primitive: this.primitive,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    switch (this.subcommand) {
      case "source":
      case "files":
        if (result.entries.length === 0) {
          this.context.stdout.write("No source-installed primitives found.\n")
        } else {
          this.context.stdout.write(pc.bold("Installed source files:\n"))
          for (const e of result.entries) {
            const status = e.detached ? pc.yellow(" [detached]") : ""
            this.context.stdout.write(`  ${e.path} (${e.primitive}@${e.version})${status}\n`)
          }
        }
        break

      case "manifest":
        if (result.manifest) {
          this.context.stdout.write(JSON.stringify(result.manifest, null, 2) + "\n")
        } else {
          this.context.stderr.write(pc.red(`No manifest found for ${this.primitive}\n`))
          return 1
        }
        break

      case "explain":
        this.context.stdout.write(pc.bold(`Primitive: ${this.primitive ?? "(all)"}\n`))
        this.context.stdout.write(`Mode: source\n`)
        this.context.stdout.write(`Files: ${result.entries.length}\n`)
        this.context.stdout.write(`Detached: ${result.entries.filter((e) => e.detached).length}\n`)
        break

      case "provenance":
        for (const e of result.entries) {
          this.context.stdout.write(`${e.path}\n`)
          this.context.stdout.write(`  primitive: ${e.primitive}\n`)
          this.context.stdout.write(`  version: ${e.version}\n`)
          this.context.stdout.write(`  digest: ${e.digest.slice(0, 12)}…\n`)
          this.context.stdout.write(`  detached: ${e.detached ?? false}\n`)
        }
        break

      default:
        this.context.stderr.write(`Unknown subcommand: ${this.subcommand}\n`)
        this.context.stderr.write("Available: source, manifest, explain, files, provenance\n")
        return 1
    }
    return 0
  }
}
