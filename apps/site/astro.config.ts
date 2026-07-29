import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import mdx from "@astrojs/mdx"
import solid from "@solidiom/astrojs-solid-next"
import tailwind from "@tailwindcss/vite"
import { rehypeHeadingAnchors, rehypeTableWrappers } from "./src/lib/rehype-prose"
import { shikiCopyButtonTransformer } from "./src/lib/shiki-copy-button"

const processor = unified({
  rehypePlugins: [rehypeHeadingAnchors, rehypeTableWrappers],
})

export default defineConfig({
  integrations: [mdx(), solid()],
  markdown: {
    processor,
    syntaxHighlight: "shiki",
    shikiConfig: {
      // SITE-008: light/dark theme pair. `defaultColor: false` makes Shiki
      // emit both palettes as CSS variables (`--shiki-light`, `--shiki-dark`,
      // etc.) on every token instead of picking one at build time, so the
      // existing `data-theme` attribute (see bootstrap-theme.ts) can select
      // between them purely in CSS — no client JS and no re-render needed
      // on theme change. See src/assets/code.css for the variable wiring.
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      transformers: [shikiCopyButtonTransformer()],
    },
  },
  trailingSlash: "always",
  vite: {
    plugins: [tailwind()],
  },
})
