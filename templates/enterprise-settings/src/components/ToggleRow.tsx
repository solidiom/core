import type { JSX } from "solid-js"
import * as Switch from "@solidiom/switch"

export function ToggleRow(props: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}): JSX.Element {
  return (
    <div class="flex items-center justify-between py-3">
      <div>
        <p class="text-sm font-medium text-gray-900">{props.label}</p>
        <p class="text-sm text-gray-500">{props.description}</p>
      </div>
      <Switch.Root
        checked={() => props.checked}
        onCheckedChange={props.onCheckedChange}
        class="inline-flex h-6 w-11 items-center rounded-full border-transparent bg-gray-200 transition-colors data-[state=checked]:bg-indigo-600"
      >
        <Switch.Thumb class="inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5" />
      </Switch.Root>
    </div>
  )
}
