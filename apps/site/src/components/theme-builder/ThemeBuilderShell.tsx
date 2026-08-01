import { createSignal } from "solid-js"
import { BuilderHeader } from "./BuilderHeader"
import { BuilderEditorPanel } from "./BuilderEditorPanel"
import { BuilderPreviewPanel } from "./BuilderPreviewPanel"
import { BuilderExportDialog } from "./BuilderExportDialog"
import { BuilderShareDialog } from "./BuilderShareDialog"
import { BuilderLayout } from "./BuilderLayout"
import { createThemeState } from "../../lib/theme-builder/theme-state"
import { hashToTheme } from "../../lib/theme-builder/theme-share"
import type { Locale } from "../../lib/locale"
import { trackBuilderOpened } from "../../lib/analytics"

export interface ThemeBuilderShellProps {
  locale: Locale
}

function loadThemeFromUrl(): { theme?: any; error?: string } {
  if (typeof window === "undefined") return {}
  const hash = window.location.hash
  if (!hash) return {}
  return hashToTheme(hash)
}

export function ThemeBuilderShell(props: ThemeBuilderShellProps) {
  const { theme: urlTheme, error: urlError } = loadThemeFromUrl()
  const state = createThemeState(urlTheme)
  const [exportOpen, setExportOpen] = createSignal(false)
  const [shareOpen, setShareOpen] = createSignal(false)
  const [loadError, setLoadError] = createSignal<string | undefined>(urlError)
  trackBuilderOpened()

  

  const handleModeToggle = () => {
    const next = state.previewMode() === "light" ? "dark" : "light"
    state.setPreviewMode(next)
  }

  const handleShare = () => {
    setLoadError(undefined)
    setShareOpen(true)
  }

  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="theme-builder-shell"
    >
      {loadError() && (
        <div class="theme-builder__error-banner" role="alert">
          <span class="theme-builder__error-message">{loadError()}</span>
          <button
            type="button"
            class="theme-builder__error-dismiss"
            onClick={() => setLoadError(undefined)}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}
      <BuilderLayout
        header={
          <BuilderHeader
            locale={props.locale}
            previewMode={state.previewMode()}
            onModeToggle={handleModeToggle}
            onExport={() => setExportOpen(true)}
            onShare={handleShare}
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
      <BuilderShareDialog
        locale={props.locale}
        theme={state.theme}
        open={shareOpen()}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}