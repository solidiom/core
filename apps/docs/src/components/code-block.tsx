import { createSignal, onSettled, Show } from "solid-js"
import { createHighlighter, type Highlighter } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["tsx", "typescript", "bash", "json", "css"],
    })
  }
  return highlighterPromise
}

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
}

export function CodeBlock(props: CodeBlockProps) {
  const [html, setHtml] = createSignal("")

  onSettled(() => {
    getHighlighter().then((hl) => {
      const result = hl.codeToHtml(props.code, {
        lang: props.lang ?? "tsx",
        themes: { light: "github-light", dark: "github-dark" },
      })
      setHtml(result)
    })
  })

  return (
    <div class="relative rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
      <Show when={props.filename}>
        <div class="border-b border-[hsl(var(--border))] px-4 py-2 text-xs text-[hsl(var(--muted-foreground))] font-mono">
          {props.filename}
        </div>
      </Show>
      <div class="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:!bg-transparent [&_.shiki]:!bg-transparent">
        <Show
          when={html()}
          fallback={
            <pre class="font-mono text-sm">
              <code>{props.code}</code>
            </pre>
          }
        >
          <div innerHTML={html()} />
        </Show>
      </div>
      <CopyButton code={props.code} />
    </div>
  )
}

function CopyButton(props: { code: string }) {
  const [copied, setCopied] = createSignal(false)

  function copy() {
    navigator.clipboard.writeText(props.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      class="absolute top-2 right-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
      aria-label="Copy code"
    >
      {copied() ? "Copied!" : "Copy"}
    </button>
  )
}
