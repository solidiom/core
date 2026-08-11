import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

export function ResultCard(props: {
  title: string
  snippet: string
  url?: string
  date?: string
}): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white">
      <Card.Content class="px-4 py-4">
        <h3 class="text-sm font-semibold text-indigo-600 hover:underline">{props.title}</h3>
        {props.url && <p class="mt-0.5 text-xs text-green-700">{props.url}</p>}
        <p class="mt-1 text-sm text-gray-600">{props.snippet}</p>
        {props.date && <p class="mt-2 text-xs text-gray-400">{props.date}</p>}
      </Card.Content>
    </Card.Root>
  )
}
