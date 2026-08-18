/**
 * @solidiom/chat-message — Message bubble for conversational UI.
 *
 * Parts: Root, Content, Avatar, Actions.
 *
 * Provides accessible chat message structure with variant support
 * for sent/received messages, avatar slot, and action containers.
 */

import { createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export type ChatMessageVariant = "sent" | "received"

interface ChatMessageContextValue {
  variant: () => ChatMessageVariant
}

const ChatMessageContext = createContext<ChatMessageContextValue>()

function useChatMessageContext(): ChatMessageContextValue {
  const ctx = useContext(ChatMessageContext)
  if (!ctx) throw new Error("ChatMessage parts must be used within ChatMessage.Root")
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatMessageRootProps {
  /** Whether the message was sent or received. */
  variant?: ChatMessageVariant
  /** Unique message identifier. */
  id?: string
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatMessage.Root — outer container with role="listitem" for message lists.
 */
export function Root(props: ChatMessageRootProps) {
  const variant = () => props.variant ?? "received"

  return (
    <ChatMessageContext value={{ variant }}>
      <div
        role="listitem"
        id={props.id}
        class={props.class}
        style={props.style}
        data-variant={variant()}
        {...applySemanticAttrs({ scope: "chat-message", part: "root", state: variant() })}
      >
        {props.children}
      </div>
    </ChatMessageContext>
  )
}

// ─── Content ────────────────────────────────────────────────────────────────

export interface ChatMessageContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatMessage.Content — wrapper for message text/content. */
export function Content(props: ChatMessageContentProps) {
  const ctx = useChatMessageContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-message", part: "content", state: ctx.variant() })}
    >
      {props.children}
    </div>
  )
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

export interface ChatMessageAvatarProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatMessage.Avatar — slot for sender avatar image or icon. */
export function Avatar(props: ChatMessageAvatarProps) {
  const ctx = useChatMessageContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-message", part: "avatar", state: ctx.variant() })}
    >
      {props.children}
    </div>
  )
}

// ─── Actions ────────────────────────────────────────────────────────────────

export interface ChatMessageActionsProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** ChatMessage.Actions — container for message actions (reply, copy, etc.). */
export function Actions(props: ChatMessageActionsProps) {
  const ctx = useChatMessageContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-message", part: "actions", state: ctx.variant() })}
    >
      {props.children}
    </div>
  )
}
