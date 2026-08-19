import type { JSX } from "@solidjs/web"

export function SettingGroup(props: {
  title: string
  description?: string
  children: JSX.Element
}): JSX.Element {
  return (
    <div class="space-y-4">
      <div>
        <h3 class="text-base font-semibold text-gray-900">{props.title}</h3>
        {props.description && <p class="mt-1 text-sm text-gray-500">{props.description}</p>}
      </div>
      <div class="border-t border-gray-200 pt-4">{props.children}</div>
    </div>
  )
}
