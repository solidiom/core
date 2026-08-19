import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import { createSignal } from "solid-js"
import { CodeBlock } from "../components/CodeBlock"

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/users",
    description: "List all users with pagination support.",
    params: [
      { name: "page", type: "integer", required: false, description: "Page number (default: 1)" },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Items per page (default: 20, max: 100)",
      },
    ],
    example:
      'const response = await fetch("/api/v1/users?page=1&limit=10");\nconst data = await response.json();',
  },
  {
    method: "POST",
    path: "/api/v1/users",
    description: "Create a new user account.",
    params: [
      { name: "email", type: "string", required: true, description: "User email address" },
      { name: "name", type: "string", required: true, description: "Full name" },
      { name: "role", type: "string", required: false, description: "User role (default: member)" },
    ],
    example:
      'const response = await fetch("/api/v1/users", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ email: "user@example.com", name: "John Doe" }),\n});',
  },
  {
    method: "GET",
    path: "/api/v1/users/:id",
    description: "Get a specific user by ID.",
    params: [{ name: "id", type: "string", required: true, description: "Unique user identifier" }],
    example:
      'const response = await fetch("/api/v1/users/usr_abc123");\nconst user = await response.json();',
  },
  {
    method: "DELETE",
    path: "/api/v1/users/:id",
    description: "Delete a user account. This action is irreversible.",
    params: [{ name: "id", type: "string", required: true, description: "Unique user identifier" }],
    example: 'await fetch("/api/v1/users/usr_abc123", {\n  method: "DELETE",\n});',
  },
]

export function ApiReference(): JSX.Element {
  const [activeTab] = createSignal("endpoints")

  const methodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700"
      case "POST":
        return "bg-blue-100 text-blue-700"
      case "PUT":
        return "bg-yellow-100 text-yellow-700"
      case "DELETE":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              API Reference
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">API Reference</h1>
        <p class="mt-1 text-sm text-gray-500">
          Auto-generated API reference with type signatures and examples.
        </p>
      </div>

      <Tabs.Root value={activeTab} class="mt-8">
        <div class="border-b border-gray-200">
          <Tabs.List class="flex items-center gap-1 -mb-px">
            <Tabs.Trigger
              value="endpoints"
              class="border-b-2 px-4 py-2 text-sm font-medium transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
            >
              Endpoints
            </Tabs.Trigger>
            <Tabs.Trigger
              value="schemas"
              class="border-b-2 px-4 py-2 text-sm font-medium transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
            >
              Schemas
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="endpoints" class="mt-6">
          <div class="space-y-8">
            {ENDPOINTS.map((endpoint) => (
              <div class="rounded-lg border border-gray-200 bg-white p-6">
                <div class="mb-4 flex items-center gap-3">
                  <span
                    class={`rounded-md px-2 py-1 text-xs font-bold ${methodColor(endpoint.method)}`}
                  >
                    {endpoint.method}
                  </span>
                  <code class="text-sm font-mono text-gray-900">{endpoint.path}</code>
                </div>
                <p class="mb-4 text-sm text-gray-600">{endpoint.description}</p>

                <h3 class="mb-2 text-sm font-semibold text-gray-900">Parameters</h3>
                <div class="mb-4 overflow-x-auto">
                  <table class="min-w-full text-left text-sm">
                    <thead>
                      <tr class="border-b border-gray-200">
                        <th class="pb-2 pr-4 font-medium text-gray-500">Name</th>
                        <th class="pb-2 pr-4 font-medium text-gray-500">Type</th>
                        <th class="pb-2 pr-4 font-medium text-gray-500">Required</th>
                        <th class="pb-2 font-medium text-gray-500">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param) => (
                        <tr class="border-b border-gray-100">
                          <td class="py-2 pr-4 font-mono text-xs">{param.name}</td>
                          <td class="py-2 pr-4 text-gray-500">{param.type}</td>
                          <td class="py-2 pr-4 text-gray-500">{param.required ? "Yes" : "No"}</td>
                          <td class="py-2 text-gray-500">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 class="mb-2 text-sm font-semibold text-gray-900">Example</h3>
                <CodeBlock code={endpoint.example} language="javascript" />
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="schemas" class="mt-6">
          <div class="space-y-6">
            <div class="rounded-lg border border-gray-200 bg-white p-6">
              <h3 class="mb-2 text-sm font-semibold text-gray-900">User</h3>
              <CodeBlock
                code={`interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member" | "viewer";
  createdAt: string;
  updatedAt: string;
}`}
                language="typescript"
              />
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6">
              <h3 class="mb-2 text-sm font-semibold text-gray-900">UserResponse</h3>
              <CodeBlock
                code={`interface UserResponse {
  data: User;
  meta: {
    requestId: string;
    timestamp: string;
  };
}`}
                language="typescript"
              />
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
