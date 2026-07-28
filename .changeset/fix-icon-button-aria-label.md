---
"@solidiom/button": patch
---

Fix `IconButton` never forwarding `aria-label` to the rendered `<button>` element. Every `IconButton` consumer previously rendered an icon-only button with no accessible name. `Button.Root` now accepts an optional `aria-label` prop and applies it, and `IconButton` forwards its (required) `aria-label` through.

No API changes for existing callers — `aria-label` was already a required prop on `IconButtonProps`, it just wasn't reaching the DOM.
