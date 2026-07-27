import * as Calendar from "@solidiom/calendar"
import { createSignal, For } from "solid-js"
import type { RangeValue } from "@solidiom/calendar"

export function RangeCalendarDemo() {
  const [range, setRange] = createSignal<RangeValue | undefined>(undefined)

  return (
    <div class="w-full max-w-xs">
      <Calendar.RangeRoot onValueChange={(r) => setRange(r)}>
        <Calendar.RangeHeader>
          <div class="flex items-center justify-between px-2 py-2">
            <Calendar.RangePrevButton>
              <span class="inline-flex size-8 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronLeftIcon />
              </span>
            </Calendar.RangePrevButton>
            <Calendar.RangeTitle>
              <span class="text-sm font-medium text-[hsl(var(--foreground))]" />
            </Calendar.RangeTitle>
            <Calendar.RangeNextButton>
              <span class="inline-flex size-8 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
                <ChevronRightIcon />
              </span>
            </Calendar.RangeNextButton>
          </div>
        </Calendar.RangeHeader>
        <Calendar.RangeGrid>
          {(weeks) => (
            <>
              <For each={weeks}>
                {(week) => (
                  <tr>
                    <For each={week}>
                      {(day) =>
                        day > 0 ? (
                          <Calendar.RangeCell day={day}>
                            <span class="inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] data-[in-range]:bg-[hsl(var(--accent))] data-[range-start]:bg-[hsl(var(--primary))] data-[range-start]:text-[hsl(var(--primary-foreground))] data-[range-end]:bg-[hsl(var(--primary))] data-[range-end]:text-[hsl(var(--primary-foreground))]">
                              {day}
                            </span>
                          </Calendar.RangeCell>
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
        </Calendar.RangeGrid>
      </Calendar.RangeRoot>
      {range() && (
        <p class="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          Selected: {range()!.start.month}/{range()!.start.day}/{range()!.start.year}
          {range()!.end && ` – ${range()!.end!.month}/${range()!.end!.day}/${range()!.end!.year}`}
        </p>
      )}
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

export const rangeCalendarDemoCode = `import * as Calendar from "@solidiom/calendar"
import { createSignal, For } from "solid-js"
import type { RangeValue } from "@solidiom/calendar"

function RangeCalendarExample() {
  const [range, setRange] = createSignal<RangeValue | undefined>()

  return (
    <Calendar.RangeRoot onValueChange={(r) => setRange(r)}>
      <Calendar.RangeHeader>
        <Calendar.RangePrevButton>←</Calendar.RangePrevButton>
        <Calendar.RangeTitle />
        <Calendar.RangeNextButton>→</Calendar.RangeNextButton>
      </Calendar.RangeHeader>
      <Calendar.RangeGrid>
        {(weeks) => (
          <For each={weeks}>
            {(week) => (
              <tr>
                <For each={week}>
                  {(day) =>
                    day > 0 ? <Calendar.RangeCell day={day} /> : <td />
                  }
                </For>
              </tr>
            )}
          </For>
        )}
      </Calendar.RangeGrid>
    </Calendar.RangeRoot>
  )
}`
