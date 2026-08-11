import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface FrameworkCardProps {
  name: string
  description: string
  progress: number
  totalControls: number
  implementedControls: number
  status: "on-track" | "at-risk" | "behind" | "not-started"
}

const STATUS_COLORS: Record<string, string> = {
  "on-track": "bg-green-100 text-green-800",
  "at-risk": "bg-yellow-100 text-yellow-800",
  behind: "bg-red-100 text-red-800",
  "not-started": "bg-gray-100 text-gray-800",
}

const PROGRESS_COLORS: Record<string, string> = {
  "on-track": "bg-green-500",
  "at-risk": "bg-yellow-500",
  behind: "bg-red-500",
  "not-started": "bg-gray-400",
}

export function FrameworkCard(props: FrameworkCardProps): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Card.Header class="border-b border-gray-100 px-6 py-4">
        <div class="flex items-center justify-between">
          <Card.Title class="text-base font-semibold text-gray-900">{props.name}</Card.Title>
          <span
            class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[props.status]}`}
          >
            {props.status}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">{props.description}</p>
      </Card.Header>
      <Card.Content class="px-6 py-4">
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="text-gray-500">
            {props.implementedControls} of {props.totalControls} controls
          </span>
          <span class="font-medium text-gray-900">{props.progress}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class={`h-2 rounded-full ${PROGRESS_COLORS[props.status]}`}
            style={{ width: `${props.progress}%` }}
          />
        </div>
      </Card.Content>
    </Card.Root>
  )
}
