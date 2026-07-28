/**
 * Source install engine — materializes primitive source files into the consumer project.
 *
 * Responsibilities:
 * 1. Copy canonical source files to the configured sourceDir.
 * 2. Deduplicate shared _runtime modules across installed primitives.
 * 3. Rewrite @solidiom/runtime imports to relative paths.
 * 4. Write/update .solidiom/lock.json with installed file digests.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { createHash } from "node:crypto"
import { ConfigSchema, type Config } from "../schemas"
import type { Plan } from "../commands/plan"

export interface SourceInstallOptions {
  primitive: string
  cwd: string
  plan: Plan
  dryRun?: boolean
}

export interface SourceInstallResult {
  filesWritten: string[]
  runtimeDeduped: string[]
  lockUpdated: boolean
}

/** An entry in .solidiom/lock.json tracking source installs. */
export interface LockEntry {
  /** Relative path from project root. */
  path: string
  /** SHA-256 digest of original source content. */
  digest: string
  /** Source primitive this file belongs to. */
  primitive: string
  /** Version at time of install. */
  version: string
  /** Whether this file has been detached from updates. */
  detached?: boolean
}

export interface LockFile {
  version: 1
  installed: Record<string, LockEntry>
}

/** Compute SHA-256 digest of content. */
export function computeDigest(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

/** Read existing lockfile, or create fresh. */
export function readLock(cwd: string): LockFile {
  const lockPath = join(cwd, ".solidiom", "lock.json")
  if (existsSync(lockPath)) {
    return JSON.parse(readFileSync(lockPath, "utf8"))
  }
  return { version: 1, installed: {} }
}

/** Write lockfile. */
export function writeLock(cwd: string, lock: LockFile): void {
  const lockPath = join(cwd, ".solidiom", "lock.json")
  mkdirSync(dirname(lockPath), { recursive: true })
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n")
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
 */
export function installSource(options: SourceInstallOptions): SourceInstallResult {
  const { primitive, cwd, plan, dryRun = false } = options

  // Load config
  const configPath = join(cwd, ".solidiom", "config.json")
  const config: Config = existsSync(configPath)
    ? ConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8")))
    : ConfigSchema.parse({})

  const sourceDir = join(cwd, config.sourceDir)
  const runtimeDir = join(cwd, config.runtimeDir)
  const filesWritten: string[] = []
  const runtimeDeduped: string[] = []

  // Find the primitive's source/ directory (from monorepo or node_modules)
  const primitiveSourceDir = resolvePrimitiveSource(primitive, cwd)
  if (!primitiveSourceDir) {
    return { filesWritten: [], runtimeDeduped: [], lockUpdated: false }
  }

  // Load lockfile
  const lock = readLock(cwd)

  // 1. Copy primitive source files
  const primitiveTarget = join(sourceDir, primitive)
  if (!dryRun) mkdirSync(primitiveTarget, { recursive: true })

  const sourceFiles = collectSourceFiles(primitiveSourceDir)
  for (const [relPath, content] of sourceFiles) {
    const targetPath = join(primitiveTarget, relPath)
    const rewritten = rewriteImports(content, targetPath, runtimeDir)

    if (!dryRun) {
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
    }
  }

  // 2. Deduplicate runtime — copy runtime modules if not already present
  const runtimePkgSource = resolveRuntimeSource(cwd)
  if (runtimePkgSource) {
    const runtimeFiles = collectRuntimeFiles(runtimePkgSource)
    if (!dryRun) mkdirSync(runtimeDir, { recursive: true })

    for (const [relPath, content] of runtimeFiles) {
      const targetPath = join(runtimeDir, relPath)
      const relFromCwd = relative(cwd, targetPath)

      // Only write if not already present (deduplication)
      if (!existsSync(targetPath)) {
        if (!dryRun) {
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
      }
    }
  }

  // 3. Write lockfile
  if (!dryRun) {
    writeLock(cwd, lock)
  }

  return { filesWritten, runtimeDeduped, lockUpdated: !dryRun }
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
