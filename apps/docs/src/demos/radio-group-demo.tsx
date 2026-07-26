import * as RadioGroup from "@solidiom/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup.Root defaultValue="comfortable" class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <RadioGroup.Item
          value="default"
          class="inline-flex size-4 items-center justify-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))] data-[state=checked]:bg-[hsl(var(--primary))]"
        >
          <RadioGroup.Indicator class="size-2 rounded-full bg-[hsl(var(--primary-foreground))]" />
        </RadioGroup.Item>
        <label class="text-sm font-medium text-[hsl(var(--foreground))]">Default</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroup.Item
          value="comfortable"
          class="inline-flex size-4 items-center justify-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))] data-[state=checked]:bg-[hsl(var(--primary))]"
        >
          <RadioGroup.Indicator class="size-2 rounded-full bg-[hsl(var(--primary-foreground))]" />
        </RadioGroup.Item>
        <label class="text-sm font-medium text-[hsl(var(--foreground))]">Comfortable</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroup.Item
          value="compact"
          class="inline-flex size-4 items-center justify-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))] data-[state=checked]:bg-[hsl(var(--primary))]"
        >
          <RadioGroup.Indicator class="size-2 rounded-full bg-[hsl(var(--primary-foreground))]" />
        </RadioGroup.Item>
        <label class="text-sm font-medium text-[hsl(var(--foreground))]">Compact</label>
      </div>
    </RadioGroup.Root>
  )
}

export const radioGroupDemoCode = `import * as RadioGroup from "@solidiom/radio-group"

function RadioGroupExample() {
  return (
    <RadioGroup.Root defaultValue="comfortable">
      <div class="flex items-center gap-2">
        <RadioGroup.Item value="default">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <label>Default</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroup.Item value="comfortable">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <label>Comfortable</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroup.Item value="compact">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <label>Compact</label>
      </div>
    </RadioGroup.Root>
  )
}`
