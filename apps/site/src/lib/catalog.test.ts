import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { getApiDocumentResult } from "./catalog"

// Match catalog.ts workspace detection so this test is stable whether Vitest
// runs from the repository root or apps/site.
const workspaceCandidate = resolve(process.cwd(), "../..")
const WORKSPACE_ROOT = existsSync(resolve(workspaceCandidate, "registry/index.json"))
  ? workspaceCandidate
  : process.cwd()
const API_ARTIFACTS_DIR = resolve(WORKSPACE_ROOT, "artifacts/api")
const TEST_PRIMITIVE = "__api-reference-diagnostic-test__"
const artifactPath = join(API_ARTIFACTS_DIR, `${TEST_PRIMITIVE}.json`)

const SCHEMA_URL = "https://solidiom.org/schemas/api/v2.json"

function validDocument(overrides: Record<string, unknown> = {}) {
  return {
    $schema: SCHEMA_URL,
    schemaVersion: 2,
    packageName: "@solidiom/test",
    entryPoints: ["src/index.ts"],
    exports: [],
    ...overrides,
  }
}

describe("getApiDocumentResult (API-003 diagnostics)", () => {
  beforeEach(() => {
    mkdirSync(API_ARTIFACTS_DIR, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(artifactPath)) rmSync(artifactPath)
  })

  it('reports "missing" when no artifact file exists', () => {
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("missing")
    expect(result.document).toBeUndefined()
  })

  it('reports "malformed" for invalid JSON', () => {
    writeFileSync(artifactPath, "{ not valid json")
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("malformed")
    expect(result.document).toBeUndefined()
  })

  it('reports "invalid-shape" for a wrong schema URL', () => {
    writeFileSync(
      artifactPath,
      JSON.stringify(validDocument({ $schema: "https://example.com/wrong" })),
    )
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("invalid-shape")
  })

  it('reports "invalid-shape" for a wrong schema version', () => {
    writeFileSync(artifactPath, JSON.stringify(validDocument({ schemaVersion: 99 })))
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("invalid-shape")
  })

  it('reports "invalid-shape" when required fields are missing', () => {
    writeFileSync(artifactPath, JSON.stringify({ $schema: SCHEMA_URL, schemaVersion: 2 }))
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("invalid-shape")
  })

  it('reports "empty" for a valid document with zero exports', () => {
    writeFileSync(artifactPath, JSON.stringify(validDocument({ exports: [] })))
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("empty")
    expect(result.document).toBeDefined()
    expect(result.document?.exports).toHaveLength(0)
  })

  it('reports "ok" for a valid document with at least one export', () => {
    writeFileSync(
      artifactPath,
      JSON.stringify(
        validDocument({
          exports: [
            {
              name: "Example",
              kind: "component",
              signatures: [],
              props: [],
              inheritance: { extends: [], implements: [] },
            },
          ],
        }),
      ),
    )
    const result = getApiDocumentResult(TEST_PRIMITIVE)
    expect(result.diagnostic).toBe("ok")
    expect(result.document?.exports).toHaveLength(1)
  })
})
