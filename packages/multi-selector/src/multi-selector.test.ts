import { describe, it, expect } from "vitest"
import { createRoot, flush } from "solid-js"
import {
  createDisclosureState,
  createCollection,
  createSelection,
  createRovingFocus,
  createChangeDetails,
  resolveNavigationIntent,
  resolveNextItem,
  getHiddenInputProps,
} from "@solidiom/runtime"
import {
  Root,
  Trigger,
  TagList,
  Tag,
  TagRemove,
  Content,
  Item,
  ItemIndicator,
  SearchInput,
} from "./index"

describe("multi-selector", () => {
  describe("exports", () => {
    it("exports Root component", () => {
      expect(Root).toBeDefined()
      expect(typeof Root).toBe("function")
    })

    it("exports Trigger component", () => {
      expect(Trigger).toBeDefined()
      expect(typeof Trigger).toBe("function")
    })

    it("exports TagList component", () => {
      expect(TagList).toBeDefined()
      expect(typeof TagList).toBe("function")
    })

    it("exports Tag component", () => {
      expect(Tag).toBeDefined()
      expect(typeof Tag).toBe("function")
    })

    it("exports TagRemove component", () => {
      expect(TagRemove).toBeDefined()
      expect(typeof TagRemove).toBe("function")
    })

    it("exports Content component", () => {
      expect(Content).toBeDefined()
      expect(typeof Content).toBe("function")
    })

    it("exports Item component", () => {
      expect(Item).toBeDefined()
      expect(typeof Item).toBe("function")
    })

    it("exports ItemIndicator component", () => {
      expect(ItemIndicator).toBeDefined()
      expect(typeof ItemIndicator).toBe("function")
    })

    it("exports SearchInput component", () => {
      expect(SearchInput).toBeDefined()
      expect(typeof SearchInput).toBe("function")
    })
  })

  describe("disclosure (open/close)", () => {
    it("starts closed by default", () => {
      createRoot((dispose) => {
        const { open } = createDisclosureState()
        expect(open()).toBe(false)
        dispose()
      })
    })

    it("opens on trigger request", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState()
        requestOpenChange(true, createChangeDetails("trigger"))
        flush()
        expect(open()).toBe(true)
        dispose()
      })
    })

    it("closes on escape-key reason", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState({ defaultOpen: true })
        expect(open()).toBe(true)
        requestOpenChange(false, createChangeDetails("escape-key"))
        flush()
        expect(open()).toBe(false)
        dispose()
      })
    })

    it("respects disabled state", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState({
          disabled: () => true,
        })
        requestOpenChange(true, createChangeDetails("trigger"))
        flush()
        expect(open()).toBe(false)
        dispose()
      })
    })
  })

  describe("selection (multiple mode)", () => {
    it("toggles individual values", () => {
      createRoot((dispose) => {
        const selection = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
          allowEmpty: true,
        })

        selection.toggle("apple")
        flush()
        expect(selection.isSelected("apple")).toBe(true)

        selection.toggle("banana")
        flush()
        expect(selection.isSelected("apple")).toBe(true)
        expect(selection.isSelected("banana")).toBe(true)

        selection.toggle("apple")
        flush()
        expect(selection.isSelected("apple")).toBe(false)
        expect(selection.isSelected("banana")).toBe(true)
        dispose()
      })
    })

    it("supports controlled selected keys", () => {
      createRoot((dispose) => {
        const changes: Set<string>[] = []
        const selection = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
          selectedKeys: () => new Set(["apple"]),
          onSelectionChange: (keys) => changes.push(keys),
        })

        expect(selection.isSelected("apple")).toBe(true)
        expect(selection.isSelected("banana")).toBe(false)

        selection.toggle("banana")
        flush()
        expect(changes.length).toBe(1)
        expect(changes[0]!.has("apple")).toBe(true)
        expect(changes[0]!.has("banana")).toBe(true)
        dispose()
      })
    })

    it("allows empty selection by default", () => {
      createRoot((dispose) => {
        const selection = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
          defaultSelectedKeys: new Set(["apple"]),
          allowEmpty: true,
        })

        selection.toggle("apple")
        flush()
        expect(selection.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("deselects all", () => {
      createRoot((dispose) => {
        const selection = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
          defaultSelectedKeys: new Set(["apple", "banana"]),
        })

        expect(selection.selectedKeys().size).toBe(2)
        selection.deselectAll()
        flush()
        expect(selection.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("selects all provided keys", () => {
      createRoot((dispose) => {
        const selection = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
        })

        selection.selectAll(["apple", "banana", "cherry"])
        flush()
        expect(selection.selectedKeys().size).toBe(3)
        dispose()
      })
    })
  })

  describe("collection + navigation", () => {
    it("resolves next item on ArrowDown (vertical orientation)", () => {
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

    it("resolves previous item on ArrowUp", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => false, textValue: () => "Banana" })
        collection.registerItem({ id: "c", disabled: () => false, textValue: () => "Cherry" })
        flush()

        const intent = resolveNavigationIntent("ArrowUp", {
          orientation: "vertical",
          direction: "ltr",
        })
        expect(intent).toBe("previous")

        const prev = resolveNextItem(collection.enabledItems(), "c", "previous", { loop: true })
        expect(prev?.id).toBe("b")
        dispose()
      })
    })

    it("skips disabled items during navigation", () => {
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

    it("loops from last to first with loop option", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => false, textValue: () => "Banana" })
        flush()

        const next = resolveNextItem(collection.enabledItems(), "b", "next", { loop: true })
        expect(next?.id).toBe("a")
        dispose()
      })
    })
  })

  describe("roving focus", () => {
    it("tracks active item id", () => {
      createRoot((dispose) => {
        const rovingFocus = createRovingFocus()
        expect(rovingFocus.activeId()).toBeUndefined()

        rovingFocus.setActiveId("item-1")
        flush()
        expect(rovingFocus.activeId()).toBe("item-1")
        dispose()
      })
    })

    it("returns correct tabindex for active vs inactive items", () => {
      createRoot((dispose) => {
        const rovingFocus = createRovingFocus()
        rovingFocus.setActiveId("item-1")
        flush()

        expect(rovingFocus.getTabIndex("item-1")).toBe(0)
        expect(rovingFocus.getTabIndex("item-2")).toBe(-1)
        dispose()
      })
    })

    it("activates first enabled item on focus in", () => {
      createRoot((dispose) => {
        const rovingFocus = createRovingFocus()
        const items = [
          { id: "a", disabled: () => false, textValue: () => "Apple", ref: undefined },
          { id: "b", disabled: () => false, textValue: () => "Banana", ref: undefined },
        ]

        rovingFocus.onFocusIn(items)
        flush()
        expect(rovingFocus.activeId()).toBe("a")
        dispose()
      })
    })
  })

  describe("hidden input (form participation)", () => {
    it("generates hidden input props for single value", () => {
      const props = getHiddenInputProps({
        name: "fruits",
        value: () => ["apple"],
      })
      expect(props).toHaveLength(1)
      expect(props[0]!.name).toBe("fruits")
      expect(props[0]!.value).toBe("apple")
      expect(props[0]!.type).toBe("hidden")
      expect(props[0]!["aria-hidden"]).toBe("true")
    })

    it("generates multiple hidden inputs for multi-select", () => {
      const props = getHiddenInputProps({
        name: "fruits",
        value: () => ["apple", "banana", "cherry"],
      })
      expect(props).toHaveLength(3)
      expect(props[0]!.value).toBe("apple")
      expect(props[1]!.value).toBe("banana")
      expect(props[2]!.value).toBe("cherry")
    })

    it("generates empty array when no values selected", () => {
      const props = getHiddenInputProps({
        name: "fruits",
        value: () => [],
      })
      expect(props).toHaveLength(0)
    })

    it("respects disabled and required flags", () => {
      const props = getHiddenInputProps({
        name: "fruits",
        value: () => ["apple"],
        disabled: () => true,
        required: () => true,
      })
      expect(props[0]!.disabled).toBe(true)
      expect(props[0]!.required).toBe(true)
    })
  })

  describe("search filtering logic", () => {
    it("collection enables text value lookup for filtering", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => false, textValue: () => "Banana" })
        collection.registerItem({ id: "c", disabled: () => false, textValue: () => "Cherry" })
        flush()

        const items = collection.items()
        const searchTerm = "ban"
        const filtered = items.filter((item) =>
          item.textValue().toLowerCase().includes(searchTerm.toLowerCase()),
        )
        expect(filtered).toHaveLength(1)
        expect(filtered[0]!.id).toBe("b")
        dispose()
      })
    })

    it("empty search term matches all items", () => {
      createRoot((dispose) => {
        const collection = createCollection()
        collection.registerItem({ id: "a", disabled: () => false, textValue: () => "Apple" })
        collection.registerItem({ id: "b", disabled: () => false, textValue: () => "Banana" })
        flush()

        const items = collection.items()
        const searchTerm: string = ""
        const filtered = items.filter((item) => {
          if (!searchTerm) return true
          return item.textValue().toLowerCase().includes(searchTerm.toLowerCase())
        })
        expect(filtered).toHaveLength(2)
        dispose()
      })
    })
  })
})
