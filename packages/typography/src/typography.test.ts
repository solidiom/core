import { describe, it, expect } from "vitest"
import * as Typography from "./index"

describe("typography", () => {
  it("exports Heading as a function", () => {
    expect(Typography.Heading).toBeDefined()
    expect(typeof Typography.Heading).toBe("function")
  })

  it("exports Text as a function", () => {
    expect(Typography.Text).toBeDefined()
    expect(typeof Typography.Text).toBe("function")
  })

  it("exports Lead as a function", () => {
    expect(Typography.Lead).toBeDefined()
    expect(typeof Typography.Lead).toBe("function")
  })

  it("exports Small as a function", () => {
    expect(Typography.Small).toBeDefined()
    expect(typeof Typography.Small).toBe("function")
  })

  it("exports Muted as a function", () => {
    expect(Typography.Muted).toBeDefined()
    expect(typeof Typography.Muted).toBe("function")
  })

  it("exports InlineCode as a function", () => {
    expect(Typography.InlineCode).toBeDefined()
    expect(typeof Typography.InlineCode).toBe("function")
  })

  it("exports Blockquote as a function", () => {
    expect(Typography.Blockquote).toBeDefined()
    expect(typeof Typography.Blockquote).toBe("function")
  })
})
