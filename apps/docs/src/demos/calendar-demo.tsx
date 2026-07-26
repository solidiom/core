import * as Calendar from "@solidiom/calendar"
import { createSignal, For } from "solid-js"

export function CalendarDemo() {
  const [value, setValue] = createSignal<number | null>(null)

  return (
    <div class="w-full max-w-xs">
      <Calendar.Root onValueChange={(v) => setValue(v)}>
        <Calendar.Header>
          <div class="flex items-center justify-between px-2 py-2">
            <Calendar.PrevButton>
              <span class="inline-flex size-8 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronLeftIcon />
              </span>
            </Calendar.PrevButton>
            <Calendar.Title>
              <span class="text-sm font-medium text-[hsl(var(--foreground))]" />
            </Calendar.Title>
            <Calendar.NextButton>
              <span class="inline-flex size-8 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronRightIcon />
              </span>
            </Calendar.NextButton>
          </div>
        </Calendar.Header>
        <Calendar.Grid>
          {(weeks) => (
            <>
              <For each={weeks}>
                {(week) => (
                  <tr>
                    <For each={week}>
                      {(day) =>
                        day > 0 ? (
                          <Calendar.Cell day={day}>
                            <span
                              class={`inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-[hsl(var(--accent))] ${
                                value() === day
                                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                  : "text-[hsl(var(--foreground))]"
                              }`}
                            >
                              {day}
                            </span>
                          </Calendar.Cell>
                        ) : (
                          <td />
                        )
                      }
                    </For>
                  </tr>
                )}
              </For>
            </>
          )}
        </Calendar.Grid>
      </Calendar.Root>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export const calendarDemoCode = `import * as Calendar from "@solidiom/calendar"
import { For } from "solid-js"

function CalendarExample() {
  return (
    <Calendar.Root onValueChange={(day) => console.log(day)}>
      <Calendar.Header>
        <Calendar.PrevButton>←</Calendar.PrevButton>
        <Calendar.Title />
        <Calendar.NextButton>→</Calendar.NextButton>
      </Calendar.Header>
      <Calendar.Grid>
        {(weeks) => (
          <For each={weeks}>
            {(week) => (
              <tr>
                <For each={week}>
                  {(day) =>
                    day > 0 ? <Calendar.Cell day={day} /> : <td />
                  }
                </For>
              </tr>
            )}
          </For>
        )}
      </Calendar.Grid>
    </Calendar.Root>
  )
}`
