/**
 * solidiom plan — resolves the capability graph for a primitive and emits JSON.
 *
 * Reads the registry catalog (or node_modules package.json files) to resolve
 * real version numbers. Validates against policy constraints.
 */

import { Command, Option } from "clipanion"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { ConfigSchema, PolicySchema, type Config, type Policy } from "../schemas"
import pc from "picocolors"

/** A resolved plan entry. */
export interface PlanEntry {
  package: string
  version: string
  isAdapter: boolean
  reason: string
}

/** The full plan output. */
export interface Plan {
  primitive: string
  mode: "package" | "source"
  entries: PlanEntry[]
  violations: string[]
}

export interface PlanOptions {
  primitive: string
  cwd: string
  mode?: "package" | "source"
  registry?: string
  noNetwork?: boolean
}

/** Registry entry for a primitive. */
interface RegistryPrimitive {
  name: string
  deps: string[]
  adapters: string[]
  version?: string
}

/**
 * Loads the registry catalog. Resolves from:
 * 1. Custom registry URL/path (from --registry flag)
 * 2. SOLIDIOM_REGISTRY_PATH environment variable
 * 3. Monorepo-relative registry/index.json
 * 4. Local .solidiom/registry-cache.json
 *
 * Returns null if no registry is found (caller should scan node_modules).
 */
function loadRegistry(cwd: string, registryOverride?: string): Map<string, RegistryPrimitive> | null {
  const candidates = [
    // Custom registry path takes highest priority
    registryOverride ? join(registryOverride, "index.json") : null,
    process.env["SOLIDIOM_REGISTRY_PATH"]
      ? join(process.env["SOLIDIOM_REGISTRY_PATH"], "index.json")
      : null,
    join(cwd, "..", "..", "registry", "index.json"),
    join(cwd, "node_modules", "@solidiom", "registry", "index.json"),
    join(cwd, ".solidiom", "registry-cache.json"),
  ].filter(Boolean) as string[]

  for (const path of candidates) {
    if (!existsSync(path)) continue
    try {
      const data = JSON.parse(readFileSync(path, "utf8"))
      const registry = new Map<string, RegistryPrimitive>()
      for (const p of data.primitives ?? []) {
        registry.set(p.name, {
          name: p.name,
          deps: p.deps ?? ["@solidiom/runtime"],
          adapters: p.adapters ?? [],
          version: p.version,
        })
      }
      return registry
    } catch {
      /* try next */
    }
  }

  return null
}

/**
 * Resolve the version of a package from:
 * 1. Registry catalog entry
 * 2. node_modules/<pkg>/package.json
 * 3. Monorepo packages/<name>/package.json
 */
function resolveVersion(pkg: string, cwd: string, registryVersion?: string): string {
  // Prefer registry version if available
  if (registryVersion) return registryVersion

  // Try node_modules
  const nmPkgJson = join(cwd, "node_modules", ...pkg.split("/"), "package.json")
  if (existsSync(nmPkgJson)) {
    try {
      const data = JSON.parse(readFileSync(nmPkgJson, "utf8"))
      if (data.version) return data.version
    } catch {
      /* fall through */
    }
  }

  // Try monorepo-relative (for development)
  const shortName = pkg.replace("@solidiom/", "")
  const monoRepoPkgJson = join(cwd, "..", "..", "packages", shortName, "package.json")
  if (existsSync(monoRepoPkgJson)) {
    try {
      const data = JSON.parse(readFileSync(monoRepoPkgJson, "utf8"))
      if (data.version) return data.version
    } catch {
      /* fall through */
    }
  }

  return "latest"
}

/**
 * Scan node_modules to discover a primitive's dependency graph when no registry exists.
 */
function discoverFromNodeModules(primitive: string, cwd: string): RegistryPrimitive | null {
  const pkgJsonPath = join(cwd, "node_modules", "@solidiom", primitive, "package.json")
  if (!existsSync(pkgJsonPath)) return null

  try {
    const data = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
    const deps: string[] = []
    const adapters: string[] = []

    for (const dep of Object.keys(data.dependencies ?? {})) {
      if (dep.startsWith("@solidiom/adapter-")) {
        adapters.push(dep)
      } else if (dep.startsWith("@solidiom/")) {
        deps.push(dep)
      }
    }

    // Also check peerDependencies for adapters (they're often optional peers)
    for (const dep of Object.keys(data.peerDependencies ?? {})) {
      if (dep.startsWith("@solidiom/adapter-") && !adapters.includes(dep)) {
        adapters.push(dep)
      }
    }

    if (!deps.includes("@solidiom/runtime")) deps.unshift("@solidiom/runtime")

    return { name: primitive, deps, adapters, version: data.version }
  } catch {
    return null
  }
}

/**
 * Built-in knowledge of core primitives for offline/bootstrapping scenarios.
 * Used when neither registry nor node_modules are available.
 */
const BUILTIN_PRIMITIVES = new Map<string, RegistryPrimitive>([
  ["dialog", { name: "dialog", deps: ["@solidiom/runtime"], adapters: [] }],
  [
    "select",
    {
      name: "select",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"],
    },
  ],
  [
    "calendar",
    {
      name: "calendar",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-date-internationalized"],
    },
  ],
  [
    "carousel",
    { name: "carousel", deps: ["@solidiom/runtime"], adapters: ["@solidiom/adapter-carousel-embla"] },
  ],
  [
    "popover",
    {
      name: "popover",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"],
    },
  ],
  [
    "tooltip",
    {
      name: "tooltip",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"],
    },
  ],
  [
    "menu",
    { name: "menu", deps: ["@solidiom/runtime"], adapters: ["@solidiom/adapter-positioning-floating-ui"] },
  ],
  [
    "combobox",
    {
      name: "combobox",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"],
    },
  ],
  [
    "date-picker",
    {
      name: "date-picker",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-date-internationalized"],
    },
  ],
  ["button", { name: "button", deps: ["@solidiom/runtime"], adapters: [] }],
  ["checkbox", { name: "checkbox", deps: ["@solidiom/runtime"], adapters: [] }],
  ["switch", { name: "switch", deps: ["@solidiom/runtime"], adapters: [] }],
  ["slider", { name: "slider", deps: ["@solidiom/runtime"], adapters: [] }],
  ["accordion", { name: "accordion", deps: ["@solidiom/runtime"], adapters: [] }],
  ["tabs", { name: "tabs", deps: ["@solidiom/runtime"], adapters: [] }],
  ["collapsible", { name: "collapsible", deps: ["@solidiom/runtime"], adapters: [] }],
  ["toast", { name: "toast", deps: ["@solidiom/runtime"], adapters: [] }],
  ["listbox", { name: "listbox", deps: ["@solidiom/runtime"], adapters: [] }],
])

/**
 * Core plan logic — usable from CLI and programmatic API.
 */
export function runPlan(options: PlanOptions): Plan {
  const { primitive, cwd, mode: modeOverride, registry: registryOverride, noNetwork: _noNetwork } = options

  const configPath = join(cwd, ".solidiom", "config.json")
  const config: Config = existsSync(configPath)
    ? ConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8")))
    : ConfigSchema.parse({})

  const policyPath = join(cwd, ".solidiom", "policy.json")
  const policy: Policy = existsSync(policyPath)
    ? PolicySchema.parse(JSON.parse(readFileSync(policyPath, "utf8")))
    : PolicySchema.parse({})

  const mode = modeOverride ?? config.defaultMode

  // Resolve primitive from registry or node_modules.
  // When _noNetwork (--no-network) is true, we rely entirely on local file-based resolution
  // (registry catalog, node_modules, or builtin primitives). No remote fetches occur.
  // Currently all resolution is file-based, so this flag is a no-op but documents intent
  // and will guard any future network-based resolution paths.
  const registry = loadRegistry(cwd, registryOverride)
  let entry: RegistryPrimitive | null = null

  if (registry) {
    entry = registry.get(primitive) ?? null
  }

  // Fallback: scan node_modules if registry doesn't have it
  if (!entry) {
    entry = discoverFromNodeModules(primitive, cwd)
  }

  // Last resort: built-in knowledge of core primitives for offline/bootstrapping scenarios
  if (!entry) {
    entry = BUILTIN_PRIMITIVES.get(primitive) ?? null
  }

  if (!entry) {
    return {
      primitive,
      mode,
      entries: [],
      violations: [`Unknown primitive: "${primitive}" — not found in registry or node_modules`],
    }
  }

  // Resolve real versions for each entry
  const primitiveVersion = resolveVersion(`@solidiom/${primitive}`, cwd, entry.version)

  const entries: PlanEntry[] = [
    {
      package: `@solidiom/${primitive}`,
      version: primitiveVersion,
      isAdapter: false,
      reason: "requested",
    },
    ...entry.deps.map((dep) => ({
      package: dep,
      version: resolveVersion(dep, cwd),
      isAdapter: false,
      reason: "dependency",
    })),
    ...entry.adapters.map((adapter) => ({
      package: adapter,
      version: resolveVersion(adapter, cwd),
      isAdapter: true,
      reason: "capability",
    })),
  ]

  // Validate against policy
  const violations: string[] = []
  for (const e of entries) {
    const allowed = policy.allowedPrimitiveVersions[e.package]
    if (allowed) {
      const allowedBase = allowed.replace(/^[\^~]/, "")
      if (!e.version.startsWith(allowedBase)) {
        violations.push(`${e.package}@${e.version} not allowed by policy (requires ${allowed})`)
      }
    }
  }

  return { primitive, mode, entries, violations }
}

/**
 * Clipanion command wrapper.
 */
export class PlanCommand extends Command {
  static override paths = [["plan"]]
  static override usage = Command.Usage({
    description: "Resolve capability graph for a primitive",
    examples: [
      ["Plan dialog installation", "solidiom plan dialog"],
      ["Plan as JSON", "solidiom plan select --json"],
      ["Plan in source mode", "solidiom plan dialog --mode source"],
    ],
  })

  primitive = Option.String({ required: true })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })
  mode = Option.String("--mode", { description: "Install mode (package or source)" })
  registry = Option.String("--registry", { description: "Custom registry URL for package resolution" })
  noNetwork = Option.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)",
  })

  async execute(): Promise<number> {
    const plan = runPlan({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode as "package" | "source" | undefined,
      registry: this.registry,
      noNetwork: this.noNetwork,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(plan, null, 2) + "\n")
      return 0
    }

    this.context.stdout.write(`\nPlan for ${pc.bold(plan.primitive)} (${plan.mode} mode):\n\n`)
    for (const entry of plan.entries) {
      const tag = entry.isAdapter ? pc.cyan("[adapter]") : pc.dim(`[${entry.reason}]`)
      this.context.stdout.write(`  ${entry.package}@${pc.green(entry.version)} ${tag}\n`)
    }

    if (plan.violations.length > 0) {
      this.context.stderr.write(pc.red("\nPolicy violations:\n"))
      for (const v of plan.violations) {
        this.context.stderr.write(pc.red(`  ✗ ${v}\n`))
      }
      return 1
    }

    this.context.stdout.write(`\n${pc.dim(`${plan.entries.length} packages resolved.`)}\n`)
    return 0
  }
}
