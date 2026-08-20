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
import { readRegistryIndex, type Deliverable, type StylingProfile } from "../registry-schema"
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
  /** Product-layer deliverable this plan resolves, if requested via --deliverable. */
  deliverable?: Deliverable
  /** Styling profile this plan resolves, if requested via --styling. */
  stylingProfile?: StylingProfile
  /** Styling outputs the resolved primitive actually has recipes for. */
  stylingOutputs: StylingProfile[]
  violations: string[]
}

export interface PlanOptions {
  primitive: string
  cwd: string
  mode?: "package" | "source"
  registry?: string
  noNetwork?: boolean
  /** Request a specific product-layer deliverable (primitive, component, block, template, theme). */
  deliverable?: Deliverable
  /** Request a specific styling profile (css, tailwind, unocss). */
  styling?: StylingProfile
}

/** Registry entry for a primitive, carrying the product-layer and styling metadata CLI-002 needs. */
interface RegistryPrimitive {
  name: string
  deps: string[]
  adapters: string[]
  version?: string
  /** Product-layer deliverables this entry provides. Always includes "primitive" for real registry/BUILTIN entries. */
  deliverables: Deliverable[]
  /** Styling recipe outputs confirmed to exist for this entry. Empty means no confirmed styling support. */
  stylingOutputs: StylingProfile[]
  /** Theme slugs this entry is confirmed compatible with. */
  themeCompatible: string[]
}

/**
 * Loads the registry catalog. Resolves from:
 * 1. Custom registry URL/path (from --registry flag)
 * 2. SOLIDIOM_REGISTRY_PATH environment variable
 * 3. Monorepo-relative registry/index.json
 * 4. Local .solidiom/registry-cache.json
 *
 * Returns null if no registry file exists at any candidate path (caller should
 * scan node_modules). If a candidate file exists but fails schema validation
 * (wrong version, malformed shape), this throws `RegistrySchemaError` instead
 * of silently falling through to the next candidate — an untrusted or
 * corrupted registry must not be treated as "absent" (REG-004).
 */
function loadRegistry(
  cwd: string,
  registryOverride?: string,
): Map<string, RegistryPrimitive> | null {
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

    const index = readRegistryIndex(path)
    const registry = new Map<string, RegistryPrimitive>()
    for (const p of index.primitives) {
      registry.set(p.name, {
        name: p.name,
        deps: ["@solidiom/runtime"],
        adapters: [],
        version: p.version,
        deliverables: p.deliverables,
        stylingOutputs: p.stylingOutputs,
        themeCompatible: p.themeCompatible,
      })
    }
    return registry
  }

  return null
}

/**
 * Convert an exact version resolved from the registry into an install
 * specifier that tolerates in-range publishes (REL-C1).
 *
 * The registry pins an exact version per entry, but a single-package patch or
 * minor release publishes a newer package to npm *without* regenerating the
 * registry catalog. Emitting a caret range (`^0.3.0`) instead of an exact pin
 * (`0.3.0`) lets consumers pick up those in-range releases at install time, so
 * the metadata catalog no longer has to be rebuilt for every package bump.
 *
 * Rules:
 *   - `latest` / `next` / any dist-tag → returned unchanged (not a version).
 *   - A version that already carries a range operator (`^`, `~`, `>=`, `*`,
 *     `x`, `||`, ` - `) → returned unchanged; it is already a range.
 *   - A pre-release (contains `-`, e.g. `0.3.0-beta.1`) → returned exact.
 *     Caret ranges do not span pre-release boundaries predictably, so pinning
 *     is the safe choice while the workspace is on pre-release versions.
 *   - `0.y.z` → `^0.y.z`. npm caret semantics keep 0.x safe: `^0.3.0` allows
 *     `>=0.3.0 <0.4.0`, so patch/minor-within-0.3 releases are picked up but a
 *     breaking 0.4.0 is not.
 *   - `x.y.z` (x >= 1) → `^x.y.z`.
 */
export function toInstallSpecifier(version: string): string {
  const v = version.trim()

  // Dist-tags and empty strings are not versions.
  if (v === "" || !/^\d/.test(v)) return v

  // Already a range specifier — leave it alone.
  if (/[\^~*x]|>=|<=|>|<|\|\||\s-\s/.test(v)) return v

  // Pre-release identifiers: pin exactly rather than caret-ranging across a
  // pre-release boundary, whose semver precedence is surprising.
  if (v.includes("-")) return v

  // Plain semver → caret range.
  return `^${v}`
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
 *
 * node_modules package.json carries no product-layer or styling metadata, so
 * this fallback can only ever confirm "primitive" — it must not claim
 * component/block/template/theme support or styling outputs it hasn't verified.
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

    return {
      name: primitive,
      deps,
      adapters,
      version: data.version,
      deliverables: ["primitive"],
      stylingOutputs: [],
      themeCompatible: [],
    }
  } catch {
    return null
  }
}

/**
 * Built-in knowledge of core primitives for offline/bootstrapping scenarios.
 * Used when neither registry nor node_modules are available. These entries
 * carry no confirmed product-layer or styling metadata: deliverables is
 * always exactly ["primitive"] and stylingOutputs is always empty, so an
 * offline-fallback plan can never claim styling or product-layer support it
 * hasn't verified against the real registry.
 */
const BUILTIN_PRIMITIVES = new Map<string, RegistryPrimitive>(
  (
    [
      ["dialog", [], []],
      ["select", [], ["@solidiom/adapter-positioning-floating-ui"]],
      ["calendar", [], ["@solidiom/adapter-date-internationalized"]],
      ["carousel", [], ["@solidiom/adapter-carousel-embla"]],
      ["popover", [], ["@solidiom/adapter-positioning-floating-ui"]],
      ["tooltip", [], ["@solidiom/adapter-positioning-floating-ui"]],
      ["menu", [], ["@solidiom/adapter-positioning-floating-ui"]],
      ["combobox", [], ["@solidiom/adapter-positioning-floating-ui"]],
      ["date-picker", [], ["@solidiom/adapter-date-internationalized"]],
      ["button", [], []],
      ["checkbox", [], []],
      ["switch", [], []],
      ["slider", [], []],
      ["accordion", [], []],
      ["tabs", [], []],
      ["collapsible", [], []],
      ["toast", [], []],
      ["listbox", [], []],
    ] as const
  ).map(([name, deps, adapters]) => [
    name,
    {
      name,
      deps: ["@solidiom/runtime", ...deps],
      adapters: [...adapters],
      deliverables: ["primitive"] as Deliverable[],
      stylingOutputs: [] as StylingProfile[],
      themeCompatible: [] as string[],
    },
  ]),
)

/**
 * Core plan logic — usable from CLI and programmatic API.
 */
export function runPlan(options: PlanOptions): Plan {
  const {
    primitive,
    cwd,
    mode: modeOverride,
    registry: registryOverride,
    noNetwork: _noNetwork,
    deliverable: requestedDeliverable,
    styling: requestedStyling,
  } = options

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
      stylingOutputs: [],
      violations: [`Unknown primitive: "${primitive}" — not found in registry or node_modules`],
    }
  }

  // Resolve real versions for each entry. Registry/node_modules versions are
  // exact; toInstallSpecifier widens them to caret ranges so in-range single
  // package releases are picked up without regenerating the registry (REL-C1).
  const primitiveVersion = resolveVersion(`@solidiom/${primitive}`, cwd, entry.version)

  const entries: PlanEntry[] = [
    {
      package: `@solidiom/${primitive}`,
      version: toInstallSpecifier(primitiveVersion),
      isAdapter: false,
      reason: "requested",
    },
    ...entry.deps.map((dep) => ({
      package: dep,
      version: toInstallSpecifier(resolveVersion(dep, cwd)),
      isAdapter: false,
      reason: "dependency",
    })),
    ...entry.adapters.map((adapter) => ({
      package: adapter,
      version: toInstallSpecifier(resolveVersion(adapter, cwd)),
      isAdapter: true,
      reason: "capability",
    })),
  ]

  // Validate against policy. Policy versions and resolved specifiers may both
  // carry a range operator, so compare on the normalized base version.
  const violations: string[] = []
  for (const e of entries) {
    const allowed = policy.allowedPrimitiveVersions[e.package]
    if (allowed) {
      const allowedBase = allowed.replace(/^[\^~]/, "")
      const resolvedBase = e.version.replace(/^[\^~]/, "")
      if (!resolvedBase.startsWith(allowedBase)) {
        violations.push(`${e.package}@${e.version} not allowed by policy (requires ${allowed})`)
      }
    }
  }

  // Validate the requested product-layer deliverable, if any (CLI-002).
  // Entries resolved from node_modules or BUILTIN_PRIMITIVES only ever confirm
  // "primitive" — requesting a richer deliverable against an unconfirmed
  // source is a violation, not a silent pass.
  if (requestedDeliverable && !entry.deliverables.includes(requestedDeliverable)) {
    violations.push(
      `"${primitive}" does not declare the "${requestedDeliverable}" deliverable (available: ${
        entry.deliverables.length > 0 ? entry.deliverables.join(", ") : "none"
      })`,
    )
  }

  // Validate the requested styling profile, if any (CLI-002).
  if (requestedStyling && !entry.stylingOutputs.includes(requestedStyling)) {
    violations.push(
      `"${primitive}" has no "${requestedStyling}" styling output (available: ${
        entry.stylingOutputs.length > 0 ? entry.stylingOutputs.join(", ") : "none"
      })`,
    )
  }

  // Requesting the "theme" deliverable only makes sense against an entry
  // that has confirmed theme compatibility.
  if (
    requestedDeliverable === "theme" &&
    entry.deliverables.includes("theme") &&
    entry.themeCompatible.length === 0
  ) {
    violations.push(
      `"${primitive}" declares the "theme" deliverable but has no themeCompatible entries`,
    )
  }

  return {
    primitive,
    mode,
    entries,
    ...(requestedDeliverable ? { deliverable: requestedDeliverable } : {}),
    ...(requestedStyling ? { stylingProfile: requestedStyling } : {}),
    stylingOutputs: entry.stylingOutputs,
    violations,
  }
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
      ["Plan a component deliverable", "solidiom plan button --deliverable component"],
      ["Plan with a specific styling profile", "solidiom plan button --styling tailwind"],
    ],
  })

  primitive = Option.String({ required: true })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })
  mode = Option.String("--mode", { description: "Install mode (package or source)" })
  registry = Option.String("--registry", {
    description: "Custom registry URL for package resolution",
  })
  noNetwork = Option.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)",
  })
  deliverable = Option.String("--deliverable", {
    description:
      "Product-layer deliverable to resolve (primitive, component, block, template, theme)",
  })
  styling = Option.String("--styling", {
    description: "Styling profile to resolve (css, tailwind, unocss)",
  })

  async execute(): Promise<number> {
    const plan = runPlan({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode as "package" | "source" | undefined,
      registry: this.registry,
      noNetwork: this.noNetwork,
      deliverable: this.deliverable as Deliverable | undefined,
      styling: this.styling as StylingProfile | undefined,
    })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(plan, null, 2) + "\n")
      return 0
    }

    this.context.stdout.write(`\nPlan for ${pc.bold(plan.primitive)} (${plan.mode} mode):\n\n`)
    if (plan.deliverable) {
      this.context.stdout.write(`  deliverable: ${pc.cyan(plan.deliverable)}\n`)
    }
    if (plan.stylingProfile) {
      this.context.stdout.write(`  styling: ${pc.cyan(plan.stylingProfile)}\n`)
    }
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
