import { createSignal, type JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Tabs from "@solidiom/tabs"

const METRICS = [
  { title: "Total Revenue", value: "$48,250", change: "+12.3%", changeType: "positive" },
  { title: "Outstanding", value: "$6,500", change: "-5.1%", changeType: "positive" },
  { title: "Overdue", value: "$875", change: "+1 item", changeType: "negative" },
  { title: "Avg Collection", value: "14 days", change: "-2 days", changeType: "positive" },
]

const MONTHLY_DATA = [
  { month: "Mar 2026", revenue: "$8,200", paid: "$7,800", outstanding: "$400" },
  { month: "Apr 2026", revenue: "$9,100", paid: "$9,100", outstanding: "$0" },
  { month: "May 2026", revenue: "$10,500", paid: "$9,800", outstanding: "$700" },
  { month: "Jun 2026", revenue: "$11,200", paid: "$11,200", outstanding: "$0" },
  { month: "Jul 2026", revenue: "$9,250", paid: "$8,375", outstanding: "$875" },
]

export function Reports(): JSX.Element {
  const [tab, setTab] = createSignal("overview")

  return (
    <div>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/reports" current class="text-sm font-medium text-gray-900">
              Reports
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Generate revenue reports, aging summaries, and financial dashboards.
          </p>
        </div>
        <Button.Root variant="secondary">Export CSV</Button.Root>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500">{m.title}</p>
            <p class="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
            <p
              class={`mt-1 text-xs font-medium ${
                m.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {m.change} from last month
            </p>
          </Card.Root>
        ))}
      </div>

      <Tabs.Root value={tab} onValueChange={setTab} class="mt-8">
        <div class="border-b border-gray-200">
          <Tabs.List class="flex gap-4">
            <Tabs.Trigger
              value="overview"
              class="cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500"
            >
              Monthly Overview
            </Tabs.Trigger>
            <Tabs.Trigger
              value="aging"
              class="cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500"
            >
              Aging Summary
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="overview">
          <Card.Root class="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Month
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paid
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Outstanding
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {MONTHLY_DATA.map((row) => (
                  <tr>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{row.month}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{row.revenue}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{row.paid}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{row.outstanding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="aging">
          <Card.Root class="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Age Bucket
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Count
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Current</td>
                  <td class="px-4 py-3 text-sm text-gray-700">42</td>
                  <td class="px-4 py-3 text-sm text-gray-700">$38,200</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">1-30 days</td>
                  <td class="px-4 py-3 text-sm text-gray-700">8</td>
                  <td class="px-4 py-3 text-sm text-gray-700">$5,625</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">31-60 days</td>
                  <td class="px-4 py-3 text-sm text-gray-700">3</td>
                  <td class="px-4 py-3 text-sm text-gray-700">$875</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">60+ days</td>
                  <td class="px-4 py-3 text-sm text-gray-700">0</td>
                  <td class="px-4 py-3 text-sm text-gray-700">$0</td>
                </tr>
              </tbody>
            </table>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
