import { describe, it, expect } from "vitest"
import { Root, MessageList, Composer, Header } from "./index"

describe("chat-layout", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports MessageList as a function", () => {
    expect(MessageList).toBeDefined()
    expect(typeof MessageList).toBe("function")
  })

  it("exports Composer as a function", () => {
    expect(Composer).toBeDefined()
    expect(typeof Composer).toBe("function")
  })

  it("exports Header as a function", () => {
    expect(Header).toBeDefined()
    expect(typeof Header).toBe("function")
  })
})
