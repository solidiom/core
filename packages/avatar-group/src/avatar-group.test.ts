import { describe, it, expect } from "vitest"
import * as AvatarGroup from "./index"

describe("avatar-group", () => {
  it("exports Root as a function", () => {
    expect(AvatarGroup.Root).toBeDefined()
    expect(typeof AvatarGroup.Root).toBe("function")
  })

  it("exports Overflow as a function", () => {
    expect(AvatarGroup.Overflow).toBeDefined()
    expect(typeof AvatarGroup.Overflow).toBe("function")
  })
})
