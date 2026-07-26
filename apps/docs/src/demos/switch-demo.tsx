import * as Switch from "@solidiom/switch"

export function SwitchDemo() {
  return (
    <div class="flex items-center gap-3">
      <Switch.Root class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-[hsl(var(--input))] transition-colors data-[state=on]:bg-[hsl(var(--primary))]">
        <Switch.Thumb class="pointer-events-none block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform translate-x-0 data-[state=on]:translate-x-5" />
      </Switch.Root>
      <label class="text-sm font-medium text-[hsl(var(--foreground))] leading-none">
        Airplane Mode
      </label>
    </div>
  )
}

export const switchDemoCode = `import * as Switch from "@solidiom/switch"

function SwitchExample() {
  return (
    <div class="flex items-center gap-3">
      <Switch.Root>
        <Switch.Thumb />
      </Switch.Root>
      <label>Airplane Mode</label>
    </div>
  )
}`
