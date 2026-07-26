import { createSignal, Show } from "solid-js"
import type { Element } from "solid-js"
import { CodeBlock } from "./code-block"

interface ComponentPreviewProps {
  /** The rendered component demo */
  children: Element
  /** Source code of the demo */
  code: string
  /** Language for syntax highlighting */
  lang?: string
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const [tab, setTab] = createSignal<"preview" | "code">("preview")

  return (
    <div class="rounded-lg border border-[hsl(var(--border))]">
      {/* Tab bar */}
      <div class="flex border-b border-[hsl(var(--border))]">
        <TabButton active={tab() === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
        <TabButton active={tab() === "code"} onClick={() => setTab("code")}>
          Code
        </TabButton>
      </div>

      {/* Content */}
      <Show when={tab() === "preview"}>
        <div class="flex min-h-[200px] items-center justify-center p-8">{props.children}</div>
      </Show>
      <Show when={tab() === "code"}>
        <div class="[&>div]:rounded-none [&>div]:border-0">
          <CodeBlock code={props.code} lang={props.lang ?? "tsx"} />
        </div>
      </Show>
    </div>
  )
}

function TabButton(props: { active: boolean; onClick: () => void; children: Element }) {
  return (
    <button
      onClick={props.onClick}
      class={`px-4 py-2 text-sm font-medium transition-colors ${
        props.active
          ? "border-b-2 border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]"
          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
      }`}
    >
      {props.children}
    </button>
  )
}
