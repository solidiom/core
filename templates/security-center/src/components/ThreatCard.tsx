import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"
import { StatusBadge } from "./StatusBadge"

type ThreatType = "malware" | "intrusion" | "ddos" | "phishing" | "vulnerability"
type SeverityLevel = "critical" | "high" | "medium" | "low"

interface ThreatCardProps {
  id: string
  type: ThreatType
  severity: SeverityLevel
  title: string
  affectedAssets: number
  detected: string
  status: "active" | "mitigated" | "closed"
}

const severityColors: Record<SeverityLevel, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
}

export function ThreatCard(props: ThreatCardProps): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[props.severity]}`}>
              {props.severity}
            </span>
            <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {props.type}
            </span>
          </div>
          <h3 class="mt-2 text-sm font-semibold text-gray-900">{props.title}</h3>
          <p class="mt-1 text-xs text-gray-400">{props.id}</p>
        </div>
        <StatusBadge status={props.status} />
      </div>
      <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span class="text-xs text-gray-500">{props.affectedAssets} affected asset{props.affectedAssets !== 1 ? "s" : ""}</span>
        <span class="text-xs text-gray-400">Detected: {props.detected}</span>
      </div>
    </Card.Root>
  )
}
