import { describe, it, expect, vi, afterEach } from "vitest"
import { resolveLocale } from "./locale"

describe("resolveLocale", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses explicit locale", () => {
    const locale = resolveLocale({ locale: () => "ja-JP" })
    expect(locale()).toBe("ja-JP")
  })

  it("falls back to navigator.language", () => {
    vi.stubGlobal("navigator", { language: "fr-FR" })
    const locale = resolveLocale()
    expect(locale()).toBe("fr-FR")
  })

  it("falls back to 'en' when no navigator", () => {
    vi.stubGlobal("navigator", undefined)
    const locale = resolveLocale()
    expect(locale()).toBe("en")
  })

  it("explicit overrides navigator", () => {
    vi.stubGlobal("navigator", { language: "de-DE" })
    const locale = resolveLocale({ locale: () => "ko-KR" })
    expect(locale()).toBe("ko-KR")
  })

  it("returns undefined locale accessor falls through", () => {
    vi.stubGlobal("navigator", { language: "es-ES" })
    const locale = resolveLocale({ locale: () => undefined })
    expect(locale()).toBe("es-ES")
  })
})
