import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Dialog from "@solidiom/dialog"
import * as Card from "@solidiom/card"
import { StatusBadge } from "../components/StatusBadge"

type KeyStatus = "active" | "inactive" | "expiring" | "revoked" | "rotated"

interface ApiKey {
  id: string
  name: string
  key: string
  status: KeyStatus
  scopes: string[]
  createdAt: string
  expiresAt: string
  lastUsed: string
}

const API_KEYS: ApiKey[] = [
  {
    id: "key-001",
    name: "Production Backend",
    key: "sk_live_••••••••••••4f3a",
    status: "active",
    scopes: ["read", "write", "admin"],
    createdAt: "2024-01-15",
    expiresAt: "2025-01-15",
    lastUsed: "2 min ago",
  },
  {
    id: "key-002",
    name: "Staging Service",
    key: "sk_staging_••••••••••••7b2c",
    status: "active",
    scopes: ["read", "write"],
    createdAt: "2024-03-22",
    expiresAt: "2025-03-22",
    lastUsed: "1 hour ago",
  },
  {
    id: "key-003",
    name: "Mobile App",
    key: "sk_mobile_••••••••••••9d1e",
    status: "expiring",
    scopes: ["read"],
    createdAt: "2023-11-01",
    expiresAt: "2024-08-15",
    lastUsed: "5 min ago",
  },
  {
    id: "key-004",
    name: "Legacy Integration",
    key: "sk_legacy_••••••••••••2a8f",
    status: "revoked",
    scopes: ["read", "write"],
    createdAt: "2023-06-10",
    expiresAt: "2024-06-10",
    lastUsed: "30 days ago",
  },
  {
    id: "key-005",
    name: "CI/CD Pipeline",
    key: "sk_cicd_••••••••••••5c3d",
    status: "rotated",
    scopes: ["read"],
    createdAt: "2024-07-01",
    expiresAt: "2025-07-01",
    lastUsed: "4 hours ago",
  },
  {
    id: "key-006",
    name: "Analytics Worker",
    key: "sk_analytics_••••••••••••8e4b",
    status: "inactive",
    scopes: ["read", "write"],
    createdAt: "2024-02-28",
    expiresAt: "2025-02-28",
    lastUsed: "Never",
  },
]

export function ApiKeys(): JSX.Element {
  const [showCreateDialog, setShowCreateDialog] = createSignal(false)
  const [showRevokeDialog, setShowRevokeDialog] = createSignal<ApiKey | null>(null)

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
              <Breadcrumb.Link href="/keys" current class="text-gray-900 font-medium">
                API Keys
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">API Keys</h1>
            <p class="mt-1 text-sm text-gray-500">
              Create, rotate, and revoke API keys with scope management.
            </p>
          </div>
          <Button.Root
            class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            onClick={() => setShowCreateDialog(true)}
          >
            Create Key
          </Button.Root>
        </div>
      </div>

      <Alert.Root type="warning" class="rounded-lg">
        <Alert.Title class="text-sm font-medium">Security Notice</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-gray-600">
          One key is expiring soon. Rotate expiring keys before their expiration date to avoid
          service disruption.
        </Alert.Description>
      </Alert.Root>

      <div class="grid gap-4">
        {API_KEYS.map((key) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{key.name}</h3>
                <p class="mt-0.5 font-mono text-xs text-gray-500">{key.key}</p>
              </div>
              <div class="flex items-center gap-2">
                <StatusBadge type={key.status} />
              </div>
            </div>
            <div class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
              <span>Scopes: {key.scopes.join(", ")}</span>
              <span>Created: {key.createdAt}</span>
              <span>Expires: {key.expiresAt}</span>
              <span>Last used: {key.lastUsed}</span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              {key.status === "active" && (
                <>
                  <Button.Root class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Rotate
                  </Button.Root>
                  <Button.Root
                    class="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    onClick={() => setShowRevokeDialog(key)}
                  >
                    Revoke
                  </Button.Root>
                </>
              )}
              {key.status === "expiring" && (
                <Button.Root class="rounded-md border border-yellow-200 bg-white px-2.5 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-50">
                  Rotate Now
                </Button.Root>
              )}
            </div>
          </Card.Root>
        ))}
      </div>

      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
          <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title class="text-lg font-semibold text-gray-900">Create API Key</Dialog.Title>
            <p class="mt-1 text-sm text-gray-500">Generate a new API key with specific scopes.</p>
            <div class="mt-4 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="My Service"
                  class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Scopes</label>
                <div class="mt-1 space-x-4">
                  {["read", "write", "admin"].map((scope) => (
                    <label class="inline-flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {scope}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <Button.Root
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button.Root>
              <Button.Root
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                onClick={() => {
                  setShowCreateDialog(false)
                }}
              >
                Generate Key
              </Button.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={() => !!showRevokeDialog()}
        onOpenChange={(open) => !open && setShowRevokeDialog(null)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
          <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title class="text-lg font-semibold text-gray-900">Revoke API Key</Dialog.Title>
            <p class="mt-2 text-sm text-gray-500">
              Are you sure you want to revoke the key "{showRevokeDialog()?.name}"? This action
              cannot be undone.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <Button.Root
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowRevokeDialog(null)}
              >
                Cancel
              </Button.Root>
              <Button.Root
                class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                onClick={() => {
                  setShowRevokeDialog(null)
                }}
              >
                Revoke
              </Button.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
