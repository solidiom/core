/**
 * @solidiom/card — Content container primitive.
 *
 * Parts: Root, Header, Title, Description, Content, Footer.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface CardRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Root(props: CardRootProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "card", part: "root" })}
    >
      {props.children}
    </div>
  )
}

export interface CardHeaderProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Header(props: CardHeaderProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "card", part: "header" })}
    >
      {props.children}
    </div>
  )
}

export interface CardTitleProps {
  class?: string
  children: JSX.Element
}

export function Title(props: CardTitleProps) {
  return (
    <h3 class={props.class} {...applySemanticAttrs({ scope: "card", part: "title" })}>
      {props.children}
    </h3>
  )
}

export interface CardDescriptionProps {
  class?: string
  children: JSX.Element
}

export function Description(props: CardDescriptionProps) {
  return (
    <p class={props.class} {...applySemanticAttrs({ scope: "card", part: "description" })}>
      {props.children}
    </p>
  )
}

export interface CardContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Content(props: CardContentProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "card", part: "content" })}
    >
      {props.children}
    </div>
  )
}

export interface CardFooterProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Footer(props: CardFooterProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "card", part: "footer" })}
    >
      {props.children}
    </div>
  )
}
