import type { JSX } from "solid-js"

export function StatusBadge(props: { type: "success" | "error" | "running" | "queued" | "cancelled" | "active" | "paused" | "draft" }): JSX.Element {
  const styles: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    running: "bg-blue-100 text-blue-800",
    queued: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[props.type]}`}>
      {props.type}
    </span>
  )
}
