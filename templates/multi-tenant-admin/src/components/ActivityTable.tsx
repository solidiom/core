import type { JSX } from "@solidjs/web"

export interface ActivityRecord {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
}

export function ActivityTable(props: { data: ActivityRecord[] }): JSX.Element {
  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
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
              Resource
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Time
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {props.data.map((record) => (
            <tr class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {record.user}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{record.action}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{record.resource}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                {record.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
