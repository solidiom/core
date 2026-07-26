/**
 * solidiom legacy — manage legacy facade packages.
 *
 * Subcommands:
 *   solidiom legacy status  — Show status of all known legacy facades
 *   solidiom legacy add     — Install a legacy facade for gradual migration
 *   solidiom legacy remove  — Remove a legacy facade (must have zero imports)
 *
 * Legacy facades are compatibility shims that wrap Solidiom primitives with
 * the old shadcn-solid API surface, allowing incremental migration.
 */

import { Command, Option } from "clipanion"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { execSync } from "node:child_process"
import pc from "picocolors"

// ─── Facade Registry ────────────────────────────────────────────────────────

export interface LegacyFacade {
  /** npm package name */
  name: string
  /** The Solidiom primitive that replaces this facade */
  replacement: string
  /** Version at which the facade was deprecated */
  deprecated: string
  /** Version at which the facade will be removed */
  removed: string
  /** Whether the facade is currently installed in node_modules */
  installed: boolean
  /** Import count in the consumer project (0 = safe to remove) */
  importCount: number
}

export interface LegacyStatusResult {
  facades: LegacyFacade[]
  totalImports: number
  readyToRemove: string[]
}

/** All known legacy facades. Add new entries here as facades are created. */
const KNOWN_FACADES: Array<{
  name: string
  replacement: string
  deprecated: string
  removed: string
}> = [
  {
    name: "@solidiom/legacy-shadcn-solid-dialog",
    replacement: "@solidiom/dialog",
    deprecated: "0.0.1",
    removed: "1.0.0",
  },
  {
    name: "@solidiom/legacy-shadcn-solid-select",
    replacement: "@solidiom/select",
    deprecated: "0.0.1",
    removed: "1.0.0",
  },
  {
    name: "@solidiom/legacy-shadcn-solid-accordion",
    replacement: "@solidiom/accordion",
    deprecated: "0.0.1",
    removed: "1.0.0",
  },
  {
    name: "@solidiom/legacy-shadcn-solid-tabs",
    replacement: "@solidiom/tabs",
    deprecated: "0.0.1",
    removed: "1.0.0",
  },
]

// ─── Core Logic ─────────────────────────────────────────────────────────────

/**
 * Count imports of a package in the consumer project's source files.
 */
function countImports(packageName: string, cwd: string): number {
  const srcDir = join(cwd, "src")
  if (!existsSync(srcDir)) return 0

  try {
    const result = execSync(
      `grep -r "${packageName}" "${srcDir}" --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l`,
      { encoding: "utf8", cwd, timeout: 10_000 },
    )
    return parseInt(result.trim(), 10) || 0
  } catch {
    return 0
  }
}

/**
 * Check if a package is installed in node_modules.
 */
function isInstalled(packageName: string, cwd: string): boolean {
  const fullPath = join(cwd, "node_modules", ...packageName.split("/"))
  return existsSync(fullPath)
}

/**
 * Get the status of all known legacy facades.
 */
export function runLegacyStatus(cwd: string): LegacyStatusResult {
  const facades: LegacyFacade[] = KNOWN_FACADES.map((spec) => ({
    ...spec,
    installed: isInstalled(spec.name, cwd),
    importCount: countImports(spec.name, cwd),
  }))

  const totalImports = facades.reduce((sum, f) => sum + f.importCount, 0)
  const readyToRemove = facades.filter((f) => f.installed && f.importCount === 0).map((f) => f.name)

  return { facades, totalImports, readyToRemove }
}

/**
 * Add (install) a legacy facade package.
 */
export function runLegacyAdd(facadeName: string, cwd: string): { ok: boolean; message: string } {
  const spec = KNOWN_FACADES.find((f) => f.name === facadeName || f.name.endsWith(facadeName))
  if (!spec) {
    const available = KNOWN_FACADES.map((f) => f.name).join(", ")
    return { ok: false, message: `Unknown facade "${facadeName}". Available: ${available}` }
  }

  if (isInstalled(spec.name, cwd)) {
    return { ok: true, message: `${spec.name} is already installed.` }
  }

  try {
    execSync(`pnpm add ${spec.name}`, { cwd, encoding: "utf8", stdio: "pipe", timeout: 60_000 })
    return {
      ok: true,
      message: `Installed ${spec.name}. Migrate imports to ${spec.replacement} before removal deadline (${spec.removed}).`,
    }
  } catch (err) {
    const e = err as { stderr?: string }
    return {
      ok: false,
      message: `Failed to install ${spec.name}: ${e.stderr?.trim() ?? "unknown error"}`,
    }
  }
}

/**
 * Remove a legacy facade package. Refuses if imports still exist.
 */
export function runLegacyRemove(facadeName: string, cwd: string): { ok: boolean; message: string } {
  const spec = KNOWN_FACADES.find((f) => f.name === facadeName || f.name.endsWith(facadeName))
  if (!spec) {
    const available = KNOWN_FACADES.map((f) => f.name).join(", ")
    return { ok: false, message: `Unknown facade "${facadeName}". Available: ${available}` }
  }

  if (!isInstalled(spec.name, cwd)) {
    return { ok: true, message: `${spec.name} is not installed.` }
  }

  // Check for remaining imports
  const importCount = countImports(spec.name, cwd)
  if (importCount > 0) {
    return {
      ok: false,
      message: `Cannot remove ${spec.name} — ${importCount} file(s) still import it. Migrate to ${spec.replacement} first.`,
    }
  }

  try {
    execSync(`pnpm remove ${spec.name}`, { cwd, encoding: "utf8", stdio: "pipe", timeout: 60_000 })
    return { ok: true, message: `Removed ${spec.name}. Migration to ${spec.replacement} complete.` }
  } catch (err) {
    const e = err as { stderr?: string }
    return {
      ok: false,
      message: `Failed to remove ${spec.name}: ${e.stderr?.trim() ?? "unknown error"}`,
    }
  }
}

// ─── CLI Commands ───────────────────────────────────────────────────────────

/**
 * solidiom legacy — default (no subcommand) shows status.
 */
export class LegacyCommand extends Command {
  static override paths = [["legacy"]]
  static override usage = Command.Usage({
    description: "Show legacy facade status (alias for `solidiom legacy status`)",
    examples: [
      ["Show status", "solidiom legacy"],
      ["JSON output", "solidiom legacy --json"],
    ],
  })

  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    return printStatus(this, process.cwd(), this.json)
  }
}

/**
 * solidiom legacy status — show detailed status of all facades.
 */
export class LegacyStatusCommand extends Command {
  static override paths = [["legacy", "status"]]
  static override usage = Command.Usage({
    description: "Show status of all known legacy facades",
    examples: [["Show status", "solidiom legacy status"]],
  })

  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    return printStatus(this, process.cwd(), this.json)
  }
}

/**
 * solidiom legacy add <facade> — install a facade for gradual migration.
 */
export class LegacyAddCommand extends Command {
  static override paths = [["legacy", "add"]]
  static override usage = Command.Usage({
    description: "Install a legacy facade package",
    examples: [["Add dialog facade", "solidiom legacy add @solidiom/legacy-shadcn-solid-dialog"]],
  })

  facade = Option.String({ required: true })

  async execute(): Promise<number> {
    const result = runLegacyAdd(this.facade, process.cwd())
    if (result.ok) {
      this.context.stdout.write(pc.green(`✓ ${result.message}\n`))
      return 0
    }
    this.context.stderr.write(pc.red(`✗ ${result.message}\n`))
    return 1
  }
}

/**
 * solidiom legacy remove <facade> — remove a facade after migration is complete.
 */
export class LegacyRemoveCommand extends Command {
  static override paths = [["legacy", "remove"]]
  static override usage = Command.Usage({
    description: "Remove a legacy facade (requires zero remaining imports)",
    examples: [["Remove dialog facade", "solidiom legacy remove @solidiom/legacy-shadcn-solid-dialog"]],
  })

  facade = Option.String({ required: true })

  async execute(): Promise<number> {
    const result = runLegacyRemove(this.facade, process.cwd())
    if (result.ok) {
      this.context.stdout.write(pc.green(`✓ ${result.message}\n`))
      return 0
    }
    this.context.stderr.write(pc.red(`✗ ${result.message}\n`))
    return 1
  }
}

// ─── Shared Output ──────────────────────────────────────────────────────────

function printStatus(cmd: Command, cwd: string, json: boolean): number {
  const result = runLegacyStatus(cwd)

  if (json) {
    cmd.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
    return 0
  }

  cmd.context.stdout.write(pc.bold("\nLegacy Facades:\n\n"))

  for (const facade of result.facades) {
    const status = facade.installed
      ? facade.importCount > 0
        ? pc.yellow(`installed, ${facade.importCount} file(s) importing`)
        : pc.green("installed, ready to remove")
      : pc.dim("not installed")

    cmd.context.stdout.write(`  ${pc.bold(facade.name)} [${status}]\n`)
    cmd.context.stdout.write(`    Replacement: ${facade.replacement}\n`)
    cmd.context.stdout.write(
      `    Timeline: deprecated ${facade.deprecated} → removed ${facade.removed}\n`,
    )
    if (facade.installed && facade.importCount === 0) {
      cmd.context.stdout.write(
        pc.green(`    → Safe to remove: solidiom legacy remove ${facade.name}\n`),
      )
    }
    cmd.context.stdout.write("\n")
  }

  if (result.readyToRemove.length > 0) {
    cmd.context.stdout.write(
      pc.green(`${result.readyToRemove.length} facade(s) ready to remove.\n`),
    )
  }

  if (result.totalImports > 0) {
    cmd.context.stdout.write(
      pc.dim(`${result.totalImports} total imports remaining across all facades.\n`),
    )
  }

  return 0
}
