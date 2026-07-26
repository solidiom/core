/**
 * @solidiom/alert — Inline, non-modal alert with live region semantics.
 *
 * Parts: Root, Title, Description.
 *
 * Uses role="alert" (assertive) or role="status" (polite) to announce
 * messages to screen readers without stealing focus.
 * Title and Description are wired via aria-labelledby/aria-describedby
 * using createStableId for SSR-safe IDs.
 */

import { createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"

export type AlertType = "info" | "success" | "warning" | "error"

interface AlertContextValue {
  titleId: string
  descriptionId: string
}

const AlertContext = createContext<AlertContextValue>()

export interface AlertRootProps {
  /** Alert variant — controls visual appearance via recipes. */
  type?: AlertType
  /**
   * Live region assertiveness.
   * - "assertive" (default): uses role="alert", interrupts the user.
   * - "polite": uses role="status", announced at next opportunity.
   */
  assertiveness?: "assertive" | "polite"
  class?: string
  children: JSX.Element
}

/**
 * Alert.Root — container with ARIA live region role.
 * Wires Title and Description via aria-labelledby/aria-describedby.
 */
export function Root(props: AlertRootProps) {
  const titleId = createStableId("alert-title")
  const descriptionId = createStableId("alert-desc")
  const role = () => (props.assertiveness === "polite" ? "status" : "alert")
  const alertType = () => props.type ?? "info"

  return (
    <AlertContext value={{ titleId, descriptionId }}>
      <div
        role={role()}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        class={props.class}
        {...applySemanticAttrs({ scope: "alert", part: "root", state: alertType() })}
      >
        {props.children}
      </div>
    </AlertContext>
  )
}

export interface AlertTitleProps {
  class?: string
  children: JSX.Element
}

/** Alert.Title — heading element wired to aria-labelledby on Root. */
export function Title(props: AlertTitleProps) {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error("Alert.Title must be used within Alert.Root")

  return (
    <h5
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "alert", part: "title" })}
    >
      {props.children}
    </h5>
  )
}

export interface AlertDescriptionProps {
  class?: string
  children: JSX.Element
}

/** Alert.Description — body text wired to aria-describedby on Root. */
export function Description(props: AlertDescriptionProps) {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error("Alert.Description must be used within Alert.Root")

  return (
    <div
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "alert", part: "description" })}
    >
      {props.children}
    </div>
  )
}
