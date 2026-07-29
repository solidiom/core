/**
 * LanguageSwitcher — locale toggle for two-locale system (I18N-002).
 *
 * Displays the OTHER locale's label (e.g. on an English page, shows
 * "Espanol") with a globe icon. When clicked, persists the user's
 * explicit choice in localStorage and navigates to the equivalent route
 * in the target locale.
 *
 * Follows the same imperative-DOM pattern as ThemeToggle: no SSR signals,
 * ref-based initialization to read client state after hydration.
 */
import {
  alternateLocale,
  LOCALE_LABELS,
  switchLocalePath,
  type Locale,
} from "../lib/locale"

const LOCALE_STORAGE_KEY = "solidiom-locale-preference"

export interface LanguageSwitcherProps {
  /** Current page pathname (e.g. "/primitives/dialog/" or "/es/primitives/dialog/"). */
  pathname: string
  /** Current page locale. */
  locale: Locale
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const target = () => alternateLocale(props.locale)
  const targetLabel = () => LOCALE_LABELS[target()]
  const targetPath = () => switchLocalePath(props.pathname, target())

  function handleClick() {
    if (typeof window === "undefined") return
    const locale = target()
    const path = targetPath()

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      // Storage can be unavailable in privacy-restricted environments.
    }

    window.location.assign(path)
  }

  return (
    <button
      type="button"
      class="language-switcher"
      aria-label={`Switch language to ${targetLabel()}`}
      onClick={handleClick}
    >
      <GlobeIcon />
      <span class="language-switcher__label">{targetLabel()}</span>
    </button>
  )
}

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
