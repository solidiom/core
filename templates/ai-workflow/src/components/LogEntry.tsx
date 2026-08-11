import type { JSX } from "solid-js"

type LogLevel = "info" | "warning" | "error"

interface LogEntryProps {
  timestamp: string
  level: LogLevel
  step: string
  message: string
}

export function LogEntry(props: LogEntryProps): JSX.Element {
  const levelColor = () => {
    switch (props.level) {
      case "info":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
    }
  }

  const levelBg = () => {
    switch (props.level) {
      case "info":
        return "bg-blue-50"
      case "warning":
        return "bg-yellow-50"
      case "error":
        return "bg-red-50"
    }
  }

  return (
    <div class={`flex items-start gap-3 rounded border border-gray-100 px-4 py-3 ${levelBg()}`}>
      <span class="whitespace-nowrap text-xs text-gray-400">{props.timestamp}</span>
      <span class={`whitespace-nowrap text-xs font-bold uppercase ${levelColor()}`}>
        {props.level}
      </span>
      <span class="whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
        {props.step}
      </span>
      <span class="text-sm text-gray-700">{props.message}</span>
    </div>
  )
}
