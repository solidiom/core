import type { JSX } from "@solidjs/web"

export function CodeBlock(props: { code: string; language?: string }): JSX.Element {
  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-gray-900">
      {props.language && (
        <div class="border-b border-gray-700 px-4 py-2">
          <span class="text-xs text-gray-400">{props.language}</span>
        </div>
      )}
      <pre class="overflow-x-auto p-4">
        <code class="text-sm text-gray-100">{props.code}</code>
      </pre>
    </div>
  )
}
