/**
 * Chat / Composer block — a composable chat UI using existing solidiom primitives.
 *
 * Composes: scroll-area (when available), avatar, button, input.
 * This is a copy-paste block, not a standalone primitive.
 */

import { createSignal, For } from "solid-js"
import { type JSX } from "@solidjs/web"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

export function ChatComposerBlock() {
  const [messages, setMessages] = createSignal<Message[]>([
    { id: "1", sender: "Alice", text: "Hey, how's the project going?", timestamp: "10:30 AM" },
    {
      id: "2",
      sender: "You",
      text: "Going well! Just finished the navigation menu primitive.",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice",
      text: "Nice! Let me know if you need a review.",
      timestamp: "10:33 AM",
    },
  ])
  const [input, setInput] = createSignal("")

  const send = () => {
    const text = input().trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: "You", text, timestamp: "Now" },
    ])
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div class="flex flex-col h-[350px] w-full max-w-md rounded-lg border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div class="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
        <div class="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-xs font-bold">
          A
        </div>
        <span class="text-sm font-medium">Alice</span>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <For each={messages()}>
          {(msg) => (
            <div class={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
              <div
                class={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  msg.sender === "You" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
                }`}
              >
                {msg.text}
              </div>
              <span class="text-xs text-zinc-400 mt-1">{msg.timestamp}</span>
            </div>
          )}
        </For>
      </div>

      {/* Composer */}
      <div class="border-t border-zinc-200 p-3 flex items-center gap-2">
        <input
          type="text"
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          class="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          type="button"
          onClick={send}
          class="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export const chatComposerBlockCode = `// Chat Composer — composed from existing primitives.
// When @solidiom/scroll-area is available, use it for the message list.

import * as ScrollArea from "@solidiom/scroll-area"
import * as Button from "@solidiom/button"

function Chat() {
  return (
    <div class="flex flex-col h-[500px]">
      <ScrollArea.Root class="flex-1">
        <ScrollArea.Viewport>
          {/* Message list */}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <div class="border-t p-3 flex gap-2">
        <input placeholder="Type..." class="flex-1" />
        <Button.Root>Send</Button.Root>
      </div>
    </div>
  )
}
`
