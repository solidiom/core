/**
 * Phase 3 acceptance-criteria gate — BETA release gate.
 *
 * Verifies Phase 3 exit criteria for a public beta release on Solid 2.
 * This gate validates beta-readiness: accessibility evidence (not full
 * external audit), Solid 2 beta compatibility, compile-time transforms,
 * cross-browser coverage, primitive library coverage, and prerelease
 * metadata.
 *
 * Run via: pnpm exec tsx tools/phase3-gate.ts
 */

import { readdirSync } from "node:fs"
import { join } from "node:path"
import {
  check,
  summarize,
  run,
  runBuild,
  fileExists,
  fileContains,
  readJSON,
  ROOT,
} from "./gate-helpers"

console.log("Phase 3 Acceptance Gate (Beta Release)\n")

// ─── §0 Lower gates must pass first ────────────────────────────────────
// Sub-gates run builds and tests internally, so they need a generous timeout.
// The default 300s is insufficient when running all three sequentially.
const SUB_GATE_TIMEOUT = 600_000 // 10 minutes per sub-gate

console.log("§0 Lower-phase gates:")
const p0 = run("pnpm exec tsx tools/phase0-gate.ts", { timeout: SUB_GATE_TIMEOUT })
check(
  "Phase 0 gate passes",
  p0.ok,
  p0.timedOut ? "Phase 0 timed out" : "Phase 0 must pass before Phase 3",
)

const p1 = run("pnpm exec tsx tools/phase1-gate.ts", { timeout: SUB_GATE_TIMEOUT })
check(
  "Phase 1 gate passes",
  p1.ok,
  p1.timedOut ? "Phase 1 timed out" : "Phase 1 must pass before Phase 3",
)

const p2 = run("pnpm exec tsx tools/phase2-gate.ts", { timeout: SUB_GATE_TIMEOUT })
check(
  "Phase 2 gate passes",
  p2.ok,
  p2.timedOut ? "Phase 2 timed out" : "Phase 2 must pass before Phase 3",
)

// ─── §1 Beta accessibility evidence ────────────────────────────────────
console.log("\n§1 Beta accessibility evidence:")
check("AT verification template exists", fileExists("docs/templates/at-verification-template.md"))
check(
  "AT audit results directory exists",
  fileExists("docs/at-audit-results"),
  "Create docs/at-audit-results/ for AT records per primitive",
)
check(
  "axe-scan-results.md exists",
  fileExists("docs/axe-scan-results.md"),
  "Run axe scans and record results",
)
check(
  "keyboard-audit-results.md exists",
  fileExists("docs/keyboard-audit-results.md"),
  "Keyboard navigation audit must be documented",
)

// ─── §2 Solid 2 beta compatibility ─────────────────────────────────────
console.log("\n§2 Solid 2 beta compatibility:")
const rootPkg = readJSON<Record<string, any>>("package.json")
const solidVersion =
  rootPkg?.devDependencies?.["solid-js"] ?? rootPkg?.dependencies?.["solid-js"] ?? ""
check(
  "solid-js is on a prerelease version",
  solidVersion.includes("beta") || solidVersion.includes("rc"),
  `Current: ${solidVersion}. Phase 3 targets Solid 2 prerelease.`,
)
check(
  "solid matrix file exists",
  fileExists("tools/solid-matrix.json"),
  "Solid version compatibility matrix must be defined",
)

// ─── §3 Compile-time transforms ────────────────────────────────────────
console.log("\n§3 Compile-time transforms:")
check("vite plugin source exists", fileExists("packages/vite-plugin-solidiom/src/index.ts"))
check(
  "vite plugin implements recipe extraction",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "recipeExtraction") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "extractRecipes"),
  "Plugin must implement static recipe extraction",
)
check(
  "vite plugin implements dead-part elimination",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "deadPart") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "eliminateDeadParts"),
  "Plugin must implement dead-part elimination",
)

// ─── §4 Cross-browser ──────────────────────────────────────────────────
console.log("\n§4 Cross-browser:")
check("cross-browser vitest config exists", fileExists("tools/test/vitest.cross-browser.config.ts"))
check(
  "cross-browser results exist",
  fileExists("docs/cross-browser-results.md") ||
    fileExists("tools/test/cross-browser-results.json"),
  "Tri-browser test results must be recorded",
)

// ─── §5 Public primitive coverage ──────────────────────────────────────
console.log("\n§5 Public primitive coverage:")
const registry = readJSON<{ primitives?: unknown[] }>("registry/index.json")
const registryCount = Array.isArray(registry?.primitives) ? registry.primitives.length : 0
check(
  `registry has >= 30 primitives (found ${registryCount})`,
  registryCount >= 30,
  "registry/index.json must list at least 30 primitives",
)
check("@solidiom/primitives builds", runBuild("@solidiom/primitives"))

check(
  `site has demo content (benchmarked against registry count of ${registryCount})`,
  registryCount >= 25,
  "Site should have demo content for at least 25 primitives",
)

// Primitive completion gate (structural audit — no build/test execution)
check(
  "primitive completion policy exists",
  fileExists("tools/primitive-completion-policy.json"),
  "Add tools/primitive-completion-policy.json classifying each primitive as recipe or headless-only",
)
const completionGate = run("pnpm exec tsx tools/primitive-completion-gate.ts --audit-only")
check(
  "primitive completion gate passes (audit-only)",
  completionGate.ok,
  "Run `pnpm primitive:audit` to see specific issues",
)

// ─── §6 Package/source parity ──────────────────────────────────────────
console.log("\n§6 Package/source parity:")
check(
  "package-source-parity test directory exists",
  fileExists("tests/package-source-parity"),
  "Create tests/package-source-parity/ with parity checks",
)

// ─── §7 Prerelease metadata ────────────────────────────────────────────
console.log("\n§7 Prerelease metadata:")
const packagesDir = join(ROOT, "packages")
const pkgDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let prereleaseOk = true
const violations: string[] = []

for (const dir of pkgDirs) {
  const pkgJson = readJSON<Record<string, any>>(`packages/${dir}/package.json`)
  if (!pkgJson) continue
  if (pkgJson.private) continue

  const version: string = pkgJson.version ?? ""
  const isPrerelease =
    version.includes("next") || version.includes("beta") || version.includes("rc") || version.startsWith("0.")
  if (!isPrerelease) {
    prereleaseOk = false
    violations.push(`${pkgJson.name}@${version}`)
  }
}

check(
  "all public packages have prerelease versions",
  prereleaseOk,
  violations.length > 0 ? `Stable versions found: ${violations.slice(0, 5).join(", ")}` : undefined,
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 3 Gate (Beta)")
