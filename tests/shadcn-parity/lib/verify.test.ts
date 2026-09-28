// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import type { Page } from "@playwright/test"
import { assertToken, pixelVerdict, canonicalState, captureBehavior } from "./verify"

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

describe("canonicalState", () => {
  function fake(attrs: Record<string, string>) {
    return {
      dataset: { state: attrs["data-state"] },
      getAttribute: (n: string) => (n in attrs ? attrs[n] : null),
    }
  }

  it("normalizes shadcn data-state=checked and solidiom data-state=on to checked:true", () => {
    expect(canonicalState(fake({ "data-state": "checked" })).checked).toBe(true)
    expect(canonicalState(fake({ "data-state": "on" })).checked).toBe(true)
    expect(canonicalState(fake({ "data-state": "unchecked" })).checked).toBe(false)
    expect(canonicalState(fake({ "data-state": "off" })).checked).toBe(false)
  })

  it("prefers aria-checked over data-state (switch scheme)", () => {
    expect(canonicalState(fake({ "aria-checked": "false", "data-state": "off" })).checked).toBe(
      false,
    )
    expect(canonicalState(fake({ "aria-checked": "true", "data-state": "on" })).checked).toBe(true)
    expect(canonicalState(fake({ "aria-checked": "mixed" })).checked).toBe(true)
  })

  it("normalizes open from aria-expanded and data-state", () => {
    expect(canonicalState(fake({ "aria-expanded": "true" })).open).toBe(true)
    expect(canonicalState(fake({ "aria-expanded": "false" })).open).toBe(false)
    expect(canonicalState(fake({ "data-state": "open" })).open).toBe(true)
    expect(canonicalState(fake({ "data-state": "closed" })).open).toBe(false)
  })

  it("derives nothing from stateless markup", () => {
    expect(canonicalState(fake({}))).toEqual({})
    expect(canonicalState(fake({ role: "combobox" }))).toEqual({})
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

  it("resolves focusedPart by declared part name, not frame attributes", async () => {
    // The ref frame's select trigger has role=combobox; the sol frame's has
    // data-part=trigger. Both must report focusedPart=Trigger.
    const refPage = jsdomPage(`<button role="combobox" aria-expanded="false"></button>`)
    document.body.querySelector("button")!.focus()
    const refSnap = await captureBehavior(refPage, { Trigger: "[role='combobox']" })
    expect(refSnap.focusedPart).toBe("Trigger")

    const solPage = jsdomPage(`<button data-part="trigger" data-state="closed"></button>`)
    document.body.querySelector("button")!.focus()
    const solSnap = await captureBehavior(solPage, { Trigger: "[data-part='trigger']" })
    expect(solSnap.focusedPart).toBe("Trigger")
  })

  it("ignores ambient site chrome entirely (no declared part → no facts)", async () => {
    const snap = await captureBehavior(
      jsdomPage(`
        <header>
          <button class="site-header__hamburger-button" data-state="closed">nav</button>
        </header>
        <button class="docs-theme-toggle" data-state="on">toggle</button>
        <div class="select-example">
          <button role="combobox" aria-expanded="false" data-state="closed">Select</button>
        </div>`),
      { Trigger: ".select-example [role='combobox']" },
    )
    // Only the declared part's state is recorded — the nav/theme-toggle
    // data-state values must never leak into the snapshot.
    expect(snap.open).toEqual({ Trigger: false })
    expect(snap.checked).toEqual({})
    expect(snap.focusedPart).toBeNull()
  })

  it("normalizes the switch's checked state across schemes to the same boolean", async () => {
    const ref = await captureBehavior(
      jsdomPage(`<button role="switch" data-state="unchecked"></button>`),
      { Root: "[role='switch']" },
    )
    expect(ref.checked).toEqual({ Root: false })

    const sol = await captureBehavior(
      jsdomPage(`<button role="switch" aria-checked="false" data-state="off"></button>`),
      { Root: "[role='switch']" },
    )
    expect(sol.checked).toEqual({ Root: false })
    expect(JSON.stringify(ref.checked)).toBe(JSON.stringify(sol.checked))
  })

  it("records closed overlay as open:false even when the element is unmounted", async () => {
    // Radix keeps the portal mounted with data-state=closed:
    const ref = await captureBehavior(
      jsdomPage(`<div role="listbox" data-state="closed" aria-hidden="true"></div>`),
      { Content: "[role='listbox']" },
    )
    expect(ref.open).toEqual({ Content: false })

    // Solidiom unmounts its content entirely:
    const sol = await captureBehavior(jsdomPage(""), { Content: "[data-part='content']" })
    expect(sol.open).toEqual({ Content: false })
    expect(JSON.stringify(ref.open)).toBe(JSON.stringify(sol.open))
  })

  it("records the radio item's checked state (aria-checked) on the sol frame", async () => {
    document.body.innerHTML = `
      <div class="radio-group-example">
        <button role="radio" aria-checked="false" data-scope="radio-group" data-part="item" data-state="unchecked">a</button>
      </div>`
    const snap = await captureBehavior(
      jsdomPage(`
        <div class="radio-group-example">
          <button role="radio" aria-checked="false" data-scope="radio-group" data-part="item" data-state="unchecked">a</button>
        </div>`),
      {
        Item: ".radio-group-example [data-scope='radio-group'][data-part='item']:first-of-type",
      },
    )
    expect(snap.checked).toEqual({ Item: false })
  })
})
