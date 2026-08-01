import type { Locale } from "../../lib/locale"

interface BuilderHeaderProps {
  locale: Locale
  previewMode: "light" | "dark"
  onModeToggle: () => void
  onExport: () => void
}

const COPY: Record<
  Locale,
  {
    title: string
    badge: string
    modeLabel: string
    toggleAriaLabel: string
    exportLabel: string
  }
> = {
  en: {
    title: "Theme Builder",
    badge: "Beta",
    modeLabel: "Preview mode",
    toggleAriaLabel: "Toggle preview between light and dark mode",
    exportLabel: "Export",
  },
  es: {
    title: "Editor de Temas",
    badge: "Beta",
    modeLabel: "Modo de vista previa",
    toggleAriaLabel: "Cambiar vista previa entre modo claro y oscuro",
    exportLabel: "Exportar",
  },
}

export function BuilderHeader(props: BuilderHeaderProps) {
  const copy = () => COPY[props.locale]

  return (
    <header class="theme-builder__header">
      <div class="theme-builder__header-left">
        <h1 class="theme-builder__title">{copy().title}</h1>
        <span class="theme-builder__badge">{copy().badge}</span>
      </div>
      <div class="theme-builder__header-right">
        <button
          type="button"
          class="theme-builder__btn-export"
          onClick={props.onExport}
        >
          {copy().exportLabel}
        </button>
        <label class="theme-builder__mode-toggle">
          <span>{copy().modeLabel}</span>
          <input
            type="checkbox"
            role="switch"
            checked={props.previewMode === "dark"}
            onChange={props.onModeToggle}
            aria-label={copy().toggleAriaLabel}
          />
        </label>
      </div>
    </header>
  )
}