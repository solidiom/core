import { describe, expect, it } from "vitest"
import { auditUmbrellaSource } from "./audit-umbrella-purity"

const SURFACE = ["@solidiom/button"]
const VALID = 'export * as Button from "@solidiom/button"\n'

describe("umbrella purity audit", () => {
  it("accepts a pure exact re-export surface", () => {
    expect(auditUmbrellaSource(VALID, SURFACE)).toEqual([])
  })

  it("rejects implementation code", () => {
    expect(auditUmbrellaSource(`${VALID}const implementation = true\n`, SURFACE)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Implementation line") }),
    )
  })

  it("rejects a missing re-export", () => {
    expect(auditUmbrellaSource("", SURFACE)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Missing re-export") }),
    )
  })

  it("rejects an extra re-export", () => {
    const source = `${VALID}export * as Dialog from "@solidiom/dialog"\n`
    expect(auditUmbrellaSource(source, SURFACE)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Extra re-export") }),
    )
  })

  it("rejects duplicate re-exports", () => {
    expect(auditUmbrellaSource(`${VALID}${VALID}`, SURFACE)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Duplicate re-export") }),
    )
  })

  it("rejects malformed exports", () => {
    expect(
      auditUmbrellaSource('export { Button } from "@solidiom/button"\n', SURFACE),
    ).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Implementation line") }),
    )
  })
})
