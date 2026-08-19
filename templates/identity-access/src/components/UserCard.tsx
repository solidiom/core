import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

interface UserCardProps {
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  avatar: string
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
}

export function UserCard(props: UserCardProps): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Card.Content class="px-6 py-4">
        <div class="flex items-center gap-4">
          <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-medium text-indigo-700">
            {props.avatar}
          </span>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <Card.Title class="text-sm font-semibold text-gray-900">{props.name}</Card.Title>
              <span
                class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[props.status]}`}
              >
                {props.status}
              </span>
            </div>
            <p class="text-xs text-gray-500">{props.email}</p>
            <p class="mt-1 text-xs text-gray-400">Role: {props.role}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
