import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Dialog from "@solidiom/dialog"
import { StatusBadge } from "../components/StatusBadge"

interface Application {
  id: string
  name: string
  clientID: string
  status: "active" | "suspended" | "pending" | "revoked"
  scopes: string[]
  redirectUris: string[]
  webhookUrl: string
  createdAt: string
  lastUsed: string
}

const APPLICATIONS: Application[] = [
  { id: "app-001", name: "Web Dashboard", clientID: "client_7f3a9b2c", status: "active", scopes: ["read", "write", "admin"], redirectUris: ["https://app.example.com/callback"], webhookUrl: "https://app.example.com/webhooks", createdAt: "2024-01-15", lastUsed: "Just now" },
  { id: "app-002", name: "Mobile App (iOS)", clientID: "client_2e8d4f1a", status: "active", scopes: ["read", "write"], redirectUris: ["myapp://oauth/callback"], webhookUrl: "", createdAt: "2024-03-10", lastUsed: "2 hours ago" },
  { id: "app-003", name: "Mobile App (Android)", clientID: "client_5b1c7d9e", status: "active", scopes: ["read", "write"], redirectUris: ["myapp://oauth/callback"], webhookUrl: "", createdAt: "2024-03-10", lastUsed: "5 hours ago" },
  { id: "app-004", name: "Analytics Worker", clientID: "client_9a4e2b6f", status: "suspended", scopes: ["read"], redirectUris: [], webhookUrl: "https://analytics.internal.example.com/hooks", createdAt: "2024-05-22", lastUsed: "3 days ago" },
  { id: "app-005", name: "CI/CD Integration", clientID: "client_3c6f8a1d", status: "active", scopes: ["read", "write"], redirectUris: [], webhookUrl: "https://ci.example.com/api/webhook", createdAt: "2024-06-18", lastUsed: "1 day ago" },
  { id: "app-006", name: "Legacy Desktop App", clientID: "client_1d2e3f4a", status: "revoked", scopes: ["read"], redirectUris: ["legacy://auth"], webhookUrl: "", createdAt: "2023-08-01", lastUsed: "60 days ago" },
]

export function Applications(): JSX.Element {
  const [showCreateDialog, setShowCreateDialog] = createSignal(false)

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/apps" current class="text-gray-900 font-medium">Applications</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
            <p class="mt-1 text-sm text-gray-500">Register applications, manage OAuth clients, and configure webhooks.</p>
          </div>
          <Button.Root class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
            Register App
          </Button.Root>
        </div>
      </div>

      <div class="grid gap-4">
        {APPLICATIONS.map((app) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{app.name}</h3>
                <p class="mt-0.5 font-mono text-xs text-gray-500">{app.clientID}</p>
              </div>
              <StatusBadge type={app.status} />
            </div>
            <div class="mt-3 grid gap-x-6 gap-y-2 text-xs text-gray-500 sm:grid-cols-2">
              <div>
                <span class="font-medium text-gray-700">Scopes:</span> {app.scopes.join(", ") || "—"}
              </div>
              <div>
                <span class="font-medium text-gray-700">Created:</span> {app.createdAt}
              </div>
              <div>
                <span class="font-medium text-gray-700">Redirect URIs:</span>
                {app.redirectUris.length > 0 ? (
                  <ul class="mt-0.5 list-inside list-disc">
                    {app.redirectUris.map((uri) => (
                      <li class="font-mono">{uri}</li>
                    ))}
                  </ul>
                ) : "—"}
              </div>
              <div>
                <span class="font-medium text-gray-700">Webhook:</span>
                {app.webhookUrl ? <span class="font-mono ml-1">{app.webhookUrl}</span> : "—"}
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-gray-400">Last used: {app.lastUsed}</span>
              {app.status === "active" && (
                <div class="flex items-center gap-2">
                  <Button.Root class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Copy Credentials
                  </Button.Root>
                  <Button.Root class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Edit
                  </Button.Root>
                </div>
              )}
            </div>
          </Card.Root>
        ))}
      </div>

      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
          <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title class="text-lg font-semibold text-gray-900">Register Application</Dialog.Title>
            <p class="mt-1 text-sm text-gray-500">Create a new OAuth client application.</p>
            <div class="mt-4 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Application Name</label>
                <input type="text" placeholder="My Awesome App" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Redirect URIs</label>
                <input type="text" placeholder="https://app.example.com/callback" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Scopes</label>
                <div class="mt-1 space-x-4">
                  {["read", "write", "admin"].map((scope) => (
                    <label class="inline-flex items-center gap-1 text-sm text-gray-700">
                      <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      {scope}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Webhook URL (optional)</label>
                <input type="url" placeholder="https://app.example.com/webhooks" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <Button.Root class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => setShowCreateDialog(false)}>
                Register
              </Button.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
