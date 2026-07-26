/**
 * Deterministic positioning test double — implements PositioningCapability@1.
 *
 * Returns fixed coordinates based on input placement. Zero engine dependencies.
 * Produces identical output for identical input regardless of environment.
 */

/** Placement values supported by the positioning capability. */
export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end"

/** The result of a positioning computation. */
export interface PositioningResult {
  x: number
  y: number
  placement: Placement
  arrowX?: number
  arrowY?: number
}

/** Input for a positioning computation. */
export interface PositioningInput {
  referenceRect: { x: number; y: number; width: number; height: number }
  floatingRect: { width: number; height: number }
  placement: Placement
  offset?: number
}

/** PositioningCapability@1 port shape. */
export interface PositioningCapability {
  compute(input: PositioningInput): PositioningResult
  destroy(): void
}

/**
 * Deterministic positioning double.
 *
 * Positions the floating element relative to the reference using simple
 * arithmetic — no viewport, scroll, or collision awareness.
 */
export function createPositioningDouble(): PositioningCapability {
  const compute = (input: PositioningInput): PositioningResult => {
    const { referenceRect: ref, floatingRect: floating, placement, offset = 8 } = input

    let x = 0
    let y = 0

    const side = placement.split("-")[0] as "top" | "bottom" | "left" | "right"
    const alignment = placement.split("-")[1] as "start" | "end" | undefined

    switch (side) {
      case "top":
        x = ref.x + ref.width / 2 - floating.width / 2
        y = ref.y - floating.height - offset
        break
      case "bottom":
        x = ref.x + ref.width / 2 - floating.width / 2
        y = ref.y + ref.height + offset
        break
      case "left":
        x = ref.x - floating.width - offset
        y = ref.y + ref.height / 2 - floating.height / 2
        break
      case "right":
        x = ref.x + ref.width + offset
        y = ref.y + ref.height / 2 - floating.height / 2
        break
    }

    // Alignment adjustments
    if (alignment === "start") {
      if (side === "top" || side === "bottom") x = ref.x
      else y = ref.y
    } else if (alignment === "end") {
      if (side === "top" || side === "bottom") x = ref.x + ref.width - floating.width
      else y = ref.y + ref.height - floating.height
    }

    return { x, y, placement }
  }

  const destroy = (): void => {}

  return { compute, destroy }
}
