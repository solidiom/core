import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Tabs from "@solidiom/tabs"
import * as Spinner from "@solidiom/spinner"

type DeploymentStatus = "completed" | "in_progress" | "failed" | "pending"

interface Deployment {
  id: string
  model: string
  version: string
  environment: string
  status: DeploymentStatus
  strategy: string
  startedAt: string
  duration: string
  author: string
}

const DEPLOYMENTS: Deployment[] = [
  { id: "1", model: "gpt-4-turbo", version: "2024-04-09", environment: "production", status: "completed", strategy: "Rolling", startedAt: "2024-08-09 14:30", duration: "4m 12s", author: "alice@example.com" },
  { id: "2", model: "claude-3-sonnet", version: "1.0.1", environment: "staging", status: "in_progress", strategy: "Canary (20%)", startedAt: "2024-08-09 16:45", duration: "—", author: "bob@example.com" },
  { id: "3", model: "text-embedding-3-large", version: "1.2.0", environment: "production", status: "completed", strategy: "Blue/Green", startedAt: "2024-08-09 10:15", duration: "2m 48s", author: "carol@example.com" },
  { id: "4", model: "llama-3-8b-fine", version: "0.9.4", environment: "staging", status: "failed", strategy: "Canary (10%)", startedAt: "2024-08-09 09:00", duration: "1m 32s", author: "dave@example.com" },
  { id: "5", model: "dall-e-3", version: "2.0.0", environment: "production", status: "pending", strategy: "Rolling", startedAt: "—", duration: "—", author: "eve@example.com" },
]

const statusColor = (status: DeploymentStatus) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700"
    case "in_progress": return "bg-blue-100 text-blue-700"
    case "failed": return "bg-red-100 text-red-700"
    case "pending": return "bg-gray-100 text-gray-600"
  }
}

const statusDot = (status: DeploymentStatus) => {
  switch (status) {
    case "completed": return "bg-green-500"
    case "in_progress": return "bg-blue-500"
    case "failed": return "bg-red-500"
    case "pending": return "bg-gray-400"
  }
}

export function Deployments(): JSX.Element {
  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/deployments" current class="text-gray-900 font-medium">Deployments</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Deployments</h1>
          <p class="mt-1 text-sm text-gray-500">Manage model deployment pipelines, rollbacks, and canary releases.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          New Deployment
        </Button.Root>
      </div>

      <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
        <Alert.Title class="text-sm font-medium text-red-800">Deployment Failed</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-red-700">
          llama-3-8b-fine v0.9.4 canary deployment failed health checks. Rolling back to v0.9.3.
        </Alert.Description>
      </Alert.Root>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Canary in Progress</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          claude-3-sonnet v1.0.1 is canary-deploying to staging (20% traffic). Monitor for 30 minutes before promoting.
        </Alert.Description>
      </Alert.Root>

      <Tabs.Root defaultValue="active">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="active"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Active Deployments
          </Tabs.Trigger>
          <Tabs.Trigger
            value="history"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            History
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="active" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Model</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Version</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Environment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Strategy</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {DEPLOYMENTS.filter((d) => d.status === "in_progress" || d.status === "pending").map((dep) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{dep.model}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.version}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.environment}</td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(dep.status)}`}>
                        <span class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(dep.status)}`} />
                        {dep.status === "in_progress" ? (
                          <>
                            <Spinner.Root class="mr-1.5 h-3 w-3 animate-spin text-blue-500" />
                            In Progress
                          </>
                        ) : (
                          dep.status
                        )}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.strategy}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="history" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Model</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Version</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Environment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Started</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {DEPLOYMENTS.filter((d) => d.status === "completed" || d.status === "failed").map((dep) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{dep.model}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.version}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.environment}</td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(dep.status)}`}>
                        <span class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(dep.status)}`} />
                        {dep.status}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.startedAt}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dep.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
