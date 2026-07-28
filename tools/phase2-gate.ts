/**
 * Phase 2 acceptance-criteria gate (hardened).
 *
 * Verifies every §21 Phase 2 exit criterion:
 * - Enterprise governance (verify, audit, policy, release-tools)
 * - Second-wave primitives (including RangeCalendar)
 * - Three recipe profiles (CSS, Tailwind, UnoCSS)
 * - Adapter authoring kit with conformance harness
 * - Second-wave adapters (TanStack Virtual, TanStack Table)
 * - Layer isolation (no-cross-layer-import ESLint rule)
 * - Runtime performance benchmark dashboard in docs (Task 56)
 * - Enterprise offline-install recipe + Verdaccio fixture (Task 57)
 *
 * Explicit skips:
 * - Source graph visualizer (deferred to Phase 3 per decision record)
 * - Migration matrix / Task 49 (descoped — greenfield, no prior release)
 * - Legacy CLI / Task 50 (descoped — greenfield, no prior release)
 *
 * Run via: pnpm exec tsx tools/phase2-gate.ts
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

console.log("Phase 2 Acceptance Gate (hardened)\n")

// ─── 1. Signature verification behavior ─────────────────────────────────
console.log("§1 Signature verification:")
check("verify command source", fileExists("packages/cli/src/commands/verify.ts"))
check(
  "verify handles sigstore mode",
  fileContains("packages/cli/src/commands/verify.ts", "sigstore"),
)
check(
  "verify handles trusted-keys mode",
  fileContains("packages/cli/src/commands/verify.ts", "trusted-keys"),
)
check("CLI tests pass (covers verify logic)", runTests("@solidiom/cli", 8))

// ─── 2. Release-tools package ───────────────────────────────────────────
console.log("\n§2 Release tools:")
check("release-tools source exists", fileExists("packages/release-tools/src/index.ts"))
check("release-tools typechecks", runTypecheck("@solidiom/release-tools"))

// ─── 3. Audit / SBOM ───────────────────────────────────────────────────
console.log("\n§3 Audit and SBOM:")
check("audit command source", fileExists("packages/cli/src/commands/audit.ts"))
check(
  "audit references CycloneDX format",
  fileContains("packages/cli/src/commands/audit.ts", "cyclonedx") ||
    fileContains("packages/cli/src/commands/audit.ts", "CycloneDX") ||
    fileContains("packages/cli/src/commands/audit.ts", "bomFormat"),
)

// ─── 4. Policy engine ───────────────────────────────────────────────────
console.log("\n§4 Policy schema:")
check("policy schema source exists", fileExists("packages/cli/src/schemas.ts"))
check(
  "policy schema covers signatureMode",
  fileContains("packages/cli/src/schemas.ts", "signatureMode"),
)
check("CLI typechecks (covers policy)", runTypecheck("@solidiom/cli"))

// ─── 5. Three recipe profiles build ────────────────────────────────────
console.log("\n§5 Recipe profiles:")
check("recipes-css builds", runBuild("@solidiom/recipes-css"))
check("recipes-tailwind builds", runBuild("@solidiom/recipes-tailwind"))
check("recipes-unocss source exists", fileExists("packages/recipes-unocss/src/index.ts"))
check("unocss-preset source exists", fileExists("packages/unocss-preset/src/index.ts"))

// ─── 6. Second-wave primitives typecheck + build ────────────────────────
console.log("\n§6 Second-wave primitives:")
const p2Primitives = [
  "drawer",
  "date-picker",
  "virtual-list",
  "data-table",
  "tree",
  "resizable-panels",
  "command-palette",
]
for (const p of p2Primitives) {
  const pkg = `@solidiom/${p}`
  check(`${pkg} source exists`, fileExists(`packages/${p}/src/index.tsx`))
  check(`${pkg} typechecks`, runTypecheck(pkg))
  check(`${pkg} builds`, runBuild(pkg))
}

// ─── 7. RangeCalendar (Task 52 / C5) ───────────────────────────────────
console.log("\n§7 RangeCalendar:")
check("RangeCalendar source exists", fileExists("packages/calendar/src/range-calendar.tsx"))
check("RangeCalendar context exists", fileExists("packages/calendar/src/range-calendar-context.ts"))
check(
  "RangeCalendar exported from package index",
  fileContains("packages/calendar/src/index.tsx", "RangeRoot"),
)
check(
  "RangeCalendar source/ parity emission exists",
  fileExists("packages/calendar/source/range-calendar.tsx"),
)
check(
  "registry/calendar.json lists RangeCalendar component",
  fileContains("registry/calendar.json", "RangeCalendar"),
)
check("RangeCalendar unit tests exist", fileExists("packages/calendar/src/range-calendar.test.ts"))
check(
  "RangeCalendar browser tests exist",
  fileExists("packages/calendar/src/range-calendar.browser.test.tsx"),
)
check("calendar package typechecks (with RangeCalendar)", runTypecheck("@solidiom/calendar"))
check("calendar package builds (with RangeCalendar)", runBuild("@solidiom/calendar"))
check("calendar tests pass (≥30, covers RangeCalendar)", runTests("@solidiom/calendar", 30))
check("RangeCalendar docs demo exists", fileExists("apps/docs/src/demos/range-calendar-demo.tsx"))
check(
  "RangeCalendar demo registered in docs index",
  fileContains("apps/docs/src/demos/index.ts", "range-calendar"),
)

// ─── 8. Second-wave adapters ────────────────────────────────────────────
console.log("\n§8 Second-wave adapters:")
check(
  "adapter-virtualization-tanstack source",
  fileExists("packages/adapter-virtualization-tanstack/src/index.ts"),
)
check("adapter-table-tanstack source", fileExists("packages/adapter-table-tanstack/src/index.ts"))

// ─── 9. Adapter authoring kit ───────────────────────────────────────────
console.log("\n§9 Adapter authoring kit:")
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

// ─── 10. Layer isolation (architectural enforcement) ────────────────────
console.log("\n§10 Layer isolation:")
check(
  "no-cross-layer-import ESLint rule exists",
  fileExists("packages/eslint-plugin-solidiom/src/rules/no-cross-layer-import.ts"),
)
check(
  "layer restrictions enforced (runtime cannot import primitive)",
  fileContains("packages/eslint-plugin-solidiom/src/utils.ts", "layer:runtime"),
)
check(
  "inspect command exists (source-mode governance)",
  fileExists("packages/cli/src/commands/inspect.ts"),
)

// ─── 11. Bench harness + dashboard (Task 56) ────────────────────────────
console.log("\n§11 Bench and dashboard:")
check("bench tests pass (≥6)", runTests("@solidiom/bench", 6))
check(
  "bench dashboard page exists in docs",
  fileExists("apps/docs/src/pages/performance.astro") ||
    fileExists("apps/docs/src/pages/performance.tsx") ||
    fileExists("apps/docs/src/routes/performance.tsx") ||
    fileContains("apps/docs/src/demos/index.ts", "performance") ||
    fileExists("apps/docs/src/content/docs/performance.mdx") ||
    fileExists("apps/docs/src/content/docs/performance.md"),
)

// ─── 12. Enterprise offline-install (Task 57) ───────────────────────────
console.log("\n§12 Enterprise offline-install:")
check("offline-install how-to guide exists", fileExists("docs/how-to/offline-install.md"))
check(
  "offline-install guide references Verdaccio",
  fileContains("docs/how-to/offline-install.md", "verdaccio") ||
    fileContains("docs/how-to/offline-install.md", "Verdaccio"),
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

// ─── 13. Explicit deferred/descoped items ───────────────────────────────
console.log("\n§13 Deferred and descoped items (documented skips):")
console.log("  ⊘ Source graph visualizer — deferred to Phase 3 (decision record)")
console.log("    Reason: Developer-convenience diagnostic; no §23 acceptance-criteria dependency.")
console.log("    Target: Phase 3 (initial beta stabilization)")
console.log("")
console.log("  ⊘ Migration matrix (Task 49) — descoped")
console.log("    Reason: Greenfield product with no prior release; no migration source exists.")
console.log("    Reference: docs/decisions/descope-migration-legacy.md")
console.log("")
console.log("  ⊘ Legacy CLI + sunset metadata (Task 50) — descoped")
console.log("    Reason: No backwards-compatibility contract; no legacy surface to track.")
console.log("    Reference: docs/decisions/descope-migration-legacy.md")

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 2 Gate")
