import { describe, it, expect, vi } from "vitest"
import { createValidation } from "./validation"

describe("createValidation", () => {
  it("starts with no messages and valid", () => {
    const v = createValidation()
    expect(v.messages()).toEqual([])
    expect(v.invalid()).toBe(false)
  })

  it("setMessages updates messages and invalid state", () => {
    const v = createValidation()
    v.setMessages([{ message: "Required", severity: "error" }])
    expect(v.messages()).toHaveLength(1)
    expect(v.invalid()).toBe(true)
  })

  it("warnings do not make the field invalid", () => {
    const v = createValidation()
    v.setMessages([{ message: "Consider shorter input", severity: "warning" }])
    expect(v.invalid()).toBe(false)
  })

  it("clear removes all messages", () => {
    const v = createValidation()
    v.setMessages([{ message: "Err", severity: "error" }])
    v.clear()
    expect(v.messages()).toEqual([])
    expect(v.invalid()).toBe(false)
  })

  it("syncToNative sets custom validity on element", () => {
    const setCustomValidity = vi.fn()
    const el = { setCustomValidity } as unknown as HTMLInputElement
    const v = createValidation({ element: () => el })

    v.setMessages([{ message: "Too short", severity: "error" }])
    expect(setCustomValidity).toHaveBeenCalledWith("Too short")
  })

  it("syncToNative clears validity when no errors", () => {
    const setCustomValidity = vi.fn()
    const el = { setCustomValidity } as unknown as HTMLInputElement
    const v = createValidation({ element: () => el })

    v.setMessages([{ message: "Too short", severity: "error" }])
    v.clear()
    expect(setCustomValidity).toHaveBeenLastCalledWith("")
  })

  it("syncToNative is no-op when no element", () => {
    const v = createValidation({ element: () => undefined })
    expect(() => v.setMessages([{ message: "x", severity: "error" }])).not.toThrow()
  })
})
