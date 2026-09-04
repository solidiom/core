import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createCollection, type CollectionItem } from "./collection"

const makeItem = (
  id: string,
  opts: { disabled?: boolean; text?: string } = {},
): CollectionItem => ({
  id,
  disabled: () => opts.disabled ?? false,
  textValue: () => opts.text ?? id,
})

describe("createCollection", () => {
  it("starts with empty items", () => {
    createRoot((dispose) => {
      const col = createCollection()
      expect(col.items()).toEqual([])
      dispose()
    })
  })

  it("registers and returns items", () => {
    createRoot((dispose) => {
      const col = createCollection()
      const item = makeItem("a")
      col.registerItem(item)
      flush()
      expect(col.items()).toHaveLength(1)
      expect(col.items()[0]!.id).toBe("a")
      dispose()
    })
  })

  it("registers items with reactive ref getters without untracked-read warnings", () => {
    createRoot((dispose) => {
      const col = createCollection()
      const [ref] = createSignal<Element | undefined>(undefined)
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

      try {
        col.registerItem({
          ...makeItem("a"),
          get ref() {
            return ref()
          },
        })
        flush()

        const messages = warn.mock.calls.flat().map(String)
        expect(messages.some((message) => message.includes("STRICT_READ_UNTRACKED"))).toBe(false)
      } finally {
        warn.mockRestore()
        dispose()
      }
    })
  })

  it("unregisters items by ID", () => {
    createRoot((dispose) => {
      const col = createCollection()
      col.registerItem(makeItem("a"))
      col.registerItem(makeItem("b"))
      flush()
      col.unregisterItem("a")
      flush()
      expect(col.items()).toHaveLength(1)
      expect(col.items()[0]!.id).toBe("b")
      dispose()
    })
  })

  it("registerItem returns a cleanup function", () => {
    createRoot((dispose) => {
      const col = createCollection()
      const cleanup = col.registerItem(makeItem("a"))
      flush()
      expect(col.items()).toHaveLength(1)
      cleanup()
      flush()
      expect(col.items()).toHaveLength(0)
      dispose()
    })
  })

  it("filters disabled items in enabledItems", () => {
    createRoot((dispose) => {
      const col = createCollection()
      col.registerItem(makeItem("a"))
      col.registerItem(makeItem("b", { disabled: true }))
      col.registerItem(makeItem("c"))
      flush()
      expect(col.enabledItems()).toHaveLength(2)
      expect(col.enabledItems().map((i) => i.id)).toEqual(["a", "c"])
      dispose()
    })
  })

  it("finds an item by ID", () => {
    createRoot((dispose) => {
      const col = createCollection()
      col.registerItem(makeItem("x"))
      flush()
      expect(col.getItem("x")?.id).toBe("x")
      expect(col.getItem("missing")).toBeUndefined()
      dispose()
    })
  })

  it("defaults to vertical orientation and ltr direction", () => {
    createRoot((dispose) => {
      const col = createCollection()
      expect(col.orientation()).toBe("vertical")
      expect(col.direction()).toBe("ltr")
      dispose()
    })
  })

  it("accepts custom orientation and direction", () => {
    createRoot((dispose) => {
      const col = createCollection({
        orientation: () => "horizontal",
        direction: () => "rtl",
      })
      expect(col.orientation()).toBe("horizontal")
      expect(col.direction()).toBe("rtl")
      dispose()
    })
  })
})
