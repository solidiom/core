/** Subtle "Public Beta" announcement banner (BETA-003). */
import type { Locale } from "../lib/locale"

interface Props {
  locale?: Locale
}

export function BetaBanner(props: Props) {
  const locale = () => props.locale ?? "en"

  const text = () =>
    locale() === "es"
      ? "Beta pública — Consulta las notas de lanzamiento"
      : "Public beta — Read the release notes"

  const ariaLabel = () =>
    locale() === "es"
      ? "Solidiom está en beta pública. Consulta las notas de lanzamiento."
      : "Solidiom is in public beta. Read the release notes."

  return (
    <div class="beta-banner" role="banner">
      <a href="/docs/releases/beta-2026-08-01/" class="beta-banner__link" aria-label={ariaLabel()}>
        <span class="beta-banner__badge">Beta</span>
        <span class="beta-banner__text">{text()}</span>
      </a>
    </div>
  )
}