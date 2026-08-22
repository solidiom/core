---
contentSchemaVersion: 1
title: Sidebar
description: Collapsible application sidebar navigation panel.
keywords: [sidebar, navigation, collapsible, panel, disclosure, rail]
locale: en
maturity: ga
product: Sidebar
productLayer: primitive
status: draft
package: "@solidiom/sidebar"
primitive: sidebar
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Sidebar is a collapsible application navigation panel with accessible disclosure state and presence management. The `Trigger` toggles collapse/expand, the `Rail` is the thin collapsed handle, and the `Panel` holds the navigation.

## Usage

Compose `Root`, `Panel`, `Trigger`, `Header`, `Content`, `Footer`, and `Rail`. The `Trigger` toggles the collapsed state while the `Panel` contains the navigation.

```tsx
import * as Sidebar from "@solidiom/sidebar"

;<Sidebar.Root>
  <Sidebar.Panel>
    <Sidebar.Header>Logo</Sidebar.Header>
    <Sidebar.Content>{/* navigation */}</Sidebar.Content>
    <Sidebar.Footer>Account</Sidebar.Footer>
  </Sidebar.Panel>
  <Sidebar.Rail />
  <Sidebar.Trigger>Toggle</Sidebar.Trigger>
</Sidebar.Root>
```

## Installation

Install the package with `pnpm add @solidiom/sidebar`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

sidebar exposes 7 parts:

- **Root** — the container managing disclosure state and presence.
- **Panel** — holds the navigation content.
- **Trigger** — toggles collapse/expand.
- **Header** — the top region of the panel.
- **Content** — the main navigation region.
- **Footer** — the bottom region of the panel.
- **Rail** — the thin collapsed handle.

## Styling

sidebar carries `data-scope="sidebar"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

The `Trigger` toggles the collapsed and expanded states using accessible disclosure semantics with presence management; the primitive defines no additional keyboard shortcuts of its own.

## Composition

Compose navigation, link, and button primitives inside `Content` to build the application menu; the Rail provides a compact handle when collapsed.

## SSR and hydration

The panel renders as static HTML with its initial disclosure state on the server; the Trigger and presence handling activate on hydration.
