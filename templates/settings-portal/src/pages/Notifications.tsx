import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Switch from "@solidiom/switch"
import { SettingGroup } from "../components/SettingGroup"

const NAV_ITEMS = [
  { label: "Account", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Danger Zone", href: "/danger-zone" },
]

const NOTIFICATION_TYPES = [
  { category: "Product Updates", channels: { email: true, push: false, sms: false } },
  { category: "Security Alerts", channels: { email: true, push: true, sms: true } },
  { category: "Billing Notifications", channels: { email: true, push: false, sms: false } },
  { category: "Marketing Emails", channels: { email: false, push: false, sms: false } },
]

export function Notifications(): JSX.Element {
  const location = useLocation()
  const [items, setItems] = createSignal(NOTIFICATION_TYPES)

  const toggleChannel = (index: number, channel: keyof typeof NOTIFICATION_TYPES[0]["channels"]) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, channels: { ...item.channels, [channel]: !item.channels[channel] } } : item,
      ),
    )
  }

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
            <h1 class="text-2xl font-bold text-gray-900">Notification Preferences</h1>
            <p class="mt-1 text-sm text-gray-500">Choose how and when you want to be notified.</p>
          </div>

          <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
            <Alert.Title class="text-sm font-medium text-blue-800">Tip</Alert.Title>
            <Alert.Description class="mt-1 text-sm text-blue-700">
              Security alerts are recommended to stay enabled across all channels.
            </Alert.Description>
          </Alert.Root>

          <SettingGroup title="Notification Channels" description="Manage notifications by category and channel.">
            <div class="space-y-6">
              {items().map((item, index) => (
                <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
                  <p class="text-sm font-medium text-gray-900">{item.category}</p>
                  <div class="mt-3 flex flex-wrap gap-6">
                    {(["email", "push", "sms"] as const).map((channel) => (
                      <div class="flex items-center gap-2">
                        <Switch.Root
                          checked={() => item.channels[channel]}
                          onCheckedChange={() => toggleChannel(index, channel)}
                          class="inline-flex h-5 w-9 items-center rounded-full border-transparent bg-gray-200 transition-colors data-[state=checked]:bg-indigo-600"
                        >
                          <Switch.Thumb class="inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4" />
                        </Switch.Root>
                        <span class="text-sm text-gray-600 capitalize">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SettingGroup>

          <div class="flex justify-end gap-3">
            <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Cancel
            </Button.Root>
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Save Changes
            </Button.Root>
          </div>
        </div>
      </main>
    </div>
  )
}
