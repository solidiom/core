/**
 * @solidiom/chat-message-metadata — Message metadata display (timestamp, sender, status).
 *
 * Parts: Root, Timestamp, Sender, Status.
 *
 * Provides structured metadata for chat messages with semantic time elements
 * and delivery status indicators.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export type MessageStatus = "sent" | "delivered" | "read" | "error"

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatMessageMetadataRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatMessageMetadata.Root — inline container for message metadata.
 */
export function Root(props: ChatMessageMetadataRootProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-message-metadata", part: "root" })}
    >
      {props.children}
    </span>
  )
}

// ─── Timestamp ──────────────────────────────────────────────────────────────

export interface ChatMessageMetadataTimestampProps {
  /** The timestamp value as Date or ISO string. */
  timestamp: Date | string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatMessageMetadata.Timestamp — <time> element with datetime attribute. */
export function Timestamp(props: ChatMessageMetadataTimestampProps) {
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
      {...applySemanticAttrs({ scope: "chat-message-metadata", part: "timestamp" })}
    >
      {displayText()}
    </time>
  )
}

// ─── Sender ─────────────────────────────────────────────────────────────────

export interface ChatMessageMetadataSenderProps {
  /** Sender display name. */
  sender: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatMessageMetadata.Sender — <span> displaying sender name. */
export function Sender(props: ChatMessageMetadataSenderProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-message-metadata", part: "sender" })}
    >
      {props.children ?? props.sender}
    </span>
  )
}

// ─── Status ─────────────────────────────────────────────────────────────────

export interface ChatMessageMetadataStatusProps {
  /** Delivery status of the message. */
  status: MessageStatus
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatMessageMetadata.Status — <span> with data-status for delivery state. */
export function Status(props: ChatMessageMetadataStatusProps) {
  return (
    <span
      data-status={props.status}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "chat-message-metadata",
        part: "status",
        state: props.status,
      })}
    >
      {props.children ?? props.status}
    </span>
  )
}
