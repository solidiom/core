---
contentSchemaVersion: 1
title: Selector de fecha básico
description: Componente de selector de fecha con campo de texto y superposición de calendario.
keywords: [date-picker, calendar, date, form]
locale: es
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
translationSourceHash: "4ba3f7a7ea20104370b52948b5bfc622564dafee75a18eba367c3b32bb2ad4bf"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Date Picker combina un campo de texto con una superposición de calendario para seleccionar fechas.

```tsx
import { StyledDatePicker, DatePicker } from "@solidiom/recipes-css"

;<DatePicker.Root>
  <DatePicker.Input placeholder="Seleccione una fecha" />
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
