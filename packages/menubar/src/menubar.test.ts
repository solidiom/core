import { describe, it, expect } from "vitest"
import * as Menubar from "./index"

describe("menubar", () => {
  it("exports Root as a function", () => {
    expect(Menubar.Root).toBeDefined()
    expect(typeof Menubar.Root).toBe("function")
  })

  it("exports Menu as a function", () => {
    expect(Menubar.Menu).toBeDefined()
    expect(typeof Menubar.Menu).toBe("function")
  })

  it("exports Trigger as a function", () => {
    expect(Menubar.Trigger).toBeDefined()
    expect(typeof Menubar.Trigger).toBe("function")
  })

  it("exports Content as a function", () => {
    expect(Menubar.Content).toBeDefined()
    expect(typeof Menubar.Content).toBe("function")
  })

  it("exports Item as a function", () => {
    expect(Menubar.Item).toBeDefined()
    expect(typeof Menubar.Item).toBe("function")
  })

  it("exports Separator as a function", () => {
    expect(Menubar.Separator).toBeDefined()
    expect(typeof Menubar.Separator).toBe("function")
  })

  it("exports SubMenu as a function", () => {
    expect(Menubar.SubMenu).toBeDefined()
    expect(typeof Menubar.SubMenu).toBe("function")
  })

  it("exports SubTrigger as a function", () => {
    expect(Menubar.SubTrigger).toBeDefined()
    expect(typeof Menubar.SubTrigger).toBe("function")
  })

  it("exports SubContent as a function", () => {
    expect(Menubar.SubContent).toBeDefined()
    expect(typeof Menubar.SubContent).toBe("function")
  })
})
