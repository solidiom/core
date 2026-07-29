/**
 * ThemeToggle — persistent system/light/dark theme switcher (SITE-009).
 *
 * Three-state toggle button that cycles: system → light → dark → system.
 * Reads the initial preference from the `data-theme-preference` attribute
 * set by the blocking bootstrap script so there is never a hydration
 * mismatch — the component initializes from the same synchronous source.
 *
 * On change:
 *   1. Persists the new preference to localStorage.
 *   2. Updates `data-theme` (effective) and `data-theme-preference` on <html>.
 *   3. When preference is "system", listens for live OS changes.
 *
 * Accessibility:
 *   - Renders a single `<button>` with aria-label describing the current
 *     state (e.g. "Theme: system (dark). Click to switch to light.").
 *   - Icons are aria-hidden decorative elements.
 *   - Focus-visible ring via the existing :focus-visible global rule.
 */
import { createSignal, createEffect } from "solid-js"
import {
  THEME_STORAGE_KEY,
  THEME_PREFERENCES,
  resolveEffectiveTheme,
  type ThemePreference,
  type EffectiveTheme,
} from "../lib/bootstrap-theme"

function getInitialPreference(): ThemePreference {
  if (typeof document === "undefined") return "system"
  const attr = document.documentElement.getAttribute("data-theme-preference")
  if (attr === "light" || attr === "dark" || attr === "system") return attr
  return "system"
}

function getSystemIsDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

const LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
}

function nextPreference(current: ThemePreference): ThemePreference {
  const idx = THEME_PREFERENCES.indexOf(current)
  return THEME_PREFERENCES[(idx + 1) % THEME_PREFERENCES.length]
}

export function ThemeToggle() {
  const [preference, setPreference] = createSignal<ThemePreference>(getInitialPreference())
  const [systemDark, setSystemDark] = createSignal(getSystemIsDark())

  const effectiveTheme = (): EffectiveTheme => resolveEffectiveTheme(preference(), systemDark())

  // Listen for system preference changes when in "system" mode.
  createEffect(
    () => preference(),
    (pref) => {
      if (pref !== "system") return
      if (typeof window === "undefined") return

      const mql = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = (e: MediaQueryListEvent) => {
        setSystemDark(e.matches)
      }
      mql.addEventListener("change", handler)
      return () => mql.removeEventListener("change", handler)
    },
  )

  // Sync attributes and localStorage whenever preference or system changes.
  createEffect(
    () => ({ pref: preference(), theme: effectiveTheme() }),
    ({ pref, theme }) => {
      document.documentElement.setAttribute("data-theme", theme)
      document.documentElement.setAttribute("data-theme-preference", pref)

      try {
        localStorage.setItem(THEME_STORAGE_KEY, pref)
      } catch {
        // localStorage may be unavailable (private browsing, quota).
      }
    },
  )

  function handleClick() {
    setPreference(nextPreference(preference()))
  }

  const ariaLabel = () => {
    const pref = preference()
    const eff = effectiveTheme()
    const next = nextPreference(pref)
    if (pref === "system") {
      return `Theme: system (${eff}). Click to switch to ${LABELS[next].toLowerCase()}.`
    }
    return `Theme: ${pref}. Click to switch to ${LABELS[next].toLowerCase()}.`
  }

  return (
    <button
      type="button"
      class="theme-toggle"
      aria-label={ariaLabel()}
      onClick={handleClick}
    >
      <span class="theme-toggle__icon" aria-hidden="true">
        {preference() === "system" && <SystemIcon />}
        {preference() === "light" && <SunIcon />}
        {preference() === "dark" && <MoonIcon />}
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
