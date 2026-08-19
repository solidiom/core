import type { JSX } from "@solidjs/web"

type SeverityType = "info" | "warning" | "error" | "success"

const SEVERITY_STYLES: Record<SeverityType, string> = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
}

export function SeverityBadge(props: { severity: SeverityType }): JSX.Element {
  return (
    <span
      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLES[props.severity]}`}
    >
      {props.severity}
    </span>
  )
}
