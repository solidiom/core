import { describe, it, expect } from "vitest"
import { Root, Input, SendButton, AttachButton } from "./index"

describe("chat-composer", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports Input as a function", () => {
    expect(Input).toBeDefined()
    expect(typeof Input).toBe("function")
  })

  it("exports SendButton as a function", () => {
    expect(SendButton).toBeDefined()
    expect(typeof SendButton).toBe("function")
  })

  it("exports AttachButton as a function", () => {
    expect(AttachButton).toBeDefined()
    expect(typeof AttachButton).toBe("function")
  })
})
