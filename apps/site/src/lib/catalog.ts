import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import type { NormalizedApiDocument } from "../../../../tools/api-schema"
import type { Locale } from "./locale"

// Astro bundles this module into dist/.prerender, so import.meta.url would no
// longer identify the source tree. Site commands run from apps/site instead.
const workspaceCandidate = resolve(process.cwd(), "../..")
const WORKSPACE_ROOT = existsSync(resolve(workspaceCandidate, "registry/index.json"))
  ? workspaceCandidate
  : process.cwd()
const REGISTRY_INDEX_PATH = resolve(WORKSPACE_ROOT, "registry/index.json")
const API_ARTIFACTS_DIR = resolve(WORKSPACE_ROOT, "artifacts/api")

export interface RegistryPrimitive {
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
  stylingOutputs: string[]
  searchKeywords: string[]
}

interface RegistryIndex {
  version: number
  primitives: RegistryPrimitive[]
}

export type PrimitiveView = "overview" | "api" | "examples" | "accessibility"

export interface AccessibilityEvidence {
  evidenceIds: string[]
  summary: {
    passes: number
    violations: number
    incomplete: number
  }
  lastRun: string
}

interface AccessibilityEvidenceArtifact {
  schemaVersion?: number
  primitive?: string
  evidenceIds: string[]
  summary: {
    passes: number
    violations: number
    incomplete: number
  }
  lastRun: string
}

export interface CatalogCopy {
  api: string
  examples: string
  accessibility: string
  overview: string
  preview: string
  package: string
  version: string
  status: string
  install: string
  apiUnavailable: string
  examplesUnavailable: string
  accessibilityUnavailable: string
  generatedFrom: string
  props: string
  viewSource: string
  automatedEvidence: string
  evidenceSummary: string
  passes: string
  violations: string
  incomplete: string
  evidenceLastRun: string
  evidenceIds: string
  evidenceNotice: string
  evidenceUnavailable: string
  directoryTitle: string
  directoryDescription: string
  directoryCount: string
  tabsLabel: string
}

const CATALOG_COPY: Record<Locale, CatalogCopy> = {
  en: {
    api: "API",
    examples: "Examples",
    accessibility: "Accessibility",
    overview: "Overview",
    preview: "Preview",
    package: "Package",
    version: "Version",
    status: "Status",
    install: "Install",
    apiUnavailable: "Generated API reference is not available yet.",
    examplesUnavailable: "Examples will be published with the primitive's reviewed documentation.",
    accessibilityUnavailable: "Accessibility guidance and evidence will be published after review.",
    generatedFrom: "Generated from the package's public source.",
    props: "Props",
    viewSource: "View source",
    automatedEvidence: "Automated evidence",
    evidenceSummary: "Axe scan summary",
    passes: "Passes",
    violations: "Violations",
    incomplete: "Incomplete",
    evidenceLastRun: "Latest executed scan: {date}",
    evidenceIds: "Evidence IDs",
    evidenceNotice:
      "Automated checks cover only the recorded fixture and do not establish complete accessibility conformance.",
    evidenceUnavailable: "Automated accessibility evidence is not available for this build yet.",
    directoryTitle: "Primitives",
    directoryDescription:
      "Headless, accessible building blocks generated from the Solidiom registry. Each primitive ships its own overview, generated API reference, examples, and accessibility evidence.",
    directoryCount: "{count} primitives",
    tabsLabel: "{name} documentation",
  },
  es: {
    api: "API",
    examples: "Ejemplos",
    accessibility: "Accesibilidad",
    overview: "Resumen",
    preview: "Vista previa",
    package: "Paquete",
    version: "Versión",
    status: "Estado",
    install: "Instalar",
    apiUnavailable: "La referencia de API generada aún no está disponible.",
    examplesUnavailable:
      "Los ejemplos se publicarán con la documentación revisada de la primitiva.",
    accessibilityUnavailable:
      "La guía y las evidencias de accesibilidad se publicarán después de la revisión.",
    generatedFrom: "Generado a partir del código fuente público del paquete.",
    props: "Propiedades",
    viewSource: "Ver código fuente",
    automatedEvidence: "Evidencia automatizada",
    evidenceSummary: "Resumen del análisis axe",
    passes: "Comprobaciones superadas",
    violations: "Infracciones",
    incomplete: "Incompletas",
    evidenceLastRun: "Último análisis ejecutado: {date}",
    evidenceIds: "Identificadores de evidencia",
    evidenceNotice:
      "Las comprobaciones automatizadas solo cubren el escenario registrado y no establecen una conformidad de accesibilidad completa.",
    evidenceUnavailable:
      "La evidencia automatizada de accesibilidad aún no está disponible para esta compilación.",
    directoryTitle: "Primitivas",
    directoryDescription:
      "Bloques de construcción headless y accesibles generados a partir del registro de Solidiom. Cada primitiva incluye su propio resumen, referencia de API generada, ejemplos y evidencia de accesibilidad.",
    directoryCount: "{count} primitivas",
    tabsLabel: "Documentación de {name}",
  },
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown
}

function isRegistryIndex(value: unknown): value is RegistryIndex {
  if (!value || typeof value !== "object") return false
  const index = value as Partial<RegistryIndex>
  return index.version === 2 && Array.isArray(index.primitives)
}

export function getRegistryPrimitives(): RegistryPrimitive[] {
  const raw = readJson(REGISTRY_INDEX_PATH)
  if (!isRegistryIndex(raw)) {
    throw new Error("DOCS-002: registry/index.json is not a Registry v2 index.")
  }

  return [...raw.primitives].sort((a, b) => a.name.localeCompare(b.name))
}

export function getPrimitiveStaticPaths(): Array<{
  params: { name: string }
  props: { primitive: RegistryPrimitive }
}> {
  return getRegistryPrimitives().map((primitive) => ({
    params: { name: primitive.name },
    props: { primitive },
  }))
}

export function getPrimitiveViewStaticPaths(): Array<{
  params: { name: string; view: Exclude<PrimitiveView, "overview"> }
  props: { primitive: RegistryPrimitive }
}> {
  const views: Array<Exclude<PrimitiveView, "overview">> = ["api", "examples", "accessibility"]
  return getRegistryPrimitives().flatMap((primitive) =>
    views.map((view) => ({ params: { name: primitive.name, view }, props: { primitive } })),
  )
}

export function getCatalogCopy(locale: Locale): CatalogCopy {
  return CATALOG_COPY[locale]
}

export function primitiveHref(
  name: string,
  locale: Locale,
  view: PrimitiveView = "overview",
): string {
  const prefix = locale === "es" ? "/es" : ""
  const suffix = view === "overview" ? "" : `/${view}`
  return `${prefix}/primitives/${name}${suffix}/`
}

export function getApiDocument(name: string): NormalizedApiDocument | undefined {
  const artifactPath = resolve(API_ARTIFACTS_DIR, `${name}.json`)
  if (!existsSync(artifactPath)) return undefined

  const raw = readJson(artifactPath)
  if (!raw || typeof raw !== "object") return undefined
  const document = raw as Partial<NormalizedApiDocument>
  if (document.schemaVersion !== 1 || !Array.isArray(document.exports)) return undefined

  return document as NormalizedApiDocument
}

function isAccessibilityEvidence(value: unknown): value is AccessibilityEvidence {
  if (!value || typeof value !== "object") return false
  const evidence = value as Partial<AccessibilityEvidence>
  return (
    Array.isArray(evidence.evidenceIds) &&
    typeof evidence.lastRun === "string" &&
    !!evidence.summary &&
    Number.isInteger(evidence.summary.passes) &&
    Number.isInteger(evidence.summary.violations) &&
    Number.isInteger(evidence.summary.incomplete)
  )
}

/**
 * Reads generated axe evidence at build time. Missing or malformed evidence is
 * intentionally rendered as unavailable rather than implying conformance.
 */
export function getAccessibilityEvidence(name: string): AccessibilityEvidence | undefined {
  const evidencePath = resolve(
    WORKSPACE_ROOT,
    "packages",
    name,
    "docs",
    "accessibility",
    "evidence.json",
  )
  if (!existsSync(evidencePath)) return undefined

  const raw = readJson(evidencePath)
  if (!raw || typeof raw !== "object") return undefined
  const artifact = raw as Partial<AccessibilityEvidenceArtifact>
  return artifact.schemaVersion === 1 &&
    artifact.primitive === name &&
    isAccessibilityEvidence(artifact)
    ? artifact
    : undefined
}
