import * as Select from "@solidiom/select"

export function SelectDemo() {
  return (
    <Select.Root>
      <Select.Trigger>
        <span class="inline-flex items-center justify-between rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] min-w-[180px] hover:bg-[hsl(var(--accent))] transition-colors">
          <Select.Value placeholder="Select a fruit" />
        </span>
      </Select.Trigger>
      <Select.Content class="z-50 min-w-[180px] overflow-hidden rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1 shadow-md">
        <Select.Item value="apple">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Apple
          </span>
        </Select.Item>
        <Select.Item value="banana">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Banana
          </span>
        </Select.Item>
        <Select.Item value="cherry">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Cherry
          </span>
        </Select.Item>
        <Select.Item value="grape">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Grape
          </span>
        </Select.Item>
      </Select.Content>
      <Select.HiddenInput name="fruit" />
    </Select.Root>
  )
}

export const selectDemoCode = `import * as Select from "@solidiom/select"

function SelectExample() {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
        <Select.Item value="grape">Grape</Select.Item>
      </Select.Content>
      <Select.HiddenInput name="fruit" />
    </Select.Root>
  )
}`
