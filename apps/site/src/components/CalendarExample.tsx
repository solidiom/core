import * as Calendar from "@solidiom/calendar"
import type { Locale } from "../lib/locale"

export interface CalendarExampleProps {
  locale: Locale
}

/** Canonical executable source for the Calendar documentation example. */
export function CalendarExample(props: CalendarExampleProps) {
  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="calendar-example"
      data-calendar-example
    >
      <Calendar.Root>
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.Title />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          {(weeks) =>
            weeks.map((week, wi) => (
              <tr>
                {week.map((day) => (
                  <Calendar.Cell day={day} />
                ))}
              </tr>
            ))
          }
        </Calendar.Grid>
      </Calendar.Root>
    </div>
  )
}
