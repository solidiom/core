/**
 * Phase 3 Preflight — Solid 2 Beta Baseline Check.
 *
 * Lightweight verification that the workspace meets the minimum Solid 2 beta
 * compatibility requirements before running the full Phase 3 release gate.
 *
 * Run via: pnpm exec tsx tools/phase3-preflight.ts
 */

import { check, summarize, fileExists, fileContains, readJSON, run } from "./gate-helpers"

console.log("Phase 3 Preflight (Solid 2 Beta Baseline)\n")

// ─── 1. solid-js version is beta ────────────────────────────────────────
const rootPkg = readJSON<Record<string, any>>("package.json")
const solidVersion =
  rootPkg?.devDependencies?.["solid-js"] ?? rootPkg?.dependencies?.["solid-js"] ?? ""
check(
  "solid-js is on a beta version",
  solidVersion.includes("beta"),
  `Current: ${solidVersion}. Phase 3 targets Solid 2 beta.`,
)

// ─── 2. solid-matrix.json exists with low/mid/high tiers ────────────────
check("solid-matrix.json exists", fileExists("tools/solid-matrix.json"))
const matrix = readJSON<Record<string, any>>("tools/solid-matrix.json")
const hasAllTiers =
  matrix?.window?.low != null && matrix?.window?.mid != null && matrix?.window?.high != null
check(
  "solid-matrix.json has low/mid/high tiers",
  hasAllTiers,
  "tools/solid-matrix.json must define window.low, window.mid, and window.high",
)

// ─── 3. @solidjs/web is on a matching beta ──────────────────────────────
const solidWebVersion =
  rootPkg?.devDependencies?.["@solidjs/web"] ?? rootPkg?.dependencies?.["@solidjs/web"] ?? ""
check(
  "@solidjs/web is on a matching beta",
  solidWebVersion.includes("beta"),
  `Current: ${solidWebVersion}. Must match solid-js beta.`,
)

// ─── 4. vite-plugin-solid is on a next/pre version ──────────────────────
const vpsVersion =
  rootPkg?.devDependencies?.["vite-plugin-solid"] ??
  rootPkg?.dependencies?.["vite-plugin-solid"] ??
  ""
check(
  "vite-plugin-solid is on a next/pre version",
  vpsVersion.includes("next") || vpsVersion.includes("pre") || vpsVersion.includes("beta"),
  `Current: ${vpsVersion}. Must be a next/pre/beta prerelease.`,
)

// ─── 5. Root typecheck passes (primitives can be typechecked against beta)
const typecheck = run("pnpm run typecheck")
check(
  "root typecheck passes against Solid beta",
  typecheck.ok,
  "All primitive packages must typecheck cleanly against the Solid 2 beta",
)

// ─── Summary ────────────────────────────────────────────────────────────
summarize("Phase 3 Preflight (Solid 2 Beta Baseline)")
