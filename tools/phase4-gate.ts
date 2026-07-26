/**
 * Phase 4 acceptance-criteria gate — STABLE/GA release gate.
 *
 * Verifies Phase 4 exit criteria for a stable v1.0 release after Solid 2
 * reaches GA. This gate requires the beta gate (Phase 3) to pass first,
 * then asserts stable-only criteria: GA Solid 2, external accessibility
 * audit, full AT records, stable semver on all packages, release evidence,
 * passing acceptance criteria, and finalized legacy sunset dates.
 *
 * Run via: pnpm exec tsx tools/phase4-gate.ts
 */

import { readdirSync } from "node:fs"
import { join } from "node:path"
import { check, summarize, run, fileExists, readJSON, ROOT } from "./gate-helpers"

console.log("Phase 4 Acceptance Gate (Stable/GA Release)\n")

// ─── §0 Phase 3 (beta) gate must pass ──────────────────────────────────
console.log("§0 Lower-phase gate:")
const p3 = run("pnpm exec tsx tools/phase3-gate.ts")
check("Phase 3 (beta) gate passes", p3.ok, "Phase 3 must pass before Phase 4")

// ─── §1 Solid 2 GA ─────────────────────────────────────────────────────
console.log("\n§1 Solid 2 GA:")
const rootPkg = readJSON<Record<string, any>>("package.json")
const solidVersion =
  rootPkg?.devDependencies?.["solid-js"] ?? rootPkg?.dependencies?.["solid-js"] ?? ""
check(
  "solid-js is not beta/alpha/experimental",
  !solidVersion.includes("beta") &&
    !solidVersion.includes("alpha") &&
    !solidVersion.includes("experimental"),
  `Current: ${solidVersion}. Must be stable semver for GA release.`,
)

// ─── §2 External accessibility audit ───────────────────────────────────
console.log("\n§2 External accessibility audit:")
check(
  "external audit report exists",
  fileExists("docs/accessibility-audit-report.md"),
  "An external accessibility audit report is required for GA",
)

// ─── §3 Full AT records ────────────────────────────────────────────────
console.log("\n§3 Full AT records:")
check(
  "AT audit results directory exists",
  fileExists("docs/at-audit-results"),
  "docs/at-audit-results/ must contain per-primitive AT records",
)

// Verify directory has per-primitive records (not just empty)
const atDir = join(ROOT, "docs/at-audit-results")
let atRecordCount = 0
try {
  atRecordCount = readdirSync(atDir).filter((f) => f.endsWith(".md")).length
} catch {
  /* directory missing — counted as 0 */
}

check(
  `AT results contain per-primitive records (found ${atRecordCount})`,
  atRecordCount >= 10,
  "At least 10 per-primitive AT audit records expected",
)

// ─── §4 Stable versions ────────────────────────────────────────────────
console.log("\n§4 Stable versions:")
const packagesDir = join(ROOT, "packages")
const pkgDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let stableOk = true
const violations: string[] = []

for (const dir of pkgDirs) {
  const pkgJson = readJSON<Record<string, any>>(`packages/${dir}/package.json`)
  if (!pkgJson) continue
  if (pkgJson.private) continue

  const version: string = pkgJson.version ?? ""
  const hasPrerelease = /-(alpha|beta|next|rc|canary|experimental)/.test(version)
  if (hasPrerelease) {
    stableOk = false
    violations.push(`${pkgJson.name}@${version}`)
  }
}

check(
  "all public packages have stable semver",
  stableOk,
  violations.length > 0
    ? `Prerelease versions found: ${violations.slice(0, 5).join(", ")}`
    : undefined,
)

// ─── §5 Release evidence ───────────────────────────────────────────────
console.log("\n§5 Release evidence:")
check(
  "CHANGELOG.md or release notes exist",
  fileExists("CHANGELOG.md") || fileExists("docs/release-notes-v1.md"),
  "Release notes must document the stable release",
)

// ─── §6 Full acceptance criteria pass ──────────────────────────────────
console.log("\n§6 Acceptance criteria:")
check("acceptance-criteria.ts exists", fileExists("tools/acceptance-criteria.ts"))
const acResult = run("pnpm exec tsx tools/acceptance-criteria.ts")
check(
  "acceptance criteria script passes",
  acResult.ok,
  "All automated acceptance criteria must pass for GA",
)

// ─── §7 Legacy sunset dates ────────────────────────────────────────────
console.log("\n§7 Legacy sunset dates:")
check("legacy facade exists", fileExists("legacy/shadcn-solid-dialog/package.json"))
const legacyPkg = readJSON<Record<string, any>>("legacy/shadcn-solid-dialog/package.json")
check(
  "legacy has deprecated date",
  !!legacyPkg?.solidiom?.sunset?.deprecated,
  "Sunset metadata must include a deprecated date",
)
check(
  "legacy has removed date",
  !!legacyPkg?.solidiom?.sunset?.removed,
  "Sunset metadata must include a removed date",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 4 Gate (Stable/GA)")
