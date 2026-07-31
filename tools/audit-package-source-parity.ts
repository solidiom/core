import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

/**
 * Recipe and theme-output packages that ship a dual-emission `src/` + build-copied
 * `source/` tree AND publish it as a consumer-facing `"solid"` export condition.
 *
 * These get the full audit: byte-for-byte parity plus export-map completeness
 * (`auditExportCompleteness`), because a missing/incomplete export map makes an
 * otherwise-correct `source/` emission unimportable by consumers.
 *
 * `themes` (THEME-002/003) has no `src/styles/` directory — its generated stylesheets
 * live under `src/css/` and `src/tailwind/` instead — so `auditExportCompleteness`'s
 * styles-specific check is a no-op for it (guarded by `existsSync(stylesDir)`); it
 * still gets real byte-for-byte `src/`/`source/` parity coverage from this list.
 */
const SOURCE_OWNED_PACKAGES = [
  "recipes-css",
  "recipes-tailwind",
  "recipes-unocss",
  "themes",
] as const

/**
 * Tooling packages (`layer:tooling`) that ship a dual-emission `src/` + build-copied
 * `source/` tree for convention consistency, but have no `"solid"` export condition
 * and no consumer-facing styles/export map — nobody bundles a CLI binary from source.
 *
 * These get byte-for-byte parity only (`auditSourceParity`); `auditExportCompleteness`
 * does not apply and would produce false failures (it requires a `"solid"` root
 * export condition that these packages intentionally do not have).
 */
const TOOLING_PACKAGES = ["cli"] as const

export interface SourceParityError {
  package: string
  file: string
  message: string
}

/** Files `packages/<name>/tsup.config.ts`'s `copyDir` deliberately excludes from `source/`. */
function isExcludedFromCopy(fileName: string): boolean {
  return fileName.endsWith(".test.ts") || fileName.endsWith(".spec.ts")
}

/** Recursively lists files under `dir`, returning paths relative to `dir`. */
function listFilesRecursive(dir: string): string[] {
  if (!existsSync(dir)) return []
  const entries: string[] = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      entries.push(...listFilesRecursive(fullPath).map((child) => join(entry, child)))
    } else {
      entries.push(entry)
    }
  }
  return entries
}

/**
 * Asserts `source/` is a byte-identical, non-excluded-file copy of `src/`.
 *
 * `source/` is produced by `tsup.config.ts`'s `onSuccess` hook as a build side
 * effect, not authored directly — this audit is what makes that side effect
 * verifiable rather than trusted. Catches two regressions the build alone
 * cannot: a file removed from `src/` but left behind in `source/`, and content
 * drift between the two (e.g. a manual edit to `source/` that a later build
 * silently overwrites, or a build that failed to run at all).
 */
export function auditSourceParity(packageName: string, packageDir: string): SourceParityError[] {
  const errors: SourceParityError[] = []
  const srcDir = join(packageDir, "src")
  const sourceDir = join(packageDir, "source")

  if (!existsSync(srcDir)) {
    errors.push({ package: packageName, file: "src/", message: "package has no src/ directory" })
    return errors
  }
  if (!existsSync(sourceDir)) {
    errors.push({
      package: packageName,
      file: "source/",
      message: "package has no source/ directory — run the package build to generate it",
    })
    return errors
  }

  const expectedFiles = listFilesRecursive(srcDir).filter((file) => !isExcludedFromCopy(file))
  const actualFiles = listFilesRecursive(sourceDir)

  const expectedSet = new Set(expectedFiles)
  const actualSet = new Set(actualFiles)

  for (const file of expectedFiles) {
    if (!actualSet.has(file)) {
      errors.push({
        package: packageName,
        file: `source/${file}`,
        message:
          "missing from source/ — src/ has this file but source/ does not; rebuild the package",
      })
      continue
    }
    const srcContent = readFileSync(join(srcDir, file))
    const sourceContent = readFileSync(join(sourceDir, file))
    if (!srcContent.equals(sourceContent)) {
      errors.push({
        package: packageName,
        file: `source/${file}`,
        message: "content differs from src/ — source/ is stale; rebuild the package",
      })
    }
  }

  for (const file of actualFiles) {
    if (!expectedSet.has(file)) {
      errors.push({
        package: packageName,
        file: `source/${file}`,
        message:
          "orphaned file with no counterpart in src/ — likely left behind by a file removed from src/ without rebuilding",
      })
    }
  }

  return errors
}

/**
 * Asserts every `src/styles/*.css` stylesheet has a matching `package.json`
 * `exports` subpath entry (`./styles/<name>.css`) and vice versa.
 *
 * A stylesheet emitted without an export entry is unimportable by consumers
 * even though it built successfully — this is the gap that let
 * `recipes-unocss` diverge silently from `recipes-css`/`recipes-tailwind`.
 */
export function auditExportCompleteness(
  packageName: string,
  packageDir: string,
): SourceParityError[] {
  const errors: SourceParityError[] = []
  const stylesDir = join(packageDir, "src", "styles")
  const packageJsonPath = join(packageDir, "package.json")

  if (!existsSync(stylesDir) || !existsSync(packageJsonPath)) return errors

  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    exports?: Record<string, unknown>
  }
  const exportsMap = pkg.exports ?? {}

  const stylesheets = readdirSync(stylesDir)
    .filter((file) => file.endsWith(".css") && file !== "index.css")
    .sort()

  for (const file of stylesheets) {
    const exportKey = `./styles/${file}`
    if (!(exportKey in exportsMap)) {
      errors.push({
        package: packageName,
        file: `src/styles/${file}`,
        message: `stylesheet has no "${exportKey}" entry in package.json exports`,
      })
    }
  }

  const exportedStyleFiles = Object.keys(exportsMap)
    .filter((key) => key.startsWith("./styles/") && key.endsWith(".css"))
    .map((key) => key.slice("./styles/".length))

  for (const file of exportedStyleFiles) {
    if (!stylesheets.includes(file)) {
      errors.push({
        package: packageName,
        file: "package.json",
        message: `exports declares "./styles/${file}" but src/styles/${file} does not exist`,
      })
    }
  }

  const rootExport = exportsMap["."] as
    { solid?: string; import?: string; types?: string } | undefined
  if (!rootExport) {
    errors.push({
      package: packageName,
      file: "package.json",
      message: 'exports is missing the "." root entry',
    })
  } else {
    for (const condition of ["solid", "import", "types"] as const) {
      if (!rootExport[condition]) {
        errors.push({
          package: packageName,
          file: "package.json",
          message: `exports["."] is missing the "${condition}" condition`,
        })
      }
    }
  }

  return errors
}

export function auditRecipeSourceParity(root = ROOT): SourceParityError[] {
  return SOURCE_OWNED_PACKAGES.flatMap((name) => {
    const packageDir = join(root, "packages", name)
    return [...auditSourceParity(name, packageDir), ...auditExportCompleteness(name, packageDir)]
  })
}

/**
 * Audits tooling packages (CLI-001): byte-for-byte `src/`/`source/` parity only.
 * No export-map check — tooling packages have no `"solid"` export condition.
 */
export function auditToolingSourceParity(root = ROOT): SourceParityError[] {
  return TOOLING_PACKAGES.flatMap((name) => {
    const packageDir = join(root, "packages", name)
    return auditSourceParity(name, packageDir)
  })
}

/** Runs every tier of the package src/source parity audit. */
export function auditAllPackageSourceParity(root = ROOT): SourceParityError[] {
  return [...auditRecipeSourceParity(root), ...auditToolingSourceParity(root)]
}

function main(): void {
  console.log("Package src/source parity and export-map check\n")
  const errors = auditAllPackageSourceParity()

  if (errors.length === 0) {
    console.log("✓ Package source parity check PASSED")
    console.log("  source/ mirrors src/ byte-for-byte and every stylesheet is exported.")
    return
  }

  console.error(`✗ Package source parity check FAILED — ${errors.length} issue(s):\n`)
  for (const error of errors) {
    console.error(`  [${error.package}] ${error.file}: ${error.message}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
