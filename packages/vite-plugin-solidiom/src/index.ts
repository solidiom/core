import {
  applyTextReplacements,
  findCvaDeclarations,
  findObjectCalls,
  parseStaticStringLiteral,
  removeNamedImportSpecifier,
} from "./static-parser"

/**
 * @solidiom/vite-plugin — Compile-time optimizations for Solidiom.
 *
 * Features (opt-in, each enabled independently):
 * - v1.1: Static recipe extraction — evaluates cva() calls with static args at build time
 * - v1.2: Static variant expansion — inlines variant lookup results for known props
 * - v1.3: Dead-part elimination — removes unused primitive part imports
 * - v2.0: Unused-capability detection — warns/fails on adapters never consumed
 *
 * All features are opt-in. Source remains correct without the plugin.
 * Primitives never depend on this plugin for correctness.
 */

export interface SolidiomPluginOptions {
  /** Enable static recipe extraction (v1.1). Default: false. */
  recipeExtraction?: boolean
  /** Enable static variant expansion (v1.2). Default: false. */
  variantExpansion?: boolean
  /** Enable dead-part elimination (v1.3). Default: false. */
  deadPartElimination?: boolean
  /** Enable unused-capability detection (v2.0). Default: false. */
  unusedCapabilityDetection?: boolean
  /** Strict mode — fail build on detected issues. Default: false. */
  strict?: boolean
}

/** Tracks adapter imports seen across the build for capability detection. */
interface CapabilityTracker {
  /** Adapter packages imported anywhere in the project. */
  importedAdapters: Set<string>
  /** Port interfaces referenced in primitives. */
  referencedPorts: Set<string>
}

/** Known port → adapter mapping for unused-capability detection. */
const PORT_ADAPTER_MAP: Record<string, string> = {
  PositioningPort: "@solidiom/adapter-positioning-floating-ui",
  CalendarDateMathPort: "@solidiom/adapter-date-internationalized",
  CarouselPhysicsPort: "@solidiom/adapter-carousel-embla",
}

/** Known adapter package names. */
const ADAPTER_PACKAGES = new Set(Object.values(PORT_ADAPTER_MAP))

/**
 * Creates the Solidiom Vite/Rollup plugin.
 *
 * Usage in vite.config.ts:
 * ```ts
 * import { solidiomPlugin } from "@solidiom/vite-plugin"
 * export default defineConfig({
 *   plugins: [solidiomPlugin({ recipeExtraction: true, variantExpansion: true })]
 * })
 * ```
 */
export function solidiomPlugin(options: SolidiomPluginOptions = {}) {
  const {
    recipeExtraction = false,
    variantExpansion = false,
    deadPartElimination = false,
    unusedCapabilityDetection = false,
    strict = false,
  } = options

  const tracker: CapabilityTracker = {
    importedAdapters: new Set(),
    referencedPorts: new Set(),
  }

  return {
    name: "@solidiom/vite-plugin",
    enforce: "pre" as const,

    transform(code: string, id: string) {
      // Only process TS/TSX files that reference Solidiom packages
      if (!/\.[tj]sx?$/.test(id)) return null
      if (!code.includes("@solidiom/") && !code.includes("solidiom")) return null

      let transformed = code
      let changed = false

      // Track adapter imports for unused-capability detection
      if (unusedCapabilityDetection) {
        trackCapabilities(code, tracker)
      }

      if (recipeExtraction) {
        const result = extractStaticRecipes(transformed, id)
        if (result) {
          transformed = result
          changed = true
        }
      }

      if (variantExpansion) {
        const result = expandStaticVariants(transformed, id)
        if (result) {
          transformed = result
          changed = true
        }
      }

      if (deadPartElimination) {
        const result = eliminateDeadParts(transformed, id)
        if (result) {
          transformed = result
          changed = true
        }
      }

      return changed ? { code: transformed, map: null } : null
    },

    buildEnd() {
      if (unusedCapabilityDetection) {
        const issues = detectUnusedCapabilities(tracker)
        if (issues.length > 0) {
          const msg = `[@solidiom/vite-plugin] Unused capabilities detected:\n${issues.map((i) => `  - ${i}`).join("\n")}`
          if (strict) {
            throw new Error(msg)
          } else {
            console.warn(msg)
          }
        }
      }
    },
  }
}

// ─── v1.1: Static Recipe Extraction ─────────────────────────────────────────

/**
 * Identifies cva() calls with fully static config objects and replaces them
 * with pre-computed class lookup maps. This eliminates runtime object traversal.
 *
 * Before:
 *   const variants = cva("base", { variants: { size: { sm: "cls-sm", lg: "cls-lg" } }, defaultVariants: { size: "sm" } })
 *   // later: variants({ size: props.size })
 *
 * After:
 *   const __solidiom_variants_base = "base"
 *   const __solidiom_variants_map = { size: { sm: "cls-sm", lg: "cls-lg" } }
 *   const __solidiom_variants_defaults = { size: "sm" }
 *   const variants = (opts) => {
 *     let cls = __solidiom_variants_base
 *     for (const k in __solidiom_variants_map) {
 *       const v = opts?.[k] ?? __solidiom_variants_defaults[k]
 *       if (v && __solidiom_variants_map[k][v]) cls += " " + __solidiom_variants_map[k][v]
 *     }
 *     return cls
 *   }
 */
function extractStaticRecipes(code: string, _id: string): string | null {
  const replacements: Array<{ start: number; end: number; text: string }> = []

  for (const declaration of findCvaDeclarations(code)) {
    const config = parseStaticObject(declaration.configSource)
    if (!config?.variants) continue

    const variantsJson = JSON.stringify(config.variants)
    const defaultsJson = JSON.stringify(config.defaultVariants ?? {})
    const exportPrefix = declaration.exported ? "export " : ""

    replacements.push({
      start: declaration.start,
      end: declaration.end,
      text: [
        `${exportPrefix}const __solidiom_${declaration.name}_base = ${declaration.baseSource}`,
        `const __solidiom_${declaration.name}_map = ${variantsJson}`,
        `const __solidiom_${declaration.name}_defaults = ${defaultsJson}`,
        `const ${declaration.name} = (opts) => {`,
        `  let cls = __solidiom_${declaration.name}_base`,
        `  for (const k in __solidiom_${declaration.name}_map) {`,
        `    const v = opts?.[k] ?? __solidiom_${declaration.name}_defaults[k]`,
        `    if (v && __solidiom_${declaration.name}_map[k][v]) cls += " " + __solidiom_${declaration.name}_map[k][v]`,
        `  }`,
        `  return cls`,
        `}`,
      ].join("\n"),
    })
  }

  if (replacements.length === 0) return null
  let result = applyTextReplacements(code, replacements)

  // Remove the cva import only when no call remains after the static replacements.
  if (!result.includes("cva(")) {
    result = removeNamedImportSpecifier(result, "class-variance-authority", "cva")
  }

  return result
}

// ─── v1.2: Static Variant Expansion ─────────────────────────────────────────

/**
 * When a variant function is called with a string literal argument,
 * inline the result directly. Eliminates the lookup at runtime.
 *
 * Before: buttonVariants({ variant: "destructive", size: "sm" })
 * After:  "solidiom-btn solidiom-btn--destructive solidiom-btn--sm solidiom-btn--destructive-icon"
 *
 * Compound variants (RECIPE-002/003 generated cva() calls include a `compoundVariants`
 * array) are appended after the single-axis classes, in declaration order, whenever
 * every one of a compound's conditions matches the static call arguments — the same
 * "declaration order, last match can still add classes" semantics the canonical
 * contract requires (docs/contracts/recipe-contract.md §2.4). A definition with
 * compound variants that this function cannot statically resolve is left untouched
 * rather than silently expanded with the compound classes missing.
 */
function expandStaticVariants(code: string, _id: string): string | null {
  const variantDefs = extractVariantDefs(code)
  if (variantDefs.size === 0) return null

  const replacements: Array<{ start: number; end: number; text: string }> = []
  for (const call of findObjectCalls(code, new Set(variantDefs.keys()))) {
    const def = variantDefs.get(call.name)
    if (!def) continue

    const args = parseStaticCallArgs(call.objectSource)
    if (!args) continue

    const classes = [def.base]
    const resolved: Record<string, string | undefined> = {}
    for (const [key, variants] of Object.entries(def.variants)) {
      const value = args[key] ?? def.defaults[key]
      resolved[key] = value
      if (value && variants[value]) classes.push(variants[value])
    }

    for (const compound of def.compoundVariants) {
      const allMatch = Object.entries(compound.when).every(
        ([axis, value]) => resolved[axis] === value,
      )
      if (allMatch) classes.push(compound.class)
    }

    replacements.push({
      start: call.start,
      end: call.end,
      text: JSON.stringify(classes.filter(Boolean).join(" ")),
    })
  }

  return replacements.length > 0 ? applyTextReplacements(code, replacements) : null
}

// ─── v1.3: Dead-Part Elimination ────────────────────────────────────────────

/**
 * When a primitive is imported as a namespace (import * as Dialog from "@solidiom/dialog")
 * and only some parts are used (Dialog.Root, Dialog.Content), rewrite to named imports
 * of only the used parts. This helps bundlers tree-shake unused parts.
 *
 * Before: import * as Dialog from "@solidiom/dialog"
 *         // only Dialog.Root and Dialog.Content used in file
 * After:  import { Root as Dialog_Root, Content as Dialog_Content } from "@solidiom/dialog"
 *         // references rewritten: Dialog.Root → Dialog_Root, Dialog.Content → Dialog_Content
 */
function eliminateDeadParts(code: string, _id: string): string | null {
  // Match: import * as <Name> from "@solidiom/<primitive>"
  const NS_IMPORT = /import\s+\*\s+as\s+(\w+)\s+from\s+["'](@solidiom\/[\w-]+)["']\s*;?\n?/g

  let result = code
  let matched = false

  const replacements: Array<{ ns: string; pkg: string; parts: string[] }> = []

  // Collect all namespace imports from @solidiom packages
  let nsMatch: RegExpExecArray | null
  while ((nsMatch = NS_IMPORT.exec(code)) !== null) {
    const ns = nsMatch[1]!
    const pkg = nsMatch[2]!

    // Find all usages of Ns.Part in the file
    const usagePattern = new RegExp(`\\b${ns}\\.(\\w+)`, "g")
    const usedParts = new Set<string>()
    let usageMatch: RegExpExecArray | null
    while ((usageMatch = usagePattern.exec(code)) !== null) {
      usedParts.add(usageMatch[1]!)
    }

    if (usedParts.size > 0 && usedParts.size < 8) {
      // Only rewrite if we're actually eliminating some parts
      // (primitives typically export 4-10 parts)
      replacements.push({ ns, pkg, parts: [...usedParts] })
    }
  }

  for (const { ns, pkg, parts } of replacements) {
    const namedImports = parts.map((p) => `${p} as ${ns}_${p}`).join(", ")
    const importLine = `import { ${namedImports} } from "${pkg}"`

    // Replace the namespace import
    result = result.replace(
      new RegExp(`import\\s+\\*\\s+as\\s+${ns}\\s+from\\s+["']${escapeRegex(pkg)}["']\\s*;?\\n?`),
      importLine + "\n",
    )

    // Replace all Ns.Part references with Ns_Part
    for (const part of parts) {
      result = result.replace(new RegExp(`\\b${ns}\\.${part}\\b`, "g"), `${ns}_${part}`)
    }

    matched = true
  }

  return matched ? result : null
}

// ─── v2.0: Unused-Capability Detection ─────────────────────────────────────

/** Track adapter imports and port references across all modules. */
function trackCapabilities(code: string, tracker: CapabilityTracker): void {
  // Track adapter package imports
  for (const adapter of ADAPTER_PACKAGES) {
    if (code.includes(adapter)) {
      tracker.importedAdapters.add(adapter)
    }
  }

  // Track port interface usage (means a primitive needs a capability)
  for (const port of Object.keys(PORT_ADAPTER_MAP)) {
    if (code.includes(port)) {
      tracker.referencedPorts.add(port)
    }
  }
}

/** After build, check for adapters imported but never consumed by any port. */
function detectUnusedCapabilities(tracker: CapabilityTracker): string[] {
  const issues: string[] = []

  // Find adapters that are imported but no primitive references their port
  for (const adapter of tracker.importedAdapters) {
    const port = Object.entries(PORT_ADAPTER_MAP).find(([, a]) => a === adapter)?.[0]
    if (port && !tracker.referencedPorts.has(port)) {
      issues.push(
        `Adapter "${adapter}" is imported but no primitive references its port interface "${port}"`,
      )
    }
  }

  // Find ports referenced by primitives with no corresponding adapter imported
  for (const port of tracker.referencedPorts) {
    const expectedAdapter = PORT_ADAPTER_MAP[port]
    if (expectedAdapter && !tracker.importedAdapters.has(expectedAdapter)) {
      issues.push(
        `Port "${port}" is used but its adapter "${expectedAdapter}" is not imported anywhere`,
      )
    }
  }

  return issues
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse a JS object literal into a plain object.
 * Only handles simple cases: string values, no computed keys, no spread.
 */
function parseStaticObject(str: string): Record<string, any> | null {
  try {
    // Sanitize: remove trailing commas, normalize whitespace
    const cleaned = str
      .replace(/,(\s*[}\]])/g, "$1") // trailing commas
      .replace(/(\w+)\s*:/g, '"$1":') // unquoted keys → quoted
      .replace(/'/g, '"') // single quotes → double

    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

/**
 * Parse static call arguments like { variant: "destructive", size: "sm" }.
 * Returns null if any value is non-literal (dynamic expression).
 */
function parseStaticCallArgs(argsStr: string): Record<string, string> | null {
  const result: Record<string, string> = {}
  // Match: key: "value" or key: 'value'
  const PAIR = /(\w+)\s*:\s*["']([^"']+)["']/g
  let match: RegExpExecArray | null
  let pairCount = 0

  while ((match = PAIR.exec(argsStr)) !== null) {
    result[match[1]!] = match[2]!
    pairCount++
  }

  // Verify we captured everything (no dynamic expressions)
  const expectedPairs = argsStr.split(",").filter((s) => s.trim()).length
  if (pairCount !== expectedPairs) return null

  return result
}

/** Extract variant definitions from cva() calls in the same file. */
function extractVariantDefs(code: string): Map<
  string,
  {
    base: string
    variants: Record<string, Record<string, string>>
    defaults: Record<string, string>
    compoundVariants: Array<{ when: Record<string, string>; class: string }>
  }
> {
  const defs = new Map<
    string,
    {
      base: string
      variants: Record<string, Record<string, string>>
      defaults: Record<string, string>
      compoundVariants: Array<{ when: Record<string, string>; class: string }>
    }
  >()

  for (const declaration of findCvaDeclarations(code)) {
    const base = parseStaticStringLiteral(declaration.baseSource)
    if (base === null) continue
    const config = parseStaticObject(declaration.configSource)
    if (config?.variants) {
      // cva's compoundVariants entries look like { variant: "ghost", size: "icon", class: "..." }
      // (or `className` — support both, matching class-variance-authority's own API).
      const compoundVariants = Array.isArray(config.compoundVariants)
        ? config.compoundVariants.flatMap(
            (
              entry: Record<string, string>,
            ): Array<{ when: Record<string, string>; class: string }> => {
              const { class: cls, className, ...when } = entry
              const resolvedClass = cls ?? className
              return resolvedClass ? [{ when, class: resolvedClass }] : []
            },
          )
        : []
      defs.set(declaration.name, {
        base,
        variants: config.variants,
        defaults: config.defaultVariants ?? {},
        compoundVariants,
      })
    }
  }

  return defs
}

/** Escape special regex characters. */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
