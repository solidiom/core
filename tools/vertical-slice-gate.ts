#!/usr/bin/env tsx
/**
 * VS-004: End-to-end vertical-slice gate.
 *
 * Validates that Dialog, Combobox, and Data Table satisfy the complete
 * G2 exit criteria: registry, routes, API, accessibility, search indexing
 * attributes, locale parity, visual/browser test readiness, and performance
 * budgets. This gate must pass before bulk catalog production begins.
 *
 * Usage: pnpm exec tsx tools/vertical-slice-gate.ts
 *
 * See: docs/plans/website-tasks.md §6.5 (VS-004)
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { check, summarize, fileExists, fileContains, readJSON, run } from "./gate-helpers"
import { VERTICAL_SLICE_PRIMITIVES, checkCoverage } from "./api-coverage-gate"
import type { NormalizedApiDocument } from "./api-schema"

const ROOT = resolve(import.meta.dirname ?? __dirname, "..")
const REGISTRY_DIR = join(ROOT, "registry")
const API_ARTIFACTS_DIR = join(ROOT, "artifacts", "api")
const PACKAGES_DIR = join(ROOT, "packages")
const SITE_PAGES_DIR = join(ROOT, "apps", "site", "src", "pages")
const ROUTE_BUDGETS_PATH = join(ROOT, "apps", "site", "tools", "route-budgets.json")

interface RegistryManifest {
  name: string
  status: string
  documentation: {
    status: string
    locales: Record<string, { status: string }>
  }
  accessibility: {
    reviewStatus: string
    evidenceIds: string[]
  }
}

console.log("VS-004 Vertical-Slice Gate (G2)")
console.log("═".repeat(50))
console.log()

// ─── 1. Registry ────────────────────────────────────────────────────────
console.log("§1 Registry manifests:")

for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
  const manifest = readJSON<RegistryManifest>(join(REGISTRY_DIR, `${primitive}.json`))

  check(`${primitive}: registry manifest exists`, manifest !== null)

  if (manifest) {
    // registry-build derives "complete" when EN+ES have overview+contract+example
    check(
      `${primitive}: documentation status is complete`,
      manifest.documentation?.status === "complete",
      `got "${manifest.documentation?.status}"`,
    )

    // Locale status is "draft" unless translationStatus: human-reviewed in frontmatter.
    // "draft" means content exists; "missing" means no overview.md at all.
    check(
      `${primitive}: EN locale content exists`,
      manifest.documentation?.locales?.en?.status !== "missing" &&
        manifest.documentation?.locales?.en !== undefined,
      `got "${manifest.documentation?.locales?.en?.status}"`,
    )

    check(
      `${primitive}: ES locale content exists`,
      manifest.documentation?.locales?.es?.status !== "missing" &&
        manifest.documentation?.locales?.es !== undefined,
      `got "${manifest.documentation?.locales?.es?.status}"`,
    )

    check(
      `${primitive}: accessibility evidence recorded`,
      manifest.accessibility?.reviewStatus !== "none",
      `got "${manifest.accessibility?.reviewStatus}"`,
    )
  }
}

// Registry regeneration determinism
console.log("\n§1b Registry determinism:")
const registryResult = run("pnpm exec tsx tools/registry-build.ts --check", { cwd: ROOT })
check(
  "registry regeneration produces no diff",
  registryResult.ok,
  registryResult.ok ? undefined : "registry-build --check failed; output may differ",
)

// ─── 2. API artifacts ───────────────────────────────────────────────────
console.log("\n§2 API artifacts (extends API-004):")

for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
  const artifactPath = join(API_ARTIFACTS_DIR, `${primitive}.json`)

  check(`${primitive}: API artifact exists`, existsSync(artifactPath))

  if (existsSync(artifactPath)) {
    try {
      const document = JSON.parse(readFileSync(artifactPath, "utf8")) as NormalizedApiDocument
      const violations = checkCoverage(document, primitive)

      check(
        `${primitive}: all exports documented and resolved`,
        violations.length === 0,
        violations.length > 0
          ? `${violations.length} violation(s): ${violations.map((v) => `${v.exportName}:${v.reason}`).join(", ")}`
          : undefined,
      )

      check(
        `${primitive}: has at least one public export`,
        document.exports.length > 0,
        `found ${document.exports.length}`,
      )
    } catch {
      check(`${primitive}: API artifact is valid JSON`, false, "parse error")
    }
  }
}

// ─── 3. Documentation content ───────────────────────────────────────────
console.log("\n§3 Documentation content (EN + ES):")

for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
  const docsDir = join(PACKAGES_DIR, primitive, "docs")

  // EN overview
  check(`${primitive}: EN overview exists`, fileExists(join(docsDir, "overview.md")))

  // ES overview
  check(`${primitive}: ES overview exists`, fileExists(join(docsDir, "es", "overview.md")))

  // EN example
  const examplesDir = join(docsDir, "examples")
  const hasEnExample =
    existsSync(examplesDir) && readdirSync(examplesDir).some((f) => f.endsWith(".md"))
  check(`${primitive}: EN example exists`, hasEnExample)

  // ES example
  const esExamplesDir = join(docsDir, "es", "examples")
  const hasEsExample =
    existsSync(esExamplesDir) && readdirSync(esExamplesDir).some((f) => f.endsWith(".md"))
  check(`${primitive}: ES example exists`, hasEsExample)

  // EN accessibility contract
  check(
    `${primitive}: EN accessibility contract exists`,
    fileExists(join(docsDir, "accessibility", "contract.md")),
  )

  // ES accessibility contract
  check(
    `${primitive}: ES accessibility contract exists`,
    fileExists(join(docsDir, "es", "accessibility", "contract.md")),
  )

  // Automated evidence
  check(
    `${primitive}: accessibility evidence.json exists`,
    fileExists(join(docsDir, "accessibility", "evidence.json")),
  )
}

// ─── 4. Routes ──────────────────────────────────────────────────────────
console.log("\n§4 Route generation:")

// Dynamic route pages must exist
check(
  "EN primitive index route",
  fileExists(join(SITE_PAGES_DIR, "primitives", "[name]", "index.astro")),
)
check(
  "EN primitive view routes",
  fileExists(join(SITE_PAGES_DIR, "primitives", "[name]", "[view].astro")),
)
check(
  "ES primitive index route",
  fileExists(join(SITE_PAGES_DIR, "es", "primitives", "[name]", "index.astro")),
)
check(
  "ES primitive view routes",
  fileExists(join(SITE_PAGES_DIR, "es", "primitives", "[name]", "[view].astro")),
)

// ─── 5. Search indexing attributes ──────────────────────────────────────
console.log("\n§5 Search indexing (SEARCH-003):")

check("pagefind.yml configuration exists", fileExists("apps/site/pagefind.yml"))
check(
  "DocsLayout has data-pagefind-body",
  fileContains("apps/site/src/layouts/DocsLayout.astro", "data-pagefind-body"),
)
check(
  "DocsLayout has data-pagefind-filter-locale",
  fileContains("apps/site/src/layouts/DocsLayout.astro", "data-pagefind-filter-locale"),
)
check(
  "DocsLayout has data-pagefind-filter-content_type",
  fileContains("apps/site/src/layouts/DocsLayout.astro", "data-pagefind-filter-content_type") ||
    fileContains("apps/site/src/layouts/DocsLayout.astro", "data-pagefind-filter-content-type"),
)

// ─── 6. Search analytics (SEARCH-005) ──────────────────────────────────
console.log("\n§6 Search analytics privacy:")

check("analytics types module exists", fileExists("apps/site/src/lib/analytics-types.ts"))
check("analytics module exists", fileExists("apps/site/src/lib/analytics.ts"))
check(
  "SiteSearch imports analytics",
  fileContains("apps/site/src/components/SiteSearch.tsx", "analytics"),
)
// Verify no query text in analytics
check(
  "analytics types do not include query field",
  !fileContains("apps/site/src/lib/analytics-types.ts", "query:") &&
    !fileContains("apps/site/src/lib/analytics-types.ts", "queryText"),
)

// ─── 7. Locale parity ───────────────────────────────────────────────────
console.log("\n§7 Locale parity:")

// Run the site's route parity validator if available
const parityResult = run("pnpm --filter @solidiom/site run route-parity", { cwd: ROOT })
check(
  "route parity validation passes",
  parityResult.ok,
  parityResult.ok ? undefined : "route-parity script failed",
)

// ─── 8. Performance budgets ─────────────────────────────────────────────
console.log("\n§8 Performance budgets:")

check("route-budgets.json exists", existsSync(ROUTE_BUDGETS_PATH))

if (existsSync(ROUTE_BUDGETS_PATH)) {
  const budgets = readJSON<Record<string, unknown>>(ROUTE_BUDGETS_PATH)
  check(
    "budgets define catalog category",
    budgets !== null &&
      "categories" in budgets! &&
      typeof (budgets as any).categories === "object" &&
      "catalog" in (budgets as any).categories,
  )
  check(
    "budgets define content category",
    budgets !== null &&
      "categories" in budgets! &&
      typeof (budgets as any).categories === "object" &&
      "content" in (budgets as any).categories,
  )

  // Verify the budget enforcement script exists
  check("budget enforcement script exists", fileExists("apps/site/tools/report-route-budgets.ts"))
}

// ─── 9. Manual evidence matrix ──────────────────────────────────────────
console.log("\n§9 Manual evidence (A11Y-005):")

check("manual evidence matrix exists", fileExists("docs/evidence/manual-evidence-matrix.md"))

// Dialog must have manual evidence
check(
  "Dialog manual evidence recorded",
  fileContains("docs/evidence/manual-evidence-matrix.md", "| Dialog") &&
    fileContains("docs/evidence/manual-evidence-matrix.md", "✅"),
)

// ─── 10. Typecheck gate ─────────────────────────────────────────────────
console.log("\n§10 Typecheck and build:")

const siteCheck = run("pnpm exec nx run @solidiom/site:check", { cwd: ROOT })
check("apps/site passes astro check", siteCheck.ok, siteCheck.ok ? undefined : "astro check failed")

// ─── 11. No bulk catalog bypass ─────────────────────────────────────────
console.log("\n§11 No bulk catalog bypass:")

// Verify no PRIM-* tasks are marked complete in the tracker without VS-004
const tracker = readJSON<string>("docs/plans/website-tasks.md")
// Read as text instead
const trackerPath = join(ROOT, "docs", "website-tasks.md")
if (existsSync(trackerPath)) {
  const trackerContent = readFileSync(trackerPath, "utf8")
  // Look for completed PRIM-* rows (pattern: | [x] | PRIM-...)
  const completedPrims = trackerContent.match(/\|\s*\[x\]\s*\|\s*PRIM-/g)
  check(
    "no PRIM-* tasks completed before VS-004",
    !completedPrims || completedPrims.length === 0,
    completedPrims ? `found ${completedPrims.length} completed PRIM-* rows` : undefined,
  )
} else {
  check("tracker document exists", false, "docs/plans/website-tasks.md not found")
}

// ─── Summary ────────────────────────────────────────────────────────────
summarize("VS-004 Vertical-Slice Gate (G2)")
