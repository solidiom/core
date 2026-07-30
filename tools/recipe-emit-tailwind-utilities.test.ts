import { describe, expect, it } from "vitest"
import { declarationToUtilities } from "./recipe-emit-tailwind-utilities"

describe("declarationToUtilities — colours", () => {
  it("maps a resolved theme colour name to bg-/text-/border- utilities", () => {
    expect(declarationToUtilities("background-color", "primary")).toEqual(["bg-primary"])
    expect(declarationToUtilities("color", "primary-foreground")).toEqual([
      "text-primary-foreground",
    ])
    expect(declarationToUtilities("border-color", "border")).toEqual(["border-border"])
  })

  it("maps the transparent keyword", () => {
    expect(declarationToUtilities("background-color", "transparent")).toEqual(["bg-transparent"])
  })
})

describe("declarationToUtilities — box spacing shorthand", () => {
  it("maps a uniform padding to a single p- utility", () => {
    expect(declarationToUtilities("padding", "1rem")).toEqual(["p-4"])
  })

  it("maps symmetric vertical/horizontal padding to py-/px-", () => {
    expect(declarationToUtilities("padding", "0.5rem 1rem")).toEqual(["py-2", "px-4"])
  })

  it("maps all-different padding to pt-/pr-/pb-/pl-", () => {
    expect(declarationToUtilities("padding", "0.375rem 0.5rem 0.375rem 2rem")).toEqual([
      "pt-1.5",
      "pr-2",
      "pb-1.5",
      "pl-8",
    ])
  })

  it("maps zero padding", () => {
    expect(declarationToUtilities("padding", "0")).toEqual(["p-0"])
  })

  it("falls back to an arbitrary value for a margin side outside the spacing scale", () => {
    expect(declarationToUtilities("margin", "0.25rem -0.25rem")).toEqual(["my-1", "mx-[-0.25rem]"])
  })
})

describe("declarationToUtilities — border radius (token-resolved theme names)", () => {
  it("maps a theme radius name to rounded-<name>", () => {
    expect(declarationToUtilities("border-radius", "radius")).toEqual(["rounded-radius"])
    expect(declarationToUtilities("border-radius", "radius-full")).toEqual(["rounded-radius-full"])
  })

  it("maps the one literal radius value used in the definitions to Tailwind's sm step", () => {
    expect(declarationToUtilities("border-radius", "0.25rem")).toEqual(["rounded-sm"])
  })
})

describe("declarationToUtilities — transform", () => {
  it("maps a translateX literal to translate-x-*", () => {
    expect(declarationToUtilities("transform", "translateX(1.25rem)")).toEqual(["translate-x-5"])
    expect(declarationToUtilities("transform", "translateX(0)")).toEqual(["translate-x-0"])
  })

  it("maps the dialog-centering transform, with and without a scale", () => {
    expect(declarationToUtilities("transform", "translate(-50%, -50%)")).toEqual([
      "-translate-x-1/2",
      "-translate-y-1/2",
    ])
    expect(declarationToUtilities("transform", "translate(-50%, -50%) scale(1)")).toEqual([
      "-translate-x-1/2",
      "-translate-y-1/2",
      "scale-100",
    ])
    expect(declarationToUtilities("transform", "translate(-50%, -50%) scale(0.96)")).toEqual([
      "-translate-x-1/2",
      "-translate-y-1/2",
      "scale-96",
    ])
  })
})

describe("declarationToUtilities — transition", () => {
  it("maps a single-property transition to its named utility", () => {
    expect(declarationToUtilities("transition", "opacity 0.15s")).toEqual(["transition-opacity"])
    expect(declarationToUtilities("transition", "color 0.15s")).toEqual(["transition-colors"])
    expect(declarationToUtilities("transition", "transform 0.15s")).toEqual([
      "transition-transform",
    ])
  })

  it("maps a multi-property colour transition to transition-colors", () => {
    expect(
      declarationToUtilities(
        "transition",
        "background-color 0.15s, color 0.15s, border-color 0.15s",
      ),
    ).toEqual(["transition-colors"])
  })

  it("falls back to transition-all for a mixed opacity+transform transition", () => {
    expect(declarationToUtilities("transition", "opacity 0.15s, transform 0.15s")).toEqual([
      "transition-all",
    ])
  })
})

describe("declarationToUtilities — keyword properties", () => {
  it("maps display, position, and flex alignment keywords", () => {
    expect(declarationToUtilities("display", "inline-flex")).toEqual(["inline-flex"])
    expect(declarationToUtilities("position", "fixed")).toEqual(["fixed"])
    expect(declarationToUtilities("align-items", "center")).toEqual(["items-center"])
    expect(declarationToUtilities("justify-content", "space-between")).toEqual(["justify-between"])
  })

  it("maps cursor and pointer-events keywords", () => {
    expect(declarationToUtilities("cursor", "not-allowed")).toEqual(["cursor-not-allowed"])
    expect(declarationToUtilities("pointer-events", "none")).toEqual(["pointer-events-none"])
  })
})

describe("declarationToUtilities — typography scale", () => {
  it("maps font-size, font-weight, and line-height onto Tailwind's named scale", () => {
    expect(declarationToUtilities("font-size", "0.875rem")).toEqual(["text-sm"])
    expect(declarationToUtilities("font-weight", "600")).toEqual(["font-semibold"])
    expect(declarationToUtilities("line-height", "1.25rem")).toEqual(["leading-5"])
  })

  it("falls back to an arbitrary value for a size outside the named scale", () => {
    expect(declarationToUtilities("font-size", "0.8125rem")).toEqual(["text-[0.8125rem]"])
  })
})

describe("declarationToUtilities — sizing keywords", () => {
  it("maps auto, full, and half-percentage sizing keywords", () => {
    expect(declarationToUtilities("height", "auto")).toEqual(["h-auto"])
    expect(declarationToUtilities("width", "100%")).toEqual(["w-full"])
    expect(declarationToUtilities("top", "50%")).toEqual(["top-1/2"])
  })
})

describe("declarationToUtilities — text-underline-offset", () => {
  it("maps the one literal value used in the definitions to Tailwind's named scale", () => {
    expect(declarationToUtilities("text-underline-offset", "4px")).toEqual(["underline-offset-4"])
  })
})

describe("declarationToUtilities — border width/style co-occurrence", () => {
  it("does not duplicate border-b when a 1px border-bottom-width co-occurs with a solid border-bottom-style", () => {
    // border-bottom-style: solid already implies width via Tailwind's border-b default;
    // a redundant border-bottom-width: 1px must not emit a second border-b.
    expect(declarationToUtilities("border-bottom-width", "1px")).toEqual([])
  })

  it("still emits a width utility for a non-default border-bottom-width", () => {
    expect(declarationToUtilities("border-bottom-width", "2px")).toEqual(["border-b-2"])
  })
})

describe("declarationToUtilities — properties with no mapping table entry", () => {
  it("falls back to a bracketed arbitrary property:value pair", () => {
    expect(declarationToUtilities("scroll-margin-top", "4px")).toEqual(["[scroll-margin-top:4px]"])
  })
})
