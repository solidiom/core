/**
 * Node-mode unit tests for NavigationMenu primitive.
 *
 * Tests semantic attributes, context isolation, and pointer intent integration.
 */

import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useNavigationMenuContext, useNavigationMenuItemContext } from "./navigation-menu-context"

describe("NavigationMenu", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({
      scope: "navigation-menu",
      part: "root",
      orientation: "horizontal",
    })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("root")
    expect(attrs["data-orientation"]).toBe("horizontal")
  })

  it("emits correct semantic attributes for list", () => {
    const attrs = applySemanticAttrs({
      scope: "navigation-menu",
      part: "list",
      orientation: "horizontal",
    })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("list")
  })

  it("emits correct semantic attributes for item", () => {
    const attrs = applySemanticAttrs({ scope: "navigation-menu", part: "item" })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("item")
  })

  it("emits correct semantic attributes for trigger with state", () => {
    const attrs = applySemanticAttrs({ scope: "navigation-menu", part: "trigger", state: "open" })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("trigger")
    expect(attrs["data-state"]).toBe("open")
  })

  it("emits correct semantic attributes for content", () => {
    const attrs = applySemanticAttrs({ scope: "navigation-menu", part: "content", state: "closed" })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("content")
    expect(attrs["data-state"]).toBe("closed")
  })

  it("emits correct semantic attributes for link", () => {
    const attrs = applySemanticAttrs({ scope: "navigation-menu", part: "link", state: "active" })
    expect(attrs["data-scope"]).toBe("navigation-menu")
    expect(attrs["data-part"]).toBe("link")
    expect(attrs["data-state"]).toBe("active")
  })

  it("throws when useNavigationMenuContext is called outside Root", () => {
    expect(() => useNavigationMenuContext()).toThrow()
  })

  it("throws when useNavigationMenuItemContext is called outside Item", () => {
    expect(() => useNavigationMenuItemContext()).toThrow()
  })
})
