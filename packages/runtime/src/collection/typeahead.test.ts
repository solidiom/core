import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createTypeahead } from "./typeahead"
import type { CollectionItem } from "./collection"

const makeItem = (id: string, text: string): CollectionItem => ({
  id,
  disabled: () => false,
  textValue: () => text,
})

const items = [
  makeItem("apple", "Apple"),
  makeItem("banana", "Banana"),
  makeItem("avocado", "Avocado"),
  makeItem("blueberry", "Blueberry"),
  makeItem("cherry", "Cherry"),
]

describe("createTypeahead", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("matches first item by prefix", () => {
    const ta = createTypeahead()
    const match = ta.handle("a", items)
    expect(match?.id).toBe("apple")
  })

  it("accumulates characters for multi-char prefix", () => {
    const ta = createTypeahead()
    ta.handle("a", items)
    const match = ta.handle("v", items, "apple")
    expect(match?.id).toBe("avocado")
  })

  it("wraps search from current item position", () => {
    const ta = createTypeahead()
    // Start from "apple", search "a" — should find "avocado" (next "a" item)
    const match = ta.handle("a", items, "apple")
    expect(match?.id).toBe("avocado")
  })

  it("resets search after timeout", () => {
    const ta = createTypeahead({ timeout: 300 })
    ta.handle("b", items)
    // Advance past timeout
    vi.advanceTimersByTime(400)
    // New search should start fresh
    const match = ta.handle("c", items)
    expect(match?.id).toBe("cherry")
  })

  it("does not reset before timeout", () => {
    const ta = createTypeahead({ timeout: 500 })
    ta.handle("b", items)
    vi.advanceTimersByTime(200)
    // "bl" should match "Blueberry"
    const match = ta.handle("l", items, "banana")
    expect(match?.id).toBe("blueberry")
  })

  it("calls onMatch callback", () => {
    const onMatch = vi.fn()
    const ta = createTypeahead({ onMatch })
    ta.handle("c", items)
    expect(onMatch).toHaveBeenCalledWith(expect.objectContaining({ id: "cherry" }))
  })

  it("handles repeated char cycling", () => {
    const ta = createTypeahead()
    // First "a" matches "apple"
    const first = ta.handle("a", items)
    expect(first?.id).toBe("apple")
    // Second "a" — repeated char, searches for "a" starting after "apple"
    const second = ta.handle("a", items, "apple")
    expect(second?.id).toBe("avocado")
  })

  it("ignores space character", () => {
    const ta = createTypeahead()
    const match = ta.handle(" ", items)
    expect(match).toBeUndefined()
  })

  it("ignores multi-char keys (e.g. Enter, Shift)", () => {
    const ta = createTypeahead()
    expect(ta.handle("Enter", items)).toBeUndefined()
    expect(ta.handle("Shift", items)).toBeUndefined()
  })

  it("suppresses during IME composition", () => {
    const ta = createTypeahead()
    ta.compositionStart()
    expect(ta.handle("a", items)).toBeUndefined()
    ta.compositionEnd()
    expect(ta.handle("a", items)?.id).toBe("apple")
  })

  it("reset clears accumulated search", () => {
    const ta = createTypeahead()
    ta.handle("b", items)
    ta.reset()
    // Fresh search after reset
    const match = ta.handle("a", items)
    expect(match?.id).toBe("apple")
  })

  it("skips disabled items", () => {
    const itemsWithDisabled = [
      makeItem("apple", "Apple"),
      { id: "avocado", disabled: () => true, textValue: () => "Avocado" } as CollectionItem,
      makeItem("apricot", "Apricot"),
    ]
    const ta = createTypeahead()
    const match = ta.handle("a", itemsWithDisabled, "apple")
    expect(match?.id).toBe("apricot")
  })
})
