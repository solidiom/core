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

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs"
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
 * 2. Monorepo-relative dev/test fallback: mirrors install.ts's
 *    `resolvePrimitiveSource` pattern — walk from this module's own
 *    directory up to the monorepo root and check `templates/<name>`. This
 *    is what makes `solidiom create` work when run from inside this
 *    monorepo during development, and is also what the test suite exercises
 *    indirectly (though unit tests for materialize() itself pass an
 *    explicit `templateSourceDir` fixture instead of relying on this).
 *
 * Returns null if neither strategy finds a directory containing
 * `template.json`.
 */
export function resolveTemplateSource(templateName: string): string | null {
  const moduleDir = dirname(fileURLToPath(import.meta.url))

  const candidates = [
    // Published layout: templates copied alongside this file by prepack.
    join(moduleDir, "templates", templateName),
    // Published layout variant: templates copied as a sibling of dist/.
    join(moduleDir, "..", "templates", templateName),
    // Monorepo-relative dev/test fallback: packages/cli/src/create -> ../../../../templates/<name>
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
 */
function rewriteWorkspaceVersions(
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
      if (!spec.startsWith("workspace:")) continue
      const resolved = resolveMonorepoPackageVersion(name, searchFrom)
      if (resolved) {
        deps[name] = resolved
        changed = true
      } else {
        warnings.push(
          `Could not resolve a real version for "${name}" (${spec}) — no monorepo packages/ directory found from the template source. Left as "${spec}"; this must be resolved before the generated project can install cleanly outside this monorepo.`,
        )
      }
    }
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
    typeof extendsValue === "string" && (extendsValue.startsWith("../") || extendsValue.startsWith("..\\"))

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
        text = rewriteWorkspaceVersions(text, sourceDir, warnings)
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
