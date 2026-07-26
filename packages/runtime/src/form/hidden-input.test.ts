import { describe, it, expect } from "vitest"
import { getHiddenInputProps } from "./hidden-input"

describe("getHiddenInputProps", () => {
  it("generates props for a single value", () => {
    const props = getHiddenInputProps({
      name: "color",
      value: () => "red",
    })
    expect(props).toHaveLength(1)
    expect(props[0]).toMatchObject({
      type: "hidden",
      name: "color",
      value: "red",
      required: false,
      disabled: false,
      "aria-hidden": "true",
      tabIndex: -1,
    })
  })

  it("generates multiple props for array values", () => {
    const props = getHiddenInputProps({
      name: "tags",
      value: () => ["a", "b", "c"],
    })
    expect(props).toHaveLength(3)
    expect(props[0]!.value).toBe("a")
    expect(props[1]!.value).toBe("b")
    expect(props[2]!.value).toBe("c")
    expect(props.every((p) => p.name === "tags")).toBe(true)
  })

  it("respects required and disabled", () => {
    const props = getHiddenInputProps({
      name: "x",
      value: () => "v",
      required: () => true,
      disabled: () => true,
    })
    expect(props[0]!.required).toBe(true)
    expect(props[0]!.disabled).toBe(true)
  })

  it("includes visually-hidden style", () => {
    const props = getHiddenInputProps({ name: "x", value: () => "" })
    expect(props[0]!.style).toContain("position:absolute")
    expect(props[0]!.style).toContain("clip:rect(0,0,0,0)")
  })
})
