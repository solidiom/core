import { createMemo, createSignal } from "solid-js"
import * as Dialog from "@solidiom/dialog"
import type { ThemeDefinition } from "../../../../../tools/theme-contract-schema"
import { exportTheme, type ExportFormat } from "../../lib/theme-builder/theme-export"
import { trackBuilderExported } from "../../lib/analytics"
import type { Locale } from "../../lib/locale"

const FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  json: ".json",
  css: ".css",
  tailwind: ".css",
  unocss: ".css",
}

const COPY: Record<
  Locale,
  {
    title: string
    description: string
    formatLabel: string
    json: string
    css: string
    tailwind: string
    unocss: string
    copy: string
    copied: string
    download: string
    close: string
  }
> = {
  en: {
    title: "Export Theme",
    description: "Export your theme in the desired format.",
    formatLabel: "Format",
    json: "JSON",
    css: "CSS",
    tailwind: "Tailwind v4",
    unocss: "UnoCSS",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    close: "Close",
  },
  es: {
    title: "Exportar Tema",
    description: "Exporta tu tema en el formato deseado.",
    formatLabel: "Formato",
    json: "JSON",
    css: "CSS",
    tailwind: "Tailwind v4",
    unocss: "UnoCSS",
    copy: "Copiar",
    copied: "¡Copiado!",
    download: "Descargar",
    close: "Cerrar",
  },
}

const FORMAT_OPTIONS: { value: ExportFormat; key: "json" | "css" | "tailwind" | "unocss" }[] = [
  { value: "json", key: "json" },
  { value: "css", key: "css" },
  { value: "tailwind", key: "tailwind" },
  { value: "unocss", key: "unocss" },
]

export interface BuilderExportDialogProps {
  locale: Locale
  theme: () => ThemeDefinition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuilderExportDialog(props: BuilderExportDialogProps) {
  const [format, setFormat] = createSignal<ExportFormat>("json")
  const [copied, setCopied] = createSignal(false)

  const copy = () => COPY[props.locale]

  const output = createMemo(() => {
    return exportTheme(props.theme(), format())
  })

  function handleCopy(): void {
    void navigator.clipboard.writeText(output())
    setCopied(true)
    trackBuilderExported(format())
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload(): void {
    const { slug } = props.theme().meta
    const ext = FORMAT_EXTENSIONS[format()]
    const filename = `${slug}-theme${ext}`
    const blob = new Blob([output()], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    trackBuilderExported(format())
  }

  return (
    <Dialog.Root open={() => props.open} onOpenChange={(isOpen) => props.onOpenChange(isOpen)}>
      <Dialog.Portal>
        <Dialog.Backdrop class="theme-builder__export-backdrop" />
        <Dialog.Content class="theme-builder__export-dialog">
          <div class="theme-builder__export-header">
            <div>
              <Dialog.Title class="theme-builder__export-title">{copy().title}</Dialog.Title>
              <Dialog.Description class="theme-builder__export-description">
                {copy().description}
              </Dialog.Description>
            </div>
            <Dialog.Close>
              <span class="theme-builder__export-close" aria-hidden="true">&times;</span>
            </Dialog.Close>
          </div>

          <div class="theme-builder__export-format">
            <span class="theme-builder__export-format-label">{copy().formatLabel}</span>
            <div class="theme-builder__export-format-options" role="radiogroup" aria-label={copy().formatLabel}>
              {FORMAT_OPTIONS.map((opt) => {
                const label = copy()[opt.key]
                const isActive = format() === opt.value
                return (
                  <label
                    class={
                      "theme-builder__export-format-option" +
                      (isActive ? " theme-builder__export-format-option--active" : "")
                    }
                  >
                    <input
                      type="radio"
                      name="export-format"
                      value={opt.value}
                      checked={isActive}
                      onChange={() => setFormat(opt.value)}
                    />
                    {label}
                  </label>
                )
              })}
            </div>
          </div>

          <div class="theme-builder__export-output-wrapper">
            <pre class="theme-builder__export-output">
              <code>{output()}</code>
            </pre>
          </div>

          <div class="theme-builder__export-actions">
            <button
              type="button"
              class="theme-builder__export-btn theme-builder__export-btn--copy"
              onClick={handleCopy}
            >
              {copied() ? copy().copied : copy().copy}
            </button>
            <button
              type="button"
              class="theme-builder__export-btn theme-builder__export-btn--download"
              onClick={handleDownload}
            >
              {copy().download}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}