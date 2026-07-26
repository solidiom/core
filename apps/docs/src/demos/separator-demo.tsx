import * as Separator from "@solidiom/separator"

export function SeparatorDemo() {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <h4 class="text-sm font-medium text-[hsl(var(--foreground))]">Section Title</h4>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Description of the section above.</p>
      </div>
      <Separator.Root class="h-px w-full bg-[hsl(var(--border))]" />
      <div class="flex h-5 items-center gap-3 text-sm">
        <span>Blog</span>
        <Separator.Root orientation="vertical" class="h-full w-px bg-[hsl(var(--border))]" />
        <span>Docs</span>
        <Separator.Root orientation="vertical" class="h-full w-px bg-[hsl(var(--border))]" />
        <span>Source</span>
      </div>
    </div>
  )
}

export const separatorDemoCode = `import * as Separator from "@solidiom/separator"

function SeparatorExample() {
  return (
    <div>
      <p>Content above</p>
      <Separator.Root />
      <div class="flex items-center gap-3">
        <span>Blog</span>
        <Separator.Root orientation="vertical" />
        <span>Docs</span>
      </div>
    </div>
  )
}`
