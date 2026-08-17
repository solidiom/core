import { describe, it, expect } from "vitest"
import { Root, ToolCall, ToolName, ToolInput, ToolOutput, ToolStatus } from "./index"

describe("chat-tool-calls", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports ToolCall as a function", () => {
    expect(ToolCall).toBeDefined()
    expect(typeof ToolCall).toBe("function")
  })

  it("exports ToolName as a function", () => {
    expect(ToolName).toBeDefined()
    expect(typeof ToolName).toBe("function")
  })

  it("exports ToolInput as a function", () => {
    expect(ToolInput).toBeDefined()
    expect(typeof ToolInput).toBe("function")
  })

  it("exports ToolOutput as a function", () => {
    expect(ToolOutput).toBeDefined()
    expect(typeof ToolOutput).toBe("function")
  })

  it("exports ToolStatus as a function", () => {
    expect(ToolStatus).toBeDefined()
    expect(typeof ToolStatus).toBe("function")
  })
})
