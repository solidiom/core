#!/usr/bin/env node
/**
 * Sets the solid-js version based on the tier (low/mid/high)
 * for CI matrix testing. Reads from tools/solid-matrix.json.
 *
 * Usage: node scripts/set-solid-version.mjs <low|mid|high>
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const tier = process.argv[2]
if (!tier || !["low", "mid", "high"].includes(tier)) {
  console.error("Usage: set-solid-version.mjs <low|mid|high>")
  process.exit(1)
}

const matrixPath = resolve(import.meta.dirname, "../tools/solid-matrix.json")
const matrix = JSON.parse(readFileSync(matrixPath, "utf-8"))
const version = matrix.window[tier]

if (!version) {
  console.error(`No version found for tier "${tier}" in solid-matrix.json`)
  process.exit(1)
}

const pkgPath = resolve(import.meta.dirname, "../package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))

// Add pnpm overrides to force a specific solid-js version
pkg.pnpm = pkg.pnpm || {}
pkg.pnpm.overrides = pkg.pnpm.overrides || {}
pkg.pnpm.overrides["solid-js"] = version

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
console.log(`Set solid-js override to ${version} (tier: ${tier})`)
