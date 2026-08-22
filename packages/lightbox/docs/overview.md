---
contentSchemaVersion: 1
title: Lightbox
description: Image and media overlay viewer with navigation controls.
keywords: [lightbox, overlay, image, media, viewer, navigation, gallery]
locale: en
maturity: ga
product: Lightbox
productLayer: primitive
status: draft
package: "@solidiom/lightbox"
primitive: lightbox
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Lightbox is an image and media overlay viewer with navigation controls. It supports keyboard-driven navigation and dismissal.

## Usage

Compose `Root`, `Backdrop`, `Content`, `Image`, `CloseButton`, `NextButton`, `PrevButton`, and `Counter`.

```tsx
import * as Lightbox from "@solidiom/lightbox"

function MediaViewer() {
  return (
    <Lightbox.Root>
      <Lightbox.Backdrop />
      <Lightbox.Content>
        <Lightbox.CloseButton>Close</Lightbox.CloseButton>
        <Lightbox.PrevButton>Prev</Lightbox.PrevButton>
        <Lightbox.Image src="/photos/1.jpg" alt="Photo 1" />
        <Lightbox.NextButton>Next</Lightbox.NextButton>
        <Lightbox.Counter>1 / 12</Lightbox.Counter>
      </Lightbox.Content>
    </Lightbox.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/lightbox`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

lightbox exposes 8 parts:

- **Root** — `data-part="root"`. Overlay viewer container.
- **Backdrop** — `data-part="backdrop"`. Backdrop behind the viewer content.
- **Content** — `data-part="content"`. Holds the media and controls.
- **Image** — `data-part="image"`. Displays the current image or media.
- **CloseButton** — `data-part="closebutton"`. Closes the lightbox.
- **NextButton** — `data-part="nextbutton"`. Advances to the next item.
- **PrevButton** — `data-part="prevbutton"`. Returns to the previous item.
- **Counter** — `data-part="counter"`. Displays the current position within the set.

## Styling

lightbox carries `data-scope="lightbox"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

| Key        | Behavior                        |
| ---------- | ------------------------------- |
| Escape     | Closes the lightbox.            |
| ArrowRight | Navigates to the next item.     |
| ArrowLeft  | Navigates to the previous item. |

## Composition

Lightbox composes with galleries and media grids, opening over page content to present a focused viewer.

## SSR and hydration

Lightbox renders its markup on the server and activates navigation and dismissal handlers on hydration.
