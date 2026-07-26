import * as Tooltip from "@solidiom/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <button class="inline-flex h-10 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
          Hover me
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <div class="rounded-md bg-[hsl(var(--popover))] px-3 py-1.5 text-xs text-[hsl(var(--popover-foreground))] shadow-md border border-[hsl(var(--border))]">
          Add to library
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export const tooltipDemoCode = `import * as Tooltip from "@solidiom/tooltip"

function TooltipExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <button>Hover me</button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Add to library
      </Tooltip.Content>
    </Tooltip.Root>
  )
}`
