import * as Label from "@solidiom/label"

export function LabelDemo() {
  return (
    <div class="flex flex-col gap-3">
      <Label.Root
        htmlFor="email"
        class="text-sm font-medium text-[hsl(var(--foreground))] leading-none"
      >
        Email
      </Label.Root>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        class="h-10 w-full max-w-xs rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
      />
    </div>
  )
}

export const labelDemoCode = `import * as Label from "@solidiom/label"

function LabelExample() {
  return (
    <div class="flex flex-col gap-3">
      <Label.Root htmlFor="email">Email</Label.Root>
      <input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`
