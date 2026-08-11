import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import * as Tabs from "@solidiom/tabs"
import { PipelineStep } from "../components/PipelineStep"

interface PipelineDef {
  id: string
  name: string
  description: string
  steps: Array<{
    id: string
    name: string
    status: "completed" | "running" | "pending" | "failed"
    model?: string
    duration?: string
  }>
  lastRun: string
  status: "completed" | "running" | "pending" | "failed"
}

const PIPELINES: PipelineDef[] = [
  {
    id: "1",
    name: "Document Processing",
    description: "Extract, summarize, and classify uploaded documents.",
    lastRun: "10 minutes ago",
    status: "completed",
    steps: [
      {
        id: "s1",
        name: "Upload & Parse",
        status: "completed",
        model: "document-parser",
        duration: "2.3s",
      },
      {
        id: "s2",
        name: "Entity Extraction",
        status: "completed",
        model: "gpt-4-turbo",
        duration: "4.1s",
      },
      {
        id: "s3",
        name: "Summarize",
        status: "completed",
        model: "claude-3-sonnet",
        duration: "3.8s",
      },
      {
        id: "s4",
        name: "Classify & Tag",
        status: "completed",
        model: "text-embedding-3-large",
        duration: "1.2s",
      },
    ],
  },
  {
    id: "2",
    name: "Code Review Pipeline",
    description: "Automated code review with LLM-assisted analysis.",
    lastRun: "Running now",
    status: "running",
    steps: [
      { id: "s1", name: "Fetch Diff", status: "completed", model: "git-client", duration: "0.5s" },
      { id: "s2", name: "Static Analysis", status: "completed", model: "eslint", duration: "8.2s" },
      {
        id: "s3",
        name: "LLM Review",
        status: "running",
        model: "gpt-4-turbo",
        duration: "12s / ...",
      },
      { id: "s4", name: "Generate Report", status: "pending", model: "—" },
    ],
  },
  {
    id: "3",
    name: "Customer Feedback Loop",
    description: "Analyze support tickets, extract themes, and generate insights.",
    lastRun: "2 hours ago",
    status: "failed",
    steps: [
      {
        id: "s1",
        name: "Fetch Tickets",
        status: "completed",
        model: "api-client",
        duration: "1.0s",
      },
      {
        id: "s2",
        name: "Sentiment Analysis",
        status: "completed",
        model: "claude-3-sonnet",
        duration: "6.4s",
      },
      {
        id: "s3",
        name: "Theme Extraction",
        status: "failed",
        model: "text-embedding-3-large",
        duration: "timeout",
      },
      { id: "s4", name: "Report Generation", status: "pending", model: "—" },
    ],
  },
]

export function PipelineBuilder(): JSX.Element {
  const [selectedPipeline, setSelectedPipeline] = createSignal(PIPELINES[0])

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
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">
                  Pipeline
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Pipeline Builder</h1>
          <p class="mt-1 text-sm text-gray-500">
            Compose and visualize multi-step AI workflows with model assignments.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          New Pipeline
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Pipeline Composition</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Each pipeline step can be assigned a model. Steps execute sequentially unless configured
          for parallel execution.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PIPELINES.map((pipeline) => (
          <Card.Root
            class={`cursor-pointer rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
              selectedPipeline().id === pipeline.id
                ? "border-indigo-500 ring-1 ring-indigo-500"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedPipeline(pipeline)}
          >
            <Card.Header class="border-b border-gray-100 p-5 pb-3">
              <div class="flex items-start justify-between">
                <div>
                  <Card.Title class="text-sm font-semibold text-gray-900">
                    {pipeline.name}
                  </Card.Title>
                  <p class="mt-0.5 text-xs text-gray-500">{pipeline.lastRun}</p>
                </div>
                <span
                  class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    pipeline.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : pipeline.status === "running"
                        ? "bg-blue-100 text-blue-700"
                        : pipeline.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {pipeline.status}
                </span>
              </div>
            </Card.Header>
            <Card.Content class="p-5">
              <p class="text-sm text-gray-500">{pipeline.description}</p>
              <p class="mt-2 text-xs font-medium text-gray-500">{pipeline.steps.length} steps</p>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="border-b border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <Card.Title class="text-base font-semibold text-gray-900">
                {selectedPipeline().name}
              </Card.Title>
              <p class="mt-0.5 text-sm text-gray-500">Step execution sequence</p>
            </div>
            <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Run Pipeline
            </Button.Root>
          </div>
        </Card.Header>
        <Card.Content class="p-5">
          <div class="space-y-3">
            {selectedPipeline().steps.map((step, index) => (
              <div class="flex items-center gap-3">
                <PipelineStep {...step} />
                {index < selectedPipeline().steps.length - 1 && (
                  <div class="flex w-4 items-center justify-center">
                    <span class="h-4 w-0.5 bg-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
