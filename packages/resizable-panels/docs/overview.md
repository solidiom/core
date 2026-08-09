---
contentSchemaVersion: 1
title: Resizable Panels
description: Drag-to-resize panel layout.
keywords: [drag, layout, panel, panels, resizable, resize, runtime]
locale: en
maturity: ga
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: overview
notApplicable:
  - section: relationships
    reason: Resizable Panels has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Drag-to-resize panel layout.

## Usage

Compose `PanelGroup`, `Panel`, `Handle`.

```tsx
import * as ResizablePanels from "@solidiom/resizable-panels"

;<ResizablePanels.PanelGroup>Resizable Panels content</ResizablePanels.PanelGroup>
```

## Installation

Install the package with `pnpm add @solidiom/resizable-panels`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Resizable Panels exposes 3 parts:

- **PanelGroup** — `data-part="panelgroup"`.
- **Panel** — `data-part="panel"`.
- **Handle** — `data-part="handle"`.

## Styling

Resizable Panels carries `data-scope="resizable-panels"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Resizable Panels is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Resizable Panels renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
