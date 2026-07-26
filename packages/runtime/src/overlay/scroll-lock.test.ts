import { describe, it, expect, beforeEach } from "vitest"
import { activateScrollLock, resetScrollLock } from "./scroll-lock"

function createMockDocument() {
  return {
    body: {
      style: { overflow: "", paddingRight: "" },
    },
    documentElement: { clientWidth: 1000 },
  } as unknown as Document
}

describe("activateScrollLock", () => {
  let doc: Document

  beforeEach(() => {
    doc = createMockDocument()
    resetScrollLock()
    // Mock window.innerWidth for scrollbar calculation
    Object.defineProperty(globalThis, "window", {
      value: { innerWidth: 1020 },
      writable: true,
      configurable: true,
    })
  })

  it("sets overflow hidden on body", () => {
    activateScrollLock(doc)
    expect((doc.body as any).style.overflow).toBe("hidden")
  })

  it("compensates for scrollbar width", () => {
    activateScrollLock(doc)
    // 1020 - 1000 = 20px scrollbar
    expect((doc.body as any).style.paddingRight).toBe("20px")
  })

  it("restores original styles on release", () => {
    ;(doc.body as any).style.overflow = "auto"
    ;(doc.body as any).style.paddingRight = "5px"

    const release = activateScrollLock(doc)
    expect((doc.body as any).style.overflow).toBe("hidden")

    release()
    expect((doc.body as any).style.overflow).toBe("auto")
    expect((doc.body as any).style.paddingRight).toBe("5px")
  })

  it("reference-counts multiple activations", () => {
    const release1 = activateScrollLock(doc)
    const release2 = activateScrollLock(doc)

    release1()
    // Still locked — second holder active
    expect((doc.body as any).style.overflow).toBe("hidden")

    release2()
    // Now released
    expect((doc.body as any).style.overflow).toBe("")
  })

  it("release is idempotent", () => {
    const release = activateScrollLock(doc)
    release()
    release() // Second call is no-op
    expect((doc.body as any).style.overflow).toBe("")
  })
})
