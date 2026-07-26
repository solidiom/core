import * as Checkbox from "@solidiom/checkbox"

export function CheckboxDemo() {
  return (
    <div class="flex items-center gap-3">
      <Checkbox.Root class="inline-flex size-4 items-center justify-center rounded-sm border border-[hsl(var(--primary))] ring-offset-[hsl(var(--background))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))]">
        <Checkbox.Indicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label class="text-sm font-medium text-[hsl(var(--foreground))] leading-none">
        Accept terms and conditions
      </label>
    </div>
  )
}

export const checkboxDemoCode = `import * as Checkbox from "@solidiom/checkbox"

function CheckboxExample() {
  return (
    <div class="flex items-center gap-3">
      <Checkbox.Root>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label>Accept terms and conditions</label>
    </div>
  )
}`
