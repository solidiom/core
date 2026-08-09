/**
 * tools/generate-beta-artifacts — Produce the beta release artifacts.
 *
 * Generates:
 *   - artifacts/beta-catalog.json  — immutable snapshot of all publishable packages
 *   - artifacts/beta-pointer.json  — mutable channel pointer referencing the catalog
 *
 * The pointer includes SHA-256 hashes of both the catalog and registry/index.json
 * so consumers can verify integrity without additional out-of-band data.
 *
 * Usage:
 *   pnpm tsx tools/generate-beta-artifacts.ts
 *   pnpm tsx tools/generate-beta-artifacts.ts --verify  (generate + verify)
 */

import { createHash } from "node:crypto"
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const ARTIFACTS_DIR = join(ROOT, "artifacts")
const REGISTRY_INDEX = join(ROOT, "registry/index.json")

interface PackageEntry {
  name: string
  version: string
  directory: string
  private: boolean
}

interface BetaCatalog {
  channel: "beta"
  generatedAt: string
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

interface BetaPointer {
  channel: "beta"
  release: string
  generatedAt: string
  catalogSha256: string
  registryIndexSha256: string
  solidVersion: string
  packageCount: number
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

    const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
    entries.push({
      name: pkg.name,
      version: pkg.version,
      directory: `packages/${dir.name}`,
      private: pkg.private === true,
    })
  }

  return entries
}

function getRootSolidVersion(): string {
  const rootPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
  return rootPkg.devDependencies["solid-js"] ?? "unknown"
}

function main(): void {
  const verifyMode = process.argv.includes("--verify")

  // Discover packages
  const allPackages = discoverPublishablePackages()
  const publishable = allPackages.filter((p) => !p.private)

  console.log(`Discovered ${allPackages.length} packages (${publishable.length} publishable)`)

  // Read registry counts
  const registryIndex = JSON.parse(readFileSync(REGISTRY_INDEX, "utf8"))
  const solidVersion = getRootSolidVersion()

  // Generate beta catalog
  const catalog: BetaCatalog = {
    channel: "beta",
    generatedAt: new Date().toISOString(),
    solidVersion,
    packages: publishable.map((p) => ({
      name: p.name,
      version: p.version,
      directory: p.directory,
    })),
    registryPrimitiveCount: registryIndex.primitives?.length ?? 0,
    registryComponentCount: registryIndex.components?.length ?? 0,
    registryBlockCount: registryIndex.blocks?.length ?? 0,
    registryTemplateCount: registryIndex.templates?.length ?? 0,
    registryThemeCount: registryIndex.themes?.length ?? 0,
  }

  // Ensure artifacts directory exists
  if (!existsSync(ARTIFACTS_DIR)) {
    mkdirSync(ARTIFACTS_DIR, { recursive: true })
  }

  // Write catalog
  const catalogContent = JSON.stringify(catalog, null, 2) + "\n"
  const catalogPath = join(ARTIFACTS_DIR, "beta-catalog.json")
  writeFileSync(catalogPath, catalogContent)
  console.log(`  Wrote ${catalogPath}`)

  // Compute hashes
  const catalogHash = sha256Content(catalogContent)
  const registryHash = sha256File(REGISTRY_INDEX)

  // Determine release identifier from first publishable package version
  const releaseVersion = publishable[0]?.version ?? "0.0.0"
  const release = `v${releaseVersion}`

  // Generate pointer
  const pointer: BetaPointer = {
    channel: "beta",
    release,
    generatedAt: catalog.generatedAt,
    catalogSha256: catalogHash,
    registryIndexSha256: registryHash,
    solidVersion,
    packageCount: publishable.length,
  }

  const pointerPath = join(ARTIFACTS_DIR, "beta-pointer.json")
  writeFileSync(pointerPath, JSON.stringify(pointer, null, 2) + "\n")
  console.log(`  Wrote ${pointerPath}`)

  // Summary
  console.log(`\n  Channel:    ${pointer.channel}`)
  console.log(`  Release:    ${pointer.release}`)
  console.log(`  Packages:   ${pointer.packageCount}`)
  console.log(`  Solid:      ${pointer.solidVersion}`)
  console.log(`  Catalog:    ${catalogHash.slice(0, 16)}...`)
  console.log(`  Registry:   ${registryHash.slice(0, 16)}...`)

  if (verifyMode) {
    console.log("\n--- Verification ---")
    // Verify catalog hash matches
    const recomputedHash = sha256File(catalogPath)
    const catalogMatch = recomputedHash === pointer.catalogSha256
    console.log(`  ${catalogMatch ? "✓" : "✗"} catalog SHA-256 matches pointer`)

    // Verify registry hash
    const recomputedRegistryHash = sha256File(REGISTRY_INDEX)
    const registryMatch = recomputedRegistryHash === pointer.registryIndexSha256
    console.log(`  ${registryMatch ? "✓" : "✗"} registry index SHA-256 matches pointer`)

    if (!catalogMatch || !registryMatch) {
      console.error("\n✗ Verification failed.")
      process.exit(1)
    }
    console.log("\n✓ All beta artifact checks passed.")
  }
}

main()
