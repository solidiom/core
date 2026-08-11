import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import * as Tabs from "@solidiom/tabs"

interface CostEntry {
  model: string
  tokens: string
  cost: string
  budget: string
  budgetUsed: number
  requests: string
  avgTokensPerReq: string
}

const COSTS: CostEntry[] = [
  {
    model: "gpt-4-turbo",
    tokens: "12.4M",
    cost: "$84.20",
    budget: "$150.00",
    budgetUsed: 56,
    requests: "48,291",
    avgTokensPerReq: "257",
  },
  {
    model: "claude-3-sonnet",
    tokens: "8.7M",
    cost: "$43.50",
    budget: "$100.00",
    budgetUsed: 43,
    requests: "32,105",
    avgTokensPerReq: "271",
  },
  {
    model: "text-embedding-3-large",
    tokens: "45.2M",
    cost: "$18.08",
    budget: "$50.00",
    budgetUsed: 36,
    requests: "128,450",
    avgTokensPerReq: "352",
  },
  {
    model: "llama-3-8b-fine",
    tokens: "3.1M",
    cost: "$5.10",
    budget: "$30.00",
    budgetUsed: 17,
    requests: "11,842",
    avgTokensPerReq: "262",
  },
  {
    model: "dall-e-3",
    tokens: "—",
    cost: "$22.40",
    budget: "$60.00",
    budgetUsed: 37,
    requests: "892",
    avgTokensPerReq: "—",
  },
]

export function CostTracking(): JSX.Element {
  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/costs" current class="text-gray-900 font-medium">
                Costs
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Cost Tracking</h1>
        <p class="mt-1 text-sm text-gray-500">
          Track inference costs, token usage, and budget allocation across models.
        </p>
      </div>

      <Alert.Root type="warning" class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <Alert.Title class="text-sm font-medium text-yellow-800">Budget Alert</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-yellow-700">
          gpt-4-turbo has consumed 56% of its monthly budget ($84.20 / $150.00). Consider optimizing
          prompt lengths or switching to a more cost-effective model for non-critical workloads.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Spend</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">$173.28</p>
          <p class="mt-1 text-xs text-green-600">-$12.40 from last month</p>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Tokens</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">70.4M</p>
          <p class="mt-1 text-xs text-green-600">+8.2M from last month</p>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Budget Remaining</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">$277.72</p>
          <p class="mt-1 text-xs text-gray-500">of $450.00 total budget</p>
        </Card.Root>
      </div>

      <Tabs.Root defaultValue="by-model">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="by-model"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            By Model
          </Tabs.Trigger>
          <Tabs.Trigger
            value="by-day"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Daily Trend
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="by-model" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tokens
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cost
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Requests
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Avg Tokens/Req
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    style="min-width: 200px;"
                  >
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {COSTS.map((entry) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {entry.model}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {entry.tokens}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {entry.cost}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {entry.requests}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {entry.avgTokensPerReq}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            class={`h-2 rounded-full ${
                              entry.budgetUsed >= 80
                                ? "bg-red-500"
                                : entry.budgetUsed >= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${entry.budgetUsed}%` }}
                          />
                        </div>
                        <span class="whitespace-nowrap text-xs font-medium text-gray-500">
                          {entry.budgetUsed}% ({entry.cost} / {entry.budget})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="by-day" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Daily cost trend visualization will be available when historical data is loaded.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
