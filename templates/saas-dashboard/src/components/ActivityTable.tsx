import type { JSX } from "solid-js"

interface ActivityItem {
  id: string
  user: string
  action: string
  target: string
  time: string
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "1", user: "Alice Chen", action: "deployed", target: "api-gateway v2.4.1", time: "2 min ago" },
  { id: "2", user: "Bob Martinez", action: "created", target: "billing-service", time: "15 min ago" },
  { id: "3", user: "Carol Wu", action: "updated", target: "auth-service config", time: "1 hour ago" },
  { id: "4", user: "Dave Kim", action: "scaled", target: "worker-pool to 8 replicas", time: "2 hours ago" },
  { id: "5", user: "Eve Johnson", action: "resolved", target: "incident INC-2847", time: "3 hours ago" },
]

export function ActivityTable(): JSX.Element {
  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-sm font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Action
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Target
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Time
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {RECENT_ACTIVITY.map((item) => (
            <tr class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {item.user}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.action}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.target}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                {item.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
