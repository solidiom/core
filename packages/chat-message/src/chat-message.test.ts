import { describe, it, expect } from "vitest"
import { Root, Content, Avatar, Actions } from "./index"

describe("chat-message", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports Content as a function", () => {
    expect(Content).toBeDefined()
    expect(typeof Content).toBe("function")
  })

  it("exports Avatar as a function", () => {
    expect(Avatar).toBeDefined()
    expect(typeof Avatar).toBe("function")
  })

  it("exports Actions as a function", () => {
    expect(Actions).toBeDefined()
    expect(typeof Actions).toBe("function")
  })
})
