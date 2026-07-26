import { createSignal } from "solid-js"
import * as Toggle from "@solidiom/toggle"

export function ToggleDemo() {
  const [pressed, setPressed] = createSignal(false)

  return (
    <div class="flex flex-wrap items-center gap-3">
      <Toggle.Root
        pressed={pressed}
        onPressedChange={setPressed}
        class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border border-zinc-300 hover:bg-zinc-100 data-[state=on]:bg-zinc-900 data-[state=on]:text-white transition-colors"
      >
        Bold
      </Toggle.Root>
      <span class="text-sm text-zinc-500">State: {pressed() ? "on" : "off"}</span>
    </div>
  )
}

export const toggleDemoCode = `import { createSignal } from "solid-js"
import * as Toggle from "@solidiom/toggle"

function ToggleExample() {
  const [pressed, setPressed] = createSignal(false)

  return (
    <Toggle.Root
      pressed={pressed}
      onPressedChange={setPressed}
      class="toggle-button"
    >
      Bold
    </Toggle.Root>
  )
}
`
