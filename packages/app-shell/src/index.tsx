/**
 * @solidiom/app-shell — Top-level application layout with header, sidebar, and main content areas.
 *
 * Parts: Root, Header, Sidebar, Main, Footer.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AppShellRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface AppShellHeaderProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface AppShellSidebarProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface AppShellMainProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface AppShellFooterProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: AppShellRootProps) {
  const styles = (): JSX.CSSProperties => ({
    display: "grid",
    "grid-template-rows": "auto 1fr auto",
    "grid-template-columns": "auto 1fr",
    "grid-template-areas": `"header header" "sidebar main" "footer footer"`,
    "min-height": "100vh",
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <div
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "app-shell", part: "root" })}
    >
      {props.children}
    </div>
  )
}

export function Header(props: AppShellHeaderProps) {
  const styles = (): JSX.CSSProperties => ({
    "grid-area": "header",
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <header
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "app-shell", part: "header" })}
    >
      {props.children}
    </header>
  )
}

export function Sidebar(props: AppShellSidebarProps) {
  const styles = (): JSX.CSSProperties => ({
    "grid-area": "sidebar",
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <aside
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "app-shell", part: "sidebar" })}
    >
      {props.children}
    </aside>
  )
}

export function Main(props: AppShellMainProps) {
  const styles = (): JSX.CSSProperties => ({
    "grid-area": "main",
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <main
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "app-shell", part: "main" })}
    >
      {props.children}
    </main>
  )
}

export function Footer(props: AppShellFooterProps) {
  const styles = (): JSX.CSSProperties => ({
    "grid-area": "footer",
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <footer
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "app-shell", part: "footer" })}
    >
      {props.children}
    </footer>
  )
}
