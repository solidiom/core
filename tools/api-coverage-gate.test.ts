import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { checkCoverage, VERTICAL_SLICE_PRIMITIVES } from "./api-coverage-gate"
import type { NormalizedApiDocument, NormalizedApiExport } from "./api-schema"
import { API_SCHEMA_URL, API_SCHEMA_VERSION } from "./api-schema"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const ARTIFACTS_DIR = process.env.SOLIDIOM_API_ARTIFACTS_DIR
  ? resolve(process.env.SOLIDIOM_API_ARTIFACTS_DIR)
  : join(ROOT, "artifacts", "api")

function baseExport(overrides: Partial<NormalizedApiExport> = {}): NormalizedApiExport {
  return {
    name: "Example",
    kind: "component",
    signatures: [],
    props: [],
    inheritance: { extends: [], implements: [] },
    ...overrides,
  }
}

function document(exports: NormalizedApiExport[]): NormalizedApiDocument {
  return {
    $schema: API_SCHEMA_URL,
    schemaVersion: API_SCHEMA_VERSION,
    packageName: "@solidiom/fixture",
    entryPoints: ["src/index.ts"],
    exports,
  }
}

describe("checkCoverage (API-004)", () => {
  it("reports no violations for a fully documented, resolved export", () => {
    const doc = document([baseExport({ comment: { tags: [], summary: "Renders the example." } })])
    expect(checkCoverage(doc, "fixture")).toHaveLength(0)
  })

  it("flags an export with no comment summary as undocumented", () => {
    const doc = document([baseExport({ comment: undefined })])
    const violations = checkCoverage(doc, "fixture")
    expect(violations).toEqual([
      { primitive: "fixture", exportName: "Example", kind: "component", reason: "undocumented" },
    ])
  })

  it('flags kind "unknown" as unresolved', () => {
    const doc = document([
      baseExport({ kind: "unknown", comment: { tags: [], summary: "Has a summary." } }),
    ])
    const violations = checkCoverage(doc, "fixture")
    expect(violations).toEqual([
      { primitive: "fixture", exportName: "Example", kind: "unknown", reason: "unresolved" },
    ])
  })

  it('flags a signature return type of "unknown" as unresolved', () => {
    const doc = document([
      baseExport({
        comment: { tags: [], summary: "Documented." },
        signatures: [{ parameters: [], returns: "unknown", typeParameters: [] }],
      }),
    ])
    const violations = checkCoverage(doc, "fixture")
    expect(violations).toEqual([
      { primitive: "fixture", exportName: "Example", kind: "component", reason: "unresolved" },
    ])
  })

  it('flags a prop type of "unknown" as unresolved', () => {
    const doc = document([
      baseExport({
        comment: { tags: [], summary: "Documented." },
        props: [{ name: "value", type: "unknown", optional: false, readonly: false }],
      }),
    ])
    const violations = checkCoverage(doc, "fixture")
    expect(violations).toEqual([
      { primitive: "fixture", exportName: "Example", kind: "component", reason: "unresolved" },
    ])
  })

  it("can report both undocumented and unresolved for the same export", () => {
    const doc = document([baseExport({ kind: "unknown", comment: undefined })])
    const violations = checkCoverage(doc, "fixture")
    expect(violations).toHaveLength(2)
    expect(violations.map((v) => v.reason).sort()).toEqual(["undocumented", "unresolved"])
  })
})

describe("vertical-slice primitives have zero coverage violations (API-004)", () => {
  for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
    it(`${primitive}: every public export is documented and resolved`, () => {
      const artifactPath = join(ARTIFACTS_DIR, `${primitive}.json`)
      const doc = JSON.parse(readFileSync(artifactPath, "utf8")) as NormalizedApiDocument
      const violations = checkCoverage(doc, primitive)
      expect(violations).toEqual([])
    })
  }
})

describe("vertical-slice normalized API snapshots (API-004)", () => {
  for (const primitive of VERTICAL_SLICE_PRIMITIVES) {
    it(`${primitive}: normalized API document matches snapshot`, () => {
      const artifactPath = join(ARTIFACTS_DIR, `${primitive}.json`)
      const doc = JSON.parse(readFileSync(artifactPath, "utf8")) as NormalizedApiDocument
      expect(doc).toMatchSnapshot()
    })
  }
})
