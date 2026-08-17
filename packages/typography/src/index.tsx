/**
 * @solidiom/typography — Text primitives for headings, paragraphs, and inline text.
 *
 * Parts: Heading, Text, Lead, Small, Muted, InlineCode, Blockquote.
 */

import { type JSX, Dynamic } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface HeadingProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** Heading level 1-6. */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /** Element override. */
  as?: string
}

export interface TextProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

export interface LeadProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

export interface SmallProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

export interface MutedProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

export interface InlineCodeProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

export interface BlockquoteProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  as?: string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Heading(props: HeadingProps) {
  const level = () => props.level ?? 1
  const tag = () => props.as ?? `h${level()}`

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      data-level={String(level())}
      {...applySemanticAttrs({ scope: "typography", part: "heading" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function Text(props: TextProps) {
  const tag = () => props.as ?? "p"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "text" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function Lead(props: LeadProps) {
  const tag = () => props.as ?? "p"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "lead" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function Small(props: SmallProps) {
  const tag = () => props.as ?? "small"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "small" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function Muted(props: MutedProps) {
  const tag = () => props.as ?? "span"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "muted" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function InlineCode(props: InlineCodeProps) {
  const tag = () => props.as ?? "code"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "inline-code" })}
    >
      {props.children}
    </Dynamic>
  )
}

export function Blockquote(props: BlockquoteProps) {
  const tag = () => props.as ?? "blockquote"

  return (
    <Dynamic
      component={tag()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "typography", part: "blockquote" })}
    >
      {props.children}
    </Dynamic>
  )
}
