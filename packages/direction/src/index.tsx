/**
 * @solidiom/direction — RTL/LTR direction context provider component.
 *
 * Parts: Root.
 * Provides direction via DirectionContext from runtime to descendants.
 */

import { useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, DirectionContext, type Direction } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DirectionRootProps {
  /** Text direction to provide. */
  direction: Direction
  /** Class name for the wrapper div. */
  class?: string
  children: JSX.Element
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Reads the current text direction from DirectionContext.
 * Returns "ltr" if no provider is found.
 */
export function useDirectionContext(): Direction {
  return useContext(DirectionContext)
}

// ─── Components ─────────────────────────────────────────────────────────────

/**
 * Direction.Root — wraps children with a `dir` attribute and provides
 * direction via DirectionContext from @solidiom/runtime.
 */
export function Root(props: DirectionRootProps) {
  return (
    <DirectionContext value={props.direction}>
      <div
        dir={props.direction}
        class={props.class}
        {...applySemanticAttrs({ scope: "direction", part: "root", state: props.direction })}
      >
        {props.children}
      </div>
    </DirectionContext>
  )
}
