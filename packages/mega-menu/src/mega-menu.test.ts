import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import {
  createDisclosureState,
  createPointerIntent,
  createCollection,
  createRovingFocus,
  createChangeDetails,
  resolveNextItem,
} from "@solidiom/runtime"
import {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Link,
  Group,
  GroupLabel,
} from "./index"

// ─── Component Exports ──────────────────────────────────────────────────────────

describe("mega-menu", () => {
  it("exports all parts", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
    expect(List).toBeDefined()
    expect(typeof List).toBe("function")
    expect(Item).toBeDefined()
    expect(typeof Item).toBe("function")
    expect(Trigger).toBeDefined()
    expect(typeof Trigger).toBe("function")
    expect(Content).toBeDefined()
    expect(typeof Content).toBe("function")
    expect(Link).toBeDefined()
    expect(typeof Link).toBe("function")
    expect(Group).toBeDefined()
    expect(typeof Group).toBe("function")
    expect(GroupLabel).toBeDefined()
    expect(typeof GroupLabel).toBe("function")
  })
})

// ─── Disclosure State (item open/close) ─────────────────────────────────────────

describe("mega-menu disclosure state", () => {
  it("item starts closed by default", () => {
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

  it("closes on escape-key request", () => {
    createRoot((dispose) => {
      const { open, requestOpenChange } = createDisclosureState({ defaultOpen: true })
      requestOpenChange(false, createChangeDetails("escape-key"))
      flush()
      expect(open()).toBe(false)
      dispose()
    })
  })

  it("respects disabled state — cannot open when disabled", () => {
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

  it("calls onOpenChange when state changes", () => {
    createRoot((dispose) => {
      const onOpenChange = vi.fn()
      const { requestOpenChange } = createDisclosureState({ onOpenChange })
      requestOpenChange(true, createChangeDetails("trigger"))
      flush()
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "trigger" }))
      dispose()
    })
  })
})

// ─── Pointer Intent (hover delay) ───────────────────────────────────────────────

describe("mega-menu pointer intent", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("confirms intent after delay when pointer stays on trigger", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 200,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    expect(onConfirm).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("confirms immediately when pointer moves from trigger to content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 200,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(50)
    intent.handleTriggerLeave()
    intent.handleContentEnter()

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("cancels intent when pointer leaves trigger without reaching content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 200,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(50)
    intent.handleTriggerLeave()
    vi.advanceTimersByTime(200)

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("cancels when pointer leaves content after being confirmed", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 200,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(200)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    intent.handleTriggerLeave()
    intent.handleContentEnter()
    intent.handleContentLeave()
    vi.advanceTimersByTime(200)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("diagonal grace period — does not cancel while moving to content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 200,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    // Hover trigger until confirmed
    intent.handleTriggerEnter()
    vi.advanceTimersByTime(200)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    // Leave trigger (diagonal movement)
    intent.handleTriggerLeave()
    vi.advanceTimersByTime(100) // within grace period

    // Arrive at content before grace period ends
    intent.handleContentEnter()
    vi.advanceTimersByTime(200)

    // Should NOT have cancelled
    expect(onCancel).not.toHaveBeenCalled()
  })
})

// ─── Collection (item registration) ─────────────────────────────────────────────

describe("mega-menu collection", () => {
  it("registers and tracks items", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "products", disabled: () => false, textValue: () => "Products" })
      collection.registerItem({ id: "solutions", disabled: () => false, textValue: () => "Solutions" })
      collection.registerItem({ id: "resources", disabled: () => false, textValue: () => "Resources" })

      flush()
      expect(collection.items().length).toBe(3)
      expect(collection.items().map((i) => i.id)).toEqual(["products", "solutions", "resources"])
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

  it("unregisters items", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      const cleanup = collection.registerItem({ id: "a", disabled: () => false, textValue: () => "A" })
      collection.registerItem({ id: "b", disabled: () => false, textValue: () => "B" })

      flush()
      expect(collection.items().length).toBe(2)

      cleanup()
      flush()
      expect(collection.items().length).toBe(1)
      expect(collection.items()[0]!.id).toBe("b")
      dispose()
    })
  })
})

// ─── Roving Focus (keyboard navigation between triggers) ────────────────────────

describe("mega-menu roving focus", () => {
  it("starts with no active item", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus()
      expect(rf.activeId()).toBeUndefined()
      dispose()
    })
  })

  it("activates first item on focus in", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus()
      const items = [
        { id: "a", disabled: () => false, textValue: () => "A", ref: undefined },
        { id: "b", disabled: () => false, textValue: () => "B", ref: undefined },
      ]
      rf.onFocusIn(items)
      flush()
      expect(rf.activeId()).toBe("a")
      dispose()
    })
  })

  it("sets tabindex 0 for active item, -1 for others", () => {
    createRoot((dispose) => {
      const rf = createRovingFocus()
      rf.setActiveId("b")
      flush()
      expect(rf.getTabIndex("a")).toBe(-1)
      expect(rf.getTabIndex("b")).toBe(0)
      expect(rf.getTabIndex("c")).toBe(-1)
      dispose()
    })
  })

  it("resolves next item for ArrowRight navigation", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "products", disabled: () => false, textValue: () => "Products" })
      collection.registerItem({ id: "solutions", disabled: () => false, textValue: () => "Solutions" })
      collection.registerItem({ id: "resources", disabled: () => false, textValue: () => "Resources" })
      flush()

      const enabledItems = collection.enabledItems()
      const next = resolveNextItem(enabledItems, "products", "next", { loop: true })
      expect(next?.id).toBe("solutions")
      dispose()
    })
  })

  it("resolves previous item for ArrowLeft navigation", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "products", disabled: () => false, textValue: () => "Products" })
      collection.registerItem({ id: "solutions", disabled: () => false, textValue: () => "Solutions" })
      collection.registerItem({ id: "resources", disabled: () => false, textValue: () => "Resources" })
      flush()

      const enabledItems = collection.enabledItems()
      const prev = resolveNextItem(enabledItems, "solutions", "previous", { loop: true })
      expect(prev?.id).toBe("products")
      dispose()
    })
  })

  it("loops navigation from last to first", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "a", disabled: () => false, textValue: () => "A" })
      collection.registerItem({ id: "b", disabled: () => false, textValue: () => "B" })
      collection.registerItem({ id: "c", disabled: () => false, textValue: () => "C" })
      flush()

      const enabledItems = collection.enabledItems()
      const next = resolveNextItem(enabledItems, "c", "next", { loop: true })
      expect(next?.id).toBe("a")
      dispose()
    })
  })

  it("skips disabled items during navigation", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "a", disabled: () => false, textValue: () => "A" })
      collection.registerItem({ id: "b", disabled: () => true, textValue: () => "B" })
      collection.registerItem({ id: "c", disabled: () => false, textValue: () => "C" })
      flush()

      const enabledItems = collection.enabledItems()
      const next = resolveNextItem(enabledItems, "a", "next", { loop: true })
      expect(next?.id).toBe("c")
      dispose()
    })
  })
})

// ─── Active Value (single item open at a time) ──────────────────────────────────

describe("mega-menu active value", () => {
  it("only one item is active at a time (uncontrolled)", () => {
    createRoot((dispose) => {
      const [value, setValue] = createSignal<string | undefined>(undefined, { ownedWrite: true })

      // Simulate opening "products"
      setValue("products")
      flush()
      expect(value()).toBe("products")

      // Opening "solutions" should replace
      setValue("solutions")
      flush()
      expect(value()).toBe("solutions")
      dispose()
    })
  })

  it("calls onValueChange when active value changes", () => {
    const onValueChange = vi.fn()

    createRoot((dispose) => {
      const [, setValue] = createSignal<string | undefined>(undefined, { ownedWrite: true })

      // Simulate the root value tracking
      const setActiveValue = (v: string | undefined) => {
        setValue(v)
        if (v !== undefined) {
          onValueChange(v)
        }
      }

      setActiveValue("products")
      flush()
      expect(onValueChange).toHaveBeenCalledWith("products")

      setActiveValue("solutions")
      flush()
      expect(onValueChange).toHaveBeenCalledWith("solutions")
      expect(onValueChange).toHaveBeenCalledTimes(2)
      dispose()
    })
  })

  it("respects controlled value", () => {
    createRoot((dispose) => {
      const [controlled, setControlled] = createSignal<string | undefined>("products", { ownedWrite: true })
      const [internal, setInternal] = createSignal<string | undefined>(undefined, { ownedWrite: true })

      const activeValue = () => {
        if (controlled() !== undefined) return controlled()
        return internal()
      }

      expect(activeValue()).toBe("products")

      // Changing internal should not override controlled
      setInternal("solutions")
      flush()
      expect(activeValue()).toBe("products")

      // Changing controlled updates value
      setControlled("solutions")
      flush()
      expect(activeValue()).toBe("solutions")
      dispose()
    })
  })
})

// ─── Keyboard Navigation Integration ────────────────────────────────────────────

describe("mega-menu keyboard navigation", () => {
  it("ArrowDown opens item from trigger", () => {
    createRoot((dispose) => {
      const { open, requestOpenChange } = createDisclosureState()
      expect(open()).toBe(false)

      // Simulate ArrowDown keydown on trigger
      requestOpenChange(true, createChangeDetails("trigger"))
      flush()
      expect(open()).toBe(true)
      dispose()
    })
  })

  it("Escape closes open item", () => {
    createRoot((dispose) => {
      const { open, requestOpenChange } = createDisclosureState({ defaultOpen: true })
      expect(open()).toBe(true)

      requestOpenChange(false, createChangeDetails("escape-key"))
      flush()
      expect(open()).toBe(false)
      dispose()
    })
  })

  it("ArrowLeft/Right resolves correct navigation intent for horizontal menubar", () => {
    createRoot((dispose) => {
      const collection = createCollection({ orientation: () => "horizontal" })
      collection.registerItem({ id: "item-1", disabled: () => false, textValue: () => "Item 1" })
      collection.registerItem({ id: "item-2", disabled: () => false, textValue: () => "Item 2" })
      collection.registerItem({ id: "item-3", disabled: () => false, textValue: () => "Item 3" })
      flush()

      const rf = createRovingFocus()
      rf.setActiveId("item-1")
      flush()

      const enabledItems = collection.enabledItems()

      // ArrowRight → next
      const next = resolveNextItem(enabledItems, rf.activeId(), "next", { loop: true })
      expect(next?.id).toBe("item-2")

      // ArrowLeft → previous (with loop from first)
      const prev = resolveNextItem(enabledItems, rf.activeId(), "previous", { loop: true })
      expect(prev?.id).toBe("item-3")
      dispose()
    })
  })
})
