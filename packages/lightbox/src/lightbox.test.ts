import { describe, it, expect } from "vitest"
import * as Lightbox from "./index"

describe("lightbox", () => {
  it("exports Root as a function", () => {
    expect(Lightbox.Root).toBeDefined()
    expect(typeof Lightbox.Root).toBe("function")
  })

  it("exports Backdrop as a function", () => {
    expect(Lightbox.Backdrop).toBeDefined()
    expect(typeof Lightbox.Backdrop).toBe("function")
  })

  it("exports Content as a function", () => {
    expect(Lightbox.Content).toBeDefined()
    expect(typeof Lightbox.Content).toBe("function")
  })

  it("exports Image as a function", () => {
    expect(Lightbox.Image).toBeDefined()
    expect(typeof Lightbox.Image).toBe("function")
  })

  it("exports CloseButton as a function", () => {
    expect(Lightbox.CloseButton).toBeDefined()
    expect(typeof Lightbox.CloseButton).toBe("function")
  })

  it("exports NextButton as a function", () => {
    expect(Lightbox.NextButton).toBeDefined()
    expect(typeof Lightbox.NextButton).toBe("function")
  })

  it("exports PrevButton as a function", () => {
    expect(Lightbox.PrevButton).toBeDefined()
    expect(typeof Lightbox.PrevButton).toBe("function")
  })

  it("exports Counter as a function", () => {
    expect(Lightbox.Counter).toBeDefined()
    expect(typeof Lightbox.Counter).toBe("function")
  })
})
