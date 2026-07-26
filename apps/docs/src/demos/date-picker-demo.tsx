import * as DatePicker from "@solidiom/date-picker"

export function DatePickerDemo() {
  return (
    <DatePicker.Root>
      <div class="flex items-center gap-2">
        <DatePicker.Input
          class="rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          placeholder="Select a date"
        />
        <DatePicker.Trigger>
          <span class="inline-flex items-center rounded-md border border-[hsl(var(--input))] px-3 py-2 text-sm hover:bg-[hsl(var(--accent))] transition-colors">
            📅
          </span>
        </DatePicker.Trigger>
      </div>
      <DatePicker.Content class="mt-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-lg">
        <DatePicker.Calendar>
          <DatePicker.Header>
            <span class="text-sm font-medium">Calendar</span>
          </DatePicker.Header>
          <DatePicker.Grid>
            {(weeks) => (
              <table class="w-full border-collapse">
                <tbody>
                  {weeks().map((week) => (
                    <tr>
                      {week.map((day) => (
                        <DatePicker.Cell
                          day={day}
                          class="p-2 text-center text-sm hover:bg-[hsl(var(--accent))] rounded cursor-pointer"
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </DatePicker.Grid>
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Root>
  )
}

export const datePickerDemoCode = `import * as DatePicker from "@solidiom/date-picker"

function DatePickerExample() {
  return (
    <DatePicker.Root>
      <DatePicker.Input placeholder="Select a date" />
      <DatePicker.Trigger>📅</DatePicker.Trigger>
      <DatePicker.Content>
        <DatePicker.Calendar>
          <DatePicker.Header />
          <DatePicker.Grid>
            {(weeks) => /* render week rows + DatePicker.Cell */}
          </DatePicker.Grid>
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Root>
  )
}`
