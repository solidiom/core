import { describe, it, expect } from "vitest"
import { getContext, incrementId } from "./context"

describe("context", () => {
  describe("getContext", () => {
    it("creates a new context for a new result object", () => {
      const result = {} as any
      const ctx = getContext(result)
      expect(ctx).toBeDefined()
      expect(ctx.c).toBe(0)
      expect(ctx.id).toBe("s0")
    })

    it("returns the same context for the same result object", () => {
      const result = {} as any
      const ctx1 = getContext(result)
      const ctx2 = getContext(result)
      expect(ctx1).toBe(ctx2)
    })

    it("returns different contexts for different result objects", () => {
      const result1 = {} as any
      const result2 = {} as any
      const ctx1 = getContext(result1)
      const ctx2 = getContext(result2)
      expect(ctx1).not.toBe(ctx2)
    })

    it("id is derived from counter c", () => {
      const result = {} as any
      const ctx = getContext(result)
      expect(ctx.id).toBe("s0")
      ctx.c = 5
      expect(ctx.id).toBe("s5")
      ctx.c = 42
      expect(ctx.id).toBe("s42")
    })
  })

  describe("incrementId", () => {
    it("returns the current id before incrementing", () => {
      const result = {} as any
      const ctx = getContext(result)
      expect(incrementId(ctx)).toBe("s0")
      expect(ctx.c).toBe(1)
    })

    it("increments sequentially", () => {
      const result = {} as any
      const ctx = getContext(result)
      expect(incrementId(ctx)).toBe("s0")
      expect(incrementId(ctx)).toBe("s1")
      expect(incrementId(ctx)).toBe("s2")
      expect(ctx.c).toBe(3)
    })

    it("produces unique ids across calls", () => {
      const result = {} as any
      const ctx = getContext(result)
      const ids = Array.from({ length: 10 }, () => incrementId(ctx))
      const unique = new Set(ids)
      expect(unique.size).toBe(10)
    })
  })
})
