/**
 * tools/registry-build — generates registry manifests for all primitives.
 *
 * Scans packages/ for directories tagged "layer:primitive", reads their source/
 * files, and outputs:
 *   - registry/<name>.json (per-primitive manifest)
 *   - registry/index.json (catalog of all primitives and adapters)
 *
 * Detection logic:
 *   - Dependencies: extracted from package.json "dependencies" field.
 *   - Source files: lists non-test .ts/.tsx files in source/.
 *   - Runtime modules: scans source imports from @solidiom/runtime (e.g. "overlay/layer-stack").
 *   - Capabilities: detects port interfaces (PositioningPort → positioning@1,
 *     CalendarDateMathPort → date-math@1, CarouselPhysicsPort → carousel-physics@1).
 *
 * Usage: pnpm exec tsx tools/registry-build.ts
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, unlinkSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createHash } from "node:crypto"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const REGISTRY_DIR = join(ROOT, "registry")

// ─── Capability Detection ────────────────────────────────────────────────────

interface Capability {
  name: string
  version: number
  default: string
}

/** Port interface → capability mapping. */
const PORT_TO_CAPABILITY: Record<string, Capability> = {
  PositioningPort: {
    name: "positioning",
    version: 1,
    default: "@solidiom/adapter-positioning-floating-ui",
  },
  CalendarDateMathPort: {
    name: "date-math",
    version: 1,
    default: "@solidiom/adapter-date-internationalized",
  },
  CarouselPhysicsPort: {
    name: "carousel-physics",
    version: 1,
    default: "@solidiom/adapter-carousel-embla",
  },
  VirtualizationPort: {
    name: "virtualization",
    version: 1,
    default: "@solidiom/adapter-virtualization-tanstack",
  },
  TablePort: {
    name: "table",
    version: 1,
    default: "@solidiom/adapter-table-tanstack",
  },
}

// ─── Manifest Types ──────────────────────────────────────────────────────────

interface PrimitiveManifest {
  name: string
  version: string
  package: string
  capabilities: Capability[]
  dependencies: string[]
  source: {
    entry: string
    files: string[]
  }
  runtime: string[]
}

/** V2 manifest extends V1 with product-layer, integrity, and metadata fields. */
interface PrimitiveManifestV2 extends PrimitiveManifest {
  $schema: string
  label: string
  description: string
  category: string
  status: "experimental" | "preview" | "stable" | "deprecated"
  deliverables: {
    primitive: true
    component?: boolean
    block?: boolean
    template?: boolean
    theme?: boolean
  }
  cli: {
    addCommand: string
    installDeps: string[]
  }
  accessibility: {
    reviewStatus: "none" | "automated" | "manual" | "complete"
    evidenceIds: string[]
    lastReviewed?: string
  }
  documentation: {
    status: "stub" | "draft" | "review" | "complete"
    locales: Record<string, {
      status: "missing" | "draft" | "stale" | "reviewed"
      sourceHash?: string
      lastUpdated?: string
    }>
  }
  styling: {
    outputs: ("css" | "tailwind" | "unocss")[]
    themeCompatible: string[]
  }
  search: {
    keywords: string[]
  }
  integrity: {
    filesHash: string
    manifestSignature?: string
    lastGenerated: string
  }
  lastUpdated: string
}

interface IndexManifest {
  version: number
  generatedAt: string
  primitives: Array<{
    name: string
    version: string
    package: string
    label?: string
    description?: string
    category?: string
  }>
  adapters: Array<{
    name: string
    package: string
    capability: string
  }>
}

interface IndexManifestV2 {
  $schema: string
  version: 2
  generatedAt: string
  integrity: {
    entriesHash: string
    signature?: string
  }
  primitives: Array<{
    name: string
    version: string
    package: string
    label: string
    description: string
    category: string
    status: string
    deliverables: string[]
    hasAccessibilityEvidence: boolean
    documentationStatus: string
  }>
  adapters: Array<{
    name: string
    package: string
    capability: string
    version: string
  }>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a package dir is a public primitive with complete registry metadata. */
function isPublicPrimitive(pkgDir: string): boolean {
  const pkgPath = join(pkgDir, "package.json")
  if (!existsSync(pkgPath)) return false

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const nx = pkg["nx"] as Record<string, unknown> | undefined
    const tags = nx?.["tags"] as string[] | undefined
    const metadata = nx?.["metadata"] as Record<string, unknown> | undefined
    const metadataFields = [metadata?.["label"], metadata?.["description"], metadata?.["category"]]

    return (
      tags?.includes("layer:primitive") === true &&
      pkg["private"] !== true &&
      metadataFields.every((value) => typeof value === "string" && value.trim().length > 0)
    )
  } catch {
    return false
  }
}

/** Check if a package dir is an adapter (has "layer:adapter" tag). */
function isAdapter(pkgDir: string): boolean {
  const pkgPath = join(pkgDir, "package.json")
  if (!existsSync(pkgPath)) return false

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const nx = pkg["nx"] as Record<string, unknown> | undefined
    const tags = nx?.["tags"] as string[] | undefined
    return tags?.includes("layer:adapter") ?? false
  } catch {
    return false
  }
}

/** Collect non-test source files recursively. */
function collectSourceFiles(dir: string): string[] {
  const files: string[] = []
  if (!existsSync(dir)) return files

  function walk(d: string): void {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (
        (entry.endsWith(".ts") || entry.endsWith(".tsx")) &&
        !entry.includes(".test.") &&
        !entry.endsWith(".d.ts") &&
        !entry.endsWith(".d.ts.map")
      ) {
        files.push(relative(dir, full))
      }
    }
  }
  walk(dir)
  return files
}

/** Extract runtime module paths from source imports of @solidiom/runtime. */
function extractRuntimeModules(sourceDir: string): string[] {
  const modules = new Set<string>()
  if (!existsSync(sourceDir)) return []

  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (
        (entry.endsWith(".ts") || entry.endsWith(".tsx")) &&
        !entry.includes(".test.") &&
        !entry.endsWith(".d.ts")
      ) {
        const content = readFileSync(full, "utf8")
        // Match: from "@solidiom/runtime/collection/roving-focus"
        const subpathMatches = content.matchAll(/from\s+["']@solidiom\/runtime\/([^"']+)["']/g)
        for (const m of subpathMatches) {
          modules.add(m[1]!)
        }
        // Match: from "@solidiom/runtime" — extract used types/values to infer modules
        const barrelMatch = content.match(/from\s+["']@solidiom\/runtime["']/)
        if (barrelMatch) {
          // Parse the import specifiers to figure out which runtime modules are used
          const importMatches = content.matchAll(
            /import\s+(?:type\s+)?{([^}]+)}\s+from\s+["']@solidiom\/runtime["']/g,
          )
          for (const im of importMatches) {
            const specifiers = im[1]!
              .split(",")
              .map((s: string) => s.trim().split(" as ")[0]!.trim())
            for (const spec of specifiers) {
              const mod = SPECIFIER_TO_MODULE[spec]
              if (mod) modules.add(mod)
            }
          }
        }
      }
    }
  }
  walk(sourceDir)
  return [...modules].sort()
}

/** Detect capabilities by scanning for port interfaces in source files. */
function detectCapabilities(sourceDir: string): Capability[] {
  const caps: Capability[] = []
  if (!existsSync(sourceDir)) return caps

  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (
        (entry.endsWith(".ts") || entry.endsWith(".tsx")) &&
        !entry.includes(".test.") &&
        !entry.endsWith(".d.ts")
      ) {
        const content = readFileSync(full, "utf8")
        for (const [portName, cap] of Object.entries(PORT_TO_CAPABILITY)) {
          if (content.includes(`interface ${portName}`) || content.includes(`: ${portName}`)) {
            if (!caps.some((c) => c.name === cap.name)) {
              caps.push(cap)
            }
          }
        }
      }
    }
  }
  walk(sourceDir)
  return caps
}

/**
 * Mapping of commonly imported specifiers from @solidiom/runtime barrel
 * to their module paths.
 */
const SPECIFIER_TO_MODULE: Record<string, string> = {
  // state
  DisclosureState: "state/disclosure-state",
  createDisclosureState: "state/disclosure-state",
  DisclosureReason: "state/disclosure-state",
  ControllableValue: "state/controllable-value",
  createControllableValue: "state/controllable-value",
  // overlay
  LayerStack: "overlay/layer-stack",
  createLayerStack: "overlay/layer-stack",
  DismissableLayer: "overlay/dismissable-layer",
  createDismissableLayer: "overlay/dismissable-layer",
  FocusScope: "overlay/focus-scope",
  createFocusScope: "overlay/focus-scope",
  ModalIsolation: "overlay/modal-isolation",
  createModalIsolation: "overlay/modal-isolation",
  ScrollLock: "overlay/scroll-lock",
  createScrollLock: "overlay/scroll-lock",
  Portal: "overlay/portal",
  // presence
  Presence: "presence/presence",
  createPresence: "presence/presence",
  PresencePhase: "presence/presence",
  // collection
  Collection: "collection/collection",
  createCollection: "collection/collection",
  CompositeNavigation: "collection/composite-navigation",
  createCompositeNavigation: "collection/composite-navigation",
  RovingFocus: "collection/roving-focus",
  createRovingFocus: "collection/roving-focus",
  Typeahead: "collection/typeahead",
  createTypeahead: "collection/typeahead",
  // dom
  SemanticAttrs: "dom/semantic-attrs",
  semanticAttr: "dom/semantic-attrs",
  StableId: "dom/stable-id",
  createStableId: "dom/stable-id",
  ComposeRef: "dom/compose-ref",
  composeRef: "dom/compose-ref",
  ObserveElement: "dom/observe-element",
  observeElement: "dom/observe-element",
  OwnerCleanup: "dom/owner-cleanup",
  onCleanup: "dom/owner-cleanup",
  // events
  ChangeDetails: "events/change-details",
  composeEventHandlers: "events/compose-event-handlers",
  // form
  HiddenInput: "form/hidden-input",
  createHiddenInput: "form/hidden-input",
  FormControl: "form/form-control",
  createFormControl: "form/form-control",
  Validation: "form/validation",
  // i18n
  Direction: "i18n/direction",
  getDirection: "i18n/direction",
  Locale: "i18n/locale",
  getLocale: "i18n/locale",
}

// ─── V2 Integrity Computation ────────────────────────────────────────────────

/**
 * Compute deterministic filesHash per the algorithm in docs/registry-schema-v2.md §7:
 * 1. Sort source files lexicographically.
 * 2. SHA-256 each file's raw content.
 * 3. Concatenate hex hashes (no separator).
 * 4. SHA-256 the concatenation.
 */
function computeFilesHash(sourceDir: string, files: string[]): string {
  const sorted = [...files].sort()
  const hashes: string[] = []

  for (const file of sorted) {
    // Files are stored as "src/foo.ts" but live in "source/foo.ts"
    const relativePath = file.replace(/^src\//, "")
    const fullPath = join(sourceDir, relativePath)
    if (!existsSync(fullPath)) continue
    const content = readFileSync(fullPath)
    hashes.push(createHash("sha256").update(content).digest("hex"))
  }

  const concatenated = hashes.join("")
  return createHash("sha256").update(concatenated).digest("hex")
}

/**
 * Compute entriesHash for the index: SHA-256 of all per-entry filesHash values
 * sorted alphabetically by entry name.
 */
function computeEntriesHash(entries: Array<{ name: string; filesHash: string }>): string {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name))
  const concatenated = sorted.map((e) => e.filesHash).join("")
  return createHash("sha256").update(concatenated).digest("hex")
}

/**
 * Generate search keywords from label, description, and category.
 */
function generateKeywords(label: string, description: string, category: string): string[] {
  const text = `${label} ${description} ${category}`.toLowerCase()
  const words = text.split(/[\s,.\-_/]+/).filter((w) => w.length > 2)
  return [...new Set(words)].sort()
}

// ─── Main Build Logic ────────────────────────────────────────────────────────

function buildRegistry(): void {
  const packageDirs = readdirSync(PACKAGES_DIR)
    .map((name: string) => ({ name, path: join(PACKAGES_DIR, name) }))
    .filter((d: { name: string; path: string }) => statSync(d.path).isDirectory())

  const primitives: PrimitiveManifest[] = []
  const adapterEntries: Array<{ name: string; package: string; capability: string }> = []

  // Process adapters first to build the adapter catalog
  for (const { name, path: pkgDir } of packageDirs) {
    if (!isAdapter(pkgDir)) continue

    const pkgPath = join(pkgDir, "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const pkgName = pkg["name"] as string

    // Derive capability from adapter name pattern
    const adapterName = name.replace("adapter-", "")
    let capability = "unknown@1"

    if (adapterName.includes("positioning")) {
      capability = "positioning@1"
    } else if (adapterName.includes("date")) {
      capability = "date-math@1"
    } else if (adapterName.includes("carousel")) {
      capability = "carousel-physics@1"
    } else if (adapterName.includes("virtualization")) {
      capability = "virtualization@1"
    } else if (adapterName.includes("table")) {
      capability = "table@1"
    }

    adapterEntries.push({ name: adapterName, package: pkgName, capability })
  }

  // Process primitives
  for (const { name, path: pkgDir } of packageDirs) {
    if (!isPublicPrimitive(pkgDir)) continue

    // Skip meta-packages (like "primitives" which re-exports everything)
    const sourceDir = join(pkgDir, "source")
    if (!existsSync(sourceDir)) continue

    const sourceFiles = collectSourceFiles(sourceDir)
    if (sourceFiles.length === 0) continue

    const pkgPath = join(pkgDir, "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const pkgName = (pkg["name"] as string) ?? `@solidiom/${name}`
    const version = (pkg["version"] as string) ?? "0.0.1-next.0"

    // Extract dependencies (only @solidiom/* workspace deps)
    const deps = pkg["dependencies"] as Record<string, string> | undefined
    const solidiomDeps = deps ? Object.keys(deps).filter((d) => d.startsWith("@solidiom/")) : []

    // Detect capabilities from port interfaces
    const capabilities = detectCapabilities(sourceDir)

    // Extract runtime modules used
    const runtimeModules = extractRuntimeModules(sourceDir)

    // Find entry file
    const entry = sourceFiles.includes("index.tsx")
      ? "src/index.tsx"
      : sourceFiles.includes("index.ts")
        ? "src/index.ts"
        : `src/${sourceFiles[0]}`

    // Map source files to src/ paths (as they'd appear in the consumer project)
    const srcFiles = sourceFiles.map((f) => `src/${f}`)

    const manifest: PrimitiveManifest = {
      name,
      version,
      package: pkgName,
      capabilities,
      dependencies: solidiomDeps,
      source: { entry, files: srcFiles },
      runtime: runtimeModules,
    }

    primitives.push(manifest)
  }

  const primitiveNames = new Set(primitives.map((primitive) => primitive.name))
  for (const registryFile of readdirSync(REGISTRY_DIR)) {
    if (
      registryFile === "index.json" ||
      !registryFile.endsWith(".json") ||
      primitiveNames.has(registryFile.slice(0, -".json".length))
    ) {
      continue
    }
    unlinkSync(join(REGISTRY_DIR, registryFile))
  }

  // Generate V2 manifests with integrity and metadata
  const now = new Date().toISOString()
  const v2Manifests: PrimitiveManifestV2[] = []

  for (const primitive of primitives) {
    const pkgPath = join(PACKAGES_DIR, primitive.name, "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const nx = pkg["nx"] as Record<string, unknown> | undefined
    const metadata = nx?.["metadata"] as Record<string, string> | undefined
    const label = metadata?.["label"] ?? primitive.name
    const description = metadata?.["description"] ?? ""
    const category = metadata?.["category"] ?? "uncategorized"

    const sourceDir = join(PACKAGES_DIR, primitive.name, "source")
    const docsDir = join(PACKAGES_DIR, primitive.name, "docs")
    const filesHash = computeFilesHash(sourceDir, primitive.source.files)

    const v2: PrimitiveManifestV2 = {
      ...primitive,
      $schema: "https://solidiom.dev/schemas/registry-manifest/v2.json",
      label,
      description,
      category,
      status: "preview",
      deliverables: { primitive: true },
      cli: {
        addCommand: `solidiom add ${primitive.name}`,
        installDeps: primitive.capabilities.map((c) => c.default),
      },
      accessibility: {
        reviewStatus: "none",
        evidenceIds: [],
      },
      documentation: {
        status: existsSync(docsDir) ? "draft" : "stub",
        locales: { en: { status: "stub" } },
      },
      styling: {
        outputs: [],
        themeCompatible: [],
      },
      search: {
        keywords: generateKeywords(label, description, category),
      },
      integrity: {
        filesHash,
        lastGenerated: now,
      },
      lastUpdated: now,
    }

    v2Manifests.push(v2)
  }

  for (const manifest of v2Manifests) {
    const manifestPath = join(REGISTRY_DIR, `${manifest.name}.json`)
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  }

  // Compute entries hash for the index
  const entriesHash = computeEntriesHash(
    v2Manifests.map((m) => ({ name: m.name, filesHash: m.integrity.filesHash })),
  )

  // Write V2 index.json
  const indexV2: IndexManifestV2 = {
    $schema: "https://solidiom.dev/schemas/registry-index/v2.json",
    version: 2,
    generatedAt: now,
    integrity: { entriesHash },
    primitives: v2Manifests
      .map((m) => ({
        name: m.name,
        version: m.version,
        package: m.package,
        label: m.label,
        description: m.description,
        category: m.category,
        status: m.status,
        deliverables: Object.entries(m.deliverables)
          .filter(([, v]) => v === true)
          .map(([k]) => k),
        hasAccessibilityEvidence: m.accessibility.evidenceIds.length > 0,
        documentationStatus: m.documentation.status,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    adapters: adapterEntries
      .map((a) => {
        const adapterPkgPath = join(PACKAGES_DIR, `adapter-${a.name}`, "package.json")
        let adapterVersion = "0.0.1-next.0"
        if (existsSync(adapterPkgPath)) {
          const adapterPkg = JSON.parse(readFileSync(adapterPkgPath, "utf8")) as Record<string, unknown>
          adapterVersion = (adapterPkg["version"] as string) ?? adapterVersion
        }
        return { ...a, version: adapterVersion }
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  }

  writeFileSync(join(REGISTRY_DIR, "index.json"), JSON.stringify(indexV2, null, 2) + "\n")

  // Summary
  console.log(`registry-build: generated ${primitives.length} primitive manifests`)
  console.log(`registry-build: ${adapterEntries.length} adapters cataloged`)
  console.log(`registry-build: wrote registry/index.json`)

  for (const p of primitives.sort((a, b) => a.name.localeCompare(b.name))) {
    const caps =
      p.capabilities.length > 0 ? ` [${p.capabilities.map((c) => c.name).join(", ")}]` : ""
    console.log(`  ✓ ${p.name}${caps}`)
  }
}

buildRegistry()
