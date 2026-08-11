import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"

type ModelStatus = "registered" | "in_review" | "deprecated"

interface RegistryEntry {
  id: string
  name: string
  type: string
  version: string
  status: ModelStatus
  provider: string
  contextWindow: string
  registeredAt: string
}

const MODELS: RegistryEntry[] = [
  {
    id: "1",
    name: "gpt-4-turbo",
    type: "LLM",
    version: "2024-04-09",
    status: "registered",
    provider: "OpenAI",
    contextWindow: "128K",
    registeredAt: "Aug 1, 2024",
  },
  {
    id: "2",
    name: "claude-3-sonnet",
    type: "LLM",
    version: "1.0.0",
    status: "registered",
    provider: "Anthropic",
    contextWindow: "200K",
    registeredAt: "Jul 28, 2024",
  },
  {
    id: "3",
    name: "text-embedding-3-large",
    type: "Embedding",
    version: "1.2.0",
    status: "registered",
    provider: "OpenAI",
    contextWindow: "8K",
    registeredAt: "Jul 15, 2024",
  },
  {
    id: "4",
    name: "llama-3-8b-fine",
    type: "LLM",
    version: "0.9.3",
    status: "in_review",
    provider: "Meta (custom)",
    contextWindow: "8K",
    registeredAt: "Aug 5, 2024",
  },
  {
    id: "5",
    name: "dall-e-3",
    type: "Image Gen",
    version: "2.0.0",
    status: "registered",
    provider: "OpenAI",
    contextWindow: "—",
    registeredAt: "Jul 10, 2024",
  },
  {
    id: "6",
    name: "whisper-large-v3",
    type: "Speech",
    version: "1.0.0",
    status: "deprecated",
    provider: "OpenAI",
    contextWindow: "—",
    registeredAt: "Jun 1, 2024",
  },
  {
    id: "7",
    name: "clip-vit-large",
    type: "Vision",
    version: "1.5.0",
    status: "registered",
    provider: "OpenAI",
    contextWindow: "—",
    registeredAt: "Jul 20, 2024",
  },
]

const statusColor = (status: ModelStatus) => {
  switch (status) {
    case "registered":
      return "bg-green-100 text-green-700"
    case "in_review":
      return "bg-yellow-100 text-yellow-700"
    case "deprecated":
      return "bg-gray-100 text-gray-600"
  }
}

const statusDot = (status: ModelStatus) => {
  switch (status) {
    case "registered":
      return "bg-green-500"
    case "in_review":
      return "bg-yellow-500"
    case "deprecated":
      return "bg-gray-400"
  }
}

export function ModelRegistry(): JSX.Element {
  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
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
                <Breadcrumb.Link href="/models" current class="text-gray-900 font-medium">
                  Models
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Model Registry</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage, version, and configure AI models for pipeline steps.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Register Model
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Model Registry</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          6 models registered, 1 under review. Register new models to make them available in
          pipeline steps.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Models</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">7</p>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Active</p>
          <p class="mt-2 text-3xl font-bold text-green-600">5</p>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Under Review</p>
          <p class="mt-2 text-3xl font-bold text-yellow-600">1</p>
        </Card.Root>
      </div>

      <Tabs.Root defaultValue="all">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="all"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            All Models
          </Tabs.Trigger>
          <Tabs.Trigger
            value="llm"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            LLMs
          </Tabs.Trigger>
          <Tabs.Trigger
            value="other"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Other
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Version
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Provider
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Context
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {MODELS.map((model) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {model.name}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{model.type}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.version}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.provider}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.contextWindow}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(model.status)}`}
                      >
                        <span
                          class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(model.status)}`}
                        />
                        {model.status}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.registeredAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="llm" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Version
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Provider
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Context Window
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {MODELS.filter((m) => m.type === "LLM").map((model) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {model.name}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.version}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.provider}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {model.contextWindow}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(model.status)}`}
                      >
                        <span
                          class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(model.status)}`}
                        />
                        {model.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="other" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Non-LLM models: Embedding, Image Gen, Speech, and Vision models listed here.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
