import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { Root, Panel, Trigger, Header, Content, Footer, Rail } from "./index"

describe("Sidebar", () => {
  it("exports all parts", () => {
    expect(Root).toBeDefined()
    expect(Panel).toBeDefined()
    expect(Trigger).toBeDefined()
    expect(Header).toBeDefined()
    expect(Content).toBeDefined()
    expect(Footer).toBeDefined()
    expect(Rail).toBeDefined()
    expect(typeof Root).toBe("function")
    expect(typeof Panel).toBe("function")
    expect(typeof Trigger).toBe("function")
    expect(typeof Header).toBe("function")
    expect(typeof Content).toBe("function")
    expect(typeof Footer).toBe("function")
    expect(typeof Rail).toBe("function")
  })

  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "sidebar", part: "root" })
    expect(attrs["data-scope"]).toBe("sidebar")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for each part", () => {
    const parts = ["root", "panel", "trigger", "header", "content", "footer", "rail"] as const
    for (const part of parts) {
      const attrs = applySemanticAttrs({ scope: "sidebar", part })
      expect(attrs["data-scope"]).toBe("sidebar")
      expect(attrs["data-part"]).toBe(part)
    }
  })

  it("emits state correctly for open sidebar", () => {
    const attrs = applySemanticAttrs({
      scope: "sidebar",
      part: "root",
      state: "open",
      disabled: false,
    })
    expect(attrs["data-state"]).toBe("open")
    expect(attrs["data-disabled"]).toBeUndefined()
  })

  it("emits state correctly for collapsed sidebar", () => {
    const attrs = applySemanticAttrs({
      scope: "sidebar",
      part: "panel",
      state: "collapsed",
      disabled: false,
    })
    expect(attrs["data-state"]).toBe("collapsed")
    expect(attrs["data-disabled"]).toBeUndefined()
  })

  it("emits disabled flag when sidebar is disabled", () => {
    const attrs = applySemanticAttrs({
      scope: "sidebar",
      part: "trigger",
      state: "open",
      disabled: true,
    })
    expect(attrs["data-state"]).toBe("open")
    expect(attrs["data-disabled"]).toBe("")
  })

  it("emits correct attributes for rail part", () => {
    const collapsedAttrs = applySemanticAttrs({
      scope: "sidebar",
      part: "rail",
      state: "collapsed",
      disabled: false,
    })
    expect(collapsedAttrs["data-scope"]).toBe("sidebar")
    expect(collapsedAttrs["data-part"]).toBe("rail")
    expect(collapsedAttrs["data-state"]).toBe("collapsed")

    const openAttrs = applySemanticAttrs({
      scope: "sidebar",
      part: "rail",
      state: "open",
    })
    expect(openAttrs["data-state"]).toBe("open")
  })
})
