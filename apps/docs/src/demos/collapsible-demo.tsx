import * as Collapsible from "@solidiom/collapsible"

export function CollapsibleDemo() {
  return (
    <div class="w-full max-w-sm">
      <Collapsible.Root>
        <div class="flex items-center justify-between rounded-md border border-[hsl(var(--border))] px-4 py-2">
          <span class="text-sm font-medium text-[hsl(var(--foreground))]">3 items tagged</span>
          <Collapsible.Trigger>
            <span class="inline-flex size-7 items-center justify-center rounded-md hover:bg-[hsl(var(--accent))] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4 text-[hsl(var(--muted-foreground))]"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content>
          <div class="mt-2 space-y-2">
            <div class="rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm text-[hsl(var(--foreground))]">
              @solidiom/dialog
            </div>
            <div class="rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm text-[hsl(var(--foreground))]">
              @solidiom/accordion
            </div>
            <div class="rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm text-[hsl(var(--foreground))]">
              @solidiom/tabs
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export const collapsibleDemoCode = `import * as Collapsible from "@solidiom/collapsible"

function CollapsibleExample() {
  return (
    <Collapsible.Root>
      <div class="flex items-center justify-between">
        <span>3 items tagged</span>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div>@solidiom/dialog</div>
        <div>@solidiom/accordion</div>
        <div>@solidiom/tabs</div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}`
