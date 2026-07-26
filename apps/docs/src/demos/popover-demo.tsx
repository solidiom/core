import * as Popover from "@solidiom/popover"

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger class="inline-flex h-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow transition-colors hover:bg-[hsl(var(--primary)/0.9)]">
        Open Popover
      </Popover.Trigger>
      <Popover.Content>
        <div class="w-72 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-4 text-[hsl(var(--popover-foreground))] shadow-md">
          <div class="flex flex-col gap-2">
            <h4 class="text-sm font-semibold leading-none">Dimensions</h4>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">
              Set the dimensions for the layer.
            </p>
          </div>
          <Popover.Close class="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            ✕
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}

export const popoverDemoCode = `import * as Popover from "@solidiom/popover"

function PopoverExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Content>
        <h4>Dimensions</h4>
        <p>Set the dimensions for the layer.</p>
        <Popover.Close>✕</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  )
}`
