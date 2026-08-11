import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

export function WizardCard(props: {
  title: string
  description: string
  children: JSX.Element
}): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Card.Header class="border-b border-gray-200 px-6 py-4">
        <Card.Title class="text-lg font-semibold text-gray-900">{props.title}</Card.Title>
        <p class="mt-1 text-sm text-gray-500">{props.description}</p>
      </Card.Header>
      <Card.Content class="px-6 py-6">{props.children}</Card.Content>
    </Card.Root>
  )
}
