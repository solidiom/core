/**
 * Node-mode unit tests for InputOTP primitive.
 *
 * Tests semantic attributes and context isolation.
 */

import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("InputOTP", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "input-otp", part: "root" })
    expect(attrs["data-scope"]).toBe("input-otp")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits disabled attribute on root", () => {
    const attrs = applySemanticAttrs({ scope: "input-otp", part: "root", disabled: true })
    expect(attrs["data-disabled"]).toBe("")
  })

  it("emits correct semantic attributes for group", () => {
    const attrs = applySemanticAttrs({ scope: "input-otp", part: "group" })
    expect(attrs["data-scope"]).toBe("input-otp")
    expect(attrs["data-part"]).toBe("group")
  })

  it("emits correct semantic attributes for slot with active state", () => {
    const attrs = applySemanticAttrs({ scope: "input-otp", part: "slot", state: "active" })
    expect(attrs["data-scope"]).toBe("input-otp")
    expect(attrs["data-part"]).toBe("slot")
    expect(attrs["data-state"]).toBe("active")
  })

  it("emits inactive state for unfocused slot", () => {
    const attrs = applySemanticAttrs({ scope: "input-otp", part: "slot", state: "inactive" })
    expect(attrs["data-state"]).toBe("inactive")
  })
})
