import type { JSX } from "solid-js"
import { createSignal } from "solid-js"

interface ModelOption {
  id: string
  name: string
  provider: string
  contextWindow: string
}

interface ModelSelectProps {
  models: ModelOption[]
  value: string
  onChange: (id: string) => void
}

export function ModelSelect(props: ModelSelectProps): JSX.Element {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      {props.models.map((model) => (
        <option value={model.id}>
          {model.name} ({model.provider}, {model.contextWindow})
        </option>
      ))}
    </select>
  )
}
