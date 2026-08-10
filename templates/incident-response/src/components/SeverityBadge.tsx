import type { JSX } from "solid-js"

export type SeverityLevel = "critical" | "high" | "medium" | "low"

interface SeverityBadgeProps {
  severity: SeverityLevel
}

export function SeverityBadge(props: SeverityBadgeProps): JSX.Element {
  const colors = () => {
    switch (props.severity) {
      case "critical": return "bg-red-100 text-red-700"
      case "high": return "bg-orange-100 text-orange-700"
      case "medium": return "bg-yellow-100 text-yellow-700"
      case "low": return "bg-green-100 text-green-700"
    }
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}>
      {props.severity}
    </span>
  )
}
