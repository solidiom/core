import type { Element } from "solid-js"

export interface BlockEntry {
  component: () => Element
  code: string
  title: string
  description: string
}

import { AppShellBlock, appShellBlockCode } from "./app-shell"
import { AspectRatioBlock, aspectRatioBlockCode } from "./aspect-ratio"
import { CodeBlockBlock, codeBlockBlockCode } from "./code-block"
import { ChatComposerBlock, chatComposerBlockCode } from "./chat-composer"

export const blocks: Record<string, BlockEntry> = {
  "app-shell": {
    component: () => AppShellBlock(),
    code: appShellBlockCode,
    title: "App Shell",
    description: "Responsive layout with collapsible sidebar, header, and main content area.",
  },
  "aspect-ratio": {
    component: () => AspectRatioBlock(),
    code: aspectRatioBlockCode,
    title: "Aspect Ratio",
    description: "Native CSS aspect-ratio property — no JavaScript needed.",
  },
  "code-block": {
    component: () => CodeBlockBlock(),
    code: codeBlockBlockCode,
    title: "Code Block",
    description: "Syntax-highlighted code display. Integrate with shiki or prismjs.",
  },
  "chat-composer": {
    component: () => ChatComposerBlock(),
    code: chatComposerBlockCode,
    title: "Chat / Composer",
    description: "Chat UI composed from scroll-area, avatar, button, and input primitives.",
  },
}
