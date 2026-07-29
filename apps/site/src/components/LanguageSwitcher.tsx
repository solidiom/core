/**
 * LanguageSwitcher — explicit locale navigation for the registered route set.
 *
 * The URL remains the active-locale authority. The control persists the user's
 * explicit choice for future UI state but never uses it to redirect a visit.
 */
import { alternateLocale, LOCALE_LABELS, LOCALE_STORAGE_KEY, type Locale } from "../lib/locale"

export interface LanguageSwitcherProps {
  /** Current page locale. */
  locale: Locale
  /** Verified equivalent route for the destination locale, when one exists. */
  targetPath?: string
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const target = () => alternateLocale(props.locale)
  const targetLabel = () => LOCALE_LABELS[target()]
  const isAvailable = () => Boolean(props.targetPath)

  function handleClick() {
    if (typeof window === "undefined" || !props.targetPath) return

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, target())
    } catch {
      // Storage can be unavailable in privacy-restricted environments.
    }

    window.location.assign(props.targetPath)
  }

  return (
    <div class="language-switcher__wrapper">
      <button
        type="button"
        class="language-switcher"
        data-locale-switcher
        aria-label={`Switch language to ${targetLabel()}`}
        aria-describedby={isAvailable() ? undefined : "language-switcher-unavailable"}
        disabled={!isAvailable()}
        onClick={handleClick}
      >
        <GlobeIcon />
        <span class="language-switcher__label">{targetLabel()}</span>
      </button>
      {!isAvailable() && (
        <span id="language-switcher-unavailable" class="sr-only">
          This page is not available in {targetLabel()}.
        </span>
      )}
    </div>
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
