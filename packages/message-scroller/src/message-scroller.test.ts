import { describe, it, expect } from "vitest"
import { Root, ScrollArea, NewContentIndicator } from "./index"

describe("message-scroller", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports ScrollArea as a function", () => {
    expect(ScrollArea).toBeDefined()
    expect(typeof ScrollArea).toBe("function")
  })

  it("exports NewContentIndicator as a function", () => {
    expect(NewContentIndicator).toBeDefined()
    expect(typeof NewContentIndicator).toBe("function")
  })
})
