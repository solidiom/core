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
  // Batch-3 (navigation & structure). Frame-agnostic: both frames use
  // aria-label="Go to next page" for pagination Next and role=tab for tabs.
  "click-next": [
    {
      kind: "click",
      selector: "a[aria-label='Go to next page'], button[aria-label='Go to next page']",
    },
    { kind: "wait", ms: 150 },
  ],
  "click-tab-2": [
    { kind: "click", selector: "[role='tab']:nth-of-type(2)" },
    { kind: "wait", ms: 150 },
  ],
  // Batch-4 (data & feedback). Frame-agnostic: the shadcn (react-day-picker)
  // calendar next-month button carries the class `rdp-button_next`; the
  // Solidiom calendar exposes `data-part='next-button'` on its own scope.
  "click-calendar-next": [
    {
      kind: "click",
      selector: "button.rdp-button_next, [data-scope='calendar'][data-part='next-button']",
    },
    { kind: "wait", ms: 250 },
  ],
  // Both carousel frames label their next-slide control with the accessible
  // name "Next slide" (shadcn embla-carousel carries it in a `.sr-only` span,
  // the Solidiom carousel sets it as `aria-label`), so `:has-text` matches the
  // ref; the SOL side is addressed by its scoped `data-part` for symmetry.
  "click-carousel-next": [
    {
      kind: "click",
      selector: "button:has-text('Next slide'), [data-scope='carousel'][data-part='next-button']",
    },
    { kind: "wait", ms: 350 },
  ],
  // Both toast demos are triggered by a "Show ... toast" button; the ref's
  // button text is "Show a toast" and the sol island's is
  // "Show notification" (en locale), so match on the shared "Show" prefix.
  "show-toast": [
    // The SOL toast island is `client:visible` and sits below the fold, and its
    // `Root` part (the engine's prime target) does not exist until a toast is
    // shown — so the engine never scrolls it into view and it never hydrates in
    // the first (light) state. Two clicks fix this frame-agnostically: the
    // first click's Playwright auto-scroll makes the trigger visible (firing
    // `client:visible` hydration on the SOL side; a no-op that just re-clicks
    // on the ref, whose handler is bound at load), and a settle wait lets the
    // SOL `$$click` handler bind in its hydration tick; the second click then
    // fires the toast on both frames.
    { kind: "click", selector: "button:has-text('Show')" },
    { kind: "wait", ms: 600 },
    { kind: "click", selector: "button:has-text('Show')" },
    // Wait for the toast to be present AND open on the frame being driven.
    // `li[data-state='open']` is the shadcn (Radix) toast; the Solidiom island
    // renders its toast as a `role='status'` div (no li), which already exists
    // after the 400ms settle, so `waitForSelector` is a no-op there. Without
    // the wait the ref frame captured before its Radix viewport mounted the
    // toast node, so the ref title/description read "(missing element)".
    { kind: "wait", selector: "li[data-state='open'], [role='status']" },
    { kind: "wait", ms: 400 },
  ],
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
