import { createSignal, onSettled } from "solid-js"
import { IconSun, IconMoon } from "./icons"

export function ThemeToggle() {
  const [dark, setDark] = createSignal(false)

  onSettled(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  })

  function toggle() {
    const next = !dark()
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <button
      onClick={toggle}
      class="inline-flex items-center justify-center rounded-md size-9 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
      aria-label="Toggle theme"
    >
      {dark() ? <IconSun class="size-4" /> : <IconMoon class="size-4" />}
    </button>
  )
}
