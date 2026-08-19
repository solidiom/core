import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"
import { SeverityBadge, type SeverityLevel } from "./SeverityBadge"

interface IncidentCardProps {
  id: string
  severity: SeverityLevel
  title: string
  responders: string[]
  started: string
  updates: number
}

export function IncidentCard(props: IncidentCardProps): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <SeverityBadge severity={props.severity} />
            <h3 class="text-sm font-semibold text-gray-900">{props.title}</h3>
          </div>
          <p class="mt-1 text-xs text-gray-400">{props.id}</p>
        </div>
        <span class="text-xs text-gray-400">{props.started}</span>
      </div>
      <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div class="flex items-center gap-2">
          {props.responders.map((responder, i) => (
            <span
              key={i}
              class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700"
              title={responder}
            >
              {responder.charAt(0)}
            </span>
          ))}
          <span class="text-xs text-gray-500">
            {props.responders.length} responder{props.responders.length > 1 ? "s" : ""}
          </span>
        </div>
        <span class="text-xs text-gray-500">
          {props.updates} update{props.updates !== 1 ? "s" : ""}
        </span>
      </div>
    </Card.Root>
  )
}
