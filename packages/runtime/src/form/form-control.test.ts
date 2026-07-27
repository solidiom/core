import { describe, it, expect } from "vitest"
import { createFormControl } from "./form-control"
import { resetIdCounter } from "../dom/stable-id"

describe("createFormControl", () => {
  it("generates coordinated IDs", () => {
    resetIdCounter()
    const fc = createFormControl()
    expect(fc.controlId).toMatch(/^field-\d+$/)
    expect(fc.labelId).toBe(`${fc.controlId}-label`)
    expect(fc.descriptionId).toBe(`${fc.controlId}-description`)
    expect(fc.errorId).toBe(`${fc.controlId}-error`)
  })

  it("uses explicit ID when provided", () => {
    const fc = createFormControl({ id: "my-field" })
    expect(fc.controlId).toBe("my-field")
    expect(fc.labelId).toBe("my-field-label")
  })

  it("controlProps includes aria-labelledby and aria-describedby", () => {
    const fc = createFormControl({ id: "f1" })
    const props = fc.controlProps()
    expect(props.id).toBe("f1")
    expect(props["aria-labelledby"]).toBe("f1-label")
    expect(props["aria-describedby"]).toBe("f1-description")
  })

  it("controlProps switches describedby to error when invalid", () => {
    const fc = createFormControl({ id: "f1", invalid: () => true })
    const props = fc.controlProps()
    expect(props["aria-describedby"]).toBe("f1-error")
    expect(props["aria-invalid"]).toBe("true")
  })

  it("controlProps reflects required/disabled/readOnly", () => {
    const fc = createFormControl({
      id: "f1",
      required: () => true,
      disabled: () => true,
      readOnly: () => true,
    })
    const props = fc.controlProps()
    expect(props["aria-required"]).toBe("true")
    expect(props["aria-disabled"]).toBe("true")
    expect(props["aria-readonly"]).toBe("true")
  })

  it("controlProps omits false aria attributes", () => {
    const fc = createFormControl({ id: "f1" })
    const props = fc.controlProps()
    expect(props["aria-invalid"]).toBeUndefined()
    expect(props["aria-required"]).toBeUndefined()
    expect(props["aria-disabled"]).toBeUndefined()
    expect(props["aria-readonly"]).toBeUndefined()
  })

  it("labelProps includes id and for", () => {
    const fc = createFormControl({ id: "f1" })
    const props = fc.labelProps()
    expect(props.id).toBe("f1-label")
    expect(props.for).toBe("f1")
  })
})
