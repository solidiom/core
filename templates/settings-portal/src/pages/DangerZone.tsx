import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Alert from "@solidiom/alert"
import * as Dialog from "@solidiom/dialog"
import { SettingGroup } from "../components/SettingGroup"
import { DangerZoneItem } from "../components/DangerZone"

const NAV_ITEMS = [
  { label: "Account", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Danger Zone", href: "/danger-zone" },
]

export function DangerZone(): JSX.Element {
  const location = useLocation()
  const [exportingOpen, setExportingOpen] = createSignal(false)
  const [deactivateOpen, setDeactivateOpen] = createSignal(false)
  const [revokeOpen, setRevokeOpen] = createSignal(false)

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <A href="/" class="text-lg font-bold text-gray-900">Settings</A>
          <nav class="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <A
                href={item.href}
                class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </A>
            ))}
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="space-y-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Danger Zone</h1>
            <p class="mt-1 text-sm text-gray-500">Irreversible and destructive actions.</p>
          </div>

          <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
            <Alert.Title class="text-sm font-medium text-red-800">Warning</Alert.Title>
            <Alert.Description class="mt-1 text-sm text-red-700">
              The actions below are irreversible. Proceed with extreme caution.
            </Alert.Description>
          </Alert.Root>

          <SettingGroup title="Destructive Actions" description="These actions cannot be undone.">
            <div class="space-y-4">
              <DangerZoneItem
                title="Delete Account"
                description="Permanently delete your account and all of your data."
                actionLabel="Delete Account"
                onConfirm={() => alert("Account deletion confirmed")}
              />
              <DangerZoneItem
                title="Transfer Ownership"
                description="Transfer account ownership to another user."
                actionLabel="Transfer Ownership"
                onConfirm={() => alert("Ownership transfer initiated")}
              />
              <DangerZoneItem
                title="Cancel Subscription"
                description="Cancel your subscription at the end of the current billing period."
                actionLabel="Cancel Subscription"
                onConfirm={() => alert("Subscription cancellation confirmed")}
              />
              <DangerZoneItem
                title="Export All Data"
                description="Download a complete export of all your data in JSON format."
                actionLabel="Export Data"
                onConfirm={() => setExportingOpen(true)}
              />
              <DangerZoneItem
                title="Deactivate Account"
                description="Temporarily deactivate your account. You can reactivate within 30 days."
                actionLabel="Deactivate"
                onConfirm={() => setDeactivateOpen(true)}
              />
              <DangerZoneItem
                title="Revoke All Sessions"
                description="Sign out of all active sessions on every device immediately."
                actionLabel="Revoke Sessions"
                onConfirm={() => setRevokeOpen(true)}
              />
            </div>
          </SettingGroup>

          <Dialog.Root open={exportingOpen} onOpenChange={setExportingOpen}>
            <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <Dialog.Title class="text-lg font-semibold text-gray-900">Export All Data</Dialog.Title>
                <Dialog.Description class="mt-2 text-sm text-gray-500">
                  This will generate a complete export of your account data, including settings,
                  activity history, and stored content. The download may take several minutes.
                </Dialog.Description>
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setExportingOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    onClick={() => {
                      setExportingOpen(false)
                      alert("Data export started")
                    }}
                  >
                    Download Export
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root open={deactivateOpen} onOpenChange={setDeactivateOpen}>
            <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <Dialog.Title class="text-lg font-semibold text-gray-900">Deactivate Account</Dialog.Title>
                <Dialog.Description class="mt-2 text-sm text-gray-500">
                  Your account will be hidden from other users. You can reactivate within 30 days;
                  after that, all data will be permanently deleted.
                </Dialog.Description>
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setDeactivateOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    onClick={() => {
                      setDeactivateOpen(false)
                      alert("Account deactivated")
                    }}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root open={revokeOpen} onOpenChange={setRevokeOpen}>
            <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <Dialog.Title class="text-lg font-semibold text-gray-900">Revoke All Sessions</Dialog.Title>
                <Dialog.Description class="mt-2 text-sm text-gray-500">
                  This will sign you out of 3 active sessions across 2 devices. You will need to
                  sign in again on your current device.
                </Dialog.Description>
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setRevokeOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    onClick={() => {
                      setRevokeOpen(false)
                      alert("All sessions revoked")
                    }}
                  >
                    Revoke All
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </main>
    </div>
  )
}
