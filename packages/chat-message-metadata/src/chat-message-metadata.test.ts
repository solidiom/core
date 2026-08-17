import { describe, it, expect } from "vitest"
import { Root, Timestamp, Sender, Status } from "./index"

describe("chat-message-metadata", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports Timestamp as a function", () => {
    expect(Timestamp).toBeDefined()
    expect(typeof Timestamp).toBe("function")
  })

  it("exports Sender as a function", () => {
    expect(Sender).toBeDefined()
    expect(typeof Sender).toBe("function")
  })

  it("exports Status as a function", () => {
    expect(Status).toBeDefined()
    expect(typeof Status).toBe("function")
  })
})
