---
contentSchemaVersion: 1
title: Calendar - Basic usage
description: Basic calendar example demonstrating core behavior.
keywords: [calendar, basic, example]
locale: en
maturity: draft
product: Calendar
productLayer: primitive
status: draft
package: "@solidiom/calendar"
primitive: calendar
section: examples
exampleId: calendar-basic
source:
  path: packages/calendar/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Calendar from "@solidiom/calendar"

;<Calendar.Root onValueChange={(date) => console.log(date)}>
  <Calendar.Header>
    <Calendar.PrevButton />
    <Calendar.Title />
    <Calendar.NextButton />
  </Calendar.Header>

  <Calendar.Grid>
    {(weeks) =>
      weeks.map((week, wi) => (
        <tr key={wi}>
          {week.map((day, di) =>
            day > 0 ? <Calendar.Cell key={`${wi}-${di}`} day={day} /> : <td key={`${wi}-${di}`} />,
          )}
        </tr>
      ))
    }
  </Calendar.Grid>
</Calendar.Root>
```

The Grid renders a table with keyboard navigation (Arrow keys, Home, End, PageUp/PageDown). The Cell component handles selection, focus, today highlighting, and disabled date states.
