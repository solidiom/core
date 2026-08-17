import { describe, it, expect } from "vitest"
import * as Chart from "./index"

describe("chart", () => {
  it("exports Root as a function", () => {
    expect(Chart.Root).toBeDefined()
    expect(typeof Chart.Root).toBe("function")
  })

  it("exports Canvas as a function", () => {
    expect(Chart.Canvas).toBeDefined()
    expect(typeof Chart.Canvas).toBe("function")
  })

  it("exports FallbackTable as a function", () => {
    expect(Chart.FallbackTable).toBeDefined()
    expect(typeof Chart.FallbackTable).toBe("function")
  })

  it("exports Legend as a function", () => {
    expect(Chart.Legend).toBeDefined()
    expect(typeof Chart.Legend).toBe("function")
  })

  it("exports Title as a function", () => {
    expect(Chart.Title).toBeDefined()
    expect(typeof Chart.Title).toBe("function")
  })

  it("exports Description as a function", () => {
    expect(Chart.Description).toBeDefined()
    expect(typeof Chart.Description).toBe("function")
  })
})
