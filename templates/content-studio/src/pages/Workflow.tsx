import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import { StatusBadge } from "../components/StatusBadge"

const REVIEW_COMMENTS = [
  { id: 1, item: "Case Study: Acme Corp", author: "Alice Chen", text: "Make sure to include the ROI metrics from Q2.", time: "2h ago" },
  { id: 2, item: "White Paper: Industry Trends", author: "Bob Lee", text: "The methodology section needs more detail on sample size.", time: "4h ago" },
  { id: 3, item: "Video Script: Product Demo", author: "Carol Wu", text: "Great flow. Just tighten the intro to under 30 seconds.", time: "1d ago" },
]

const ASSIGNMENTS = [
  { title: "Blog Post: Spring Campaign", author: "Alice Chen", deadline: "Aug 15", priority: "high" },
  { title: "Email Newsletter #14", author: "Bob Lee", deadline: "Aug 18", priority: "medium" },
  { title: "Landing Page Copy", author: "Carol Wu", deadline: "Aug 20", priority: "low" },
  { title: "Social Media Calendar", author: "Alice Chen", deadline: "Aug 22", priority: "medium" },
]

const priorityColors: Record<string, string> = {
  high: "text-red-600 bg-red-50",
  medium: "text-yellow-600 bg-yellow-50",
  low: "text-green-600 bg-green-50",
}

export function Workflow(): JSX.Element {
  const [selectedStage, setSelectedStage] = createSignal("Review")

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Workflow</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Editorial Workflow</h1>
        <p class="mt-1 text-sm text-gray-500">Manage content through the editorial pipeline from draft to published.</p>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <div
            class={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedStage() === stage.name
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setSelectedStage(stage.name)}
          >
            <div class="mb-3 flex items-center justify-between">
              <h3 class="font-medium text-gray-900">{stage.name}</h3>
              <span class={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white ${stage.color}`}>
                {stage.count}
              </span>
            </div>
            <div class="space-y-2">
              {(PIPELINE_ITEMS as any)[stage.name]?.map((item: { title: string; author: string }) => (
                <div class="rounded-md border border-gray-100 bg-gray-50 p-3">
                  <div class="text-sm font-medium text-gray-900">{item.title}</div>
                  <div class="text-xs text-gray-500">{item.author}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <Card.Root>
          <Card.Header>
            <Card.Title>Recent Review Comments</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="space-y-4">
              {REVIEW_COMMENTS.map((comment) => (
                <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900">{comment.item}</span>
                    <StatusBadge status="review" />
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{comment.text}</p>
                  <div class="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>{comment.author}</span>
                    <span>{comment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Upcoming Deadlines</Card.Title>
          </Card.Header>
          <Card.Content>
            <Alert.Root variant="info" class="mb-4">
               <Alert.Description>3 assignments due this week — 1 high priority</Alert.Description>
            </Alert.Root>
            <div class="space-y-3">
              {ASSIGNMENTS.map((assignment) => (
                <div class="flex items-center justify-between rounded-md border border-gray-100 p-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{assignment.title}</div>
                    <div class="text-xs text-gray-500">{assignment.author}</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-500">{assignment.deadline}</span>
                    <span class={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[assignment.priority]}`}>
                      {assignment.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  )
}
