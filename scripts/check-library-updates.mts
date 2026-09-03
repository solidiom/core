#!/usr/bin/env npx tsx
/**
 * Checks the key third-party libraries of the workspace for new versions.
 *
 * The library list lives in tools/key-libraries.json (names only). Declared
 * versions are discovered from the workspace itself — root package.json, the
 * pnpm-workspace.yaml catalog/overrides, and every workspace package manifest —
 * so this script never carries a stale copy of a version number.
 *
 * For each library it reports:
 *   • the installed version (resolved from node_modules) and every declared range
 *   • the newest release on the same channel (prerelease lines are tracked on
 *     their own pre-id, e.g. 2.0.0-beta.24 → 2.0.0-beta.31)
 *   • whether an existing range already allows the new version (`pnpm update`)
 *     or whether the range itself needs bumping
 *   • version drift, i.e. the same library declared at different versions in
 *     different workspace manifests
 *
 * Usage:
 *   pnpm tsx scripts/check-library-updates.mts
 *   pnpm tsx scripts/check-library-updates.mts --group solid,adapters
 *   pnpm tsx scripts/check-library-updates.mts --only solid-js
 *   pnpm tsx scripts/check-library-updates.mts --verbose
 *   pnpm tsx scripts/check-library-updates.mts --json > artifacts/library-updates.json
 *   pnpm tsx scripts/check-library-updates.mts --fail-on-outdated   # CI mode
 *
 * Exit codes:
 *   0  no updates found, or updates found without --fail-on-outdated
 *   1  updates found and --fail-on-outdated was passed
 *   2  one or more registry lookups failed (result is inconclusive)
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = join(import.meta.dirname!, "..")
const DEFAULT_REGISTRY = process.env.npm_config_registry ?? "https://registry.npmjs.org"

// ───────────────────────────── types ─────────────────────────────

interface LibraryGroup {
  id: string
  title: string
  note?: string
  packages: string[]
}

interface KeyLibraries {
  description?: string
  groups: LibraryGroup[]
}

/** One place in the workspace where a library version is declared. */
interface Declaration {
  /** Repo-relative file the declaration was read from. */
  source: string
  /** Manifest field, e.g. "devDependencies" or "catalog". */
  field: string
  /** The raw range as written, e.g. "^1.6.0" or "2.0.0-beta.24". */
  range: string
  /** Directory used to resolve the installed copy for this declaration. */
  dir: string
}

interface Installed {
  version: string
  /** Repo-relative path of the resolved node_modules copy. */
  path: string
}

type UpdateKind = "major" | "minor" | "patch" | "prerelease" | "none"

interface PackageResult {
  name: string
  group: string
  declarations: Declaration[]
  installed: Installed[]
  /** Version used as the comparison baseline (max installed, else max declared). */
  current: string | null
  currentFrom: "installed" | "declared" | null
  /** Newest version on the same channel as `current`. */
  target: string | null
  updateKind: UpdateKind
  /** Set when `current` is a prerelease and a newer stable exists. */
  stableAvailable: string | null
  latest: string | null
  distTags: Record<string, string>
  /** Ranges that already allow `target` (a plain `pnpm update` picks it up). */
  rangesAllowingTarget: Declaration[]
  /** Ranges that must be edited to reach `target`. */
  rangesBlockingTarget: Declaration[]
  /** Distinct declared/installed versions across the workspace, when > 1. */
  drift: string[]
  error: string | null
}

// ───────────────────────────── semver ─────────────────────────────

interface SemVer {
  major: number
  minor: number
  patch: number
  prerelease: Array<string | number>
  raw: string
}

function parseSemver(input: string): SemVer | null {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(input.trim())
  if (!m) return null
  const prerelease = m[4]
    ? m[4].split(".").map((part) => (/^\d+$/.test(part) ? Number(part) : part))
    : []
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease,
    raw: input.trim(),
  }
}

function compareIdentifiers(a: string | number, b: string | number): number {
  const aNum = typeof a === "number"
  const bNum = typeof b === "number"
  if (aNum && bNum) return a < b ? -1 : a > b ? 1 : 0
  if (aNum) return -1
  if (bNum) return 1
  return a < b ? -1 : a > b ? 1 : 0
}

function compareSemver(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0
  if (a.prerelease.length === 0) return 1
  if (b.prerelease.length === 0) return -1
  const len = Math.max(a.prerelease.length, b.prerelease.length)
  for (let i = 0; i < len; i++) {
    const av = a.prerelease[i]
    const bv = b.prerelease[i]
    if (av === undefined) return -1
    if (bv === undefined) return 1
    const cmp = compareIdentifiers(av, bv)
    if (cmp !== 0) return cmp
  }
  return 0
}

function maxVersion(versions: string[]): string | null {
  let best: SemVer | null = null
  for (const v of versions) {
    const parsed = parseSemver(v)
    if (!parsed) continue
    if (!best || compareSemver(parsed, best) > 0) best = parsed
  }
  return best?.raw ?? null
}

/** The prerelease identifier line, e.g. "beta" for 2.0.0-beta.24. */
function prereleaseId(v: SemVer): string | null {
  if (v.prerelease.length === 0) return null
  const first = v.prerelease[0]
  return typeof first === "string" ? first : String(first)
}

function classifyUpdate(from: SemVer, to: SemVer): UpdateKind {
  if (compareSemver(to, from) <= 0) return "none"
  if (to.major !== from.major) return "major"
  if (to.minor !== from.minor) return "minor"
  if (to.patch !== from.patch) return "patch"
  return "prerelease"
}

// ─────────────────────── semver range matching ───────────────────────

interface Bound {
  op: ">=" | ">" | "<=" | "<" | "="
  version: SemVer
}

function fillPartial(parts: string[]): {
  major: number
  minor: number
  patch: number
} {
  return {
    major: Number(parts[0] ?? 0),
    minor: Number(parts[1] ?? 0),
    patch: Number(parts[2] ?? 0),
  }
}

/** Expand one comparator into concrete bounds. Returns null if unsupported. */
function comparatorBounds(raw: string): Bound[] | null {
  const c = raw.trim()
  if (c === "" || c === "*" || c === "x" || c === "latest") return []

  const opMatch = /^(>=|<=|>|<|=)?\s*v?(.+)$/.exec(c)
  if (!opMatch) return null

  if (c.startsWith("^") || c.startsWith("~")) {
    const kind = c[0]
    const body = c.slice(1).trim()
    const parsed = parseSemver(body) ?? parseSemver(normalizePartial(body))
    if (!parsed) return null
    const explicitParts = (body.split("+")[0] ?? "").split("-")[0]?.split(".").length ?? 1
    const lower: Bound = { op: ">=", version: parsed }
    let upper: SemVer | null
    if (kind === "^") {
      if (parsed.major !== 0) upper = parseSemver(`${parsed.major + 1}.0.0-0`)
      else if (parsed.minor !== 0 || explicitParts >= 2) {
        upper = parseSemver(`0.${parsed.minor + 1}.0-0`)
      } else upper = parseSemver(`1.0.0-0`)
      // ^0.0.z → only 0.0.z
      if (parsed.major === 0 && parsed.minor === 0 && explicitParts >= 3) {
        upper = parseSemver(`0.0.${parsed.patch + 1}-0`)
      }
    } else {
      upper =
        explicitParts >= 2
          ? parseSemver(`${parsed.major}.${parsed.minor + 1}.0-0`)
          : parseSemver(`${parsed.major + 1}.0.0-0`)
    }
    if (!upper) return null
    return [lower, { op: "<", version: upper }]
  }

  const op = (opMatch[1] ?? "=") as Bound["op"]
  const body = (opMatch[2] ?? "").trim()
  const parsed = parseSemver(body) ?? parseSemver(normalizePartial(body))
  if (!parsed) return null
  return [{ op, version: parsed }]
}

function normalizePartial(body: string): string {
  const clean = body.split("+")[0] ?? body
  const [core, pre] = clean.split("-", 2)
  const parts = (core ?? "").split(".")
  if (parts.length === 0 || parts.some((p) => !/^\d+$/.test(p))) return body
  const { major, minor, patch } = fillPartial(parts)
  return `${major}.${minor}.${patch}${pre ? `-${pre}` : ""}`
}

/**
 * Whether `version` satisfies `range`. Returns null when the range uses syntax
 * this checker does not model (so callers can say "unknown" instead of guessing).
 */
function satisfies(version: string, range: string): boolean | null {
  const v = parseSemver(version)
  if (!v) return null
  const trimmed = range.trim()
  if (trimmed === "" || trimmed === "*") return true

  const alternatives = trimmed.split("||")
  let anyUnsupported = false

  for (const alt of alternatives) {
    const comparators = alt.trim().split(/\s+/).filter(Boolean)
    const bounds: Bound[] = []
    let unsupported = false
    for (const comparator of comparators) {
      const expanded = comparatorBounds(comparator)
      if (expanded === null) {
        unsupported = true
        break
      }
      bounds.push(...expanded)
    }
    if (unsupported) {
      anyUnsupported = true
      continue
    }
    if (matchesBounds(v, bounds)) return true
  }
  return anyUnsupported ? null : false
}

function matchesBounds(v: SemVer, bounds: Bound[]): boolean {
  for (const bound of bounds) {
    const cmp = compareSemver(v, bound.version)
    const ok =
      bound.op === ">="
        ? cmp >= 0
        : bound.op === ">"
          ? cmp > 0
          : bound.op === "<="
            ? cmp <= 0
            : bound.op === "<"
              ? cmp < 0
              : cmp === 0
    if (!ok) return false
  }
  // A prerelease only satisfies a range if some bound pins the same
  // major.minor.patch with a prerelease of its own (npm semver rule).
  if (v.prerelease.length > 0) {
    const allowed = bounds.some(
      (b) =>
        b.version.prerelease.length > 0 &&
        b.version.major === v.major &&
        b.version.minor === v.minor &&
        b.version.patch === v.patch,
    )
    if (!allowed) return false
  }
  return true
}

/** Lowest version a range can resolve to, used as a declared-version baseline. */
function rangeFloor(range: string): string | null {
  const first = range.split("||")[0] ?? range
  const comparators = first.trim().split(/\s+/).filter(Boolean)
  for (const comparator of comparators) {
    const bounds = comparatorBounds(comparator)
    if (!bounds) continue
    const lower = bounds.find((b) => b.op === ">=" || b.op === "=")
    if (lower) return lower.version.raw
  }
  return null
}

/** True when the range pins one exact version (no ^, ~ or comparator prefix). */
function isExactPin(range: string): boolean {
  return parseSemver(range) !== null
}

// ─────────────────────── workspace discovery ───────────────────────

const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]

function readJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

/** Read the `packages:` globs from pnpm-workspace.yaml and expand `dir/*` forms. */
function workspaceManifestPaths(): string[] {
  const wsPath = join(ROOT, "pnpm-workspace.yaml")
  const dirs = new Set<string>([ROOT])
  const content = existsSync(wsPath) ? readFileSync(wsPath, "utf8") : ""
  const globs: string[] = []
  let inPackages = false
  for (const line of content.split("\n")) {
    if (/^packages:\s*$/.test(line)) {
      inPackages = true
      continue
    }
    if (inPackages) {
      const item = /^\s*-\s*"?([^"#]+?)"?\s*$/.exec(line)
      if (item) globs.push((item[1] ?? "").trim())
      else if (line.trim() !== "") break
    }
  }
  for (const glob of globs) {
    if (glob.endsWith("/*")) {
      const base = join(ROOT, glob.slice(0, -2))
      if (!existsSync(base)) continue
      for (const entry of readdirSync(base)) {
        const dir = join(base, entry)
        if (statSync(dir).isDirectory()) dirs.add(dir)
      }
    } else {
      const dir = join(ROOT, glob)
      if (existsSync(dir)) dirs.add(dir)
    }
  }
  return [...dirs]
    .map((dir) => join(dir, "package.json"))
    .filter((path) => existsSync(path))
    .sort((a, b) => a.length - b.length)
}

/** Parse the `catalog:` and `overrides:` blocks of pnpm-workspace.yaml. */
function readWorkspaceYamlSections(): {
  catalog: Record<string, string>
  overrides: Record<string, string>
} {
  const wsPath = join(ROOT, "pnpm-workspace.yaml")
  const result = {
    catalog: {} as Record<string, string>,
    overrides: {} as Record<string, string>,
  }
  if (!existsSync(wsPath)) return result
  let section: "catalog" | "overrides" | null = null
  for (const line of readFileSync(wsPath, "utf8").split("\n")) {
    if (/^catalog:\s*$/.test(line)) {
      section = "catalog"
      continue
    }
    if (/^overrides:\s*$/.test(line)) {
      section = "overrides"
      continue
    }
    if (/^\S/.test(line)) {
      section = null
      continue
    }
    if (!section) continue
    const entry = /^\s+"?((?:@[^"\s/]+\/)?[^":\s]+)"?\s*:\s*"?([^"#]+?)"?\s*$/.exec(line)
    if (entry?.[1] && entry[2]) result[section][entry[1]] = entry[2].trim()
  }
  return result
}

const SKIP_PROTOCOLS = /^(workspace:|link:|file:|npm:|git|github:|https?:|portal:)/

function collectDeclarations(tracked: Set<string>): Map<string, Declaration[]> {
  const byName = new Map<string, Declaration[]>()
  const sections = readWorkspaceYamlSections()

  const add = (name: string, decl: Declaration) => {
    if (!tracked.has(name)) return
    const list = byName.get(name) ?? []
    list.push(decl)
    byName.set(name, list)
  }

  // pnpm-workspace.yaml catalog + overrides
  for (const field of ["catalog", "overrides"] as const) {
    for (const [name, range] of Object.entries(sections[field])) {
      add(name, { source: "pnpm-workspace.yaml", field, range, dir: ROOT })
    }
  }

  // every workspace package.json
  for (const manifestPath of workspaceManifestPaths()) {
    const pkg = readJSON<Record<string, unknown>>(manifestPath)
    if (!pkg) continue
    const source = relative(ROOT, manifestPath) || "package.json"
    const dir = join(manifestPath, "..")
    for (const field of DEP_FIELDS) {
      const deps = pkg[field] as Record<string, string> | undefined
      if (!deps) continue
      for (const [name, rawRange] of Object.entries(deps)) {
        if (typeof rawRange !== "string") continue
        const range = rawRange.trim()
        // `catalog:` entries are already reported once from the catalog block.
        if (range.startsWith("catalog:")) continue
        if (SKIP_PROTOCOLS.test(range)) continue
        add(name, { source, field, range, dir })
      }
    }
  }

  return byName
}

function resolveInstalled(name: string, dirs: string[]): Installed[] {
  const seen = new Map<string, Installed>()
  for (const dir of dirs) {
    let current = dir
    for (let depth = 0; depth < 6; depth++) {
      const candidate = join(current, "node_modules", name, "package.json")
      if (existsSync(candidate)) {
        const pkg = readJSON<{ version?: string }>(candidate)
        if (pkg?.version) {
          const path = relative(ROOT, candidate)
          if (!seen.has(path)) seen.set(path, { version: pkg.version, path })
        }
        break
      }
      const parent = join(current, "..")
      if (parent === current || !parent.startsWith(ROOT)) break
      current = parent
    }
  }
  return [...seen.values()]
}

// ───────────────────────────── registry ─────────────────────────────

interface Packument {
  "dist-tags"?: Record<string, string>
  versions?: Record<string, unknown>
}

async function fetchPackument(
  name: string,
  registry: string,
  timeoutMs: number,
): Promise<{ distTags: Record<string, string>; versions: string[] }> {
  const url = `${registry.replace(/\/$/, "")}/${encodeURIComponent(name)}`
  const res = await fetch(url, {
    headers: { accept: "application/vnd.npm.install-v1+json" },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  const body = (await res.json()) as Packument
  return {
    distTags: body["dist-tags"] ?? {},
    versions: Object.keys(body.versions ?? {}),
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++
      const item = items[index]
      if (index >= items.length || item === undefined) return
      results[index] = await fn(item)
    }
  })
  await Promise.all(workers)
  return results
}

// ───────────────────────────── analysis ─────────────────────────────

function analyze(
  name: string,
  group: string,
  declarations: Declaration[],
  installed: Installed[],
  registryData: { distTags: Record<string, string>; versions: string[] } | Error,
): PackageResult {
  const base: PackageResult = {
    name,
    group,
    declarations,
    installed,
    current: null,
    currentFrom: null,
    target: null,
    updateKind: "none",
    stableAvailable: null,
    latest: null,
    distTags: {},
    rangesAllowingTarget: [],
    rangesBlockingTarget: [],
    drift: [],
    error: registryData instanceof Error ? registryData.message : null,
  }

  // Baseline: prefer what is actually installed, else the floor of declared ranges.
  const installedMax = maxVersion(installed.map((i) => i.version))
  const declaredFloors = declarations
    .map((d) => rangeFloor(d.range))
    .filter((v): v is string => v !== null)
  const declaredMax = maxVersion(declaredFloors)
  base.current = installedMax ?? declaredMax
  base.currentFrom = installedMax ? "installed" : declaredMax ? "declared" : null

  // Drift: the same library pinned to different exact versions across the
  // workspace, or resolved to different versions in node_modules. Open ranges
  // are excluded — they are not a pin and cannot disagree.
  const distinct = new Set<string>([
    ...installed.map((i) => i.version),
    ...declarations.filter((d) => isExactPin(d.range)).map((d) => d.range.trim()),
  ])
  if (distinct.size > 1) {
    base.drift = [...distinct].sort((a, b) => {
      const pa = parseSemver(a)
      const pb = parseSemver(b)
      if (!pa || !pb) return a.localeCompare(b)
      return compareSemver(pa, pb)
    })
  }

  if (registryData instanceof Error) return base

  base.distTags = registryData.distTags
  base.latest = registryData.distTags.latest ?? null

  const current = base.current ? parseSemver(base.current) : null
  const published = registryData.versions.map(parseSemver).filter((v): v is SemVer => v !== null)

  // The `latest` dist-tag is not necessarily a stable release (e.g. @solidjs/web
  // currently tags a prerelease as latest), so derive the stable line explicitly.
  const newestStable = published
    .filter((v) => v.prerelease.length === 0)
    .reduce<SemVer | null>((a, b) => (!a || compareSemver(b, a) > 0 ? b : a), null)
  const newestOverall = published.reduce<SemVer | null>(
    (a, b) => (!a || compareSemver(b, a) > 0 ? b : a),
    null,
  )

  if (!current) {
    base.target = (newestStable ?? newestOverall)?.raw ?? null
    return base
  }

  const preId = prereleaseId(current)
  let target: SemVer | null
  if (preId) {
    // Track the same prerelease line (e.g. beta.N → beta.N+k) within the same major.
    const sameLine = published.filter((v) => v.major === current.major && prereleaseId(v) === preId)
    target = sameLine.reduce<SemVer | null>((a, b) => (!a || compareSemver(b, a) > 0 ? b : a), null)
    if (!target || compareSemver(current, target) > 0) target = current
    // A stable release supersedes the prerelease line entirely — surface it
    // separately rather than folding it into the target.
    if (newestStable && compareSemver(newestStable, current) > 0) {
      base.stableAvailable = newestStable.raw
    }
  } else {
    target = newestStable && compareSemver(newestStable, current) > 0 ? newestStable : current
  }

  base.target = target.raw
  base.updateKind = classifyUpdate(current, target)

  if (base.updateKind !== "none") {
    for (const decl of declarations) {
      const ok = satisfies(target.raw, decl.range)
      if (ok === true) base.rangesAllowingTarget.push(decl)
      else if (ok === false) base.rangesBlockingTarget.push(decl)
    }
  }

  return base
}

// ───────────────────────────── output ─────────────────────────────

const useColor =
  process.env.NO_COLOR === undefined &&
  !process.argv.includes("--no-color") &&
  process.stdout.isTTY === true

const paint = (code: string, s: string) => (useColor ? `\u001B[${code}m${s}\u001B[0m` : s)
const dim = (s: string) => paint("2", s)
const bold = (s: string) => paint("1", s)
const green = (s: string) => paint("32", s)
const yellow = (s: string) => paint("33", s)
const red = (s: string) => paint("31", s)
const cyan = (s: string) => paint("36", s)

function kindLabel(kind: UpdateKind): string {
  switch (kind) {
    case "major":
      return red("major")
    case "minor":
      return yellow("minor")
    case "patch":
      return cyan("patch")
    case "prerelease":
      return cyan("prerelease")
    default:
      return dim("none")
  }
}

function printHuman(groups: LibraryGroup[], results: PackageResult[], verbose: boolean): void {
  const byName = new Map(results.map((r) => [r.name, r]))
  const nameWidth = Math.min(34, Math.max(...results.map((r) => r.name.length), 12))

  for (const group of groups) {
    const groupResults = group.packages
      .map((name) => byName.get(name))
      .filter((r): r is PackageResult => r !== undefined)
    if (groupResults.length === 0) continue

    console.log(`\n${bold(group.title)}${group.note ? dim(`  — ${group.note}`) : ""}`)

    for (const r of groupResults) {
      const name = r.name.padEnd(nameWidth)
      if (r.error) {
        console.log(`  ${yellow("!")} ${name}  ${dim(`lookup failed: ${r.error}`)}`)
        continue
      }
      if (r.declarations.length === 0 && r.installed.length === 0) {
        console.log(`  ${dim("·")} ${name}  ${dim("not declared in this workspace")}`)
        continue
      }
      const current = r.current ?? "unknown"
      if (r.updateKind === "none") {
        console.log(`  ${green("✓")} ${name}  ${current}  ${dim("up to date")}`)
      } else {
        console.log(
          `  ${yellow("↑")} ${name}  ${current} ${dim("→")} ${bold(r.target ?? "?")}  ${kindLabel(r.updateKind)}`,
        )
      }

      const showDetails =
        verbose || r.updateKind !== "none" || r.drift.length > 0 || r.stableAvailable
      if (!showDetails) continue

      if (r.stableAvailable) {
        console.log(
          `      ${yellow("stable available:")} ${r.stableAvailable} ${dim("(prerelease line is being tracked)")}`,
        )
      }
      if (r.drift.length > 0) {
        console.log(`      ${yellow("pin drift:")} ${r.drift.join(", ")}`)
      }
      if (verbose) {
        for (const inst of r.installed) {
          console.log(`      ${dim(`installed ${inst.version}  ${inst.path}`)}`)
        }
      }
      for (const line of collapseDeclarations(r, verbose)) {
        console.log(`      ${line}`)
      }
    }
  }
}

/**
 * Collapse declarations that share a range + field + verdict into one line.
 * Without this, a peer range repeated across ~60 primitive packages would bury
 * the actual signal.
 */
function collapseDeclarations(r: PackageResult, verbose: boolean): string[] {
  interface Bucket {
    range: string
    field: string
    verdict: "allows" | "blocks" | "unmodelled" | "none"
    sources: string[]
  }
  const buckets = new Map<string, Bucket>()
  for (const decl of r.declarations) {
    const verdict: Bucket["verdict"] =
      r.updateKind === "none"
        ? "none"
        : r.rangesAllowingTarget.includes(decl)
          ? "allows"
          : r.rangesBlockingTarget.includes(decl)
            ? "blocks"
            : "unmodelled"
    const key = `${decl.field}|${decl.range}|${verdict}`
    const bucket = buckets.get(key) ?? {
      range: decl.range,
      field: decl.field,
      verdict,
      sources: [],
    }
    bucket.sources.push(decl.source)
    buckets.set(key, bucket)
  }

  const order = { blocks: 0, unmodelled: 1, allows: 2, none: 3 }
  const lines: string[] = []
  for (const bucket of [...buckets.values()].sort((a, b) => order[a.verdict] - order[b.verdict])) {
    const shown = verbose ? bucket.sources : bucket.sources.slice(0, 2)
    const rest = bucket.sources.length - shown.length
    const where = shown.join(", ") + (rest > 0 ? dim(` +${rest} more`) : "")
    const verdict =
      bucket.verdict === "allows"
        ? green("  allows target — pnpm update")
        : bucket.verdict === "blocks"
          ? yellow("  needs range bump")
          : bucket.verdict === "unmodelled"
            ? dim("  range syntax not modelled")
            : ""
    const count = bucket.sources.length > 1 ? dim(` ×${bucket.sources.length}`) : ""
    lines.push(
      `${dim("declared")} ${bucket.range.padEnd(16)}${count} ${dim(`${bucket.field}: ${where}`)}${verdict}`,
    )
  }
  return lines
}

function printSummary(results: PackageResult[]): void {
  const checked = results.filter(
    (r) => !r.error && (r.declarations.length > 0 || r.installed.length > 0),
  )
  const updates = checked.filter((r) => r.updateKind !== "none")
  const major = updates.filter((r) => r.updateKind === "major")
  const drift = checked.filter((r) => r.drift.length > 0)
  const errors = results.filter((r) => r.error)
  const missing = results.filter(
    (r) => !r.error && r.declarations.length === 0 && r.installed.length === 0,
  )

  console.log(`\n${"═".repeat(60)}`)
  console.log(
    `${checked.length} key libraries checked — ${updates.length} with updates ` +
      `(${major.length} major), ${drift.length} with workspace drift, ` +
      `${errors.length} lookup ${errors.length === 1 ? "error" : "errors"}`,
  )
  if (missing.length > 0) {
    console.log(
      dim(
        `Listed in tools/key-libraries.json but not declared: ${missing.map((r) => r.name).join(", ")}`,
      ),
    )
  }

  if (updates.length > 0) {
    const updatable = updates.filter((r) => r.rangesAllowingTarget.length > 0)
    const needsBump = updates.filter(
      (r) => r.rangesAllowingTarget.length === 0 && r.rangesBlockingTarget.length > 0,
    )
    console.log()
    if (updatable.length > 0) {
      console.log(`Within existing ranges — ${bold("pnpm update")} is enough:`)
      console.log(`  pnpm update ${updatable.map((r) => r.name).join(" ")}`)
    }
    if (needsBump.length > 0) {
      console.log(`\nRanges must be bumped in the manifests:`)
      for (const r of needsBump) {
        console.log(
          `  ${r.name} → ${r.target}  (${r.rangesBlockingTarget.map((d) => d.source).join(", ")})`,
        )
      }
    }
    const solidUpdates = updates.filter((r) =>
      ["solid-js", "@solidjs/web", "babel-preset-solid"].includes(r.name),
    )
    if (solidUpdates.length > 0) {
      const newest = maxVersion(solidUpdates.map((r) => r.target ?? "")) ?? ""
      console.log(
        `\nSolid toolchain moved. Shift the beta window with:\n` +
          `  pnpm tsx scripts/update-solid-window.mts ${newest} --dry-run`,
      )
    }
  }
}

// ───────────────────────────── cli ─────────────────────────────

function parseArgs(argv: string[]) {
  const opts = {
    json: false,
    verbose: false,
    failOnOutdated: false,
    groups: [] as string[],
    only: [] as string[],
    registry: DEFAULT_REGISTRY,
    timeout: 15_000,
    concurrency: 8,
    help: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? ""
    const value = () => argv[++i]
    switch (arg) {
      case "--json":
        opts.json = true
        break
      case "--verbose":
      case "-v":
        opts.verbose = true
        break
      case "--fail-on-outdated":
      case "--ci":
        opts.failOnOutdated = true
        break
      case "--group":
      case "-g":
        opts.groups.push(...(value() ?? "").split(",").filter(Boolean))
        break
      case "--only":
        opts.only.push(...(value() ?? "").split(",").filter(Boolean))
        break
      case "--registry":
        opts.registry = value() ?? DEFAULT_REGISTRY
        break
      case "--timeout":
        opts.timeout = Number(value())
        break
      case "--concurrency":
        opts.concurrency = Number(value())
        break
      case "--no-color":
        break
      case "--help":
      case "-h":
        opts.help = true
        break
      default:
        if (arg.startsWith("-")) {
          console.error(`Unknown flag: ${arg}`)
          process.exit(2)
        }
    }
  }
  return opts
}

const HELP = `Check the workspace's key libraries for new releases.

Usage: pnpm tsx scripts/check-library-updates.mts [options]

Options:
  -g, --group <ids>       Only these groups (comma-separated). Groups are defined
                          in tools/key-libraries.json.
      --only <names>      Only these package names (comma-separated).
  -v, --verbose           Show declarations and installed paths for every library.
      --json              Emit a machine-readable report on stdout.
      --fail-on-outdated  Exit 1 when any update is available (CI mode). --ci is an alias.
      --registry <url>    Registry base URL (default: ${DEFAULT_REGISTRY}).
      --timeout <ms>      Per-request timeout (default: 15000).
      --concurrency <n>   Parallel registry requests (default: 8).
      --no-color          Disable ANSI colors.
  -h, --help              Show this help.

Exit codes: 0 ok · 1 updates found with --fail-on-outdated · 2 registry lookup failed`

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    console.log(HELP)
    process.exit(0)
  }

  const manifest = readJSON<KeyLibraries>(join(ROOT, "tools/key-libraries.json"))
  if (!manifest?.groups) {
    console.error("Could not read tools/key-libraries.json")
    process.exit(2)
  }

  let groups = manifest.groups
  if (opts.groups.length > 0) {
    groups = groups.filter((g) => opts.groups.includes(g.id))
    if (groups.length === 0) {
      console.error(`No matching groups. Available: ${manifest.groups.map((g) => g.id).join(", ")}`)
      process.exit(2)
    }
  }
  if (opts.only.length > 0) {
    const matches = (name: string) =>
      opts.only.some((needle) => name === needle || name.includes(needle))
    groups = groups
      .map((g) => ({ ...g, packages: g.packages.filter(matches) }))
      .filter((g) => g.packages.length > 0)
    if (groups.length === 0) {
      console.error(`No tracked library matches --only ${opts.only.join(",")}`)
      process.exit(2)
    }
  }

  const groupOf = new Map<string, string>()
  for (const g of groups) for (const p of g.packages) if (!groupOf.has(p)) groupOf.set(p, g.id)
  const names = [...groupOf.keys()]
  const tracked = new Set(names)

  const declarations = collectDeclarations(tracked)

  if (!opts.json) {
    console.log(`Checking ${names.length} key libraries against ${opts.registry} …`)
  }

  const fetched = await mapWithConcurrency(names, Math.max(1, opts.concurrency), async (name) => {
    try {
      return await fetchPackument(name, opts.registry, opts.timeout)
    } catch (err) {
      return err instanceof Error ? err : new Error(String(err))
    }
  })

  const results: PackageResult[] = names.map((name, index) => {
    const decls = declarations.get(name) ?? []
    const dirs = decls.length > 0 ? [...new Set(decls.map((d) => d.dir))] : [ROOT]
    const installed = resolveInstalled(name, dirs)
    const registryData = fetched[index] ?? new Error("no registry response recorded")
    return analyze(name, groupOf.get(name) ?? "unknown", decls, installed, registryData)
  })

  const updates = results.filter((r) => !r.error && r.updateKind !== "none")
  const errors = results.filter((r) => r.error)

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          registry: opts.registry,
          summary: {
            checked: results.filter((r) => !r.error).length,
            updates: updates.length,
            major: updates.filter((r) => r.updateKind === "major").length,
            drift: results.filter((r) => r.drift.length > 0).length,
            errors: errors.length,
          },
          packages: results,
        },
        null,
        2,
      ),
    )
  } else {
    printHuman(groups, results, opts.verbose)
    printSummary(results)
  }

  if (errors.length > 0) process.exit(2)
  if (opts.failOnOutdated && updates.length > 0) process.exit(1)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})
