/**
 * Package-manager detection (CLI-005).
 *
 * Determines which of npm/pnpm/yarn/bun a project uses, and how that
 * determination was made, so commands can execute the right binary with the
 * right flags instead of hardcoding a single manager (the `pnpm add ...`
 * string this replaces in add.ts).
 *
 * Precedence, highest first:
 *   1. Explicit --package-manager flag (caller-supplied override).
 *   2. npm_config_user_agent — set by npm/pnpm/yarn/bun themselves when a
 *      script is run through them; the most reliable live signal.
 *   3. The nearest project-root lockfile, walking up from cwd.
 *   4. The "packageManager" field in the nearest package.json.
 *   5. Default: npm.
 *
 * No step here executes a package manager or touches the network — this
 * module only reads local files and environment variables.
 */

import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"

export type PackageManagerName = "npm" | "pnpm" | "yarn" | "bun"

export type DetectionSource =
  | "flag"
  | "npm_config_user_agent"
  | "lockfile"
  | "packageManager-field"
  | "default"

export interface DetectedPackageManager {
  name: PackageManagerName
  /** The major version, when it could be determined (matters for yarn's v1 vs v3+ CLI surface). */
  majorVersion?: number
  source: DetectionSource
}

const LOCKFILE_TO_MANAGER: Record<string, PackageManagerName> = {
  "pnpm-lock.yaml": "pnpm",
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "bun.lock": "bun",
}

/** Names accepted for --package-manager / explicit overrides. */
const VALID_NAMES = new Set<PackageManagerName>(["npm", "pnpm", "yarn", "bun"])

export function isPackageManagerName(value: string): value is PackageManagerName {
  return VALID_NAMES.has(value as PackageManagerName)
}

/**
 * Parses the `npm_config_user_agent` environment variable, e.g.
 * "pnpm/9.1.0 npm/? node/v20.11.0 darwin x64" or "yarn/3.6.4 npm/? node/...".
 * Returns null if the variable is absent or unrecognized.
 */
function parseUserAgent(userAgent: string | undefined): DetectedPackageManager | null {
  if (!userAgent) return null
  const match = userAgent.match(/^(npm|pnpm|yarn|bun)\/(\d+)/)
  if (!match) return null
  const [, name, major] = match
  if (!isPackageManagerName(name!)) return null
  return { name, majorVersion: Number(major), source: "npm_config_user_agent" }
}

/**
 * Walks up from `from` looking for a lockfile. Stops at the filesystem root
 * or after `maxDepth` levels, whichever comes first — mirrors the walk-up
 * bound already used by `findWorkspaceRoot` in commands/audit.ts.
 */
function findLockfile(from: string, maxDepth = 10): { manager: PackageManagerName; dir: string } | null {
  let dir = from
  for (let i = 0; i < maxDepth; i++) {
    for (const [file, manager] of Object.entries(LOCKFILE_TO_MANAGER)) {
      if (existsSync(join(dir, file))) {
        return { manager, dir }
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/**
 * Reads the "packageManager" field (Corepack convention, e.g.
 * "pnpm@9.1.0") from the nearest package.json, walking up from `from`.
 */
function findPackageManagerField(
  from: string,
  maxDepth = 10,
): { name: PackageManagerName; majorVersion?: number } | null {
  let dir = from
  for (let i = 0; i < maxDepth; i++) {
    const pkgPath = join(dir, "package.json")
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
        const field = pkg["packageManager"]
        if (typeof field === "string") {
          const match = field.match(/^(npm|pnpm|yarn|bun)@(\d+)/)
          if (match && isPackageManagerName(match[1]!)) {
            return { name: match[1], majorVersion: Number(match[2]) }
          }
        }
      } catch {
        // Malformed package.json — not this function's concern; keep walking.
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

export interface DetectPackageManagerOptions {
  cwd: string
  /** Explicit override, e.g. from a --package-manager CLI flag. Highest precedence. */
  override?: string
  /** Injectable for tests; defaults to `process.env`. */
  env?: Record<string, string | undefined>
}

/**
 * Detects which package manager a project uses, following the precedence
 * documented at the top of this file. Always returns a result — the final
 * fallback is npm — so callers never need to handle "unknown".
 */
export function detectPackageManager(options: DetectPackageManagerOptions): DetectedPackageManager {
  const { cwd, override, env = process.env } = options

  if (override) {
    if (!isPackageManagerName(override)) {
      throw new Error(
        `Unknown package manager "${override}" — expected one of: npm, pnpm, yarn, bun`,
      )
    }
    return { name: override, source: "flag" }
  }

  const fromUserAgent = parseUserAgent(env["npm_config_user_agent"])
  if (fromUserAgent) return fromUserAgent

  const lockfile = findLockfile(cwd)
  if (lockfile) {
    return { name: lockfile.manager, source: "lockfile" }
  }

  const packageManagerField = findPackageManagerField(cwd)
  if (packageManagerField) {
    return {
      name: packageManagerField.name,
      majorVersion: packageManagerField.majorVersion,
      source: "packageManager-field",
    }
  }

  return { name: "npm", source: "default" }
}
