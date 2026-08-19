import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import { WorkflowCard } from "../components/WorkflowCard"
import { StatusBadge } from "../components/StatusBadge"

const WORKFLOWS = [
  {
    name: "Onboard New User",
    trigger: "user.signup",
    actions: ["send-email", "create-record", "notify-slack"],
    status: "active" as const,
  },
  {
    name: "Process Refund",
    trigger: "order.refund_requested",
    actions: ["verify-purchase", "process-payment", "update-inventory"],
    status: "active" as const,
  },
  {
    name: "Weekly Report",
    trigger: "cron.weekly",
    actions: ["aggregate-data", "generate-pdf", "send-email"],
    status: "paused" as const,
  },
  {
    name: "Data Sync",
    trigger: "webhook.external",
    actions: ["transform", "validate", "upsert"],
    status: "draft" as const,
  },
]

const STEPS = [
  { id: 1, name: "Trigger", type: "user.signup", status: "success" as const },
  { id: 2, name: "Send Welcome Email", type: "send-email", status: "success" as const },
  { id: 3, name: "Create User Record", type: "create-record", status: "running" as const },
  { id: 4, name: "Notify Team", type: "notify-slack", status: "queued" as const },
]

export function Designer(): JSX.Element {
  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">
              Workflows
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" current class="text-sm font-medium text-gray-900">
              Designer
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Workflow Designer</h1>
        <p class="mt-1 text-sm text-gray-500">
          Visual drag-and-drop workflow designer with triggers and actions.
        </p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Onboard New User</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Trigger:{" "}
          <code class="rounded bg-blue-100 px-1 py-0.5 font-mono text-xs">user.signup</code> • 4
          steps • Last run 2 minutes ago
        </Alert.Description>
      </Alert.Root>

      <Card.Root class="rounded-lg border border-gray-200 bg-white">
        <Card.Header class="border-b border-gray-200 px-4 py-3">
          <Card.Title class="text-sm font-semibold text-gray-900">Workflow Steps</Card.Title>
        </Card.Header>
        <Card.Content class="px-4 py-4">
          <div class="space-y-3">
            {STEPS.map((step, index) => (
              <div class="flex items-center gap-3">
                <div class="flex flex-col items-center">
                  <span
                    class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step.status === "success"
                        ? "bg-green-100 text-green-800"
                        : step.status === "running"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {index < STEPS.length - 1 && <div class="mt-1 h-6 w-0.5 bg-gray-200" />}
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">{step.name}</p>
                    <StatusBadge type={step.status} />
                  </div>
                  <p class="text-xs text-gray-500">Type: {step.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Root>

      <div>
        <h2 class="mb-4 text-lg font-semibold text-gray-900">All Workflows</h2>
        <div class="space-y-4">
          {WORKFLOWS.map((wf) => (
            <WorkflowCard
              name={wf.name}
              trigger={wf.trigger}
              actions={wf.actions}
              status={wf.status}
            />
          ))}
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Duplicate
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Save & Run
        </Button.Root>
      </div>
    </div>
  )
}
