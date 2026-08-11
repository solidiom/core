import type { JSX } from "solid-js"

type ClassificationType = "public" | "internal" | "confidential" | "restricted"

interface ClassificationBadgeProps {
  level: ClassificationType
}

export function ClassificationBadge(props: ClassificationBadgeProps): JSX.Element {
  const colors = () => {
    switch (props.level) {
      case "public":
        return "bg-green-100 text-green-700"
      case "internal":
        return "bg-blue-100 text-blue-700"
      case "confidential":
        return "bg-yellow-100 text-yellow-700"
      case "restricted":
        return "bg-red-100 text-red-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      {props.level}
    </span>
  )
}
