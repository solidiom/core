import { createSignal } from "solid-js"
import { BuilderHeader } from "./BuilderHeader"
import { BuilderEditorPanel } from "./BuilderEditorPanel"
import { BuilderPreviewPanel } from "./BuilderPreviewPanel"
import { BuilderExportDialog } from "./BuilderExportDialog"
import { BuilderLayout } from "./BuilderLayout"
import { createThemeState } from "../../lib/theme-builder/theme-state"
import type { Locale } from "../../lib/locale"
import { trackBuilderOpened } from "../../lib/analytics"

export interface ThemeBuilderShellProps {
  locale: Locale
}

export function ThemeBuilderShell(props: ThemeBuilderShellProps) {
  const state = createThemeState()
  const [exportOpen, setExportOpen] = createSignal(false)
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
            onExport={() => setExportOpen(true)}
          />
        }
      >
        <BuilderEditorPanel
          locale={props.locale}
          theme={state.theme}
          setTheme={state.setTheme}
          previewMode={state.previewMode}
        />
        <BuilderPreviewPanel
          locale={props.locale}
          theme={state.theme}
          mode={state.previewMode}
        />
      </BuilderLayout>
      <BuilderExportDialog
        locale={props.locale}
        theme={state.theme}
        open={exportOpen()}
        onOpenChange={setExportOpen}
      />
    </div>
  )
}