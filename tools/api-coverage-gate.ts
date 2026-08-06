#!/usr/bin/env tsx
/**
 * API-004 coverage gate.
 *
 * Fails when a normalized API artifact for a vertical-slice primitive
 * (Dialog, Combobox, Data Table — the three primitives G2's vertical slice
 * requires to be complete per docs/plans/website-tasks.md §2.1 (VS-004) contains an
 * "unresolved" export (its type could not be normalized to anything more
 * specific than "unknown") or an "undocumented" export (no `comment.summary`
 * — every public export needs at least a one-line description).
 *
 * Scope is intentionally limited to the vertical-slice set. Applying this
 * gate to the full 52-primitive catalog today would fail on pre-existing
 * documentation gaps that are explicit G4 catalog-completion work
 * (docs/plans/website-tasks.md §9.1), not part of G2's vertical-slice gate.
 * VS-004 (or a future catalog-wide task) should widen this list as each
 * primitive's Primitive DoD is completed.
 *
 * Usage: tsx tools/api-coverage-gate.ts
 */
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { NormalizedApiDocument, NormalizedApiExport } from "./api-schema"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const API_ARTIFACTS_DIR = join(ROOT, "artifacts", "api")

/** Primitives that must have complete API coverage per the G2 vertical slice. */
export const VERTICAL_SLICE_PRIMITIVES = ["dialog", "combobox", "data-table"] as const

function isUnresolved(entry: NormalizedApiExport): boolean {
  // "unknown" kind means normalizeKind could not classify the reflection at
  // all. A prop/signature/return type that stringifies to exactly "unknown"
  // means renderType could not resolve the underlying TypeDoc type node.
  if (entry.kind === "unknown") return true
  if (entry.type === "unknown") return true
  for (const signature of entry.signatures) {
    if (signature.returns === "unknown") return true
    if (signature.parameters.some((parameter) => parameter.type === "unknown")) return true
  }
  if (entry.props.some((prop) => prop.type === "unknown")) return true
  return false
}

function isUndocumented(entry: NormalizedApiExport): boolean {
  return !entry.comment?.summary
}

export interface CoverageViolation {
  primitive: string
  exportName: string
  kind: string
  reason: "unresolved" | "undocumented"
}

export function checkCoverage(
  document: NormalizedApiDocument,
  primitive: string,
): CoverageViolation[] {
  const violations: CoverageViolation[] = []
  for (const entry of document.exports) {
    if (isUnresolved(entry)) {
      violations.push({ primitive, exportName: entry.name, kind: entry.kind, reason: "unresolved" })
    }
    if (isUndocumented(entry)) {
      violations.push({
        primitive,
        exportName: entry.name,
        kind: entry.kind,
        reason: "undocumented",
      })
    }
  }
  return violations
}

function main(): void {
  console.log("API-004 Coverage Gate (vertical-slice primitives)")
  console.log("=".repeat(50))

  const allViolations: CoverageViolation[] = []

  for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
    const artifactPath = join(API_ARTIFACTS_DIR, `${primitive}.json`)
    if (!existsSync(artifactPath)) {
      console.log(`  ✗ ${primitive}: no generated API artifact found at ${artifactPath}`)
      allViolations.push({ primitive, exportName: "*", kind: "*", reason: "unresolved" })
      continue
    }

    const document = JSON.parse(readFileSync(artifactPath, "utf8")) as NormalizedApiDocument
    const violations = checkCoverage(document, primitive)
    if (violations.length === 0) {
      console.log(
        `  ✓ ${primitive}: ${document.exports.length} exports, fully documented and resolved`,
      )
    } else {
      console.log(`  ✗ ${primitive}: ${violations.length} violation(s)`)
      for (const violation of violations) {
        console.log(`      - ${violation.exportName} (${violation.kind}): ${violation.reason}`)
      }
    }
    allViolations.push(...violations)
  }

  console.log()
  if (allViolations.length > 0) {
    console.error(
      `API-004: ${allViolations.length} undocumented/unresolved public export(s) in vertical-slice primitives.`,
    )
    process.exitCode = 1
    return
  }

  console.log("All vertical-slice primitives have fully documented, resolved public exports.")
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
