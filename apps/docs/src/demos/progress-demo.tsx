import * as Progress from "@solidiom/progress"

export function ProgressDemo() {
  return (
    <div class="flex flex-col gap-4">
      <Progress.Root
        value={60}
        aria-label="Loading progress"
        class="relative h-4 w-full max-w-xs overflow-hidden rounded-full bg-[hsl(var(--secondary))]"
      >
        <Progress.Indicator
          class="h-full bg-[hsl(var(--primary))] transition-all"
          style={{ width: "60%" }}
        />
      </Progress.Root>
      <Progress.Root
        value={null}
        aria-label="Indeterminate loading"
        class="relative h-4 w-full max-w-xs overflow-hidden rounded-full bg-[hsl(var(--secondary))]"
      >
        <Progress.Indicator class="h-full w-1/3 animate-pulse bg-[hsl(var(--primary))]" />
      </Progress.Root>
    </div>
  )
}

export const progressDemoCode = `import * as Progress from "@solidiom/progress"

function ProgressExample() {
  return (
    <Progress.Root value={60} aria-label="Loading progress">
      <Progress.Indicator style={{ width: "60%" }} />
    </Progress.Root>
  )
}`
