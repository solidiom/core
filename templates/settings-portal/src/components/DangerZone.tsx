import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

export function DangerZoneItem(props: {
  title: string
  description: string
  actionLabel: string
  onConfirm: () => void
}): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-red-200 bg-red-50">
      <Card.Content class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-900">{props.title}</p>
            <p class="text-sm text-red-700">{props.description}</p>
          </div>
          <button
            type="button"
            onClick={props.onConfirm}
            class="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            {props.actionLabel}
          </button>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
