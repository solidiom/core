/*
 * tools/generate-beta-artifacts — Produce deterministic beta release artifacts.
 *
 * Generates:
 *   - artifacts/beta-catalog.json  — immutable snapshot of all publishable packages
 *   - artifacts/beta-pointer.json  — mutable channel pointer referencing the catalog
 *
 * The pointer includes SHA-256 hashes of both the catalog and registry/index.json
 * so consumers can verify integrity without additional out-of-band data. Build
 * artifacts intentionally contain no wall-clock provenance: identical inputs and
 * release IDs must produce byte-identical files and hashes.
 *
 * Usage:
 *   pnpm tsx tools/generate-beta-artifacts.ts
 *   pnpm tsx tools/generate-beta-artifacts.ts --verify
 *   pnpm tsx tools/generate-beta-artifacts.ts --output-dir <directory>
 */

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const DEFAULT_ARTIFACTS_DIR = join(ROOT, "artifacts")
const REGISTRY_INDEX = join(ROOT, "registry/index.json")

interface PackageEntry {
  name: string
  version: string
  directory: string
  private: boolean
}

export interface BetaCatalog {
  channel: "beta"
  solidVersion: string
  packages: Array<{
    name: string
    version: string
    directory: string
  }>
  registryPrimitiveCount: number
  registryComponentCount: number
  registryBlockCount: number
  registryTemplateCount: number
  registryThemeCount: number
}

export interface BetaPointer {
  channel: "beta"
  release: string
  catalogSha256: string
  registryIndexSha256: string
  solidVersion: string
  packageCount: number
}

export interface GenerateBetaArtifactsOptions {
  outputDirectory?: string
  registryIndexPath?: string
  releaseId?: string
  verify?: boolean
}

export interface GeneratedBetaArtifacts {
  catalogPath: string
  pointerPath: string
  catalogSha256: string
  registryIndexSha256: string
  catalog: BetaCatalog
  pointer: BetaPointer
}

function sha256File(filePath: string): string {
  const content = readFileSync(filePath)
  return createHash("sha256").update(content).digest("hex")
}

function sha256Content(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

function discoverPublishablePackages(): PackageEntry[] {
  const packagesDir = join(ROOT, "packages")
  const entries: PackageEntry[] = []

  for (const dir of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    const pkgJsonPath = join(packagesDir, dir.name, "package.json")
    if (!existsSync(pkgJsonPath)) continue

    const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as {
      name: string
      version: string
      private?: boolean
    }
    entries.push({
      name: pkg.name,
      version: pkg.version,
      directory: `packages/${dir.name}`,
      private: pkg.private === true,
    })
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name))
}

function getRootSolidVersion(): string {
  const rootPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
    devDependencies: Record<string, string>
  }
  return rootPkg.devDependencies["solid-js"] ?? "unknown"
}

export function generateBetaArtifacts(
  options: GenerateBetaArtifactsOptions = {},
): GeneratedBetaArtifacts {
  const outputDirectory = options.outputDirectory ?? DEFAULT_ARTIFACTS_DIR
  const registryIndexPath = options.registryIndexPath ?? REGISTRY_INDEX
  const release = options.releaseId?.trim() || "local-unversioned"
  const allPackages = discoverPublishablePackages()
  const publishable = allPackages.filter((pkg) => !pkg.private)

  console.log(`Discovered ${allPackages.length} packages (${publishable.length} publishable)`)

  const registryIndex = JSON.parse(readFileSync(registryIndexPath, "utf8")) as Record<
    string,
    unknown
  >
  const solidVersion = getRootSolidVersion()
  const catalog: BetaCatalog = {
    channel: "beta",
    solidVersion,
    packages: publishable.map(({ name, version, directory }) => ({ name, version, directory })),
    registryPrimitiveCount: Array.isArray(registryIndex["primitives"])
      ? registryIndex["primitives"].length
      : 0,
    registryComponentCount: Array.isArray(registryIndex["components"])
      ? registryIndex["components"].length
      : 0,
    registryBlockCount: Array.isArray(registryIndex["blocks"]) ? registryIndex["blocks"].length : 0,
    registryTemplateCount: Array.isArray(registryIndex["templates"])
      ? registryIndex["templates"].length
      : 0,
    registryThemeCount: Array.isArray(registryIndex["themes"]) ? registryIndex["themes"].length : 0,
  }

  mkdirSync(outputDirectory, { recursive: true })

  const catalogContent = `${JSON.stringify(catalog, null, 2)}\n`
  const catalogPath = join(outputDirectory, "beta-catalog.json")
  writeFileSync(catalogPath, catalogContent, "utf8")
  console.log(`  Wrote ${catalogPath}`)

  const catalogSha256 = sha256Content(catalogContent)
  const registryIndexSha256 = sha256File(registryIndexPath)
  const pointer: BetaPointer = {
    channel: "beta",
    release,
    catalogSha256,
    registryIndexSha256,
    solidVersion,
    packageCount: publishable.length,
  }

  const pointerPath = join(outputDirectory, "beta-pointer.json")
  writeFileSync(pointerPath, `${JSON.stringify(pointer, null, 2)}\n`, "utf8")
  console.log(`  Wrote ${pointerPath}`)

  console.log(`\n  Channel:    ${pointer.channel}`)
  console.log(`  Release:    ${pointer.release}`)
  console.log(`  Packages:   ${pointer.packageCount}`)
  console.log(`  Solid:      ${pointer.solidVersion}`)
  console.log(`  Catalog:    ${catalogSha256.slice(0, 16)}...`)
  console.log(`  Registry:   ${registryIndexSha256.slice(0, 16)}...`)

  if (options.verify) {
    console.log("\n--- Verification ---")
    const catalogMatch = sha256File(catalogPath) === pointer.catalogSha256
    const registryMatch = sha256File(registryIndexPath) === pointer.registryIndexSha256
    console.log(`  ${catalogMatch ? "✓" : "✗"} catalog SHA-256 matches pointer`)
    console.log(`  ${registryMatch ? "✓" : "✗"} registry index SHA-256 matches pointer`)
    if (!catalogMatch || !registryMatch) {
      throw new Error("Beta artifact verification failed.")
    }
    console.log("\n✓ All beta artifact checks passed.")
  }

  return {
    catalogPath,
    pointerPath,
    catalogSha256,
    registryIndexSha256,
    catalog,
    pointer,
  }
}

function argumentValue(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name)
  if (index === -1) return undefined
  const value = args[index + 1]
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`)
  return value
}

function main(): void {
  const args = process.argv.slice(2)
  const output = argumentValue(args, "--output-dir")
  generateBetaArtifacts({
    outputDirectory: output ? resolve(process.cwd(), output) : DEFAULT_ARTIFACTS_DIR,
    releaseId: process.env.SOLIDIOM_RELEASE_ID,
    verify: args.includes("--verify"),
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main()
  } catch (error) {
    console.error(`✗ ${String(error)}`)
    process.exit(1)
  }
}
