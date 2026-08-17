import { describe, it, expect } from "vitest"
import { createRoot, flush } from "solid-js"
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
} from "@solidiom/runtime"
import { Root, Item, Indicator } from "./index"

describe("segmented-control", () => {
  describe("exports", () => {
    it("exports Root component", () => {
      expect(Root).toBeDefined()
      expect(typeof Root).toBe("function")
    })

    it("exports Item component", () => {
      expect(Item).toBeDefined()
      expect(typeof Item).toBe("function")
    })

    it("exports Indicator component", () => {
      expect(Indicator).toBeDefined()
      expect(typeof Indicator).toBe("function")
    })
  })

  describe("semantic attributes", () => {
    it("emits correct semantic attributes for root", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "root",
        orientation: "horizontal",
      })
      expect(attrs["data-scope"]).toBe("segmented-control")
      expect(attrs["data-part"]).toBe("root")
      expect(attrs["data-orientation"]).toBe("horizontal")
    })

    it("emits correct semantic attributes for item (active)", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "item",
        state: "active",
      })
      expect(attrs["data-scope"]).toBe("segmented-control")
      expect(attrs["data-part"]).toBe("item")
      expect(attrs["data-state"]).toBe("active")
    })

    it("emits correct semantic attributes for item (inactive)", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "item",
        state: "inactive",
      })
      expect(attrs["data-state"]).toBe("inactive")
    })

    it("emits disabled attribute when item is disabled", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "item",
        state: "inactive",
        disabled: true,
      })
      expect(attrs["data-disabled"]).toBe("")
    })

    it("emits correct semantic attributes for indicator", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "indicator",
        state: "active",
        orientation: "horizontal",
      })
      expect(attrs["data-scope"]).toBe("segmented-control")
      expect(attrs["data-part"]).toBe("indicator")
      expect(attrs["data-state"]).toBe("active")
      expect(attrs["data-orientation"]).toBe("horizontal")
    })

    it("supports vertical orientation", () => {
      const attrs = applySemanticAttrs({
        scope: "segmented-control",
        part: "root",
        orientation: "vertical",
      })
      expect(attrs["data-orientation"]).toBe("vertical")
    })
  })

  describe("controllable value (single selection)", () => {
    it("starts with defaultValue", () => {
      createRoot((dispose) => {
        const { value } = createControllableValue<string, "item-click">({
          defaultValue: "tab1",
          onChange: () => {},
        })
        expect(value()).toBe("tab1")
        dispose()
      })
    })

    it("updates on requestChange (uncontrolled)", () => {
      createRoot((dispose) => {
        const { value, requestChange } = createControllableValue<string, "item-click">({
          defaultValue: "tab1",
          onChange: () => {},
        })
        requestChange("tab2", createChangeDetails("item-click"))
        flush()
        expect(value()).toBe("tab2")
        dispose()
      })
    })

    it("calls onChange on value change", () => {
      createRoot((dispose) => {
        let called = ""
        const { requestChange } = createControllableValue<string, "item-click">({
          defaultValue: "tab1",
          onChange: (next) => {
            called = next
          },
        })
        requestChange("tab2", createChangeDetails("item-click"))
        expect(called).toBe("tab2")
        dispose()
      })
    })

    it("does not update when value equals current (equality check)", () => {
      createRoot((dispose) => {
        let callCount = 0
        const { requestChange } = createControllableValue<string, "item-click">({
          defaultValue: "tab1",
          onChange: () => {
            callCount++
          },
        })
        requestChange("tab1", createChangeDetails("item-click"))
        expect(callCount).toBe(0)
        dispose()
      })
    })

    it("respects disabled guard", () => {
      createRoot((dispose) => {
        const { value, requestChange } = createControllableValue<string, "item-click">({
          defaultValue: "tab1",
          onChange: () => {},
          disabled: () => true,
        })
        requestChange("tab2", createChangeDetails("item-click"))
        flush()
        expect(value()).toBe("tab1")
        dispose()
      })
    })
  })

  describe("collection", () => {
    it("registers and unregisters items", () => {
      createRoot((dispose) => {
        const collection = createCollection({ orientation: () => "horizontal" })
        const cleanup1 = collection.registerItem({
          id: "a",
          disabled: () => false,
          textValue: () => "A",
        })
        const cleanup2 = collection.registerItem({
          id: "b",
          disabled: () => false,
          textValue: () => "B",
        })
        flush()
        expect(collection.items().length).toBe(2)
        cleanup1()
        flush()
        expect(collection.items().length).toBe(1)
        expect(collection.items()[0]!.id).toBe("b")
        cleanup2()
        flush()
        expect(collection.items().length).toBe(0)
        dispose()
      })
    })

    it("filters out disabled items in enabledItems", () => {
      createRoot((dispose) => {
        const collection = createCollection({ orientation: () => "horizontal" })
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "A" })
        collection.registerItem({ id: "b", disabled: () => true, textValue: () => "B" })
        collection.registerItem({ id: "c", disabled: () => false, textValue: () => "C" })
        flush()
        expect(collection.enabledItems().length).toBe(2)
        expect(collection.enabledItems().map((i) => i.id)).toEqual(["a", "c"])
        dispose()
      })
    })

    it("respects horizontal orientation", () => {
      createRoot((dispose) => {
        const collection = createCollection({ orientation: () => "horizontal" })
        expect(collection.orientation()).toBe("horizontal")
        dispose()
      })
    })
  })

  describe("roving focus", () => {
    it("starts with undefined activeId when no default", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus()
        expect(rf.activeId()).toBeUndefined()
        dispose()
      })
    })

    it("uses defaultActiveId", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus({ defaultActiveId: "tab2" })
        expect(rf.activeId()).toBe("tab2")
        dispose()
      })
    })

    it("returns tabIndex 0 for active item and -1 for others", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus({ defaultActiveId: "tab1" })
        expect(rf.getTabIndex("tab1")).toBe(0)
        expect(rf.getTabIndex("tab2")).toBe(-1)
        expect(rf.getTabIndex("tab3")).toBe(-1)
        dispose()
      })
    })

    it("updates activeId on setActiveId", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus()
        rf.setActiveId("tab2")
        flush()
        expect(rf.activeId()).toBe("tab2")
        expect(rf.getTabIndex("tab2")).toBe(0)
        expect(rf.getTabIndex("tab1")).toBe(-1)
        dispose()
      })
    })

    it("activates first item on focusIn when no active item", () => {
      createRoot((dispose) => {
        const rf = createRovingFocus()
        const items = [
          { id: "a", disabled: () => false, textValue: () => "A" },
          { id: "b", disabled: () => false, textValue: () => "B" },
        ]
        rf.onFocusIn(items)
        flush()
        expect(rf.activeId()).toBe("a")
        dispose()
      })
    })
  })

  describe("keyboard navigation", () => {
    it("resolves ArrowRight as next in horizontal orientation", () => {
      const intent = resolveNavigationIntent("ArrowRight", {
        orientation: "horizontal",
        direction: "ltr",
      })
      expect(intent).toBe("next")
    })

    it("resolves ArrowLeft as previous in horizontal orientation", () => {
      const intent = resolveNavigationIntent("ArrowLeft", {
        orientation: "horizontal",
        direction: "ltr",
      })
      expect(intent).toBe("previous")
    })

    it("resolves ArrowDown as next in vertical orientation", () => {
      const intent = resolveNavigationIntent("ArrowDown", {
        orientation: "vertical",
        direction: "ltr",
      })
      expect(intent).toBe("next")
    })

    it("resolves ArrowUp as previous in vertical orientation", () => {
      const intent = resolveNavigationIntent("ArrowUp", {
        orientation: "vertical",
        direction: "ltr",
      })
      expect(intent).toBe("previous")
    })

    it("does not resolve ArrowDown in horizontal mode", () => {
      const intent = resolveNavigationIntent("ArrowDown", {
        orientation: "horizontal",
        direction: "ltr",
      })
      expect(intent).toBeUndefined()
    })

    it("resolves Home as first", () => {
      const intent = resolveNavigationIntent("Home", {
        orientation: "horizontal",
        direction: "ltr",
      })
      expect(intent).toBe("first")
    })

    it("resolves End as last", () => {
      const intent = resolveNavigationIntent("End", {
        orientation: "horizontal",
        direction: "ltr",
      })
      expect(intent).toBe("last")
    })

    it("resolves next item with loop", () => {
      const items = [
        { id: "a", disabled: () => false, textValue: () => "A" },
        { id: "b", disabled: () => false, textValue: () => "B" },
        { id: "c", disabled: () => false, textValue: () => "C" },
      ]
      const next = resolveNextItem(items, "c", "next", { loop: true })
      expect(next?.id).toBe("a")
    })

    it("returns undefined at boundary without loop", () => {
      const items = [
        { id: "a", disabled: () => false, textValue: () => "A" },
        { id: "b", disabled: () => false, textValue: () => "B" },
      ]
      const next = resolveNextItem(items, "b", "next", { loop: false })
      expect(next).toBeUndefined()
    })

    it("resolves previous item with loop", () => {
      const items = [
        { id: "a", disabled: () => false, textValue: () => "A" },
        { id: "b", disabled: () => false, textValue: () => "B" },
        { id: "c", disabled: () => false, textValue: () => "C" },
      ]
      const prev = resolveNextItem(items, "a", "previous", { loop: true })
      expect(prev?.id).toBe("c")
    })

    it("resolves first and last intents", () => {
      const items = [
        { id: "a", disabled: () => false, textValue: () => "A" },
        { id: "b", disabled: () => false, textValue: () => "B" },
        { id: "c", disabled: () => false, textValue: () => "C" },
      ]
      expect(resolveNextItem(items, "b", "first")?.id).toBe("a")
      expect(resolveNextItem(items, "b", "last")?.id).toBe("c")
    })
  })
})
