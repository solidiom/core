/**
 * Solid 2 stable transition script (Task 69).
 *
 * When Solid 2 hits stable, run this to collapse the rolling prerelease
 * window to a single stable version:
 *
 *   npx tsx scripts/solid2-stable-transition.mts 2.0.0 [--dry-run]
 *
 * What it rewrites (all values verified against the npm registry first —
 * a pnpm override pointing at a nonexistent version fails *silently*, so
 * an unverified transition would quietly leave the workspace on old bits):
 *
 *   1. tools/solid-matrix.json   — stable schema: window {low,mid,high} all
 *      set to the stable version (so set-solid-version.mjs and the nightly
 *      tier matrix keep working unchanged), peerRange ^<major>, and
 *      compiler bumped to the stable babel-preset-solid release — on the
 *      stable line the compiler and runtime versions move together again.
 *   2. pnpm-workspace.yaml       — catalog floors to >=<major>.0.0 <major+1,
 *      overrides pin solid-js / @solidjs/web / babel-preset-solid to the
 *      stable versions.
 *   3. package.json              — root devDependencies for the runtime
 *      packages.
 *
 * What it deliberately does NOT touch:
 *   - .changeset/config.json — there is no `next` channel configured (the
 *     release pipeline uses dist-tags, see release.yml), so there is nothing
 *     to remove.
 *   - .github/workflows/nightly.yml — after the transition the tier matrix
 *     runs low/mid/high against the same stable version (harmless, keeps the
 *     matrix wiring intact). Drop the `solid-tier` dimension manually once
 *     a real stable window (e.g. 2.0/2.1/2.2 minors) is not in place.
 *   - Beta compat code — none exists in package sources (no version-gated
 *     branches); nothing to remove.
 */

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")

const RUNTIME_PACKAGES = ["solid-js", "@solidjs/web"]
const COMPILER_PACKAGE = "babel-preset-solid"

interface SolidMatrix {
  description: string
  window: { low: string; mid: string; high: string }
  /** babel-preset-solid pin; lags the runtime on the prerelease line. */
  compiler: string
  peerRange: string
  lastUpdated: string
}

/** Resolve a version spec on the npm registry (tags like `latest` included). */
async function resolveNpm(pkg: string, spec: string): Promise<string> {
  const url = `https://registry.npmjs.org/${pkg.replace("/", "%2f")}/${spec}`
  let response: Response
  try {
    response = await fetch(url)
  } catch (err) {
    throw new Error(
      `cannot reach the npm registry to resolve ${pkg}@${spec}: ${(err as Error).message}`,
    )
  }
  if (!response.ok) {
    throw new Error(`${pkg}@${spec} could not be resolved on npm (HTTP ${response.status})`)
  }
  const manifest = (await response.json()) as { version?: string }
  if (!manifest.version) throw new Error(`${pkg}@${spec} resolved without a version`)
  return manifest.version
}

/** Block-scoped YAML value rewrite; keys may be bare or quoted. */
function pin(block: string, pkg: string, version: string, where: string): string {
  const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`(^\\s*"?${escaped}"?: )"[^"]+"`, "m")
  if (!re.test(block)) throw new Error(`no "${pkg}" entry in the ${where} block`)
  return block.replace(re, `$1"${version}"`)
}

function blockRange(file: string, header: string): readonly [number, number] {
  const start = file.indexOf(`\n${header}\n`)
  if (start === -1) throw new Error(`no "${header}" block in pnpm-workspace.yaml`)
  const bodyStart = start + header.length + 2
  const rest = file.slice(bodyStart)
  // End at the next top-level key, not the first non-indented line: blank
  // lines between blocks would otherwise truncate the body.
  const endRel = rest.search(/^\S.*$/m)
  return [bodyStart, endRel === -1 ? file.length : bodyStart + endRel]
}

export async function transitionToSolid2Stable(options: {
  stableVersion: string
  dryRun?: boolean
}): Promise<string[]> {
  const { stableVersion, dryRun = false } = options
  const changes: string[] = []

  if (!/^\d+\.\d+\.\d+$/.test(stableVersion)) {
    throw new Error(`expected a stable (non-prerelease) version like 2.0.0, got "${stableVersion}"`)
  }

  // Verify every write target on npm BEFORE touching any file.
  for (const pkg of RUNTIME_PACKAGES) {
    if ((await resolveNpm(pkg, stableVersion)) !== stableVersion) {
      throw new Error(`${pkg}@${stableVersion} resolved to a different version`)
    }
  }
  const compilerVersion = await resolveNpm(COMPILER_PACKAGE, stableVersion)

  const major = stableVersion.split(".")[0]
  const matrixPath = join(ROOT, "tools/solid-matrix.json")
  const workspacePath = join(ROOT, "pnpm-workspace.yaml")
  const pkgPath = join(ROOT, "package.json")

  // 1. solid-matrix.json — keep the schema intact (window + compiler keys):
  //    set-solid-version.mjs and nightly.yml read window[tier] and compiler.
  const matrix: SolidMatrix = JSON.parse(readFileSync(matrixPath, "utf8"))
  const nextMatrix: SolidMatrix = {
    ...matrix,
    window: { low: stableVersion, mid: stableVersion, high: stableVersion },
    compiler: compilerVersion,
    peerRange: `^${major}.0.0`,
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
  changes.push(
    `tools/solid-matrix.json: window all ${stableVersion}, compiler ${compilerVersion}, peerRange ^${major}.0.0 (was window ${matrix.window.low}/${matrix.window.mid}/${matrix.window.high}, compiler ${matrix.compiler})`,
  )
  if (!dryRun) writeFileSync(matrixPath, JSON.stringify(nextMatrix, null, 2) + "\n")

  // 2. pnpm-workspace.yaml — catalog floors and overrides, block-scoped.
  const workspace = readFileSync(workspacePath, "utf8")
  const [catalogStart, catalogEnd] = blockRange(workspace, "catalog:")
  const [overridesStart, overridesEnd] = blockRange(workspace, "overrides:")
  const floor = `>=${major}.0.0 <${Number(major) + 1}.0.0`
  let nextCatalog = workspace.slice(catalogStart, catalogEnd)
  for (const pkg of RUNTIME_PACKAGES) nextCatalog = pin(nextCatalog, pkg, floor, "catalog:")
  let nextOverrides = workspace.slice(overridesStart, overridesEnd)
  for (const pkg of RUNTIME_PACKAGES)
    nextOverrides = pin(nextOverrides, pkg, stableVersion, "overrides:")
  nextOverrides = pin(nextOverrides, COMPILER_PACKAGE, compilerVersion, "overrides:")
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
  changes.push(
    `pnpm-workspace.yaml: catalog ${floor}, overrides ${stableVersion} + ${COMPILER_PACKAGE} ${compilerVersion}`,
  )
  if (!dryRun) writeFileSync(workspacePath, assembled)

  // 3. Root devDependencies.
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
  for (const name of RUNTIME_PACKAGES) {
    if (pkg.devDependencies?.[name]) pkg.devDependencies[name] = stableVersion
  }
  changes.push(`package.json: devDependencies ${RUNTIME_PACKAGES.join(", ")} -> ${stableVersion}`)
  if (!dryRun) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

  // 4. Manual follow-ups the script cannot verify away.
  changes.push("MANUAL: pnpm install --no-frozen-lockfile, then run the full verification suite")
  changes.push(
    "MANUAL: nightly.yml solid-tier matrix now collapses to one version; drop the tier dimension once a stable window exists",
  )
  changes.push(
    "MANUAL: no changeset `next` channel exists (release pipeline uses dist-tags) and no beta compat code exists in sources — nothing to remove for either",
  )

  // 5. Regenerate the lockfile so the transition lands installable (pnpm
  //    refuses a stale lockfile against changed overrides in frozen mode).
  if (!dryRun) {
    execFileSync("pnpm", ["install", "--no-frozen-lockfile"], {
      cwd: ROOT,
      stdio: "inherit",
    })
    changes.push("lockfile: regenerated via pnpm install --no-frozen-lockfile")
  }

  return changes
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const version = process.argv[2]
  if (!version || version.startsWith("--")) {
    console.error("Usage: npx tsx scripts/solid2-stable-transition.mts <stable-version>")
    console.error("Example: npx tsx scripts/solid2-stable-transition.mts 2.0.0")
    process.exit(1)
  }
  try {
    const changes = await transitionToSolid2Stable({
      stableVersion: version,
      dryRun: process.argv.includes("--dry-run"),
    })
    console.log(
      `Solid 2 stable transition${process.argv.includes("--dry-run") ? " (DRY RUN)" : ""}:`,
    )
    for (const c of changes) console.log(`  • ${c}`)
  } catch (err) {
    console.error(`solid2-stable-transition: ${(err as Error).message}`)
    process.exit(1)
  }
}
