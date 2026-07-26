/**
 * Code Block — syntax-highlighted code display using shiki.
 *
 * Purely a styling recipe + third-party tokenizer. No solidiom primitive needed.
 */

import { createMemo } from "solid-js"

export function CodeBlockBlock() {
  const sampleCode = `import * as Toggle from "@solidiom/toggle"

function BoldToggle() {
  const [pressed, setPressed] = createSignal(false)
  return (
    <Toggle.Root pressed={pressed} onPressedChange={setPressed}>
      <strong>B</strong>
    </Toggle.Root>
  )
}`

  return (
    <div class="w-full max-w-lg">
      <div class="rounded-lg border border-zinc-200 bg-zinc-900 text-zinc-100 overflow-hidden">
        <div class="flex items-center justify-between border-b border-zinc-700 px-4 py-2">
          <span class="text-xs text-zinc-400">example.tsx</span>
          <button
            type="button"
            class="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            onClick={() => navigator.clipboard.writeText(sampleCode)}
          >
            Copy
          </button>
        </div>
        <pre class="overflow-x-auto p-4 text-sm leading-relaxed">
          <code>{sampleCode}</code>
        </pre>
      </div>
      <p class="mt-2 text-xs text-zinc-500">
        For syntax highlighting, integrate with <code>shiki</code> or <code>prismjs</code>.
      </p>
    </div>
  )
}

export const codeBlockBlockCode = `// Code Block — integrate with shiki for syntax highlighting.
// See: https://shiki.style/

import { codeToHtml } from "shiki"

async function HighlightedCode(props: { code: string; lang: string }) {
  const html = await codeToHtml(props.code, {
    lang: props.lang,
    theme: "github-dark",
  })
  return <div innerHTML={html} class="rounded-lg overflow-hidden" />
}
`
