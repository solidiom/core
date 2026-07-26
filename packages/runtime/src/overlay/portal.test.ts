import { describe, it, expect } from "vitest"
import { resolvePortalTarget } from "./portal"

describe("resolvePortalTarget", () => {
  it("returns explicit target when provided", () => {
    const target = {} as Element
    expect(resolvePortalTarget({ target })).toBe(target)
  })

  it("returns undefined when target is null and no document", () => {
    expect(resolvePortalTarget({ target: null, document: undefined as any })).toBeUndefined()
  })

  it("resolves selector from provided document", () => {
    const resolved = { id: "portal" } as unknown as Element
    const doc = {
      querySelector: (sel: string) => (sel === "#portal" ? resolved : null),
      body: { id: "body" },
    } as unknown as Document

    expect(resolvePortalTarget({ selector: "#portal", document: doc })).toBe(resolved)
  })

  it("falls back to document.body when selector does not match", () => {
    const body = { id: "body" } as unknown as Element
    const doc = {
      querySelector: () => null,
      body,
    } as unknown as Document

    expect(resolvePortalTarget({ selector: "#missing", document: doc })).toBe(body)
  })

  it("falls back to document.body with no options", () => {
    const body = { id: "body" } as unknown as Element
    const doc = { body } as unknown as Document
    expect(resolvePortalTarget({ document: doc })).toBe(body)
  })

  it("returns undefined during SSR (no document global)", () => {
    // Simulate SSR: no global document and no provided document
    const originalDoc = globalThis.document
    // @ts-expect-error — intentional for SSR simulation
    delete globalThis.document
    try {
      expect(resolvePortalTarget({})).toBeUndefined()
    } finally {
      globalThis.document = originalDoc
    }
  })
})
