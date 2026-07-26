/**
 * @solidiom/carousel — Headless carousel primitive with scroll-snap and pointer drag.
 *
 * Parts: Root, Viewport, Slide, PrevButton, NextButton.
 * Supports loop mode, auto-play, pointer drag-to-swipe, keyboard navigation.
 */

import { type Accessor, createSignal, createMemo, createEffect } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"
import {
  CarouselContext,
  useCarouselContext,
  type CarouselGeometry,
  type CarouselPhysicsPort,
  type CarouselPhysicsResult,
} from "./carousel-context"

// ─── Default Simple Snap Physics ───────────────────────────────────────────────

/**
 * Default snap physics — no spring/momentum, just index * (slideWidth + gap).
 */
export const simpleSnapPhysics: CarouselPhysicsPort = {
  compute(geometry, selectedIndex) {
    const { slideCount, slideWidth, gap } = geometry
    const scrollPosition = selectedIndex * (slideWidth + gap)
    const snapPoints = Array.from({ length: slideCount }, (_, i) => i * (slideWidth + gap))
    return {
      selectedIndex,
      canScrollPrev: selectedIndex > 0,
      canScrollNext: selectedIndex < slideCount - 1,
      scrollPosition,
      snapPoints,
    }
  },
  nearestSnap(geometry, scrollPosition) {
    const stride = geometry.slideWidth + geometry.gap
    if (stride === 0) return 0
    const raw = Math.round(scrollPosition / stride)
    return Math.max(0, Math.min(raw, geometry.slideCount - 1))
  },
}

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the Carousel Root component. */
export interface CarouselRootProps {
  /** Physics port. Defaults to simpleSnapPhysics. */
  physics?: CarouselPhysicsPort
  /** Geometry of the carousel layout. */
  geometry: CarouselGeometry
  /** Controlled selected index. */
  selectedIndex?: Accessor<number | undefined>
  /** Default index for uncontrolled mode. */
  defaultIndex?: number
  /** Callback when selected index changes. */
  onIndexChange?: (index: number) => void
  /** Enable looping. Defaults to false. */
  loop?: boolean
  /** Auto-play interval in ms. 0 or undefined disables. */
  autoPlay?: number
  /** CSS class. */
  class?: string
  /** Child elements. */
  children: JSX.Element
}

/** Carousel Root — provides context and manages selected index state. */
export function Root(props: CarouselRootProps) {
  const physics = props.physics ?? simpleSnapPhysics
  const geometry = props.geometry
  const loop = props.loop ?? false

  const { value: selectedIndex, requestChange } = createControllableValue<number, "nav" | "drag">({
    value: props.selectedIndex as Accessor<number | undefined>,
    defaultValue: props.defaultIndex ?? 0,
    onChange: (next) => props.onIndexChange?.(next),
  })

  const [paused, setPaused] = createSignal(false)

  const computed = createMemo((): CarouselPhysicsResult =>
    physics.compute(geometry, selectedIndex()),
  )

  const canScrollPrev = () => loop || computed().canScrollPrev
  const canScrollNext = () => loop || computed().canScrollNext

  const goTo = (index: number) => {
    let target = index
    if (loop) {
      target = ((index % geometry.slideCount) + geometry.slideCount) % geometry.slideCount
    } else {
      target = Math.max(0, Math.min(index, geometry.slideCount - 1))
    }
    requestChange(target, createChangeDetails("nav"))
  }

  const prev = () => goTo(selectedIndex() - 1)
  const next = () => goTo(selectedIndex() + 1)

  // Auto-play
  if (props.autoPlay && props.autoPlay > 0) {
    const interval = props.autoPlay

    createEffect(
      () => paused(),
      (isPaused) => {
        if (isPaused) return
        const id = setInterval(() => next(), interval)
        return () => clearInterval(id)
      },
    )
  }

  const contextValue = {
    selectedIndex,
    canScrollPrev,
    canScrollNext,
    goTo,
    prev,
    next,
    loop,
    geometry,
    physics,
    paused,
    setPaused,
  }

  return (
    <CarouselContext value={contextValue}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        class={props.class}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        {...applySemanticAttrs({ scope: "carousel", part: "root" })}
      >
        {props.children}
      </div>
    </CarouselContext>
  )
}

// ─── Viewport ──────────────────────────────────────────────────────────────────

/** Props for the Carousel Viewport (scroll container). */
export interface CarouselViewportProps {
  children: JSX.Element
}

/**
 * Carousel Viewport — scroll container with pointer drag-to-swipe and keyboard nav.
 *
 * Pointer: pointerdown starts drag, pointermove tracks delta, pointerup snaps to nearest.
 * Keyboard: ArrowLeft/Right navigates slides.
 */
export function Viewport(props: CarouselViewportProps) {
  const ctx = useCarouselContext()
  let dragStartX = 0
  let dragStartScroll = 0
  let isDragging = false

  const scrollStyle = (): JSX.CSSProperties => {
    const pos = ctx.physics.compute(ctx.geometry, ctx.selectedIndex()).scrollPosition
    return {
      display: "flex",
      gap: `${ctx.geometry.gap}px`,
      transform: `translateX(-${pos}px)`,
      transition: isDragging ? "none" : "transform 300ms ease",
      "scroll-snap-type": "x mandatory",
    }
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    isDragging = true
    dragStartX = event.clientX
    dragStartScroll = ctx.physics.compute(ctx.geometry, ctx.selectedIndex()).scrollPosition
    const target = event.currentTarget as HTMLElement
    target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (_event: PointerEvent) => {
    if (!isDragging) return
    // Visual feedback could be added here; snap happens on pointerup
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (!isDragging) return
    isDragging = false
    const delta = dragStartX - event.clientX
    const newScroll = dragStartScroll + delta
    const snapIndex = ctx.physics.nearestSnap(ctx.geometry, newScroll)
    ctx.goTo(snapIndex)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        ctx.prev()
        break
      case "ArrowRight":
        event.preventDefault()
        ctx.next()
        break
    }
  }

  return (
    <div
      tabindex={0}
      role="group"
      aria-live="polite"
      style={{ overflow: "hidden", cursor: isDragging ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({ scope: "carousel", part: "viewport" })}
    >
      <div style={scrollStyle()}>{props.children}</div>
    </div>
  )
}

// ─── Slide ─────────────────────────────────────────────────────────────────────

/** Props for the Carousel Slide component. */
export interface CarouselSlideProps {
  /** Index of this slide. */
  index: number
  /** Child content. */
  children: JSX.Element
}

/** Carousel Slide — a single slide within the viewport. */
export function Slide(props: CarouselSlideProps) {
  const ctx = useCarouselContext()
  const isActive = () => ctx.selectedIndex() === props.index

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${props.index + 1} of ${ctx.geometry.slideCount}`}
      aria-hidden={!isActive() ? "true" : undefined}
      style={{
        "min-width": `${ctx.geometry.slideWidth}px`,
        "scroll-snap-align": "start",
      }}
      {...applySemanticAttrs({
        scope: "carousel",
        part: "slide",
        state: isActive() ? "active" : "inactive",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── PrevButton ────────────────────────────────────────────────────────────────

/** Props for the Carousel PrevButton. */
export interface CarouselPrevButtonProps {
  children?: JSX.Element
}

/** Carousel PrevButton — navigates to previous slide. Disabled when at start (non-loop). */
export function PrevButton(props: CarouselPrevButtonProps) {
  const ctx = useCarouselContext()
  return (
    <button
      type="button"
      aria-label="Previous slide"
      disabled={!ctx.canScrollPrev()}
      onClick={() => ctx.prev()}
      {...applySemanticAttrs({
        scope: "carousel",
        part: "prev-button",
        disabled: !ctx.canScrollPrev(),
      })}
    >
      {props.children ?? "←"}
    </button>
  )
}

// ─── NextButton ────────────────────────────────────────────────────────────────

/** Props for the Carousel NextButton. */
export interface CarouselNextButtonProps {
  children?: JSX.Element
}

/** Carousel NextButton — navigates to next slide. Disabled when at end (non-loop). */
export function NextButton(props: CarouselNextButtonProps) {
  const ctx = useCarouselContext()
  return (
    <button
      type="button"
      aria-label="Next slide"
      disabled={!ctx.canScrollNext()}
      onClick={() => ctx.next()}
      {...applySemanticAttrs({
        scope: "carousel",
        part: "next-button",
        disabled: !ctx.canScrollNext(),
      })}
    >
      {props.children ?? "→"}
    </button>
  )
}
