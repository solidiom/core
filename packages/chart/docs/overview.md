---
contentSchemaVersion: 1
title: Chart
description: Data visualization wrapper with accessible fallback table.
keywords: [chart, visualization, canvas, accessible, table, legend, data]
locale: en
maturity: ga
product: Chart
productLayer: primitive
status: draft
package: "@solidiom/chart"
primitive: chart
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chart is an integration shell for data visualization; the actual charting is done by external adapter libraries. Canvas exposes a ref for external libraries to render into, and FallbackTable provides an accessible data table alternative.

## Usage

Compose `Root`, `Canvas`, `FallbackTable`, `Legend`, `Title`, and `Description`.

```tsx
import * as Chart from "@solidiom/chart"

function RevenueChart() {
  return (
    <Chart.Root>
      <Chart.Title>Monthly Revenue</Chart.Title>
      <Chart.Description>Revenue by month for the current year.</Chart.Description>
      <Chart.Canvas />
      <Chart.Legend>
        <span>Revenue</span>
      </Chart.Legend>
      <Chart.FallbackTable>
        <table>
          <tbody>
            <tr>
              <td>January</td>
              <td>$12,000</td>
            </tr>
          </tbody>
        </table>
      </Chart.FallbackTable>
    </Chart.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chart`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chart exposes 6 parts:

- **Root** — `data-part="root"`. Integration shell container for the visualization.
- **Canvas** — `data-part="canvas"`. Exposes a ref for external adapter libraries to render into.
- **FallbackTable** — `data-part="fallbacktable"`. Provides an accessible data table alternative.
- **Legend** — `data-part="legend"`. Displays the chart legend.
- **Title** — `data-part="title"`. Displays the chart title.
- **Description** — `data-part="description"`. Displays the chart description.

## Styling

chart carries `data-scope="chart"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Chart is an integration shell that composes with external adapter charting libraries via the Canvas ref, while pairing with the FallbackTable for accessibility.

## SSR and hydration

Chart renders static structure and the FallbackTable on the server; the Canvas ref becomes available for external libraries to render into after hydration.
