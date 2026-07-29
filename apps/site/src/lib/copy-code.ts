/**
 * Copy-to-clipboard wiring for code blocks (SITE-008).
 *
 * Pairs with shiki-copy-button.ts, which renders one
 * `<button data-copy-code data-code="...">` per code block at build time.
 * This is a single delegated click listener rather than one hydrated
 * Solid component per block: the behavior (read `data-code`, write to
 * `navigator.clipboard`, show a transient "Copied" state) is generic and
 * needs no per-block state beyond a CSS attribute, so paying for a JS
 * framework runtime per code block would be pure overhead. Kept out of
 * BaseLayout's inline bootstrap script (that one must stay tiny and
 * synchronous, pre-paint) and instead loaded as a deferred module script
 * from DocsLayout, since copy controls only exist on prose/article routes.
 */

const COPIED_LABEL = "Copied"
const COPY_FAILED_LABEL = "Copy failed"
const DEFAULT_LABEL = "Copy"
const DEFAULT_ARIA_LABEL = "Copy code to clipboard"
const COPIED_RESET_MS = 2000

function resetButton(button: HTMLButtonElement, label: HTMLElement | null) {
  button.removeAttribute("data-copy-state")
  button.setAttribute("aria-label", DEFAULT_ARIA_LABEL)
  if (label) label.textContent = DEFAULT_LABEL
}

async function copyCode(button: HTMLButtonElement) {
  const code = button.getAttribute("data-code") ?? ""
  const label = button.querySelector<HTMLElement>("[data-copy-label]")

  try {
    await navigator.clipboard.writeText(code)
    button.setAttribute("data-copy-state", "copied")
    button.setAttribute("aria-label", "Code copied to clipboard")
    if (label) label.textContent = COPIED_LABEL
    window.setTimeout(() => resetButton(button, label), COPIED_RESET_MS)
  } catch {
    button.setAttribute("data-copy-state", "error")
    button.setAttribute("aria-label", "Unable to copy code")
    if (label) label.textContent = COPY_FAILED_LABEL
    window.setTimeout(() => resetButton(button, label), COPIED_RESET_MS)
  }
}

export function initCopyCodeButtons(root: ParentNode = document): void {
  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>("[data-copy-code]")
    if (!button) return
    void copyCode(button)
  })
}
