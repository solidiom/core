---
contentSchemaVersion: 1
title: Time Input
description: Segmented time entry with hour, minute, second fields and AM/PM toggle.
keywords: [time input, segmented, hour, minute, second, spinbutton, am pm]
locale: en
maturity: ga
product: Time Input
productLayer: primitive
status: draft
package: "@solidiom/time-input"
primitive: time-input
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Time Input is an accessible segmented time entry with hour, minute, second fields and an AM/PM toggle. It provides spinbutton semantics, keyboard navigation, auto-advance, and native form participation.

## Usage

Compose `Root`, `Segment`, and `Separator`. The `Segment` is repeated for hour, minute, second, and period, with `Separator` between segments.

```tsx
import * as TimeInput from "@solidiom/time-input"

;<TimeInput.Root>
  <TimeInput.Segment />
  <TimeInput.Separator>:</TimeInput.Separator>
  <TimeInput.Segment />
  <TimeInput.Separator>:</TimeInput.Separator>
  <TimeInput.Segment />
  <TimeInput.Segment />
</TimeInput.Root>
```

## Installation

Install the package with `pnpm add @solidiom/time-input`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

time-input exposes 3 parts:

- **Root** — the container managing segment state and native form participation.
- **Segment** — a single time segment, repeated for hour/minute/second/period.
- **Separator** — the divider rendered between segments.

## Styling

time-input carries `data-scope="time-input"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

time-input provides spinbutton semantics per segment with auto-advance.

| Key       | Behavior                                       |
| --------- | ---------------------------------------------- |
| ArrowUp   | Adjust the focused segment up                  |
| ArrowDown | Adjust the focused segment down                |
| Left      | Move to the previous segment                   |
| Right     | Move to the next segment                       |
| Digits    | Type values into the segment with auto-advance |

## Composition

Compose with label and field primitives to build a labeled, validated time control; native form participation is handled by the Root.

## SSR and hydration

The segments render as static HTML on the server and participate in native forms; spinbutton keyboard handling and auto-advance activate on hydration.
