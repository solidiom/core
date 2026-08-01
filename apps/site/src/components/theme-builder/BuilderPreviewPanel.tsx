import { createMemo, createRenderEffect, For } from "solid-js"
import type { ThemeDefinition, ThemeMode } from "../../../../../tools/theme-contract-schema"
import { themeToCssVariables } from "../../lib/theme-builder/theme-to-css"
import type { Locale } from "../../lib/locale"

export interface BuilderPreviewPanelProps {
  locale: Locale
  theme: ThemeDefinition
  mode: ThemeMode
}

const COPY: Record<Locale, { title: string; tokensTitle: string; modeLabel: string }> = {
  en: {
    title: "Preview",
    tokensTitle: "Theme Tokens",
    modeLabel: "mode",
  },
  es: {
    title: "Vista Previa",
    tokensTitle: "Tokens del Tema",
    modeLabel: "modo",
  },
}

export function BuilderPreviewPanel(props: BuilderPreviewPanelProps) {
  const copy = () => COPY[props.locale]

  const cssVars = createMemo(() => themeToCssVariables(props.theme, props.mode))

  const colorTokens = createMemo(() => {
    return Object.entries(cssVars()).filter(([key]) =>
      key.startsWith("--sio-primary") ||
      key.startsWith("--sio-secondary") ||
      key.startsWith("--sio-surface") ||
      key.startsWith("--sio-foreground") ||
      key.startsWith("--sio-border") ||
      key.startsWith("--sio-success") ||
      key.startsWith("--sio-warning") ||
      key.startsWith("--sio-destructive"),
    )
  })

  let containerRef: HTMLDivElement | undefined

  createRenderEffect(
    () => cssVars(),
    (vars) => {
      if (!containerRef) return
      for (const [key, value] of Object.entries(vars)) {
        containerRef.style.setProperty(key, value)
      }
    },
  )

  return (
    <section class="theme-builder__panel-preview" aria-label={copy().title}>
      <div class="theme-builder__preview-toolbar">
        <span>{copy().title}</span>
        <span>
          {props.mode === "light" ? "Light" : "Dark"} {copy().modeLabel}
        </span>
      </div>
      <div
        ref={containerRef!}
        class={`theme-builder__preview-container theme-builder__preview-container--${props.mode}`}
      >
        <div class="theme-builder__preview-surface">
          <h2 class="theme-builder__panel-placeholder-title">{copy().tokensTitle}</h2>
          <div class="theme-builder__preview-swatch-grid">
            <For each={colorTokens()}>
              {([key, value]) => (
                <div class="theme-builder__preview-swatch">
                  <div
                    class="theme-builder__preview-swatch-color"
                    style={{"background-color": value}}
                  />
                  <span class="theme-builder__preview-swatch-label">
                    {key.replace("--sio-", "")}
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </section>
  )
}