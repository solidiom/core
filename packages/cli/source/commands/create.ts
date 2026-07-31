/**
 * solidiom create — scaffolds a new project from a template.
 *
 * This command implements the destination-safety checks, non-interactive flag
 * surface, interactive prompts, and cancellation cleanup (CLI-006), and wires
 * in real template materialization (CLI-007): copying files from a
 * `templates/<name>/` directory, substituting `{{var}}` tokens, rewriting
 * `workspace:*` versions, generating `.solidiom/config.json`, and optionally
 * running the package manager install step.
 */

import { Command, Option } from "clipanion"
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve, sep } from "node:path"
import * as clack from "@clack/prompts"
import { isPackageManagerName, detectPackageManager, type PackageManagerName } from "../package-manager/detect"
import { install as installCommand } from "../package-manager/commands"
import { runPackageManager } from "../package-manager/exec"
import { materialize } from "../create/materialize"
import { generateProjectConfig } from "../create/config-gen"
import pc from "picocolors"

export interface CreateOptions {
  cwd: string
  /** Template identifier. Required — either from --template or the --yes/prompt flow. */
  template?: string
  /** Project name; also used to derive the destination directory. */
  name?: string
  packageManager?: PackageManagerName
  styling?: "css" | "tailwind" | "unocss"
  /** Whether to run the package manager install after scaffolding. Defaults to true. */
  install?: boolean
  /** Skip all prompts; every required value must come from flags or runCreate fails explicitly. */
  yes?: boolean
  /** Allow scaffolding into a non-empty existing directory. */
  force?: boolean
  /** Injectable for tests: pretend stdin is/isn't a TTY without touching process.stdin. */
  isTTY?: boolean
  /**
   * Injectable for tests only: overrides where materialize() looks for the
   * template's source directory, bypassing the published-CLI/monorepo
   * resolution in materialize.ts's `resolveTemplateSource`. Mirrors the
   * existing `isTTY` injection point above. Not exposed as a CLI flag.
   */
  templatesDir?: string
}

export interface CreateResult {
  destination: string
  created: boolean
  cancelled?: boolean
  errors?: string[]
}

export const STYLING_PROFILES = ["css", "tailwind", "unocss"] as const

// ─── Cleanup journal ────────────────────────────────────────────────────────

/**
 * Tracks directories `create` itself creates during a run so that on
 * cancellation (SIGINT or a clack cancel signal) only those directories are
 * removed — never a destination that already existed before this invocation.
 *
 * Kept as a small standalone factory so it can be unit-tested directly
 * without spawning a real process or sending a real SIGINT.
 */
export function createCleanupJournal() {
  const created: string[] = []

  return {
    /** Records a directory this run created, in creation order. */
    record(path: string): void {
      created.push(path)
    },
    /** Returns a snapshot of recorded paths (for inspection/testing). */
    entries(): string[] {
      return [...created]
    },
    /** Removes every recorded path in reverse (most-recently-created-first) order. */
    cleanup(): void {
      for (let i = created.length - 1; i >= 0; i--) {
        const path = created[i]!
        rmSync(path, { recursive: true, force: true })
      }
      created.length = 0
    },
  }
}

export type CleanupJournal = ReturnType<typeof createCleanupJournal>

// ─── Validation ─────────────────────────────────────────────────────────────

/**
 * Validates a package name against npm's naming rules (local re-implementation
 * — no dependency added). Accepts scoped (`@scope/name`) and unscoped names.
 */
export function isValidPackageName(name: string): boolean {
  if (typeof name !== "string" || name.length === 0) return false
  if (name.length > 214) return false
  if (name !== name.toLowerCase()) return false

  let unscoped = name

  if (name.startsWith("@")) {
    const slashIndex = name.indexOf("/")
    if (slashIndex === -1) return false
    const scope = name.slice(1, slashIndex)
    unscoped = name.slice(slashIndex + 1)
    if (scope.length === 0) return false
    if (!/^[a-z0-9-._~]+$/.test(scope)) return false
    if (scope.startsWith(".") || scope.startsWith("_")) return false
  }

  if (unscoped.length === 0) return false
  if (!/^[a-z0-9-._~]+$/.test(unscoped)) return false
  if (unscoped.startsWith(".") || unscoped.startsWith("_")) return false

  return true
}

/** Walks up from `from` to find the monorepo root (a `pnpm-workspace.yaml` or `.git` directory). */
function findMonorepoRoot(from: string, maxDepth = 20): string | null {
  let dir = from
  for (let i = 0; i < maxDepth; i++) {
    if (existsSync(join(dir, "pnpm-workspace.yaml")) || existsSync(join(dir, ".git"))) {
      return dir
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/** Returns true if `child` is inside (or equal to) `parent`, using a sep-safe prefix check. */
function isInside(parent: string, child: string): boolean {
  if (child === parent) return true
  const parentWithSep = parent.endsWith(sep) ? parent : parent + sep
  return child.startsWith(parentWithSep)
}

/**
 * Validates destination safety per CLI-006's plan. Returns a list of
 * violation strings — empty means the destination is safe to use.
 */
function validateDestination(cwd: string, name: string, force: boolean): { destination: string; errors: string[] } {
  const errors: string[] = []
  const destination = resolve(cwd, name)
  const resolvedCwd = resolve(cwd)
  const home = resolve(homedir())
  const root = resolve("/")
  const monorepoRoot = findMonorepoRoot(cwd)

  if (!isInside(resolvedCwd, destination)) {
    errors.push(
      `Destination "${destination}" escapes the current working directory "${resolvedCwd}" — refusing to write outside cwd.`,
    )
  }

  if (destination === home) {
    errors.push(`Destination "${destination}" is the user's home directory — refusing to scaffold there.`)
  }

  if (destination === root) {
    errors.push(`Destination "${destination}" is the filesystem root — refusing to scaffold there.`)
  }

  if (monorepoRoot && destination === resolve(monorepoRoot)) {
    errors.push(`Destination "${destination}" is the monorepo root — refusing to scaffold there.`)
  }

  if (existsSync(destination)) {
    try {
      const entries = readdirSync(destination)
      if (entries.length > 0 && !force) {
        errors.push(
          `Destination "${destination}" already exists and is not empty — pass --force to scaffold into it anyway.`,
        )
      }
    } catch {
      errors.push(`Destination "${destination}" exists but could not be read.`)
    }
  }

  return { destination, errors }
}

// ─── Prompt helpers ─────────────────────────────────────────────────────────

/**
 * Runs the interactive prompt flow for any values missing from `options`,
 * unless `--yes` was passed or stdin is not a TTY. Returns null if the user
 * cancelled a prompt (clack's own cancellation signal).
 */
async function promptForMissing(
  options: CreateOptions,
): Promise<
  | { template: string; name: string; styling?: "css" | "tailwind" | "unocss" }
  | null
  | "cancelled"
> {
  const isTTY = options.isTTY ?? process.stdin.isTTY ?? false

  let template = options.template
  let name = options.name
  let styling = options.styling

  if (options.yes || !isTTY) {
    // Non-interactive: never prompt. If required fields are still missing
    // here, the caller must fail explicitly rather than crash downstream —
    // --yes already validated this above, but the no-TTY-without---yes path
    // has not, so re-check it here.
    if (!template || !name) return null
    return { template, name, styling }
  }

  clack.intro(pc.bold("solidiom create"))

  if (!template) {
    const result = await clack.text({
      message: "Which template would you like to use?",
    })
    if (clack.isCancel(result)) return "cancelled"
    template = result
  }

  if (!name) {
    const result = await clack.text({
      message: "What is the name of your project?",
    })
    if (clack.isCancel(result)) return "cancelled"
    name = result
  }

  if (!styling) {
    const result = await clack.select({
      message: "Which styling profile would you like?",
      options: STYLING_PROFILES.map((value) => ({ value, label: value })),
    })
    if (clack.isCancel(result)) return "cancelled"
    styling = result as "css" | "tailwind" | "unocss"
  }

  clack.outro(pc.green("Configuration collected."))

  return { template, name, styling }
}

// ─── Core logic ─────────────────────────────────────────────────────────────

/**
 * Core create logic — usable from CLI and programmatic API.
 *
 * Validates the flag surface and destination safety, then materializes the
 * requested template into the destination (CLI-007) and generates
 * `.solidiom/config.json`. Returns `{ created: false, errors }` for any
 * validation failure rather than throwing, matching the pattern used by
 * `runAdd`/`runPlan` elsewhere in this package.
 */
export async function runCreate(options: CreateOptions): Promise<CreateResult> {
  const { cwd, yes = false, force = false, install = true } = options
  const journal = createCleanupJournal()

  // --yes requires every value that would otherwise come from a prompt to
  // already be present on the flags — never silently default.
  if (yes) {
    const missing: string[] = []
    if (!options.template) missing.push("--template")
    if (!options.name) missing.push("--name")
    if (missing.length > 0) {
      return {
        destination: resolve(cwd, options.name ?? ""),
        created: false,
        errors: [`--yes was passed but required flag(s) missing: ${missing.join(", ")}`],
      }
    }
  }

  if (options.packageManager && !isPackageManagerName(options.packageManager)) {
    return {
      destination: resolve(cwd, options.name ?? ""),
      created: false,
      errors: [
        `Unknown package manager "${options.packageManager}" — expected one of: npm, pnpm, yarn, bun`,
      ],
    }
  }

  if (options.styling && !STYLING_PROFILES.includes(options.styling)) {
    return {
      destination: resolve(cwd, options.name ?? ""),
      created: false,
      errors: [`Unknown styling profile "${options.styling}" — expected one of: ${STYLING_PROFILES.join(", ")}`],
    }
  }

  const prompted = await promptForMissing(options)
  if (prompted === "cancelled") {
    journal.cleanup()
    return { destination: resolve(cwd, options.name ?? ""), created: false, cancelled: true }
  }
  // Non-interactive callers without --yes and without a TTY still need
  // template/name; if they weren't supplied and weren't collected via
  // prompt (no TTY), surface that as a validation error instead of a crash.
  if (!prompted) {
    return {
      destination: options.name ? resolve(cwd, options.name) : cwd,
      created: false,
      errors: ["Missing required value(s): --template and/or --name (no TTY available to prompt)."],
    }
  }

  const { template, name } = prompted

  const nameErrors: string[] = []
  if (!isValidPackageName(name)) {
    nameErrors.push(
      `"${name}" is not a valid npm package name — must be lowercase, may be scoped (@scope/name), ` +
        `use only [a-z0-9-._~], not start with "." or "_", and be at most 214 characters.`,
    )
  }

  const { destination, errors: destinationErrors } = validateDestination(cwd, name, force)

  // Destination-safety violations (path traversal, home/root/monorepo-root,
  // non-empty existing dir) are surfaced even when the name also fails
  // package-name validation — both are independent, equally-real problems
  // and neither should mask the other.
  const errors = [...destinationErrors, ...nameErrors]
  if (errors.length > 0) {
    return { destination, created: false, errors }
  }

  // SIGINT handling: route to the same cleanup path as clack's own
  // cancellation. Only registered for the duration of the scaffold write.
  let sigintReceived = false
  const onSigint = () => {
    sigintReceived = true
    journal.cleanup()
  }
  process.once("SIGINT", onSigint)

  try {
    const destinationExisted = existsSync(destination)
    if (!destinationExisted) {
      mkdirSync(destination, { recursive: true })
      journal.record(destination)
    }

    if (sigintReceived) {
      return { destination, created: false, cancelled: true }
    }

    // ── Real template materialization (CLI-007). ──
    const materializeResult = materialize({
      templateName: template,
      destination,
      projectName: name,
      ...(options.templatesDir ? { templateSourceDir: join(options.templatesDir, template) } : {}),
    })

    if (materializeResult.errors && materializeResult.errors.length > 0) {
      journal.cleanup()
      return { destination, created: false, errors: materializeResult.errors }
    }

    if (sigintReceived) {
      journal.cleanup()
      return { destination, created: false, cancelled: true }
    }

    generateProjectConfig({
      destination,
      projectName: name,
      ...(prompted.styling ? { styling: prompted.styling } : {}),
      ...(options.packageManager ? { packageManager: options.packageManager } : {}),
    })
    // ── end real template materialization ──

    if (sigintReceived) {
      journal.cleanup()
      return { destination, created: false, cancelled: true }
    }

    if (install) {
      const detected = detectPackageManager({
        cwd: destination,
        ...(options.packageManager ? { override: options.packageManager } : {}),
      })
      const installResult = await runPackageManager({
        command: installCommand(detected),
        cwd: destination,
      })

      if (installResult.code !== 0) {
        journal.cleanup()
        return {
          destination,
          created: false,
          errors: [
            `Dependency install failed (exit code ${installResult.code}) — rolled back scaffolded files.`,
            ...(installResult.stderr ? [installResult.stderr.trim()] : []),
          ],
        }
      }
    }

    return { destination, created: true }
  } finally {
    process.removeListener("SIGINT", onSigint)
  }
}

// ─── Clipanion command wrapper ──────────────────────────────────────────────

export class CreateCommand extends Command {
  static override paths = [["create"]]
  static override usage = Command.Usage({
    description: "Scaffold a new project from a template",
    examples: [
      ["Create a project non-interactively", "solidiom create my-app --template vite-solid-router --yes"],
      ["Create with a specific styling profile", "solidiom create my-app --template vite-solid-router --styling tailwind --yes"],
      ["Create without running the install step", "solidiom create my-app --template vite-solid-router --yes --no-install"],
      ["Force scaffolding into a non-empty directory", "solidiom create my-app --template vite-solid-router --yes --force"],
    ],
  })

  name = Option.String({ required: true })
  template = Option.String("--template", { description: "Template to scaffold from" })
  packageManager = Option.String("--package-manager", {
    description: "Package manager to use (npm, pnpm, yarn, bun) — auto-detected if omitted",
  })
  styling = Option.String("--styling", {
    description: "Styling profile to use (css, tailwind, unocss)",
  })
  noInstall = Option.Boolean("--no-install", false, {
    description: "Skip running the package manager install step",
  })
  yes = Option.Boolean("--yes", false, {
    description: "Skip all prompts; fail explicitly if a required value is missing",
  })
  force = Option.Boolean("--force", false, {
    description: "Allow scaffolding into a non-empty destination directory",
  })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = await runCreate({
      cwd: process.cwd(),
      template: this.template,
      name: this.name,
      packageManager: this.packageManager as PackageManagerName | undefined,
      styling: this.styling as "css" | "tailwind" | "unocss" | undefined,
      install: !this.noInstall,
      yes: this.yes,
      force: this.force,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return result.created ? 0 : 1
    }

    if (result.cancelled) {
      this.context.stdout.write(pc.yellow("Create cancelled — no files left behind.\n"))
      return 1
    }

    if (result.errors && result.errors.length > 0) {
      this.context.stderr.write(pc.red("Cannot create project:\n"))
      for (const e of result.errors) {
        this.context.stderr.write(pc.red(`  ✗ ${e}\n`))
      }
      return 1
    }

    this.context.stdout.write(pc.green(`Created ${result.destination}\n`))
    return 0
  }
}
