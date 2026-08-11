import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import { LogEntry } from "../components/LogEntry"

type RunStatus = "success" | "failed" | "running"

interface PipelineRun {
  id: string
  pipeline: string
  status: RunStatus
  startedAt: string
  duration: string
  logs: Array<{
    timestamp: string
    level: "info" | "warning" | "error"
    step: string
    message: string
  }>
}

const RUNS: PipelineRun[] = [
  {
    id: "1",
    pipeline: "Document Processing",
    status: "success",
    startedAt: "2024-08-09 16:42:00",
    duration: "11.4s",
    logs: [
      {
        timestamp: "16:42:01",
        level: "info",
        step: "Upload & Parse",
        message: "Received document batch: 12 files (PDF, DOCX)",
      },
      {
        timestamp: "16:42:03",
        level: "info",
        step: "Upload & Parse",
        message: "Parsing complete. Extracted 3,240 paragraphs.",
      },
      {
        timestamp: "16:42:04",
        level: "info",
        step: "Entity Extraction",
        message: "Starting entity extraction with gpt-4-turbo...",
      },
      {
        timestamp: "16:42:08",
        level: "info",
        step: "Entity Extraction",
        message: "Found 87 entities: 34 persons, 22 organizations, 31 locations",
      },
      {
        timestamp: "16:42:09",
        level: "warning",
        step: "Summarize",
        message: "High token count detected. Switching to chunked summarization.",
      },
      {
        timestamp: "16:42:13",
        level: "info",
        step: "Summarize",
        message: "Generated 12 summaries across 4 topics.",
      },
      {
        timestamp: "16:42:14",
        level: "info",
        step: "Classify & Tag",
        message: "Classification complete. Assigned 8 categories.",
      },
    ],
  },
  {
    id: "2",
    pipeline: "Code Review Pipeline",
    status: "running",
    startedAt: "2024-08-09 16:55:00",
    duration: "In progress...",
    logs: [
      {
        timestamp: "16:55:00",
        level: "info",
        step: "Fetch Diff",
        message: "Fetched diff from PR #482: 14 files changed",
      },
      {
        timestamp: "16:55:01",
        level: "info",
        step: "Fetch Diff",
        message: "Total changes: +342 / -89 lines",
      },
      {
        timestamp: "16:55:02",
        level: "info",
        step: "Static Analysis",
        message: "Running ESLint and TypeScript checks...",
      },
      {
        timestamp: "16:55:10",
        level: "warning",
        step: "Static Analysis",
        message: "Found 3 warnings: unused variables in utils.ts",
      },
      {
        timestamp: "16:55:11",
        level: "info",
        step: "LLM Review",
        message: "Submitting code context to gpt-4-turbo...",
      },
      {
        timestamp: "16:55:12",
        level: "info",
        step: "LLM Review",
        message: "Processing batch 1/3...",
      },
    ],
  },
  {
    id: "3",
    pipeline: "Customer Feedback Loop",
    status: "failed",
    startedAt: "2024-08-09 14:30:00",
    duration: "45.2s",
    logs: [
      {
        timestamp: "14:30:00",
        level: "info",
        step: "Fetch Tickets",
        message: "Fetched 248 support tickets from last 7 days",
      },
      {
        timestamp: "14:30:01",
        level: "info",
        step: "Fetch Tickets",
        message: "Ticket batch size: 248 (within limits)",
      },
      {
        timestamp: "14:30:02",
        level: "info",
        step: "Sentiment Analysis",
        message: "Starting sentiment analysis with claude-3-sonnet...",
      },
      {
        timestamp: "14:30:08",
        level: "info",
        step: "Sentiment Analysis",
        message: "Results: 62% positive, 28% neutral, 10% negative",
      },
      {
        timestamp: "14:30:09",
        level: "info",
        step: "Theme Extraction",
        message: "Generating embeddings with text-embedding-3-large...",
      },
      {
        timestamp: "14:30:35",
        level: "error",
        step: "Theme Extraction",
        message: "Request timeout after 30s. Embedding service unavailable.",
      },
      {
        timestamp: "14:30:36",
        level: "error",
        step: "Theme Extraction",
        message: "Pipeline aborted due to step failure.",
      },
    ],
  },
  {
    id: "4",
    pipeline: "Document Processing",
    status: "success",
    startedAt: "2024-08-09 10:15:00",
    duration: "9.8s",
    logs: [
      {
        timestamp: "10:15:00",
        level: "info",
        step: "Upload & Parse",
        message: "Received document: quarterly_report_Q3.pdf",
      },
      {
        timestamp: "10:15:02",
        level: "info",
        step: "Entity Extraction",
        message: "Extracted 45 entities.",
      },
      {
        timestamp: "10:15:06",
        level: "info",
        step: "Summarize",
        message: "Generated executive summary.",
      },
      {
        timestamp: "10:15:08",
        level: "info",
        step: "Classify & Tag",
        message: "Tags: [finance, quarterly, earnings]",
      },
    ],
  },
]

export function ExecutionLogs(): JSX.Element {
  const [expandedRun, setExpandedRun] = createSignal<string | null>(null)

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
              <Breadcrumb.Link href="/executions" current class="text-gray-900 font-medium">
                Executions
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Execution Logs</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitor pipeline runs, inspect step outputs, and trace failures.
        </p>
      </div>

      <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
        <Alert.Title class="text-sm font-medium text-red-800">Recent Failure</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-red-700">
          Customer Feedback Loop failed at "Theme Extraction" step due to embedding service timeout.
          Check service health.
        </Alert.Description>
      </Alert.Root>

      <Tabs.Root defaultValue="recent">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="recent"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Recent Runs
          </Tabs.Trigger>
          <Tabs.Trigger
            value="failed"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Failed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="recent" class="pt-6">
          <div class="space-y-4">
            {RUNS.map((run) => (
              <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
                <Card.Header
                  class="flex cursor-pointer items-center justify-between p-5"
                  onClick={() => setExpandedRun(expandedRun() === run.id ? null : run.id)}
                >
                  <div class="flex items-center gap-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        run.status === "success"
                          ? "bg-green-100 text-green-700"
                          : run.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {run.status}
                    </span>
                    <Card.Title class="text-sm font-semibold text-gray-900">
                      {run.pipeline}
                    </Card.Title>
                    <span class="text-xs text-gray-400">{run.startedAt}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-500">{run.duration}</span>
                    <span class="text-gray-400">{expandedRun() === run.id ? "▴" : "▾"}</span>
                  </div>
                </Card.Header>
                {expandedRun() === run.id && (
                  <Card.Content class="border-t border-gray-100 p-5">
                    <div class="space-y-2">
                      {run.logs.map((log) => (
                        <LogEntry
                          timestamp={log.timestamp}
                          level={log.level}
                          step={log.step}
                          message={log.message}
                        />
                      ))}
                    </div>
                  </Card.Content>
                )}
              </Card.Root>
            ))}
          </div>
        </Tabs.Content>
        <Tabs.Content value="failed" class="pt-6">
          <div class="space-y-4">
            {RUNS.filter((r) => r.status === "failed").map((run) => (
              <Card.Root class="rounded-lg border border-red-200 bg-white shadow-sm">
                <Card.Header class="flex items-center justify-between p-5">
                  <div class="flex items-center gap-4">
                    <span class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      {run.status}
                    </span>
                    <Card.Title class="text-sm font-semibold text-gray-900">
                      {run.pipeline}
                    </Card.Title>
                    <span class="text-xs text-gray-400">{run.startedAt}</span>
                  </div>
                  <Button.Root class="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Retry
                  </Button.Root>
                </Card.Header>
                <Card.Content class="border-t border-red-100 p-5">
                  <div class="space-y-2">
                    {run.logs.map((log) => (
                      <LogEntry
                        timestamp={log.timestamp}
                        level={log.level}
                        step={log.step}
                        message={log.message}
                      />
                    ))}
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
