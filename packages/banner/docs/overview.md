---
contentSchemaVersion: 1
title: Banner
description: Dismissible site-wide notification bar.
keywords: [banner, notification, dismissible, alert, feedback, bar, close]
locale: en
maturity: ga
product: Banner
productLayer: primitive
status: draft
package: "@solidiom/banner"
primitive: banner
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Banner provides a dismissible site-wide notification bar. The Close part dismisses the banner when activated.

## Usage

Compose `Root`, `Content`, and `Close`.

```tsx
import * as Banner from "@solidiom/banner"

function AnnouncementBanner() {
  return (
    <Banner.Root>
      <Banner.Content>We've updated our terms of service.</Banner.Content>
      <Banner.Close>Dismiss</Banner.Close>
    </Banner.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/banner`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

banner exposes 3 parts:

- **Root** — `data-part="root"`. Container for the notification bar.
- **Content** — `data-part="content"`. Holds the notification message content.
- **Close** — `data-part="close"`. Dismisses the banner when activated.

## Styling

banner carries `data-scope="banner"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own beyond the Close control, which dismisses the banner when activated.

## Composition

Banner composes with text, links, and inline actions inside its Content, and can be placed at the top of a page layout.

## SSR and hydration

Banner renders static HTML on the server; the Close control activates its dismiss handler on hydration.
