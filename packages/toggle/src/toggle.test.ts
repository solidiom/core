/**
 * Node-mode unit tests for Toggle primitive.
 *
 * Tests semantic attributes and controllable value logic without DOM rendering.
 */

import { describe, it, expect } from "vitest"
import { createRoot, createSignal } from "solid-js"
import { applySemanticAttrs, createControllableValue, createChangeDetails } from "@solidiom/runtime"

describe("Toggle", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "toggle", part: "root", state: "off" })
    expect(attrs["data-scope"]).toBe("toggle")
    expect(attrs["data-part"]).toBe("root")
    expect(attrs["data-state"]).toBe("off")
  })

  it("emits state='on' when pressed", () => {
    const attrs = applySemanticAttrs({ scope: "toggle", part: "root", state: "on" })
    expect(attrs["data-state"]).toBe("on")
  })

  it("emits disabled attribute", () => {
    const attrs = applySemanticAttrs({ scope: "toggle", part: "root", disabled: true })
    expect(attrs["data-disabled"]).toBe("")
  })

  it("does not emit disabled when not disabled", () => {
    const attrs = applySemanticAttrs({ scope: "toggle", part: "root", disabled: false })
    expect(attrs["data-disabled"]).toBeUndefined()
  })

  it("controllable value starts with defaultValue", () => {
    createRoot((dispose) => {
      const { value } = createControllableValue<boolean, "press">({
        defaultValue: false,
      })
      expect(value()).toBe(false)
      dispose()
    })
  })

  it("controllable value calls onChange on requestChange", () => {
    createRoot((dispose) => {
      let received: boolean | undefined
      const { requestChange } = createControllableValue<boolean, "press">({
        defaultValue: false,
        onChange: (next) => {
          received = next
        },
      })
      requestChange(true, createChangeDetails("press"))
      expect(received).toBe(true)
      dispose()
    })
  })

  it("controllable value respects controlled signal", () => {
    createRoot((dispose) => {
      const [pressed] = createSignal(true)
      const { value } = createControllableValue<boolean, "press">({
        value: pressed,
        defaultValue: false,
      })
      expect(value()).toBe(true)
      dispose()
    })
  })
})
