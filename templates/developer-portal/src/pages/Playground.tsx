import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"
import * as Kbd from "@solidiom/kbd"
import * as Tooltip from "@solidiom/tooltip"

const SAMPLE_ENDPOINTS = [
  { method: "GET" as const, path: "/v1/users", description: "List all users" },
  { method: "POST" as const, path: "/v1/users", description: "Create a new user" },
  { method: "GET" as const, path: "/v1/users/:id", description: "Get user by ID" },
  { method: "PUT" as const, path: "/v1/users/:id", description: "Update user" },
  { method: "DELETE" as const, path: "/v1/users/:id", description: "Delete user" },
  { method: "GET" as const, path: "/v1/products", description: "List all products" },
  { method: "POST" as const, path: "/v1/orders", description: "Place a new order" },
]

export function Playground(): JSX.Element {
  const [selectedMethod, setSelectedMethod] = createSignal("GET")
  const [selectedPath, setSelectedPath] = createSignal("/v1/users")
  const [requestBody, setRequestBody] = createSignal(
    '{"name": "John Doe", "email": "john@example.com"}',
  )
  const [response, setResponse] = createSignal(
    '{"status": "success", "data": [{"id": 1, "name": "John Doe", "email": "john@example.com"}, {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}], "total": 2, "page": 1}',
  )
  const [isRunning, setIsRunning] = createSignal(false)

  const runRequest = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setResponse(
        '{"status": "success", "data": [{"id": 1, "name": "John Doe", "email": "john@example.com"}], "total": 1, "page": 1}',
      )
    }, 800)
  }

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
              <Breadcrumb.Link href="/playground" current class="text-gray-900 font-medium">
                Playground
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">API Playground</h1>
            <p class="mt-1 text-sm text-gray-500">
              Interactive playground for testing API calls and SDK integrations.
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>Press</span>
            <Kbd.Root class="inline-flex items-center rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
              Ctrl
            </Kbd.Root>
            <span>+</span>
            <Kbd.Root class="inline-flex items-center rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
              Enter
            </Kbd.Root>
            <span>to send</span>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4">
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <Card.Title class="text-sm font-medium text-gray-700">Request</Card.Title>
            <div class="mt-3 flex items-center gap-2">
              <select
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedMethod()}
                onChange={(e) => setSelectedMethod(e.currentTarget.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="text"
                class="flex-1 font-mono rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedPath()}
                onChange={(e) => setSelectedPath(e.currentTarget.value)}
              />
              <Button.Root
                class={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm ${
                  isRunning() ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                onClick={runRequest}
              >
                {isRunning() ? "Sending..." : "Send"}
              </Button.Root>
            </div>
          </Card.Root>

          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <Card.Title class="text-sm font-medium text-gray-700">Request Body</Card.Title>
            <textarea
              class="mt-3 h-48 w-full resize-none rounded-md border border-gray-300 bg-gray-50 font-mono text-sm leading-relaxed p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={requestBody()}
              onChange={(e) => setRequestBody(e.currentTarget.value)}
              spellcheck={false}
            />
          </Card.Root>

          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <Card.Title class="text-sm font-medium text-gray-700">Available Endpoints</Card.Title>
            <div class="mt-3 space-y-1">
              {SAMPLE_ENDPOINTS.map((ep) => (
                <button
                  class={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                    ep.path === selectedPath() && ep.method === selectedMethod()
                      ? "bg-indigo-50"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedMethod(ep.method)
                    setSelectedPath(ep.path)
                  }}
                >
                  <span
                    class={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
                      ep.method === "GET"
                        ? "bg-green-100 text-green-700"
                        : ep.method === "POST"
                          ? "bg-blue-100 text-blue-700"
                          : ep.method === "PUT"
                            ? "bg-yellow-100 text-yellow-700"
                            : ep.method === "DELETE"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span class="font-mono text-gray-900">{ep.path}</span>
                </button>
              ))}
            </div>
          </Card.Root>
        </div>

        <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <Card.Title class="text-sm font-medium text-gray-700">Response</Card.Title>
          <Tabs.Root defaultValue="body">
            <div class="mt-3 border-b border-gray-200">
              <Tabs.List class="flex gap-4">
                <Tabs.Trigger
                  value="body"
                  class="border-b-2 border-transparent py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
                >
                  Body
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="headers"
                  class="border-b-2 border-transparent py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
                >
                  Headers
                </Tabs.Trigger>
              </Tabs.List>
            </div>
            <Tabs.Content value="body">
              <pre class="mt-3 overflow-auto rounded-md bg-gray-900 p-4 font-mono text-sm leading-relaxed text-green-400">
                {JSON.stringify(JSON.parse(response()), null, 2)}
              </pre>
            </Tabs.Content>
            <Tabs.Content value="headers">
              <pre class="mt-3 overflow-auto rounded-md bg-gray-900 p-4 font-mono text-sm leading-relaxed text-green-400">
                {`Content-Type: application/json
X-Request-Id: req_2f8a9b3c
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 1723291200
Transfer-Encoding: chunked`}
              </pre>
            </Tabs.Content>
          </Tabs.Root>
        </Card.Root>
      </div>
    </div>
  )
}
