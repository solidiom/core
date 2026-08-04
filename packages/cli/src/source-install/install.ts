/**
 * Source install engine — materializes deliverable source files into the consumer project.
 *
 * Responsibilities:
 * 1. Verify collected source files byte-for-byte against the registry manifest
 *    before writing anything to disk (CLI-003) — see ./verify-source.ts.
 * 2. Copy canonical source files to the configured destination directory
 *    (primitive → sourceDir, component → componentDir, block → blockDir, etc.).
 * 3. Deduplicate shared _runtime modules across installed primitives.
 * 4. Rewrite @solidiom/runtime imports to relative paths.
 * 5. Write/update .solidiom/lock.json with installed file digests and provenance.
 *
 * Component source resolution (FOUND-003, D1):
 * When the plan's deliverable is "component", source is resolved from the recipe
 * wrapper in `packages/recipes-{stylingProfile}/src/recipes/<scope>.tsx` (plus its
 * `.variants.ts` companion) rather than from the primitive's own `source/` directory.
 * The styling profile comes from `config.stylingProfile` or `plan.stylingProfile`.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { ConfigSchema, PolicySchema, type Config } from "../schemas"
import type { Deliverable } from "../registry-schema"
import type { Plan } from "../commands/plan"
import { readLock, writeLock, computeDigest, type LockEntry } from "./lock"
import { verifySourceIntegrity, type SourceVerifyResult } from "./verify-source"
import { resolveDestinationRoot } from "./destinations"
import { classifyConflicts, type ConflictReport } from "./conflict"
import { createRollbackJournal } from "./rollback"

export type { LockEntry, LockFile } from "./lock"
export { readLock, writeLock, computeDigest } from "./lock"

export interface SourceInstallOptions {
  primitive: string
  cwd: string
  plan: Plan
  dryRun?: boolean
  /** When true, installation proceeds even if byte-level verification fails; LockEntry.provenance is then "unverified". */
  allowUnverified?: boolean
  /** When true, a blocking conflict (a file modified by the user since install) is overwritten instead of blocking. */
  force?: boolean
  /** When true, prints/returns a conflict report with rendered diffs and exits without writing anything. */
  diff?: boolean
}

export interface SourceInstallResult {
  filesWritten: string[]
  runtimeDeduped: string[]
  lockUpdated: boolean
  /** Whether the source files passed byte-level verification against the registry manifest (CLI-003). */
  verified: boolean
  /** Verification violations. Empty when verified, or when no policy required verification. */
  violations: string[]
  /** Present when a pre-install conflict check ran (blocking conflicts found, or --diff was requested). */
  conflicts?: ConflictReport
}

/**
 * Rewrite @solidiom/runtime imports to relative paths pointing to the _runtime directory.
 *
 * Uses regex for speed on simple .ts files; the full AST transform (ast-transform.ts)
 * is available for complex .tsx files with JSX and re-exports.
 */
export function rewriteImports(content: string, filePath: string, runtimeDir: string): string {
  const fileDir = dirname(filePath)
  const relToRuntime = relative(fileDir, runtimeDir).replace(/\\/g, "/") || "."
  const prefix = relToRuntime.startsWith(".") ? relToRuntime : `./${relToRuntime}`

  // Replace: import { X } from "@solidiom/runtime" → import { X } from "../_runtime/index"
  // Replace: import { X } from "@solidiom/runtime/state/..." → import { X } from "../_runtime/state/..."
  return content.replace(/from\s+["']@solidiom\/runtime(\/[^"']*)?["']/g, (_match, subpath) => {
    const target = subpath ? `${prefix}${subpath}` : `${prefix}/index`
    return `from "${target}"`
  })
}

/**
 * Collect runtime source files for deduplication.
 */
function collectRuntimeFiles(runtimeSourceDir: string): Map<string, string> {
  const files = new Map<string, string>()
  if (!existsSync(runtimeSourceDir)) return files

  function walk(dir: string, prefix: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      const rel = prefix ? `${prefix}/${entry}` : entry
      if (statSync(full).isDirectory()) {
        walk(full, rel)
      } else if (entry.endsWith(".ts") && !entry.includes(".test.")) {
        files.set(rel, readFileSync(full, "utf8"))
      }
    }
  }
  walk(runtimeSourceDir, "")
  return files
}

/**
 * Install a primitive in source mode.
 *
 * Before any file is written, the collected primitive source files are
 * verified byte-for-byte against the registry manifest (CLI-003). If policy
 * requires a verified source (the default) and verification fails, nothing
 * is written — not even a partial file — and the result reports
 * `verified: false` with the violations. Passing `allowUnverified: true`
 * (wired from `--allow-unverified` in `solidiom add`) bypasses the block and
 * proceeds, but every LockEntry written during that install is recorded with
 * `provenance: "unverified"`.
 *
 * Component source resolution (FOUND-003, D1):
 * When `plan.deliverable` is "component", source is resolved from the recipe
 * wrapper for the active styling profile instead of the primitive's source/.
 * When "block", source is resolved from block directory if it exists.
 */
export function installSource(options: SourceInstallOptions): SourceInstallResult {
  const {
    primitive,
    cwd,
    plan,
    dryRun = false,
    allowUnverified = false,
    force = false,
    diff = false,
  } = options

  // Load config
  const configPath = join(cwd, ".solidiom", "config.json")
  const config: Config = existsSync(configPath)
    ? ConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8")))
    : ConfigSchema.parse({})

  // Load policy
  const policyPath = join(cwd, ".solidiom", "policy.json")
  const policy = existsSync(policyPath)
    ? PolicySchema.parse(JSON.parse(readFileSync(policyPath, "utf8")))
    : PolicySchema.parse({})

  // Destination root is keyed off the plan's deliverable kind (CLI-004),
  // defaulting to "primitive" for backward compatibility with pre-CLI-004 plans.
  const deliverable = plan.deliverable ?? "primitive"
  const sourceDir = join(cwd, resolveDestinationRoot(deliverable, config))
  const runtimeDir = join(cwd, config.runtimeDir)
  const filesWritten: string[] = []
  const runtimeDeduped: string[] = []

  // Resolve source files based on deliverable kind (FOUND-003).
  // For "component", use recipe wrapper; for "block", use block source;
  // otherwise fall through to primitive source.
  const sourceFiles = resolveDeliverableSource({
    primitive,
    cwd,
    deliverable,
    config,
    plan,
  })

  if (sourceFiles.size === 0) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: false,
      violations: [
        `Could not resolve source files for "${deliverable}" "${primitive}"`,
        deliverable === "component"
          ? `Ensure config.stylingProfile is set to one of: css, tailwind, unocss`
          : deliverable === "block"
            ? `Block source not yet available — blocks are resolved at work-package split`
            : `Primitive source directory not found`,
      ],
    }
  }

  // Byte-level verification MUST happen before any write to disk.
  const envKey = process.env["REGISTRY_VERIFY_KEY"]
  const verifyKeys = [
    ...(envKey ? [envKey] : []),
    ...policy.registryTrustedKeys,
    ...policy.sourceInstallTrustedKeys,
  ]

  // For component/block, verify against the underlying primitive's manifest
  // since the component manifest carries per-output digests and the install
  // only materializes one output's files.
  const verifyPrimitive =
    deliverable === "component" ? primitive : deliverable === "block" ? primitive : primitive
  const verifyResult: SourceVerifyResult = verifySourceIntegrity({
    cwd,
    primitive: verifyPrimitive,
    files: sourceFiles,
    verifyKeys,
    requireSignature: policy.registrySignatureRequired,
  })

  if (!verifyResult.verified && policy.requireVerifiedSource && !allowUnverified) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: false,
      violations: verifyResult.violations,
    }
  }

  const provenance: LockEntry["provenance"] = verifyResult.verified ? "verified" : "unverified"

  // Load lockfile
  const lock = readLock(cwd)

  // Target directory under the deliverable's destination root.
  const deliverableTarget = join(sourceDir, primitive)

  // Build the full set of planned files (primitive/component/block/theme files
  // + runtime dedup files) with their FINAL (import-rewritten) content, keyed
  // by path relative to cwd, so classifyConflicts sees exactly what would be
  // written to disk.
  const plannedFiles = new Map<string, string>()

  for (const [relPath, content] of sourceFiles) {
    const targetPath = join(deliverableTarget, relPath)
    const relFromCwd = relative(cwd, targetPath)
    const rewritten = rewriteImports(content, targetPath, runtimeDir)
    plannedFiles.set(relFromCwd, rewritten)
  }

  const runtimePkgSource = resolveRuntimeSource(cwd)
  const runtimeFiles = runtimePkgSource
    ? collectRuntimeFiles(runtimePkgSource)
    : new Map<string, string>()
  for (const [relPath, content] of runtimeFiles) {
    const targetPath = join(runtimeDir, relPath)
    const relFromCwd = relative(cwd, targetPath)
    // Runtime files are only ever written when not already present
    // (deduplication) — only include them in the conflict-classified set if
    // they don't already exist, mirroring the write loop's own dedup check.
    if (!existsSync(targetPath)) {
      plannedFiles.set(relFromCwd, content)
    }
  }

  // Pre-install conflict check (CLI-004) — runs AFTER verification passes,
  // BEFORE any write to disk.
  const conflictReport = classifyConflicts({ cwd, plannedFiles, force, lock })

  if (diff) {
    // --diff prints a unified diff and exits 0 without writing.
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: verifyResult.verified ? [] : verifyResult.violations,
      conflicts: conflictReport,
    }
  }

  if (conflictReport.hasBlockingConflicts && !force) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: verifyResult.verified ? [] : verifyResult.violations,
      conflicts: conflictReport,
    }
  }

  // Everything from here on writes to disk — wrap it in a rollback journal
  // so any thrown error (or explicit failure) mid-loop leaves the tree
  // byte-identical to before the install started, even when --force is set.
  const journal = createRollbackJournal()

  try {
    // 1. Copy primitive/component/block/theme source files
    if (!dryRun) mkdirSync(deliverableTarget, { recursive: true })

    for (const [relPath, content] of sourceFiles) {
      const targetPath = join(deliverableTarget, relPath)
      const rewritten = rewriteImports(content, targetPath, runtimeDir)

      if (!dryRun) {
        journal.recordBeforeWrite(targetPath)
        mkdirSync(dirname(targetPath), { recursive: true })
        writeFileSync(targetPath, rewritten)
      }

      const relFromCwd = relative(cwd, targetPath)
      filesWritten.push(relFromCwd)

      lock.installed[relFromCwd] = {
        path: relFromCwd,
        digest: computeDigest(content),
        primitive,
        version: plan.entries[0]?.version ?? "0.0.1-next.0",
        manifestFilesHash: verifyResult.manifestFilesHash ?? "",
        ...(verifyResult.signatureKeyId ? { signatureKeyId: verifyResult.signatureKeyId } : {}),
        verifiedAt: verifyResult.verifiedAt,
        provenance,
      }
    }

    // 2. Deduplicate runtime — copy runtime modules if not already present
    if (runtimePkgSource) {
      if (!dryRun) mkdirSync(runtimeDir, { recursive: true })

      for (const [relPath, content] of runtimeFiles) {
        const targetPath = join(runtimeDir, relPath)
        const relFromCwd = relative(cwd, targetPath)

        // Only write if not already present (deduplication)
        if (!existsSync(targetPath)) {
          if (!dryRun) {
            journal.recordBeforeWrite(targetPath)
            mkdirSync(dirname(targetPath), { recursive: true })
            writeFileSync(targetPath, content)
          }
          filesWritten.push(relFromCwd)
          runtimeDeduped.push(relFromCwd)
        }

        lock.installed[relFromCwd] = {
          path: relFromCwd,
          digest: computeDigest(content),
          primitive: "_runtime",
          version:
            plan.entries.find((e) => e.package === "@solidiom/runtime")?.version ?? "0.0.1-next.0",
          manifestFilesHash: verifyResult.manifestFilesHash ?? "",
          ...(verifyResult.signatureKeyId ? { signatureKeyId: verifyResult.signatureKeyId } : {}),
          verifiedAt: verifyResult.verifiedAt,
          provenance,
        }
      }
    }

    // 3. Write lockfile
    if (!dryRun) {
      journal.recordBeforeWrite(join(cwd, ".solidiom", "lock.json"))
      writeLock(cwd, lock)
    }
  } catch (err) {
    // Mid-install failure — roll back every write made so far and report
    // nothing changed on disk.
    journal.apply()
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: [
        ...(verifyResult.verified ? [] : verifyResult.violations),
        `Install failed and was rolled back: ${err instanceof Error ? err.message : String(err)}`,
      ],
    }
  }

  return {
    filesWritten,
    runtimeDeduped,
    lockUpdated: !dryRun,
    verified: verifyResult.verified,
    violations: verifyResult.verified ? [] : verifyResult.violations,
  }
}

/**
 * Resolve source files for a deliverable, keyed on deliverable kind and styling profile.
 *
 * - "component" → recipe wrapper + variants from `packages/recipes-{profile}/src/recipes/<name>.{tsx,variants.ts}`
 * - "block"     → block source from `packages/blocks/<name>/source/` (or node_modules equivalent)
 * - "theme"     → theme source from `packages/themes/<name>/source/`
 * - "primitive" → `packages/<name>/source/` (existing behavior)
 *
 * For "component", the styling profile is determined by `plan.stylingProfile`,
 * then `config.stylingProfile`. If neither is set, returns empty.
 */
interface ResolveDeliverableSourceOptions {
  primitive: string
  cwd: string
  deliverable: Deliverable
  config: Config
  plan: Plan
}

function resolveDeliverableSource(options: ResolveDeliverableSourceOptions): Map<string, string> {
  const { primitive, cwd, deliverable, config, plan } = options

  if (deliverable === "component") {
    return resolveComponentSource(primitive, cwd, config, plan)
  }

  if (deliverable === "block") {
    return resolveBlockSource(primitive, cwd)
  }

  if (deliverable === "theme") {
    return resolveThemeSource(primitive, cwd)
  }

  // Default: primitive source
  const primitiveSourceDir = resolvePrimitiveSource(primitive, cwd)
  if (!primitiveSourceDir) return new Map()
  return collectSourceFiles(primitiveSourceDir)
}

/**
 * Resolve component source from recipe wrapper + variants (D1, FOUND-003).
 *
 * Uses `plan.stylingProfile` or `config.stylingProfile` to select the recipe
 * package, then reads the `.tsx` wrapper and its `.variants.ts` companion from
 * `packages/recipes-{profile}/src/recipes/<name>.{tsx,variants.ts}`.
 */
function resolveComponentSource(
  component: string,
  cwd: string,
  config: Config,
  plan: Plan,
): Map<string, string> {
  const profile = plan.stylingProfile ?? config.stylingProfile
  if (!profile) return new Map()

  const recipePkg = `recipes-${profile}`
  const files = new Map<string, string>()

  // Try monorepo-relative first
  const recipeDir = join(cwd, "..", "..", "packages", recipePkg, "src", "recipes")
  if (existsSync(recipeDir)) {
    const wrapperPath = join(recipeDir, `${component}.tsx`)
    if (existsSync(wrapperPath)) {
      files.set(`${component}.tsx`, readFileSync(wrapperPath, "utf8"))
    }
    const variantsPath = join(recipeDir, `${component}.variants.ts`)
    if (existsSync(variantsPath)) {
      files.set(`${component}.variants.ts`, readFileSync(variantsPath, "utf8"))
    }
    if (files.size > 0) return files
  }

  // Try node_modules
  const nmDir = join(cwd, "node_modules", "@solidiom", recipePkg, "src", "recipes")
  if (existsSync(nmDir)) {
    const wrapperPath = join(nmDir, `${component}.tsx`)
    if (existsSync(wrapperPath)) {
      files.set(`${component}.tsx`, readFileSync(wrapperPath, "utf8"))
    }
    const variantsPath = join(nmDir, `${component}.variants.ts`)
    if (existsSync(variantsPath)) {
      files.set(`${component}.variants.ts`, readFileSync(variantsPath, "utf8"))
    }
    if (files.size > 0) return files
  }

  return files
}

/**
 * Resolve block source from `packages/blocks/<name>/source/`.
 * Blocks are content-driven and may not have a source directory yet.
 */
function resolveBlockSource(block: string, cwd: string): Map<string, string> {
  const monoPath = join(cwd, "..", "..", "packages", "blocks", block, "source")
  if (existsSync(monoPath)) return collectSourceFiles(monoPath)

  const nmPath = join(cwd, "node_modules", "@solidiom", "blocks", block, "source")
  if (existsSync(nmPath)) return collectSourceFiles(nmPath)

  return new Map()
}

/**
 * Resolve theme source from `packages/themes/<name>/source/`.
 */
function resolveThemeSource(theme: string, cwd: string): Map<string, string> {
  const monoPath = join(cwd, "..", "..", "packages", "themes", theme, "source")
  if (existsSync(monoPath)) return collectSourceFiles(monoPath)

  const nmPath = join(cwd, "node_modules", "@solidiom", "themes", theme, "source")
  if (existsSync(nmPath)) return collectSourceFiles(nmPath)

  return new Map()
}

/** Collect non-test .ts/.tsx files from a source directory. */
function collectSourceFiles(dir: string): Map<string, string> {
  const files = new Map<string, string>()
  if (!existsSync(dir)) return files

  function walk(d: string, prefix: string): void {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry)
      const rel = prefix ? `${prefix}/${entry}` : entry
      if (statSync(full).isDirectory()) {
        walk(full, rel)
      } else if ((entry.endsWith(".ts") || entry.endsWith(".tsx")) && !entry.includes(".test.")) {
        files.set(rel, readFileSync(full, "utf8"))
      }
    }
  }
  walk(dir, "")
  return files
}

/** Resolve the path to a primitive's source/ directory. */
function resolvePrimitiveSource(primitive: string, cwd: string): string | null {
  // Try monorepo-relative first (for development)
  const monoPath = join(cwd, "..", "..", "packages", primitive, "source")
  if (existsSync(monoPath)) return monoPath

  // Try node_modules
  const nmPath = join(cwd, "node_modules", "@solidiom", primitive, "source")
  if (existsSync(nmPath)) return nmPath

  return null
}

/** Resolve the path to runtime source files. */
function resolveRuntimeSource(cwd: string): string | null {
  const monoPath = join(cwd, "..", "..", "packages", "runtime", "src")
  if (existsSync(monoPath)) return monoPath

  const nmPath = join(cwd, "node_modules", "@solidiom", "runtime", "src")
  if (existsSync(nmPath)) return nmPath

  return null
}
