import { describe, it, expect } from "vitest"
import { Root, Icon, Content, Timestamp } from "./index"

describe("chat-system-message", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports Icon as a function", () => {
    expect(Icon).toBeDefined()
    expect(typeof Icon).toBe("function")
  })

  it("exports Content as a function", () => {
    expect(Content).toBeDefined()
    expect(typeof Content).toBe("function")
  })

  it("exports Timestamp as a function", () => {
    expect(Timestamp).toBeDefined()
    expect(typeof Timestamp).toBe("function")
  })
})
