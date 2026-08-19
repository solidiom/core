import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

export function ContentCard(props: {
  title: string
  type: string
  status: string
  author?: string
  updatedAt?: string
}): JSX.Element {
  return (
    <Card.Root class="max-w-sm">
      <Card.Header>
        <Card.Title>{props.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="space-y-2 text-sm text-gray-500">
          <div>Type: {props.type}</div>
          <div>Status: {props.status}</div>
          {props.author && <div>Author: {props.author}</div>}
          {props.updatedAt && <div>Updated: {props.updatedAt}</div>}
        </div>
      </Card.Content>
    </Card.Root>
  )
}
