---
contentSchemaVersion: 1
title: Date Picker - Basic usage
description: Basic date picker example demonstrating core behavior.
keywords: [date-picker, basic, example]
locale: en
maturity: draft
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: examples
exampleId: date-picker-basic
source:
  path: packages/date-picker/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as DatePicker from "@solidiom/date-picker"

;<DatePicker.Root onValueChange={(date) => console.log(date)}>
  <DatePicker.Input placeholder="Select a date" />

  <DatePicker.Trigger>
    📅
  </DatePicker.Trigger>

  <DatePicker.Content>
    <DatePicker.Calendar>
      <DatePicker.Header />

      <DatePicker.Grid>
        {(weeks) =>
          weeks().map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) =>
                day > 0 ? (
                  <DatePicker.Cell key={`${wi}-${di}`} day={day} />
                ) : (
                  <td key={`${wi}-${di}`} />
                )
              )}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

The Input displays the selected date as read-only text. The Trigger opens the calendar popup. The Content handles dismissable layer and focus trapping. Use `isDateDisabled` to restrict selectable dates.
