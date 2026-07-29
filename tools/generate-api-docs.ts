/**
 * API-001: Generate API documentation from primitive packages using TypeDoc.
 *
 * Iterates packages tagged with `layer:primitive` in their nx configuration,
 * runs TypeDoc programmatically on each package's source/ directory, and
 * outputs a normalized JSON representation to artifacts/api/<name>.json.
 *
 * Usage:
 *   tsx tools/generate-api-docs.ts                  # all primitives
 *   tsx tools/generate-api-docs.ts --package dialog # single package
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, join, resolve } from "node:path"

const ROOT = resolve(import.meta.dirname ?? __dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const OUTPUT_DIR = join(ROOT, "artifacts/api")

interface PackageNxConfig {
  tags?: string[]
}

interface PackageJson {
  name?: string
  nx?: PackageNxConfig
}

interface ApiEntry {
  name: string
  kind: string
  documentation?: string
  type?: string
  signatures?: Array<{
    parameters?: Array<{ name: string; type: string }>
    returnType?: string
  }>
}

interface ApiOutput {
  packageName: string
  generatedAt: string
  entryPoints: string[]
  exports: ApiEntry[]
}

function parseArgs(): { packageFilter: string | null } {
  const idx = process.argv.indexOf("--package")
  if (idx === -1 || !process.argv[idx + 1]) return { packageFilter: null }
  return { packageFilter: process.argv[idx + 1] }
}

function discoverPrimitivePackages(): Array<{ name: string; dir: string }> {
  const packages: Array<{ name: string; dir: string }> = []

  if (!existsSync(PACKAGES_DIR)) {
    console.warn(`⚠ packages/ directory not found at ${PACKAGES_DIR}`)
    return packages
  }

  for (const entry of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const packageDir = join(PACKAGES_DIR, entry.name)
    const packageJsonPath = join(packageDir, "package.json")

    if (!existsSync(packageJsonPath)) continue

    try {
      const pkg: PackageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))
      const tags = pkg.nx?.tags ?? []

      if (tags.includes("layer:primitive")) {
        packages.push({ name: pkg.name ?? entry.name, dir: packageDir })
      }
    } catch {
      console.warn(`⚠ Unable to parse ${packageJsonPath}`)
    }
  }

  return packages
}

async function generateForPackage(pkg: { name: string; dir: string }): Promise<void> {
  const sourceDir = join(pkg.dir, "source")
  if (!existsSync(sourceDir)) {
    console.warn(`⚠ No source/ directory in ${pkg.dir}, skipping`)
    return
  }

  const shortName = basename(pkg.dir)
  console.log(`  → Processing ${shortName}...`)

  try {
    // Dynamic import to handle the case where typedoc is not installed
    const { Application, TSConfigReader } = await import("typedoc")

    const app = await Application.bootstrapWithPlugins({
      entryPoints: [sourceDir],
      entryPointStrategy: "expand",
      tsconfig: join(pkg.dir, "tsconfig.json"),
      excludePrivate: true,
      excludeInternal: true,
      excludeExternals: true,
    })

    app.options.addReader(new TSConfigReader())

    const project = await app.convert()

    if (!project) {
      console.error(`  ✗ TypeDoc conversion failed for ${shortName}`)
      return
    }

    const serialized = app.serializer.projectToObject(project, ROOT)

    const output: ApiOutput = {
      packageName: pkg.name,
      generatedAt: new Date().toISOString(),
      entryPoints: [sourceDir],
      exports: (serialized.children ?? []).map((child: Record<string, unknown>) => ({
        name: child.name as string,
        kind: String(child.kindString ?? child.kind ?? "unknown"),
        documentation: (child.comment as Record<string, unknown>)?.summary
          ? String((child.comment as Record<string, unknown>).summary)
          : undefined,
        type: child.type ? JSON.stringify(child.type) : undefined,
      })),
    }

    const outputPath = join(OUTPUT_DIR, `${shortName}.json`)
    writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")
    console.log(`  ✓ ${outputPath} (${output.exports.length} exports)`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND" ||
        (error as NodeJS.ErrnoException).code === "MODULE_NOT_FOUND") {
      console.error(
        `  ✗ typedoc is not installed. Run: pnpm add -D typedoc @solidiom/typedoc-plugin-markdown`,
      )
      process.exitCode = 1
      return
    }
    console.error(`  ✗ Failed to generate API docs for ${shortName}: ${String(error)}`)
    process.exitCode = 1
  }
}

async function main(): Promise<void> {
  const { packageFilter } = parseArgs()

  console.log("API-001: Generating API documentation...")
  console.log(`  Output: ${OUTPUT_DIR}\n`)

  mkdirSync(OUTPUT_DIR, { recursive: true })

  let packages = discoverPrimitivePackages()

  if (packages.length === 0) {
    console.error("✗ No packages with layer:primitive tag found")
    process.exitCode = 1
    return
  }

  if (packageFilter) {
    packages = packages.filter(
      (pkg) => pkg.name === packageFilter || basename(pkg.dir) === packageFilter,
    )
    if (packages.length === 0) {
      console.error(`✗ Package "${packageFilter}" not found or not tagged layer:primitive`)
      process.exitCode = 1
      return
    }
  }

  console.log(`Found ${packages.length} primitive package(s):\n`)

  for (const pkg of packages) {
    await generateForPackage(pkg)
  }

  console.log(`\n✓ API generation complete`)
}

main().catch((error) => {
  console.error(`✗ Unexpected error: ${String(error)}`)
  process.exit(1)
})
