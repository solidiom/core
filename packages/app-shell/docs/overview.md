---
contentSchemaVersion: 1
title: App Shell
description: Top-level application layout with header, sidebar, and main content areas.
keywords: [app-shell, layout, header, sidebar, main, footer]
locale: en
maturity: ga
product: App Shell
productLayer: primitive
status: draft
package: "@solidiom/app-shell"
primitive: app-shell
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

App Shell provides a top-level application layout that arranges a header, sidebar, main content area, and footer into a coherent page structure. It is a purely structural primitive that owns layout regions and their semantic landmarks.

## Usage

Compose `Root`, `Header`, `Sidebar`, `Main`, and `Footer`.

```tsx
import * as AppShell from "@solidiom/app-shell"

;<AppShell.Root>
  <AppShell.Header>Header</AppShell.Header>
  <AppShell.Sidebar>Navigation</AppShell.Sidebar>
  <AppShell.Main>Page content</AppShell.Main>
  <AppShell.Footer>Footer</AppShell.Footer>
</AppShell.Root>
```

## Installation

Install the package with `pnpm add @solidiom/app-shell`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

App Shell exposes 5 parts:

- **Root** — `data-part="root"`. The layout container.
- **Header** — `data-part="header"`. Top application bar region.
- **Sidebar** — `data-part="sidebar"`. Side navigation region.
- **Main** — `data-part="main"`. Primary content region.
- **Footer** — `data-part="footer"`. Bottom region.

## Styling

App Shell carries `data-scope="app-shell"` and `data-part` attributes on each part for CSS/recipe targeting. Style the root as a grid or flex layout and position the regions using the data attributes.

## Keyboard & behavior

This primitive has no keyboard interaction of its own. It renders structural regions; interactive behavior belongs to the content placed inside each region.

## Composition

App Shell is designed to host other primitives. Place a `Sidebar` navigation, `Banner`, `Breadcrumb`, or any content primitive within its regions.

## SSR and hydration

App Shell is a passive layout element with no interactive state. It renders as static HTML and requires no client-side hydration.
