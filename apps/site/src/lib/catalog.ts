import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  API_SCHEMA_URL,
  API_SCHEMA_VERSION,
  type NormalizedApiDocument,
} from "../../../../tools/api-schema"
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
  accessibility: {
    reviewStatus: "none" | "automated" | "manual" | "complete"
    evidenceIds: string[]
  }
  documentationStatus: string
  documentationLocales: Record<
    string,
    {
      status: "missing" | "draft" | "stale" | "reviewed"
      sourceHash?: string
      lastUpdated?: string
    }
  >
  stylingOutputs: string[]
  themeCompatible: string[]
  searchKeywords: string[]
  provenance: {
    repository: string
    directory: string
    sourceCommit?: string
  }
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
    outcome: "pass" | "fail"
  }
  lastRun: string
}

interface AccessibilityEvidenceArtifact {
  schemaVersion?: number
  primitive?: string
  evidenceIds: string[]
  summary: AccessibilityEvidence["summary"]
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
  apiMalformed: string
  apiInvalidShape: string
  apiEmpty: string
  examplesUnavailable: string
  accessibilityUnavailable: string
  generatedFrom: string
  props: string
  viewSource: string
  copyCode: string
  linkToSection: string
  children: string
  apiKindLabels: Record<
    "class" | "component" | "context" | "enum" | "function" | "interface" | "namespace" | "type" | "variable" | "unknown",
    string
  >
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
  contractHeading: string
  contractKeyboard: string
  contractFocus: string
  contractSemantics: string
  contractAria: string
  contractConsumerDuties: string
  contractNonApplicable: string
  contractReviewStatus: string
  contractReviewStatusLabels: Record<"draft" | "reviewed" | "complete", string>
  contractReviewedBy: string
  contractUnavailable: string
  contractNotice: string
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
    apiMalformed: "The generated API artifact for this primitive could not be read.",
    apiInvalidShape: "The generated API artifact for this primitive does not match the expected schema.",
    apiEmpty: "The generated API artifact exists but declares no public exports.",
    examplesUnavailable: "Examples will be published with the primitive's reviewed documentation.",
    accessibilityUnavailable: "Accessibility guidance and evidence will be published after review.",
    generatedFrom: "Generated from the package's public source.",
    props: "Props",
    viewSource: "View source",
    copyCode: "Copy",
    linkToSection: "Link to this section",
    children: "children",
    apiKindLabels: {
      class: "class",
      component: "component",
      context: "context",
      enum: "enum",
      function: "function",
      interface: "interface",
      namespace: "namespace",
      type: "type",
      variable: "variable",
      unknown: "unknown",
    },
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
    contractHeading: "Accessibility contract",
    contractKeyboard: "Keyboard",
    contractFocus: "Focus",
    contractSemantics: "Semantics",
    contractAria: "ARIA",
    contractConsumerDuties: "Consumer responsibilities",
    contractNonApplicable: "Not applicable",
    contractReviewStatus: "Review status",
    contractReviewStatusLabels: {
      draft: "Draft — not yet reviewed",
      reviewed: "Reviewed",
      complete: "Complete",
    },
    contractReviewedBy: "Reviewed by {name} on {date}",
    contractUnavailable: "An authored accessibility contract has not been published for this primitive yet.",
    contractNotice:
      "This contract describes what the primitive guarantees. Consuming products remain responsible for labels, layout, and workflow decisions that affect the final accessibility result.",
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
    apiMalformed: "No se pudo leer el artefacto de API generado para esta primitiva.",
    apiInvalidShape:
      "El artefacto de API generado para esta primitiva no coincide con el esquema esperado.",
    apiEmpty: "El artefacto de API generado existe pero no declara exportaciones públicas.",
    examplesUnavailable:
      "Los ejemplos se publicarán con la documentación revisada de la primitiva.",
    accessibilityUnavailable:
      "La guía y las evidencias de accesibilidad se publicarán después de la revisión.",
    generatedFrom: "Generado a partir del código fuente público del paquete.",
    props: "Propiedades",
    viewSource: "Ver código fuente",
    copyCode: "Copiar",
    linkToSection: "Enlace a esta sección",
    children: "hijos",
    apiKindLabels: {
      class: "clase",
      component: "componente",
      context: "contexto",
      enum: "enumeración",
      function: "función",
      interface: "interfaz",
      namespace: "espacio de nombres",
      type: "tipo",
      variable: "variable",
      unknown: "desconocido",
    },
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
    contractHeading: "Contrato de accesibilidad",
    contractKeyboard: "Teclado",
    contractFocus: "Foco",
    contractSemantics: "Semántica",
    contractAria: "ARIA",
    contractConsumerDuties: "Responsabilidades del consumidor",
    contractNonApplicable: "No aplicable",
    contractReviewStatus: "Estado de revisión",
    contractReviewStatusLabels: {
      draft: "Borrador — aún no revisado",
      reviewed: "Revisado",
      complete: "Completo",
    },
    contractReviewedBy: "Revisado por {name} el {date}",
    contractUnavailable: "Aún no se ha publicado un contrato de accesibilidad redactado para esta primitiva.",
    contractNotice:
      "Este contrato describe lo que garantiza la primitiva. Los productos que la consumen siguen siendo responsables de las etiquetas, el diseño y las decisiones de flujo que afectan el resultado final de accesibilidad.",
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

export type ApiDocumentDiagnostic = "missing" | "malformed" | "invalid-shape" | "empty" | "ok"

export interface ApiDocumentResult {
  document?: NormalizedApiDocument
  diagnostic: ApiDocumentDiagnostic
}

/**
 * Reads a generated API artifact at build time, distinguishing *why* it is
 * unavailable rather than collapsing every failure into a single generic
 * "unavailable" state (API-003):
 *   - "missing": no artifact file exists yet for this primitive.
 *   - "malformed": the artifact file exists but is not valid JSON.
 *   - "invalid-shape": the artifact parses but fails the normalized API
 *     schema check (wrong `$schema`/`schemaVersion`, or missing fields).
 *   - "empty": the artifact is valid but declares zero public exports.
 *   - "ok": the artifact is valid and has at least one export.
 */
export function getApiDocumentResult(name: string): ApiDocumentResult {
  const artifactPath = resolve(API_ARTIFACTS_DIR, `${name}.json`)
  if (!existsSync(artifactPath)) return { diagnostic: "missing" }

  let raw: unknown
  try {
    raw = readJson(artifactPath)
  } catch {
    return { diagnostic: "malformed" }
  }

  if (!raw || typeof raw !== "object") return { diagnostic: "invalid-shape" }
  const document = raw as Partial<NormalizedApiDocument>
  if (
    document.$schema !== API_SCHEMA_URL ||
    document.schemaVersion !== API_SCHEMA_VERSION ||
    typeof document.packageName !== "string" ||
    !Array.isArray(document.entryPoints) ||
    !Array.isArray(document.exports)
  ) {
    return { diagnostic: "invalid-shape" }
  }

  const normalized = document as NormalizedApiDocument
  return {
    document: normalized,
    diagnostic: normalized.exports.length === 0 ? "empty" : "ok",
  }
}

export function getApiDocument(name: string): NormalizedApiDocument | undefined {
  return getApiDocumentResult(name).document
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
    Number.isInteger(evidence.summary.incomplete) &&
    (evidence.summary.outcome === "pass" || evidence.summary.outcome === "fail")
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
  return artifact.schemaVersion === 2 &&
    artifact.primitive === name &&
    isAccessibilityEvidence(artifact)
    ? artifact
    : undefined
}
