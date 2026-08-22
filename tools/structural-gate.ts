/**
 * Structural gate — fast pre-merge acceptance gate (gate:quick).
 *
 * Verifies durable, version-agnostic structural invariants that must hold on
 * every change: runtime kernel behavior, core primitive/adapter behavior,
 * ESLint boundary enforcement, CLI behavior, registry/dual-emission shape,
 * browser-harness configuration, and CI/release wiring.
 *
 * This gate is intentionally light and contains no timeline-specific checks
 * (e.g. "solid-js must be a beta prerelease"). Those were one-time migration
 * guards, not ongoing quality gates. The full durable suite lives in
 * tools/release-gate.ts (gate:full).
 *
 * Run via: pnpm run gate:quick
 * Or:      pnpm exec tsx tools/structural-gate.ts
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
import { globSync } from "node:fs"

console.log("Structural Gate (gate:quick)\n")

// ─── 1. Runtime kernel behavior ─────────────────────────────────────────
console.log("§1 Runtime kernel behavior:")
check(
  "runtime tests pass (≥100)",
  runTests("@solidiom/runtime", 100),
  "Runtime must have ≥100 passing tests covering state, events, DOM, collection, overlay, presence, form, i18n",
)
check("runtime typechecks", runTypecheck("@solidiom/runtime"))

// ─── 2. Core primitive behavior ─────────────────────────────────────────
console.log("\n§2 Core primitives:")
check(
  "dialog tests pass (≥6)",
  runTests("@solidiom/dialog", 6),
  "Dialog must test state, dismiss, layer stack, focus, modal isolation",
)
check("dialog builds", runBuild("@solidiom/dialog"))
check("dialog has source/ emission", fileExists("packages/dialog/source/index.tsx"))
check(
  "select tests pass (≥4)",
  runTests("@solidiom/select", 4),
  "Select must test collection, roving focus, typeahead, hidden input, state",
)
check("select builds", runBuild("@solidiom/select"))

// ─── 3. Adapter conformance ─────────────────────────────────────────────
console.log("\n§3 Adapter behavior:")
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
check(
  "test-doubles tests pass (≥30)",
  runTests("@solidiom/test-doubles", 30),
  "Test doubles must cover positioning, virtualization, date-math, carousel-physics",
)

// ─── 4. ESLint boundary enforcement ─────────────────────────────────────
console.log("\n§4 ESLint rules proven by tests:")
check(
  "eslint-plugin-solidiom tests pass (≥15)",
  runTests("@solidiom/eslint-plugin-solidiom", 15),
  "ESLint rules must have test coverage for boundary, adapter-jsx, engine-import violations",
)

// ─── 5. CLI behavior ────────────────────────────────────────────────────
console.log("\n§5 CLI commands tested:")
check("CLI tests pass (≥8)", runTests("@solidiom/cli", 8), "CLI must test init and plan commands")
check("CLI typechecks", runTypecheck("@solidiom/cli"))

// ─── 6. Bench harness ───────────────────────────────────────────────────
console.log("\n§6 Bench harness:")
check(
  "bench tests pass (≥6)",
  runTests("@solidiom/bench", 6),
  "Bench must test report generation and throughput harness",
)
check("bench baselines exist", fileExists("packages/bench/baselines/initial.json"))

// ─── 7. Registry catalog ────────────────────────────────────────────────
console.log("\n§7 Registry:")
const registry = readJSON<{ primitives?: unknown[]; adapters?: unknown[] }>("registry/index.json")
check("registry/index.json exists with content", registry !== null)
check("registry has primitives (≥2)", (registry?.primitives?.length ?? 0) >= 2)
check("registry has adapters (≥2)", (registry?.adapters?.length ?? 0) >= 2)

// ─── 8. Dual emission shape ─────────────────────────────────────────────
console.log("\n§8 Package/source dual emission:")
check("dialog dist/index.js exists after build", fileExists("packages/dialog/dist/index.js"))
check("dialog source/index.tsx exists", fileExists("packages/dialog/source/index.tsx"))
check(
  "dialog dist does not include test declarations",
  !fileExists("packages/dialog/dist/dialog.test.d.ts"),
  "dist/ must not contain test declarations",
)

// ─── 9. Behavioral package/source parity ────────────────────────────────
console.log("\n§9 Package/source parity:")
check(
  "parity tests pass (≥37)",
  runTests("@solidiom/tests-package-source-parity", 37),
  "Parity suite must verify export surface and type consistency for dialog, select, calendar, carousel, and the three recipe packages",
)

// ─── 10. Browser harness configuration ──────────────────────────────────
console.log("\n§10 Browser harness:")
check(
  "vitest.browser.config.ts uses Playwright factory",
  fileContains("vitest.browser.config.ts", "@vitest/browser-playwright"),
  "Browser config must import playwright from @vitest/browser-playwright (v4 API)",
)
check(
  "vitest.browser.config.ts has chromium instance",
  fileContains("vitest.browser.config.ts", "chromium"),
)
check(
  "cross-browser config uses Playwright factory",
  fileContains("tools/test/vitest.cross-browser.config.ts", "@vitest/browser-playwright"),
)

// ─── 11. CI and Changesets wiring ───────────────────────────────────────
console.log("\n§11 CI and Changesets:")
check("CI packages workflow exists", fileExists(".github/workflows/ci-packages.yml"))
check("release workflow exists", fileExists(".github/workflows/release.yml"))
check("changeset config exists", fileExists(".changeset/config.json"))
check(
  "CI runs gate:quick",
  fileContains(".github/workflows/ci-packages.yml", "gate:quick"),
  "CI must run the quick gate",
)
check("CI has browser test job", fileContains(".github/workflows/ci-packages.yml", "test-browser"))
check(
  "Nightly has solid compat matrix",
  fileContains(".github/workflows/nightly.yml", "solid-compat"),
  "Nightly workflow must run the Solid compatibility matrix",
)

// ─── 12. Solid dependency catalog (single source of truth) ───────────────
console.log("\n§12 Solid dependency catalog:")
{
  const CATALOGED = new Set(["solid-js", "@solidjs/web", "babel-preset-solid"])
  const SECTIONS = ["dependencies", "devDependencies", "peerDependencies"] as const
  const offenders: string[] = []
  for (const rel of globSync("packages/*/package.json").sort()) {
    const pkg = readJSON<Record<string, Record<string, string>>>(rel)
    if (!pkg) continue
    for (const section of SECTIONS) {
      const deps = pkg[section]
      if (!deps) continue
      for (const [name, value] of Object.entries(deps)) {
        if (CATALOGED.has(name) && !String(value).startsWith("catalog:")) {
          offenders.push(`${rel} ${section}.${name}="${value}"`)
        }
      }
    }
  }
  check(
    "all Solid deps use the shared catalog",
    offenders.length === 0,
    offenders.length
      ? `Bypasses catalog: ${offenders.join("; ")}`
      : "Every package references catalog: for solid-js/@solidjs/web/babel-preset-solid",
  )
}

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Structural Gate")
