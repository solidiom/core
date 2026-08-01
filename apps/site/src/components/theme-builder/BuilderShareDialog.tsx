import { createMemo, createSignal } from "solid-js"
import * as Dialog from "@solidiom/dialog"
import type { ThemeDefinition } from "../../../../../tools/theme-contract-schema"
import { getShareUrl, getShareSize, SHARE_MAX_SIZE } from "../../lib/theme-builder/theme-share"
import { trackBuilderShared } from "../../lib/analytics"
import type { Locale } from "../../lib/locale"

const COPY: Record<
  Locale,
  {
    title: string
    description: string
    copyUrl: string
    copied: string
    openNewTab: string
    close: string
    sizeLabel: string
    sizeWarning: string
  }
> = {
  en: {
    title: "Share Theme",
    description: "Share your theme via a URL that anyone can use to load the same configuration.",
    copyUrl: "Copy URL",
    copied: "Copied!",
    openNewTab: "Open in new tab",
    close: "Close",
    sizeLabel: "URL size",
    sizeWarning: "URL is large and may be truncated by some browsers.",
  },
  es: {
    title: "Compartir Tema",
    description: "Comparte tu tema mediante una URL que cualquiera puede usar para cargar la misma configuración.",
    copyUrl: "Copiar URL",
    copied: "¡Copiado!",
    openNewTab: "Abrir en nueva pestaña",
    close: "Cerrar",
    sizeLabel: "Tamaño de URL",
    sizeWarning: "La URL es grande y puede ser truncada por algunos navegadores.",
  },
}

export interface BuilderShareDialogProps {
  locale: Locale
  theme: () => ThemeDefinition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuilderShareDialog(props: BuilderShareDialogProps) {
  const [copied, setCopied] = createSignal(false)

  const copy = () => COPY[props.locale]

  const shareUrl = createMemo(() => getShareUrl(props.theme()))
  const shareSize = createMemo(() => getShareSize(props.theme()))
  const isWarning = createMemo(() => shareSize() > SHARE_MAX_SIZE * 0.8)

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  function handleCopy(): void {
    void navigator.clipboard.writeText(shareUrl())
    setCopied(true)
    trackBuilderShared()
    setTimeout(() => setCopied(false), 2000)
  }

  function handleOpenNewTab(): void {
    window.open(shareUrl(), "_blank")
    trackBuilderShared()
  }

  return (
    <Dialog.Root open={() => props.open} onOpenChange={(isOpen) => props.onOpenChange(isOpen)}>
      <Dialog.Portal>
        <Dialog.Backdrop class="theme-builder__share-backdrop" />
        <Dialog.Content class="theme-builder__share-dialog">
          <div class="theme-builder__share-header">
            <div>
              <Dialog.Title class="theme-builder__share-title">{copy().title}</Dialog.Title>
              <Dialog.Description class="theme-builder__share-description">
                {copy().description}
              </Dialog.Description>
            </div>
            <Dialog.Close>
              <span class="theme-builder__share-close" aria-hidden="true">&times;</span>
            </Dialog.Close>
          </div>

          {isWarning() && (
            <div class="theme-builder__share-warning" role="alert">
              {copy().sizeWarning}
            </div>
          )}

          <div class="theme-builder__share-url-wrapper">
            <code class="theme-builder__share-url">{shareUrl()}</code>
          </div>

          <div class="theme-builder__share-meta">
            <span class="theme-builder__share-size">{copy().sizeLabel}: {formatBytes(shareSize())}</span>
          </div>

          <div class="theme-builder__share-actions">
            <button
              type="button"
              class="theme-builder__share-btn theme-builder__share-btn--copy"
              onClick={handleCopy}
            >
              {copied() ? copy().copied : copy().copyUrl}
            </button>
            <button
              type="button"
              class="theme-builder__share-btn theme-builder__share-btn--open"
              onClick={handleOpenNewTab}
            >
              {copy().openNewTab}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}