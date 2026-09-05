/**
 * Template materialization engine (CLI-007).
 *
 * Copies a template's files from its source directory (see
 * `resolveTemplateSource` below) into a destination directory, applying
 * `{{var}}` substitution against an explicit allowlist, rewriting
 * `workspace:*` dependency specifiers to real resolvable versions, and
 * stripping repo-local tsconfig `extends`/`references` so the generated
 * project is self-contained.
 *
 * This module does NOT run any package manager or network call — see
 * commands/create.ts for how `runPackageManager` (CLI-005) is invoked after
 * materialize() succeeds.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

export interface MaterializeOptions {
  templateName: string
  destination: string
  projectName: string
  variables?: Record<string, string>
  /**
   * Injectable for tests/programmatic callers: an explicit template source
   * directory (the directory that directly contains template.json and the
   * template's files). When provided, skips `resolveTemplateSource`
   * entirely. Not exposed as a CLI flag — see CreateOptions.templatesDir
   * for the create-command-level injection point this threads through.
   */
  templateSourceDir?: string
}

export interface MaterializeResult {
  filesWritten: string[]
  errors?: string[]
}

/**
 * Files that are template metadata or build-generated artifacts, not
 * payload — never copied into the destination.
 *
 * `routeTree.gen.ts` is TanStack Router's own generated route-registration
 * file (see templates/tanstack-start-solid/, CLI-007 PR2): it is written by
 * running `vite dev`/`vite build` inside the template's own workspace
 * checkout (for the in-place typecheck/build verification Decision 4
 * requires) and is explicitly marked "will be overwritten" by the tool that
 * generates it. If materialize() copied it, every scaffolded project would
 * ship a stale, monorepo-specific route registration instead of letting
 * TanStack Router regenerate its own on first build.
 */
const EXCLUDED_FILES = new Set(["template.json", ".DS_Store", "routeTree.gen.ts"])

/** Directories that are never copied into the destination. */
const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".git", ".turbo", ".nx"])

/**
 * Lockfile names covered by the foreign-lockfile rule (plan §8.4). A
 * template payload must never carry one of these — the install step
 * (CLI-005's runPackageManager, wired in commands/create.ts) is what
 * produces the *correct* single lockfile for whichever package manager the
 * user chose, and it runs strictly after materialize() completes. If
 * materialize() let a template-authored lockfile through, it could survive
 * alongside (or instead of) the real one, silently pinning the generated
 * project to the wrong manager/versions.
 */
const LOCKFILE_NAMES = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "bun.lock",
])

/** The only `{{var}}` tokens materialize() will substitute. Keep this list explicit and small. */
const ALLOWED_VARIABLES = new Set(["projectName"])

/**
 * Resolves the template's source directory.
 *
 * Two resolution strategies, tried in order:
 *
 * 1. Published-CLI layout: relative to THIS module's own install location
 *    (`import.meta.url`), a prepack step (not implemented in this PR — see
 *    the plan's Decision 4) is expected to copy `templates/<name>/` into
 *    the CLI package as `dist/templates/<name>/` at publish time, sitting
 *    alongside `dist/create/materialize.js`. That makes
 *    `join(dirname(fileURLToPath(import.meta.url)), "templates", name)`
 *    the resolution path once this file is bundled to
 *    `dist/create/materialize.js` (i.e. `dist/create/templates/<name>` —
 *    see also the `../templates/<name>` fallback below for a sibling-of-
 *    dist layout, in case the prepack step places templates one level up
 *    instead). Both are checked since the exact prepack layout is not
 *    fixed yet.
 * 2. Monorepo-relative dev/test fallback: walk from this module's own
 *    directory up to the monorepo root and check `templates/<name>`. This
 *    is what makes `solidiom create` work when run from inside this
 *    monorepo during development, and is also what the test suite exercises
 *    indirectly (though unit tests for materialize() itself pass an
 *    explicit `templateSourceDir` fixture instead of relying on this).
 *
 *    Two depths are checked because tsup bundles this file's logic
 *    (originally `src/create/materialize.ts`, 4 levels below the monorepo
 *    root: create -> src -> cli -> packages -> root) directly into a single
 *    `dist/index.js` sitting at `packages/cli/dist/`, only 3 levels below
 *    root (dist -> cli -> packages -> root). A caller running against the
 *    unbundled source (e.g. via a test importing this file directly) needs
 *    the 4-level walk; a caller importing the built `dist/index.js` (e.g.
 *    tools/smoke-create.ts) needs the 3-level walk. This was never
 *    exercised by materialize.test.ts/create.test.ts before CLI-008, since
 *    both always inject an explicit `templateSourceDir`/`templatesDir`
 *    fixture — discovered and fixed as part of wiring the real smoke
 *    harness through the built package for the first time.
 *
 * Returns null if neither strategy finds a directory containing
 * `template.json`.
 */
export function resolveTemplateSource(templateName: string): string | null {
  // SOL-004: Validate template name to prevent path traversal.
  // Only lowercase alphanumeric characters and hyphens are allowed.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(templateName)) {
    return null
  }

  const moduleDir = dirname(fileURLToPath(import.meta.url))

  const candidates = [
    // Published layout: templates copied alongside this file by prepack.
    join(moduleDir, "templates", templateName),
    // Published layout variant: templates copied as a sibling of dist/.
    join(moduleDir, "..", "templates", templateName),
    // Monorepo-relative dev/test fallback, bundled-dist depth:
    // packages/cli/dist/index.js -> ../../../templates/<name>
    join(moduleDir, "..", "..", "..", "templates", templateName),
    // Monorepo-relative dev/test fallback, unbundled-src depth:
    // packages/cli/src/create/materialize.ts -> ../../../../templates/<name>
    join(moduleDir, "..", "..", "..", "..", "templates", templateName),
  ]

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "template.json"))) {
      return candidate
    }
  }

  return null
}

/** Recursively collects every file under `dir`, returning paths relative to `dir` (posix-style). */
function collectFiles(dir: string): string[] {
  const results: string[] = []

  function walk(current: string): void {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry)
      if (statSync(full).isDirectory()) {
        if (EXCLUDED_DIRS.has(entry)) continue
        walk(full)
      } else {
        results.push(relative(dir, full).split("\\").join("/"))
      }
    }
  }

  if (existsSync(dir)) walk(dir)
  return results
}

/**
 * Substitutes `{{var}}` tokens against `ALLOWED_VARIABLES` ∩ `variables`.
 * An unknown `{{var}}` token (not in the allowlist, or in the allowlist but
 * with no value supplied) is left untouched rather than silently blanked —
 * callers can detect leftover tokens in the written output if they care to.
 */
function substitute(content: string, variables: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (full, name: string) => {
    if (ALLOWED_VARIABLES.has(name) && Object.prototype.hasOwnProperty.call(variables, name)) {
      return variables[name]!
    }
    return full
  })
}

/**
 * Resolves the real installable version for a monorepo-local `@solidiom/*`
 * package, mirroring plan.ts's `resolveVersion` for the monorepo-relative
 * case. Returns null (rather than throwing) when the monorepo's packages/
 * directory can't be found — e.g. once this runs from a published CLI with
 * no monorepo checkout present. See the "workspace:* resolution" note in
 * materialize()'s doc comment for how that case is surfaced to the caller.
 */
function resolveMonorepoPackageVersion(packageName: string, searchFrom: string): string | null {
  const shortName = packageName.replace(/^@solidiom\//, "")
  let dir = searchFrom
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, "packages", shortName, "package.json")
    if (existsSync(candidate)) {
      try {
        const data = JSON.parse(readFileSync(candidate, "utf8")) as { version?: string }
        if (data.version) return data.version
      } catch {
        /* fall through to null */
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/**
 * Rewrites `workspace:*` (and `workspace:^`, `workspace:~`) dependency
 * specifiers in a copied package.json to real resolvable versions.
 *
 * Resolution source: the monorepo's `packages/<name>/package.json` — the
 * same source of truth plan.ts's `resolveVersion` reads for monorepo-local
 * packages. When the monorepo isn't present (a fully standalone, published
 * CLI with no checkout — the common case once this ships), there is no
 * local source of truth for "the real version," and resolving against the
 * npm registry is out of scope for this PR (see the plan's acceptance
 * note). In that case this function leaves the specifier as `workspace:*`
 * and appends a warning to `warnings` rather than crashing or guessing.
 *
 * Also rewrites pnpm's `catalog:` protocol (e.g. `"solid-js":
 * "catalog:"`), discovered as a gap during CLI-008: `catalog:` is a
 * pnpm-workspace-only specifier — npm, yarn, and bun cannot resolve it at
 * all, so a template's package.json copied byte-for-byte with a `catalog:`
 * entry fails install unconditionally under every manager except pnpm,
 * silently defeating the "installs under all four managers" acceptance
 * criterion CLI-007 already claims. Resolution source:
 * `pnpm-workspace.yaml`'s `overrides:` map FIRST, falling back to its
 * `catalog:` map — the same file the specifier itself refers to, read from
 * wherever the monorepo root is discoverable relative to the template
 * source (mirroring how `resolveMonorepoPackageVersion` above walks up
 * looking for `packages/<name>/package.json`).
 *
 * `overrides:` is checked first and preferred over `catalog:` because this
 * monorepo's own `catalog:` entries are semver RANGES against a Solid 2
 * prerelease line (`"solid-js": "^2.0.0-beta.23"`), and — discovered while
 * testing this exact rewrite against a real registry during CLI-008 — npm's
 * own range-matching for prerelease versions does not stay within the same
 * prerelease tag: resolving `^2.0.0-beta.23` against the real npm registry
 * picked `2.0.0-experimental.0` (a newer, incompatible prerelease line with
 * a different tag), not the intended `2.0.0-beta.x` line. `overrides:`
 * holds this repo's actual EXACT pin (`"solid-js": "2.0.0-beta.24"`) for
 * exactly this reason — pnpm's `overrides:` exists specifically to force a
 * single resolved version workspace-wide despite what `catalog:`'s range
 * would otherwise allow — so it is the correct, safe source to materialize
 * into a standalone project.
 */
function readPnpmWorkspaceMaps(
  searchFrom: string,
): { overrides: Record<string, string>; catalog: Record<string, string> } | null {
  let dir = searchFrom
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, "pnpm-workspace.yaml")
    if (existsSync(candidate)) {
      try {
        const content = readFileSync(candidate, "utf8")
        return {
          overrides: readYamlFlatMap(content, "overrides"),
          catalog: readYamlFlatMap(content, "catalog"),
        }
      } catch {
        return null
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/**
 * Minimal line-based read of a single flat top-level YAML map (no new
 * dependency) — good enough for this monorepo's own single flat
 * `overrides:`/`catalog:` maps; a real multi-level pnpm-workspace.yaml
 * would need a real YAML parser.
 */
function readYamlFlatMap(content: string, key: string): Record<string, string> {
  const lines = content.split("\n")
  const map: Record<string, string> = {}
  const start = lines.findIndex((l) => new RegExp(`^${key}:\\s*$`).test(l))
  if (start === -1) return map
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (/^\S/.test(line)) break // dedented past this block
    const match = line.match(/^\s*["']?([\w@/.-]+)["']?:\s*["']?([^"'\s]+)["']?\s*$/)
    if (match) map[match[1]!] = match[2]!
  }
  return map
}

function resolveCatalogVersion(packageName: string, searchFrom: string): string | null {
  const maps = readPnpmWorkspaceMaps(searchFrom)
  if (!maps) return null
  return maps.overrides[packageName] ?? maps.catalog[packageName] ?? null
}

/**
 * Fills in the package-manager fields that force a single resolved version for
 * a dependency across the entire graph.
 *
 * Rewriting `catalog:`/`workspace:*` on the DIRECT dependencies (above) is only
 * half the job. In the monorepo, `pnpm-workspace.yaml`'s `overrides:` map is
 * what actually guarantees one `solid-js` instance workspace-wide, pinning the
 * Solid 2 prerelease line to an exact version. A materialized standalone
 * project has no workspace file, so nothing constrains the TRANSITIVE graph:
 * every package that peer-depends on `solid-js`/`@solidjs/web` is free to pull
 * its own range, which produces either a duplicated Solid runtime (two copies
 * of the reactive graph — broken at runtime, and silently so) or, under npm, a
 * multi-minute resolver backtrack across the whole prerelease space. Both were
 * observed while building CLI-008's smoke matrix.
 *
 * Each manager reads a different field, so all three are emitted; every manager
 * ignores the ones it does not recognize:
 *   - `overrides`       npm, bun
 *   - `resolutions`     yarn, bun
 *   - `pnpm.overrides`  pnpm
 *
 * Entries the template itself declares always win — this only fills gaps, so a
 * template can still deliberately override a pin.
 *
 * Known limit, shared with `workspace:*` rewriting: the source of truth is the
 * monorepo's `pnpm-workspace.yaml`. Running from a published CLI with no
 * checkout present, there is no overrides map to read and none is emitted.
 */
function applyDependencyOverrides(
  data: Record<string, unknown>,
  overrides: Record<string, string>,
): boolean {
  if (Object.keys(overrides).length === 0) return false

  let changed = false

  const yarnResolutionKey = (selector: string): string => {
    const separator = selector.startsWith("@")
      ? selector.indexOf("@", selector.indexOf("/") + 1)
      : selector.indexOf("@")
    return separator > 0 ? selector.slice(0, separator) : selector
  }
  const yarnResolutions = Object.fromEntries(
    Object.entries(overrides).map(([selector, version]) => [yarnResolutionKey(selector), version]),
  )

  const fillGaps = (
    existing: unknown,
    defaults: Record<string, string>,
  ): Record<string, string> => {
    const declared =
      existing && typeof existing === "object" ? (existing as Record<string, string>) : {}
    return { ...defaults, ...declared }
  }

  const setIfChanged = (
    target: Record<string, unknown>,
    key: string,
    defaults: Record<string, string>,
  ): void => {
    const next = fillGaps(target[key], defaults)
    if (JSON.stringify(target[key]) !== JSON.stringify(next)) {
      target[key] = next
      changed = true
    }
  }

  setIfChanged(data, "overrides", overrides)
  setIfChanged(data, "resolutions", yarnResolutions)

  const pnpmSection =
    data["pnpm"] && typeof data["pnpm"] === "object"
      ? (data["pnpm"] as Record<string, unknown>)
      : {}
  setIfChanged(pnpmSection, "overrides", overrides)
  data["pnpm"] = pnpmSection

  return changed
}

function rewritePackageJsonForStandalone(
  packageJsonContent: string,
  searchFrom: string,
  warnings: string[],
): string {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(packageJsonContent)
  } catch {
    // Not valid JSON — nothing this function can safely rewrite; leave as-is.
    return packageJsonContent
  }

  const depFields = ["dependencies", "devDependencies", "peerDependencies"] as const
  let changed = false

  for (const field of depFields) {
    const deps = data[field] as Record<string, string> | undefined
    if (!deps) continue
    for (const [name, spec] of Object.entries(deps)) {
      if (spec.startsWith("workspace:")) {
        const resolved = resolveMonorepoPackageVersion(name, searchFrom)
        if (resolved) {
          deps[name] = resolved
          changed = true
        } else {
          warnings.push(
            `Could not resolve a real version for "${name}" (${spec}) — no monorepo packages/ directory found from the template source. Left as "${spec}"; this must be resolved before the generated project can install cleanly outside this monorepo.`,
          )
        }
        continue
      }

      if (spec.startsWith("catalog:")) {
        const resolved = resolveCatalogVersion(name, searchFrom)
        if (resolved) {
          deps[name] = resolved
          changed = true
        } else {
          warnings.push(
            `Could not resolve a real version for "${name}" (${spec}) — no pnpm-workspace.yaml catalog entry found from the template source. Left as "${spec}"; this specifier is not understood by npm/yarn/bun and must be resolved before the generated project can install under any manager other than pnpm.`,
          )
        }
      }
    }
  }

  const workspaceMaps = readPnpmWorkspaceMaps(searchFrom)
  if (workspaceMaps && applyDependencyOverrides(data, workspaceMaps.overrides)) {
    changed = true
  }

  return changed ? JSON.stringify(data, null, 2) + "\n" : packageJsonContent
}

/**
 * Strips repo-local tsconfig `extends` (e.g. `"../../tsconfig.base.json"`)
 * and any monorepo-relative `references` entries from a copied
 * tsconfig.json, replacing `extends` with a minimal self-contained
 * compilerOptions block so the generated project can typecheck standalone
 * without the monorepo's tsconfig.base.json present.
 */
function stripMonorepoTsconfig(tsconfigContent: string): string {
  let data: Record<string, unknown>
  try {
    data = JSON.parse(tsconfigContent)
  } catch {
    return tsconfigContent
  }

  const extendsValue = data["extends"]
  const isMonorepoRelativeExtends =
    typeof extendsValue === "string" &&
    (extendsValue.startsWith("../") || extendsValue.startsWith("..\\"))

  if (isMonorepoRelativeExtends) {
    delete data["extends"]
    const existingOptions = (data["compilerOptions"] as Record<string, unknown>) ?? {}
    data["compilerOptions"] = {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      ...existingOptions,
    }
  }

  if (Array.isArray(data["references"])) {
    data["references"] = (data["references"] as Array<{ path?: string }>).filter(
      (ref) => typeof ref.path !== "string" || !ref.path.startsWith(".."),
    )
    if ((data["references"] as unknown[]).length === 0) {
      delete data["references"]
    }
  }

  return JSON.stringify(data, null, 2) + "\n"
}

/**
 * Materializes a template into `destination`.
 *
 * Behavior:
 *  - Resolves the template source (via `templateSourceDir` override, or
 *    `resolveTemplateSource`) and fails with an error if it can't be found.
 *  - Copies every file except `template.json`/excluded dirs/lockfiles.
 *  - Refuses (does not copy) any lockfile found in the template payload —
 *    the foreign-lockfile rule (plan §8.4) — and records an error. This is
 *    "refuse" rather than "strip-and-warn": a template should never ship a
 *    lockfile in the first place, so treating it as an error surfaces a bug
 *    in the template itself rather than quietly tolerating it.
 *  - Applies `{{var}}` substitution against the allowlist to every text
 *    file's content.
 *  - Rewrites `workspace:*` specifiers in package.json.
 *  - Emits `overrides`/`resolutions`/`pnpm.overrides` into package.json from
 *    the monorepo's `pnpm-workspace.yaml` `overrides:` map, so the generated
 *    project resolves a single version of the pinned Solid packages under
 *    every manager rather than duplicating them transitively.
 *  - Strips repo-local tsconfig extends/references in tsconfig.json.
 *
 * NOTE on the foreign-lockfile rule's other half: "after install only the
 * chosen manager's lockfile exists" is enforced by the INSTALL step
 * (CLI-005's runPackageManager in commands/create.ts), not by this
 * function — materialize() always runs strictly before any install, so it
 * has no visibility into which manager will eventually run or what
 * lockfile it will produce.
 */
export function materialize(options: MaterializeOptions): MaterializeResult {
  const { templateName, destination, projectName, variables = {}, templateSourceDir } = options

  const sourceDir = templateSourceDir ?? resolveTemplateSource(templateName)
  if (!sourceDir || !existsSync(join(sourceDir, "template.json"))) {
    return {
      filesWritten: [],
      errors: [
        `Could not resolve source directory for template "${templateName}" — checked the published-CLI layout and the monorepo-relative dev fallback.`,
      ],
    }
  }

  const allVariables: Record<string, string> = { projectName, ...variables }
  const relativeFiles = collectFiles(sourceDir)

  const filesWritten: string[] = []
  const errors: string[] = []
  const warnings: string[] = []

  for (const relPath of relativeFiles) {
    const baseName = relPath.split("/").pop() ?? relPath

    if (EXCLUDED_FILES.has(baseName)) continue

    if (LOCKFILE_NAMES.has(baseName)) {
      errors.push(
        `Template "${templateName}" contains a foreign lockfile ("${relPath}") — refusing to copy it. Templates must not ship a lockfile; the install step produces the correct one for the chosen package manager.`,
      )
      continue
    }

    const sourcePath = join(sourceDir, relPath)
    const targetPath = join(destination, relPath)

    const rawContent = readFileSync(sourcePath)
    // Only attempt text substitution/rewriting on files we can safely treat
    // as UTF-8 text — binary assets pass through byte-for-byte.
    const isLikelyText = /\.(json|ts|tsx|js|jsx|html|css|md|mdx|txt|yaml|yml)$/.test(baseName)

    let outputBuffer: Buffer | string = rawContent
    if (isLikelyText) {
      let text = rawContent.toString("utf8")
      text = substitute(text, allVariables)

      if (baseName === "package.json") {
        text = rewritePackageJsonForStandalone(text, sourceDir, warnings)
      }
      if (baseName === "tsconfig.json") {
        text = stripMonorepoTsconfig(text)
      }

      outputBuffer = text
    }

    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(targetPath, outputBuffer)
    filesWritten.push(relative(destination, targetPath).split("\\").join("/"))
  }

  const allErrors = [...errors, ...warnings]

  return {
    filesWritten,
    ...(allErrors.length > 0 ? { errors: allErrors } : {}),
  }
}
