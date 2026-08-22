---
contentSchemaVersion: 1
title: Basic calendar
description: Interactive date picker grid with keyboard navigation.
keywords: [calendar, date, picker, grid, navigation]
locale: en
maturity: draft
product: Calendar
productLayer: component
status: draft
package: "@solidiom/calendar"
section: examples
exampleId: calendar-component-basic
source:
  path: apps/site/src/components/CalendarExample.tsx
  export: CalendarExample
  language: tsx
  runnable: true
---

The Calendar component provides an interactive date picker grid with keyboard navigation.

```tsx
import * as Calendar from "@solidiom/calendar"

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
