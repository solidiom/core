import * as Button from "@solidiom/button"

export function ButtonDemo() {
  return (
    <div class="flex items-center gap-3">
      <Button.Root class="inline-flex h-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow transition-colors hover:bg-[hsl(var(--primary)/0.9)]">
        Primary
      </Button.Root>
      <Button.Root class="inline-flex h-10 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
        Secondary
      </Button.Root>
      <Button.Root
        disabled
        class="inline-flex h-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow opacity-50 cursor-not-allowed"
      >
        Disabled
      </Button.Root>
    </div>
  )
}

export const buttonDemoCode = `import * as Button from "@solidiom/button"

function ButtonExample() {
  return (
    <div class="flex items-center gap-3">
      <Button.Root>Primary</Button.Root>
      <Button.Root variant="secondary">Secondary</Button.Root>
      <Button.Root disabled>Disabled</Button.Root>
    </div>
  )
}`
