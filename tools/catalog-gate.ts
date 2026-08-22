/**
 * Catalog gate — enforces a single source of truth for Solid dependencies.
 *
 * Every workspace package must reference the shared pnpm catalog for the Solid
 * toolchain packages rather than hardcoding a version. This prevents the drift
 * that let some 0.4.0 packages advertise a beta peer range while the workspace
 * actually installed the RC build.
 *
 * The rule: in any dependencies / devDependencies / peerDependencies section,
 * the packages listed in CATALOGED_DEPS must use the value "catalog:" (or a
 * named catalog "catalog:<name>"). Any concrete version string is a failure.
 *
 * The real version lives in exactly one place: the `catalog:` (and `overrides`)
 * blocks of pnpm-workspace.yaml. Bumping Solid is a one-line edit there.
 *
 * Run via: pnpm run deps:catalog-gate
 * Or:      pnpm exec tsx tools/catalog-gate.ts
 */

import { readFileSync, globSync } from "node:fs"
import { join } from "node:path"

const CATALOGED_DEPS = new Set(["solid-js", "@solidjs/web", "babel-preset-solid"])

const DEP_SECTIONS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const

const isCatalogRef = (value: string): boolean =>
  value === "catalog:" || value.startsWith("catalog:")

interface Violation {
  file: string
  section: string
  name: string
  value: string
}

const packageFiles = globSync("packages/*/package.json", {
  cwd: process.cwd(),
}).sort()

const violations: Violation[] = []

for (const rel of packageFiles) {
  const file = join(process.cwd(), rel)
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(readFileSync(file, "utf8"))
  } catch (err) {
    console.error(`Failed to parse ${rel}: ${(err as Error).message}`)
    process.exitCode = 1
    continue
  }

  for (const section of DEP_SECTIONS) {
    const deps = pkg[section] as Record<string, string> | undefined
    if (!deps) continue
    for (const [name, value] of Object.entries(deps)) {
      if (CATALOGED_DEPS.has(name) && !isCatalogRef(value)) {
        violations.push({ file: rel, section, name, value })
      }
    }
  }
}

console.log("Catalog Gate (deps:catalog-gate)\n")

if (violations.length === 0) {
  console.log(`✓ All Solid deps across ${packageFiles.length} packages use the shared catalog.`)
  process.exit(0)
}

console.error(`✗ ${violations.length} Solid dependency declaration(s) bypass the catalog:\n`)
for (const v of violations) {
  console.error(`  ${v.file}`)
  console.error(`    ${v.section}.${v.name} = "${v.value}"  → expected "catalog:"`)
}
console.error(
  '\nFix: set the version to "catalog:" and define the real version once in' +
    "\nthe `catalog:` block of pnpm-workspace.yaml.",
)
process.exit(1)
