/**
 * Direction — RTL/LTR text direction propagation.
 *
 * Per §9.5: direction propagates through the component tree.
 * Primitives read direction to flip keyboard navigation and layout.
 *
 * Solid 2 rule: context IS the provider. Consumers write:
 *   <DirectionContext value="rtl">…</DirectionContext>
 * Primitives read via useContext(DirectionContext) with "ltr" default.
 */

import { type Accessor, createContext, useContext } from "solid-js"

/** Text direction values. */
export type Direction = "ltr" | "rtl"

/**
 * DirectionContext — Solid 2 context for RTL/LTR propagation.
 *
 * Usage:
 * ```tsx
 * import { DirectionContext } from "@solidiom/runtime"
 *
 * // Provider (context IS the provider in Solid 2):
 * <DirectionContext value="rtl">
 *   <App />
 * </DirectionContext>
 *
 * // Consumer (inside a primitive):
 * const dir = useDirection() // "rtl"
 * ```
 */
export const DirectionContext = createContext<Direction>("ltr")

/**
 * Reads the current text direction from DirectionContext.
 * Returns "ltr" if no provider is found.
 */
export function useDirection(): Direction {
  return useContext(DirectionContext)
}

/** Options for resolving direction. */
export interface DirectionOptions {
  /** Explicit direction override. */
  direction?: Accessor<Direction | undefined>
  /** Element to read `dir` attribute from (fallback). */
  element?: () => Element | undefined
}

/**
 * Resolves the current text direction.
 *
 * Priority: explicit prop > element's computed dir > "ltr" default.
 */
export function resolveDirection(options: DirectionOptions = {}): Accessor<Direction> {
  return () => {
    // Explicit override
    const explicit = options.direction?.()
    if (explicit) return explicit

    // Read from DOM element
    const el = options.element?.()
    if (el) {
      const dir = (el as HTMLElement).dir || el.closest("[dir]")?.getAttribute("dir")
      if (dir === "rtl" || dir === "ltr") return dir
    }

    return "ltr"
  }
}
