---
contentSchemaVersion: 1
title: Link
description: Styled anchor with router integration and safety validation.
keywords: [link, anchor, router, href, external, sanitization, navigation]
locale: en
maturity: ga
product: Link
productLayer: primitive
status: draft
package: "@solidiom/link"
primitive: link
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Link is a styled anchor with router integration and safety validation. It provides href sanitization and external link support.

## Usage

Link has a single `Root` part.

```tsx
import * as Link from "@solidiom/link"

function Nav() {
  return <Link.Root href="https://example.com">Visit example</Link.Root>
}
```

## Installation

Install the package with `pnpm add @solidiom/link`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Link has a single `Root` part carrying `data-part="root"`, a styled anchor with href sanitization and external link support.

## Styling

link carries `data-scope="link"` and a `data-part` attribute on its Root for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own beyond native anchor activation.

## Composition

Link composes anywhere inline navigation is needed, integrating with the router and safely handling external hrefs.

## SSR and hydration

Link renders as a standard anchor on the server and activates router integration on hydration.
