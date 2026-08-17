import { describe, it, expect } from "vitest"
import { Root, Header, Sidebar, Main, Footer } from "./index"

describe("app-shell", () => {
  it("exports a Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports a Header component", () => {
    expect(Header).toBeDefined()
    expect(typeof Header).toBe("function")
  })

  it("exports a Sidebar component", () => {
    expect(Sidebar).toBeDefined()
    expect(typeof Sidebar).toBe("function")
  })

  it("exports a Main component", () => {
    expect(Main).toBeDefined()
    expect(typeof Main).toBe("function")
  })

  it("exports a Footer component", () => {
    expect(Footer).toBeDefined()
    expect(typeof Footer).toBe("function")
  })
})
