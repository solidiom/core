import { describe, it, expect } from "vitest"
import * as CodeBlock from "./index"

describe("code-block", () => {
  it("exports Root as a function", () => {
    expect(CodeBlock.Root).toBeDefined()
    expect(typeof CodeBlock.Root).toBe("function")
  })

  it("exports Pre as a function", () => {
    expect(CodeBlock.Pre).toBeDefined()
    expect(typeof CodeBlock.Pre).toBe("function")
  })

  it("exports Code as a function", () => {
    expect(CodeBlock.Code).toBeDefined()
    expect(typeof CodeBlock.Code).toBe("function")
  })

  it("exports LineNumbers as a function", () => {
    expect(CodeBlock.LineNumbers).toBeDefined()
    expect(typeof CodeBlock.LineNumbers).toBe("function")
  })

  it("exports CopyButton as a function", () => {
    expect(CodeBlock.CopyButton).toBeDefined()
    expect(typeof CodeBlock.CopyButton).toBe("function")
  })

  it("exports Header as a function", () => {
    expect(CodeBlock.Header).toBeDefined()
    expect(typeof CodeBlock.Header).toBe("function")
  })

  it("exports Language as a function", () => {
    expect(CodeBlock.Language).toBeDefined()
    expect(typeof CodeBlock.Language).toBe("function")
  })
})
