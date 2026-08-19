import * as DatePicker from "@solidiom/date-picker"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { placeholder: string }> = {
  en: { placeholder: "Select a date" },
  es: { placeholder: "Seleccione una fecha" },
}

export interface DatePickerExampleProps {
  locale: Locale
}

/** Canonical executable source for the Date Picker documentation example. */
export function DatePickerExample(props: DatePickerExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="date-picker-example"
      data-date-picker-example
    >
      <DatePicker.Root>
        <DatePicker.Input placeholder={copy().placeholder} />
        <DatePicker.Trigger>
          <button type="button">📅</button>
        </DatePicker.Trigger>
        <DatePicker.Content>
          <DatePicker.Calendar>
            <DatePicker.Header />
            <DatePicker.Grid weekStartsOn={0}>
              {(weeks) =>
                weeks().map((week: number[], wi: number) => (
                  <tr>
                    {week.map((day: number) => (
                      <DatePicker.Cell day={day} />
                    ))}
                  </tr>
                ))
              }
            </DatePicker.Grid>
          </DatePicker.Calendar>
        </DatePicker.Content>
      </DatePicker.Root>
    </div>
  )
}
