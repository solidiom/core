/**
 * @solidiom/code-block — Code display primitive with line numbers and copy button.
 *
 * Parts: Root, Pre, Code, LineNumbers, CopyButton, Header, Language.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createClipboard } from "@solidiom/runtime"
import { createMemo, For } from "solid-js"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** The source code to display. */
  code: string
  /** Programming language identifier. */
  language?: string
  /** Whether to show line numbers. */
  showLineNumbers?: boolean
  /** Line numbers to highlight. */
  highlightLines?: number[]
}

export interface PreProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface CodeProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** Programming language identifier. */
  language?: string
}

export interface LineNumbersProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** The source code to derive line numbers from. */
  code: string
  /** Line numbers to highlight. */
  highlightLines?: number[]
}

export interface CopyButtonProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** The code text to copy. */
  code: string
}

export interface HeaderProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface LanguageProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** The language label to display. */
  language?: string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "code-block", part: "root" })}
    >
      {props.children}
    </div>
  )
}

export function Pre(props: PreProps) {
  return (
    <pre
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "code-block", part: "pre" })}
    >
      {props.children}
    </pre>
  )
}

export function Code(props: CodeProps) {
  return (
    <code
      class={props.language ? `language-${props.language}` : undefined}
      data-language={props.language}
      style={props.style}
      {...applySemanticAttrs({ scope: "code-block", part: "code" })}
    >
      {props.children}
    </code>
  )
}

export function LineNumbers(props: LineNumbersProps) {
  const lines = createMemo(() => props.code.split("\n"))

  return (
    <ol
      class={props.class}
      style={props.style}
      aria-hidden="true"
      {...applySemanticAttrs({ scope: "code-block", part: "line-numbers" })}
    >
      <For each={lines()}>
        {(_, index) => (
          <li
            data-highlighted={
              props.highlightLines?.includes(index() + 1) ? "" : undefined
            }
          >
            {index() + 1}
          </li>
        )}
      </For>
    </ol>
  )
}

export function CopyButton(props: CopyButtonProps) {
  const clipboard = createClipboard()

  const handleClick = () => {
    clipboard.copy(props.code)
  }

  return (
    <button
      type="button"
      class={props.class}
      style={props.style}
      onClick={handleClick}
      data-copied={clipboard.copied() ? "" : undefined}
      aria-label={clipboard.copied() ? "Copied" : "Copy code"}
      {...applySemanticAttrs({
        scope: "code-block",
        part: "copy-button",
        state: clipboard.copied() ? "copied" : "idle",
      })}
    >
      {props.children ?? (clipboard.copied() ? "Copied" : "Copy")}
    </button>
  )
}

export function Header(props: HeaderProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "code-block", part: "header" })}
    >
      {props.children}
    </div>
  )
}

export function Language(props: LanguageProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "code-block", part: "language" })}
    >
      {props.children ?? props.language}
    </span>
  )
}
