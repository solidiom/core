/**
 * @solidiom/chat-layout — Structural chat container managing message flow and composer positioning.
 *
 * Parts: Root, MessageList, Composer, Header.
 *
 * Purely structural — flex column filling height with scrollable message area,
 * fixed header and bottom composer sections.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatLayoutRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatLayout.Root — flex column container filling available height.
 */
export function Root(props: ChatLayoutRootProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-layout", part: "root" })}
    >
      {props.children}
    </div>
  )
}

// ─── Header ─────────────────────────────────────────────────────────────────

export interface ChatLayoutHeaderProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatLayout.Header — optional fixed top section. */
export function Header(props: ChatLayoutHeaderProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-layout", part: "header" })}
    >
      {props.children}
    </div>
  )
}

// ─── MessageList ────────────────────────────────────────────────────────────

export interface ChatLayoutMessageListProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatLayout.MessageList — scrollable middle section with role="list". */
export function MessageList(props: ChatLayoutMessageListProps) {
  return (
    <div
      role="list"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-layout", part: "message-list" })}
    >
      {props.children}
    </div>
  )
}

// ─── Composer ───────────────────────────────────────────────────────────────

export interface ChatLayoutComposerProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatLayout.Composer — fixed bottom section for the input area. */
export function Composer(props: ChatLayoutComposerProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-layout", part: "composer" })}
    >
      {props.children}
    </div>
  )
}
