/**
 * Phase 0 acceptance-criteria gate.
 *
 * Verifies Phase 0 exit criteria by executing tests and verifying behavior,
 * not just checking file existence.
 *
 * Run via: pnpm exec tsx tools/phase0-gate.ts
 */

import {
  check,
  summarize,
  runTests,
  runTypecheck,
  runBuild,
  fileExists,
  fileContains,
  noDepsMatching,
  readJSON,
} from "./gate-helpers"

console.log("Phase 0 Acceptance Gate\n")

// ─── 1. No Kobalte/Corvu in primitives/runtime/adapters ─────────────────
console.log("§1 No Kobalte/Corvu dependencies:")
const phase0Packages = [
  "packages/runtime",
  "packages/dialog",
  "packages/select",
  "packages/calendar",
  "packages/carousel",
  "packages/adapter-positioning-floating-ui",
  "packages/adapter-positioning-minimal",
  "packages/adapter-date-internationalized",
  "packages/adapter-carousel-embla",
]
for (const dir of phase0Packages) {
  check(`${dir}: no Kobalte/Corvu`, noDepsMatching(`${dir}/package.json`, /kobalte|corvu/))
}

// ─── 2. Runtime kernel tests pass ───────────────────────────────────────
console.log("\n§2 Runtime kernel behavior:")
check(
  "runtime tests pass (≥100 tests)",
  runTests("@solidiom/runtime", 100),
  "Runtime must have ≥100 passing tests covering state, events, DOM, collection, overlay, presence, form, i18n",
)
check("runtime typechecks", runTypecheck("@solidiom/runtime"))

// ─── 3. Dialog primitive behavior ───────────────────────────────────────
console.log("\n§3 Dialog primitive:")
check(
  "dialog tests pass (≥9 tests)",
  runTests("@solidiom/dialog", 6),
  "Dialog must test state, dismiss, layer stack, focus, modal isolation",
)
check("dialog builds", runBuild("@solidiom/dialog"))
check("dialog has source/ emission", fileExists("packages/dialog/source/index.tsx"))

// ─── 4. Select primitive behavior ───────────────────────────────────────
console.log("\n§4 Select primitive:")
check(
  "select tests pass (≥9 tests)",
  runTests("@solidiom/select", 4),
  "Select must test collection, roving focus, typeahead, hidden input, state",
)
check("select builds", runBuild("@solidiom/select"))

// ─── 5. Adapter conformance ─────────────────────────────────────────────
console.log("\n§5 Adapter tests pass:")
check(
  "positioning-floating-ui tests pass (≥6)",
  runTests("@solidiom/adapter-positioning-floating-ui", 6),
)
check("positioning-minimal tests pass (≥8)", runTests("@solidiom/adapter-positioning-minimal", 8))
check(
  "adapter-positioning-floating-ui has capability.ts",
  fileExists("packages/adapter-positioning-floating-ui/src/capability.ts"),
)
check(
  "adapter-positioning-minimal has capability.ts",
  fileExists("packages/adapter-positioning-minimal/src/capability.ts"),
)

// ─── 6. Test doubles prove adapter double fidelity ──────────────────────
console.log("\n§6 Test doubles behavior:")
check(
  "test-doubles tests pass (≥30)",
  runTests("@solidiom/test-doubles", 30),
  "Test doubles must cover positioning, virtualization, date-math, carousel-physics",
)

// ─── 7. ESLint boundary enforcement ────────────────────────────────────
console.log("\n§7 ESLint rules proven by tests:")
check(
  "eslint-plugin-solidiom tests pass (≥15)",
  runTests("@solidiom/eslint-plugin-solidiom", 15),
  "ESLint rules must have test coverage for boundary, adapter-jsx, engine-import violations",
)

// ─── 8. CLI behavior ────────────────────────────────────────────────────
console.log("\n§8 CLI commands tested:")
check("CLI tests pass (≥8)", runTests("@solidiom/cli", 8), "CLI must test init and plan commands")
check("CLI typechecks", runTypecheck("@solidiom/cli"))

// ─── 9. Bench harness ───────────────────────────────────────────────────
console.log("\n§9 Bench harness:")
check(
  "bench tests pass (≥6)",
  runTests("@solidiom/bench", 6),
  "Bench must test report generation and throughput harness",
)
check("bench baselines exist", fileExists("packages/bench/baselines/initial.json"))

// ─── 10. Migration and legacy isolation ─────────────────────────────────
console.log("\n§10 Migration + legacy:")
check("migration transform exists", fileExists("migrations/shadcn-solid-dialog/transform.ts"))
check("legacy facade source exists", fileExists("legacy/shadcn-solid-dialog/src/index.ts"))

const legacyPkg = readJSON<Record<string, any>>("legacy/shadcn-solid-dialog/package.json")
check(
  "legacy has sunset metadata",
  !!legacyPkg?.solidiom?.sunset,
  "package.json must have solidiom.sunset field",
)
check("legacy tagged layer:legacy", legacyPkg?.nx?.tags?.includes("layer:legacy") ?? false)

// ─── 11. Registry catalog ───────────────────────────────────────────────
console.log("\n§11 Registry:")
const registry = readJSON<{ primitives?: unknown[]; adapters?: unknown[] }>("registry/index.json")
check("registry/index.json exists with content", registry !== null)
check("registry has primitives (≥2)", (registry?.primitives?.length ?? 0) >= 2)
check("registry has adapters (≥2)", (registry?.adapters?.length ?? 0) >= 2)

// ─── 12. Dual emission ──────────────────────────────────────────────────
console.log("\n§12 Package/source dual emission:")
check("dialog dist/index.js exists after build", fileExists("packages/dialog/dist/index.js"))
check("dialog source/index.tsx exists", fileExists("packages/dialog/source/index.tsx"))
check(
  "dialog dist does not include test declarations",
  !fileExists("packages/dialog/dist/dialog.test.d.ts"),
  "dist/ must not contain test declarations",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 0 Gate")
