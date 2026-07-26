import * as ToggleGroup from "@solidiom/toggle-group"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup.Root
      type="single"
      defaultValue={["center"]}
      class="inline-flex rounded-md border border-[hsl(var(--border))]"
    >
      <ToggleGroup.Item
        value="left"
        class="inline-flex h-10 w-10 items-center justify-center text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] data-[state=on]:bg-[hsl(var(--accent))] data-[state=on]:text-[hsl(var(--accent-foreground))] first:rounded-l-md last:rounded-r-md"
      >
        L
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="center"
        class="inline-flex h-10 w-10 items-center justify-center text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] data-[state=on]:bg-[hsl(var(--accent))] data-[state=on]:text-[hsl(var(--accent-foreground))]"
      >
        C
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="right"
        class="inline-flex h-10 w-10 items-center justify-center text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] data-[state=on]:bg-[hsl(var(--accent))] data-[state=on]:text-[hsl(var(--accent-foreground))] first:rounded-l-md last:rounded-r-md"
      >
        R
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

export const toggleGroupDemoCode = `import * as ToggleGroup from "@solidiom/toggle-group"

function ToggleGroupExample() {
  return (
    <ToggleGroup.Root type="single" defaultValue={["center"]}>
      <ToggleGroup.Item value="left">L</ToggleGroup.Item>
      <ToggleGroup.Item value="center">C</ToggleGroup.Item>
      <ToggleGroup.Item value="right">R</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}`
