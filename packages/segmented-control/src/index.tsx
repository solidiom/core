/**
 * @solidiom/segmented-control — Mutually exclusive option selector with connected segments.
 *
 * Parts: Root, Item, Indicator.
 *
 * Headless primitive providing accessible radio-group semantics, roving focus
 * keyboard navigation, an animated indicator part, and native form participation
 * via hidden radio inputs.
 */

import { type Accessor, createContext, useContext, onCleanup, For, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type Collection,
  type CollectionItem,
  type RovingFocus,
  type ChangeDetails,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────────

/** Reason for a segmented control value change. */
export type SegmentedControlReason = "item-click" | "keyboard"

export interface SegmentedControlRootProps {
  /** Controlled value — the currently selected segment. */
  value?: Accessor<string | undefined>
  /** Default value for uncontrolled mode. */
  defaultValue?: string
  /** Called when the selected segment changes. */
  onValueChange?: (value: string, details: ChangeDetails<SegmentedControlReason>) => void
  /** Orientation of the control. Default: "horizontal". */
  orientation?: "horizontal" | "vertical"
  /** Whether all items are disabled. */
  disabled?: boolean
  /** Whether keyboard navigation wraps around. Default: true. */
  loop?: boolean
  /** Form field name for hidden radio inputs. */
  name?: string
  /** Element id. */
  id?: string
  /** Children (Item parts). */
  children?: JSX.Element
}

export interface SegmentedControlItemProps {
  /** Unique identifier for this segment. */
  value: string
  /** Whether this item is disabled. */
  disabled?: boolean
  /** Children. */
  children?: JSX.Element
  /** CSS class. */
  class?: string
}

export interface SegmentedControlIndicatorProps {
  /** CSS class. */
  class?: string
  /** Inline styles. */
  style?: JSX.CSSProperties | string
  /** Children. */
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface SegmentedControlContextValue {
  value: Accessor<string>
  requestValueChange: (next: string, details: ChangeDetails<SegmentedControlReason>) => void
  orientation: "horizontal" | "vertical"
  disabled: boolean
  loop: boolean
  collection: Collection
  rovingFocus: RovingFocus
  name?: string
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>()

function useSegmentedControlContext(): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext)
  if (!ctx) {
    throw new Error("[solidiom] SegmentedControl parts must be used within SegmentedControl.Root")
  }
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────────

/**
 * Root container with radio-group semantics.
 *
 * Manages single selection state, collection, and roving focus.
 * Emits `data-scope="segmented-control"`, `data-part="root"`.
 */
export function Root(props: SegmentedControlRootProps) {
  const orientation = props.orientation ?? "horizontal"
  const loop = props.loop ?? true

  const { value, requestChange } = createControllableValue<string, SegmentedControlReason>({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: props.onValueChange,
  })

  const collection = createCollection({
    orientation: () => orientation,
  })

  const rovingFocus = createRovingFocus({
    defaultActiveId: props.defaultValue,
    activeId: props.value ? () => props.value!() : undefined,
  })

  const ctx: SegmentedControlContextValue = {
    value,
    requestValueChange: (next, details) => requestChange(next, details),
    orientation,
    disabled: props.disabled ?? false,
    loop,
    collection,
    rovingFocus,
    name: props.name,
  }

  return (
    <SegmentedControlContext value={ctx}>
      <div
        id={props.id}
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={props.disabled ? "true" : undefined}
        {...applySemanticAttrs({
          scope: "segmented-control",
          part: "root",
          orientation,
          disabled: props.disabled,
        })}
      >
        {props.children}
        <Show when={props.name}>
          <HiddenRadios name={props.name!} />
        </Show>
      </div>
    </SegmentedControlContext>
  )
}

// ─── Item ───────────────────────────────────────────────────────────────────────

/**
 * Individual segment option with radio semantics.
 *
 * Emits `data-scope="segmented-control"`, `data-part="item"`,
 * `data-state="active"|"inactive"`.
 */
export function Item(props: SegmentedControlItemProps) {
  const ctx = useSegmentedControlContext()

  const isDisabled = (): boolean => props.disabled ?? ctx.disabled
  const isActive = (): boolean => ctx.value() === props.value

  const collectionItem: CollectionItem = {
    id: props.value,
    disabled: isDisabled,
    textValue: () => props.value,
  }

  const cleanup = ctx.collection.registerItem(collectionItem)
  onCleanup(cleanup)

  const handleClick = () => {
    if (isDisabled()) return
    ctx.rovingFocus.setActiveId(props.value, false)
    ctx.requestValueChange(props.value, createChangeDetails("item-click"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDisabled()) return

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      ctx.requestValueChange(props.value, createChangeDetails("keyboard"))
      return
    }

    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.orientation,
      direction: "ltr",
    })

    if (intent) {
      e.preventDefault()
      const next = resolveNextItem(ctx.collection.enabledItems(), props.value, intent, {
        loop: ctx.loop,
      })
      if (next?.ref) {
        ctx.rovingFocus.setActiveId(next.id, false)
        // Select on navigation (radio group pattern)
        ctx.requestValueChange(next.id, createChangeDetails("keyboard"))
        ;(next.ref as HTMLElement).focus()
      }
    }
  }

  const handleFocus = () => {
    ctx.rovingFocus.setActiveId(props.value, false)
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive() ? "true" : "false"}
      aria-disabled={isDisabled() ? "true" : undefined}
      tabindex={ctx.rovingFocus.getTabIndex(props.value)}
      disabled={isDisabled()}
      class={props.class}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      ref={(el: HTMLButtonElement) => {
        collectionItem.ref = el
      }}
      {...applySemanticAttrs({
        scope: "segmented-control",
        part: "item",
        state: isActive() ? "active" : "inactive",
        disabled: isDisabled(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Indicator ──────────────────────────────────────────────────────────────────

/**
 * Animated active indicator element.
 *
 * Positioned behind the active item. Consumers use CSS transforms or
 * layout to animate the highlight. Provides `data-state` and `data-orientation`
 * for styling hooks.
 *
 * Emits `data-scope="segmented-control"`, `data-part="indicator"`.
 */
export function Indicator(props: SegmentedControlIndicatorProps) {
  const ctx = useSegmentedControlContext()

  const hasValue = (): boolean => ctx.value() !== ""

  return (
    <Show when={hasValue()}>
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "segmented-control",
          part: "indicator",
          state: "active",
          orientation: ctx.orientation,
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Hidden Radios ──────────────────────────────────────────────────────────────

/**
 * Internal component rendering hidden radio inputs for form participation.
 */
function HiddenRadios(props: { name: string }) {
  const ctx = useSegmentedControlContext()

  const hiddenStyle =
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"

  return (
    <For each={ctx.collection.items()}>
      {(item) => (
        <input
          type="radio"
          name={props.name}
          value={item.id}
          checked={ctx.value() === item.id}
          disabled={item.disabled()}
          aria-hidden="true"
          tabindex={-1}
          style={hiddenStyle}
          onChange={() => {}}
        />
      )}
    </For>
  )
}
