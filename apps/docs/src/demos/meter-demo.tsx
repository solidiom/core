import * as Meter from "@solidiom/meter"

export function MeterDemo() {
  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <span class="text-sm font-medium text-[hsl(var(--foreground))]">Storage usage</span>
        <Meter.Root
          value={0.7}
          min={0}
          max={1}
          low={0.25}
          high={0.75}
          optimum={0.5}
          class="h-2 w-full max-w-xs"
        />
        <span class="text-xs text-[hsl(var(--muted-foreground))]">70% used</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-sm font-medium text-[hsl(var(--foreground))]">Battery</span>
        <Meter.Root
          value={0.3}
          min={0}
          max={1}
          low={0.25}
          high={0.75}
          optimum={1}
          class="h-2 w-full max-w-xs"
        />
        <span class="text-xs text-[hsl(var(--muted-foreground))]">30% remaining</span>
      </div>
    </div>
  )
}

export const meterDemoCode = `import * as Meter from "@solidiom/meter"

function MeterExample() {
  return (
    <div class="flex flex-col gap-1">
      <span>Storage usage</span>
      <Meter.Root value={0.7} min={0} max={1} low={0.25} high={0.75} optimum={0.5} />
      <span>70% used</span>
    </div>
  )
}`
