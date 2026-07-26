/**
 * @solidiom/breadcrumb — Hierarchical navigation breadcrumb.
 *
 * Parts: Root, List, Item, Link, Separator, Ellipsis.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface RootProps {
  children: JSX.Element
  class?: string
}

export interface ListProps {
  children: JSX.Element
  class?: string
}

export interface ItemProps {
  children: JSX.Element
  class?: string
}

export interface LinkProps {
  children: JSX.Element
  href: string
  current?: boolean
  class?: string
}

export interface SeparatorProps {
  children?: JSX.Element
  class?: string
}

export interface EllipsisProps {
  children?: JSX.Element
  class?: string
}

// ─── Parts ─────────────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      class={props.class}
      {...applySemanticAttrs({ scope: "breadcrumb", part: "root" })}
    >
      {props.children}
    </nav>
  )
}

export function List(props: ListProps) {
  return (
    <ol class={props.class} {...applySemanticAttrs({ scope: "breadcrumb", part: "list" })}>
      {props.children}
    </ol>
  )
}

export function Item(props: ItemProps) {
  return (
    <li class={props.class} {...applySemanticAttrs({ scope: "breadcrumb", part: "item" })}>
      {props.children}
    </li>
  )
}

export function Link(props: LinkProps) {
  return (
    <a
      href={props.href}
      aria-current={props.current ? "page" : undefined}
      class={props.class}
      {...applySemanticAttrs({ scope: "breadcrumb", part: "link" })}
    >
      {props.children}
    </a>
  )
}

export function Separator(props: SeparatorProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      class={props.class}
      {...applySemanticAttrs({ scope: "breadcrumb", part: "separator" })}
    >
      {props.children ?? "/"}
    </span>
  )
}

export function Ellipsis(props: EllipsisProps) {
  return (
    <span
      role="presentation"
      class={props.class}
      {...applySemanticAttrs({ scope: "breadcrumb", part: "ellipsis" })}
    >
      {props.children ?? "..."}
    </span>
  )
}
