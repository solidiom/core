import * as VisuallyHidden from "@solidiom/visually-hidden"

export function VisuallyHiddenDemo() {
  return (
    <div class="flex items-center gap-3">
      <button class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-transparent text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent))]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="M12 3v18M3 12h18" />
        </svg>
        <VisuallyHidden.Root>Add item</VisuallyHidden.Root>
      </button>
      <span class="text-sm text-[hsl(var(--muted-foreground))]">
        Icon button with visually hidden label (inspect to see)
      </span>
    </div>
  )
}

export const visuallyHiddenDemoCode = `import * as VisuallyHidden from "@solidiom/visually-hidden"

function VisuallyHiddenExample() {
  return (
    <button>
      <PlusIcon />
      <VisuallyHidden.Root>Add item</VisuallyHidden.Root>
    </button>
  )
}`
