/**
 * @solidiom/sidebar — Headless collapsible sidebar navigation panel.
 *
 * Parts: Root, Panel, Trigger, Header, Content, Footer, Rail.
 *
 * Provides accessible disclosure state, presence management, and semantic
 * data attributes for styling hooks. Designed for application-level sidebars
 * with configurable collapse/expand behavior.
 */

import { type Accessor, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createPresence,
  createStableId,
  applySemanticAttrs,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SidebarRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open/collapsed state changes. */
  onOpenChange?: (open: boolean) => void
  /** Which side the sidebar is on. */
  side?: "left" | "right"
  /** Whether the sidebar can be collapsed. */
  collapsible?: boolean
  /** Width when collapsed. */
  collapsedWidth?: string
  /** Width when expanded. */
  expandedWidth?: string
  /** Disable all interactions. */
  disabled?: boolean
  children?: JSX.Element
}

export interface SidebarPanelProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** Accessible label for the navigation landmark. */
  "aria-label"?: string
}

export interface SidebarTriggerProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface SidebarHeaderProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface SidebarContentProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface SidebarFooterProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface SidebarRailProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Context ────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  open: Accessor<boolean>
  toggle: () => void
  disabled: () => boolean
  side: () => "left" | "right"
  collapsible: () => boolean
  collapsedWidth: () => string
  expandedWidth: () => string
  panelId: string
  triggerId: string
}

const SidebarContext = createContext<SidebarContextValue>()

function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("Sidebar parts must be used within Root")
  return ctx
}

// ─── Components ─────────────────────────────────────────────────────────────

/**
 * Root provider/container managing open/collapsed state.
 *
 * Emits `data-scope="sidebar"`, `data-part="root"`, `data-state="open"|"collapsed"`.
 */
export function Root(props: SidebarRootProps) {
  const baseId = createStableId("sidebar")
  const disabled = () => props.disabled ?? false
  const side = () => props.side ?? "left"
  const collapsible = () => props.collapsible ?? true
  const collapsedWidth = () => props.collapsedWidth ?? "3rem"
  const expandedWidth = () => props.expandedWidth ?? "16rem"

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen ?? true,
    onOpenChange: (v, _d) => props.onOpenChange?.(v),
    disabled,
  })

  createPresence({ open })

  const toggle = () => {
    if (disabled()) return
    if (!collapsible()) return
    requestOpenChange(!open(), { reason: "trigger" } as any)
  }

  const ctx: SidebarContextValue = {
    open,
    toggle,
    disabled,
    side,
    collapsible,
    collapsedWidth,
    expandedWidth,
    panelId: `${baseId}-panel`,
    triggerId: `${baseId}-trigger`,
  }

  return (
    <SidebarContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "sidebar",
          part: "root",
          state: open() ? "open" : "collapsed",
          disabled: props.disabled,
        })}
        data-side={side()}
      >
        {props.children}
      </div>
    </SidebarContext>
  )
}

/**
 * The sidebar panel (collapsible aside).
 *
 * Renders an `<aside>` with `role="navigation"` and appropriate ARIA attributes.
 * Emits `data-scope="sidebar"`, `data-part="panel"`, `data-state="open"|"collapsed"`.
 */
export function Panel(props: SidebarPanelProps) {
  const ctx = useSidebarContext()

  return (
    <aside
      id={ctx.panelId}
      role="navigation"
      aria-label={props["aria-label"] ?? "Sidebar"}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "panel",
        state: ctx.open() ? "open" : "collapsed",
        disabled: ctx.disabled(),
      })}
      data-side={ctx.side()}
    >
      {props.children}
    </aside>
  )
}

/**
 * Toggle button to expand/collapse the sidebar.
 *
 * Emits `data-scope="sidebar"`, `data-part="trigger"`, `data-state="open"|"collapsed"`.
 */
export function Trigger(props: SidebarTriggerProps) {
  const ctx = useSidebarContext()

  return (
    <button
      id={ctx.triggerId}
      type="button"
      aria-expanded={ctx.open() ? "true" : "false"}
      aria-controls={ctx.panelId}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      disabled={ctx.disabled()}
      onClick={() => ctx.toggle()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "trigger",
        state: ctx.open() ? "open" : "collapsed",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

/**
 * Top section of the sidebar.
 *
 * Emits `data-scope="sidebar"`, `data-part="header"`, `data-state="open"|"collapsed"`.
 */
export function Header(props: SidebarHeaderProps) {
  const ctx = useSidebarContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "header",
        state: ctx.open() ? "open" : "collapsed",
      })}
    >
      {props.children}
    </div>
  )
}

/**
 * Main scrollable content area of the sidebar.
 *
 * Emits `data-scope="sidebar"`, `data-part="content"`, `data-state="open"|"collapsed"`.
 */
export function Content(props: SidebarContentProps) {
  const ctx = useSidebarContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "content",
        state: ctx.open() ? "open" : "collapsed",
      })}
    >
      {props.children}
    </div>
  )
}

/**
 * Bottom section of the sidebar.
 *
 * Emits `data-scope="sidebar"`, `data-part="footer"`, `data-state="open"|"collapsed"`.
 */
export function Footer(props: SidebarFooterProps) {
  const ctx = useSidebarContext()

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "footer",
        state: ctx.open() ? "open" : "collapsed",
      })}
    >
      {props.children}
    </div>
  )
}

/**
 * Thin strip visible when the sidebar is collapsed.
 *
 * On hover or click, expands the sidebar. Only interactive when the sidebar
 * is collapsed.
 *
 * Emits `data-scope="sidebar"`, `data-part="rail"`, `data-state="open"|"collapsed"`.
 */
export function Rail(props: SidebarRailProps) {
  const ctx = useSidebarContext()

  const handleClick = () => {
    if (!ctx.open()) {
      ctx.toggle()
    }
  }

  const handleMouseEnter = () => {
    if (!ctx.open()) {
      ctx.toggle()
    }
  }

  return (
    <div
      role="button"
      tabindex={ctx.open() ? -1 : 0}
      aria-label="Expand sidebar"
      aria-hidden={ctx.open() ? "true" : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !ctx.open()) {
          e.preventDefault()
          ctx.toggle()
        }
      }}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sidebar",
        part: "rail",
        state: ctx.open() ? "open" : "collapsed",
        disabled: ctx.disabled(),
      })}
      data-side={ctx.side()}
    >
      {props.children}
    </div>
  )
}
