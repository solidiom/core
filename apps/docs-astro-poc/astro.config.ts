import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import solid from "@solidiom/astrojs-solid-next"
import tailwind from "@tailwindcss/vite"

export default defineConfig({
  integrations: [mdx(), solid()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
    },
  },
  trailingSlash: "always",
  vite: {
    plugins: [tailwind()],
  },
})
