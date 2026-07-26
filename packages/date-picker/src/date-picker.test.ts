import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { getDaysInMonth, defaultFormatDate, createDefaultDateMath } from "./date-picker-context"

describe("DatePicker", () => {
  it("emits correct semantic attributes for root, trigger, and content", () => {
    const root = applySemanticAttrs({ scope: "date-picker", part: "root" })
    expect(root["data-scope"]).toBe("date-picker")
    expect(root["data-part"]).toBe("root")

    const trigger = applySemanticAttrs({ scope: "date-picker", part: "trigger" })
    expect(trigger["data-part"]).toBe("trigger")

    const content = applySemanticAttrs({ scope: "date-picker", part: "content", state: "open" })
    expect(content["data-state"]).toBe("open")
  })

  it("getDaysInMonth and defaultFormatDate produce correct values", () => {
    expect(getDaysInMonth(2024, 2)).toBe(29) // leap year
    expect(getDaysInMonth(2023, 2)).toBe(28)
    expect(getDaysInMonth(2024, 1)).toBe(31)

    expect(defaultFormatDate({ year: 2024, month: 3, day: 5 })).toBe("2024-03-05")
    expect(defaultFormatDate({ year: 2024, month: 12, day: 25 })).toBe("2024-12-25")
  })

  it("createDefaultDateMath addMonths and isSameDay work correctly", () => {
    const math = createDefaultDateMath()

    const next = math.addMonths({ year: 2024, month: 12, day: 1 }, 1)
    expect(next.year).toBe(2025)
    expect(next.month).toBe(1)

    expect(math.isSameDay({ year: 2024, month: 1, day: 1 }, { year: 2024, month: 1, day: 1 })).toBe(
      true,
    )
    expect(math.isSameDay({ year: 2024, month: 1, day: 1 }, { year: 2024, month: 1, day: 2 })).toBe(
      false,
    )

    expect(
      math.isInRange(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 1 },
        { year: 2024, month: 6, day: 30 },
      ),
    ).toBe(true)

    expect(
      math.isInRange(
        { year: 2024, month: 7, day: 1 },
        { year: 2024, month: 6, day: 1 },
        { year: 2024, month: 6, day: 30 },
      ),
    ).toBe(false)
  })
})
