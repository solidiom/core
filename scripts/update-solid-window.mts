#!/usr/bin/env npx tsx
/**
 * Updates the Solid 2 rolling prerelease window.
 *
 * Shifts the 3-version window to include a new high version, dropping the
 * oldest. Updates tools/solid-matrix.json, pnpm-workspace.yaml
 * catalog/overrides, and the root package.json devDependencies to stay
 * synchronized.
 *
 * The runtime packages (solid-js, @solidjs/web) move with the window. The
 * compiler (babel-preset-solid) is version-decoupled — its release line lags
 * the runtime (e.g. it stops at 2.0.0-rc.2 while the runtime is on later
 * RCs) — so its pin is preserved from the matrix `compiler` field and is
 * never rewritten to the window version.
 *
 * Usage:
 *   npx tsx scripts/update-solid-window.mts <new-high-version>
 *   npx tsx scripts/update-solid-window.mts 2.0.0-rc.20
 *   npx tsx scripts/update-solid-window.mts 2.0.0-rc.20 --dry-run
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")
const dryRun = process.argv.includes("--dry-run")

interface SolidMatrix {
  description: string
  window: { low: string; mid: string; high: string }
  /** babel-preset-solid pin; lags the runtime release line. */
  compiler: string
  peerRange: string
  lastUpdated: string
}

async function main() {
  const newHigh = process.argv[2]
  if (!newHigh || newHigh.startsWith("--")) {
    console.error("Usage: npx tsx scripts/update-solid-window.mts <new-high-version>")
    console.error("Example: npx tsx scripts/update-solid-window.mts 2.0.0-rc.20")
    process.exit(1)
  }

  // Fail loud: a nonexistent override target is silently ignored by pnpm, so
  // an unverified bump would quietly leave the workspace on the old version.
  for (const pkg of ["solid-js", "@solidjs/web"]) {
    const response = await fetch(`https://registry.npmjs.org/${pkg}/${newHigh}`)
    if (!response.ok) {
      console.error(
        `update-solid-window: ${pkg}@${newHigh} does not exist on npm (HTTP ${response.status}).`,
      )
      process.exit(1)
    }
  }

  // Read current matrix
  const matrixPath = join(ROOT, "tools/solid-matrix.json")
  const matrix: SolidMatrix = JSON.parse(readFileSync(matrixPath, "utf8"))
  if (!matrix.compiler) {
    console.error('update-solid-window: matrix has no "compiler" field; refusing to guess.')
    process.exit(1)
  }
  const oldWindow = { ...matrix.window }

  // Shift window: old mid becomes new low, old high becomes new mid
  const newWindow = {
    low: oldWindow.mid,
    mid: oldWindow.high,
    high: newHigh,
  }

  // Compute new peer range from low. Prerelease-aware: `^2.0.0-rc.X` never
  // matches the stable `2.0.0` release under npm semver, so prerelease
  // windows use an explicit >=floor <major range; the stable transition
  // (scripts/solid2-stable-transition.mts) replaces it with ^major.
  const isPrerelease = /-(alpha|beta|rc|next|canary|experimental)\./.test(newWindow.low)
  const major = newWindow.low.replace(/-.*$/, "").split(".")[0]
  const newPeerRange = isPrerelease
    ? `>=${newWindow.low} <${Number(major) + 1}.0.0`
    : `^${newWindow.low}`
  const today = new Date().toISOString().slice(0, 10)

  console.log("Solid 2 window update:")
  console.log(`  Old: ${oldWindow.low} / ${oldWindow.mid} / ${oldWindow.high}`)
  console.log(`  New: ${newWindow.low} / ${newWindow.mid} / ${newWindow.high}`)
  console.log(`  Peer range: ${newPeerRange}`)
  console.log(`  Override (installed): ${newHigh}`)
  console.log(`  Compiler (unchanged): ${matrix.compiler}`)
  console.log()

  // 1. Update solid-matrix.json
  const newMatrix: SolidMatrix = {
    ...matrix,
    window: newWindow,
    peerRange: newPeerRange,
    lastUpdated: today,
  }
  const matrixContent = JSON.stringify(newMatrix, null, 2) + "\n"
  console.log(`  [1/3] tools/solid-matrix.json`)
  if (!dryRun) writeFileSync(matrixPath, matrixContent)

  // 2. Update pnpm-workspace.yaml. Replace inside the catalog: and overrides:
  //    blocks only — a global replace would also rewrite unrelated entries,
  //    and a positional multi-key regex breaks the moment a line is inserted
  //    between the pinned keys.
  const workspacePath = join(ROOT, "pnpm-workspace.yaml")
  const workspace = readFileSync(workspacePath, "utf8")

  const blockRange = (header: string): readonly [number, number] => {
    const start = workspace.indexOf(`\n${header}\n`)
    if (start === -1) {
      console.error(`update-solid-window: no "${header}" block in pnpm-workspace.yaml`)
      process.exit(1)
    }
    const bodyStart = start + header.length + 2
    const rest = workspace.slice(bodyStart)
    // The block ends at the next top-level key, not merely the first
    // non-indented line: a blank line between blocks would otherwise truncate
    // the body to zero length.
    const endRel = rest.search(/^\S.*$/m)
    return [bodyStart, endRel === -1 ? workspace.length : bodyStart + endRel]
  }

  const pin = (block: string, pkg: string, version: string): string => {
    // YAML keys may be quoted or bare: the catalog writes `solid-js:` bare but
    // `"@solidjs/web":` quoted (the leading @ forces quoting). Accept both.
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const re = new RegExp(`(^\\s*"?${escaped}"?: )"[^"]+"`, "m")
    if (!re.test(block)) {
      console.error(`update-solid-window: no "${pkg}" entry in the expected block`)
      process.exit(1)
    }
    return block.replace(re, `$1"${version}"`)
  }

  const [catalogStart, catalogEnd] = blockRange("catalog:")
  const [overridesStart, overridesEnd] = blockRange("overrides:")

  // babel-preset-solid in the catalog keeps its own release-line range.
  const nextCatalog = pin(
    pin(workspace.slice(catalogStart, catalogEnd), "solid-js", `>=${newWindow.low} <3.0.0`),
    "@solidjs/web",
    `>=${newWindow.low} <3.0.0`,
  )

  const nextOverrides = pin(
    pin(
      pin(workspace.slice(overridesStart, overridesEnd), "solid-js", newHigh),
      "@solidjs/web",
      newHigh,
    ),
    "babel-preset-solid",
    matrix.compiler,
  )

  const assembled =
    catalogStart < overridesStart
      ? workspace.slice(0, catalogStart) +
        nextCatalog +
        workspace.slice(catalogEnd, overridesStart) +
        nextOverrides +
        workspace.slice(overridesEnd)
      : workspace.slice(0, overridesStart) +
        nextOverrides +
        workspace.slice(overridesEnd, catalogStart) +
        nextCatalog +
        workspace.slice(catalogEnd)

  console.log(`  [2/3] pnpm-workspace.yaml`)
  if (!dryRun) writeFileSync(workspacePath, assembled)

  // 3. Update root package.json devDependencies
  const pkgPath = join(ROOT, "package.json")
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
  if (pkg.devDependencies?.["solid-js"]) {
    pkg.devDependencies["solid-js"] = newHigh
  }
  if (pkg.devDependencies?.["@solidjs/web"]) {
    pkg.devDependencies["@solidjs/web"] = newHigh
  }
  console.log(`  [3/3] package.json`)
  if (!dryRun) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

  console.log()
  if (dryRun) {
    console.log("DRY RUN — no files were written.")
  } else {
    console.log("Done. Run `pnpm install` to apply the new versions.")
    console.log("Remember to create a changeset if this affects package compatibility.")
  }
}

main()
