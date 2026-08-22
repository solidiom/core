---
contentSchemaVersion: 1
title: Status Dot
description: Small colored dot indicating presence or status.
keywords: [status dot, presence, indicator, status, dot, feedback]
locale: en
maturity: ga
product: Status Dot
productLayer: primitive
status: draft
package: "@solidiom/status-dot"
primitive: status-dot
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Status Dot is a small colored dot that indicates presence or status. It is a passive presence indicator.

## Usage

Status Dot has a single `Root` part. Render it inline to indicate presence or status.

```tsx
import * as StatusDot from "@solidiom/status-dot"

;<StatusDot.Root />
```

## Installation

Install the package with `pnpm add @solidiom/status-dot`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

status-dot has a single `Root` part. It is a presence indicator dot.

## Styling

status-dot carries `data-scope="status-dot"` and a `data-part="root"` attribute for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Place alongside avatars, list items, or labels to convey presence or status.

## SSR and hydration

Status Dot renders static HTML and requires no hydration.
