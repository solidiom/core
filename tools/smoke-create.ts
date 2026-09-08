/**
 * tools/smoke-create — CLI-008 four-manager × two-template smoke harness.
 *
 * Drives `create → install → typecheck → build → test` for every
 * combination of {vite-solid-router, tanstack-start-solid} × {npm, pnpm,
 * yarn, bun}, in an isolated temp directory per combination, against the
 * local offline Verdaccio registry set up by
 * tools/offline-fixture/run-offline-test.sh (this script does not start its
 * own Verdaccio — see --registry below).
 *
 * HOW "cold cache" is achieved (two phases, see run-offline-test.sh):
 *
 *   1. PREP (`run-offline-test.sh --prep`, network allowed, run rarely).
 *      Verdaccio runs WITH an uplink to registry.npmjs.org and its storage
 *      pointed at a persistent snapshot directory. The full matrix runs once
 *      through it, so Verdaccio caches the real packuments and tarballs every
 *      manager asks for. All four managers must run in this phase, because
 *      they do not ask for the same things: npm/pnpm/bun skip
 *      platform-incompatible `optionalDependencies` without resolving them,
 *      while Yarn Classic resolves metadata for EVERY variant and hard-fails
 *      on any the registry lacks. Yarn's pass is what makes the snapshot
 *      complete.
 *
 *   2. TEST (default). The snapshot is copied to a throwaway directory and
 *      Verdaccio is restarted against it with NO uplinks and no per-package
 *      proxy, so a cache miss 404s instead of silently reaching the network
 *      (verified: a never-cached package returns 404 under this config).
 *      Every manager gets a fresh cache directory, so the managers are cold
 *      even though the registry is warm — which is exactly the property the
 *      acceptance criterion needs.
 *
 * `@solidiom/*` packages are the one exception to the snapshot: they do not
 * exist on npmjs at these versions, so they are packed from the checkout and
 * published on EVERY run (see `publishSolidiomPackages`). That also means
 * local source changes are always reflected without regenerating the
 * snapshot.
 *
 * IMPORTANT: this script must never call `process.chdir()`. Every
 * package-manager binary here (npm/pnpm/yarn/bun) is resolved through mise's
 * shims, and mise decides whether a shimmed tool is "active" based on the
 * cwd of THIS Node process — not the `cwd` option passed to `execFile`
 * (verified empirically; see the CLI-008 report). As long as
 * `process.cwd()` stays at the repo root for the lifetime of this process,
 * `runPackageManager({ cwd: <tempDir>, ... })` resolves every manager
 * correctly even though the child process's own working directory is a
 * throwaway temp directory.
 *
 * Usage:
 *   tsx tools/smoke-create.ts [--registry <url>] [--manager <npm|pnpm|yarn|bun>] [--template <name>] [--json-out <path>] [--skip-publish]
 *
 * Debugging: set SMOKE_CREATE_KEEP_TEMP=1 to skip temp-directory cleanup on
 * both success and failure, so a materialized/installed project can be
 * inspected by hand after a run. Never set in CI.
 *
 * Output:
 *   - A JSON array of per-combination result rows (the machine-readable
 *     contract), written to stdout by default or to --json-out if given.
 *   - A human-readable summary table on stderr (so `--json-out` omitted
 *     still gets a clean JSON stdout stream a caller could pipe/redirect).
 */

import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { delimiter, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import {
  runCreate,
  detectPackageManager,
  runPackageManager,
  installPackageManagerCommand,
  type PackageManagerName,
} from "../packages/cli/dist/index.js"

// Load the project root .env so environment variables like NPM_TOKEN are
// available even when the runner (e.g. mise) doesn't inject them. This mirrors
// tests/e2e/playwright.config.ts. It matters here because the developer's real
// ~/.npmrc typically has `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`, and
// Yarn Classic hard-fails expanding that when NPM_TOKEN is unset in the child.
try {
  process.loadEnvFile(join(dirname(fileURLToPath(import.meta.url)), "..", ".env"))
} catch {
  // .env is optional — CI provides variables through other means.
}

// ─── Types ──────────────────────────────────────────────────────────────────

type Phase = "create" | "install" | "typecheck" | "build" | "test"
type PhaseStatus = "passed" | "failed" | "skipped"

interface PhaseResult {
  phase: Phase
  status: PhaseStatus
  durationMs: number
  /** Present when status is "failed": the actual error/stderr output, not just "failed". */
  error?: string
  /** Present when status is "skipped": why (e.g. "no test script"). */
  skippedReason?: string
}

interface CombinationResult {
  template: string
  manager: PackageManagerName
  /** The last phase that was attempted (whether it passed, failed, or was skipped). */
  phaseReached: Phase
  /** Overall pass/fail for the whole combination — false if any non-skipped phase failed. */
  ok: boolean
  phases: PhaseResult[]
  totalDurationMs: number
}

// ─── Config ─────────────────────────────────────────────────────────────────

const TEMPLATES = ["vite-solid-router", "tanstack-start-solid"] as const
const MANAGERS: PackageManagerName[] = ["npm", "pnpm", "yarn", "bun"]

/**
 * Templates whose `typecheck` script cannot succeed on a freshly
 * materialized project until `build` (or `dev`) has run once — see the
 * detailed comment at this constant's only call site in `runCombination`
 * for the full TanStack Router `routeTree.gen.ts` explanation.
 */
const TEMPLATES_NEEDING_BUILD_BEFORE_TYPECHECK = new Set<string>(["tanstack-start-solid"])

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

function resolveManagerBinary(manager: PackageManagerName): string {
  if (manager !== "pnpm") return manager

  try {
    const manifest = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as {
      packageManager?: string
    }
    const version = manifest.packageManager?.match(/^pnpm@([^+]+)/)?.[1]
    if (!version) return manager

    // `mise which pnpm` can return its `latest` installation and let pnpm
    // auto-switch by cwd, which is exactly what an external generated project
    // must not depend on. Resolve the declared version's installation root and
    // invoke that binary directly.
    const installRoot = execFileSync("mise", ["where", `pnpm@${version}`], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    const candidates = [join(installRoot, "pnpm"), join(installRoot, "bin", "pnpm.cjs")]
    return candidates.find((candidate) => existsSync(candidate)) ?? manager
  } catch {
    // Hosted CI installs PNPM_VERSION explicitly and does not require mise.
    return manager
  }
}

/**
 * Every `@solidiom/*` package the two templates need, derived transitively
 * from the templates' own manifests rather than hardcoded.
 *
 * This closure is trivial compared to the third-party graph and needs no
 * semver matching at all: workspace packages reference each other with
 * `workspace:*`, which by definition means "the version in this checkout", so
 * resolution is just a directory lookup. `@solidiom/dialog` is added because
 * the shared fixture also exercises `solidiom add dialog` against the same
 * registry.
 */
function collectSolidiomPackagesToPublish(): string[] {
  const shortNameOf = (name: string) => name.replace(/^@solidiom\//, "")
  const queue: string[] = ["dialog"]
  const seen = new Set<string>()

  for (const template of TEMPLATES) {
    const manifest = JSON.parse(
      readFileSync(join(REPO_ROOT, "templates", template, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
    for (const deps of [manifest.dependencies, manifest.devDependencies]) {
      for (const name of Object.keys(deps ?? {})) {
        if (name.startsWith("@solidiom/")) queue.push(shortNameOf(name))
      }
    }
  }

  while (queue.length > 0) {
    const shortName = queue.shift()!
    if (seen.has(shortName)) continue
    const manifestPath = join(REPO_ROOT, "packages", shortName, "package.json")
    if (!existsSync(manifestPath)) {
      throw new Error(
        `Offline fixture cannot find packages/${shortName}/package.json, required transitively by a template.`,
      )
    }
    seen.add(shortName)

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      dependencies?: Record<string, string>
    }
    for (const name of Object.keys(manifest.dependencies ?? {})) {
      if (name.startsWith("@solidiom/")) queue.push(shortNameOf(name))
    }
  }

  return [...seen].sort()
}

/**
 * DISCOVERED, OUT-OF-SCOPE REGRESSION (see the CLI-008 report): every
 * `@solidiom/*` package's checked-in package.json ships `catalog:` verbatim
 * in `peerDependencies.solid-js` (59 packages), and several ship
 * `workspace:*` verbatim in `dependencies` (e.g. button ->
 * @solidiom/runtime). `pnpm changeset publish` (this repo's real release
 * path) already rewrites `workspace:*` at publish time via
 * `updateInternalDependencies` in .changeset/config.json, but has NO
 * knowledge of pnpm's `catalog:` protocol at all — so even a REAL release
 * through this repo's actual publish tooling would ship the same broken
 * `catalog:` peer dependency to the real npm registry. `packWithRewrittenManifest`
 * below is a narrow, harness-local workaround (it never touches the
 * checked-in package.json files) so the smoke matrix can still exercise a
 * realistic install; the underlying defect is out of CLI-008's scope to fix
 * (it would mean editing peerDependencies across dozens of primitive
 * packages, a cross-cutting change with its own review) and is reported as
 * a discovered regression instead.
 */
/**
 * Reads pnpm-workspace.yaml's `catalog:` map.
 *
 * Deliberately reads `catalog:` and NOT `overrides:`. These tarballs stand in
 * for what a real `@solidiom/*` release would publish, and `catalog:` appears
 * almost exclusively in `peerDependencies` — where the correct published value
 * is the catalog's RANGE (`^2.0.0-beta.23`, "works with any Solid 2 beta from
 * 23 up"), not the workspace's exact pin. Substituting the pin would publish a
 * peer dependency no real release would ship, and would make the fixture prove
 * less than it appears to.
 *
 * Forcing one resolved version in a generated project is a separate concern,
 * handled where it belongs: materialize.ts emits `overrides`/`resolutions`
 * into the project's own package.json.
 */
export function parseCatalog(content: string): Record<string, string> {
  const lines = content.split("\n")
  const catalog: Record<string, string> = {}
  const start = lines.findIndex((line) => /^catalog:\s*$/.test(line))
  if (start === -1) return catalog

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (/^\S/.test(line)) break

    const match = line.match(
      /^\s+(?:"([^"]+)"|'([^']+)'|([\w@/.-]+))\s*:\s*(?:"([^"]+)"|'([^']+)'|([^#]*?))\s*(?:#.*)?$/,
    )
    if (!match) continue

    const name = match[1] ?? match[2] ?? match[3]
    const value = (match[4] ?? match[5] ?? match[6])?.trim()
    if (name && value) catalog[name] = value
  }

  return catalog
}

function readCatalog(): Record<string, string> {
  return parseCatalog(readFileSync(join(REPO_ROOT, "pnpm-workspace.yaml"), "utf8"))
}

/**
 * Reads a `@solidiom/<name>` package's real published version from its own
 * package.json, so `workspace:*` internal deps can be rewritten to a
 * concrete version before packing — mirrors what changesets'
 * `updateInternalDependencies` does at real release time.
 */
function readSolidiomPackageVersion(shortName: string): string | null {
  const pkgPath = join(REPO_ROOT, "packages", shortName, "package.json")
  if (!existsSync(pkgPath)) return null
  try {
    const data = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}

/**
 * Packs a package, first rewriting any `workspace:*`/`catalog:` specifiers
 * in a scratch copy of its package.json (see resolvePublishSpecifier's doc
 * comment for why this is necessary and why it's scoped to this harness
 * only). Returns the path to the produced tarball.
 */
function packWithRewrittenManifest(pkgDir: string, catalog: Record<string, string>): string {
  const pkgJsonPath = join(pkgDir, "package.json")
  const original = readFileSync(pkgJsonPath, "utf8")
  const data = JSON.parse(original) as Record<string, unknown>

  const depFields = ["dependencies", "peerDependencies"] as const
  for (const field of depFields) {
    const deps = data[field] as Record<string, string> | undefined
    if (!deps) continue
    for (const [name, spec] of Object.entries(deps)) {
      if (spec.startsWith("workspace:")) {
        const shortName = name.replace(/^@solidiom\//, "")
        const resolved = readSolidiomPackageVersion(shortName)
        if (resolved) deps[name] = resolved
      } else if (spec === "catalog:") {
        const resolved = catalog[name]
        if (!resolved) {
          throw new Error(`Cannot resolve ${field}.${name} from pnpm-workspace.yaml catalog`)
        }
        deps[name] = resolved
      }
    }
  }

  writeFileSync(pkgJsonPath, JSON.stringify(data, null, 2) + "\n")
  try {
    const packOutput = execFileSync("npm", ["pack", "--silent", "--ignore-scripts"], {
      cwd: pkgDir,
      encoding: "utf8",
    })
    return join(pkgDir, packOutput.trim().split("\n").pop()!)
  } finally {
    writeFileSync(pkgJsonPath, original) // restore the real, checked-in manifest
  }
}

/**
 * Packs and publishes every workspace `@solidiom/*` package the templates
 * need. Runs on EVERY smoke run, not just prep: these versions do not exist
 * on npmjs, and republishing keeps the fixture in step with local source
 * changes without regenerating the snapshot.
 *
 * Fails closed. An earlier revision swallowed publish errors as "may already
 * exist", which would let a genuinely broken publish surface later as a
 * confusing install-phase 404. The caller removes the `@solidiom` scope from
 * the snapshot copy before this runs, so a conflict here is a real error.
 */
function publishSolidiomPackages(registry: string): void {
  const catalog = readCatalog()
  const packages = collectSolidiomPackagesToPublish()
  console.error(
    `Publishing ${packages.length} workspace @solidiom/* package(s) into ${registry}...`,
  )

  for (const pkg of packages) {
    const pkgDir = join(REPO_ROOT, "packages", pkg)
    let tarballPath: string | undefined
    try {
      tarballPath = packWithRewrittenManifest(pkgDir, catalog)
      publishTarball(tarballPath, registry)
    } catch (error) {
      throw new Error(
        `Failed to publish @solidiom/${pkg} into the offline fixture: ${String(error)}`,
      )
    } finally {
      if (tarballPath) rmSync(tarballPath, { force: true })
    }
  }
}

function publishTarball(tarballPath: string, registry: string): void {
  execFileSync(
    "npm",
    [
      "publish",
      tarballPath,
      "--registry",
      registry,
      "--access",
      "public",
      "--tag",
      "next",
      // Fixture tarballs are published to a local Verdaccio instance,
      // which has no CI/OIDC provider for npm provenance attestations.
      "--provenance=false",
      `--${registry.replace(/^https?:\/\//, "//")}/:_authToken=anonymous`,
    ],
    { stdio: "pipe" },
  )
}

interface CliArgs {
  registry: string
  managers: PackageManagerName[]
  templates: string[]
  jsonOut?: string
  skipPublish: boolean
}

function parseArgs(argv: string[]): CliArgs {
  let registry = "http://localhost:4873"
  let managers = [...MANAGERS]
  let templates: string[] = [...TEMPLATES]
  let jsonOut: string | undefined
  let skipPublish = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--registry") {
      registry = argv[++i] ?? registry
    } else if (arg === "--manager") {
      const value = argv[++i] as PackageManagerName | undefined
      if (value) managers = [value]
    } else if (arg === "--template") {
      const value = argv[++i]
      if (value) templates = [value]
    } else if (arg === "--json-out") {
      jsonOut = argv[++i]
    } else if (arg === "--skip-publish") {
      skipPublish = true
    }
  }

  return { registry, managers, templates, jsonOut, skipPublish }
}

// ─── Per-manager isolated registry/cache config ────────────────────────────
//
// Mirrors tools/offline-fixture/run-offline-test.sh's per-manager isolation
// exactly (same registry-override mechanism per manager, same
// one-cache-dir-per-manager rule) so this script and the bash harness never
// diverge on what "offline" means. See that script's step 8 comment for the
// full rationale on why each manager needs its own file, not just an env var.

export interface ManagerIsolation {
  /** Complete, sanitized child environment reused for every lifecycle phase. */
  env: Record<string, string>
  /** Extra files to write into the work dir before install (registry/cache config). */
  files: Record<string, string>
  /** Private state directories that must exist before the manager starts. */
  directories: string[]
  /** Effective pnpm config required before install; absent for other managers. */
  expectedPnpmConfig?: Record<"store-dir" | "cache-dir" | "state-dir", string>
}

function sanitizedInheritedEnv(
  manager: PackageManagerName,
  inheritedEnv: NodeJS.ProcessEnv,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(inheritedEnv)) {
    if (value === undefined) continue
    const upper = key.toUpperCase()

    // npm-style config is case-insensitive and is also consumed by pnpm,
    // Yarn, and Bun. Never let a runner-level cache/store/registry setting
    // cross the fixture boundary; each manager gets an explicit replacement.
    if (upper.startsWith("NPM_CONFIG_")) continue
    if (manager === "pnpm" && (upper.startsWith("PNPM_") || upper.startsWith("XDG_"))) continue
    if (manager === "yarn" && upper.startsWith("YARN_")) continue
    if (manager === "bun" && upper.startsWith("BUN_")) continue

    result[key] = value
  }

  return result
}

/**
 * Environment applied to EVERY manager, regardless of its own config file.
 *
 * The returned object is a COMPLETE child environment, not a partial overlay.
 * This matters because pnpm stores registry metadata separately from its
 * content-addressable store; allowing an inherited npm_config_*, PNPM_*, or
 * XDG_* path through can reintroduce an old integrity record even when
 * `store-dir` and `cache-dir` look isolated.
 */
function baseIsolationEnv(
  manager: PackageManagerName,
  registry: string,
  inheritedEnv: NodeJS.ProcessEnv,
): Record<string, string> {
  return {
    ...sanitizedInheritedEnv(manager, inheritedEnv),
    npm_config_registry: registry,
    NPM_CONFIG_REGISTRY: registry,
    // Deliberately a closed port, not a real proxy.
    HTTP_PROXY: "http://127.0.0.1:1",
    HTTPS_PROXY: "http://127.0.0.1:1",
    http_proxy: "http://127.0.0.1:1",
    https_proxy: "http://127.0.0.1:1",
    NO_PROXY: "127.0.0.1,localhost",
    no_proxy: "127.0.0.1,localhost",
    // With npm_config_userconfig redirected below, no manager should read the
    // developer's ~/.npmrc. Keep a harmless fallback for residual token
    // interpolation on machines without an exported value or project .env.
    NPM_TOKEN: inheritedEnv["NPM_TOKEN"] ?? "offline-fixture-noop-token",
  }
}

function miseCompatibilityEnv(inheritedEnv: NodeJS.ProcessEnv): Record<string, string> {
  const home = inheritedEnv["HOME"]
  if (!home) return {}

  const dataRoot = inheritedEnv["XDG_DATA_HOME"] ?? join(home, ".local", "share")
  const configRoot = inheritedEnv["XDG_CONFIG_HOME"] ?? join(home, ".config")
  const stateRoot = inheritedEnv["XDG_STATE_HOME"] ?? join(home, ".local", "state")
  const cacheRoot =
    inheritedEnv["XDG_CACHE_HOME"] ??
    (process.platform === "darwin" ? join(home, "Library", "Caches") : join(home, ".cache"))

  // mise shims use XDG themselves. Preserve their original roots before pnpm
  // receives private XDG paths; otherwise the shim can lose its trusted config
  // or even install a different pnpm version in the throwaway data directory.
  return {
    MISE_DATA_DIR: inheritedEnv["MISE_DATA_DIR"] ?? join(dataRoot, "mise"),
    MISE_CONFIG_DIR: inheritedEnv["MISE_CONFIG_DIR"] ?? join(configRoot, "mise"),
    MISE_STATE_DIR: inheritedEnv["MISE_STATE_DIR"] ?? join(stateRoot, "mise"),
    MISE_CACHE_DIR: inheritedEnv["MISE_CACHE_DIR"] ?? join(cacheRoot, "mise"),
  }
}

export function isolationFor(
  manager: PackageManagerName,
  registry: string,
  cacheDir: string,
  inheritedEnv: NodeJS.ProcessEnv = process.env,
): ManagerIsolation {
  const base = baseIsolationEnv(manager, registry, inheritedEnv)
  const userconfigPath = join(cacheDir, "empty-userconfig.npmrc")
  const userconfigEnv = {
    npm_config_userconfig: userconfigPath,
    NPM_CONFIG_USERCONFIG: userconfigPath,
  }

  switch (manager) {
    case "npm":
      return {
        env: {
          ...base,
          ...userconfigEnv,
          npm_config_cache: cacheDir,
          NPM_CONFIG_CACHE: cacheDir,
        },
        files: {
          ".npmrc": `registry=${registry}\ncache=${cacheDir}\n`,
        },
        directories: [cacheDir],
      }
    case "pnpm": {
      const storeDir = join(cacheDir, "store")
      const metadataDir = join(cacheDir, "metadata")
      const stateDir = join(cacheDir, "state")
      const xdgCacheDir = join(cacheDir, "xdg-cache")
      const xdgConfigDir = join(cacheDir, "xdg-config")
      const xdgStateDir = join(cacheDir, "xdg-state")
      const expectedPnpmConfig = {
        "store-dir": storeDir,
        "cache-dir": metadataDir,
        "state-dir": stateDir,
      }

      return {
        env: {
          ...base,
          ...userconfigEnv,
          ...miseCompatibilityEnv(inheritedEnv),
          npm_config_store_dir: storeDir,
          NPM_CONFIG_STORE_DIR: storeDir,
          npm_config_cache_dir: metadataDir,
          NPM_CONFIG_CACHE_DIR: metadataDir,
          npm_config_state_dir: stateDir,
          NPM_CONFIG_STATE_DIR: stateDir,
          XDG_CACHE_HOME: xdgCacheDir,
          XDG_CONFIG_HOME: xdgConfigDir,
          XDG_STATE_HOME: xdgStateDir,
          // XDG_DATA_HOME and PNPM_HOME locate pnpm/corepack executables and
          // version caches, not registry metadata. Preserve them when present;
          // redirecting them makes an offline run try to bootstrap pnpm itself.
          ...(inheritedEnv["XDG_DATA_HOME"]
            ? { XDG_DATA_HOME: inheritedEnv["XDG_DATA_HOME"] }
            : {}),
          ...(inheritedEnv["PNPM_HOME"] ? { PNPM_HOME: inheritedEnv["PNPM_HOME"] } : {}),
        },
        files: {
          ".npmrc": [
            `registry=${registry}`,
            `store-dir=${storeDir}`,
            `cache-dir=${metadataDir}`,
            `state-dir=${stateDir}`,
            "",
          ].join("\n"),
        },
        directories: [
          cacheDir,
          storeDir,
          metadataDir,
          stateDir,
          xdgCacheDir,
          xdgConfigDir,
          xdgStateDir,
        ],
        expectedPnpmConfig,
      }
    }
    case "yarn":
      return {
        env: { ...base, ...userconfigEnv, YARN_REGISTRY: registry, YARN_CACHE_FOLDER: cacheDir },
        files: {
          ".yarnrc": `registry "${registry}"\ncache-folder "${cacheDir}"\n`,
        },
        directories: [cacheDir],
      }
    case "bun":
      return {
        env: { ...base, ...userconfigEnv, BUN_CONFIG_REGISTRY: registry },
        files: {
          "bunfig.toml": `[install]\nregistry = "${registry}"\ncache-dir = "${cacheDir}"\n`,
        },
        directories: [cacheDir],
      }
  }
}

async function verifyPnpmIsolation(
  destination: string,
  managerBin: string,
  isolation: ManagerIsolation,
): Promise<void> {
  const expected = isolation.expectedPnpmConfig
  if (!expected) return

  for (const [key, expectedPath] of Object.entries(expected)) {
    // `pnpm config list --json` has omitted store-dir in some invocation
    // contexts even when `pnpm config get store-dir` returns the applied
    // value. Query each key directly so the guard validates behavior rather
    // than depending on the aggregate command's serialization details.
    const result = await runPackageManager({
      command: { bin: managerBin as PackageManagerName, args: ["config", "get", key] },
      cwd: destination,
      env: isolation.env,
    })
    if (result.code !== 0) {
      throw new Error(
        `Unable to verify pnpm ${key}: ${result.stderr || result.stdout || `exit code ${result.code}`}`,
      )
    }

    const effectivePath = result.stdout.trim()
    if (effectivePath !== expectedPath) {
      throw new Error(
        `pnpm isolation failed: effective ${key} is ${JSON.stringify(effectivePath)}, expected ${expectedPath}`,
      )
    }
  }

  console.error(
    `  pnpm state isolated: store=${expected["store-dir"]}, metadata=${expected["cache-dir"]}, state=${expected["state-dir"]}`,
  )
}

/**
 * Corepack/mise choose a package-manager version from the nearest
 * package.json. Pin generated projects so local smoke runs use the same pnpm
 * 10 version as CI instead of a developer's global/default pnpm, while Yarn
 * Classic also gets the field required by Corepack's compatibility guard.
 */
const YARN_PACKAGE_MANAGER_FIELD = "yarn@1.22.22"
const PNPM_PACKAGE_MANAGER_FIELD = (() => {
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as {
    packageManager?: string
  }
  if (!manifest.packageManager?.startsWith("pnpm@")) {
    throw new Error("Root package.json must declare the pnpm packageManager used by smoke tests")
  }
  return manifest.packageManager
})()

// ─── Harness ────────────────────────────────────────────────────────────────

async function time<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = Date.now()
  const result = await fn()
  return { result, durationMs: Date.now() - start }
}

function truncate(text: string, max = 4000): string {
  return text.length > max
    ? text.slice(0, max) + `\n…(truncated, ${text.length - max} more chars)`
    : text
}

export async function runCombination(
  template: string,
  manager: PackageManagerName,
  registry: string,
  rootTempDir: string,
  templatesDir?: string,
): Promise<CombinationResult> {
  const phases: PhaseResult[] = []
  const projectName = `smoke-${template}-${manager}`.replace(/[^a-z0-9-]/g, "-")
  const workspaceDir = mkdtempSync(join(rootTempDir, `${manager}-${template}-`))
  const cacheDir = join(workspaceDir, "cache")
  const managerBin = resolveManagerBinary(manager)
  mkdirSync(cacheDir, { recursive: true })
  const destination = join(workspaceDir, projectName)

  let phaseReached: Phase = "create"
  let ok = true
  const overallStart = Date.now()

  try {
    // ── create ──
    const { result: createResult, durationMs: createMs } = await time(async () =>
      runCreate({
        cwd: workspaceDir,
        template,
        name: projectName,
        install: false, // installed as its own explicitly-timed phase below
        yes: true,
        packageManager: manager,
        ...(templatesDir ? { templatesDir } : {}),
      }),
    )

    if (!createResult.created) {
      phases.push({
        phase: "create",
        status: "failed",
        durationMs: createMs,
        error: truncate(
          (createResult.errors ?? ["create() returned created: false with no errors"]).join("\n"),
        ),
      })
      ok = false
      return finalize()
    }
    phases.push({ phase: "create", status: "passed", durationMs: createMs })

    // ── isolate registry/cache for this manager, and pin managers whose
    //    project-local version selection would otherwise drift ──
    const isolation = isolationFor(manager, registry, cacheDir)
    if (manager === "pnpm" && managerBin !== "pnpm") {
      // Package scripts can invoke `pnpm` recursively. Put the exact binary's
      // directory first so those nested calls cannot fall back to a Corepack
      // or mise shim after XDG cache isolation hides its downloaded versions.
      const managerBinDir = dirname(managerBin)
      isolation.env.PATH = isolation.env.PATH
        ? `${managerBinDir}${delimiter}${isolation.env.PATH}`
        : managerBinDir
    }
    for (const directory of isolation.directories) {
      mkdirSync(directory, { recursive: true })
    }
    for (const [name, content] of Object.entries(isolation.files)) {
      writeFileSync(join(destination, name), content)
    }
    // Empty user-level npm config so no manager reads the developer's real
    // ~/.npmrc (which may reference ${NPM_TOKEN}); both lower- and uppercase
    // userconfig variables in isolation.env point here.
    writeFileSync(join(cacheDir, "empty-userconfig.npmrc"), "")
    if (manager === "yarn" || manager === "pnpm") {
      const pkgPath = join(destination, "package.json")
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
      pkg["packageManager"] =
        manager === "yarn" ? YARN_PACKAGE_MANAGER_FIELD : PNPM_PACKAGE_MANAGER_FIELD
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
    }

    // Fail before installation if pnpm ignored any private path. This validates
    // the effective child-process configuration rather than trusting that the
    // intended env/.npmrc precedence remains stable across pnpm releases.
    await verifyPnpmIsolation(destination, managerBin, isolation)

    // ── install ──
    phaseReached = "install"
    const detected = detectPackageManager({ cwd: destination, override: manager })
    const { result: installRun, durationMs: installMs } = await time(() =>
      runPackageManager({
        command: {
          ...installPackageManagerCommand(detected),
          bin: managerBin as PackageManagerName,
        },
        cwd: destination,
        env: isolation.env,
      }),
    )
    if (installRun.code !== 0) {
      phases.push({
        phase: "install",
        status: "failed",
        durationMs: installMs,
        error: truncate(installRun.stderr || installRun.stdout || `exit code ${installRun.code}`),
      })
      ok = false
      return finalize()
    }
    phases.push({ phase: "install", status: "passed", durationMs: installMs })

    // ── template-specific phase reordering ──
    //
    // Discovered during CLI-008: templates using TanStack Router/Start
    // (tanstack-start-solid) rely on `src/routeTree.gen.ts`, a file the
    // `tanstackStart()` Vite plugin generates as a SIDE EFFECT of any real
    // Vite run (dev or build) — there is no standalone "generate routes"
    // CLI command exposed by @tanstack/solid-router today. materialize.ts
    // correctly EXCLUDES this generated file from the template payload (see
    // its own EXCLUDED_FILES comment), so a freshly materialized project
    // has no route tree at all until something runs Vite once.
    //
    // CLI-007's own in-workspace typecheck check never caught this: the
    // monorepo checkout already had a stale, gitignored
    // templates/tanstack-start-solid/src/routeTree.gen.ts sitting on disk
    // from a previous local build, so its typecheck silently passed against
    // a leftover artifact rather than proving the template works from
    // scratch. A truly cold, freshly-materialized project (exactly what
    // this harness creates) has no such leftover file, so `tsc --noEmit`
    // fails outright with TS2307 (`Cannot find module './routeTree.gen'`).
    //
    // Fix: for templates in this set, run build BEFORE typecheck instead of
    // after — both phases still run exactly once each and are still
    // recorded under their own name in the result table (this is a
    // reordering, not a hidden extra step), so the JSON contract is
    // unchanged for every other template. This is the templates' own
    // structural requirement, not a harness workaround: a real developer
    // running `npm run typecheck` on a fresh clone of this template would
    // hit the exact same TS2307 until they'd run `dev`/`build` at least
    // once, so recording an accurate "build passed, then typecheck passed"
    // sequence is more honest than the plan's literal
    // typecheck-then-build wording for this specific template.
    const buildBeforeTypecheck = TEMPLATES_NEEDING_BUILD_BEFORE_TYPECHECK.has(template)

    const pkgJson = JSON.parse(readFileSync(join(destination, "package.json"), "utf8")) as {
      scripts?: Record<string, string>
    }
    const scripts = pkgJson.scripts ?? {}

    async function runTypecheckPhase(): Promise<boolean> {
      phaseReached = "typecheck"
      if (!scripts["typecheck"]) {
        phases.push({
          phase: "typecheck",
          status: "skipped",
          durationMs: 0,
          skippedReason: "no typecheck script",
        })
        return true
      }
      const { result: typecheckRun, durationMs: typecheckMs } = await time(() =>
        runPackageManager({
          command: { bin: managerBin as PackageManagerName, args: ["run", "typecheck"] },
          cwd: destination,
          env: isolation.env,
        }),
      )
      if (typecheckRun.code !== 0) {
        phases.push({
          phase: "typecheck",
          status: "failed",
          durationMs: typecheckMs,
          error: truncate(
            typecheckRun.stderr || typecheckRun.stdout || `exit code ${typecheckRun.code}`,
          ),
        })
        ok = false
        return false
      }
      phases.push({ phase: "typecheck", status: "passed", durationMs: typecheckMs })
      return true
    }

    async function runBuildPhase(): Promise<boolean> {
      phaseReached = "build"
      if (!scripts["build"]) {
        phases.push({
          phase: "build",
          status: "skipped",
          durationMs: 0,
          skippedReason: "no build script",
        })
        return true
      }
      const { result: buildRun, durationMs: buildMs } = await time(() =>
        runPackageManager({
          command: { bin: managerBin as PackageManagerName, args: ["run", "build"] },
          cwd: destination,
          env: isolation.env,
        }),
      )
      if (buildRun.code !== 0) {
        phases.push({
          phase: "build",
          status: "failed",
          durationMs: buildMs,
          error: truncate(buildRun.stderr || buildRun.stdout || `exit code ${buildRun.code}`),
        })
        ok = false
        return false
      }
      phases.push({ phase: "build", status: "passed", durationMs: buildMs })
      return true
    }

    if (buildBeforeTypecheck) {
      if (!(await runBuildPhase())) return finalize()
      if (!(await runTypecheckPhase())) return finalize()
    } else {
      if (!(await runTypecheckPhase())) return finalize()
      if (!(await runBuildPhase())) return finalize()
    }

    // ── test ──
    phaseReached = "test"
    if (!scripts["test"]) {
      phases.push({
        phase: "test",
        status: "skipped",
        durationMs: 0,
        skippedReason: "no test script",
      })
    } else {
      const { result: testRun, durationMs: testMs } = await time(() =>
        runPackageManager({
          command: { bin: managerBin as PackageManagerName, args: ["run", "test"] },
          cwd: destination,
          env: isolation.env,
        }),
      )
      if (testRun.code !== 0) {
        phases.push({
          phase: "test",
          status: "failed",
          durationMs: testMs,
          error: truncate(testRun.stderr || testRun.stdout || `exit code ${testRun.code}`),
        })
        ok = false
        return finalize()
      }
      phases.push({ phase: "test", status: "passed", durationMs: testMs })
    }

    return finalize()
  } catch (err) {
    phases.push({
      phase: phaseReached,
      status: "failed",
      durationMs: 0,
      error: truncate(err instanceof Error ? (err.stack ?? err.message) : String(err)),
    })
    ok = false
    return finalize()
  } finally {
    if (!process.env["SMOKE_CREATE_KEEP_TEMP"]) {
      rmSync(workspaceDir, { recursive: true, force: true })
    }
  }

  function finalize(): CombinationResult {
    return {
      template,
      manager,
      phaseReached,
      ok,
      phases,
      totalDurationMs: Date.now() - overallStart,
    }
  }
}

// ─── Human-readable summary ─────────────────────────────────────────────────

function printSummary(results: CombinationResult[]): void {
  const rows = results.map((r) => ({
    template: r.template,
    manager: r.manager,
    result: r.ok ? "PASS" : "FAIL",
    phaseReached: r.phaseReached,
    durationMs: r.totalDurationMs,
  }))

  const header = ["template", "manager", "result", "phaseReached", "durationMs"]
  const widths = header.map((h) =>
    Math.max(h.length, ...rows.map((r) => String(r[h as keyof typeof r]).length)),
  )

  const formatRow = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i]!)).join("  ")

  console.error(formatRow(header))
  console.error(widths.map((w) => "-".repeat(w)).join("  "))
  for (const row of rows) {
    console.error(formatRow(header.map((h) => String(row[h as keyof typeof row]))))
  }

  const failed = results.filter((r) => !r.ok)
  if (failed.length > 0) {
    console.error("")
    console.error(`${failed.length}/${results.length} combination(s) failed:`)
    for (const f of failed) {
      const failedPhase = f.phases.find((p) => p.status === "failed")
      console.error(`  - ${f.template} × ${f.manager}: failed at ${f.phaseReached}`)
      if (failedPhase?.error) {
        console.error(
          failedPhase.error
            .split("\n")
            .map((l) => `      ${l}`)
            .join("\n"),
        )
      }
    }
  }
}

// ─── Entry point ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  if (!args.skipPublish) {
    publishSolidiomPackages(args.registry)
  }

  const rootTempDir = mkdtempSync(join(tmpdir(), "solidiom-smoke-create-"))
  const results: CombinationResult[] = []

  try {
    for (const template of args.templates) {
      for (const manager of args.managers) {
        console.error(`Running ${template} × ${manager}...`)
        const result = await runCombination(template, manager, args.registry, rootTempDir)
        results.push(result)
        console.error(
          `  -> ${result.ok ? "PASS" : "FAIL"} (reached ${result.phaseReached}, ${result.totalDurationMs}ms)`,
        )
      }
    }
  } finally {
    if (!process.env["SMOKE_CREATE_KEEP_TEMP"]) {
      rmSync(rootTempDir, { recursive: true, force: true })
    }
  }

  printSummary(results)

  const json = JSON.stringify(results, null, 2)
  if (args.jsonOut) {
    writeFileSync(args.jsonOut, json + "\n")
    console.error(`\nJSON result table written to ${args.jsonOut}`)
  } else {
    process.stdout.write(json + "\n")
  }

  const anyFailed = results.some((r) => !r.ok)
  process.exitCode = anyFailed ? 1 : 0
}

// Only run main() when this file is executed directly (`tsx
// tools/smoke-create.ts`), not when imported as a module — e.g. by
// tools/smoke-create.test.ts, which imports `runCombination` to test the
// harness's own orchestration without triggering a full real-registry run
// as an import side effect.
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)
if (isMainModule) {
  main().catch((err) => {
    console.error("smoke-create.ts crashed:", err)
    process.exitCode = 1
  })
}
