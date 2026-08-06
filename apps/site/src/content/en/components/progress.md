---
contentSchemaVersion: 1
title: Progress
description: Linear progress indicator with determinate and indeterminate modes.
keywords: [progress, indicator, loading, determinate, indeterminate, bar]
locale: en
maturity: draft
product: Progress
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "progress"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Linear progress indicator with determinate and indeterminate modes.

## Usage

The Progress component is a styled recipe wrapper around the `@solidiom/progress` primitive. It provides a visual representation of task completion with semantic styling for the progress track and fill indicator.

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={65}>
  <Progress.Indicator />
</StyledProgress>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/progress` primitive as a peer dependency.

## Anatomy

The Progress component wraps the `@solidiom/progress` primitive. It exposes two parts through a recipe-applied composition layer:

- **Root** — the container element with `role="progressbar"`, rounded track background, and ARIA value attributes.
- **Indicator** — the visual fill element that represents the current progress value.

## Variants & states

Progress supports two states inherited from the primitive:

- **loading** — active progress, value is between 0 and max.
- **complete** — progress has reached its maximum value.

Pass `value={null}` for an indeterminate progress state.

## Styling

Progress is available in css, tailwind, unocss profiles. Each profile applies the same semantic parts and structure, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-progress` namespace for CSS profiling and targeting.

## SSR and hydration

Progress renders as semantic HTML `<div>` elements with `role="progressbar"` during server rendering. No JavaScript is required for rendering; the recipe layer adds no interactive behavior beyond the underlying primitive.

## Accessibility

Progress delegates accessibility to `@solidiom/progress`. The primitive renders with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes. The wrapper adds no behavioral changes that affect accessibility. See the [Progress primitive accessibility contract](/primitives/progress/accessibility/) for the full ARIA contract.