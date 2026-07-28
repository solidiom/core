/**
 * @solidiom/adapter-kit — Conformance harness.
 *
 * Validates that an adapter package complies with Solidiom's adapter boundary
 * rules (§23 #6–#14):
 *
 * - No primitive-system imports (Kobalte, Corvu, Ark, Zag, Radix, etc.)
 * - No Solid framework dependencies (solid-js, @solidjs/web)
 * - No JSX attribute bags, classes, ARIA, semantic attrs, or role output
 * - Must have layer:adapter tag
 * - Must export a capability factory (not JSX components)
 *
 * Usage:
 *   import { runConformance } from "@solidiom/adapter-kit/conformance"
 *   const result = runConformance({ packageDir: "packages/adapter-foo" })
 *   if (!result.pass) console.error(result.violations)
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { FORBIDDEN_ADAPTER_DEPS, FORBIDDEN_OUTPUT_PATTERNS } from "./types"

/** A single conformance violation. */
export interface ConformanceViolation {
  rule: string
  file: string
  message: string
}

/** Result of a conformance run. */
export interface ConformanceResult {
  pass: boolean
  violations: ConformanceViolation[]
  checkedFiles: number
}

export interface ConformanceOptions {
  /** Absolute or relative path to the adapter package directory. */
  packageDir: string
  /** Root of the monorepo (for resolving relative paths). Default: process.cwd(). */
  root?: string
}

/**
 * Runs the full conformance harness against an adapter package.
 */
export function runConformance(options: ConformanceOptions): ConformanceResult {
  const root = options.root ?? process.cwd()
  const pkgDir = options.packageDir.startsWith("/")
    ? options.packageDir
    : join(root, options.packageDir)

  const violations: ConformanceViolation[] = []
  let checkedFiles = 0

  // ── 1. Package.json checks ───────────────────────────────────────────────
  const pkgJsonPath = join(pkgDir, "package.json")
  if (!existsSync(pkgJsonPath)) {
    violations.push({
      rule: "package-exists",
      file: "package.json",
      message: "Adapter package.json not found",
    })
    return { pass: false, violations, checkedFiles: 0 }
  }

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"))

  // Check layer:adapter tag
  const tags: string[] = pkgJson.nx?.tags ?? []
  if (!tags.includes("layer:adapter")) {
    violations.push({
      rule: "layer-tag",
      file: "package.json",
      message: 'Adapter must have nx.tags including "layer:adapter"',
    })
  }

  // Check forbidden dependencies
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.peerDependencies,
    ...pkgJson.devDependencies,
  }
  for (const dep of Object.keys(allDeps)) {
    for (const pattern of FORBIDDEN_ADAPTER_DEPS) {
      if (pattern.test(dep)) {
        violations.push({
          rule: "forbidden-dependency",
          file: "package.json",
          message: `Forbidden dependency "${dep}" — adapters must not depend on primitive systems or Solid framework packages`,
        })
      }
    }
  }

  // Check no "solid" export condition (adapters are framework-neutral)
  const exports = pkgJson.exports?.["."] ?? {}
  if (exports.solid) {
    violations.push({
      rule: "no-solid-condition",
      file: "package.json",
      message: 'Adapter must not have a "solid" export condition — adapters are framework-neutral',
    })
  }

  // ── 2. Source code checks ────────────────────────────────────────────────
  const srcDir = join(pkgDir, "src")
  if (!existsSync(srcDir)) {
    violations.push({
      rule: "src-exists",
      file: "src/",
      message: "Adapter must have a src/ directory",
    })
    return { pass: violations.length === 0, violations, checkedFiles }
  }

  const sourceFiles = getAllSourceFiles(srcDir)
  for (const file of sourceFiles) {
    checkedFiles++
    const content = readFileSync(file, "utf8")
    const relPath = relative(pkgDir, file)

    // Check forbidden imports
    for (const pattern of FORBIDDEN_ADAPTER_DEPS) {
      // Strip anchors from the pattern source for use inside a larger regex
      const patternSrc = pattern.source.replace(/^\^/, "").replace(/\$$/, "")
      const importRe = new RegExp(`(?:from|import)\\s+["'](${patternSrc}[^"']*)["']`, "g")
      const importMatch = content.match(importRe)
      if (importMatch) {
        for (const match of importMatch) {
          violations.push({
            rule: "forbidden-import",
            file: relPath,
            message: `Forbidden import: ${match} — adapters must only import framework-neutral engines`,
          })
        }
      }
    }

    // Check forbidden output patterns (skip test files)
    if (!relPath.includes(".test.") && !relPath.includes(".spec.")) {
      for (const { pattern, reason } of FORBIDDEN_OUTPUT_PATTERNS) {
        if (pattern.test(content)) {
          violations.push({
            rule: "forbidden-output",
            file: relPath,
            message: reason,
          })
        }
      }
    }

    // Check no JSX (adapters must not return JSX)
    if (!relPath.includes(".test.") && !relPath.includes(".spec.")) {
      if (file.endsWith(".tsx")) {
        // Detect JSX: opening tags like <Foo or <div (but not comparisons like x < y)
        const jsxPattern = /<[a-zA-Z][a-zA-Z0-9.]*[\s/>]/
        if (jsxPattern.test(content)) {
          violations.push({
            rule: "no-jsx-output",
            file: relPath,
            message:
              "Adapter source files must not contain JSX — adapters return data, not components",
          })
        }
      }
    }
  }

  return { pass: violations.length === 0, violations, checkedFiles }
}

/** Recursively collect all .ts/.tsx files in a directory. */
function getAllSourceFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...getAllSourceFiles(full))
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}
