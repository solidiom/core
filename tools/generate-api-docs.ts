/**
 * API-001 + API-002: generate normalized, versioned public API artifacts.
 *
 * TypeDoc's serialized reflection format is intentionally kept inside this
 * generator. Consumers receive the small schema in tools/api-schema.ts,
 * avoiding renderer coupling to TypeDoc internals.
 *
 * Usage:
 *   pnpm api:generate
 *   pnpm api:generate -- --package dialog
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path"
import {
  API_SCHEMA_URL,
  API_SCHEMA_VERSION,
  type ApiComment,
  type ApiDeclarationKind,
  type ApiInheritance,
  type ApiParameter,
  type ApiProperty,
  type ApiSignature,
  type ApiSourceLink,
  type ApiTypeParameter,
  type NormalizedApiDocument,
  type NormalizedApiExport,
} from "./api-schema"

const ROOT = resolve(import.meta.dirname ?? __dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const OUTPUT_DIR = join(ROOT, "artifacts/api")
const REPOSITORY_URL = "https://github.com/solidiom/solidiom"

type UnknownRecord = Record<string, unknown>

interface PackageNxConfig {
  tags?: string[]
}

interface PackageJson {
  name?: string
  nx?: PackageNxConfig
}

interface PackageInfo {
  name: string
  dir: string
}

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined
}

function asRecords(value: unknown): UnknownRecord[] {
  return Array.isArray(value)
    ? value.flatMap((item) => {
        const record = asRecord(item)
        return record ? [record] : []
      })
    : []
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined
}

function parseArgs(): { packageFilter: string | undefined } {
  const index = process.argv.indexOf("--package")
  return index === -1 ? {} : { packageFilter: process.argv[index + 1] }
}

function discoverPrimitivePackages(): PackageInfo[] {
  if (!existsSync(PACKAGES_DIR)) return []

  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .flatMap((entry) => {
      if (!entry.isDirectory()) return []
      const dir = join(PACKAGES_DIR, entry.name)
      const packagePath = join(dir, "package.json")
      if (!existsSync(packagePath)) return []

      try {
        const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as PackageJson
        // probe-primitive is a private dual-emission verification fixture from
        // the workspace bootstrap (see docs/solidiom-implementation-plan.md
        // Task 2), not a catalog entry. It carries layer:primitive only to
        // exercise the same build/tag wiring as real primitives, so it must
        // stay out of the public API artifacts this generator produces.
        return pkg.nx?.tags?.includes("layer:primitive") && pkg.name !== "@solidiom/probe-primitive"
          ? [{ name: pkg.name ?? entry.name, dir }]
          : []
      } catch {
        console.warn(`Unable to parse ${packagePath}`)
        return []
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function findEntryPoint(packageDir: string): string | undefined {
  // Package tsconfigs compile src/. Source/ is the consumer-facing duplicate,
  // so using src/ gives TypeDoc the same program that produces declarations.
  for (const directory of ["src", "source"]) {
    for (const filename of ["index.ts", "index.tsx"]) {
      const entry = join(packageDir, directory, filename)
      if (existsSync(entry)) return entry
    }
  }
  return undefined
}

function inlineText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined
  if (!Array.isArray(value)) return undefined

  const text = value
    .map((part) => {
      const record = asRecord(part)
      return stringValue(record?.text) ?? stringValue(record?.target) ?? ""
    })
    .join("")
    .trim()
  return text || undefined
}

function normalizeComment(value: unknown): ApiComment | undefined {
  const comment = asRecord(value)
  if (!comment) return undefined

  const tags = asRecords(comment.blockTags).flatMap((tag) => {
    const name = stringValue(tag.tag)
    const text = inlineText(tag.content)
    return name && text ? [{ name: name.replace(/^@/, ""), text }] : []
  })
  const result: ApiComment = { tags }
  const summary = inlineText(comment.summary)
  const remarks = inlineText(comment.remarks)
  if (summary) result.summary = summary
  if (remarks) result.remarks = remarks

  return result.summary || result.remarks || result.tags.length > 0 ? result : undefined
}

function renderType(value: unknown): string {
  const type = asRecord(value)
  if (!type) return "unknown"
  const kind = stringValue(type.type)

  switch (kind) {
    case "intrinsic":
    case "reference": {
      const name = stringValue(type.name) ?? "unknown"
      const args = asRecords(type.typeArguments).map(renderType)
      return args.length > 0 ? `${name}<${args.join(", ")}>` : name
    }
    case "array":
      return `${renderType(type.elementType)}[]`
    case "union":
      return asRecords(type.types).map(renderType).join(" | ") || "unknown"
    case "intersection":
      return asRecords(type.types).map(renderType).join(" & ") || "unknown"
    case "tuple":
      return `[${asRecords(type.elements).map(renderType).join(", ")}]`
    case "literal":
      return typeof type.value === "string" ? JSON.stringify(type.value) : String(type.value)
    case "typeOperator":
      return `${stringValue(type.operator) ?? ""} ${renderType(type.target)}`.trim()
    case "query":
      return `typeof ${renderType(type.queryType)}`
    case "optional":
      return `${renderType(type.elementType)} | undefined`
    case "reflection": {
      const declaration = asRecord(type.declaration)
      const signatures = asRecords(declaration?.signatures)
      // A reflection type with signatures and no properties is a function/
      // callback type (e.g. `onOpenChange?: (open: boolean) => void`), not
      // an inline object literal. Render it as a function signature instead
      // of the generic placeholder so callback props carry real type
      // information in the generated API artifacts.
      if (signatures.length > 0 && asRecords(declaration?.children).length === 0) {
        return signatures.map((signature) => renderFunctionType(signature)).join(" | ")
      }
      return "{ … }"
    }
    default:
      return stringValue(type.name) ?? "unknown"
  }
}

function renderFunctionType(signature: UnknownRecord): string {
  const parameters = asRecords(signature.parameters)
    .map((parameter) => {
      const flags = asRecord(parameter.flags)
      const name = stringValue(parameter.name) ?? "arg"
      const optional = flags?.isOptional === true ? "?" : ""
      return `${name}${optional}: ${renderType(parameter.type)}`
    })
    .join(", ")
  return `(${parameters}) => ${renderType(signature.type)}`
}

function reflectionKind(reflection: UnknownRecord): string {
  const kindString = stringValue(reflection.kindString)
  if (kindString) return kindString.toLowerCase()

  switch (numberValue(reflection.kind)) {
    case 2:
      return "module"
    case 8:
      return "enum"
    case 32:
      return "variable"
    case 64:
      return "function"
    case 128:
      return "class"
    case 256:
      return "interface"
    case 1024:
      return "property"
    case 262144:
      return "accessor"
    case 2097152:
      return "type alias"
    default:
      return ""
  }
}

function normalizeSource(value: unknown, sourceDirectory: string): ApiSourceLink | undefined {
  const source = asRecords(value)[0]
  const filename = stringValue(source?.fileName)
  const line = numberValue(source?.line)
  if (!filename || !line) return undefined

  const absolutePath = isAbsolute(filename) ? filename : resolve(sourceDirectory, filename)
  const path = relative(ROOT, absolutePath).replaceAll("\\", "/")
  if (path.startsWith("../")) return undefined

  return { path, line, url: `${REPOSITORY_URL}/blob/main/${path}#L${line}` }
}

function normalizeTypeParameters(value: unknown): ApiTypeParameter[] {
  return asRecords(value).map((parameter) => {
    const normalized: ApiTypeParameter = { name: stringValue(parameter.name) ?? "T" }
    if (parameter.type) normalized.constraint = renderType(parameter.type)
    if (parameter.default) normalized.default = renderType(parameter.default)
    return normalized
  })
}

function normalizeParameters(value: unknown): ApiParameter[] {
  return asRecords(value).map((parameter) => {
    const flags = asRecord(parameter.flags)
    const normalized: ApiParameter = {
      name: stringValue(parameter.name) ?? "arg",
      type: renderType(parameter.type),
      optional: flags?.isOptional === true,
    }
    const defaultValue = stringValue(parameter.defaultValue)
    const comment = normalizeComment(parameter.comment)
    if (defaultValue) normalized.default = defaultValue
    if (comment) normalized.comment = comment
    return normalized
  })
}

function normalizeSignatures(value: unknown, sourceDirectory: string): ApiSignature[] {
  return asRecords(value).map((signature) => {
    const normalized: ApiSignature = {
      parameters: normalizeParameters(signature.parameters),
      returns: renderType(signature.type),
      typeParameters: normalizeTypeParameters(signature.typeParameter),
    }
    const comment = normalizeComment(signature.comment)
    const source = normalizeSource(signature.sources, sourceDirectory)
    if (comment) normalized.comment = comment
    if (source) normalized.source = source
    return normalized
  })
}

function normalizeInheritance(reflection: UnknownRecord): ApiInheritance {
  const inheritance: ApiInheritance = {
    extends: asRecords(reflection.extendedTypes)
      .map(renderType)
      .filter((value) => value !== "unknown")
      .sort(),
    implements: asRecords(reflection.implementedTypes)
      .map(renderType)
      .filter((value) => value !== "unknown")
      .sort(),
  }
  const inheritedFrom = reflection.inheritedFrom ? renderType(reflection.inheritedFrom) : undefined
  if (inheritedFrom && inheritedFrom !== "unknown") inheritance.inheritedFrom = inheritedFrom
  return inheritance
}

function normalizeProperties(value: unknown, sourceDirectory: string): ApiProperty[] {
  return asRecords(value)
    .filter((property) => {
      const kind = reflectionKind(property)
      return kind === "property" || kind === "accessor"
    })
    .map((property) => {
      const flags = asRecord(property.flags)
      const normalized: ApiProperty = {
        name: stringValue(property.name) ?? "property",
        type: renderType(property.type),
        optional: flags?.isOptional === true,
        readonly: flags?.isReadonly === true,
      }
      const defaultValue = stringValue(property.defaultValue)
      const comment = normalizeComment(property.comment)
      const source = normalizeSource(property.sources, sourceDirectory)
      if (defaultValue) normalized.default = defaultValue
      if (comment) normalized.comment = comment
      if (source) normalized.source = source
      return normalized
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function reflectionById(reflection: UnknownRecord, byId: Map<number, UnknownRecord>): void {
  const id = numberValue(reflection.id)
  if (id !== undefined) byId.set(id, reflection)
  for (const child of ["children", "signatures", "parameters", "typeParameter"]) {
    for (const nested of asRecords(reflection[child])) reflectionById(nested, byId)
  }
  const type = asRecord(reflection.type)
  const declaration = asRecord(type?.declaration)
  if (declaration) reflectionById(declaration, byId)
}

function resolvePropertiesTarget(
  reflection: UnknownRecord,
  byId: Map<number, UnknownRecord>,
  sourceDirectory: string,
): UnknownRecord | undefined {
  const ownProperties = normalizeProperties(reflection.children, sourceDirectory)
  if (ownProperties.length > 0) return reflection

  const signatures = asRecords(reflection.signatures)
  const propsParameter = signatures
    .flatMap((signature) => asRecords(signature.parameters))
    .find((parameter) => stringValue(parameter.name) === "props")
  const parameterType = asRecord(propsParameter?.type)
  if (!parameterType) return undefined

  const declaration = asRecord(parameterType.declaration)
  if (declaration) return declaration
  const targetId = numberValue(parameterType.target) ?? numberValue(parameterType.id)
  return targetId === undefined ? undefined : byId.get(targetId)
}

function normalizeKind(
  reflection: UnknownRecord,
  signatures: ApiSignature[],
  props: ApiProperty[],
): ApiDeclarationKind {
  const name = stringValue(reflection.name) ?? ""
  const typedocKind = reflectionKind(reflection)
  const type = reflection.type ? renderType(reflection.type) : ""
  if (
    name.endsWith("Context") ||
    typedocKind === "context" ||
    type === "Context" ||
    type.startsWith("Context<")
  ) {
    return "context"
  }
  if (typedocKind === "class") return "class"
  if (typedocKind === "enum") return "enum"
  if (typedocKind === "interface") return "interface"
  if (typedocKind === "namespace" || typedocKind === "module") return "namespace"
  if (typedocKind === "type alias") return "type"
  if (typedocKind === "variable") return "variable"
  if (typedocKind === "function") {
    const returnsElement = signatures.some((signature) =>
      /\b(?:JSX\.)?Element\b/.test(signature.returns),
    )
    return signatures.length > 0 && /^[A-Z]/.test(name) && (props.length > 0 || returnsElement)
      ? "component"
      : "function"
  }
  return "unknown"
}

function normalizeExport(
  reflection: UnknownRecord,
  byId: Map<number, UnknownRecord>,
  sourceDirectory: string,
): NormalizedApiExport {
  const propertiesTarget = resolvePropertiesTarget(reflection, byId, sourceDirectory)
  const allProps = normalizeProperties(propertiesTarget?.children, sourceDirectory)
  const children = allProps.find((property) => property.name === "children")
  const props = allProps.filter((property) => property.name !== "children")
  const signatures = normalizeSignatures(reflection.signatures, sourceDirectory)
  const normalized: NormalizedApiExport = {
    name: stringValue(reflection.name) ?? "unknown",
    kind: normalizeKind(reflection, signatures, props),
    signatures,
    props,
    inheritance: normalizeInheritance(reflection),
  }
  const type = reflection.type ? renderType(reflection.type) : undefined
  const comment = normalizeComment(reflection.comment)
  const source = normalizeSource(reflection.sources, sourceDirectory)
  if (type && type !== "unknown") normalized.type = type
  if (comment) normalized.comment = comment
  if (source) normalized.source = source
  if (children) normalized.children = children
  return normalized
}

function topLevelExports(project: UnknownRecord): UnknownRecord[] {
  const children = asRecords(project.children)
  const modules = children.filter((child) => reflectionKind(child) === "module")
  return (
    modules.length > 0 ? modules.flatMap((module) => asRecords(module.children)) : children
  ).filter((child) => !stringValue(child.name)?.startsWith("__"))
}

export function normalizeTypeDocProject(
  project: unknown,
  packageName: string,
  entryPoints: string[],
  sourceDirectory = ROOT,
): NormalizedApiDocument {
  const root = asRecord(project)
  if (!root) throw new Error("API-002: TypeDoc did not return a project reflection.")

  const byId = new Map<number, UnknownRecord>()
  reflectionById(root, byId)
  const exports = topLevelExports(root)
    .map((reflection) => normalizeExport(reflection, byId, sourceDirectory))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    $schema: API_SCHEMA_URL,
    schemaVersion: API_SCHEMA_VERSION,
    packageName,
    generatedAt: new Date().toISOString(),
    entryPoints: entryPoints.map((entryPoint) => relative(ROOT, entryPoint).replaceAll("\\", "/")),
    exports,
  }
}

async function generateForPackage(pkg: PackageInfo): Promise<boolean> {
  const entryPoint = findEntryPoint(pkg.dir)
  const shortName = basename(pkg.dir)
  if (!entryPoint) {
    console.error(`  ✗ ${shortName}: source/index.ts or source/index.tsx is required`)
    return false
  }

  console.log(`  → Processing ${shortName}...`)
  try {
    const { Application } = await import("typedoc")
    const app = await Application.bootstrapWithPlugins({
      entryPoints: [entryPoint],
      tsconfig: join(pkg.dir, "tsconfig.json"),
      entryPointStrategy: "resolve",
      excludePrivate: true,
      excludeInternal: true,
      excludeExternals: true,
    })
    const project = await app.convert()
    if (!project) {
      console.error(`  ✗ ${shortName}: TypeDoc conversion failed`)
      return false
    }

    const serialized = app.serializer.projectToObject(project, ROOT)
    const output = normalizeTypeDocProject(serialized, pkg.name, [entryPoint], dirname(entryPoint))
    const outputPath = join(OUTPUT_DIR, `${shortName}.json`)
    writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")
    console.log(`  ✓ ${outputPath} (${output.exports.length} exports)`)
    return true
  } catch (error) {
    console.error(`  ✗ ${shortName}: ${String(error)}`)
    return false
  }
}

async function main(): Promise<void> {
  const { packageFilter } = parseArgs()
  let packages = discoverPrimitivePackages()
  if (packageFilter) {
    packages = packages.filter(
      (pkg) => pkg.name === packageFilter || basename(pkg.dir) === packageFilter,
    )
  }
  if (packages.length === 0) {
    throw new Error(
      packageFilter
        ? `No primitive package matched "${packageFilter}".`
        : "No packages tagged layer:primitive were found.",
    )
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })
  console.log(`API: generating ${packages.length} normalized TypeDoc artifact(s)...`)
  const results = await Promise.all(packages.map(generateForPackage))
  if (results.some((result) => !result)) {
    throw new Error("API generation failed; no incomplete API artifact may be treated as current.")
  }
}

// Only run as a script, not when imported (e.g. by tests importing
// normalizeTypeDocProject). tsx's CLI invocation is a direct file execution,
// so this matches the workspace's other dual-purpose tool modules.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`✗ ${String(error)}`)
    process.exit(1)
  })
}
