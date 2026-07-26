import { describe, it, expect } from "vitest"
import { createRoot, flush } from "solid-js"
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createTypeahead,
  createChangeDetails,
  resolveNavigationIntent,
  resolveNextItem,
  getHiddenInputProps,
} from "@solidiom/runtime"

describe("Select state logic", () => {
  describe("disclosure (open/close)", () => {
    it("starts closed by default", () => {
      createRoot((dispose) => {
        const { open } = createDisclosureState()
        expect(open()).toBe(false)
        dispose()
      })
    })

    it("opens on trigger", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState()
        requestOpenChange(true, createChangeDetails("trigger"))
        flush()
        expect(open()).toBe(true)
        dispose()
      })
    })
  })

  describe("value (single selection)", () => {
    it("selects a value", () => {
      createRoot((dispose) => {
        const { value, requestChange } = createControllableValue<string, "item-click">({
          defaultValue: "",
        })
        requestChange("apple", createChangeDetails("item-click"))
        flush()
        expect(value()).toBe("apple")
        dispose()
      })
    })
  })

  describe("value (multiple selection)", () => {
    it("toggles values in array", () => {
      createRoot((dispose) => {
        const { value, requestChange } = createControllableValue<string[], "item-click">({
          defaultValue: [],
          equals: false,
        })
        requestChange(["apple"], createChangeDetails("item-click"))
        flush()
        expect(value()).toEqual(["apple"])
        requestChange(["apple", "banana"], createChangeDetails("item-click"))
        flush()
        expect(value()).toEqual(["apple", "banana"])
        requestChange(["banana"], createChangeDetails("item-click"))
        flush()
        expect(value()).toEqual(["banana"])
        dispose()
      })
    })
  })

  describe("collection + navigation", () => {
    it("resolves next item on ArrowDown", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => false, textValue: () => "Banana" })
        collection.registerItem({ id: "c", disabled: () => false, textValue: () => "Cherry" })
        flush()

        const intent = resolveNavigationIntent("ArrowDown", {
          orientation: "vertical",
          direction: "ltr",
        })
        expect(intent).toBe("next")

        const next = resolveNextItem(collection.enabledItems(), "a", "next", { loop: true })
        expect(next?.id).toBe("b")
        dispose()
      })
    })

    it("skips disabled items", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => true, textValue: () => "Banana" })
        collection.registerItem({ id: "c", disabled: () => false, textValue: () => "Cherry" })
        flush()

        const next = resolveNextItem(collection.enabledItems(), "a", "next")
        expect(next?.id).toBe("c")
        dispose()
      })
    })
  })

  describe("typeahead", () => {
    it("matches item by character", () => {
      const typeahead = createTypeahead()
      const items = [
        { id: "a", disabled: () => false, textValue: () => "Apple" },
        { id: "b", disabled: () => false, textValue: () => "Banana" },
      ]
      const match = typeahead.handle("b", items)
      expect(match?.id).toBe("b")
    })
  })

  describe("hidden input", () => {
    it("generates hidden input props for form submission", () => {
      const props = getHiddenInputProps({
        name: "fruit",
        value: () => "apple",
      })
      expect(props[0]!.name).toBe("fruit")
      expect(props[0]!.value).toBe("apple")
      expect(props[0]!.type).toBe("hidden")
    })

    it("generates multiple inputs for multi-select", () => {
      const props = getHiddenInputProps({
        name: "fruits",
        value: () => ["apple", "banana"],
      })
      expect(props).toHaveLength(2)
    })
  })
})
