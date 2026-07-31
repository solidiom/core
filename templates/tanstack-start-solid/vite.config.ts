import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/solid-start/plugin/vite"

export default defineConfig({
  plugins: [tailwindcss(), tanstackStart(), solid()],
  build: {
    target: "es2022",
  },
  resolve: {
    dedupe: ["solid-js", "@solidjs/web"],
  },
})
