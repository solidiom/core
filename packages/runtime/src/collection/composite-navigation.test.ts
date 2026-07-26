import { describe, it, expect } from "vitest"
import { resolveNavigationIntent, resolveNextItem } from "./composite-navigation"
import type { CollectionItem } from "./collection"

const makeItem = (id: string): CollectionItem => ({
  id,
  disabled: () => false,
  textValue: () => id,
})

const items = [makeItem("a"), makeItem("b"), makeItem("c"), makeItem("d"), makeItem("e")]

describe("resolveNavigationIntent", () => {
  const vertical = { orientation: "vertical" as const, direction: "ltr" as const }
  const horizontal = { orientation: "horizontal" as const, direction: "ltr" as const }
  const rtl = { orientation: "horizontal" as const, direction: "rtl" as const }

  it("maps Home/End/PageUp/PageDown regardless of orientation", () => {
    expect(resolveNavigationIntent("Home", vertical)).toBe("first")
    expect(resolveNavigationIntent("End", vertical)).toBe("last")
    expect(resolveNavigationIntent("PageUp", vertical)).toBe("pageUp")
    expect(resolveNavigationIntent("PageDown", vertical)).toBe("pageDown")
  })

  it("maps ArrowDown/ArrowUp for vertical", () => {
    expect(resolveNavigationIntent("ArrowDown", vertical)).toBe("next")
    expect(resolveNavigationIntent("ArrowUp", vertical)).toBe("previous")
  })

  it("ignores ArrowLeft/ArrowRight for vertical-only", () => {
    expect(resolveNavigationIntent("ArrowLeft", vertical)).toBeUndefined()
    expect(resolveNavigationIntent("ArrowRight", vertical)).toBeUndefined()
  })

  it("maps ArrowRight/ArrowLeft for horizontal LTR", () => {
    expect(resolveNavigationIntent("ArrowRight", horizontal)).toBe("next")
    expect(resolveNavigationIntent("ArrowLeft", horizontal)).toBe("previous")
  })

  it("flips ArrowRight/ArrowLeft for horizontal RTL", () => {
    expect(resolveNavigationIntent("ArrowRight", rtl)).toBe("previous")
    expect(resolveNavigationIntent("ArrowLeft", rtl)).toBe("next")
  })

  it("returns undefined for non-navigation keys", () => {
    expect(resolveNavigationIntent("Enter", vertical)).toBeUndefined()
    expect(resolveNavigationIntent("a", vertical)).toBeUndefined()
  })
})

describe("resolveNextItem", () => {
  it("returns first item for 'first' intent", () => {
    expect(resolveNextItem(items, "c", "first")?.id).toBe("a")
  })

  it("returns last item for 'last' intent", () => {
    expect(resolveNextItem(items, "c", "last")?.id).toBe("e")
  })

  it("returns next item for 'next' intent", () => {
    expect(resolveNextItem(items, "b", "next")?.id).toBe("c")
  })

  it("returns previous item for 'previous' intent", () => {
    expect(resolveNextItem(items, "c", "previous")?.id).toBe("b")
  })

  it("returns undefined at boundary without loop", () => {
    expect(resolveNextItem(items, "e", "next")).toBeUndefined()
    expect(resolveNextItem(items, "a", "previous")).toBeUndefined()
  })

  it("wraps around with loop enabled", () => {
    expect(resolveNextItem(items, "e", "next", { loop: true })?.id).toBe("a")
    expect(resolveNextItem(items, "a", "previous", { loop: true })?.id).toBe("e")
  })

  it("handles pageDown with default page size", () => {
    expect(resolveNextItem(items, "a", "pageDown")?.id).toBe("e") // 0+5 clamped to 4
  })

  it("handles pageUp with default page size", () => {
    expect(resolveNextItem(items, "e", "pageUp")?.id).toBe("a") // 4-5 clamped to 0
  })

  it("handles pageDown with custom page size", () => {
    expect(resolveNextItem(items, "a", "pageDown", { pageSize: 2 })?.id).toBe("c")
  })

  it("returns first item when currentId is undefined for 'next'", () => {
    expect(resolveNextItem(items, undefined, "next")?.id).toBe("a")
  })

  it("returns last item when currentId is undefined for 'previous'", () => {
    expect(resolveNextItem(items, undefined, "previous")?.id).toBe("e")
  })

  it("returns undefined for empty items", () => {
    expect(resolveNextItem([], "a", "next")).toBeUndefined()
  })
})
