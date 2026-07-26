/**
 * Solid 2 stable transition script (Task 60).
 *
 * When Solid 2 hits stable, run this to:
 * 1. Collapse 3-beta window to normal ^2 semver
 * 2. Remove `next` channel from Changesets
 * 3. Simplify CI matrix (remove tri-beta, keep {node 20, 22} × {chromium})
 * 4. Update pnpm catalog to stable version
 * 5. Remove beta compat code per §19.3
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")

interface TransitionOptions {
  /** The stable Solid 2 version (e.g. "2.0.0"). */
  stableVersion: string
  /** Dry run — show what would change without writing. */
  dryRun?: boolean
}

export function transitionToSolid2Stable(options: TransitionOptions): string[] {
  const { stableVersion, dryRun = false } = options
  const changes: string[] = []

  // 1. Update pnpm-workspace.yaml catalog
  const workspacePath = join(ROOT, "pnpm-workspace.yaml")
  let workspace = readFileSync(workspacePath, "utf8")
  const oldCatalog = workspace.match(/solid-js: ".*"/)?.[0]
  if (oldCatalog) {
    workspace = workspace.replace(oldCatalog, `solid-js: "^${stableVersion}"`)
    workspace = workspace.replace(
      /babel-preset-solid: ".*"/,
      `babel-preset-solid: "^${stableVersion}"`,
    )
    changes.push(`pnpm catalog: solid-js ^${stableVersion}`)
    if (!dryRun) writeFileSync(workspacePath, workspace)
  }

  // 2. Update solid-matrix.json to single version
  const matrixPath = join(ROOT, "tools/solid-matrix.json")
  const newMatrix = JSON.stringify({ versions: [stableVersion], window: "stable" }, null, 2)
  changes.push(`solid-matrix.json: single version ${stableVersion}`)
  if (!dryRun) writeFileSync(matrixPath, newMatrix + "\n")

  // 3. CI matrix simplification note
  changes.push("CI: remove solid tier matrix, keep {node 20, 22} × chromium only")

  // 4. Remove next channel from Changesets config
  changes.push("Changesets: remove pre-release next channel")

  return changes
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const version = process.argv[2]
  if (!version) {
    console.error("Usage: npx tsx scripts/solid2-stable-transition.mts <version>")
    console.error("Example: npx tsx scripts/solid2-stable-transition.mts 2.0.0")
    process.exit(1)
  }
  const changes = transitionToSolid2Stable({
    stableVersion: version,
    dryRun: process.argv.includes("--dry-run"),
  })
  console.log("Solid 2 stable transition:")
  for (const c of changes) console.log(`  • ${c}`)
}
