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
import { createHash, createHmac } from "node:crypto"
import { execSync } from "node:child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const REGISTRY_DIR = join(ROOT, "registry")

interface A11yEvidenceRecord {
  schemaVersion?: unknown
  primitive?: unknown
  evidenceIds?: unknown
  summary?: {
    passes?: unknown
    violations?: unknown
    incomplete?: unknown
    outcome?: unknown
  }
  lastRun?: unknown
}

type RegistryStatus = "experimental" | "preview" | "stable" | "deprecated"
type Deliverable = "primitive" | "component" | "block" | "template" | "theme"
type DocumentationLocaleStatus = "missing" | "draft" | "stale" | "reviewed"

const REGISTRY_STATUSES = new Set<RegistryStatus>([
  "experimental",
  "preview",
  "stable",
  "deprecated",
])
const DELIVERABLES = new Set<Deliverable>(["primitive", "component", "block", "template", "theme"])

interface RegistryPackageMetadata {
  status?: RegistryStatus
  deliverables: Deliverable[]
  themeCompatible: string[]
  searchKeywords: string[]
  provenance: {
    repository?: string
    directory?: string
    sourceCommit?: string
  }
}

interface DocumentationFrontmatter {
  keywords: string[]
  translationStatus?: "draft" | "human-reviewed" | "stale"
  translationSourceHash?: string
  translationReviewedAt?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.map(nonEmptyString).filter((entry): entry is string => !!entry))].sort()
    : []
}

/** Reads optional product metadata without coupling registry output to a site-only schema. */
function registryPackageMetadata(pkg: Record<string, unknown>): RegistryPackageMetadata {
  const nx = isRecord(pkg.nx) ? pkg.nx : undefined
  const metadata = nx && isRecord(nx.metadata) ? nx.metadata : undefined
  const registry = metadata && isRecord(metadata.registry) ? metadata.registry : undefined
  const provenance = registry && isRecord(registry.provenance) ? registry.provenance : undefined
  const status = registry && nonEmptyString(registry.status)

  return {
    status:
      status && REGISTRY_STATUSES.has(status as RegistryStatus)
        ? (status as RegistryStatus)
        : undefined,
    deliverables: stringArray(registry?.deliverables).filter((value): value is Deliverable =>
      DELIVERABLES.has(value as Deliverable),
    ),
    themeCompatible: stringArray(registry?.themeCompatible),
    searchKeywords: stringArray(registry?.searchKeywords),
    provenance: {
      repository: nonEmptyString(provenance?.repository),
      directory: nonEmptyString(provenance?.directory),
      sourceCommit: nonEmptyString(provenance?.sourceCommit),
    },
  }
}

/** Read the small, flat frontmatter subset registry discovery needs from authored package docs. */
function documentationFrontmatter(path: string): DocumentationFrontmatter {
  if (!existsSync(path)) return { keywords: [] }

  const source = readFileSync(path, "utf8")
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { keywords: [] }

  const fields = new Map<string, string>()
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$/)
    if (field) fields.set(field[1], field[2])
  }

  const rawKeywords = fields.get("keywords")
  const keywords = rawKeywords
    ? stringArray(
        rawKeywords
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((value) => value.trim().replace(/^['\"]|['\"]$/g, "")),
      )
    : []
  const translationStatus = fields.get("translationStatus")
  const translationSourceHash = fields.get("translationSourceHash")
  const translationReviewedAt = fields.get("translationReviewedAt")

  return {
    keywords,
    ...(translationStatus === "draft" ||
    translationStatus === "human-reviewed" ||
    translationStatus === "stale"
      ? { translationStatus }
      : {}),
    ...(translationSourceHash && /^[a-f0-9]{64}$/.test(translationSourceHash)
      ? { translationSourceHash }
      : {}),
    ...(translationReviewedAt && !Number.isNaN(Date.parse(translationReviewedAt))
      ? { translationReviewedAt: new Date(translationReviewedAt).toISOString() }
      : {}),
  }
}

function overviewFrontmatter(name: string, locale: "en" | "es"): DocumentationFrontmatter {
  const file = locale === "en" ? "overview.md" : join("es", "overview.md")
  return documentationFrontmatter(join(PACKAGES_DIR, name, "docs", file))
}

function documentationMetadata(name: string): PrimitiveManifestV2["documentation"] {
  const docsDir = join(PACKAGES_DIR, name, "docs")
  const localeMetadata = (locale: "en" | "es") => {
    const root = locale === "en" ? docsDir : join(docsDir, locale)
    const overview = join(root, "overview.md")
    if (!existsSync(overview)) return { status: "missing" as const }

    const frontmatter = overviewFrontmatter(name, locale)
    const status: DocumentationLocaleStatus =
      frontmatter.translationStatus === "human-reviewed"
        ? "reviewed"
        : frontmatter.translationStatus === "stale"
          ? "stale"
          : "draft"
    return {
      status,
      ...(frontmatter.translationSourceHash
        ? { sourceHash: frontmatter.translationSourceHash }
        : {}),
      ...(frontmatter.translationReviewedAt
        ? { lastUpdated: frontmatter.translationReviewedAt }
        : {}),
    }
  }
  const hasCompleteLocale = (locale: "en" | "es"): boolean => {
    const root = locale === "en" ? docsDir : join(docsDir, locale)
    const examplesDir = join(root, "examples")
    return (
      existsSync(join(root, "overview.md")) &&
      existsSync(join(root, "accessibility", "contract.md")) &&
      existsSync(examplesDir) &&
      readdirSync(examplesDir).some((entry) => entry.endsWith(".md") || entry.endsWith(".mdx"))
    )
  }
  const enComplete = hasCompleteLocale("en")
  const esComplete = hasCompleteLocale("es")

  return {
    status:
      enComplete && esComplete
        ? "complete"
        : enComplete
          ? "review"
          : existsSync(docsDir)
            ? "draft"
            : "stub",
    locales: {
      en: localeMetadata("en"),
      ...(existsSync(join(docsDir, "es")) ? { es: localeMetadata("es") } : {}),
    },
  }
}

function documentationKeywords(name: string): string[] {
  return [
    ...new Set(
      ["en", "es"].flatMap((locale) => overviewFrontmatter(name, locale as "en" | "es").keywords),
    ),
  ].sort()
}

function readA11yEvidence(name: string): { evidenceIds: string[]; lastReviewed?: string } {
  const evidencePath = join(PACKAGES_DIR, name, "docs", "accessibility", "evidence.json")
  if (!existsSync(evidencePath)) return { evidenceIds: [] }

  try {
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as A11yEvidenceRecord
    const hasPassingSummary =
      evidence.schemaVersion === 2 &&
      evidence.primitive === name &&
      evidence.summary?.violations === 0 &&
      evidence.summary?.outcome === "pass" &&
      typeof evidence.summary.passes === "number" &&
      evidence.summary.passes > 0
    const evidenceIds = Array.isArray(evidence.evidenceIds)
      ? evidence.evidenceIds.filter((id): id is string => typeof id === "string")
      : []
    return hasPassingSummary && evidenceIds.length > 0
      ? {
          evidenceIds,
          lastReviewed: typeof evidence.lastRun === "string" ? evidence.lastRun : undefined,
        }
      : { evidenceIds: [] }
  } catch {
    return { evidenceIds: [] }
  }
}

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
    locales: Record<
      string,
      {
        status: "missing" | "draft" | "stale" | "reviewed"
        sourceHash?: string
        lastUpdated?: string
      }
    >
  }
  styling: {
    outputs: ("css" | "tailwind" | "unocss")[]
    themeCompatible: string[]
  }
  search: {
    keywords: string[]
  }
  integrity: {
    algorithm: "sha256"
    filesHash: string
    fileDigests: Record<string, string>
    manifestSignature?: string
    lastGenerated: string
  }
  provenance: {
    repository: string
    directory: string
    sourceCommit?: string
  }
  lastUpdated: string
}

interface IndexManifestV2 {
  $schema: string
  version: 2
  generatedAt: string
  integrity: {
    algorithm: "sha256"
    entriesHash: string
    signature?: string
    signedAt?: string
    signatureKeyId?: string
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
    accessibility: Pick<PrimitiveManifestV2["accessibility"], "reviewStatus" | "evidenceIds">
    hasAccessibilityEvidence: boolean
    documentationStatus: string
    documentationLocales: PrimitiveManifestV2["documentation"]["locales"]
    stylingOutputs: string[]
    themeCompatible: string[]
    searchKeywords: string[]
    provenance: PrimitiveManifestV2["provenance"]
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
  return files.sort()
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
 * Compute deterministic filesHash per the registry schema v2 algorithm:
 * 1. Sort source files lexicographically.
 * 2. SHA-256 each file's raw content.
 * 3. Concatenate hex hashes (no separator).
 * 4. SHA-256 the concatenation.
 *
 * Also returns per-file digests mapping each file path to its individual hash.
 */
function computeFilesHash(
  sourceDir: string,
  files: string[],
): { hash: string; fileDigests: Record<string, string> } {
  const sorted = [...files].sort()
  const hashes: string[] = []
  const fileDigests: Record<string, string> = {}

  for (const file of sorted) {
    // Files are stored as "src/foo.ts" but live in "source/foo.ts"
    const relativePath = file.replace(/^src\//, "")
    const fullPath = join(sourceDir, relativePath)
    if (!existsSync(fullPath)) continue
    const content = readFileSync(fullPath)
    const digest = createHash("sha256").update(content).digest("hex")
    hashes.push(digest)
    fileDigests[file] = digest
  }

  const concatenated = hashes.join("")
  const hash = createHash("sha256").update(concatenated).digest("hex")
  return { hash, fileDigests }
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
 * Generate search keywords from label, description, category, capabilities, and dependencies.
 */
function generateKeywords(
  label: string,
  description: string,
  category: string,
  capabilities: Capability[],
  dependencies: string[],
): string[] {
  const capNames = capabilities.map((c) => c.name)
  const depNames = dependencies.map((d) => d.replace("@solidiom/", ""))
  const text = `${label} ${description} ${category}`.toLowerCase()
  const words = text.split(/[\s,.\-_/]+/).filter((w) => w.length > 2)
  // Preserve capability and dependency names intact (they may contain hyphens)
  const preservedTerms = [...capNames, ...depNames]
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 2)
  return [...new Set([...words, ...preservedTerms])].sort()
}

// ─── Recipe Detection ────────────────────────────────────────────────────────

/** Detect which styling recipe outputs exist for a given primitive name. */
function detectStylingOutputs(name: string): ("css" | "tailwind" | "unocss")[] {
  const outputs: ("css" | "tailwind" | "unocss")[] = []

  const cssRecipePath = join(PACKAGES_DIR, "recipes-css", "source", "recipes", `${name}.tsx`)
  if (existsSync(cssRecipePath)) outputs.push("css")

  const tailwindRecipePath = join(
    PACKAGES_DIR,
    "recipes-tailwind",
    "source",
    "recipes",
    `${name}.tsx`,
  )
  if (existsSync(tailwindRecipePath)) outputs.push("tailwind")

  const unocssRecipePath = join(PACKAGES_DIR, "recipes-unocss", "source", "recipes", `${name}.tsx`)
  if (existsSync(unocssRecipePath)) outputs.push("unocss")

  return outputs.sort()
}

// ─── Deterministic Timestamp ─────────────────────────────────────────────────

/** Get a deterministic timestamp: env override > git HEAD commit date > current time. */
function getDeterministicTimestamp(): string {
  if (process.env.REGISTRY_TIMESTAMP) {
    return process.env.REGISTRY_TIMESTAMP
  }
  try {
    const gitDate = execSync("git log -1 --format=%cI", { cwd: ROOT, encoding: "utf8" }).trim()
    if (gitDate) return new Date(gitDate).toISOString()
  } catch {
    // git not available, fall through
  }
  return new Date().toISOString()
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
    const solidiomDeps = deps
      ? Object.keys(deps)
          .filter((d) => d.startsWith("@solidiom/"))
          .sort()
      : []

    // Detect capabilities from port interfaces
    const capabilities = detectCapabilities(sourceDir).sort((a, b) => a.name.localeCompare(b.name))

    // Extract runtime modules used
    const runtimeModules = extractRuntimeModules(sourceDir)

    // Find entry file
    const entry = sourceFiles.includes("index.tsx")
      ? "src/index.tsx"
      : sourceFiles.includes("index.ts")
        ? "src/index.ts"
        : `src/${sourceFiles[0]}`

    // Map source files to src/ paths (as they'd appear in the consumer project)
    const srcFiles = sourceFiles.map((f) => `src/${f}`).sort()

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
  const now = getDeterministicTimestamp()
  const v2Manifests: PrimitiveManifestV2[] = []

  for (const primitive of primitives) {
    const pkgPath = join(PACKAGES_DIR, primitive.name, "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const nx = pkg["nx"] as Record<string, unknown> | undefined
    const metadata = nx?.["metadata"] as Record<string, string> | undefined
    const registryMetadata = registryPackageMetadata(pkg)
    const label = metadata?.["label"] ?? primitive.name
    const description = metadata?.["description"] ?? ""
    const category = metadata?.["category"] ?? "uncategorized"

    const sourceDir = join(PACKAGES_DIR, primitive.name, "source")
    const { hash: filesHash, fileDigests } = computeFilesHash(sourceDir, primitive.source.files)

    // Package recipe sources define output availability; package registry metadata
    // declares theme compatibility and optional product-layer deliverables.
    const stylingOutputs = detectStylingOutputs(primitive.name)
    const documentation = documentationMetadata(primitive.name)
    const a11yEvidence: { evidenceIds: string[]; lastReviewed?: string } =
      documentation.status === "complete" ? readA11yEvidence(primitive.name) : { evidenceIds: [] }

    // Package metadata and authored documentation frontmatter extend the stable,
    // generated search terms without introducing a separate registry-only list.
    const keywords = [
      ...new Set([
        ...generateKeywords(
          label,
          description,
          category,
          primitive.capabilities,
          primitive.dependencies,
        ),
        ...registryMetadata.searchKeywords.map((keyword) => keyword.toLowerCase()),
        ...documentationKeywords(primitive.name).map((keyword) => keyword.toLowerCase()),
      ]),
    ].sort()

    const v2: PrimitiveManifestV2 = {
      ...primitive,
      $schema: "https://solidiom.dev/schemas/registry-manifest/v2.json",
      label,
      description,
      category,
      status: registryMetadata.status ?? "preview",
      deliverables: {
        primitive: true,
        ...(registryMetadata.deliverables.includes("component") ? { component: true } : {}),
        ...(registryMetadata.deliverables.includes("block") ? { block: true } : {}),
        ...(registryMetadata.deliverables.includes("template") ? { template: true } : {}),
        ...(registryMetadata.deliverables.includes("theme") ? { theme: true } : {}),
      },
      cli: {
        addCommand: `solidiom add ${primitive.name}`,
        installDeps: [...primitive.capabilities.map((c) => c.default)].sort(),
      },
      accessibility: {
        reviewStatus: a11yEvidence.evidenceIds.length > 0 ? "automated" : "none",
        evidenceIds: a11yEvidence.evidenceIds,
        ...(a11yEvidence.lastReviewed ? { lastReviewed: a11yEvidence.lastReviewed } : {}),
      },
      documentation,
      styling: {
        outputs: stylingOutputs,
        themeCompatible: registryMetadata.themeCompatible,
      },
      search: {
        keywords,
      },
      integrity: {
        algorithm: "sha256",
        filesHash,
        fileDigests,
        lastGenerated: now,
      },
      provenance: {
        repository:
          registryMetadata.provenance.repository ?? "https://github.com/solidiom/solidiom",
        directory: registryMetadata.provenance.directory ?? `packages/${primitive.name}`,
        ...(registryMetadata.provenance.sourceCommit
          ? { sourceCommit: registryMetadata.provenance.sourceCommit }
          : {}),
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
    integrity: { algorithm: "sha256", entriesHash },
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
          .map(([k]) => k)
          .sort(),
        hasAccessibilityEvidence: m.accessibility.evidenceIds.length > 0,
        accessibility: {
          reviewStatus: m.accessibility.reviewStatus,
          evidenceIds: [...m.accessibility.evidenceIds].sort(),
        },
        documentationStatus: m.documentation.status,
        documentationLocales: m.documentation.locales,
        stylingOutputs: [...m.styling.outputs].sort(),
        themeCompatible: [...m.styling.themeCompatible].sort(),
        searchKeywords: [...m.search.keywords].sort(),
        provenance: m.provenance,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    adapters: adapterEntries
      .map((a) => {
        const adapterPkgPath = join(PACKAGES_DIR, `adapter-${a.name}`, "package.json")
        let adapterVersion = "0.0.1-next.0"
        if (existsSync(adapterPkgPath)) {
          const adapterPkg = JSON.parse(readFileSync(adapterPkgPath, "utf8")) as Record<
            string,
            unknown
          >
          adapterVersion = (adapterPkg["version"] as string) ?? adapterVersion
        }
        return { ...a, version: adapterVersion }
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  }

  // REG-005: Sign the index if REGISTRY_SIGN_KEY is set
  const signKey = process.env.REGISTRY_SIGN_KEY
  if (signKey) {
    const indexContent = JSON.stringify(indexV2, null, 2)
    const signature = createHmac("sha256", signKey).update(indexContent).digest("hex")
    indexV2.integrity.signature = signature
    indexV2.integrity.signedAt = now
    indexV2.integrity.signatureKeyId = createHash("sha256")
      .update(signKey)
      .digest("hex")
      .slice(0, 16)
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

// ─── Exports for Testing ─────────────────────────────────────────────────────

export {
  computeFilesHash,
  computeEntriesHash,
  generateKeywords,
  detectStylingOutputs,
  getDeterministicTimestamp,
  buildRegistry,
  collectSourceFiles,
  detectCapabilities,
  extractRuntimeModules,
}

export type { PrimitiveManifestV2, IndexManifestV2, Capability }

// Run the build when executed directly
const isMainModule =
  process.argv[1]?.endsWith("registry-build.ts") || process.argv[1]?.endsWith("registry-build")

if (isMainModule) {
  buildRegistry()
}
