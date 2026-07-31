/**
 * solidiom add — adds a primitive in package or source mode.
 *
 * Package mode: resolves plan and outputs the npm install command.
 * Source mode: materializes source files, deduplicates runtime, rewrites imports.
 */

import { Command, Option } from "clipanion"
import { runPlan, type Plan, type PlanOptions } from "./plan"
import { installSource, type SourceInstallResult } from "../source-install/install"
import pc from "picocolors"

export interface AddOptions extends PlanOptions {
  dryRun?: boolean
  registry?: string
  noNetwork?: boolean
}

export interface AddResult {
  plan: Plan
  installCommand: string | null
  blocked: boolean
  sourceResult?: SourceInstallResult
}

/**
 * Core add logic.
 */
export function runAdd(options: AddOptions): AddResult {
  const plan = runPlan({
    primitive: options.primitive,
    cwd: options.cwd,
    mode: options.mode,
    registry: options.registry,
    noNetwork: options.noNetwork,
  })

  if (plan.violations.length > 0) {
    return { plan, installCommand: null, blocked: true }
  }

  if (plan.mode === "source") {
    const sourceResult = installSource({
      primitive: options.primitive,
      cwd: options.cwd,
      plan,
      dryRun: options.dryRun,
    })
    return { plan, installCommand: null, blocked: false, sourceResult }
  }

  const packages = plan.entries.map((e) => `${e.package}@${e.version}`)
  const installCommand = `pnpm add ${packages.join(" ")}`

  return { plan, installCommand, blocked: false }
}

/**
 * Clipanion command wrapper.
 */
export class AddCommand extends Command {
  static override paths = [["add"]]
  static override usage = Command.Usage({
    description: "Add a primitive (package or source mode)",
    examples: [
      ["Add dialog as package", "solidiom add dialog"],
      ["Add dialog as source", "solidiom add dialog --mode source"],
      ["Dry run", "solidiom add select --dry-run"],
    ],
  })

  primitive = Option.String({ required: true })
  mode = Option.String("--mode", { description: "Install mode (package or source)" })
  registry = Option.String("--registry", {
    description: "Custom registry URL for package resolution",
  })
  noNetwork = Option.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)",
  })
  dryRun = Option.Boolean("--dry-run", false, {
    description: "Show what would be done without writing",
  })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runAdd({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode as "package" | "source" | undefined,
      registry: this.registry,
      noNetwork: this.noNetwork,
      dryRun: this.dryRun,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    if (result.blocked) {
      this.context.stderr.write(pc.red("Blocked by policy violations:\n"))
      for (const v of result.plan.violations) {
        this.context.stderr.write(pc.red(`  ✗ ${v}\n`))
      }
      return 1
    }

    if (result.installCommand) {
      this.context.stdout.write(pc.green(result.installCommand) + "\n")
    } else if (result.sourceResult) {
      const sr = result.sourceResult
      this.context.stdout.write(pc.green(`Installed ${sr.filesWritten.length} source files\n`))
      for (const f of sr.filesWritten) {
        this.context.stdout.write(`  ${f}\n`)
      }
    }
    return 0
  }
}
