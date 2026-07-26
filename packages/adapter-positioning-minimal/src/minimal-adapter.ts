/**
 * Minimal positioning adapter — purpose-built without engine dependencies.
 *
 * Implements the same PositioningCapability@1 interface as the Floating UI adapter.
 * Supports basic placement, offset, and optional flip (collision avoidance).
 */

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

export interface PositioningResult {
  x: number
  y: number
  placement: Placement
  arrowX?: number
  arrowY?: number
}

export interface PositioningInput {
  referenceRect: { x: number; y: number; width: number; height: number }
  floatingRect: { width: number; height: number }
  placement: Placement
  offset?: number
}

export interface PositioningCapability {
  compute(input: PositioningInput): PositioningResult
  destroy(): void
}

export interface MinimalPositioningOptions {
  /** Enable basic flip when floating overflows viewport. Default: false. */
  flip?: boolean
  /** Viewport dimensions for flip calculation. */
  viewport?: { width: number; height: number }
}

/**
 * Creates a minimal positioning adapter.
 * Zero external dependencies. Deterministic arithmetic positioning.
 */
export function createMinimalPositioning(
  options: MinimalPositioningOptions = {},
): PositioningCapability {
  const compute = (input: PositioningInput): PositioningResult => {
    const { referenceRect: ref, floatingRect: floating, placement, offset: off = 8 } = input

    let resolvedPlacement = placement
    let { x, y } = computePlacement(ref, floating, placement, off)

    // Basic flip: if floating overflows viewport, try opposite side
    if (options.flip && options.viewport) {
      const { width: vw, height: vh } = options.viewport
      const side = placement.split("-")[0] as string
      const shouldFlip =
        (side === "top" && y < 0) ||
        (side === "bottom" && y + floating.height > vh) ||
        (side === "left" && x < 0) ||
        (side === "right" && x + floating.width > vw)

      if (shouldFlip) {
        const flipped = flipPlacement(placement)
        const flippedPos = computePlacement(ref, floating, flipped, off)
        x = flippedPos.x
        y = flippedPos.y
        resolvedPlacement = flipped
      }
    }

    return { x, y, placement: resolvedPlacement }
  }

  const destroy = (): void => {}

  return { compute, destroy }
}

function computePlacement(
  ref: { x: number; y: number; width: number; height: number },
  floating: { width: number; height: number },
  placement: Placement,
  offset: number,
): { x: number; y: number } {
  const side = placement.split("-")[0] as "top" | "bottom" | "left" | "right"
  const alignment = placement.split("-")[1] as "start" | "end" | undefined

  let x = 0
  let y = 0

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

  if (alignment === "start") {
    if (side === "top" || side === "bottom") x = ref.x
    else y = ref.y
  } else if (alignment === "end") {
    if (side === "top" || side === "bottom") x = ref.x + ref.width - floating.width
    else y = ref.y + ref.height - floating.height
  }

  return { x, y }
}

function flipPlacement(placement: Placement): Placement {
  const [side, alignment] = placement.split("-") as [string, string | undefined]
  const flipped: Record<string, string> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }
  const newSide = flipped[side] ?? side
  return (alignment ? `${newSide}-${alignment}` : newSide) as Placement
}
