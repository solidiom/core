import { createSignal, createMemo, For } from "solid-js"
import { isTokenReference, type ThemeDefinition, type ThemeMode, type ThemeTokenValue } from "../../../../../tools/theme-contract-schema"
import { validateThemeDefinition, type ThemeContractViolation } from "../../../../../tools/theme-contract-validate"
import { SOLIDIOM_DEFAULT_THEME } from "../../../../../tools/theme-contract-definitions"
import type { Locale } from "../../lib/locale"

interface BuilderEditorPanelProps {
  locale: Locale
  theme: () => ThemeDefinition
  setTheme: (fn: (prev: ThemeDefinition) => ThemeDefinition) => void
  previewMode: () => ThemeMode
}

const COPY: Record<
  Locale,
  {
    title: string
    lightLabel: string
    darkLabel: string
    modeLabel: string
    undo: string
    undoDisabled: string
    resetAll: string
    resetToken: string
    errorTitle: string
    refBadge: string
    colorLabel: string
    textLabel: string
    groups: Record<string, string>
  }
> = {
  en: {
    title: "Token Editor",
    lightLabel: "Light",
    darkLabel: "Dark",
    modeLabel: "Edit mode",
    undo: "Undo",
    undoDisabled: "Nothing to undo",
    resetAll: "Reset All",
    resetToken: "Reset",
    errorTitle: "Validation",
    refBadge: "ref",
    colorLabel: "Pick color",
    textLabel: "Value",
    groups: {
      surface: "Surface",
      foreground: "Foreground",
      border: "Border",
      intent: "Intent",
      focus: "Focus",
      radius: "Radius",
      shadow: "Shadow",
    },
  },
  es: {
    title: "Editor de Tokens",
    lightLabel: "Claro",
    darkLabel: "Oscuro",
    modeLabel: "Modo de edición",
    undo: "Deshacer",
    undoDisabled: "Nada que deshacer",
    resetAll: "Restablecer Todo",
    resetToken: "Restablecer",
    errorTitle: "Validación",
    refBadge: "ref",
    colorLabel: "Elegir color",
    textLabel: "Valor",
    groups: {
      surface: "Superficie",
      foreground: "Primero",
      border: "Borde",
      intent: "Intención",
      focus: "Enfoque",
      radius: "Radio",
      shadow: "Sombra",
    },
  },
}

interface UndoEntry {
  mode: ThemeMode
  token: string
  oldValue: ThemeTokenValue
}

const MAX_UNDO = 10

const TOKEN_CATEGORIES: { category: string; tokens: string[] }[] = [
  {
    category: "surface",
    tokens: ["surface", "surface-raised", "surface-overlay", "surface-sunken"],
  },
  {
    category: "foreground",
    tokens: [
      "foreground",
      "foreground-muted",
      "foreground-subtle",
      "foreground-inverse",
    ],
  },
  {
    category: "border",
    tokens: ["border", "border-muted", "border-active"],
  },
  {
    category: "intent",
    tokens: [
      "primary",
      "primary-hover",
      "primary-foreground",
      "secondary",
      "success",
      "warning",
      "destructive",
    ],
  },
  {
    category: "focus",
    tokens: ["focus-ring", "focus-ring-width"],
  },
  {
    category: "radius",
    tokens: ["radius-sm", "radius", "radius-lg", "radius-full"],
  },
  {
    category: "shadow",
    tokens: ["shadow-sm", "shadow-md", "shadow-lg"],
  },
]

const COLOR_TOKENS = new Set<string>([
  "surface",
  "surface-raised",
  "surface-overlay",
  "surface-sunken",
  "foreground",
  "foreground-muted",
  "foreground-subtle",
  "foreground-inverse",
  "border",
  "border-muted",
  "border-active",
  "primary",
  "primary-hover",
  "primary-foreground",
  "secondary",
  "success",
  "warning",
  "destructive",
])

export function BuilderEditorPanel(props: BuilderEditorPanelProps) {
  const copy = () => COPY[props.locale]

  const [editMode, setEditMode] = createSignal<ThemeMode>("light")
  const [undoStack, setUndoStack] = createSignal<UndoEntry[]>([])
  const [collapsedGroups, setCollapsedGroups] = createSignal<Set<string>>(
    new Set(),
  )

  // Focus tracking for keyboard navigation
  const [focusedToken, setFocusedToken] = createSignal<{ mode: ThemeMode; token: string } | null>(null)

  // Validation
  const [violations, setViolations] = createSignal<Map<string, ThemeContractViolation[]>>(new Map())

  const runValidation = () => {
    const v = validateThemeDefinition(props.theme())
    const grouped = new Map<string, ThemeContractViolation[]>()
    for (const viol of v) {
      const token = viol.path.replace(/^modes\.\w+\./, "")
      if (token !== viol.path || viol.path.startsWith("modes.")) {
        const key = viol.path.startsWith("modes.")
          ? viol.path.replace(/^modes\.\w+\./, editMode() + ".")
          : viol.path
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(viol)
      }
    }
    setViolations(grouped)
  }

  const updateToken = (
    mode: ThemeMode,
    token: string,
    value: ThemeTokenValue,
  ) => {
    const current = props.theme().modes[mode][token]
    if (current === value) return

    setUndoStack(prev => {
      const entry: UndoEntry = { mode, token, oldValue: current }
      const stack = [entry, ...prev].slice(0, MAX_UNDO)
      return stack
    })

    props.setTheme(prev => ({
      ...prev,
      modes: {
        ...prev.modes,
        [mode]: {
          ...prev.modes[mode],
          [token]: value,
        },
      },
    }))
  }

  const handleUndo = () => {
    const stack = undoStack()
    if (stack.length === 0) return
    const entry = stack[0]
    updateToken(entry.mode, entry.token, entry.oldValue)
  }

  const resetTokenToDefault = (mode: ThemeMode, token: string) => {
    const defaultValue = SOLIDIOM_DEFAULT_THEME.modes[mode][token]
    if (defaultValue !== undefined) {
      updateToken(mode, token, defaultValue)
    }
  }

  const resetAll = () => {
    for (const category of TOKEN_CATEGORIES) {
      for (const token of category.tokens) {
        const defaultValue = SOLIDIOM_DEFAULT_THEME.modes[editMode()][token]
        if (defaultValue !== undefined) {
          updateToken(editMode(), token, defaultValue)
        }
      }
    }
  }

  const getLiteralValue = (tokenValue: ThemeTokenValue): string => {
    if (isTokenReference(tokenValue)) return ""
    return tokenValue
  }

  const isColorToken = (token: string): boolean => COLOR_TOKENS.has(token)

  const toggleGroup = (category: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const onTokenChange = (token: string, value: ThemeTokenValue) => {
    updateToken(editMode(), token, value)
    runValidation()
  }

  const getTokenViolations = (token: string): ThemeContractViolation[] => {
    const key = editMode() + "." + token
    return violations().get(key) || []
  }

  // All focusable tokens in order for keyboard navigation
  const allTokens = createMemo(() => {
    const tokens: { mode: ThemeMode; token: string; category: string }[] = []
    for (const cat of TOKEN_CATEGORIES) {
      for (const tok of cat.tokens) {
        tokens.push({ mode: editMode(), token: tok, category: cat.category })
      }
    }
    return tokens
  })

  const navigateToken = (direction: "prev" | "next") => {
    const current = focusedToken()
    if (!current) return
    const list = allTokens()
    const idx = list.findIndex(t => t.token === current.token && t.mode === current.mode)
    if (idx === -1) return
    const next = direction === "next" ? Math.min(idx + 1, list.length - 1) : Math.max(idx - 1, 0)
    const target = list[next]
    const el = document.querySelector(
      `[data-token-focus-id="${target.token}"]`,
    ) as HTMLElement
    el?.focus()
  }

  return (
    <aside
      class="theme-builder__panel-editor"
      aria-label={copy().title}
    >
      {/* Mode toggle */}
      <div class="theme-builder__editor-mode-toggle">
        <span class="theme-builder__mode-label">{copy().modeLabel}</span>
        <div class="theme-builder__mode-segmented">
          <button
            class={`theme-builder__mode-btn ${editMode() === "light" ? "theme-builder__mode-btn--active" : ""}`}
            onClick={() => setEditMode("light")}
            aria-pressed={editMode() === "light" ? "true" : "false"}
          >
            {copy().lightLabel}
          </button>
          <button
            class={`theme-builder__mode-btn ${editMode() === "dark" ? "theme-builder__mode-btn--active" : ""}`}
            onClick={() => setEditMode("dark")}
            aria-pressed={editMode() === "dark" ? "true" : "false"}
          >
            {copy().darkLabel}
          </button>
        </div>
      </div>

      {/* Actions bar */}
      <div class="theme-builder__editor-actions">
        <button
          class="theme-builder__btn-undo"
          onClick={handleUndo}
          disabled={undoStack().length === 0}
          title={undoStack().length === 0 ? copy().undoDisabled : copy().undo}
        >
          {copy().undo}
        </button>
        <button
          class="theme-builder__btn-reset"
          onClick={resetAll}
        >
          {copy().resetAll}
        </button>
      </div>

      {/* Token groups */}
      <div class="theme-builder__token-groups">
        <For each={TOKEN_CATEGORIES}>
          {(category: { category: string; tokens: string[] }) => (
            <div class="theme-builder__token-group">
              <button
                class="theme-builder__token-group-header"
                onClick={() => toggleGroup(category.category)}
                aria-expanded={!collapsedGroups().has(category.category) ? "true" : "false"}
              >
                <span class="theme-builder__group-chevron">
                  {collapsedGroups().has(category.category) ? "▶" : "▼"}
                </span>
                <span>{copy().groups[category.category]}</span>
                <span class="theme-builder__group-count">
                  {category.tokens.length}
                </span>
              </button>
              {!collapsedGroups().has(category.category) && (
                <div class="theme-builder__token-group-body">
                  <For each={category.tokens}>
                    {(token: string) => (
                      <TokenRow
                        token={token}
                        theme={props.theme}
                        mode={editMode}
                        copy={copy}
                        onUpdate={onTokenChange}
                        onReset={resetTokenToDefault}
                        isColorToken={isColorToken}
                        getLiteralValue={getLiteralValue}
                        getTokenViolations={getTokenViolations}
                        onFocus={() => setFocusedToken({ mode: editMode(), token })}
                        onFocusId={token}
                        onKeyDown={(e: KeyboardEvent) => {
                          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                            e.preventDefault()
                            navigateToken("next")
                          }
                          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                            e.preventDefault()
                            navigateToken("prev")
                          }
                        }}
                      />
                    )}
                  </For>
                </div>
              )}
            </div>
          )}
        </For>
      </div>

      {/* Global validation errors */}
      {(() => {
        const globalViolations = violations().get("modes")
        if (!globalViolations || globalViolations.length === 0) return null
        return (
          <div class="theme-builder__validation-summary">
            <h3>{copy().errorTitle}</h3>
            <For each={globalViolations}>
              {(v: ThemeContractViolation) => (
                <div class="theme-builder__token-error">
                  <span class="theme-builder__error-rule">[{v.rule}]</span> {v.message}
                </div>
              )}
            </For>
          </div>
        )
      })()}
    </aside>
  )
}

/* ─── Token Row ─────────────────────────────────────────────────────── */

interface TokenRowProps {
  token: string
  theme: () => ThemeDefinition
  mode: () => ThemeMode
  copy: () => CopyText
  onUpdate: (token: string, value: ThemeTokenValue) => void
  onReset: (mode: ThemeMode, token: string) => void
  isColorToken: (token: string) => boolean
  getLiteralValue: (v: ThemeTokenValue) => string
  getTokenViolations: (token: string) => ThemeContractViolation[]
  onFocus: () => void
  onFocusId: string
  onKeyDown: (e: KeyboardEvent) => void
}

interface CopyText {
  refBadge: string
  colorLabel: string
  textLabel: string
  resetToken: string
}

function TokenRow(props: TokenRowProps) {
  const tokenValue = () => props.theme().modes[props.mode()][props.token]
  const errors = () => props.getTokenViolations(props.token)

  const [showColorPicker, setShowColorPicker] = createSignal(false)

  const handleColorChange = (color: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(color)) {
      props.onUpdate(props.token, color)
    }
  }

  const handleTextChange = (value: string) => {
    props.onUpdate(props.token, value)
  }

  const handleRefToLiteral = (value: string) => {
    props.onUpdate(props.token, value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && showColorPicker()) {
      e.preventDefault()
      setShowColorPicker(false)
      const textInput = document.querySelector(
        `[data-text-input="${props.token}"]`,
      ) as HTMLInputElement
      textInput?.focus()
    }
    props.onKeyDown(e)
  }

  const currentValue = tokenValue()
  const isRef = isTokenReference(currentValue)

  return (
    <div
      class={`theme-builder__token-row ${errors().length > 0 ? "theme-builder__token-row--error" : ""}`}
      data-token-focus-id={props.token}
      tabindex={0}
      onFocus={props.onFocus}
      onKeyDown={handleKeyDown}
    >
      <label class="theme-builder__token-label">
        <span class="theme-builder__token-name">{props.token}</span>
        {isRef && (
          <span class="theme-builder__token-ref-badge" title={`refers to ${currentValue.ref}`}>
            {props.copy().refBadge}
          </span>
        )}
      </label>

      <div class="theme-builder__token-inputs">
        {isRef ? (
          /* Reference token - show ref indicator + allow changing to literal */
          <div class="theme-builder__ref-token">
            <span class="theme-builder__ref-text">
              {"→ "}
              {currentValue.ref}
            </span>
            <input
              type="text"
              class="theme-builder__token-text"
              placeholder={props.copy().textLabel}
              aria-label={props.copy().textLabel}
              data-text-input={props.token}
              onBlur={(e: FocusEvent) => {
                const target = e.target as HTMLInputElement
                if (target.value.trim()) {
                  handleRefToLiteral(target.value.trim())
                }
              }}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement
                  if (target.value.trim()) {
                    handleRefToLiteral(target.value.trim())
                  }
                }
              }}
            />
          </div>
        ) : (
          /* Literal token */
          <>
            {props.isColorToken(props.token) ? (
              /* Color token - color picker + text input */
              <div class="theme-builder__color-inputs">
                {showColorPicker() && (
                  <input
                    type="color"
                    class="theme-builder__token-color"
                    value={props.getLiteralValue(currentValue) || "#000000"}
                    aria-label={props.copy().colorLabel}
                    onChange={(e: Event) => handleColorChange((e.target as HTMLInputElement).value)}
                  />
                )}
                <button
                  type="button"
                  class="theme-builder__color-swatch"
                  style={{"background-color": props.getLiteralValue(currentValue) || "transparent"}}
                  onClick={() => setShowColorPicker(!showColorPicker())}
                  aria-label={props.copy().colorLabel}
                />
                <input
                  type="text"
                  class="theme-builder__token-text"
                  value={props.getLiteralValue(currentValue)}
                  aria-label={props.copy().textLabel}
                  data-text-input={props.token}
                  spellcheck={false}
                  onInput={(e: Event) => handleTextChange((e.target as HTMLInputElement).value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            ) : (
              /* Text token (radius, shadow, etc.) */
              <input
                type="text"
                class="theme-builder__token-text"
                value={props.getLiteralValue(currentValue)}
                aria-label={props.copy().textLabel}
                data-text-input={props.token}
                spellcheck={false}
                onInput={(e: Event) => handleTextChange((e.target as HTMLInputElement).value)}
                onKeyDown={handleKeyDown}
              />
            )}
          </>
        )}

        <button
          type="button"
          class="theme-builder__token-reset"
          onClick={() => props.onReset(props.mode(), props.token)}
          aria-label={`${props.copy().resetToken} ${props.token}`}
          title={props.copy().resetToken}
        >
          {"↺"}
        </button>
      </div>

      {/* Inline validation errors */}
      <For each={errors()}>
        {(error: ThemeContractViolation) => (
          <div class="theme-builder__token-error">
            <span class="theme-builder__error-rule">[{error.rule}]</span> {error.message}
          </div>
        )}
      </For>
    </div>
  )
}