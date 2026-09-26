// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import type { Page } from "@playwright/test"
import { assertToken, pixelVerdict, captureBehavior } from "./verify"

describe("pixelVerdict", () => {
  it("skips when sharp is unavailable (diff === null)", () => {
    expect(pixelVerdict(null, 5)).toBe("skip")
  })
  it("passes when diff is within tolerance", () => {
    expect(pixelVerdict(0, 5)).toBe("pass")
    expect(pixelVerdict(5, 5)).toBe("pass")
    expect(pixelVerdict(1.2, 5)).toBe("pass")
  })
  it("fails when diff exceeds tolerance (including Infinity)", () => {
    expect(pixelVerdict(5.01, 5)).toBe("fail")
    expect(pixelVerdict(Infinity, 5)).toBe("fail")
  })
})

describe("assertToken", () => {
  it("passes an exact match", () => {
    expect(assertToken("0.5rem", "0.5rem")).toEqual({
      pass: true,
      expected: "0.5rem",
      actual: "0.5rem",
    })
  })
  it("passes a relational >= assertion", () => {
    expect(assertToken(">=40", "48")).toEqual({ pass: true, expected: ">=40", actual: "48" })
    expect(assertToken(">=40", "32")).toEqual({ pass: false, expected: ">=40", actual: "32" })
  })
  it("passes a relational <= assertion", () => {
    expect(assertToken("<=10", "8")).toEqual({ pass: true, expected: "<=10", actual: "8" })
    expect(assertToken("<=10", "12")).toEqual({ pass: false, expected: "<=10", actual: "12" })
  })
  it("fails a non-matching exact value", () => {
    expect(assertToken("0.5rem", "8px")).toEqual({ pass: false, expected: "0.5rem", actual: "8px" })
  })
})

describe("captureBehavior", () => {
  function jsdomPage(bodyHtml: string): Page {
    document.body.innerHTML = bodyHtml
    return {
      evaluate: (
        fn: (selectors: Record<string, string>) => unknown,
        selectors?: Record<string, string>,
      ) => (fn as (s: Record<string, string>) => unknown)(selectors ?? {}),
    } as unknown as Page
  }

  it("scopes state capture to the component subtree and excludes ambient chrome", async () => {
    const snap = await captureBehavior(
      jsdomPage(`
        <header>
          <nav>
            <button class="site-header__hamburger-button" data-state="closed">nav</button>
          </nav>
          <button class="docs-theme-toggle" data-state="off">toggle</button>
        </header>
        <div class="select-example">
          <button
            class="flex h-9 items-center gap-2 rounded-md border ..."
            data-state="closed" aria-expanded="false" role="combobox"
          >Select</button>
        </div>`),
      { Trigger: ".select-example [role='combobox']" },
    )
    const keys = snap.elements.map((e) => e.key)
    expect(keys).toContain("button:combobox")
    expect(keys).not.toContain("button:hamburger")
    expect(snap.elements.find((e) => e.key === "button:combobox")?.open).toBe(false)
    // structural key — no className in it
    expect(keys.join(" ")).not.toContain("rounded-md")
  })

  it("reports open state via aria-expanded / data-state=open", async () => {
    const snap = await captureBehavior(
      jsdomPage(`
        <div class="select-example">
          <button data-part="trigger" data-state="open" aria-expanded="true" role="combobox">S</button>
        </div>`),
      { Trigger: "[data-part='trigger']" },
    )
    expect(snap.elements.find((e) => e.key === "button:trigger")?.open).toBe(true)
  })

  it("resolves the active element's declared part via closest()", async () => {
    const page = jsdomPage(
      `<div class="cb-example"><button data-part="root" role="checkbox">x</button></div>`,
    )
    document.querySelector("button")!.focus()
    const snap = await captureBehavior(page, { Root: "[data-part='root']" })
    expect(snap.activeElementRole).toBe("checkbox")
    expect(snap.activeElementPart).toBe("Root")
  })
})
