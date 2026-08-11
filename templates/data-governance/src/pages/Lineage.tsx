import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"
import { ClassificationBadge } from "../components/ClassificationBadge"

interface LineageStep {
  name: string
  type: "source" | "transform" | "destination"
  description: string
  format: string
  classification: string
  lastRun: string
}

const LINEAGE_PIPES = [
  {
    name: "Customer 360 Pipeline",
    steps: [
      {
        name: "postgres.customers",
        type: "source" as const,
        description: "Primary customer database",
        format: "PostgreSQL",
        classification: "restricted" as const,
        lastRun: "Every 15 min",
      },
      {
        name: "dbt.clean_customers",
        type: "transform" as const,
        description: "Deduplicate and standardize customer records",
        format: "SQL / dbt",
        classification: "restricted" as const,
        lastRun: "Every 15 min",
      },
      {
        name: "dbt.enrich_customers",
        type: "transform" as const,
        description: "Join with behavioral and transactional data",
        format: "SQL / dbt",
        classification: "confidential" as const,
        lastRun: "Hourly",
      },
      {
        name: "snowflake.customer_360",
        type: "destination" as const,
        description: "Unified customer view for analytics",
        format: "Snowflake Table",
        classification: "confidential" as const,
        lastRun: "Hourly",
      },
    ],
  },
  {
    name: "Revenue Attribution Pipeline",
    steps: [
      {
        name: "kafka.payment_events",
        type: "source" as const,
        description: "Real-time payment event stream",
        format: "Kafka / JSON",
        classification: "confidential" as const,
        lastRun: "Continuous",
      },
      {
        name: "spark.clean_payments",
        type: "transform" as const,
        description: "Parse and validate payment events",
        format: "Spark / Parquet",
        classification: "confidential" as const,
        lastRun: "Every 5 min",
      },
      {
        name: "spark.attribution_model",
        type: "transform" as const,
        description: "Multi-touch attribution calculation",
        format: "Spark / Python",
        classification: "internal" as const,
        lastRun: "Daily",
      },
      {
        name: "bigquery.revenue_dashboard",
        type: "destination" as const,
        description: "Aggregated revenue metrics for BI tools",
        format: "BigQuery Table",
        classification: "internal" as const,
        lastRun: "Daily",
      },
    ],
  },
]

function StepTypeIcon(props: { type: string }): JSX.Element {
  const config = () => {
    switch (props.type) {
      case "source":
        return { label: "Source", color: "bg-green-100 text-green-700", arrow: "→" }
      case "transform":
        return { label: "Transform", color: "bg-blue-100 text-blue-700", arrow: "→" }
      case "destination":
        return { label: "Destination", color: "bg-purple-100 text-purple-700", arrow: "" }
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config().color}`}
    >
      {config().label}
    </span>
  )
}

export function Lineage(): JSX.Element {
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
              <Breadcrumb.Link href="/lineage" current class="text-gray-900 font-medium">
                Data Lineage
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Data Lineage</h1>
          <p class="mt-1 text-sm text-gray-500">
            Trace data flow from source to destination with transformation history.
          </p>
        </div>
      </div>

      <div class="space-y-8">
        {LINEAGE_PIPES.map((pipe) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900">{pipe.name}</h2>
            <div class="mt-6 space-y-0">
              {pipe.steps.map((step, i) => (
                <div class="flex items-start gap-4">
                  <div class="flex flex-col items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {i + 1}
                    </div>
                    {i < pipe.steps.length - 1 && <div class="mt-1 h-8 w-px bg-gray-300" />}
                  </div>
                  <div class="flex-1 pb-6">
                    <div class="flex items-center gap-2">
                      <code class="text-sm font-mono font-semibold text-gray-900">{step.name}</code>
                      <StepTypeIcon type={step.type} />
                      <ClassificationBadge level={step.classification} />
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{step.description}</p>
                    <div class="mt-1 flex gap-4 text-xs text-gray-400">
                      <span>Format: {step.format}</span>
                      <span>Schedule: {step.lastRun}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
