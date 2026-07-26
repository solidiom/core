/**
 * @solidiom/empty-state — Placeholder for empty content areas.
 *
 * Parts: Root, Icon, Title, Description, Action.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface EmptyStateRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Root(props: EmptyStateRootProps) {
  return (
    <div
      role="status"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "empty-state", part: "root" })}
    >
      {props.children}
    </div>
  )
}

export interface EmptyStateIconProps {
  class?: string
  children: JSX.Element
}

export function Icon(props: EmptyStateIconProps) {
  return (
    <div
      aria-hidden="true"
      class={props.class}
      {...applySemanticAttrs({ scope: "empty-state", part: "icon" })}
    >
      {props.children}
    </div>
  )
}

export interface EmptyStateTitleProps {
  class?: string
  children: JSX.Element
}

export function Title(props: EmptyStateTitleProps) {
  return (
    <h3 class={props.class} {...applySemanticAttrs({ scope: "empty-state", part: "title" })}>
      {props.children}
    </h3>
  )
}

export interface EmptyStateDescriptionProps {
  class?: string
  children: JSX.Element
}

export function Description(props: EmptyStateDescriptionProps) {
  return (
    <p class={props.class} {...applySemanticAttrs({ scope: "empty-state", part: "description" })}>
      {props.children}
    </p>
  )
}

export interface EmptyStateActionProps {
  class?: string
  children: JSX.Element
}

export function Action(props: EmptyStateActionProps) {
  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "empty-state", part: "action" })}>
      {props.children}
    </div>
  )
}
