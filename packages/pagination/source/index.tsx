/**
 * @solidiom/pagination — Page navigation.
 *
 * Parts: Root, Content, Item, PreviousButton, NextButton, Ellipsis.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface RootProps {
  children: JSX.Element
  class?: string
}

export function Root(props: RootProps) {
  return (
    <nav
      aria-label="Pagination"
      class={props.class}
      {...applySemanticAttrs({ scope: "pagination", part: "root" })}
    >
      {props.children}
    </nav>
  )
}

export interface ContentProps {
  children: JSX.Element
  class?: string
}

export function Content(props: ContentProps) {
  return (
    <ul class={props.class} {...applySemanticAttrs({ scope: "pagination", part: "content" })}>
      {props.children}
    </ul>
  )
}

export interface ItemProps {
  children: JSX.Element
  class?: string
}

export function Item(props: ItemProps) {
  return <li class={props.class}>{props.children}</li>
}

export interface PreviousButtonProps {
  children?: JSX.Element
  class?: string
  disabled?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

export function PreviousButton(props: PreviousButtonProps) {
  return (
    <button
      aria-label="Go to previous page"
      class={props.class}
      disabled={props.disabled}
      onClick={props.onClick}
      {...applySemanticAttrs({ scope: "pagination", part: "previous" })}
    >
      {props.children}
    </button>
  )
}

export interface NextButtonProps {
  children?: JSX.Element
  class?: string
  disabled?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

export function NextButton(props: NextButtonProps) {
  return (
    <button
      aria-label="Go to next page"
      class={props.class}
      disabled={props.disabled}
      onClick={props.onClick}
      {...applySemanticAttrs({ scope: "pagination", part: "next" })}
    >
      {props.children}
    </button>
  )
}

export interface EllipsisProps {
  children?: JSX.Element
  class?: string
}

export function Ellipsis(props: EllipsisProps) {
  return (
    <span
      aria-hidden="true"
      class={props.class}
      {...applySemanticAttrs({ scope: "pagination", part: "ellipsis" })}
    >
      {props.children ?? "..."}
    </span>
  )
}
