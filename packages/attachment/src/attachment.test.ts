import { describe, it, expect } from "vitest"
import * as Attachment from "./index"

describe("attachment", () => {
  it("exports Root as a function", () => {
    expect(Attachment.Root).toBeDefined()
    expect(typeof Attachment.Root).toBe("function")
  })

  it("exports Preview as a function", () => {
    expect(Attachment.Preview).toBeDefined()
    expect(typeof Attachment.Preview).toBe("function")
  })

  it("exports Name as a function", () => {
    expect(Attachment.Name).toBeDefined()
    expect(typeof Attachment.Name).toBe("function")
  })

  it("exports Size as a function", () => {
    expect(Attachment.Size).toBeDefined()
    expect(typeof Attachment.Size).toBe("function")
  })

  it("exports Remove as a function", () => {
    expect(Attachment.Remove).toBeDefined()
    expect(typeof Attachment.Remove).toBe("function")
  })

  it("exports Icon as a function", () => {
    expect(Attachment.Icon).toBeDefined()
    expect(typeof Attachment.Icon).toBe("function")
  })
})
