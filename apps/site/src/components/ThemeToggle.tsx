/**
 * ThemeToggle — persistent system/light/dark theme switcher (SITE-009).
 *
 * The blocking BaseLayout bootstrap owns the before-paint root attributes.
 * This hydrated controller reads that already-resolved state from `<html>`;
 * it deliberately does not derive its initial state from SSR signals, which
 * Solid 2 can preserve during hydration. That prevents the client from
 * replacing a persisted/system preference with an SSR default.
 */
import {
  THEME_STORAGE_KEY,
  THEME_PREFERENCES,
  resolveEffectiveTheme,
  type EffectiveTheme,
  type ThemePreference,
} from "../lib/bootstrap-theme"

function getInitialPreference(): ThemePreference {
  if (typeof document === "undefined") return "system"
  const attr = document.documentElement.getAttribute("data-theme-preference")
  if (attr === "light" || attr === "dark" || attr === "system") return attr
  return "system"
}

function getSystemIsDark(): boolean {
  if (typeof document === "undefined") return false
  return document.documentElement.getAttribute("data-theme") === "dark"
}

function nextPreference(current: ThemePreference): ThemePreference {
  const index = THEME_PREFERENCES.indexOf(current)
  return THEME_PREFERENCES[(index + 1) % THEME_PREFERENCES.length]
}

function labelFor(preference: ThemePreference, theme: EffectiveTheme): string {
  const next = nextPreference(preference)
  if (preference === "system") {
    return `Theme: system (${theme}). Click to switch to ${next}.`
  }
  return `Theme: ${preference}. Click to switch to ${next}.`
}

function applyButtonState(
  button: HTMLButtonElement,
  preference: ThemePreference,
  theme: EffectiveTheme,
): void {
  button.dataset.themePreference = preference
  button.setAttribute("aria-label", labelFor(preference, theme))
}

function applyTheme(button: HTMLButtonElement, preference: ThemePreference): void {
  const root = document.documentElement
  const theme = resolveEffectiveTheme(
    preference,
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
  )

  root.setAttribute("data-theme", theme)
  root.setAttribute("data-theme-preference", preference)
  root.style.colorScheme = theme
  applyButtonState(button, preference, theme)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}

export function ThemeToggle() {
  let button: HTMLButtonElement | undefined

  function initialize(element: HTMLButtonElement) {
    button = element
    if (typeof window === "undefined") return

    const preference = getInitialPreference()
    const theme: EffectiveTheme = getSystemIsDark() ? "dark" : "light"
    applyButtonState(element, preference, theme)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemChange = () => {
      if (document.documentElement.getAttribute("data-theme-preference") !== "system") return
      const resolvedTheme: EffectiveTheme = mediaQuery.matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", resolvedTheme)
      document.documentElement.style.colorScheme = resolvedTheme
      applyButtonState(element, "system", resolvedTheme)
    }

    mediaQuery.addEventListener("change", handleSystemChange)
  }

  function handleClick() {
    if (!button || typeof document === "undefined") return
    applyTheme(button, nextPreference(getInitialPreference()))
  }

  return (
    <button
      type="button"
      ref={initialize}
      class="theme-toggle"
      data-theme-preference="system"
      aria-label="Theme: system (light). Click to switch to light."
      onClick={handleClick}
    >
      <span class="theme-toggle__icon" data-theme-icon="system" aria-hidden="true">
        <SystemIcon />
      </span>
      <span class="theme-toggle__icon" data-theme-icon="light" aria-hidden="true">
        <SunIcon />
      </span>
      <span class="theme-toggle__icon" data-theme-icon="dark" aria-hidden="true">
        <MoonIcon />
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
