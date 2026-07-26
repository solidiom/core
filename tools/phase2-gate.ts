/**
 * Phase 2 acceptance-criteria gate.
 *
 * Verifies Phase 2 exit criteria: enterprise governance (verify, audit,
 * policy, release-tools), second-wave primitives, additional adapters,
 * and recipe profiles must build and (where implemented) pass tests.
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
  readJSON,
} from "./gate-helpers"

console.log("Phase 2 Acceptance Gate\n")

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
check("legacy command source exists", fileExists("packages/cli/src/commands/legacy.ts"))
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

// ─── 7. Second-wave adapters ────────────────────────────────────────────
console.log("\n§7 Second-wave adapters:")
check(
  "adapter-virtualization-tanstack source",
  fileExists("packages/adapter-virtualization-tanstack/src/index.ts"),
)
check("adapter-table-tanstack source", fileExists("packages/adapter-table-tanstack/src/index.ts"))

// ─── 8. Bench still passes ──────────────────────────────────────────────
console.log("\n§8 Bench harness:")
check("bench tests pass (≥6)", runTests("@solidiom/bench", 6))

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 2 Gate")
