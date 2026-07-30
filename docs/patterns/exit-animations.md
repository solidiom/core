---
id: exit-animations
title: "Exit Animations via createPresence"
sidebar_label: Exit Animations
description: How overlay and disclosure primitives animate out before DOM removal.
doc_type: how-to
audience: "component authors, consumers styling overlays"
tags: [animation, presence, overlay, disclosure]
lifecycle: current
---

> **Purpose:** For component authors and consumers styling overlays, explains how Solidiom keeps elements mounted during exit animations using `createPresence` + `data-state`, covering all overlay/disclosure primitives.

## Why not `forceMount`?

`forceMount` is a Radix/React pattern that works around React's synchronous unmounting — when a condition becomes false, React removes the subtree before any exit animation can play. Solid 2 does not have this problem. Fine-grained reactivity means the DOM node stays until we explicitly remove it.

Solidiom uses `createPresence` from `@solidiom/runtime` instead. It separates **semantic open state** from **DOM retention**, giving CSS and JS animations time to complete before the node detaches.

## How it works

```
open=true  → phase="entered"  → present=true  → DOM mounted, data-state="open"
open=false → phase="exiting"  → present=true  → DOM still mounted, data-state="closed"
                              (animation plays)
            → phase="exited"  → present=false → DOM removed
```

### In primitive code (already wired)

Every overlay primitive (Dialog, Sheet, Popover, Menu, Tooltip, HoverCard, Accordion, Drawer, ContextMenu) creates presence in its Root:

```tsx
import { createDisclosureState, createPresence } from "@solidiom/runtime"

const { open, requestOpenChange } = createDisclosureState({ ... })
const presence = createPresence({ open, animated: true })

// Portal/Content uses presence.present() to control Show:
<Show when={presence.present()}>
  <Content data-state={open() ? "open" : "closed"} />
</Show>
```

The `data-state` attribute flips to `"closed"` immediately when `open` becomes false, but the element remains in the DOM while `presence.present()` is still true (during the "exiting" phase).

## Styling exit animations (consumer side)

### CSS transitions

```css
[data-scope="dialog"][data-part="content"] {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

[data-scope="dialog"][data-part="content"][data-state="closed"] {
  opacity: 0;
  transform: scale(0.95);
}
```

The element receives `data-state="closed"` → the CSS transition plays → after 200ms the presence state machine detects the transition ended and unmounts the node.

### CSS @keyframes

```css
[data-scope="sheet"][data-part="content"][data-state="open"] {
  animation: sheet-slide-in 300ms ease forwards;
}

[data-scope="sheet"][data-part="content"][data-state="closed"] {
  animation: sheet-slide-out 200ms ease forwards;
}

@keyframes sheet-slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes sheet-slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
```

### solid-motionone (JS animations)

For programmatic animation control, use `solid-motionone`'s `<Presence>` in the **recipe layer**, not the primitive layer:

```tsx
import { Motion, Presence } from "solid-motionone"
import * as Dialog from "@solidiom/dialog"

;<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Presence>
      <Show when={dialogOpen()}>
        <Motion
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Dialog.Content>...</Dialog.Content>
        </Motion>
      </Show>
    </Presence>
  </Dialog.Portal>
</Dialog.Root>
```

## Primitives using createPresence

| Primitive   | Parts with presence | data-state values |
| ----------- | ------------------- | ----------------- |
| Dialog      | Backdrop, Content   | `open` / `closed` |
| Sheet       | Backdrop, Content   | `open` / `closed` |
| AlertDialog | Content             | `open` / `closed` |
| Popover     | Content             | `open` / `closed` |
| Menu        | Content             | `open` / `closed` |
| ContextMenu | Content             | `open` / `closed` |
| Tooltip     | Content             | `open` / `closed` |
| HoverCard   | Content             | `open` / `closed` |
| Drawer      | Content             | `open` / `closed` |
| Accordion   | Content (per item)  | `open` / `closed` |
| Collapsible | Content             | `open` / `closed` |

## Do NOT add `forceMount`

- No primitive should accept a `forceMount` prop.
- The `createPresence` + `data-state` pattern handles all exit animation needs.
- If a consumer needs the element always in the DOM (e.g., for SEO or measuring), they should render it unconditionally and toggle visibility via CSS using `data-state`.

## Testing exit animations

Browser tests for overlay primitives should verify:

```tsx
it("keeps content mounted during exit animation", async () => {
  // Open the dialog
  trigger.click()
  expect(content()).not.toBeNull()

  // Close it
  closeButton.click()

  // Content still in DOM with data-state="closed"
  expect(content()).not.toBeNull()
  expect(content()!.getAttribute("data-state")).toBe("closed")

  // After animation completes, content is removed
  // (In tests without real animations, onExited fires synchronously)
})
```
