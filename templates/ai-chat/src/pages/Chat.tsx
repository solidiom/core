import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Card from "@solidiom/card"
import * as ScrollArea from "@solidiom/scroll-area"
import { MessageBubble } from "../components/MessageBubble"
import { ModelSelect } from "../components/ModelSelect"

const MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", contextWindow: "8K" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", contextWindow: "16K" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", contextWindow: "200K" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", contextWindow: "8K" },
]

const INITIAL_MESSAGES = [
  {
    role: "user" as const,
    content: "What are the best practices for prompt engineering?",
    timestamp: "10:30 AM",
  },
  {
    role: "assistant" as const,
    content:
      "Here are the key best practices for prompt engineering:\n\n1. **Be specific** — Clearly state the task, format, and constraints you want.\n\n2. **Provide examples** — Use few-shot prompting to demonstrate the desired output pattern.\n\n3. **Use delimiters** — Separate different sections with XML tags or triple backticks.\n\n4. **Chain of thought** — For complex reasoning, ask the model to think step by step.\n\n5. **Set the role** — Assign a persona or expertise to frame the model's responses.",
    timestamp: "10:30 AM",
    model: "Claude 3 Opus",
  },
  {
    role: "user" as const,
    content: "Can you give me an example of a good system prompt?",
    timestamp: "10:32 AM",
  },
  {
    role: "assistant" as const,
    content:
      "Certainly! Here's a well-structured system prompt:\n\n```\nYou are an expert software architect with 15 years of experience. Your task is to review code and provide constructive feedback. Always structure your response in three sections: Summary, Strengths, and Suggestions for Improvement. Be specific and actionable.\n```",
    timestamp: "10:32 AM",
    model: "Claude 3 Opus",
  },
]

export function Chat(): JSX.Element {
  const [messages] = createSignal(INITIAL_MESSAGES)
  const [inputValue] = createSignal("")
  const [selectedModel, setSelectedModel] = createSignal("claude-3-opus")
  const [isTyping] = createSignal(false)
  const [tokenCount] = createSignal(1247)

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">
                Chat
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Chat</h1>
        <p class="mt-1 text-sm text-gray-500">
          Conversational AI interface with message history and model selection.
        </p>
      </div>

      <Card.Root
        class="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm"
        style="height: 520px;"
      >
        <Card.Header class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <Card.Title class="text-sm font-semibold text-gray-900">Conversation</Card.Title>
            <ModelSelect models={MODELS} value={selectedModel()} onChange={setSelectedModel} />
          </div>
        </Card.Header>
        <ScrollArea.Root class="flex-1 overflow-hidden p-4">
          <div class="space-y-4">
            {messages().map((msg) => (
              <MessageBubble
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                model={msg.model}
              />
            ))}
          </div>
        </ScrollArea.Root>
        <Card.Content class="border-t border-gray-200 p-4">
          <div class="flex gap-3">
            <Input.Root
              placeholder="Type a message..."
              value={inputValue()}
              class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Send
            </Button.Root>
            {isTyping() && (
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"></span>
                <span
                  class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"
                  style="animation-delay: 0.15s"
                ></span>
                <span
                  class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"
                  style="animation-delay: 0.3s"
                ></span>
              </div>
            )}
          </div>
          <div class="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{tokenCount()} tokens used</span>
            <span>{messages().length} messages</span>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
