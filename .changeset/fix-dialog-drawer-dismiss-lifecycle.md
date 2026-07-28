---
"@solidiom/dialog": patch
"@solidiom/drawer": patch
---

Fix Escape-key dismissal, click-outside dismissal, and focus trapping never activating for `Dialog.Content` / `Drawer.Content` unless the dialog or drawer happened to be open on its very first render.

Both primitives registered their layer-stack/dismissable-layer/focus-scope setup inside a one-shot `onSettled` callback that checked a plain `let contentEl` ref variable. Because the content panel is only mounted once `present()` becomes true (behind a `Show`/`Portal`), and `onSettled` fires once at the component's own mount (before the panel has ever rendered for a closed-by-default dialog/drawer), the ref was always `undefined` when the callback ran — permanently skipping dismissal and focus-trap setup for the overwhelmingly common case of a disclosure that starts closed.

Replaced the one-shot `onSettled` guard with a `createEffect` keyed off a reactive `present()`-gated element signal, so setup (and its cleanup) re-runs every time the content panel actually mounts and unmounts.

No API changes. Consumers get working Escape/outside-click dismissal and focus trapping with no code changes required.
