---
contentSchemaVersion: 1
title: Calendario básico
description: Cuadrícula interactiva de selección de fechas con navegación por teclado.
keywords: [calendar, date, picker, grid, navigation]
locale: es
maturity: draft
product: Calendar
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "calendar"
section: examples
exampleId: calendar-component-basic
source:
  path: apps/site/src/components/CalendarExample.tsx
  export: CalendarExample
  language: tsx
  runnable: true
translationSourceHash: "b6d0e59e58c8fe9d05075df4f77e745a7514b4c420e1304f156fc51e4f3a6798"
translationStatus: draft
---

El componente Calendar proporciona una cuadrícula interactiva de selección de fechas con navegación por teclado.

```tsx
import { StyledCalendar, Calendar } from "@solidiom/recipes-css"

;<Calendar.Root>
  <Calendar.Header>
    <Calendar.PrevButton />
    <Calendar.Title />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    {(weeks) =>
      weeks.map((week, wi) => (
        <tr key={wi}>
          {week.map((day) => (
            <Calendar.Cell day={day} />
          ))}
        </tr>
      ))
    }
  </Calendar.Grid>
</Calendar.Root>
```
