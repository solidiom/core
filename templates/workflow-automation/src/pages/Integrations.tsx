import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Switch from "@solidiom/switch"

const INTEGRATIONS = [
  { name: "Slack", description: "Send notifications to Slack channels.", connected: true, lastSync: "5 min ago" },
  { name: "Stripe", description: "Process payments and manage subscriptions.", connected: true, lastSync: "1 hour ago" },
  { name: "SendGrid", description: "Send transactional and marketing emails.", connected: true, lastSync: "3 hours ago" },
  { name: "GitHub", description: "Trigger workflows on repository events.", connected: false, lastSync: "—" },
  { name: "AWS S3", description: "Store and retrieve files from S3 buckets.", connected: false, lastSync: "—" },
]

export function Integrations(): JSX.Element {
  const [integrations, setIntegrations] = createSignal(INTEGRATIONS)

  const toggle = (index: number) => {
    setIntegrations(prev => prev.map((item, i) =>
      i === index ? { ...item, connected: !item.connected } : item
    ))
  }

  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">Workflows</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/integrations" current class="text-sm font-medium text-gray-900">Integrations</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Integrations</h1>
        <p class="mt-1 text-sm text-gray-500">Configure third-party connectors, webhooks, and service credentials.</p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Connected Services</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {integrations().filter(i => i.connected).length} of {integrations().length} services connected. Toggle to enable or disable.
        </Alert.Description>
      </Alert.Root>

      <div class="space-y-4">
        {integrations().map((integration, index) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Content class="px-4 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{integration.name}</p>
                  <p class="text-xs text-gray-500">{integration.description}</p>
                  <p class="mt-0.5 text-xs text-gray-400">Last sync: {integration.lastSync}</p>
                </div>
                <div class="flex items-center gap-3">
                  {integration.connected && (
                    <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                      Configure
                    </Button.Root>
                  )}
                  <Switch.Root
                    checked={() => integration.connected}
                    onCheckedChange={() => toggle(index)}
                    class="inline-flex h-5 w-9 items-center rounded-full transition-colors bg-gray-200 data-[state=checked]:bg-indigo-600"
                  >
                    <Switch.Thumb class="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
                  </Switch.Root>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <div class="flex justify-end gap-3">
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Browse Marketplace
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Add Integration
        </Button.Root>
      </div>
    </div>
  )
}
