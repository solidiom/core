---
contentSchemaVersion: 1
title: Calendar
description: Styled calendar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the calendar primitive.
keywords: [calendar, date, picker, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Calendar
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "calendar"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled calendar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the calendar primitive.

## Usage

The Calendar component is a styled recipe wrapper around the `@solidiom/calendar` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Calendar from "@solidiom/recipes-css"

;<Calendar.Root>
  <Calendar.Header>
    <Calendar.PrevTrigger />
    <Calendar.ViewTrigger />
    <Calendar.NextTrigger />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader />
    <Calendar.GridBody />
  </Calendar.Grid>
</Calendar.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/calendar` primitive as a peer dependency.

## Anatomy

The Calendar component wraps the `@solidiom/calendar` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages calendar state.
- **Header** — the navigation bar with month/year controls.
- **PrevTrigger** — navigates to the previous month.
- **NextTrigger** — navigates to the next month.
- **ViewTrigger** — switches between day/month/year views.
- **Grid** — the calendar grid container.
- **GridHeader** — the day-of-week header row.
- **GridBody** — the grid body containing day cells.

## Variants & states

Calendar inherits its variant and state support from `@solidiom/calendar`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Calendar is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-calendar` namespace for CSS profiling and targeting.

## SSR and hydration

Calendar renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Calendar delegates accessibility to `@solidiom/calendar`. See the [Calendar primitive accessibility contract](/primitives/calendar/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
