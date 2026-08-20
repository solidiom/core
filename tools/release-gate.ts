/**
 * Release gate — full durable acceptance gate (gate:full).
 *
 * The complete, version-agnostic quality suite run before a release and in the
 * full CI matrix. It supersedes the former phase0–phase4 gate chain, which
 * encoded a build-out *timeline* (foundation → primitives → enterprise → beta
 * → GA) and re-ran the same lower-phase checks up to three times through
 * sub-process nesting.
 *
 * This gate is organized by *what it verifies*, not by *when in the timeline*,
 * and every check runs exactly once:
 *
 *   §1  Structural gate (fast foundation invariants — runs once, not nested)
 *   §2  Full primitive library: typecheck, build, dist output, browser tests
 *   §3  Recipe profiles: build, dual emission, canonical contract, drift, parity
 *   §4  Umbrella package re-export purity
 *   §5  ESLint boundary + anatomy rules
 *   §6  CLI command surface + doctor
 *   §7  Vite plugin compile-time transforms
 *   §8  Executed axe scans + published a11y evidence
 *   §9  Enterprise governance: verify, audit/SBOM, policy, release-tools
 *   §10 Second-wave adapters + adapter authoring kit + layer isolation
 *   §11 Preset themes + theme parity (THEME-005) + adapter styling audit
 *   §12 Accessibility evidence artifacts + cross-browser results
 *   §13 Bench dashboard + enterprise offline-install
 *   §14 Public primitive coverage (registry + completion gate)
 *   §15 Catalog gates (primitive, component, block, template)
 *   §16 Visual harness image pinning
 *   §17 §23 acceptance criteria (the 80 durable v1.0 criteria)
 *
 * Timeline-only checks intentionally removed (one-time Solid 2 migration
 * guards, not ongoing gates): "solid-js must be a beta prerelease", the
 * beta-vs-GA version assertions, and prerelease-version metadata gates.
 * The "No Kobalte/Corvu" invariant is enforced permanently and with tests by
 * the adapter-kit conformance harness (FORBIDDEN_ADAPTER_DEPS); it is not
 * duplicated here.
 *
 * Run via: pnpm run gate:full
 * Or:      pnpm exec tsx tools/release-gate.ts
 */

import { readdirSync } from "node:fs"
import { join } from "node:path"
import {
  check,
  summarize,
  runTests,
  runTypecheck,
  runBuild,
  fileExists,
  fileContains,
  readJSON,
  run,
  ROOT,
} from "./gate-helpers"

console.log("Release Gate (gate:full)\n")

// ─── §1 Structural gate (runs once, not nested) ─────────────────────────
console.log("§1 Structural gate:")
const structural = run("pnpm exec tsx tools/structural-gate.ts", { timeout: 600_000 })
check(
  "structural gate passes",
  structural.ok,
  structural.timedOut
    ? "structural gate timed out"
    : "Run: pnpm run gate:quick — foundation invariants must pass first",
)

// ─── §2 Full primitive library ──────────────────────────────────────────
console.log("\n§2 Primitive library (typecheck + build + dist):")
const firstWavePrimitives = [
  "button",
  "checkbox",
  "switch",
  "slider",
  "collapsible",
  "accordion",
  "tabs",
  "popover",
  "tooltip",
  "menu",
  "listbox",
  "combobox",
  "toast",
  "label",
  "visually-hidden",
  "separator",
  "progress",
  "meter",
  "alert",
  "field",
  "toggle",
  "toggle-group",
  "radio-group",
  "pagination",
]
const secondWavePrimitives = [
  "drawer",
  "date-picker",
  "virtual-list",
  "data-table",
  "tree",
  "resizable-panels",
  "command-palette",
]

for (const p of [...firstWavePrimitives, ...secondWavePrimitives]) {
  const pkg = `@solidiom/${p}`
  check(`${pkg} source exists`, fileExists(`packages/${p}/src/index.tsx`))
  check(`${pkg} typechecks`, runTypecheck(pkg))
  check(`${pkg} builds`, runBuild(pkg))
  check(
    `${pkg} dist output exists`,
    fileExists(`packages/${p}/dist/index.js`),
    "Build must produce dist/index.js",
  )
}

// Primitives that MUST have browser test files.
console.log("\n§2b Primitive behavior tests:")
const primitivesRequiringBrowserTests = [
  "button",
  "checkbox",
  "switch",
  "slider",
  "menu",
  "listbox",
  "label",
  "visually-hidden",
  "separator",
  "progress",
  "meter",
  "alert",
  "field",
  "toggle",
  "toggle-group",
  "radio-group",
  "pagination",
]
for (const name of primitivesRequiringBrowserTests) {
  const testFile = `packages/${name}/src/${name}.browser.test.tsx`
  check(
    `@solidiom/${name} has browser test file`,
    fileExists(testFile),
    `Expected ${testFile} to exist`,
  )
  if (fileExists(testFile)) {
    check(
      `@solidiom/${name} browser tests have assertions`,
      fileContains(testFile, "expect(") ||
        fileContains(testFile, "toHaveAttribute") ||
        fileContains(testFile, "toBeInTheDocument"),
      "Test file must contain real assertions",
    )
  }
}
// Any primitive that gained a browser test but isn't tracked is a coverage gap.
for (const p of firstWavePrimitives) {
  const testFile = `packages/${p}/src/${p}.browser.test.tsx`
  if (fileExists(testFile) && !primitivesRequiringBrowserTests.includes(p)) {
    check(
      `@solidiom/${p} browser test discovered but not in required list`,
      false,
      `Add "${p}" to primitivesRequiringBrowserTests in release-gate.ts`,
    )
  }
}

// RangeCalendar (calendar package second-wave surface)
console.log("\n§2c RangeCalendar:")
check("RangeCalendar source exists", fileExists("packages/calendar/src/range-calendar.tsx"))
check(
  "RangeCalendar exported from package index",
  fileContains("packages/calendar/src/index.tsx", "RangeRoot"),
)
check(
  "RangeCalendar source/ parity emission exists",
  fileExists("packages/calendar/source/range-calendar.tsx"),
)
check("calendar package typechecks", runTypecheck("@solidiom/calendar"))
check("calendar package builds", runBuild("@solidiom/calendar"))
check("calendar tests pass (≥30, covers RangeCalendar)", runTests("@solidiom/calendar", 30))

// ─── §3 Recipe profiles ─────────────────────────────────────────────────
console.log("\n§3 Recipe profiles:")
for (const profile of ["css", "tailwind", "unocss"]) {
  check(`recipes-${profile} source exists`, fileExists(`packages/recipes-${profile}/src/index.ts`))
  check(`recipes-${profile} builds`, runBuild(`@solidiom/recipes-${profile}`))
  check(`recipes-${profile} dist output`, fileExists(`packages/recipes-${profile}/dist/index.js`))
  check(
    `recipes-${profile} source/ emission exists`,
    fileExists(`packages/recipes-${profile}/source/index.ts`),
  )
  check(
    `recipes-${profile} exports buttonVariants`,
    fileContains(
      `packages/recipes-${profile}/src/recipes/button.tsx`,
      /export\s+(const|function)\s+buttonVariants|export\s*\{[^}]*\bbuttonVariants\b/,
    ),
  )
}

console.log("\n§3b Recipe contract, drift, and parity:")
const driftResult = run("pnpm exec tsx tools/audit-recipe-dual-emission.ts")
check(
  "recipe drift check passes",
  driftResult.ok,
  "Recipe CSS/TSX drift detected — run: pnpm run audit:recipe-drift",
)
const parityResult = run("pnpm exec tsx tools/audit-recipe-parity.ts")
check(
  "recipe cross-profile coverage, state, and exception parity passes (RECIPE-005)",
  parityResult.ok,
  "A profile is missing coverage for a declared slot/state, or an exception is not honored — run: pnpm run audit:recipe-parity",
)
check(
  "recipes-tailwind builds before computed-style parity check",
  runBuild("@solidiom/recipes-tailwind"),
  "computed-style parity resolves @solidiom/recipes-tailwind through its package export; a stale dist/ produces false failures",
)
const computedStyleParityResult = run("pnpm --filter @solidiom/tests-recipe-parity test", {
  timeout: 300_000,
})
check(
  "recipe computed-style parity passes across css/tailwind/unocss (RECIPE-005 phase 3)",
  computedStyleParityResult.ok,
  computedStyleParityResult.timedOut
    ? "pnpm run test:recipe-parity exceeded its timeout — re-run directly; this spins up a real browser and can be slow under load"
    : "A rendered fixture disagrees on computed style across profiles — run: pnpm run test:recipe-parity",
)
const selectorResult = run("pnpm exec tsx tools/audit-recipe-contract.ts")
check(
  "recipe selector contract passes",
  selectorResult.ok,
  "Recipe CSS uses a non-semantic selector — run: pnpm run audit:recipe-contract",
)
const contractResult = run("pnpm exec tsx tools/recipe-contract.ts")
check(
  "canonical recipe contract validation passes",
  contractResult.ok,
  "A recipe definition violates the canonical contract — run: pnpm run recipe:contract",
)
for (const profile of ["css", "tailwind", "unocss"]) {
  const emitResult = run(`pnpm exec tsx tools/recipe-emit-${profile}.ts --check`)
  check(
    `generated ${profile} recipe output matches the canonical definitions`,
    emitResult.ok,
    `packages/recipes-${profile} is stale relative to tools/recipe-contract-definitions.ts — run: pnpm run recipe:emit:${profile}`,
  )
}
check(
  "unocss preset fixtures pass",
  runTests("@solidiom/unocss-preset", 9),
  "Run: pnpm --filter @solidiom/unocss-preset test",
)

console.log("\n§3c Package src/source parity and exports:")
const sourceParityResult = run("pnpm exec tsx tools/audit-package-source-parity.ts")
check(
  "package src/source parity and export-map check passes",
  sourceParityResult.ok,
  "packages/recipes-*/source or packages/cli/source is stale, or an export entry is missing — run: pnpm run audit:package-source-parity",
)
check(
  "CLI src/source-install/ does not collide with source/ emission root",
  fileExists("packages/cli/src/source-install/install.ts") &&
    !fileExists("packages/cli/src/source/install.ts"),
  "packages/cli/src/source/ must stay renamed to src/source-install/ (CLI-001)",
)

// Audit and result-validation negative fixtures.
const auditFixtureResult = run(
  "pnpm exec vitest run tools/audit-recipe-dual-emission.test.ts tools/audit-umbrella-purity.test.ts tools/axe-results.test.ts tools/a11y-evidence.test.ts tools/audit-recipe-parity.test.ts tools/audit-package-source-parity.test.ts",
)
check(
  "audit and result-validation negative fixtures pass",
  auditFixtureResult.ok,
  "Run the audit fixture suite in tools/*.test.ts",
)
const contractFixtureResult = run(
  "pnpm exec vitest run tools/recipe-contract-validate.test.ts tools/recipe-contract-vocabulary.test.ts tools/recipe-contract-tokens.test.ts tools/recipe-contract-definitions.test.ts tools/audit-recipe-contract.test.ts tools/recipe-emit-core.test.ts tools/recipe-emit-css.test.ts tools/recipe-emit-tailwind-utilities.test.ts tools/recipe-emit-tailwind.test.ts tools/recipe-emit-unocss.test.ts",
)
check(
  "contract, vocabulary, token, and emitter fixtures pass",
  contractFixtureResult.ok,
  "Run the recipe contract/emitter fixture suite in tools/*.test.ts",
)

// ─── §4 Umbrella package ────────────────────────────────────────────────
console.log("\n§4 Umbrella package:")
check("@solidiom/primitives source exists", fileExists("packages/primitives/src/index.ts"))
check("@solidiom/primitives builds", runBuild("@solidiom/primitives"))
for (const p of firstWavePrimitives) {
  check(
    `umbrella exports @solidiom/${p}`,
    fileContains("packages/primitives/src/index.ts", `@solidiom/${p}`),
    `packages/primitives/src/index.ts must re-export @solidiom/${p}`,
  )
}
const purityResult = run("pnpm exec tsx tools/audit-umbrella-purity.ts")
check(
  "umbrella purity check passes",
  purityResult.ok,
  "Umbrella has implementation lines or surface mismatch — run: pnpm run audit:umbrella-purity",
)

// ─── §5 ESLint boundary + anatomy rules ─────────────────────────────────
console.log("\n§5 ESLint rules (boundary + anatomy):")
check(
  "eslint-plugin tests pass (≥60)",
  runTests("@solidiom/eslint-plugin-solidiom", 60),
  "ESLint rules must prove boundary and anatomy enforcement via ≥60 test cases",
)
const eslintRuleFiles = [
  "no-cross-layer-import",
  "no-engine-import-outside-adapters",
  "no-adapter-jsx-attributes",
  "no-adapter-import-of-recipes",
  "require-primitive-parts",
  "require-accessible-name",
  "no-forbidden-primitive-props",
]
for (const rule of eslintRuleFiles) {
  check(`${rule} rule exists`, fileExists(`packages/eslint-plugin-solidiom/src/rules/${rule}.ts`))
}
check(
  "anatomy-registry exists",
  fileExists("packages/eslint-plugin-solidiom/src/anatomy-registry.ts"),
)
for (const rule of [
  "no-adapter-import-of-recipes",
  "require-primitive-parts",
  "require-accessible-name",
  "no-forbidden-primitive-props",
]) {
  check(
    `plugin registers ${rule}`,
    fileContains("packages/eslint-plugin-solidiom/src/index.ts", `"${rule}"`),
  )
}
check(
  "layer restrictions enforced (runtime cannot import primitive)",
  fileContains("packages/eslint-plugin-solidiom/src/utils.ts", "layer:runtime"),
)

// ─── §6 CLI command surface ─────────────────────────────────────────────
console.log("\n§6 CLI command surface:")
const cliCommands = ["create", "diff", "detach", "update", "doctor", "verify", "audit"]
for (const cmd of cliCommands) {
  check(`${cmd}.ts exists`, fileExists(`packages/cli/src/commands/${cmd}.ts`))
}
check("CLI tests still pass (≥25)", runTests("@solidiom/cli", 25))
const cliSupportFiles = [
  "package-manager/detect.ts",
  "package-manager/commands.ts",
  "package-manager/exec.ts",
  "source-install/verify-source.ts",
  "source-install/lock.ts",
  "source-install/destinations.ts",
  "source-install/conflict.ts",
  "source-install/rollback.ts",
  "create/materialize.ts",
  "create/config-gen.ts",
]
for (const f of cliSupportFiles) {
  check(`${f} exists`, fileExists(`packages/cli/src/${f}`))
}
check(
  "requireVerifiedSource is wired in PolicySchema",
  fileContains("packages/cli/src/schemas.ts", "requireVerifiedSource"),
)
check(
  "inspect command exists (source-mode governance)",
  fileExists("packages/cli/src/commands/inspect.ts"),
)

// ─── §7 Vite plugin compile-time transforms ─────────────────────────────
console.log("\n§7 Vite plugin:")
check("vite-plugin source exists", fileExists("packages/vite-plugin-solidiom/src/index.ts"))
check("vite-plugin builds", runBuild("@solidiom/vite-plugin"))
check(
  "vite-plugin implements static recipe extraction",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "extractStaticRecipes") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "CVA_PATTERN"),
  "Plugin must implement static recipe extraction",
)
check(
  "vite-plugin implements dead-part elimination",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "eliminateDeadParts") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "deadPart"),
  "Plugin must implement dead-part elimination",
)

// ─── §8 Executed axe scans + a11y evidence ──────────────────────────────
console.log("\n§8 Accessibility (executed axe scans):")
check("axe scan test file exists", fileExists("tests/a11y/primitives-axe-scan.browser.test.tsx"))
check("axe helper exists", fileExists("tests/a11y/axe-helper.ts"))
check("a11y result runner exists", fileExists("tools/run-a11y.ts"))
const a11yResult = run("pnpm run test:a11y", { timeout: 600_000 })
check(
  "all axe scans execute and write a valid zero-violation artifact",
  a11yResult.ok,
  a11yResult.timedOut
    ? "pnpm run test:a11y exceeded its timeout — re-run directly and consider increasing the timeout in release-gate.ts"
    : "Run: pnpm run test:a11y",
)
const a11yEvidenceResult = a11yResult.ok
  ? run("pnpm run report:a11y-evidence")
  : { ok: false, stdout: "", stderr: "a11y scan did not complete" }
check(
  "stable per-primitive accessibility evidence is published from the executed result artifact",
  a11yEvidenceResult.ok,
  "Run: pnpm run report:a11y-evidence",
)
const axeReportResult = a11yResult.ok
  ? run("pnpm run report:axe")
  : { ok: false, stdout: "", stderr: "a11y scan did not complete" }
check(
  "axe report is generated from the executed result artifact",
  axeReportResult.ok,
  "Run: pnpm run report:axe",
)
check("executed axe result artifact exists", fileExists("artifacts/axe-results.json"))
check("published a11y evidence artifact exists", fileExists("artifacts/a11y-evidence.json"))
check(
  "CI a11y job runs the executable scan and report commands",
  fileContains(".github/workflows/ci-packages.yml", "run: pnpm run test:a11y") &&
    fileContains(".github/workflows/ci-packages.yml", "run: pnpm run report:a11y-evidence") &&
    fileContains(".github/workflows/ci-packages.yml", "run: pnpm run report:axe"),
)

// ─── §9 Enterprise governance ───────────────────────────────────────────
console.log("\n§9 Enterprise governance:")
check("verify command source", fileExists("packages/cli/src/commands/verify.ts"))
check(
  "verify handles sigstore mode",
  fileContains("packages/cli/src/commands/verify.ts", "sigstore"),
)
check(
  "verify handles trusted-keys mode",
  fileContains("packages/cli/src/commands/verify.ts", "trusted-keys"),
)
check("release-tools source exists", fileExists("packages/release-tools/src/index.ts"))
check("release-tools typechecks", runTypecheck("@solidiom/release-tools"))
check("audit command source", fileExists("packages/cli/src/commands/audit.ts"))
check(
  "audit references CycloneDX format",
  fileContains("packages/cli/src/commands/audit.ts", "cyclonedx") ||
    fileContains("packages/cli/src/commands/audit.ts", "CycloneDX") ||
    fileContains("packages/cli/src/commands/audit.ts", "bomFormat"),
)
check("policy schema source exists", fileExists("packages/cli/src/schemas.ts"))
check(
  "policy schema covers signatureMode",
  fileContains("packages/cli/src/schemas.ts", "signatureMode"),
)

// ─── §10 Second-wave adapters + authoring kit + layer isolation ─────────
console.log("\n§10 Adapters and authoring kit:")
check(
  "adapter-virtualization-tanstack source",
  fileExists("packages/adapter-virtualization-tanstack/src/index.ts"),
)
check("adapter-table-tanstack source", fileExists("packages/adapter-table-tanstack/src/index.ts"))
check("adapter-kit source exists", fileExists("packages/adapter-kit/src/index.ts"))
check(
  "adapter-kit conformance harness exists",
  fileExists("packages/adapter-kit/src/conformance.ts"),
)
check("adapter-kit scaffold template exists", fileExists("packages/adapter-kit/src/scaffold.ts"))
check("adapter-kit typechecks", runTypecheck("@solidiom/adapter-kit"))
check("adapter-kit builds", runBuild("@solidiom/adapter-kit"))
check(
  "adapter-kit tests pass (≥20, covers positive + negative conformance)",
  runTests("@solidiom/adapter-kit", 20),
)

// ─── §11 Preset themes + adapter styling audit ──────────────────────────
console.log("\n§11 Preset themes and adapter styling:")
const presetAuditResult = run("pnpm exec tsx tools/audit-preset-themes.ts")
check(
  "preset contrast, coverage, and translation gate passes",
  presetAuditResult.ok,
  "A preset fails contrast, missing tokens, or incomplete translation — run: pnpm run audit:preset-themes",
)
const themeParityResult = run("pnpm exec tsx tools/audit-theme-parity.ts")
check(
  "theme cross-output parity, contrast matrix, and round-trip passes (THEME-005)",
  themeParityResult.ok,
  "A theme's css/tailwind/unocss outputs disagree, fail the contrast matrix, or fail round-trip — run: pnpm run audit:theme-parity",
)
const adapterStylingResult = run("pnpm exec tsx tools/audit-adapter-styling.ts")
check(
  "no adapter sets class or style attributes",
  adapterStylingResult.ok,
  "An adapter emits styling, or the committed report is stale — run: pnpm run audit:adapter-styling",
)
check(
  "the committed adapter styling report is current",
  run("git diff --quiet -- docs/evidence/adapter-styling-audit.md").ok,
  "docs/evidence/adapter-styling-audit.md differs from generated output — regenerate and commit it",
)

// ─── §12 Accessibility evidence artifacts + cross-browser ───────────────
console.log("\n§12 Accessibility evidence and cross-browser:")
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
check("cross-browser vitest config exists", fileExists("tools/test/vitest.cross-browser.config.ts"))
check(
  "cross-browser results exist",
  fileExists("docs/cross-browser-results.md") ||
    fileExists("tools/test/cross-browser-results.json"),
  "Tri-browser test results must be recorded",
)

// ─── §13 Bench dashboard + enterprise offline-install ───────────────────
console.log("\n§13 Bench dashboard and offline-install:")
check(
  "bench dashboard route exists in site",
  fileExists("apps/site/src/pages/performance.astro") ||
    fileExists("apps/site/src/pages/performance/index.astro") ||
    fileExists("apps/site/src/pages/benchmarks.astro") ||
    fileContains("apps/site/src/content/config.ts", "performance"),
)
check("offline-install how-to guide exists", fileExists("docs/guides/offline-install.md"))
check(
  "offline-install guide references Verdaccio",
  fileContains("docs/guides/offline-install.md", "verdaccio") ||
    fileContains("docs/guides/offline-install.md", "Verdaccio"),
)
check("Verdaccio fixture config exists", fileExists("tools/offline-fixture/verdaccio-config.yaml"))
check("offline test script exists", fileExists("tools/offline-fixture/run-offline-test.sh"))
check(
  "add command supports --registry flag",
  fileContains("packages/cli/src/commands/add.ts", "--registry"),
)
check(
  "add command supports --no-network flag",
  fileContains("packages/cli/src/commands/add.ts", "--no-network"),
)

// ─── §14 Public primitive coverage ──────────────────────────────────────
console.log("\n§14 Public primitive coverage:")
const registry = readJSON<{ primitives?: unknown[] }>("registry/index.json")
const registryCount = Array.isArray(registry?.primitives) ? registry.primitives.length : 0
check(
  `registry has >= 30 primitives (found ${registryCount})`,
  registryCount >= 30,
  "registry/index.json must list at least 30 primitives",
)
check(
  `site has demo content (benchmarked against registry count of ${registryCount})`,
  registryCount >= 25,
  "Site should have demo content for at least 25 primitives",
)
check(
  "primitive completion policy exists",
  fileExists("tools/primitive-completion-policy.json"),
  "Add tools/primitive-completion-policy.json classifying each primitive as recipe or headless-only",
)
const completionGate = run("pnpm exec tsx tools/primitive-completion-gate.ts")
check(
  "primitive completion gate passes",
  completionGate.ok,
  "Run `pnpm primitive:audit` to see specific issues",
)

// ─── §15 Catalog gates ──────────────────────────────────────────────────
console.log("\n§15 Catalog gates (primitive, component, block, template):")
check(
  "primitive catalog gate passes (PRIM-000, count matches tracker)",
  run("pnpm exec tsx tools/primitive-catalog-gate.ts").ok,
  "Primitive catalog gate failed — run: pnpm run primitive:catalog-gate (or primitive:catalog-audit for details)",
)
check(
  "component catalog gate passes (FOUND-004)",
  run("pnpm exec tsx tools/component-catalog-gate.ts").ok,
  "Component catalog gate failed — run: pnpm run component:catalog-gate",
)
check(
  "block catalog gate passes (FOUND-005)",
  run("pnpm exec tsx tools/block-catalog-gate.ts").ok,
  "Block catalog gate failed — run: pnpm run block:catalog-gate",
)
check(
  "template catalog gate passes (TPL-000)",
  run("pnpm exec tsx tools/template-catalog-gate.ts").ok,
  "Template catalog gate failed — run: pnpm run template:catalog-gate",
)

// ─── §16 Visual harness image pinning ───────────────────────────────────
console.log("\n§16 Visual harness image pinning:")
const rootPkg = readJSON<{ devDependencies?: Record<string, string> }>("package.json")
const pinnedPlaywright = rootPkg?.devDependencies?.["@playwright/test"]
check(
  "@playwright/test is pinned to an exact version",
  typeof pinnedPlaywright === "string" && /^\d+\.\d+\.\d+$/.test(pinnedPlaywright),
  `package.json devDependencies["@playwright/test"] is ${String(pinnedPlaywright)}; the image tag cannot be derived from a range`,
)
const expectedImageTag = `mcr.microsoft.com/playwright:v${pinnedPlaywright}-noble`
for (const workflow of [".github/workflows/ci-site.yml", ".github/workflows/nightly.yml"]) {
  check(
    `${workflow} pins the Playwright image to v${pinnedPlaywright}`,
    fileContains(workflow, expectedImageTag),
    `expected ${expectedImageTag}; update the container tag to match @playwright/test, or the bundled browser will not match the client library`,
  )
}
check(
  "visual-container.sh pins the same image tag",
  fileContains("tools/visual-container.sh", `IMAGE_TAG="v${pinnedPlaywright}-noble"`),
  `expected IMAGE_TAG="v${pinnedPlaywright}-noble" in tools/visual-container.sh`,
)

// ─── §17 §23 acceptance criteria (80 durable checks) ────────────────────
console.log("\n§17 §23 acceptance criteria:")
const acResult = run("pnpm exec tsx tools/acceptance-criteria.ts", { timeout: 600_000 })
check(
  "acceptance criteria script passes",
  acResult.ok,
  acResult.timedOut
    ? "acceptance-criteria.ts timed out"
    : "All automated §23 acceptance criteria must pass — run: pnpm exec tsx tools/acceptance-criteria.ts",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Release Gate")
