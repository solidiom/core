---
contentSchemaVersion: 1
title: Basic date picker
description: Date picker component with text input and calendar overlay.
keywords: [date-picker, calendar, date, form]
locale: en
maturity: draft
product: Date Picker
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "date-picker"
section: examples
exampleId: date-picker-component-basic
source:
  path: apps/site/src/components/DatePickerExample.tsx
  export: DatePickerExample
  language: tsx
runnable: true
---

The Date Picker component combines a text input with a calendar overlay for selecting dates.

```tsx
import { StyledDatePicker, DatePicker } from "@solidiom/recipes-css"

;<DatePicker.Root>
  <DatePicker.Input placeholder="Select a date" />
  <DatePicker.Trigger>
    <button type="button">📅</button>
  </DatePicker.Trigger>
  <DatePicker.Content>
    <DatePicker.Calendar>
      <DatePicker.Header />
      <DatePicker.Grid>
        {(weeks) =>
          weeks().map((week, wi) => (
            <tr key={wi}>
              {week.map((day) => (
                <DatePicker.Cell day={day} />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```
