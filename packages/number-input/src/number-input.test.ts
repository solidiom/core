import { describe, it, expect } from "vitest"
import * as NumberInput from "./index"

describe("number-input", () => {
  it("exports Root component", () => {
    expect(NumberInput.Root).toBeDefined()
    expect(typeof NumberInput.Root).toBe("function")
  })

  it("exports Input component", () => {
    expect(NumberInput.Input).toBeDefined()
    expect(typeof NumberInput.Input).toBe("function")
  })

  it("exports IncrementButton component", () => {
    expect(NumberInput.IncrementButton).toBeDefined()
    expect(typeof NumberInput.IncrementButton).toBe("function")
  })

  it("exports DecrementButton component", () => {
    expect(NumberInput.DecrementButton).toBeDefined()
    expect(typeof NumberInput.DecrementButton).toBe("function")
  })

  it("exports NumberInputRootProps type", () => {
    // Type-level check: ensure the interface is exported and usable
    const props: NumberInput.NumberInputRootProps = {
      value: 5,
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      readOnly: false,
      required: false,
      invalid: false,
      name: "quantity",
      id: "qty",
      locale: "en-US",
      formatOptions: { style: "decimal" },
      allowMouseWheel: true,
      clampValueOnBlur: true,
    }
    expect(props).toBeDefined()
  })

  it("exports NumberInputInputProps type", () => {
    const props: NumberInput.NumberInputInputProps = {
      class: "test",
      placeholder: "Enter number",
    }
    expect(props).toBeDefined()
  })

  it("exports NumberInputButtonProps type", () => {
    const props: NumberInput.NumberInputButtonProps = {
      class: "btn",
    }
    expect(props).toBeDefined()
  })
})
