/**
 * @solidiom/multi-selector — Multi-select dropdown with checkbox items and search filtering.
 *
 * Parts: Root, Trigger, TagList, Tag, TagRemove, Content, Item, ItemIndicator, SearchInput.
 *
 * Headless primitive providing accessible behavior without styling opinions.
 * Uses createCollection, createRovingFocus, createSelection, createDisclosureState,
 * and positioning from @solidiom/runtime.
 */

import {
  type Accessor,
  Show,
  createSignal,
  createEffect,
  onCleanup,
  createContext,
  useContext,
} from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createCollection,
  createRovingFocus,
  createSelection,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  getHiddenInputProps,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type DisclosureReason,
  type CollectionItem,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MultiSelectorRootProps {
  /** Controlled selected keys. */
  value?: string[]
  /** Default selected keys (uncontrolled). */
  defaultValue?: string[]
  /** Called when selection changes. */
  onValueChange?: (values: string[]) => void
  /** Controlled open state. */
  open?: boolean
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Disabled state. */
  disabled?: boolean
  /** Read-only state. */
  readOnly?: boolean
  /** Required state. */
  required?: boolean
  /** Invalid state. */
  invalid?: boolean
  /** Form field name for hidden input. */
  name?: string
  /** Element id. */
  id?: string
  /** Placeholder text when no items are selected. */
  placeholder?: string
  /** Children. */
  children?: JSX.Element
}

export interface MultiSelectorItemProps {
  /** Unique value for this item. */
  value: string
  /** Display/search text. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  /** Children. */
  children?: JSX.Element
}

export interface MultiSelectorTriggerProps {
  children?: JSX.Element
}

export interface MultiSelectorTagListProps {
  children?: JSX.Element
}

export interface MultiSelectorTagProps {
  /** The value of the item this tag represents. */
  value: string
  children?: JSX.Element
}

export interface MultiSelectorTagRemoveProps {
  children?: JSX.Element
}

export interface MultiSelectorContentProps {
  children?: JSX.Element
}

export interface MultiSelectorItemIndicatorProps {
  children?: JSX.Element
}

export interface MultiSelectorSearchInputProps {
  /** Placeholder for the search input. */
  placeholder?: string
  /** Controlled search value. */
  value?: string
  /** Called when search value changes. */
  onValueChange?: (value: string) => void
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface MultiSelectorContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  selectedValues: Accessor<string[]>
  toggleValue: (value: string) => void
  removeValue: (value: string) => void
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  required: Accessor<boolean>
  invalid: Accessor<boolean>
  collection: ReturnType<typeof createCollection>
  rovingFocus: ReturnType<typeof createRovingFocus>
  triggerId: string
  listboxId: string
  name?: string
  placeholder?: string
  searchValue: Accessor<string>
  setSearchValue: (value: string) => void
}

const MultiSelectorContext = createContext<MultiSelectorContextValue>()

function useMultiSelectorContext(): MultiSelectorContextValue {
  const ctx = useContext(MultiSelectorContext)
  if (!ctx) {
    throw new Error("[solidiom] MultiSelector parts must be used within MultiSelector.Root")
  }
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────────

export function Root(props: MultiSelectorRootProps) {
  const baseId = createStableId("multi-selector")

  const disabled: Accessor<boolean> = () => props.disabled ?? false
  const readOnly: Accessor<boolean> = () => props.readOnly ?? false
  const required: Accessor<boolean> = () => props.required ?? false
  const invalid: Accessor<boolean> = () => props.invalid ?? false

  const { open, requestOpenChange } = createDisclosureState({
    open:
      props.open !== undefined ? ((() => props.open) as Accessor<boolean | undefined>) : undefined,
    defaultOpen: props.defaultOpen,
    onOpenChange: (next, _details) => {
      props.onOpenChange?.(next)
    },
    disabled,
  })

  // Selection state
  const [internalValues, setInternalValues] = createSignal<string[]>(props.defaultValue ?? [], {
    equals: false,
    ownedWrite: true,
  })

  const selectedValues: Accessor<string[]> = () => {
    if (props.value !== undefined) return props.value
    return internalValues()
  }

  const selection = createSelection({
    mode: "multiple",
    selectionBehavior: "toggle",
    selectedKeys: () => new Set(selectedValues()),
    onSelectionChange: (keys) => {
      const next = Array.from(keys)
      if (props.value === undefined) {
        setInternalValues(next)
      }
      props.onValueChange?.(next)
    },
    disabled,
    allowEmpty: true,
  })

  const toggleValue = (value: string): void => {
    if (disabled() || readOnly()) return
    selection.toggle(value)
  }

  const removeValue = (value: string): void => {
    if (disabled() || readOnly()) return
    const current = selectedValues()
    const next = current.filter((v) => v !== value)
    if (props.value === undefined) {
      setInternalValues(next)
    }
    props.onValueChange?.(next)
  }

  // Search state
  const [searchValue, setSearchValue] = createSignal("")

  const collection = createCollection()
  const rovingFocus = createRovingFocus()

  const ctx: MultiSelectorContextValue = {
    open,
    requestOpenChange,
    selectedValues,
    toggleValue,
    removeValue,
    disabled,
    readOnly,
    required,
    invalid,
    collection,
    rovingFocus,
    triggerId: `${baseId}-trigger`,
    listboxId: `${baseId}-listbox`,
    name: props.name,
    placeholder: props.placeholder,
    searchValue,
    setSearchValue,
  }

  return (
    <MultiSelectorContext value={ctx}>
      <div
        id={props.id}
        {...applySemanticAttrs({
          scope: "multi-selector",
          part: "root",
          disabled: props.disabled,
          readonly: props.readOnly,
          required: props.required,
          invalid: props.invalid,
        })}
      >
        {props.children}
        {props.name && <HiddenInput />}
      </div>
    </MultiSelectorContext>
  )
}

// ─── Trigger ────────────────────────────────────────────────────────────────────

export function Trigger(props: MultiSelectorTriggerProps) {
  const ctx = useMultiSelectorContext()

  const handleClick = () => {
    if (ctx.disabled() || ctx.readOnly()) return
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (ctx.disabled() || ctx.readOnly()) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!ctx.open()) {
        ctx.requestOpenChange(true, createChangeDetails("trigger"))
      }
    }
  }

  return (
    <button
      id={ctx.triggerId}
      type="button"
      role="combobox"
      aria-expanded={ctx.open() ? "true" : "false"}
      aria-haspopup="listbox"
      aria-controls={ctx.listboxId}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      aria-invalid={ctx.invalid() ? "true" : undefined}
      aria-required={ctx.required() ? "true" : undefined}
      disabled={ctx.disabled()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({
        scope: "multi-selector",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
        invalid: ctx.invalid(),
      })}
    >
      {props.children}
      <Show when={ctx.selectedValues().length === 0 && ctx.placeholder}>
        <span
          {...applySemanticAttrs({
            scope: "multi-selector",
            part: "placeholder",
          })}
        >
          {ctx.placeholder}
        </span>
      </Show>
    </button>
  )
}

// ─── TagList ────────────────────────────────────────────────────────────────────

export function TagList(props: MultiSelectorTagListProps) {
  return (
    <div
      role="list"
      aria-label="Selected values"
      {...applySemanticAttrs({
        scope: "multi-selector",
        part: "tag-list",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Tag ────────────────────────────────────────────────────────────────────────

const TagValueContext = createContext<string>()

export function Tag(props: MultiSelectorTagProps) {
  return (
    <TagValueContext value={props.value}>
      <span
        role="listitem"
        {...applySemanticAttrs({
          scope: "multi-selector",
          part: "tag",
        })}
      >
        {props.children}
      </span>
    </TagValueContext>
  )
}

// ─── TagRemove ──────────────────────────────────────────────────────────────────

export function TagRemove(props: MultiSelectorTagRemoveProps) {
  const ctx = useMultiSelectorContext()
  const tagValue = useContext(TagValueContext)

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (ctx.disabled() || ctx.readOnly()) return
    if (tagValue !== undefined) {
      ctx.removeValue(tagValue)
    }
  }

  return (
    <button
      type="button"
      aria-label={`Remove ${tagValue ?? ""}`}
      tabindex={-1}
      disabled={ctx.disabled()}
      onClick={handleClick}
      {...applySemanticAttrs({
        scope: "multi-selector",
        part: "tag-remove",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content (Listbox) ──────────────────────────────────────────────────────────

export function Content(props: MultiSelectorContentProps) {
  const ctx = useMultiSelectorContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.open() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument
      const stack = getLayerStack(doc)
      const removeLayer = stack.push({ id: ctx.listboxId, element: el, modal: false })

      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.listboxId,
        element: () => el,
        excludeElements: () => {
          const trigger = doc.getElementById(ctx.triggerId)
          return trigger ? [trigger] : []
        },
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason))
        },
      })

      return () => {
        removeDismissable()
        removeLayer()
      }
    },
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      ctx.requestOpenChange(false, createChangeDetails("escape-key"))
      return
    }

    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.collection.orientation(),
      direction: ctx.collection.direction(),
    })

    if (intent) {
      e.preventDefault()
      const next = resolveNextItem(
        ctx.collection.enabledItems(),
        ctx.rovingFocus.activeId(),
        intent,
        { loop: true },
      )
      if (next) ctx.rovingFocus.setActiveId(next.id)
      return
    }

    // Enter/Space toggles selection on active item
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const activeId = ctx.rovingFocus.activeId()
      if (activeId) {
        const item = ctx.collection.getItem(activeId)
        if (item) {
          ctx.toggleValue(item.textValue())
        }
      }
      return
    }
  }

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.listboxId}
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={ctx.triggerId}
        tabindex={0}
        onKeyDown={handleKeyDown}
        ref={(el: HTMLDivElement) => {
          setContentEl(el)
        }}
        {...applySemanticAttrs({
          scope: "multi-selector",
          part: "content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Item ───────────────────────────────────────────────────────────────────────

const ItemValueContext = createContext<{ value: string; isSelected: Accessor<boolean> }>()

export function Item(props: MultiSelectorItemProps) {
  const ctx = useMultiSelectorContext()
  const itemId = createStableId("multi-selector-item")

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value,
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isSelected = (): boolean => {
    return ctx.selectedValues().includes(props.value)
  }

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const isVisible = (): boolean => {
    const search = ctx.searchValue().toLowerCase()
    if (!search) return true
    const text = (props.textValue ?? props.value).toLowerCase()
    return text.includes(search)
  }

  const handleClick = () => {
    if (props.disabled) return
    ctx.toggleValue(props.value)
  }

  return (
    <Show when={isVisible()}>
      <ItemValueContext value={{ value: props.value, isSelected }}>
        <div
          id={itemId}
          role="option"
          aria-selected={isSelected() ? "true" : "false"}
          aria-disabled={props.disabled ? "true" : undefined}
          tabindex={ctx.rovingFocus.getTabIndex(itemId)}
          onClick={handleClick}
          {...applySemanticAttrs({
            scope: "multi-selector",
            part: "item",
            state: isSelected() ? "checked" : "unchecked",
            disabled: props.disabled,
            highlighted: isHighlighted(),
            selected: isSelected(),
          })}
        >
          {props.children}
        </div>
      </ItemValueContext>
    </Show>
  )
}

// ─── ItemIndicator ──────────────────────────────────────────────────────────────

export function ItemIndicator(props: MultiSelectorItemIndicatorProps) {
  const itemCtx = useContext(ItemValueContext)

  return (
    <Show when={itemCtx?.isSelected()}>
      <span
        aria-hidden="true"
        {...applySemanticAttrs({
          scope: "multi-selector",
          part: "item-indicator",
        })}
      >
        {props.children}
      </span>
    </Show>
  )
}

// ─── SearchInput ────────────────────────────────────────────────────────────────

export function SearchInput(props: MultiSelectorSearchInputProps) {
  const ctx = useMultiSelectorContext()

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const value = e.currentTarget.value
    ctx.setSearchValue(value)
    props.onValueChange?.(value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent escape from bubbling to content when search is focused
    if (e.key === "Escape") {
      e.preventDefault()
      ctx.requestOpenChange(false, createChangeDetails("escape-key"))
    }
    // Allow ArrowDown/Up to navigate items from search input
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const intent = resolveNavigationIntent(e.key, {
        orientation: ctx.collection.orientation(),
        direction: ctx.collection.direction(),
      })
      if (intent) {
        const next = resolveNextItem(
          ctx.collection.enabledItems(),
          ctx.rovingFocus.activeId(),
          intent,
          { loop: true },
        )
        if (next) ctx.rovingFocus.setActiveId(next.id)
      }
    }
  }

  return (
    <input
      type="text"
      role="searchbox"
      aria-label="Search options"
      aria-autocomplete="list"
      aria-controls={ctx.listboxId}
      placeholder={props.placeholder}
      value={props.value ?? ctx.searchValue()}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({
        scope: "multi-selector",
        part: "search-input",
      })}
    />
  )
}

// ─── HiddenInput ────────────────────────────────────────────────────────────────

function HiddenInput() {
  const ctx = useMultiSelectorContext()
  if (!ctx.name) return null

  const inputProps = () =>
    getHiddenInputProps({
      name: ctx.name!,
      value: () => ctx.selectedValues(),
      required: ctx.required,
      disabled: ctx.disabled,
    })

  return (
    <>
      {inputProps().map((p) => (
        <input {...p} />
      ))}
    </>
  )
}
