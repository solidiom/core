import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

export function AuthCard(props: {
  title: string
  subtitle?: string
  children: JSX.Element
}): JSX.Element {
  return (
    <Card.Root class="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm">
      <Card.Header class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            A
          </div>
          <div>
            <Card.Title class="text-lg font-semibold text-gray-900">{props.title}</Card.Title>
            {props.subtitle && <p class="text-sm text-gray-500">{props.subtitle}</p>}
          </div>
        </div>
      </Card.Header>
      <Card.Content class="px-6 py-6">{props.children}</Card.Content>
    </Card.Root>
  )
}
