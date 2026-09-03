/**
 * solidiom audit — CycloneDX 1.5 SBOM and license inventory.
 *
 * Scans:
 *   1. Direct @solidiom/* workspace packages (monorepo packages/ dir).
 *   2. All npm dependencies in the workspace node_modules (transitive deps of adapters included).
 *
 * CycloneDX 1.5 fields emitted:
 *   bomFormat, specVersion, serialNumber, version, metadata (timestamp + tool),
 *   components[{ bom-ref, type, name, version, purl, licenses }]
 *
 * CLI flags:
 *   --sbom    Emit full CycloneDX 1.5 JSON (the canonical SBOM flag per §13 spec).
 *   --json    Alias for --sbom (backward compat).
 *   --licenses  Emit a plain license inventory table only.
 */

import { Command, Option } from "clipanion"
import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { randomUUID } from "node:crypto"
import pc from "picocolors"

// ─── CycloneDX 1.5 types ─────────────────────────────────────────────────────

interface CdxLicense {
  license: { id?: string; name?: string }
}

interface CdxComponent {
  "bom-ref": string
  type: "library"
  name: string
  version: string
  /** Package URL per https://github.com/package-url/purl-spec */
  purl: string
  licenses: CdxLicense[]
  /** "direct" | "transitive" — informational, not part of CycloneDX spec */
  scope?: "required" | "optional" | "excluded"
}

export interface AuditResult {
  bomFormat: "CycloneDX"
  specVersion: "1.5"
  serialNumber: string
  version: number
  metadata: {
    timestamp: string
    tools: [{ vendor: string; name: string; version: string }]
  }
  components: CdxComponent[]
}

/** Simplified view for the --licenses table. */
export interface AuditComponent {
  name: string
  version: string
  license: string
  type: "library"
}

// ─── Package scanning ─────────────────────────────────────────────────────────

interface RawPkg {
  name?: string
  version?: string
  license?: string
  licenses?: Array<{ type?: string } | string>
}

function readPkg(pkgPath: string): RawPkg | null {
  try {
    return JSON.parse(readFileSync(pkgPath, "utf8")) as RawPkg
  } catch {
    return null
  }
}

/** Resolves SPDX license expression from the various forms package.json uses. */
function resolveLicenseId(pkg: RawPkg): string {
  if (pkg.license && typeof pkg.license === "string") return pkg.license
  if (Array.isArray(pkg.licenses)) {
    const ids = pkg.licenses.map((l) => (typeof l === "string" ? l : (l.type ?? "UNLICENSED")))
    return ids.join(" OR ")
  }
  return "UNLICENSED"
}

function buildPurl(name: string, version: string): string {
  // npm purl format: pkg:npm/%40scope%2Fname@version or pkg:npm/name@version
  const encoded = encodeURIComponent(name)
  return `pkg:npm/${encoded}@${version}`
}

function toCdxComponent(name: string, version: string, licenseId: string): CdxComponent {
  return {
    "bom-ref": `${name}@${version}`,
    type: "library",
    name,
    version,
    purl: buildPurl(name, version),
    licenses: [{ license: isSpdxId(licenseId) ? { id: licenseId } : { name: licenseId } }],
  }
}

/** Rough SPDX id heuristic — SPDX IDs don't contain spaces. */
function isSpdxId(expr: string): boolean {
  return expr.length > 0 && !expr.includes(" ")
}

/**
 * Scans a node_modules directory recursively, yielding one component per package.
 * Handles scoped packages (@scope/name inside node_modules/@scope/name/package.json).
 * Deduplicates by bom-ref (name@version).
 */
function scanNodeModules(
  nodeModulesPath: string,
  seen: Set<string>,
  components: CdxComponent[],
): void {
  if (!existsSync(nodeModulesPath)) return

  let entries: string[]
  try {
    entries = readdirSync(nodeModulesPath)
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.startsWith(".")) continue

    if (entry.startsWith("@")) {
      // Scoped package directory — recurse one level
      const scopeDir = join(nodeModulesPath, entry)
      let scopedEntries: string[]
      try {
        scopedEntries = readdirSync(scopeDir)
      } catch {
        continue
      }
      for (const scoped of scopedEntries) {
        const pkgPath = join(scopeDir, scoped, "package.json")
        const pkg = readPkg(pkgPath)
        if (!pkg?.name || !pkg.version) continue
        const ref = `${pkg.name}@${pkg.version}`
        if (seen.has(ref)) continue
        seen.add(ref)
        components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)))
      }
    } else {
      const pkgPath = join(nodeModulesPath, entry, "package.json")
      const pkg = readPkg(pkgPath)
      if (!pkg?.name || !pkg.version) continue
      const ref = `${pkg.name}@${pkg.version}`
      if (seen.has(ref)) continue
      seen.add(ref)
      components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)))
    }
  }
}

/**
 * Core audit logic.
 * Scans monorepo @solidiom/* packages first (direct), then full node_modules (transitive).
 */
export function runAudit(cwd: string): AuditResult {
  const seen = new Set<string>()
  const components: CdxComponent[] = []

  // 1. Monorepo workspace packages — highest signal, scan first.
  const monoPackagesDir = join(cwd, "..", "..", "packages")
  if (existsSync(monoPackagesDir)) {
    let entries: string[]
    try {
      entries = readdirSync(monoPackagesDir)
    } catch {
      entries = []
    }

    for (const entry of entries) {
      const pkgPath = join(monoPackagesDir, entry, "package.json")
      const pkg = readPkg(pkgPath)
      if (!pkg?.name?.startsWith("@solidiom/") || !pkg.version) continue
      const ref = `${pkg.name}@${pkg.version}`
      if (seen.has(ref)) continue
      seen.add(ref)
      components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)))
    }
  }

  // 2. Workspace root node_modules — captures transitive deps of all packages.
  //    Walk up from cwd to find the workspace root (contains pnpm-workspace.yaml or .npmrc).
  const workspaceRoot = findWorkspaceRoot(cwd)
  if (workspaceRoot) {
    scanNodeModules(join(workspaceRoot, "node_modules"), seen, components)
  }

  // 3. Local node_modules at cwd (catches project-local installs).
  scanNodeModules(join(cwd, "node_modules"), seen, components)

  return {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${randomUUID()}`,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ vendor: "openCenter", name: "@solidiom/cli", version: "0.0.1-next.0" }],
    },
    components,
  }
}

/** Walks up the directory tree to find the pnpm workspace root. */
function findWorkspaceRoot(from: string): string | null {
  let dir = from
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "pnpm-workspace.yaml")) || existsSync(join(dir, "pnpm-lock.yaml"))) {
      return dir
    }
    const parent = join(dir, "..")
    if (parent === dir) break
    dir = parent
  }
  return null
}

// ─── CLI command ──────────────────────────────────────────────────────────────

export class AuditCommand extends Command {
  static override paths = [["audit"]]
  static override usage = Command.Usage({
    description: "Generate CycloneDX 1.5 SBOM and license inventory",
    examples: [
      ["Full CycloneDX 1.5 SBOM", "solidiom audit --sbom"],
      ["License inventory table", "solidiom audit --licenses"],
      ["SBOM as JSON (for piping)", "solidiom audit --sbom --json"],
    ],
  })

  sbom = Option.Boolean("--sbom", false, { description: "Emit full CycloneDX 1.5 JSON SBOM" })
  json = Option.Boolean("--json", false, { description: "Alias for --sbom" })
  licenses = Option.Boolean("--licenses", false, {
    description: "Emit license inventory table only",
  })

  async execute(): Promise<number> {
    const result = runAudit(process.cwd())

    if (this.sbom || this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    if (this.licenses) {
      return this.printLicenses(result)
    }

    // Default: summary
    this.context.stdout.write(
      pc.bold(`SBOM Summary — CycloneDX ${result.specVersion}\n`) +
        `  Components: ${result.components.length}\n` +
        `  Generated:  ${result.metadata.timestamp}\n` +
        `  Serial:     ${result.serialNumber}\n\n` +
        `Run ${pc.cyan("solidiom audit --sbom")} for full JSON or ${pc.cyan("solidiom audit --licenses")} for license table.\n`,
    )
    return 0
  }

  private printLicenses(result: AuditResult): number {
    const grouped = new Map<string, string[]>()
    for (const c of result.components) {
      const licenseId = c.licenses[0]?.license.id ?? c.licenses[0]?.license.name ?? "UNLICENSED"
      const list = grouped.get(licenseId) ?? []
      list.push(`${c.name}@${c.version}`)
      grouped.set(licenseId, list)
    }

    this.context.stdout.write(
      pc.bold(`License Inventory (${result.components.length} components)\n\n`),
    )
    for (const [license, packages] of [...grouped.entries()].sort()) {
      this.context.stdout.write(pc.bold(`${license}:\n`))
      for (const pkg of packages.sort()) {
        this.context.stdout.write(`  ${pkg}\n`)
      }
    }
    return 0
  }
}
