import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createRovingFocus } from "./roving-focus"
import type { CollectionItem } from "./collection"

const makeItem = (id: string): CollectionItem => ({
  id,
  disabled: () => false,
  textValue: () => id,
})

const enabledItems = [makeItem("a"), makeItem("b"), makeItem("c")]

describe("createRovingFocus", () => {
  it("starts with undefined activeId when no default", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus()
      expect(rf.activeId()).toBeUndefined()
      dispose()
    })
  })

  it("uses defaultActiveId", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus({ defaultActiveId: "b" })
      expect(rf.activeId()).toBe("b")
      dispose()
    })
  })

  it("setActiveId updates internal state (uncontrolled)", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus()
      rf.setActiveId("c")
      flush()
      expect(rf.activeId()).toBe("c")
      dispose()
    })
  })

  it("calls onActiveIdChange on setActiveId", () => {
    createRoot((dispose) => {
      const onChange = vi.fn()
      const rf = createRovingFocus({ onActiveIdChange: onChange })
      rf.setActiveId("b")
      flush()
      expect(onChange).toHaveBeenCalledWith("b")
      dispose()
    })
  })

  it("respects controlled activeId", () => {
    createRoot((dispose) => {
      const [controlled, setControlled] = createSignal<string | undefined>("a", {
        ownedWrite: true,
      })
      const rf = createRovingFocus({ activeId: controlled })
      expect(rf.activeId()).toBe("a")
      rf.setActiveId("b")
      flush()
      // Still "a" — controlled
      expect(rf.activeId()).toBe("a")
      setControlled("b")
      flush()
      expect(rf.activeId()).toBe("b")
      dispose()
    })
  })

  describe("getTabIndex", () => {
    it("returns 0 for active item, -1 for others", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus({ defaultActiveId: "b" })
        expect(rf.getTabIndex("a")).toBe(-1)
        expect(rf.getTabIndex("b")).toBe(0)
        expect(rf.getTabIndex("c")).toBe(-1)
        dispose()
      })
    })

    it("returns -1 for all items in virtual mode", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus({ defaultActiveId: "b", virtual: true })
        expect(rf.getTabIndex("a")).toBe(-1)
        expect(rf.getTabIndex("b")).toBe(-1)
        dispose()
      })
    })
  })

  describe("onFocusIn", () => {
    it("activates first enabled item when no active item", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus()
        rf.onFocusIn(enabledItems)
        flush()
        expect(rf.activeId()).toBe("a")
        dispose()
      })
    })

    it("does not change active item if one already exists", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus({ defaultActiveId: "c" })
        rf.onFocusIn(enabledItems)
        expect(rf.activeId()).toBe("c")
        dispose()
      })
    })
  })
})
