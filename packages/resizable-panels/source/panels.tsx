/**
 * Resizable panels primitive — drag-to-resize panel layout with keyboard support,
 * collapse behavior, and ARIA separator semantics.
 *
 * Parts: PanelGroup, Panel, Handle.
 */

import { type Accessor, createSignal, onCleanup, untrack } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  type ChangeDetails,
} from "@solidiom/runtime"
import {
  PanelGroupContext,
  usePanelGroupContext,
  type PanelGroupContextValue,
  type PanelEntry,
  type PanelConstraints,
  type PanelResizeReason,
} from "./panels-context"

// ─── PanelGroup ────────────────────────────────────────────────────────────────

/** Props for the resizable panel group container. */
export interface PanelGroupProps {
  /** Layout direction. Default: "horizontal". */
  direction?: "horizontal" | "vertical"
  /** Controlled panel sizes as percentages. */
  sizes?: Accessor<number[]>
  /** Default sizes for uncontrolled mode. */
  defaultSizes?: number[]
  /** Called when panel sizes change. */
  onSizesChange?: (sizes: number[], details: ChangeDetails<PanelResizeReason>) => void
  children: JSX.Element
  class?: string
}

/** Root container that manages panel layout and resize state. */
export function PanelGroup(props: PanelGroupProps) {
  const direction = () => props.direction ?? "horizontal"
  const baseId = createStableId("panels")

  const [panels, setPanels] = createSignal<PanelEntry[]>([], { ownedWrite: true })

  const { value: sizes, requestChange: requestSizeChange } = createControllableValue<
    number[],
    PanelResizeReason
  >({
    value: props.sizes,
    defaultValue: props.defaultSizes ?? [],
    onChange: props.onSizesChange,
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  })

  const registerPanel = (entry: PanelEntry): (() => void) => {
    setPanels((prev) => {
      const next = [...prev, entry].sort((a, b) => a.order - b.order)
      return next
    })

    // Initialize sizes if we have a default and current sizes are empty/short
    const currentSizes = untrack(sizes)
    if (entry.constraints.defaultSize !== undefined) {
      const panelList = [...untrack(panels), entry].sort((a, b) => a.order - b.order)
      const idx = panelList.findIndex((p) => p.id === entry.id)
      if (idx >= 0 && (currentSizes.length <= idx || currentSizes[idx] === undefined)) {
        const updated = [...currentSizes]
        while (updated.length <= idx) updated.push(0)
        updated[idx] = entry.constraints.defaultSize
        untrack(() => requestSizeChange(updated, createChangeDetails("programmatic")))
      }
    }

    return () => {
      setPanels((prev) => prev.filter((p) => p.id !== entry.id))
    }
  }

  const ctx: PanelGroupContextValue = {
    direction,
    sizes,
    requestSizeChange,
    registerPanel,
    panels,
    baseId,
  }

  return (
    <PanelGroupContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "resizable-panels",
          part: "group",
          orientation: direction(),
        })}
        style={{
          display: "flex",
          "flex-direction": direction() === "horizontal" ? "row" : "column",
        }}
      >
        {props.children}
      </div>
    </PanelGroupContext>
  )
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

/** Props for an individual resizable panel. */
export interface PanelProps {
  /** Unique order index for this panel within the group. */
  order: number
  /** Size constraints for this panel. */
  minSize?: number
  maxSize?: number
  defaultSize?: number
  /** Whether the panel can collapse to 0 below minSize. */
  collapsible?: boolean
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** A single resizable panel within a PanelGroup. */
export function Panel(props: PanelProps) {
  const ctx = usePanelGroupContext()
  const panelId = createStableId("panel")

  const constraints: PanelConstraints = {
    minSize: props.minSize,
    maxSize: props.maxSize,
    defaultSize: props.defaultSize,
    collapsible: props.collapsible,
  }

  const entry: PanelEntry = {
    id: panelId,
    constraints,
    order: props.order,
  }

  const cleanup = ctx.registerPanel(entry)
  onCleanup(cleanup)

  const panelIndex = (): number => {
    return ctx.panels().findIndex((p) => p.id === panelId)
  }

  const currentSize = (): number => {
    const idx = panelIndex()
    const s = ctx.sizes()
    return idx >= 0 && idx < s.length ? s[idx]! : (props.defaultSize ?? 50)
  }

  const isCollapsed = (): boolean => {
    return props.collapsible === true && currentSize() === 0
  }

  return (
    <div
      id={panelId}
      ref={props.ref}
      class={props.class}
      style={
        typeof props.style === "string"
          ? `flex-basis: ${currentSize()}%; flex-grow: 0; flex-shrink: 0; overflow: hidden; ${props.style}`
          : {
              "flex-basis": `${currentSize()}%`,
              "flex-grow": "0",
              "flex-shrink": "0",
              overflow: "hidden",
              ...(props.style as JSX.CSSProperties | undefined),
            }
      }
      {...applySemanticAttrs({
        scope: "resizable-panels",
        part: "panel",
        state: isCollapsed() ? "collapsed" : "expanded",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Handle ────────────────────────────────────────────────────────────────────

/** Props for a resize handle between panels. */
export interface HandleProps {
  /** The index of the handle (separates panel[index] and panel[index+1]). */
  index: number
  /** Whether this handle is disabled. */
  disabled?: boolean
  children?: JSX.Element
  class?: string
  ref?: (el: HTMLDivElement) => void
}

/** Drag handle (separator) between two adjacent panels. */
export function Handle(props: HandleProps) {
  const ctx = usePanelGroupContext()
  const handleId = createStableId("panel-handle")
  let handleEl: HTMLDivElement | undefined

  const STEP = 1
  const SHIFT_STEP = 10

  const beforePanel = (): PanelEntry | undefined => ctx.panels()[props.index]

  const ariaValueNow = (): number => {
    const s = ctx.sizes()
    return props.index < s.length ? s[props.index]! : 50
  }

  const ariaValueMin = (): number => {
    const panel = beforePanel()
    return panel?.constraints.minSize ?? 0
  }

  const ariaValueMax = (): number => {
    const panel = beforePanel()
    return panel?.constraints.maxSize ?? 100
  }

  // ─── Pointer drag ──────────────────────────────────────────────────────

  const handlePointerDown = (e: PointerEvent) => {
    if (props.disabled) return
    e.preventDefault()

    const el = handleEl
    if (!el) return
    el.setPointerCapture(e.pointerId)

    const startPos = ctx.direction() === "horizontal" ? e.clientX : e.clientY

    const parentEl = el.parentElement
    if (!parentEl) return
    const parentRect = parentEl.getBoundingClientRect()
    const totalSize = ctx.direction() === "horizontal" ? parentRect.width : parentRect.height

    const startSizes = [...ctx.sizes()]

    const onPointerMove = (ev: PointerEvent) => {
      const currentPos = ctx.direction() === "horizontal" ? ev.clientX : ev.clientY
      const deltaPixels = currentPos - startPos
      const deltaPercent = (deltaPixels / totalSize) * 100

      const newSizes = resizeByDelta(startSizes, props.index, deltaPercent, ctx.panels())
      ctx.requestSizeChange(newSizes, createChangeDetails("pointer"))
    }

    const onPointerUp = () => {
      el.releasePointerCapture(e.pointerId)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
    }

    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
  }

  // ─── Keyboard resize ───────────────────────────────────────────────────

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) return
    const isHorizontal = ctx.direction() === "horizontal"
    const step = e.shiftKey ? SHIFT_STEP : STEP

    let delta = 0
    if (isHorizontal) {
      if (e.key === "ArrowLeft") delta = -step
      else if (e.key === "ArrowRight") delta = step
      else return
    } else {
      if (e.key === "ArrowUp") delta = -step
      else if (e.key === "ArrowDown") delta = step
      else return
    }

    e.preventDefault()
    const currentSizes = [...ctx.sizes()]
    const newSizes = resizeByDelta(currentSizes, props.index, delta, ctx.panels())
    ctx.requestSizeChange(newSizes, createChangeDetails("keyboard"))
  }

  return (
    <div
      id={handleId}
      role="separator"
      aria-orientation={ctx.direction() === "horizontal" ? "vertical" : "horizontal"}
      aria-valuenow={ariaValueNow()}
      aria-valuemin={ariaValueMin()}
      aria-valuemax={ariaValueMax()}
      aria-disabled={props.disabled ? "true" : undefined}
      tabindex={props.disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      class={props.class}
      ref={(el: HTMLDivElement) => {
        handleEl = el
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "resizable-panels",
        part: "handle",
        disabled: props.disabled,
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Compute new panel sizes after applying a delta percentage at the given handle index.
 * Respects min/max constraints and collapse behavior.
 */
function resizeByDelta(
  sizes: number[],
  handleIndex: number,
  deltaPercent: number,
  panels: PanelEntry[],
): number[] {
  const result = [...sizes]
  const beforeIdx = handleIndex
  const afterIdx = handleIndex + 1

  if (beforeIdx >= result.length || afterIdx >= result.length) return result

  const beforePanel = panels[beforeIdx]
  const afterPanel = panels[afterIdx]
  if (!beforePanel || !afterPanel) return result

  const beforeMin = beforePanel.constraints.minSize ?? 0
  const beforeMax = beforePanel.constraints.maxSize ?? 100
  const afterMin = afterPanel.constraints.minSize ?? 0
  const afterMax = afterPanel.constraints.maxSize ?? 100

  let newBefore = result[beforeIdx]! + deltaPercent
  let newAfter = result[afterIdx]! - deltaPercent

  // Collapse support: if dragged below min, collapse to 0
  if (
    beforePanel.constraints.collapsible &&
    newBefore < beforeMin &&
    newBefore < result[beforeIdx]!
  ) {
    newAfter += newBefore
    newBefore = 0
  } else if (
    afterPanel.constraints.collapsible &&
    newAfter < afterMin &&
    newAfter < result[afterIdx]!
  ) {
    newBefore += newAfter
    newAfter = 0
  } else {
    // Clamp to constraints
    if (newBefore < beforeMin) {
      newAfter += newBefore - beforeMin
      newBefore = beforeMin
    }
    if (newBefore > beforeMax) {
      newAfter += newBefore - beforeMax
      newBefore = beforeMax
    }
    if (newAfter < afterMin) {
      newBefore += newAfter - afterMin
      newAfter = afterMin
    }
    if (newAfter > afterMax) {
      newBefore += newAfter - afterMax
      newAfter = afterMax
    }
  }

  result[beforeIdx] = Math.max(0, newBefore)
  result[afterIdx] = Math.max(0, newAfter)
  return result
}
