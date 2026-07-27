#!/usr/bin/env npx tsx
/**
 * Updates the Solid 2 rolling beta window.
 *
 * Shifts the 3-beta window to include a new high version, dropping the oldest.
 * Updates tools/solid-matrix.json, pnpm-workspace.yaml catalog/overrides,
 * and the root package.json devDependencies to stay synchronized.
 *
 * Usage:
 *   npx tsx scripts/update-solid-window.mts <new-high-version>
 *   npx tsx scripts/update-solid-window.mts 2.0.0-beta.22
 *   npx tsx scripts/update-solid-window.mts 2.0.0-beta.22 --dry-run
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")
const dryRun = process.argv.includes("--dry-run")

interface SolidMatrix {
  description: string
  window: { low: string; mid: string; high: string }
  peerRange: string
  lastUpdated: string
}

function main() {
  const newHigh = process.argv[2]
  if (!newHigh || newHigh.startsWith("--")) {
    console.error("Usage: npx tsx scripts/update-solid-window.mts <new-high-version>")
    console.error("Example: npx tsx scripts/update-solid-window.mts 2.0.0-beta.22")
    process.exit(1)
  }

  // Read current matrix
  const matrixPath = join(ROOT, "tools/solid-matrix.json")
  const matrix: SolidMatrix = JSON.parse(readFileSync(matrixPath, "utf8"))
  const oldWindow = { ...matrix.window }

  // Shift window: old mid becomes new low, old high becomes new mid
  const newWindow = {
    low: oldWindow.mid,
    mid: oldWindow.high,
    high: newHigh,
  }

  // Compute new peer range from low
  const newPeerRange = `^${newWindow.low}`
  const today = new Date().toISOString().slice(0, 10)

  console.log("Solid 2 beta window update:")
  console.log(`  Old: ${oldWindow.low} / ${oldWindow.mid} / ${oldWindow.high}`)
  console.log(`  New: ${newWindow.low} / ${newWindow.mid} / ${newWindow.high}`)
  console.log(`  Peer range: ${newPeerRange}`)
  console.log(`  Override (installed): ${newHigh}`)
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

  // 2. Update pnpm-workspace.yaml
  const workspacePath = join(ROOT, "pnpm-workspace.yaml")
  let workspace = readFileSync(workspacePath, "utf8")
  workspace = workspace.replace(
    /solid-js: "[^"]+"/,
    `solid-js: "${newPeerRange}"`,
  )
  workspace = workspace.replace(
    /"@solidjs\/web": "[^"]+"/,
    `"@solidjs/web": "${newPeerRange}"`,
  )
  workspace = workspace.replace(
    /babel-preset-solid: "[^"]+"/,
    `babel-preset-solid: "${newPeerRange}"`,
  )
  // Update overrides to pin the high version
  workspace = workspace.replace(
    /solid-js: "\d[^"]+"\n(\s+babel-preset-solid: ")\d[^"]+"/,
    `solid-js: "${newHigh}"\n$1${newHigh}"`,
  )
  console.log(`  [2/3] pnpm-workspace.yaml`)
  if (!dryRun) writeFileSync(workspacePath, workspace)

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
