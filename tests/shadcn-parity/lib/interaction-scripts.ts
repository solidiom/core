import type { Page } from "@playwright/test"

export type Action =
  | { kind: "click"; selector: string }
  | { kind: "press"; selector?: string; key: string }
  | { kind: "fill"; selector: string; value: string }
  | { kind: "hover"; selector: string }
  | { kind: "wait"; selector?: string; ms?: number }

/**
 * Deterministic interaction scripts, keyed by name. The SAME name drives both
 * frames identically, so a per-interaction behavior diff is concrete.
 *
 * Selectors are best-effort generic (role- + data-part-based). Per-component
 * Phase A passes refine the selectors (a `selectors` override in the mapping)
 * so the script targets the real element; the generic defaults keep this file
 * DRY and let simple components work unmodified.
 */
export const scripts: Record<string, Action[]> = {
  // state-advancing scripts used by `states` entries
  open: [{ kind: "click", selector: "[data-part='trigger'], [role='combobox'], button" }],
  "close-esc": [
    { kind: "click", selector: "[data-part='trigger'], button" },
    { kind: "press", key: "Escape" },
  ],
  "close-overlay-click": [
    { kind: "click", selector: "[data-part='trigger'], button" },
    { kind: "click", selector: "body" },
  ],
  focus: [{ kind: "click", selector: "input, [role='slider'], [role='switch']" }],
  hover: [{ kind: "hover", selector: "button, [role='switch'], [role='slider']" }],
  active: [{ kind: "click", selector: "button, [role='switch'], [role='slider']" }],
  "select-item": [
    { kind: "click", selector: "[role='combobox'], [data-part='trigger'], button" },
    { kind: "press", key: "ArrowDown" },
    { kind: "press", key: "Enter" },
  ],
  reset: [{ kind: "wait", ms: 50 }],
}

/** Drive the named script into one page. Throws on an unknown script name. */
export async function runInteractions(page: Page, name: string): Promise<void> {
  const steps = scripts[name]
  if (!steps) throw new Error(`Unknown interaction script: ${name}`)
  for (const a of steps) {
    if (a.kind === "click") await page.click(a.selector)
    else if (a.kind === "hover") await page.hover(a.selector)
    else if (a.kind === "fill") await page.fill(a.selector, a.value)
    else if (a.kind === "press")
      if (a.selector) await page.locator(a.selector).press(a.key)
      else await page.keyboard.press(a.key)
    else if (a.kind === "wait")
      await (a.selector ? page.waitForSelector(a.selector) : page.waitForTimeout(a.ms ?? 50))
  }
}
