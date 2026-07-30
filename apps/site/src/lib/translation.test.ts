import { describe, expect, it } from "vitest"
import { computeSourceHash, isTranslationFresh, TERMINOLOGY_GLOSSARY } from "./translation"

describe("computeSourceHash / isTranslationFresh", () => {
  it("produces a stable SHA-256 hash for the same content", () => {
    const hash = computeSourceHash("hello world")
    expect(hash).toBe(computeSourceHash("hello world"))
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it("produces different hashes for different content", () => {
    expect(computeSourceHash("a")).not.toBe(computeSourceHash("b"))
  })

  it("treats matching hashes as fresh and mismatched hashes as stale", () => {
    const hash = computeSourceHash("content")
    expect(isTranslationFresh(hash, hash)).toBe(true)
    expect(isTranslationFresh(hash, computeSourceHash("other"))).toBe(false)
  })
})

describe("TERMINOLOGY_GLOSSARY accessibility terms (A11Y-006)", () => {
  const accessibilityTerms = [
    "accessibility",
    "assistive-technology",
    "keyboard",
    "focus",
    "focus-trap",
    "semantics",
    "aria",
    "screen-reader",
    "reduced-motion",
    "contrast",
    "touch-target",
    "conformance",
    "consumer-duty",
    "non-applicable",
    "review-status",
    "wcag",
    "axe-core",
    "voiceover",
    "nvda",
    "jaws",
    "talkback",
  ]

  it("defines every expected accessibility term with an English and Spanish translation", () => {
    for (const term of accessibilityTerms) {
      expect(TERMINOLOGY_GLOSSARY, `missing glossary entry for "${term}"`).toHaveProperty(term)
      const entry = TERMINOLOGY_GLOSSARY[term]
      expect(entry.en.length, `"${term}" has an empty English form`).toBeGreaterThan(0)
      expect(entry.es.length, `"${term}" has an empty Spanish form`).toBeGreaterThan(0)
    }
  })

  it("protects assistive-technology and standard names from translation", () => {
    for (const term of ["aria", "wcag", "axe-core", "voiceover", "nvda", "jaws", "talkback"]) {
      expect(TERMINOLOGY_GLOSSARY[term].doNotTranslate).toBe(true)
      expect(TERMINOLOGY_GLOSSARY[term].en).toBe(TERMINOLOGY_GLOSSARY[term].es)
    }
  })

  it("translates behavioral accessibility terms rather than leaving them in English", () => {
    for (const term of ["accessibility", "keyboard", "focus", "semantics", "contrast"]) {
      const entry = TERMINOLOGY_GLOSSARY[term]
      expect(entry.doNotTranslate).toBeFalsy()
      expect(entry.es).not.toBe(entry.en)
    }
  })
})
