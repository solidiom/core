/**
 * solidiom inspect — inspect installed primitives.
 *
 * Subcommands: source, manifest, explain, files, provenance.
 */

import { Command, Option } from "clipanion"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { readLock, type LockEntry } from "../source-install/lock"
import {
  readRegistryManifest,
  RegistrySchemaError,
  type RegistryManifest,
} from "../registry-schema"
import pc from "picocolors"

export interface InspectResult {
  primitive?: string
  mode: string
  entries: LockEntry[]
  manifest?: RegistryManifest
  /** Set when `manifest` subcommand finds a file that fails schema validation (fail closed). */
  manifestError?: string
}

/**
 * Resolve the registry manifest path for a primitive the same way `plan.ts`'s
 * `loadRegistry` does: custom registry path/env override, then
 * monorepo-relative, then node_modules.
 */
function resolveManifestPath(
  primitive: string,
  cwd: string,
  registryOverride?: string,
): string | null {
  const candidates = [
    registryOverride ? join(registryOverride, `${primitive}.json`) : null,
    process.env["SOLIDIOM_REGISTRY_PATH"]
      ? join(process.env["SOLIDIOM_REGISTRY_PATH"], `${primitive}.json`)
      : null,
    join(cwd, "..", "..", "registry", `${primitive}.json`),
    join(cwd, "node_modules", "@solidiom", "registry", `${primitive}.json`),
  ].filter(Boolean) as string[]

  return candidates.find((path) => existsSync(path)) ?? null
}

/**
 * Core inspect logic.
 */
export function runInspect(options: {
  cwd: string
  subcommand: string
  primitive?: string
  registry?: string
}): InspectResult {
  const { cwd, subcommand, primitive, registry: registryOverride } = options
  const lock = readLock(cwd)

  const entries = Object.values(lock.installed).filter(
    (e) => !primitive || e.primitive === primitive,
  )

  if (subcommand === "manifest" || subcommand === "explain") {
    if (!primitive) {
      return { primitive, mode: subcommand, entries }
    }

    const manifestPath = resolveManifestPath(primitive, cwd, registryOverride)
    if (!manifestPath) {
      return { primitive, mode: subcommand, entries }
    }

    try {
      // Fail closed on a malformed/unsupported-version manifest — the same
      // guarantee `plan`/`add` already get via readRegistryManifest — rather
      // than trusting whatever raw JSON happens to be on disk.
      const manifest = readRegistryManifest(manifestPath)
      return { primitive, mode: subcommand, entries, manifest }
    } catch (err) {
      const reason = err instanceof RegistrySchemaError ? err.message : String(err)
      return { primitive, mode: subcommand, entries, manifestError: reason }
    }
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
      ["Show provenance for one primitive", "solidiom inspect provenance dialog"],
      ["List all installed files", "solidiom inspect files"],
    ],
  })

  subcommand = Option.String({ required: true })
  primitive = Option.String({ required: false })
  registry = Option.String("--registry", {
    description: "Custom registry URL for manifest resolution",
  })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runInspect({
      cwd: process.cwd(),
      subcommand: this.subcommand,
      primitive: this.primitive,
      registry: this.registry,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return result.manifestError ? 1 : 0
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
        if (result.manifestError) {
          this.context.stderr.write(
            pc.red(`Manifest for ${this.primitive} failed schema verification:\n`),
          )
          this.context.stderr.write(pc.red(`  ✗ ${result.manifestError}\n`))
          return 1
        }
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

        if (result.manifestError) {
          this.context.stderr.write(
            pc.red(`\nManifest failed schema verification: ${result.manifestError}\n`),
          )
        } else if (result.manifest) {
          const m = result.manifest
          this.context.stdout.write(`\nDeliverables: ${m.deliverables.join(", ")}\n`)
          this.context.stdout.write(
            `Styling outputs: ${m.styling.outputs.length > 0 ? m.styling.outputs.join(", ") : "none"}\n`,
          )
          this.context.stdout.write(
            `Theme compatible: ${
              m.styling.themeCompatible.length > 0 ? m.styling.themeCompatible.join(", ") : "none"
            }\n`,
          )
          this.context.stdout.write(`Documentation: ${m.documentation.status}\n`)
          for (const [locale, info] of Object.entries(m.documentation.locales)) {
            this.context.stdout.write(`  ${locale}: ${info.status}\n`)
          }
        }
        break

      case "provenance":
        if (result.entries.length === 0) {
          this.context.stdout.write(
            this.primitive
              ? `No installed files found for primitive "${this.primitive}".\n`
              : "No source-installed primitives found.\n",
          )
          break
        }
        for (const e of result.entries) {
          const provenanceLabel =
            e.provenance === "unverified" ? pc.yellow(e.provenance) : pc.green(e.provenance)
          this.context.stdout.write(`${e.path}\n`)
          this.context.stdout.write(`  primitive: ${e.primitive}\n`)
          this.context.stdout.write(`  version: ${e.version}\n`)
          this.context.stdout.write(`  digest: ${e.digest.slice(0, 12)}…\n`)
          this.context.stdout.write(`  manifestFilesHash: ${e.manifestFilesHash || "(none)"}\n`)
          if (e.signatureKeyId) {
            this.context.stdout.write(`  signatureKeyId: ${e.signatureKeyId}\n`)
          }
          this.context.stdout.write(`  verifiedAt: ${e.verifiedAt || "(unknown)"}\n`)
          this.context.stdout.write(`  provenance: ${provenanceLabel}\n`)
          this.context.stdout.write(`  detached: ${e.detached ?? false}\n`)
        }
        {
          const unverifiedCount = result.entries.filter((e) => e.provenance === "unverified").length
          if (unverifiedCount > 0) {
            this.context.stdout.write(
              pc.yellow(
                `\n⚠ ${unverifiedCount} entr${unverifiedCount === 1 ? "y" : "ies"} recorded as unverified\n`,
              ),
            )
          }
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
