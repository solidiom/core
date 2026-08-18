/**
 * @solidiom/tokenizer — Headless tag/token input for managing multiple values
 * with keyboard navigation, paste support, and form participation.
 *
 * Parts: Root, Token, TokenRemove, Input.
 *
 * Provides semantic data attributes for styling hooks, roving focus across
 * tokens, selection state, duplicate prevention, and max limit enforcement.
 */

import { createContext, createSignal, onCleanup, useContext, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createCollection,
  createRovingFocus,
  createSelection,
  createStableId,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type Collection,
  type CollectionItem,
  type RovingFocus,
  type Selection,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TokenizerReason = "input" | "paste" | "remove" | "backspace" | "programmatic"

export interface TokenizerRootProps {
  /** Controlled list of token values. */
  value?: string[]
  /** Default token values (uncontrolled). */
  defaultValue?: string[]
  /** Called when the token list changes. */
  onValueChange?: (tokens: string[]) => void
  /** Called when a single token is added. */
  onTokenAdd?: (token: string) => void
  /** Called when a single token is removed. */
  onTokenRemove?: (token: string, index: number) => void
  /** Maximum number of tokens allowed. */
  max?: number
  /** Whether duplicate tokens are allowed. Default: false. */
  allowDuplicates?: boolean
  /** Characters/keys that trigger token creation. Default: ['Enter', ',']. */
  delimiter?: string | string[]
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  /** Form field name. */
  name?: string
  /** Element id. */
  id?: string
  /** Placeholder for the input. */
  placeholder?: string
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface TokenizerTokenProps {
  /** The token value this chip represents. */
  value: string
  /** Index of the token in the list. */
  index: number
  disabled?: boolean
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface TokenizerTokenRemoveProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface TokenizerInputProps {
  class?: string
  style?: JSX.CSSProperties | string
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  onFocus?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>
  ref?: (el: HTMLInputElement) => void
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface TokenizerContextValue {
  tokens: Accessor<string[]>
  addToken: (value: string) => void
  addTokens: (values: string[]) => void
  removeToken: (index: number) => void
  collection: Collection
  rovingFocus: RovingFocus
  selection: Selection
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  required: Accessor<boolean>
  invalid: Accessor<boolean>
  delimiters: Accessor<string[]>
  placeholder: Accessor<string | undefined>
  max: Accessor<number | undefined>
  allowDuplicates: Accessor<boolean>
  rootId: string
  inputRef: Accessor<HTMLInputElement | undefined>
  setInputRef: (el: HTMLInputElement) => void
}

const TokenizerContext = createContext<TokenizerContextValue>()

function useTokenizerContext(): TokenizerContextValue {
  const ctx = useContext(TokenizerContext)
  if (!ctx) {
    throw new Error("[solidiom] Tokenizer parts must be used within Tokenizer.Root")
  }
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────────

/**
 * Tokenizer root — container managing token list state, keyboard navigation,
 * and form participation.
 *
 * Emits `data-scope="tokenizer"`, `data-part="root"`, plus state flags.
 */
export function Root(props: TokenizerRootProps) {
  const rootId = props.id ?? createStableId("tokenizer")
  const delimiters = (): string[] => {
    if (!props.delimiter) return ["Enter", ","]
    return Array.isArray(props.delimiter) ? props.delimiter : [props.delimiter]
  }
  const disabled = (): boolean => props.disabled ?? false
  const readOnly = (): boolean => props.readOnly ?? false
  const required = (): boolean => props.required ?? false
  const invalid = (): boolean => props.invalid ?? false
  const max = (): number | undefined => props.max
  const allowDuplicates = (): boolean => props.allowDuplicates ?? false
  const placeholder = (): string | undefined => props.placeholder

  // Controlled/uncontrolled token list
  const isControlled = (): boolean => props.value !== undefined

  const [internal, setInternal] = createSignal<string[]>(props.defaultValue ?? [], {
    equals: false,
  })

  const tokens: Accessor<string[]> = () => {
    if (isControlled()) return props.value!
    return internal()
  }

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>(undefined)

  const commitTokens = (next: string[]): void => {
    if (!isControlled()) {
      setInternal(next)
    }
    props.onValueChange?.(next)
  }

  const canAdd = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed) return false
    if (max() !== undefined && tokens().length >= max()!) return false
    if (!allowDuplicates() && tokens().includes(trimmed)) return false
    return true
  }

  const addToken = (value: string): void => {
    if (disabled() || readOnly()) return
    const trimmed = value.trim()
    if (!canAdd(trimmed)) return
    const next = [...tokens(), trimmed]
    commitTokens(next)
    props.onTokenAdd?.(trimmed)
  }

  const addTokens = (values: string[]): void => {
    if (disabled() || readOnly()) return
    const current = [...tokens()]
    const added: string[] = []
    for (const raw of values) {
      const trimmed = raw.trim()
      if (!trimmed) continue
      if (max() !== undefined && current.length >= max()!) break
      if (!allowDuplicates() && current.includes(trimmed)) continue
      current.push(trimmed)
      added.push(trimmed)
    }
    if (added.length > 0) {
      commitTokens(current)
      for (const token of added) {
        props.onTokenAdd?.(token)
      }
    }
  }

  const removeToken = (index: number): void => {
    if (disabled() || readOnly()) return
    const current = tokens()
    if (index < 0 || index >= current.length) return
    const removed = current[index]!
    const next = [...current.slice(0, index), ...current.slice(index + 1)]
    commitTokens(next)
    props.onTokenRemove?.(removed, index)
  }

  const collection = createCollection({ orientation: () => "horizontal" })
  const rovingFocus = createRovingFocus()
  const selection = createSelection({
    mode: "single",
    selectionBehavior: "replace",
    allowEmpty: true,
  })

  const ctx: TokenizerContextValue = {
    tokens,
    addToken,
    addTokens,
    removeToken,
    collection,
    rovingFocus,
    selection,
    disabled,
    readOnly,
    required,
    invalid,
    delimiters,
    placeholder,
    max,
    allowDuplicates,
    rootId,
    inputRef,
    setInputRef,
  }

  const handleRootKeyDown = (e: KeyboardEvent) => {
    if (disabled()) return

    // Handle navigation among tokens
    const intent = resolveNavigationIntent(e.key, {
      orientation: "horizontal",
      direction: collection.direction(),
    })

    if (intent) {
      const items = collection.enabledItems()
      if (items.length === 0) return
      e.preventDefault()
      const next = resolveNextItem(items, rovingFocus.activeId(), intent, { loop: true })
      if (next) {
        rovingFocus.setActiveId(next.id)
        selection.select(next.id)
        // Focus the token element
        ;(next.ref as HTMLElement | undefined)?.focus()
      }
      return
    }

    // Delete/Backspace removes selected token
    if (e.key === "Delete" || e.key === "Backspace") {
      const activeId = rovingFocus.activeId()
      if (activeId && e.target !== inputRef()) {
        e.preventDefault()
        const item = collection.getItem(activeId)
        if (item) {
          const tokenValue = item.textValue()
          const idx = tokens().indexOf(tokenValue)
          if (idx !== -1) {
            removeToken(idx)
            // Focus input after removal
            inputRef()?.focus()
          }
        }
      }
    }
  }

  return (
    <TokenizerContext value={ctx}>
      <div
        id={rootId}
        role="group"
        aria-disabled={disabled() ? "true" : undefined}
        aria-invalid={invalid() ? "true" : undefined}
        aria-required={required() ? "true" : undefined}
        onKeyDown={handleRootKeyDown}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "tokenizer",
          part: "root",
          disabled: disabled(),
          readonly: readOnly(),
          required: required(),
          invalid: invalid(),
        })}
      >
        {props.children}
        {/* Hidden input for form participation */}
        {props.name && (
          <input
            type="hidden"
            name={props.name}
            value={tokens().join(",")}
            disabled={disabled()}
            required={required()}
            aria-hidden="true"
            tabindex={-1}
          />
        )}
      </div>
    </TokenizerContext>
  )
}

// ─── Token ──────────────────────────────────────────────────────────────────────

/**
 * Individual token chip with roving focus and selection support.
 *
 * Emits `data-scope="tokenizer"`, `data-part="token"`, plus state flags.
 */
export function Token(props: TokenizerTokenProps) {
  const ctx = useTokenizerContext()
  const itemId = createStableId("tokenizer-token")
  let ref: HTMLDivElement | undefined

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? ctx.disabled(),
    textValue: () => props.value,
    get ref() {
      return ref
    },
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId
  const isSelected = () => ctx.selection.isSelected(itemId)

  const handleClick = () => {
    if (props.disabled || ctx.disabled()) return
    ctx.rovingFocus.setActiveId(itemId)
    ctx.selection.select(itemId)
  }

  const handleFocus = () => {
    ctx.rovingFocus.setActiveId(itemId, false)
    ctx.selection.select(itemId)
  }

  return (
    <div
      ref={(el) => {
        ref = el
      }}
      id={itemId}
      role="option"
      aria-selected={isSelected() ? "true" : "false"}
      aria-disabled={props.disabled || ctx.disabled() ? "true" : undefined}
      tabindex={ctx.rovingFocus.getTabIndex(itemId)}
      data-value={props.value}
      onClick={handleClick}
      onFocus={handleFocus}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "tokenizer",
        part: "token",
        disabled: props.disabled || ctx.disabled(),
        highlighted: isHighlighted(),
        selected: isSelected(),
      })}
    >
      {props.children ?? props.value}
    </div>
  )
}

// ─── TokenRemove ────────────────────────────────────────────────────────────────

/**
 * Remove button within a token. Removes the parent token on click.
 *
 * Emits `data-scope="tokenizer"`, `data-part="token-remove"`.
 */
export function TokenRemove(props: TokenizerTokenRemoveProps) {
  const ctx = useTokenizerContext()

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (ctx.disabled() || ctx.readOnly()) return

    // Walk up to find the token element with data-value
    const target = e.currentTarget as HTMLElement
    const tokenEl = target.closest('[data-part="token"]') as HTMLElement | null
    if (!tokenEl) return

    const tokenValue = tokenEl.getAttribute("data-value")
    if (tokenValue === null) return

    const idx = ctx.tokens().indexOf(tokenValue)
    if (idx !== -1) {
      ctx.removeToken(idx)
      // Focus input after removal
      ctx.inputRef()?.focus()
    }
  }

  return (
    <button
      type="button"
      aria-label="Remove"
      tabindex={-1}
      disabled={ctx.disabled() || ctx.readOnly()}
      onClick={handleClick}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "tokenizer",
        part: "token-remove",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
      })}
    >
      {props.children ?? "\u00d7"}
    </button>
  )
}

// ─── Input ──────────────────────────────────────────────────────────────────────

/**
 * Text input for typing new tokens. Handles delimiter detection, backspace
 * selection, and paste support.
 *
 * Emits `data-scope="tokenizer"`, `data-part="input"`.
 */
export function Input(props: TokenizerInputProps) {
  const ctx = useTokenizerContext()
  const inputId = createStableId("tokenizer-input")
  const [inputValue, setInputValue] = createSignal("")

  const splitByDelimiters = (text: string): string[] => {
    const delims = ctx.delimiters().filter((d) => d !== "Enter")
    if (delims.length === 0) return [text]
    // Build a regex from character delimiters
    const escaped = delims.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    const regex = new RegExp(`[${escaped.join("")}]`)
    return text.split(regex)
  }

  const commitCurrentValue = (): void => {
    const value = inputValue().trim()
    if (value) {
      ctx.addToken(value)
      setInputValue("")
    }
  }

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (ctx.disabled() || ctx.readOnly()) return

    const delims = ctx.delimiters()

    // Check if the pressed key is a delimiter
    if (delims.includes(e.key)) {
      e.preventDefault()
      commitCurrentValue()
      return
    }

    // Backspace when input is empty — select/remove last token
    if (e.key === "Backspace" && inputValue() === "") {
      const currentTokens = ctx.tokens()
      if (currentTokens.length > 0) {
        const items = ctx.collection.enabledItems()
        if (items.length > 0) {
          const lastItem = items[items.length - 1]!
          const activeId = ctx.rovingFocus.activeId()

          if (activeId === lastItem.id) {
            // Already selected, remove it
            const idx = currentTokens.length - 1
            ctx.removeToken(idx)
            ctx.rovingFocus.setActiveId(undefined as unknown as string)
            ctx.selection.deselectAll()
          } else {
            // Select the last token
            ctx.rovingFocus.setActiveId(lastItem.id)
            ctx.selection.select(lastItem.id)
            ;(lastItem.ref as HTMLElement | undefined)?.focus()
          }
        }
      }
      return
    }

    // Forward event to user handler
    if (props.onKeyDown) {
      ;(props.onKeyDown as (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const value = e.currentTarget.value
    // Check if the input contains a delimiter character (from IME or other input methods)
    const delims = ctx.delimiters().filter((d) => d !== "Enter")
    if (delims.some((d) => value.includes(d))) {
      const parts = splitByDelimiters(value)
      // Add all parts except the last one (which might be incomplete)
      const toAdd = parts
        .slice(0, -1)
        .map((p) => p.trim())
        .filter(Boolean)
      if (toAdd.length > 0) {
        ctx.addTokens(toAdd)
      }
      setInputValue(parts[parts.length - 1] ?? "")
      e.currentTarget.value = parts[parts.length - 1] ?? ""
    } else {
      setInputValue(value)
    }

    if (props.onInput) {
      ;(props.onInput as (e: InputEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    if (ctx.disabled() || ctx.readOnly()) return
    const pasted = e.clipboardData?.getData("text")
    if (!pasted) return

    e.preventDefault()
    const parts = splitByDelimiters(pasted)
    const toAdd = parts.map((p) => p.trim()).filter(Boolean)
    if (toAdd.length > 0) {
      ctx.addTokens(toAdd)
    }
  }

  const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    // Clear token selection when input is focused
    ctx.selection.deselectAll()
    ctx.rovingFocus.setActiveId(undefined as unknown as string)

    if (props.onFocus) {
      ;(props.onFocus as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    if (props.onBlur) {
      ;(props.onBlur as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  return (
    <input
      ref={(el) => {
        ctx.setInputRef(el)
        if (props.ref) props.ref(el)
      }}
      id={inputId}
      type="text"
      value={inputValue()}
      placeholder={ctx.tokens().length === 0 ? ctx.placeholder() : undefined}
      disabled={ctx.disabled()}
      readonly={ctx.readOnly()}
      aria-invalid={ctx.invalid() ? "true" : undefined}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "tokenizer",
        part: "input",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
        placeholder: ctx.tokens().length === 0 && !!ctx.placeholder(),
      })}
    />
  )
}
