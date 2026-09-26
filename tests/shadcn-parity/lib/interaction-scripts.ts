import type { Page } from "@playwright/test"

// The token `$$target$$` is replaced at run time with the component's primary
// interactive element selector (resolved per-frame by the engine from the
// mapping's `selectors`). When no target is supplied the script falls back to
// its generic selector so simple components still work unmodified.
const T = "$$target$$"

export type Action =
  | { kind: "click"; selector: string }
  | { kind: "press"; selector?: string; key: string }
  | { kind: "fill"; selector: string; value: string }
  | { kind: "hover"; selector: string }
  | { kind: "wait"; selector?: string; ms?: number }
  | { kind: "right-click"; selector: string }

/**
 * Deterministic interaction scripts, keyed by name. The SAME name drives both
 * frames identically, so a per-interaction behavior diff is concrete.
 *
 * State-advancing scripts target the component's primary interactive element
 * via the `$$target$$` placeholder (resolved per-frame from the mapping's
 * `selectors`); generic selectors are the fallback when no target is passed.
 * This matters because the SOL islands live inside a full site chrome (nav,
 * search, language switcher) that also contains buttons/inputs — a generic
 * `button` click would hit the ambient "toggle dark" / nav instead of the
 * component under test.
 */
export const scripts: Record<string, Action[]> = {
  // state-advancing scripts used by `states` entries
  open: [{ kind: "click", selector: T }],
  "close-esc": [
    { kind: "click", selector: T },
    { kind: "press", key: "Escape" },
  ],
  "close-overlay-click": [
    { kind: "click", selector: T },
    { kind: "click", selector: "body" },
  ],
  focus: [{ kind: "click", selector: T }],
  hover: [{ kind: "hover", selector: T }],
  active: [{ kind: "click", selector: T }],
  "select-item": [
    { kind: "click", selector: T },
    { kind: "press", key: "ArrowDown" },
    { kind: "press", key: "Enter" },
  ],
  // Toggle a checkbox/radio into the checked state.
  check: [{ kind: "click", selector: T }],
  // Batch-2 (overlays). `right-click` opens a context menu (Radix ContextMenu
  // and Solidiom ContextMenu both bind the native contextmenu event, so a
  // single action is frame-agnostic).
  "right-click": [{ kind: "right-click", selector: T }],
  // `hover`/`close-esc`/`close-overlay-click` scripts above double as the
  // tooltip + hover-card state scripts (hover opens them; Escape closes the
  // ref Radix side — the sol side keeps showing, which the behavior signal
  // records).
  // Return to a known closed/idle state between iterations. Pressing Escape
  // dismisses any open Radix portal (select content, popover) on BOTH frames —
  // without it, an open content overlay intercepts pointer events and the next
  // state's click hangs until the Playwright action timeout. A plain wait is
  // not enough for stateful components.
  reset: [
    { kind: "press", key: "Escape" },
    { kind: "wait", ms: 50 },
  ],
}

/**
 * Drive the named script into one page. `target` is the component's primary
 * interactive element selector for this frame (from the mapping's `selectors`);
 * the `$$target$$` placeholder is replaced with it. Throws on an unknown script
 * name or on a click/hover/fill whose resolved selector matches no element.
 */
export async function runInteractions(page: Page, name: string, target?: string): Promise<void> {
  const steps = scripts[name]
  if (!steps) throw new Error(`Unknown interaction script: ${name}`)
  for (const a of steps) {
    // `$$target$$` resolves to the per-frame component selector (or its generic
    // fallback). Any other selector is used verbatim.
    const sel: string =
      a.selector === T ? (target ?? genericFor(a.kind, name)) : (a.selector as string)
    if (a.kind === "click") await page.click(sel)
    else if (a.kind === "right-click") await page.click(sel, { button: "right" })
    else if (a.kind === "hover") await page.hover(sel)
    else if (a.kind === "fill") await page.fill(sel, a.value)
    else if (a.kind === "press")
      if (a.selector) await page.locator(sel).press(a.key)
      else await page.keyboard.press(a.key)
    else if (a.kind === "wait")
      await (a.selector ? page.waitForSelector(a.selector) : page.waitForTimeout(a.ms ?? 50))
  }
}

// Fallback generic selector when a `$$target$$` script runs with no target.
function genericFor(kind: Action["kind"], name: string): string {
  if (kind === "hover" || name === "active") return "button, [role='switch'], [role='slider']"
  if (name === "check") return "[role='checkbox'], [role='radio']"
  if (name === "focus") return "input, [role='slider'], [role='switch']"
  return "[data-part='trigger'], [role='combobox'], button"
}
