---
"@solidiom/drawer": patch
---

Fix `Drawer.Trigger` and `Drawer.Close` not accepting `class`, `style`, or `aria-label`, which made it effectively impossible to style or label them without nesting another interactive element (e.g. a `Button`) inside them.

Nesting a button-rendering component inside `Drawer.Trigger`/`Drawer.Close` produces invalid HTML (`<button>` cannot contain another `<button>`): browsers silently close the outer `<button>` as soon as the inner one opens, splitting them into siblings in the DOM. The outer element — the one with the actual `onClick` handler that opens/closes the drawer — ends up empty and invisible, while the visible inner button has no wired behavior. Clicking the visible trigger/close button then does nothing.

`Trigger` and `Close` now accept `class`, `style`, and `"aria-label"` and apply them directly to their own `<button>` (also adding `type="button"`), so consumers can style/label the trigger or close control without nesting another interactive element inside it.
