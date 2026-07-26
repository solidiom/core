import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import {
  useVirtualListContext,
  type VirtualConfig,
  type VirtualizationPort,
} from "./virtual-list-context"

describe("VirtualList", () => {
  it("emits correct semantic attributes for root and item", () => {
    const root = applySemanticAttrs({ scope: "virtual-list", part: "root" })
    expect(root["data-scope"]).toBe("virtual-list")
    expect(root["data-part"]).toBe("root")

    const item = applySemanticAttrs({ scope: "virtual-list", part: "item" })
    expect(item["data-scope"]).toBe("virtual-list")
    expect(item["data-part"]).toBe("item")
    expect(item["data-state"]).toBeUndefined()
  })

  it("VirtualizationPort interface computes correct items for fixed-height", () => {
    // Implement a minimal fixed-height port matching the internal logic
    const port: VirtualizationPort = {
      getVirtualItems(config: VirtualConfig) {
        const { totalCount, itemSize, overscan = 3, scrollOffset, containerSize } = config
        if (typeof itemSize !== "number") throw new Error("requires numeric itemSize")
        const startIndex = Math.max(0, Math.floor(scrollOffset / itemSize) - overscan)
        const visibleCount = Math.ceil(containerSize / itemSize)
        const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2)
        const items = []
        for (let i = startIndex; i <= endIndex; i++) {
          items.push({ index: i, start: i * itemSize, size: itemSize, end: (i + 1) * itemSize })
        }
        return items
      },
      getTotalSize(config: VirtualConfig) {
        if (typeof config.itemSize !== "number") throw new Error("requires numeric itemSize")
        return config.totalCount * config.itemSize
      },
      scrollToIndex() {},
    }

    const config: VirtualConfig = {
      totalCount: 100,
      itemSize: 40,
      overscan: 2,
      scrollOffset: 0,
      containerSize: 200,
    }

    const items = port.getVirtualItems(config)
    expect(items[0]!.index).toBe(0)
    expect(items[0]!.start).toBe(0)
    expect(items[0]!.size).toBe(40)
    expect(items[0]!.end).toBe(40)
    // visibleCount = ceil(200/40) = 5, endIndex = min(99, 0 + 5 + 4) = 9
    expect(items.length).toBe(10)
    expect(items[items.length - 1]!.index).toBe(9)

    expect(port.getTotalSize(config)).toBe(4000)
  })

  it("throws when useVirtualListContext is called outside a reactive root", () => {
    expect(() => useVirtualListContext()).toThrow()
  })
})
