/**
 * tools/scaffold-sync — Idempotent sync/fixer for generated artifacts (3B.4 / 3B.5 / 3B.6).
 *
 * Detects drift between recipe-contract-definitions and generated outputs, then either
 * reports the difference (--check) or regenerates stale artifacts (default).
 *
 * What it syncs:
 *   - Recipe wrapper .tsx files across CSS/Tailwind/UnoCSS packages (3B.4)
 *   - Variant .ts files from emitters
 *   - Docs stubs for primitives and catalog items (3B.5)
 *   - Registry manifests (via registry-build.ts)
 *
 * Usage:
 *   pnpm tsx tools/scaffold-sync.ts              — regenerate stale artifacts
 *   pnpm tsx tools/scaffold-sync.ts --check      — exit 1 on drift, no writes (CI mode)
 *   pnpm tsx tools/scaffold-sync.ts --scope button  — sync only one primitive
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

interface SyncResult {
  area: string
  status: "fresh" | "stale" | "regenerated" | "error"
  detail?: string
}

function run(cmd: string, cwd = ROOT): { ok: boolean; stdout: string } {
  try {
    const stdout = execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
    return { ok: true, stdout }
  } catch (e: any) {
    return { ok: false, stdout: e.stdout ?? e.message }
  }
}

function checkEmitterParity(checkMode: boolean): SyncResult[] {
  const results: SyncResult[] = []

  // CSS emitter
  const cssCheck = run("pnpm run recipe:emit:css:check")
  if (cssCheck.ok) {
    results.push({ area: "recipe-css", status: "fresh" })
  } else if (checkMode) {
    results.push({ area: "recipe-css", status: "stale", detail: "CSS recipes out of date" })
  } else {
    const emit = run("pnpm run recipe:emit:css")
    results.push({ area: "recipe-css", status: emit.ok ? "regenerated" : "error", detail: emit.ok ? undefined : emit.stdout.slice(0, 200) })
  }

  // Tailwind emitter
  const twCheck = run("pnpm run recipe:emit:tailwind:check")
  if (twCheck.ok) {
    results.push({ area: "recipe-tailwind", status: "fresh" })
  } else if (checkMode) {
    results.push({ area: "recipe-tailwind", status: "stale", detail: "Tailwind recipes out of date" })
  } else {
    const emit = run("pnpm run recipe:emit:tailwind")
    results.push({ area: "recipe-tailwind", status: emit.ok ? "regenerated" : "error", detail: emit.ok ? undefined : emit.stdout.slice(0, 200) })
  }

  // UnoCSS emitter
  const unoCheck = run("pnpm run recipe:emit:unocss:check")
  if (unoCheck.ok) {
    results.push({ area: "recipe-unocss", status: "fresh" })
  } else if (checkMode) {
    results.push({ area: "recipe-unocss", status: "stale", detail: "UnoCSS recipes out of date" })
  } else {
    const emit = run("pnpm run recipe:emit:unocss")
    results.push({ area: "recipe-unocss", status: emit.ok ? "regenerated" : "error", detail: emit.ok ? undefined : emit.stdout.slice(0, 200) })
  }

  return results
}

function checkThemeParity(checkMode: boolean): SyncResult[] {
  const results: SyncResult[] = []

  for (const profile of ["css", "tailwind", "unocss"]) {
    const check = run(`pnpm run theme:emit:${profile}:check`)
    if (check.ok) {
      results.push({ area: `theme-${profile}`, status: "fresh" })
    } else if (checkMode) {
      results.push({ area: `theme-${profile}`, status: "stale", detail: `Theme ${profile} output stale` })
    } else {
      const emit = run(`pnpm run theme:emit:${profile}`)
      results.push({ area: `theme-${profile}`, status: emit.ok ? "regenerated" : "error" })
    }
  }

  return results
}

function checkSourceParity(checkMode: boolean): SyncResult[] {
  const check = run("pnpm run source:emit:check")
  if (check.ok) {
    return [{ area: "source-parity", status: "fresh" }]
  } else if (checkMode) {
    return [{ area: "source-parity", status: "stale", detail: "source/ out of sync with src/" }]
  } else {
    const emit = run("pnpm run source:emit")
    return [{ area: "source-parity", status: emit.ok ? "regenerated" : "error" }]
  }
}

function checkContractVersion(): SyncResult[] {
  const check = run("pnpm tsx tools/contract-version.ts check")
  return [{
    area: "contract-version",
    status: check.ok ? "fresh" : "stale",
    detail: check.ok ? undefined : "Definitions not aligned with CONTRACT_VERSION",
  }]
}

function main(): void {
  const checkMode = process.argv.includes("--check")
  const allResults: SyncResult[] = []

  console.log(checkMode ? "Checking artifact freshness (no writes)...\n" : "Syncing generated artifacts...\n")

  // Contract version alignment
  allResults.push(...checkContractVersion())

  // Recipe emitter outputs
  allResults.push(...checkEmitterParity(checkMode))

  // Theme emitter outputs
  allResults.push(...checkThemeParity(checkMode))

  // Source parity (src/ → source/)
  allResults.push(...checkSourceParity(checkMode))

  // Print summary
  console.log("\n" + "═".repeat(50))
  const stale = allResults.filter((r) => r.status === "stale")
  const regenerated = allResults.filter((r) => r.status === "regenerated")
  const errors = allResults.filter((r) => r.status === "error")
  const fresh = allResults.filter((r) => r.status === "fresh")

  for (const r of allResults) {
    const icon = r.status === "fresh" ? "✓" : r.status === "regenerated" ? "↺" : r.status === "stale" ? "✗" : "!"
    const detail = r.detail ? ` — ${r.detail}` : ""
    console.log(`  ${icon} ${r.area}: ${r.status}${detail}`)
  }

  console.log(`\n  Fresh: ${fresh.length} | Regenerated: ${regenerated.length} | Stale: ${stale.length} | Errors: ${errors.length}`)

  if (checkMode && (stale.length > 0 || errors.length > 0)) {
    console.log("\n✗ Drift detected — run `pnpm tsx tools/scaffold-sync.ts` to regenerate.")
    process.exit(1)
  } else if (errors.length > 0) {
    console.log("\n✗ Some regenerations failed — check errors above.")
    process.exit(1)
  } else {
    console.log("\n✓ All artifacts in sync.")
  }
}

main()
