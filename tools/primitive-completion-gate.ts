/**
 * Enforces the completion contract for every public Solidiom primitive.
 *
 * Usage:
 *   pnpm primitive:gate
 *   pnpm primitive:gate -- button
 *   pnpm primitive:audit
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const TOOL_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = join(TOOL_DIR, "..")
const VALID_CATEGORIES = new Set(["a11y", "display", "feedback", "input", "layout", "navigation", "overlay"])
const RECIPE_PROFILES = ["css", "tailwind"] as const
const FORBIDDEN_SOLID_PATTERNS: Array<[RegExp, string]> = [
  [/from\s+["']solid-js\/web["']/, "must import DOM runtime types from @solidjs/web"],
  [/\bonMount\s*\(/, "must use onSettled instead of onMount"],
  [/\bcreateResource\s*\(/, "must use async computations instead of createResource"],
  [/\bmergeProps\s*\(/, "must use merge instead of mergeProps"],
  [/\bsplitProps\s*\(/, "must use omit instead of splitProps"],
  [/\.Provider\b/, "must render the context directly instead of Context.Provider"],
  [/\basChild\??\s*:/, "must use composition instead of an asChild prop"],
  [/\bisLoading\??\s*:/, "must use loading instead of isLoading"],
]

interface RegistryPrimitive {
  name: string
  version: string
  package: string
  label?: string
  description?: string
  category?: string
}

interface RegistryIndex {
  primitives?: RegistryPrimitive[]
}

interface CompletionPolicy {
  recipe?: string[]
  headlessOnly?: string[]
}

interface PackageJson {
  name?: string
  version?: string
  private?: boolean
  files?: string[]
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  exports?: Record<string, { solid?: string; import?: string; types?: string }>
  nx?: {
    tags?: string[]
    metadata?: { label?: string; description?: string; category?: string }
  }
}

export interface PrimitiveCompletionFailure {
  primitive: string
  message: string
}

export interface PrimitiveCompletionReport {
  checked: number
  failures: PrimitiveCompletionFailure[]
}

export interface PrimitiveCompletionOptions {
  names?: string[]
  executeCommands?: boolean
}

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

function readText(path: string): string {
  return existsSync(path) ? readFileSync(path, "utf8") : ""
}

function listSourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const files: string[] = []

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      files.push(...listSourceFiles(fullPath))
    } else if (/\.[cm]?[jt]sx?$/.test(entry)) {
      files.push(fullPath)
    }
  }

  return files
}

function hasDemoEntry(demosIndex: string, name: string): boolean {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(?:^|[,\\{]\\s*)(?:["']${escapedName}["']|${escapedName}):\\s*\\{`, "m").test(
    demosIndex,
  )
}

function hasRecipeSupport(
  root: string,
  profile: "css" | "tailwind" | "unocss",
  name: string,
): boolean {
  const path =
    profile === "unocss"
      ? join(root, "packages/recipes-unocss/src/index.ts")
      : join(root, `packages/recipes-${profile}/src/meta.ts`)
  const source = readText(path)
  return new RegExp(`["']${name}["']`).test(source)
}

function runPackageCommand(root: string, packageName: string, command: string): boolean {
  try {
    execSync(`pnpm --filter ${packageName} ${command}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 180_000,
    })
    return true
  } catch {
    return false
  }
}

/** Audits public primitives against package, registry, docs, recipe, and Solid 2 contracts. */
export function auditPrimitiveCompletion(
  root = DEFAULT_ROOT,
  options: PrimitiveCompletionOptions = {},
): PrimitiveCompletionReport {
  const failures: PrimitiveCompletionFailure[] = []
  const fail = (primitive: string, message: string): void => {
    failures.push({ primitive, message })
  }

  const registry = readJson<RegistryIndex>(join(root, "registry/index.json"))
  const policy = readJson<CompletionPolicy>(join(root, "tools/primitive-completion-policy.json"))
  const allPrimitives = registry?.primitives ?? []
  const requestedNames = options.names ?? allPrimitives.map((primitive) => primitive.name)
  const primitives = requestedNames
    .map((name) => allPrimitives.find((primitive) => primitive.name === name))
    .filter((primitive): primitive is RegistryPrimitive => {
      if (primitive) return true
      fail("registry", `unknown public primitive: ${nameForUnknown(requestedNames, allPrimitives)}`)
      return false
    })

  const recipeNames = new Set(policy?.recipe ?? [])
  const headlessOnlyNames = new Set(policy?.headlessOnly ?? [])
  const umbrellaSource = readText(join(root, "packages/primitives/src/index.ts"))
  const umbrellaPackage = readJson<PackageJson>(join(root, "packages/primitives/package.json"))
  const demosIndex = readText(join(root, "apps/docs/src/demos/index.ts"))
  const docsPackage = readJson<PackageJson>(join(root, "apps/docs/package.json"))

  for (const primitive of primitives) {
    const { name } = primitive
    const packageDir = join(root, "packages", name)
    const packageJson = readJson<PackageJson>(join(packageDir, "package.json"))
    const sourceFiles = listSourceFiles(join(packageDir, "src"))
    const implementationFiles = sourceFiles.filter((path) => !/\.(test|spec)\./.test(path))
    const testFiles = sourceFiles.filter((path) =>
      /\.(browser\.)?(test|spec)\.[cm]?[jt]sx?$/.test(path),
    )
    const implementation = implementationFiles.map(readText).join("\n")
    const entryPath = [join(packageDir, "src/index.tsx"), join(packageDir, "src/index.ts")].find(
      (path) => existsSync(path),
    )
    const recipeClassified = recipeNames.has(name)
    const headlessClassified = headlessOnlyNames.has(name)

    if (recipeClassified === headlessClassified) {
      fail(name, "must be classified as recipe or headless-only")
    }
    if (!packageJson) {
      fail(name, `must have packages/${name}/package.json`)
      continue
    }

    if (packageJson.name !== primitive.package)
      fail(name, "package name must match registry package")
    if (packageJson.private) fail(name, "public primitive package must not be private")
    if (!packageJson.nx?.tags?.includes("layer:primitive"))
      fail(name, "must have Nx tag layer:primitive")
    if (!entryPath) fail(name, "must have src/index.tsx or src/index.ts")
    if (entryPath && !readText(entryPath).startsWith("/**"))
      fail(name, "entry file must start with JSDoc")
    if (
      implementationFiles.some((path) => path.endsWith(".tsx")) &&
      !implementation.includes('from "@solidjs/web"') &&
      !implementation.includes("from '@solidjs/web'")
    ) {
      fail(name, "TSX primitives must import JSX types from @solidjs/web")
    }
    if (!implementation.includes("applySemanticAttrs")) fail(name, "must use applySemanticAttrs")
    if (!/class\s*\??:\s*string/.test(implementation)) fail(name, "must expose a class string prop")
    for (const [pattern, message] of FORBIDDEN_SOLID_PATTERNS) {
      if (pattern.test(implementation)) fail(name, message)
    }

    for (const script of ["build", "test", "typecheck"]) {
      if (!packageJson.scripts?.[script]) fail(name, `must define ${script} script`)
    }
    const exports = packageJson.exports?.["."]
    if (!exports?.solid || !exports.import || !exports.types)
      fail(name, "must export solid, import, and types conditions")
    for (const packagedPath of ["dist", "source", "src"]) {
      if (!packageJson.files?.includes(packagedPath))
        fail(name, `package files must include ${packagedPath}`)
    }
    if (
      !existsSync(join(packageDir, "source/index.tsx")) &&
      !existsSync(join(packageDir, "source/index.ts"))
    ) {
      fail(name, "must have generated source emission")
    }
    if (testFiles.length === 0) {
      fail(name, "must include at least one unit or browser test")
    } else if (!testFiles.some((path) => /\bexpect(?:\.element)?\s*\(/.test(readText(path)))) {
      fail(name, "tests must contain assertions")
    }

    const metadata = packageJson.nx?.metadata
    if (!metadata?.label || !metadata.description || !metadata.category)
      fail(name, "must define complete nx.metadata")
    if (metadata?.category && !VALID_CATEGORIES.has(metadata.category))
      fail(name, `has unsupported category ${metadata.category}`)
    if (
      metadata?.label !== primitive.label ||
      metadata?.description !== primitive.description ||
      metadata?.category !== primitive.category
    ) {
      fail(name, "registry metadata must match package nx.metadata")
    }

    const manifest = readJson<{
      name?: string
      version?: string
      package?: string
      source?: { files?: string[] }
    }>(join(root, "registry", `${name}.json`))
    if (!manifest) {
      fail(name, `must have registry/${name}.json`)
    } else {
      if (
        manifest.name !== name ||
        manifest.package !== primitive.package ||
        manifest.version !== primitive.version
      ) {
        fail(name, "registry manifest identity must match registry index")
      }
      if (!manifest.source?.files?.length) fail(name, "registry manifest must list source files")
    }

    if (!umbrellaSource.includes(`@solidiom/${name}`))
      fail(name, "must be exported by @solidiom/primitives")
    if (umbrellaPackage?.dependencies?.[`@solidiom/${name}`] !== "workspace:*")
      fail(name, "must be an @solidiom/primitives dependency")
    if (!hasDemoEntry(demosIndex, name)) fail(name, "must have a docs demo entry")
    if (!existsSync(join(root, `apps/docs/src/demos/${name}-demo.tsx`)))
      fail(name, `must have ${name}-demo.tsx`)
    if (docsPackage?.dependencies?.[`@solidiom/${name}`] !== "workspace:*")
      fail(name, "must be an @solidiom/docs dependency")

    for (const profile of [...RECIPE_PROFILES, "unocss"] as const) {
      const supported = hasRecipeSupport(root, profile, name)
      if (recipeClassified && !supported)
        fail(name, `must be listed by the ${profile} recipe profile`)
      if (headlessClassified && supported)
        fail(name, `headless-only primitive must not be listed by the ${profile} recipe profile`)
    }
    if (recipeClassified) {
      for (const profile of RECIPE_PROFILES) {
        const recipeRoot = join(root, `packages/recipes-${profile}`)
        if (!existsSync(join(recipeRoot, `src/recipes/${name}.tsx`)))
          fail(name, `must have a ${profile === "css" ? "CSS" : "Tailwind"} recipe component`)
        if (!existsSync(join(recipeRoot, `src/styles/${name}.css`)))
          fail(name, `must have a ${profile === "css" ? "CSS" : "Tailwind"} recipe stylesheet`)
        if (!readText(join(recipeRoot, "src/index.ts")).includes(`./recipes/${name}`))
          fail(name, `must export the ${profile} recipe`)
        const recipePackage = readJson<PackageJson>(join(recipeRoot, "package.json"))
        if (recipePackage?.dependencies?.[`@solidiom/${name}`] !== "workspace:*")
          fail(name, `must be a recipes-${profile} dependency`)
        if (!recipePackage?.exports?.[`./styles/${name}.css`])
          fail(name, `must export the ${profile} stylesheet`)
      }
    }

    if (options.executeCommands && !failures.some((failure) => failure.primitive === name)) {
      for (const command of ["typecheck", "build", "test"]) {
        if (!runPackageCommand(root, primitive.package, command))
          fail(name, `${command} command must pass`)
      }
    }
  }

  return { checked: primitives.length, failures }
}

function nameForUnknown(requestedNames: string[], primitives: RegistryPrimitive[]): string {
  const publicNames = new Set(primitives.map((primitive) => primitive.name))
  return requestedNames.find((name) => !publicNames.has(name)) ?? "unknown"
}

function printReport(report: PrimitiveCompletionReport): void {
  if (report.failures.length === 0) {
    console.log(`Primitive completion gate: ${report.checked} passed, 0 failed`)
    return
  }

  for (const failure of report.failures) {
    console.error(`  ✗ ${failure.primitive}: ${failure.message}`)
  }
  console.error(
    `Primitive completion gate: ${report.checked} checked, ${report.failures.length} failures`,
  )
}

const isMain = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false
if (isMain) {
  const names = process.argv.slice(2).filter((argument) => !argument.startsWith("--"))
  const auditOnly = process.argv.includes("--audit-only")
  const report = auditPrimitiveCompletion(DEFAULT_ROOT, {
    names: names.length > 0 ? names : undefined,
    executeCommands: !auditOnly,
  })
  printReport(report)
  process.exitCode = report.failures.length === 0 ? 0 : 1
}
