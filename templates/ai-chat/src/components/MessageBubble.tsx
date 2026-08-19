import type { JSX } from "@solidjs/web"

type Role = "user" | "assistant"

interface MessageBubbleProps {
  role: Role
  content: string
  timestamp?: string
  model?: string
}

export function MessageBubble(props: MessageBubbleProps): JSX.Element {
  const isUser = props.role === "user"

  return (
    <div class={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        class={`max-w-lg rounded-lg px-4 py-3 ${
          isUser ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <p class="text-sm whitespace-pre-wrap">{props.content}</p>
        <div
          class={`mt-1.5 flex items-center gap-2 text-xs ${
            isUser ? "text-indigo-200" : "text-gray-400"
          }`}
        >
          {props.model && <span>{props.model}</span>}
          {props.timestamp && (
            <>
              {props.model && <span>·</span>}
              <span>{props.timestamp}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
