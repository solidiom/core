import type { JSX } from "@solidjs/web"

type StepStatus = "completed" | "running" | "pending" | "failed"

interface PipelineStepProps {
  id: string
  name: string
  status: StepStatus
  model?: string
  duration?: string
}

export function PipelineStep(props: PipelineStepProps): JSX.Element {
  const statusIcon = () => {
    switch (props.status) {
      case "completed":
        return "✓"
      case "running":
        return "⟳"
      case "pending":
        return "○"
      case "failed":
        return "✕"
    }
  }

  const statusColor = () => {
    switch (props.status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "running":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-500 border-gray-200"
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
    }
  }

  return (
    <div class={`flex items-center gap-4 rounded-lg border p-4 ${statusColor()}`}>
      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold">
        {statusIcon()}
      </span>
      <div class="flex-1">
        <p class="text-sm font-medium">{props.name}</p>
        <p class="text-xs opacity-75">
          {props.model && `${props.model}`}
          {props.model && props.duration && " · "}
          {props.duration && props.duration}
        </p>
      </div>
      <span class="text-xs font-medium uppercase tracking-wide">{props.status}</span>
    </div>
  )
}
