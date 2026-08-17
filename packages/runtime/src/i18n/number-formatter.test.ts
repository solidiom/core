import { describe, it, expect } from "vitest"
import { createNumberFormatter } from "./number-formatter"

describe("createNumberFormatter", () => {
  describe("basic format (en-US)", () => {
    it("formats integers", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.format(1234)).toBe("1,234")
    })

    it("formats decimals", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.format(1234.56)).toBe("1,234.56")
    })

    it("formats zero", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.format(0)).toBe("0")
    })

    it("formats negative numbers", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      const result = fmt.format(-5678.9)
      // Intl may use different minus representations; just verify it parses back
      expect(result).toContain("5,678.9")
    })
  })

  describe("format with de-DE locale", () => {
    it("uses comma as decimal separator", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      expect(fmt.format(1234.56)).toBe("1.234,56")
    })

    it("uses period as group separator", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      expect(fmt.format(1000000)).toBe("1.000.000")
    })
  })

  describe("parse roundtrip", () => {
    it("en-US roundtrip", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      const original = 12345.67
      const formatted = fmt.format(original)
      expect(fmt.parse(formatted)).toBeCloseTo(original, 2)
    })

    it("de-DE roundtrip", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      const original = 12345.67
      const formatted = fmt.format(original)
      expect(fmt.parse(formatted)).toBeCloseTo(original, 2)
    })

    it("fr-FR roundtrip", () => {
      const fmt = createNumberFormatter({ locale: "fr-FR" })
      const original = 9876.54
      const formatted = fmt.format(original)
      expect(fmt.parse(formatted)).toBeCloseTo(original, 2)
    })

    it("ja-JP roundtrip", () => {
      const fmt = createNumberFormatter({ locale: "ja-JP" })
      const original = 100000.5
      const formatted = fmt.format(original)
      expect(fmt.parse(formatted)).toBeCloseTo(original, 1)
    })
  })

  describe("parse with various locales", () => {
    it("parses en-US formatted string", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.parse("1,234.56")).toBeCloseTo(1234.56, 2)
    })

    it("parses de-DE formatted string", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      expect(fmt.parse("1.234,56")).toBeCloseTo(1234.56, 2)
    })

    it("parses negative numbers", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      const formatted = fmt.format(-999.99)
      expect(fmt.parse(formatted)).toBeCloseTo(-999.99, 2)
    })

    it("returns NaN for non-numeric input", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.parse("")).toBeNaN()
      expect(fmt.parse("abc")).toBeNaN()
    })
  })

  describe("percent style", () => {
    it("formats as percent", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "percent" },
      })
      const result = fmt.format(0.75)
      expect(result).toContain("75")
      expect(result).toContain("%")
    })

    it("parses percent back to decimal", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "percent" },
      })
      expect(fmt.parse("75%")).toBeCloseTo(0.75, 2)
    })

    it("percent roundtrip", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "percent", minimumFractionDigits: 2 },
      })
      const original = 0.1234
      const formatted = fmt.format(original)
      expect(fmt.parse(formatted)).toBeCloseTo(original, 4)
    })
  })

  describe("currency style", () => {
    it("formats as currency (USD)", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "currency", currency: "USD" },
      })
      const result = fmt.format(99.99)
      expect(result).toContain("99.99")
    })

    it("formats as currency (EUR in de-DE)", () => {
      const fmt = createNumberFormatter({
        locale: "de-DE",
        formatOptions: { style: "currency", currency: "EUR" },
      })
      const result = fmt.format(1234.5)
      // de-DE uses comma for decimal
      expect(result).toContain("1.234,50")
    })

    it("parses currency string", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "currency", currency: "USD" },
      })
      expect(fmt.parse("$1,234.56")).toBeCloseTo(1234.56, 2)
    })
  })

  describe("decimalSeparator and groupSeparator", () => {
    it("en-US decimal is dot", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.decimalSeparator()).toBe(".")
    })

    it("en-US group is comma", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.groupSeparator()).toBe(",")
    })

    it("de-DE decimal is comma", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      expect(fmt.decimalSeparator()).toBe(",")
    })

    it("de-DE group is period", () => {
      const fmt = createNumberFormatter({ locale: "de-DE" })
      expect(fmt.groupSeparator()).toBe(".")
    })

    it("usesGrouping returns true for default options", () => {
      const fmt = createNumberFormatter({ locale: "en-US" })
      expect(fmt.usesGrouping()).toBe(true)
    })

    it("usesGrouping returns false when grouping disabled", () => {
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: { useGrouping: false },
      })
      expect(fmt.usesGrouping()).toBe(false)
    })
  })

  describe("caching", () => {
    it("returns same formatter instance for same options", () => {
      const fmt1 = createNumberFormatter({ locale: "en-US" })
      const fmt2 = createNumberFormatter({ locale: "en-US" })
      expect(fmt1.resolvedFormatter()).toBe(fmt2.resolvedFormatter())
    })

    it("returns same instance for same locale and formatOptions", () => {
      const opts: Intl.NumberFormatOptions = { style: "currency", currency: "USD" }
      const fmt1 = createNumberFormatter({ locale: "en-US", formatOptions: opts })
      const fmt2 = createNumberFormatter({ locale: "en-US", formatOptions: opts })
      expect(fmt1.resolvedFormatter()).toBe(fmt2.resolvedFormatter())
    })

    it("returns different instance for different locale", () => {
      const fmt1 = createNumberFormatter({ locale: "en-US" })
      const fmt2 = createNumberFormatter({ locale: "de-DE" })
      expect(fmt1.resolvedFormatter()).not.toBe(fmt2.resolvedFormatter())
    })

    it("returns different instance for different options", () => {
      const fmt1 = createNumberFormatter({ locale: "en-US" })
      const fmt2 = createNumberFormatter({
        locale: "en-US",
        formatOptions: { style: "percent" },
      })
      expect(fmt1.resolvedFormatter()).not.toBe(fmt2.resolvedFormatter())
    })
  })

  describe("reactive locale and options", () => {
    it("supports accessor for locale", () => {
      let locale = "en-US"
      const fmt = createNumberFormatter({ locale: () => locale })

      expect(fmt.format(1234.5)).toBe("1,234.5")

      locale = "de-DE"
      expect(fmt.format(1234.5)).toBe("1.234,5")
    })

    it("supports accessor for formatOptions", () => {
      let opts: Intl.NumberFormatOptions = {}
      const fmt = createNumberFormatter({
        locale: "en-US",
        formatOptions: () => opts,
      })

      expect(fmt.format(0.5)).toBe("0.5")

      opts = { style: "percent" }
      expect(fmt.format(0.5)).toBe("50%")
    })
  })
})
