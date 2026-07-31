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
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import {
  runCreate,
  detectPackageManager,
  runPackageManager,
  installPackageManagerCommand,
  type PackageManagerName,
} from "../packages/cli/dist/index.js"

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
function readCatalog(): Record<string, string> {
  const content = readFileSync(join(REPO_ROOT, "pnpm-workspace.yaml"), "utf8")
  const lines = content.split("\n")
  const catalog: Record<string, string> = {}
  const start = lines.findIndex((l) => /^catalog:\s*$/.test(l))
  if (start === -1) return catalog
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (/^\S/.test(line)) break
    const match = line.match(/^\s*["']?([\w@/.-]+)["']?:\s*["']?([^"'\s]+)["']?\s*$/)
    if (match) catalog[match[1]!] = match[2]!
  }
  return catalog
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
      } else if (spec === "catalog:" && catalog[name]) {
        deps[name] = catalog[name]!
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

interface ManagerIsolation {
  env: Record<string, string>
  /** Extra files to write into the work dir before install (registry/cache config). */
  files: Record<string, string>
}

/**
 * Environment applied to EVERY manager, regardless of its own config file.
 *
 * Two independent guarantees, because relying on a config file alone proved
 * insufficient:
 *
 * 1. `npm_config_registry` is set explicitly. `pnpm run <script>` injects
 *    `npm_config_registry=https://registry.npmjs.org/` into the script
 *    environment (`pnpm exec` does not), and Bun honours that variable in
 *    preference to its own bunfig.toml. The result was an offline guarantee
 *    that silently depended on how the harness happened to be launched:
 *    invoked directly the Bun leg resolved everything from the local registry,
 *    but invoked via `pnpm run smoke:create` it resolved 314 packages straight
 *    from registry.npmjs.org and only failed because `@solidiom/*` is not
 *    published there. Setting this here overrides any inherited value.
 *
 * 2. Outbound HTTP is pointed at a closed local port while 127.0.0.1 is
 *    exempted, so the local Verdaccio still works but any attempt to reach an
 *    external host fails immediately. This turns a silent fallthrough into a
 *    loud failure even if some future manager version ignores both its config
 *    file and `npm_config_registry`.
 */
function baseIsolationEnv(registry: string): Record<string, string> {
  return {
    npm_config_registry: registry,
    NPM_CONFIG_REGISTRY: registry,
    // Deliberately a closed port, not a real proxy.
    HTTP_PROXY: "http://127.0.0.1:1",
    HTTPS_PROXY: "http://127.0.0.1:1",
    http_proxy: "http://127.0.0.1:1",
    https_proxy: "http://127.0.0.1:1",
    NO_PROXY: "127.0.0.1,localhost",
    no_proxy: "127.0.0.1,localhost",
  }
}

function isolationFor(
  manager: PackageManagerName,
  registry: string,
  cacheDir: string,
): ManagerIsolation {
  const base = baseIsolationEnv(registry)
  switch (manager) {
    case "npm":
      return {
        env: { ...base, npm_config_cache: cacheDir },
        files: {
          ".npmrc": `registry=${registry}\ncache=${cacheDir}\n`,
        },
      }
    case "pnpm":
      return {
        env: { ...base, npm_config_store_dir: join(cacheDir, "store") },
        files: {
          ".npmrc": `registry=${registry}\nstore-dir=${join(cacheDir, "store")}\n`,
        },
      }
    case "yarn":
      return {
        env: { ...base, YARN_REGISTRY: registry, YARN_CACHE_FOLDER: cacheDir },
        files: {
          ".yarnrc": `registry "${registry}"\ncache-folder "${cacheDir}"\n`,
        },
      }
    case "bun":
      return {
        env: { ...base, BUN_CONFIG_REGISTRY: registry },
        files: {
          "bunfig.toml": `[install]\nregistry = "${registry}"\ncache-dir = "${cacheDir}"\n`,
        },
      }
  }
}

/**
 * Corepack refuses to run yarn from a directory whose nearest package.json
 * doesn't declare a compatible "packageManager" field (verified empirically
 * — see the CLI-008 report). Every isolated work dir gets its own
 * package.json anyway (materialize() writes one from the template), so this
 * only matters for yarn: we patch the materialized package.json to add the
 * field after create() runs and before install runs.
 */
const YARN_PACKAGE_MANAGER_FIELD = "yarn@1.22.22"

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

    // ── isolate registry/cache for this manager, and (yarn only) satisfy
    //    corepack's packageManager-field guard ──
    const isolation = isolationFor(manager, registry, cacheDir)
    for (const [name, content] of Object.entries(isolation.files)) {
      writeFileSync(join(destination, name), content)
    }
    if (manager === "yarn") {
      const pkgPath = join(destination, "package.json")
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
      pkg["packageManager"] = YARN_PACKAGE_MANAGER_FIELD
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
    }

    // ── install ──
    phaseReached = "install"
    const detected = detectPackageManager({ cwd: destination, override: manager })
    const { result: installRun, durationMs: installMs } = await time(() =>
      runPackageManager({
        command: installPackageManagerCommand(detected),
        cwd: destination,
        env: { ...process.env, ...isolation.env },
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
          command: { bin: manager, args: ["run", "typecheck"] },
          cwd: destination,
          env: { ...process.env, ...isolation.env },
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
          command: { bin: manager, args: ["run", "build"] },
          cwd: destination,
          env: { ...process.env, ...isolation.env },
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
          command: { bin: manager, args: ["run", "test"] },
          cwd: destination,
          env: { ...process.env, ...isolation.env },
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
