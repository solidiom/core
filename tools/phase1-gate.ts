/**
 * Phase 1 acceptance-criteria gate (hardened).
 *
 * Verifies Phase 1 exit criteria:
 * - Every Phase 1 primitive must exist, typecheck, and build.
 * - Primitives with browser test files must have them present and well-formed.
 * - Build output (dist/) must be produced for each primitive.
 * - Recipe packages must build successfully.
 * - ESLint rules must pass their test suite (≥60 tests, covering anatomy rules).
 * - CLI doctor command must exist and CLI tests must pass.
 * - Anatomy/semantics ESLint rules exist and are registered.
 * - no-adapter-import-of-recipes rule exists.
 * - Recipe dual-emission drift check passes.
 * - Umbrella re-export purity check passes.
 * - Axe a11y scan test file covers the full public surface.
 *
 * Run via: pnpm exec tsx tools/phase1-gate.ts
 */

import {
  check,
  summarize,
  runTests,
  runTypecheck,
  runBuild,
  fileExists,
  fileContains,
  run,
} from "./gate-helpers"

console.log("Phase 1 Acceptance Gate (hardened)\n")

// ─── 1. All Phase 1 primitives typecheck and build ──────────────────────
console.log("§1 Phase 1 primitives typecheck + build:")
const p1Primitives = [
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
  // Previously missing — added per P1.6
  "field",
  "toggle",
  "toggle-group",
  "radio-group",
  "pagination",
]

for (const p of p1Primitives) {
  const pkg = `@solidiom/${p}`
  check(`${pkg} source exists`, fileExists(`packages/${p}/src/index.tsx`))
  check(`${pkg} typechecks`, runTypecheck(pkg))
  check(`${pkg} builds`, runBuild(pkg))
  // Verify build actually produced output
  check(
    `${pkg} dist output exists`,
    fileExists(`packages/${p}/dist/index.js`),
    "Build must produce dist/index.js",
  )
}

// ─── 2. Primitives with behavior tests must have them ───────────────────
console.log("\n§2 Primitive behavior tests:")

// Primitives that MUST have browser test files.
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

// Detect any primitive that gained a browser test but isn't in the required list
console.log("\n§2b Coverage enforcement:")
for (const p of p1Primitives) {
  const testFile = `packages/${p}/src/${p}.browser.test.tsx`
  if (fileExists(testFile) && !primitivesRequiringBrowserTests.includes(p)) {
    check(
      `@solidiom/${p} browser test discovered but not in required list`,
      false,
      `Add "${p}" to primitivesRequiringBrowserTests in phase1-gate.ts`,
    )
  }
}
const untrackedTests = p1Primitives.filter(
  (p) =>
    fileExists(`packages/${p}/src/${p}.browser.test.tsx`) &&
    !primitivesRequiringBrowserTests.includes(p),
)
if (untrackedTests.length === 0) {
  check("All browser test files are tracked in required list", true)
}

// ─── 3. Recipe profiles build with output verification ──────────────────
console.log("\n§3 Recipe profiles:")
check("recipes-css source exists", fileExists("packages/recipes-css/src/index.ts"))
check("recipes-tailwind source exists", fileExists("packages/recipes-tailwind/src/index.ts"))
check("recipes-css builds", runBuild("@solidiom/recipes-css"))
check("recipes-tailwind builds", runBuild("@solidiom/recipes-tailwind"))
check("recipes-css dist output", fileExists("packages/recipes-css/dist/index.js"))
check("recipes-tailwind dist output", fileExists("packages/recipes-tailwind/dist/index.js"))

check(
  "recipes-css exports buttonVariants",
  fileContains(
    "packages/recipes-css/src/recipes/button.tsx",
    /export\s+(const|function)\s+buttonVariants/,
  ),
)
check(
  "recipes-tailwind exports buttonVariants",
  fileContains(
    "packages/recipes-tailwind/src/recipes/button.tsx",
    /export\s+(const|function)\s+buttonVariants/,
  ),
)

// ─── 4. Umbrella package ────────────────────────────────────────────────
console.log("\n§4 Umbrella package:")
check("@solidiom/primitives source exists", fileExists("packages/primitives/src/index.ts"))
check("@solidiom/primitives builds", runBuild("@solidiom/primitives"))

for (const p of p1Primitives) {
  check(
    `umbrella exports @solidiom/${p}`,
    fileContains("packages/primitives/src/index.ts", `@solidiom/${p}`),
    `packages/primitives/src/index.ts must re-export @solidiom/${p}`,
  )
}

// ─── 5. ESLint boundary + anatomy rules ─────────────────────────────────
console.log("\n§5 ESLint rules (boundary + anatomy):")
check(
  "eslint-plugin tests pass (≥60)",
  runTests("@solidiom/eslint-plugin-solidiom", 60),
  "ESLint rules must prove boundary and anatomy enforcement via ≥60 test cases",
)

// Boundary rules
check(
  "no-cross-layer-import rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-cross-layer-import.ts"),
)
check(
  "no-engine-import-outside-adapters rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-engine-import-outside-adapters.ts"),
)
check(
  "no-adapter-jsx-attributes rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-adapter-jsx-attributes.ts"),
)

// P1.2: Task 28 named rule
check(
  "no-adapter-import-of-recipes rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-adapter-import-of-recipes.ts"),
)

// P1.1: Anatomy/semantics rules (Task 41)
check(
  "anatomy-registry exists",
  fileExists("packages/eslint-plugin-solidiom/src/anatomy-registry.ts"),
)
check(
  "require-primitive-parts rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/require-primitive-parts.ts"),
)
check(
  "require-accessible-name rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/require-accessible-name.ts"),
)
check(
  "no-forbidden-primitive-props rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-forbidden-primitive-props.ts"),
)

// Verify all rules are registered in the plugin index
check(
  "plugin registers no-adapter-import-of-recipes",
  fileContains("packages/eslint-plugin-solidiom/src/index.ts", '"no-adapter-import-of-recipes"'),
)
check(
  "plugin registers require-primitive-parts",
  fileContains("packages/eslint-plugin-solidiom/src/index.ts", '"require-primitive-parts"'),
)
check(
  "plugin registers require-accessible-name",
  fileContains("packages/eslint-plugin-solidiom/src/index.ts", '"require-accessible-name"'),
)
check(
  "plugin registers no-forbidden-primitive-props",
  fileContains("packages/eslint-plugin-solidiom/src/index.ts", '"no-forbidden-primitive-props"'),
)

// ─── 6. CLI doctor command ──────────────────────────────────────────────
console.log("\n§6 CLI doctor:")
check("doctor command source exists", fileExists("packages/cli/src/commands/doctor.ts"))
check("CLI tests still pass (≥8)", runTests("@solidiom/cli", 8))

// ─── 7. Vite plugin builds ──────────────────────────────────────────────
console.log("\n§7 Vite plugin:")
check("vite-plugin source exists", fileExists("packages/vite-plugin-solidiom/src/index.ts"))
check("vite-plugin builds", runBuild("@solidiom/vite-plugin"))
check(
  "vite-plugin has recipe extraction impl",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "CVA_PATTERN") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "extractStaticRecipes"),
  "Plugin must have real implementation, not just comment stubs",
)

// ─── 8. P1.3: Execute axe scans and generate real evidence ──────────────
console.log("\n§8 Accessibility (executed axe scans):")
check("axe scan test file exists", fileExists("tests/a11y/primitives-axe-scan.browser.test.tsx"))
check("axe helper exists", fileExists("tests/a11y/axe-helper.ts"))
check("a11y result runner exists", fileExists("tools/run-a11y.ts"))

const a11yResult = run("pnpm run test:a11y")
check(
  "all 52 axe scans execute and write a valid zero-violation artifact",
  a11yResult.ok,
  "Run: pnpm run test:a11y",
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
  fileContains(".github/workflows/ci.yml", "run: pnpm run test:a11y") &&
    fileContains(".github/workflows/ci.yml", "run: pnpm run report:a11y-evidence") &&
    fileContains(".github/workflows/ci.yml", "run: pnpm run report:axe"),
)

// ─── 9. P1.4: Recipe dual-emission drift check ─────────────────────────
console.log("\n§9 Recipe dual-emission drift check:")
const auditFixtureResult = run(
  "pnpm exec vitest run tools/audit-recipe-dual-emission.test.ts tools/audit-umbrella-purity.test.ts tools/axe-results.test.ts tools/a11y-evidence.test.ts",
)
check(
  "audit and result-validation negative fixtures pass",
  auditFixtureResult.ok,
  "Run: pnpm exec vitest run tools/audit-recipe-dual-emission.test.ts tools/audit-umbrella-purity.test.ts tools/axe-results.test.ts tools/a11y-evidence.test.ts",
)
check("audit-recipe-dual-emission.ts exists", fileExists("tools/audit-recipe-dual-emission.ts"))
const driftResult = run("pnpm exec tsx tools/audit-recipe-dual-emission.ts")
check(
  "recipe drift check passes",
  driftResult.ok,
  "Recipe CSS/TSX drift detected — run: pnpm run audit:recipe-drift",
)

// ─── 10. P1.5: Umbrella re-export purity check ─────────────────────────
console.log("\n§10 Umbrella re-export purity check:")
check("audit-umbrella-purity.ts exists", fileExists("tools/audit-umbrella-purity.ts"))
const purityResult = run("pnpm exec tsx tools/audit-umbrella-purity.ts")
check(
  "umbrella purity check passes",
  purityResult.ok,
  "Umbrella has implementation lines or surface mismatch — run: pnpm run audit:umbrella-purity",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 1 Gate")
