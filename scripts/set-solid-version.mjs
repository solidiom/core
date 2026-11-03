#!/usr/bin/env node
/**
 * Sets the Solid 2 toolchain version for a compatibility tier (low/mid/high)
 * used by the nightly CI matrix. Reads from tools/solid-matrix.json.
 *
 * The runtime packages (solid-js, @solidjs/web) follow the tier version. The
 * compiler (babel-preset-solid) is version-decoupled: its release line lags
 * the runtime (it stops at 2.0.0-rc.2 while the runtime is on later RCs), so
 * its pin comes from the matrix `compiler` field, never from the tier.
 *
 * Existence of every resolved version is verified against the npm registry
 * before anything is written: a pnpm override pointing at a nonexistent
 * version fails *silently* (the override just never matches), which would let
 * the compat matrix test the pinned toolchain for every tier without warning.
 *
 * Usage: node scripts/set-solid-version.mjs <low|mid|high>
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const RUNTIME_PACKAGES = ["solid-js", "@solidjs/web"]
const COMPILER_PACKAGE = "babel-preset-solid"

async function assertVersionExists(pkg, version) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(pkg).replace("%40", "@")}/${version}`
  let response
  try {
    response = await fetch(url)
  } catch (err) {
    console.error(
      `set-solid-version: cannot reach the npm registry to verify ${pkg}@${version}: ${err.message}`,
    )
    console.error("Refusing to write an unverified override (a silent no-op override is worse).")
    process.exit(1)
  }
  if (!response.ok) {
    console.error(
      `set-solid-version: ${pkg}@${version} does not exist on npm ` +
        `(registry returned HTTP ${response.status}).`,
    )
    console.error(
      "Fix tools/solid-matrix.json before running this script — a nonexistent override " +
        "target is silently ignored by pnpm, so the CI tier would silently test the wrong version.",
    )
    process.exit(1)
  }
}

async function main() {
  const tier = process.argv[2]
  if (!tier || !["low", "mid", "high"].includes(tier)) {
    console.error("Usage: set-solid-version.mjs <low|mid|high>")
    process.exit(1)
  }

  const matrixPath = resolve(import.meta.dirname, "../tools/solid-matrix.json")
  const matrix = JSON.parse(readFileSync(matrixPath, "utf-8"))
  const runtimeVersion = matrix.window[tier]
  const compilerVersion = matrix.compiler

  if (!runtimeVersion) {
    console.error(`No version found for tier "${tier}" in solid-matrix.json`)
    process.exit(1)
  }
  if (!compilerVersion) {
    console.error('No "compiler" field in solid-matrix.json (babel-preset-solid pin).')
    process.exit(1)
  }

  for (const pkg of RUNTIME_PACKAGES) {
    await assertVersionExists(pkg, runtimeVersion)
  }
  await assertVersionExists(COMPILER_PACKAGE, compilerVersion)

  const pkgPath = resolve(import.meta.dirname, "../package.json")
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))

  // Force the entire Solid toolchain: runtime packages to the selected tier,
  // the compiler to its own (lagging) release line. Updating only solid-js
  // leaves @solidjs/web on an incompatible version, and forcing the compiler
  // to the tier version targets a release that does not exist.
  pkg.pnpm = pkg.pnpm || {}
  pkg.pnpm.overrides = pkg.pnpm.overrides || {}
  for (const pkgName of RUNTIME_PACKAGES) {
    pkg.pnpm.overrides[pkgName] = runtimeVersion
  }
  pkg.pnpm.overrides[COMPILER_PACKAGE] = compilerVersion

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  console.log(
    `Set Solid toolchain override: runtime ${runtimeVersion}, compiler ${compilerVersion} (tier: ${tier})`,
  )
}

await main()
