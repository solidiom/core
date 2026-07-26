/**
 * Phase 1 acceptance-criteria gate.
 *
 * Verifies Phase 1 exit criteria:
 * - Every Phase 1 primitive must exist, typecheck, and build.
 * - Primitives with browser test files must have them present and well-formed.
 * - Build output (dist/) must be produced for each primitive.
 * - Recipe packages must build successfully.
 * - ESLint rules must pass their test suite.
 * - CLI doctor command must exist and CLI tests must pass.
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

console.log("Phase 1 Acceptance Gate\n")

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
// This list is enforced: if a primitive is here, it must have tests.
// Adding a new primitive without tests will fail the gate.
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
]

for (const name of primitivesRequiringBrowserTests) {
  const testFile = `packages/${name}/src/${name}.browser.test.tsx`
  check(
    `@solidiom/${name} has browser test file`,
    fileExists(testFile),
    `Expected ${testFile} to exist`,
  )
  // Verify test file has actual test cases (not empty/scaffold)
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
// If all discovered tests are tracked, pass the coverage check
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

// Verify recipes actually export buttonVariants (key contract)
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

// Verify umbrella re-exports ALL Phase 1 primitives (not just dialog)
for (const p of p1Primitives) {
  check(
    `umbrella exports @solidiom/${p}`,
    fileContains("packages/primitives/src/index.ts", `@solidiom/${p}`),
    `packages/primitives/src/index.ts must re-export @solidiom/${p}`,
  )
}

// ─── 5. ESLint rules have tests ────────────────────────────────────────
console.log("\n§5 ESLint boundary rules:")
check(
  "eslint-plugin tests pass (≥15)",
  runTests("@solidiom/eslint-plugin-solidiom", 15),
  "ESLint rules must prove boundary enforcement via test cases",
)
check(
  "no-primitive-import-of-legacy rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-primitive-import-of-legacy.ts"),
)
check(
  "no-recipe-import-of-migration rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-recipe-import-of-migration.ts"),
)

// ─── 6. CLI doctor command ──────────────────────────────────────────────
console.log("\n§6 CLI doctor:")
check("doctor command source exists", fileExists("packages/cli/src/commands/doctor.ts"))
check("CLI tests still pass (≥8)", runTests("@solidiom/cli", 8))

// ─── 7. Vite plugin builds (compile-time features must be real) ─────────
console.log("\n§7 Vite plugin:")
check("vite-plugin source exists", fileExists("packages/vite-plugin-solidiom/src/index.ts"))
check("vite-plugin builds", runBuild("@solidiom/vite-plugin"))
check(
  "vite-plugin has recipe extraction impl (not just comments)",
  fileContains("packages/vite-plugin-solidiom/src/index.ts", "CVA_PATTERN") ||
    fileContains("packages/vite-plugin-solidiom/src/index.ts", "extractStaticRecipes"),
  "Plugin must have real implementation, not just comment stubs",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 1 Gate")
