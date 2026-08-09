---
contentSchemaVersion: 1
title: Alert Dialog
description: Modal confirmation dialog requiring explicit user action.
keywords: [action, alert, confirmation, dialog, explicit, modal, overlay]
locale: en
maturity: ga
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: overview
notApplicable:
  - section: relationships
    reason: Alert Dialog has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Modal confirmation dialog requiring explicit user action.

## Usage

Compose `Root`, `Trigger`, `Portal`, `Content`, `Title`, `Description`, `Cancel`, `Action`.

```tsx
import * as AlertDialog from "@solidiom/alert-dialog"

;<AlertDialog.Root>Alert Dialog content</AlertDialog.Root>
```

## Installation

Install the package with `pnpm add @solidiom/alert-dialog`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Alert Dialog exposes 8 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Portal** — `data-part="portal"`.
- **Content** — `data-part="content"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Cancel** — `data-part="cancel"`.
- **Action** — `data-part="action"`.

## Styling

Alert Dialog carries `data-scope="alert-dialog"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Alert Dialog is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Alert Dialog renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
