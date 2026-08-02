/**
 * solidiom add — adds a primitive in package or source mode.
 *
 * Package mode: resolves plan and outputs the npm install command.
 * Source mode: materializes source files, deduplicates runtime, rewrites imports.
 */

import { Command, Option } from "clipanion"
import { runPlan, type Plan, type PlanOptions } from "./plan"
import { installSource, type SourceInstallResult } from "../source-install/install"
import type { Deliverable, StylingProfile } from "../registry-schema"
import { detectPackageManager, type PackageManagerName } from "../package-manager/detect"
import { add as pmAdd, formatCommand } from "../package-manager/commands"
import { runPackageManager, type RunPackageManagerResult } from "../package-manager/exec"
import pc from "picocolors"

export interface AddOptions extends PlanOptions {
  dryRun?: boolean
  registry?: string
  noNetwork?: boolean
  /** Explicit package-manager override; otherwise detected from the project (CLI-005). */
  packageManager?: PackageManagerName
  /** When true, actually run the install command instead of only printing it (CLI-005). */
  install?: boolean
  /** When true, a source install proceeds even if byte-level verification fails (CLI-003). */
  allowUnverified?: boolean
  /** When true, a source install overwrites files modified by the user since their last install (CLI-004). */
  force?: boolean
  /** When true, a source install prints a unified diff of pending changes and exits without writing (CLI-004). */
  diff?: boolean
}

export interface AddResult {
  plan: Plan
  installCommand: string | null
  blocked: boolean
  sourceResult?: SourceInstallResult
  /** Present when --install actually ran the package-manager command. */
  installRun?: RunPackageManagerResult
}

/**
 * Core add logic.
 */
export async function runAdd(options: AddOptions): Promise<AddResult> {
  const plan = runPlan({
    primitive: options.primitive,
    cwd: options.cwd,
    mode: options.mode,
    registry: options.registry,
    noNetwork: options.noNetwork,
    deliverable: options.deliverable,
    styling: options.styling,
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
      allowUnverified: options.allowUnverified,
      force: options.force,
      diff: options.diff,
    })
    return { plan, installCommand: null, blocked: false, sourceResult }
  }

  const packages = plan.entries.map((e) => `${e.package}@${e.version}`)
  const pm = detectPackageManager({ cwd: options.cwd, override: options.packageManager })
  const command = pmAdd(pm, packages)
  const installCommand = formatCommand(command)

  if (options.install && !options.dryRun) {
    const installRun = await runPackageManager({ command, cwd: options.cwd })
    return { plan, installCommand, blocked: false, installRun }
  }

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
      ["Add a component deliverable", "solidiom add button --deliverable component"],
      ["Add with a specific styling profile", "solidiom add button --styling tailwind"],
      [
        "Actually run the install with a specific package manager",
        "solidiom add dialog --install --package-manager yarn",
      ],
      [
        "Proceed with an unverified source install",
        "solidiom add dialog --mode source --allow-unverified",
      ],
      [
        "Force-overwrite locally modified files",
        "solidiom add button --deliverable component --force",
      ],
      [
        "Preview pending source-install changes",
        "solidiom add button --deliverable component --diff",
      ],
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
  deliverable = Option.String("--deliverable", {
    description: "Product-layer deliverable to add (primitive, component, block, template, theme)",
  })
  styling = Option.String("--styling", {
    description: "Styling profile to add (css, tailwind, unocss)",
  })
  packageManager = Option.String("--package-manager", {
    description: "Package manager to use (npm, pnpm, yarn, bun) — auto-detected if omitted",
  })
  install = Option.Boolean("--install", false, {
    description: "Actually run the install command instead of only printing it",
  })
  allowUnverified = Option.Boolean("--allow-unverified", false, {
    description:
      "Proceed with a source install even if byte-level verification against the registry manifest fails",
  })
  force = Option.Boolean("--force", false, {
    description: "Overwrite files that were locally modified since their last source install",
  })
  diff = Option.Boolean("--diff", false, {
    description: "Print a unified diff of pending source-install changes and exit without writing",
  })
  dryRun = Option.Boolean("--dry-run", false, {
    description: "Show what would be done without writing",
  })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = await runAdd({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode as "package" | "source" | undefined,
      registry: this.registry,
      noNetwork: this.noNetwork,
      deliverable: this.deliverable as Deliverable | undefined,
      styling: this.styling as StylingProfile | undefined,
      packageManager: this.packageManager as PackageManagerName | undefined,
      install: this.install,
      dryRun: this.dryRun,
      allowUnverified: this.allowUnverified,
      force: this.force,
      diff: this.diff,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return result.installRun && result.installRun.code !== 0 ? result.installRun.code : 0
    }

    if (result.blocked) {
      this.context.stderr.write(pc.red("Blocked by policy violations:\n"))
      for (const v of result.plan.violations) {
        this.context.stderr.write(pc.red(`  ✗ ${v}\n`))
      }
      return 1
    }

    if (result.installRun) {
      if (result.installRun.stdout) this.context.stdout.write(result.installRun.stdout)
      if (result.installRun.stderr) this.context.stderr.write(result.installRun.stderr)
      if (result.installRun.code !== 0) {
        this.context.stderr.write(
          pc.red(`\n✗ ${result.installCommand} exited with code ${result.installRun.code}\n`),
        )
        return result.installRun.code
      }
      this.context.stdout.write(pc.green(`\n✓ ${result.installCommand}\n`))
    } else if (result.installCommand) {
      this.context.stdout.write(pc.green(result.installCommand) + "\n")
    } else if (result.sourceResult) {
      const sr = result.sourceResult

      if (sr.conflicts) {
        const diffEntries = sr.conflicts.entries.filter(
          (e) => e.classification === "modified-by-user" || e.classification === "overwrite",
        )

        if (this.diff) {
          this.context.stdout.write(pc.bold("Pending source-install changes:\n\n"))
          for (const entry of diffEntries) {
            this.context.stdout.write(pc.dim(`  ${entry.path} (${entry.classification})\n`))
            if (entry.diff) this.context.stdout.write(entry.diff + "\n")
          }
          return 0
        }

        if (sr.conflicts.hasBlockingConflicts) {
          this.context.stderr.write(
            pc.red("Blocked — locally modified files would be overwritten:\n"),
          )
          for (const entry of sr.conflicts.entries) {
            if (entry.classification !== "modified-by-user") continue
            this.context.stderr.write(pc.red(`  ✗ ${entry.path}\n`))
            if (entry.diff) this.context.stderr.write(pc.dim(entry.diff))
          }
          this.context.stderr.write(
            pc.yellow(
              `\nUse --force to overwrite locally modified files, or run \`solidiom diff ${this.primitive}\` to review changes first.\n`,
            ),
          )
          return 1
        }
      }

      if (this.allowUnverified && !sr.verified && sr.filesWritten.length > 0) {
        this.context.stdout.write(
          pc.red("⚠ Installed without verification — provenance recorded as 'unverified'\n"),
        )
      }
      this.context.stdout.write(pc.green(`Installed ${sr.filesWritten.length} source files\n`))
      for (const f of sr.filesWritten) {
        this.context.stdout.write(`  ${f}\n`)
      }
    }
    return 0
  }
}
