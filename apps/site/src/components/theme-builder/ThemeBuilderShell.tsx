import { BuilderHeader } from "./BuilderHeader"
import { BuilderEditorPanel } from "./BuilderEditorPanel"
import { BuilderPreviewPanel } from "./BuilderPreviewPanel"
import { BuilderLayout } from "./BuilderLayout"
import { createThemeState } from "../../lib/theme-builder/theme-state"
import type { Locale } from "../../lib/locale"
import { trackBuilderOpened } from "../../lib/analytics"

export interface ThemeBuilderShellProps {
  locale: Locale
}

export function ThemeBuilderShell(props: ThemeBuilderShellProps) {
  const state = createThemeState()
  trackBuilderOpened()

  const handleModeToggle = () => {
    const next = state.previewMode() === "light" ? "dark" : "light"
    state.setPreviewMode(next)
  }

  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="theme-builder-shell"
    >
      <BuilderLayout
        header={
          <BuilderHeader
            locale={props.locale}
            previewMode={state.previewMode()}
            onModeToggle={handleModeToggle}
          />
        }
      >
        <BuilderEditorPanel locale={props.locale} />
        <BuilderPreviewPanel
          locale={props.locale}
          theme={state.theme()}
          mode={state.previewMode()}
        />
      </BuilderLayout>
    </div>
  )
}