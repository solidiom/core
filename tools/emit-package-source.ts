/**
 * tools/emit-package-source — explicit `src/` → `source/` regeneration (CLI-001).
 *
 * `tools/build/tsup.config.base.ts` copies `src/` to `source/` as a build side effect
 * (its `onSuccess` hook), which means regenerating `source/` today requires running a
 * full `tsup` build. This script exposes that copy directly so a contributor — or CI —
 * can regenerate or verify `source/` without invoking the bundler.
 *
 * Usage:
 *   pnpm run source:emit           # regenerate source/ for every dual-emission package
 *   pnpm run source:emit:check     # exit 1 on drift, no writes (safe for CI)
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import { auditSourceParity, type SourceParityError } from "./audit-package-source-parity"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

/** Every package with a dual-emission `src/` + build-copied `source/` tree. */
const DUAL_EMISSION_PACKAGES = ["recipes-css", "recipes-tailwind", "recipes-unocss", "cli"] as const

/** Files the copy step deliberately excludes from `source/` (mirrors tsup.config.base.ts). */
function isExcludedFromCopy(fileName: string): boolean {
  return fileName.endsWith(".test.ts") || fileName.endsWith(".spec.ts")
}

/** Recursively copies `srcDir` into `destDir`, skipping excluded files, clearing stale output first. */
function copySourceDir(srcDir: string, destDir: string): void {
  if (existsSync(destDir)) {
    rmSync(destDir, { recursive: true, force: true })
  }
  mkdirSync(destDir, { recursive: true })

  const entries = readdirSync(srcDir)
  for (const entry of entries) {
    if (isExcludedFromCopy(entry)) continue
    const srcPath = join(srcDir, entry)
    const destPath = join(destDir, entry)
    const stat = statSync(srcPath)
    if (stat.isDirectory()) {
      copySourceDir(srcPath, destPath)
    } else {
      writeFileSync(destPath, readFileSync(srcPath))
    }
  }
}

export interface EmitResult {
  package: string
  emitted: boolean
  errorsBefore: SourceParityError[]
}

/** Regenerates `source/` for one package from `src/`. */
export function emitPackageSource(packageName: string, root = ROOT): EmitResult {
  const packageDir = join(root, "packages", packageName)
  const srcDir = join(packageDir, "src")
  const sourceDir = join(packageDir, "source")

  if (!existsSync(srcDir)) {
    return { package: packageName, emitted: false, errorsBefore: [] }
  }

  copySourceDir(srcDir, sourceDir)
  return { package: packageName, emitted: true, errorsBefore: [] }
}

/** Regenerates `source/` for every dual-emission package. */
export function emitAllPackageSource(root = ROOT): EmitResult[] {
  return DUAL_EMISSION_PACKAGES.map((name) => emitPackageSource(name, root))
}

/** Checks whether `source/` is already in sync with `src/`, without writing anything. */
export function checkAllPackageSource(root = ROOT): SourceParityError[] {
  return DUAL_EMISSION_PACKAGES.flatMap((name) =>
    auditSourceParity(name, join(root, "packages", name)),
  )
}

function main(): void {
  const checkOnly = process.argv.includes("--check")

  if (checkOnly) {
    console.log("Checking src/ → source/ parity (no writes)\n")
    const errors = checkAllPackageSource()
    if (errors.length === 0) {
      console.log("✓ source/ is in sync with src/ for all dual-emission packages")
      return
    }
    console.error(`✗ source/ is out of sync — ${errors.length} issue(s):\n`)
    for (const error of errors) {
      console.error(`  [${error.package}] ${error.file}: ${error.message}`)
    }
    console.error("\nRun: pnpm run source:emit")
    process.exitCode = 1
    return
  }

  console.log("Regenerating source/ from src/\n")
  const results = emitAllPackageSource()
  for (const result of results) {
    if (result.emitted) {
      console.log(`  [${result.package}] source/ regenerated`)
    } else {
      console.log(`  [${result.package}] skipped — no src/ directory`)
    }
  }
  console.log("\n✓ source/ regeneration complete")
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
