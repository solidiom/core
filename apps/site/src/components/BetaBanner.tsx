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

  // No `role="banner"` here. The site shell's <header> is the page's banner landmark,
  // and ARIA allows only one per document — a second one made `getByRole("banner")`
  // ambiguous and failed BETA-002's `landmarks_present` acceptance check. This strip is
  // a complementary announcement, not the site header, so it carries no landmark role;
  // its content stays reachable as an ordinary link in the document order.
  return (
    <div class="beta-banner">
      <a href="/docs/releases/beta-2026-08-01/" class="beta-banner__link" aria-label={ariaLabel()}>
        <span class="beta-banner__badge">Beta</span>
        <span class="beta-banner__text">{text()}</span>
      </a>
    </div>
  )
}
