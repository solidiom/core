import { describe, it, expect } from "vitest"
import { resolveDirection } from "./direction"

describe("resolveDirection", () => {
  it("defaults to ltr", () => {
    const dir = resolveDirection()
    expect(dir()).toBe("ltr")
  })

  it("uses explicit direction", () => {
    const dir = resolveDirection({ direction: () => "rtl" })
    expect(dir()).toBe("rtl")
  })

  it("reads dir from element", () => {
    const el = {
      dir: "rtl",
      closest: () => null,
    } as unknown as HTMLElement
    const dir = resolveDirection({ element: () => el })
    expect(dir()).toBe("rtl")
  })

  it("reads dir from closest ancestor", () => {
    const el = {
      dir: "",
      closest: (sel: string) => (sel === "[dir]" ? { getAttribute: () => "rtl" } : null),
    } as unknown as HTMLElement
    const dir = resolveDirection({ element: () => el })
    expect(dir()).toBe("rtl")
  })

  it("explicit overrides element dir", () => {
    const el = { dir: "rtl", closest: () => null } as unknown as HTMLElement
    const dir = resolveDirection({ direction: () => "ltr", element: () => el })
    expect(dir()).toBe("ltr")
  })

  it("falls back to ltr for unknown dir values", () => {
    const el = { dir: "", closest: () => null } as unknown as HTMLElement
    const dir = resolveDirection({ element: () => el })
    expect(dir()).toBe("ltr")
  })
})
