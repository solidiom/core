import type { Locale } from "../../lib/locale"

interface BuilderEditorPanelProps {
  locale: Locale
}

const COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Token Editor",
    description: "Token editor coming soon",
  },
  es: {
    title: "Editor de Tokens",
    description: "El editor de tokens estara disponible pronto",
  },
}

export function BuilderEditorPanel(props: BuilderEditorPanelProps) {
  const copy = () => COPY[props.locale]

  return (
    <aside class="theme-builder__panel-editor" aria-label={copy().title}>
      <div class="theme-builder__panel-placeholder">
        <p class="theme-builder__panel-placeholder-title">{copy().title}</p>
        <p>{copy().description}</p>
      </div>
    </aside>
  )
}