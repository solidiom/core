/**
 * @solidiom/chat-system-message — System announcements in chat (joins, leaves, errors).
 *
 * Parts: Root, Icon, Content, Timestamp.
 *
 * Uses role="status" with aria-live="polite" for accessible announcements.
 * Supports typed system messages: info, warning, error, join, leave.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export type SystemMessageType = "info" | "warning" | "error" | "join" | "leave"

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatSystemMessageRootProps {
  /** Type of system message. */
  type?: SystemMessageType
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatSystemMessage.Root — container with role="status" and aria-live="polite".
 */
export function Root(props: ChatSystemMessageRootProps) {
  const messageType = () => props.type ?? "info"

  return (
    <div
      role="status"
      aria-live="polite"
      data-type={messageType()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-system-message", part: "root", state: messageType() })}
    >
      {props.children}
    </div>
  )
}

// ─── Icon ───────────────────────────────────────────────────────────────────

export interface ChatSystemMessageIconProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatSystemMessage.Icon — slot for status icon. */
export function Icon(props: ChatSystemMessageIconProps) {
  return (
    <span
      aria-hidden="true"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-system-message", part: "icon" })}
    >
      {props.children}
    </span>
  )
}

// ─── Content ────────────────────────────────────────────────────────────────

export interface ChatSystemMessageContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatSystemMessage.Content — message text content. */
export function Content(props: ChatSystemMessageContentProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-system-message", part: "content" })}
    >
      {props.children}
    </span>
  )
}

// ─── Timestamp ──────────────────────────────────────────────────────────────

export interface ChatSystemMessageTimestampProps {
  /** The timestamp value as Date or ISO string. */
  timestamp: Date | string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatSystemMessage.Timestamp — <time> element for event time. */
export function Timestamp(props: ChatSystemMessageTimestampProps) {
  const datetime = () => {
    const ts = props.timestamp
    if (ts instanceof Date) return ts.toISOString()
    return ts
  }

  const displayText = () => {
    if (props.children) return props.children
    const ts = props.timestamp
    if (ts instanceof Date) return ts.toLocaleTimeString()
    return ts
  }

  return (
    <time
      datetime={datetime()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-system-message", part: "timestamp" })}
    >
      {displayText()}
    </time>
  )
}
