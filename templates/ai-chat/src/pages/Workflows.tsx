import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"

type WorkflowStatus = "active" | "draft" | "archived"

interface Workflow {
  id: string
  name: string
  description: string
  steps: number
  status: WorkflowStatus
  lastRun: string
  avgDuration: string
}

const WORKFLOWS: Workflow[] = [
  { id: "1", name: "Document Summarizer", description: "Extract key points from uploaded documents using GPT-4, then format as bullet points.", steps: 4, status: "active", lastRun: "5 min ago", avgDuration: "12s" },
  { id: "2", name: "Image Analysis Pipeline", description: "Process images through CLIP for classification, then DALL-E for style transfer.", steps: 6, status: "active", lastRun: "1 hour ago", avgDuration: "45s" },
  { id: "3", name: "Code Generation Workflow", description: "Generate code from natural language specs, run tests, and apply fixes iteratively.", steps: 5, status: "draft", lastRun: "Never", avgDuration: "—" },
  { id: "4", name: "Sentiment Analyzer", description: "Analyze customer reviews for sentiment, extract entities, and generate summary reports.", steps: 3, status: "active", lastRun: "2 hours ago", avgDuration: "8s" },
  { id: "5", name: "Data Pipeline Orchestrator", description: "Clean, transform, and load data with LLM-assisted schema inference.", steps: 7, status: "archived", lastRun: "3 days ago", avgDuration: "2m 15s" },
  { id: "6", name: "Multi-Agent Debate", description: "Run multiple LLM agents in a structured debate format to reach consensus.", steps: 8, status: "draft", lastRun: "Never", avgDuration: "—" },
]

const statusLabel = (status: WorkflowStatus) => {
  switch (status) {
    case "active": return { label: "Active", class: "bg-green-100 text-green-700" }
    case "draft": return { label: "Draft", class: "bg-gray-100 text-gray-600" }
    case "archived": return { label: "Archived", class: "bg-yellow-100 text-yellow-700" }
  }
}

const statusDot = (status: WorkflowStatus) => {
  switch (status) {
    case "active": return "bg-green-500"
    case "draft": return "bg-gray-400"
    case "archived": return "bg-yellow-500"
  }
}

export function Workflows(): JSX.Element {
  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/workflows" current class="text-gray-900 font-medium">Workflows</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Workflows</h1>
          <p class="mt-1 text-sm text-gray-500">Visual workflow builder for composing multi-step AI pipelines.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          New Workflow
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Workflow Builder</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Compose workflows by chaining AI models, data transformations, and conditional logic. Active workflows can be triggered via API.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKFLOWS.map((wf) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <Card.Header class="flex items-start justify-between border-b border-gray-100 p-5 pb-3">
              <div class="flex-1">
                <Card.Title class="text-sm font-semibold text-gray-900">{wf.name}</Card.Title>
                <span class={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusLabel(wf.status).class}`}>
                  <span class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(wf.status)}`} />
                  {statusLabel(wf.status).label}
                </span>
              </div>
            </Card.Header>
            <Card.Content class="p-5">
              <p class="text-sm text-gray-500">{wf.description}</p>
              <dl class="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500">Steps</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-gray-900">{wf.steps}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500">Last Run</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-gray-900">{wf.lastRun}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500">Avg Time</dt>
                  <dd class="mt-0.5 text-sm font-semibold text-gray-900">{wf.avgDuration}</dd>
                </div>
              </dl>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
