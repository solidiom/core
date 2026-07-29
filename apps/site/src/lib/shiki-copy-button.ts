/**
 * Shiki transformer — copy-to-clipboard control for fenced code blocks.
 *
 * SITE-008 requires a copy control on rendered code blocks. This wraps
 * Shiki's `<pre>` output in a `<div class="code-block">` and appends a
 * `<button class="code-block__copy" data-copy-code>` sibling that reads the
 * block's raw source (embedded in a `data-code` attribute, HTML-escaped by
 * hastscript) and writes it to the clipboard on click.
 *
 * No Solid island/hydration is used: this only needs one small, generic
 * click handler shared by every code block on the page, so it ships as a
 * single inert `<script>` (see docs-prose.ts) attached once per route
 * instead of one hydrated component per block. This keeps SITE-012's
 * static-route import boundary intact — static routes never import
 * playground/editor/compiler modules or per-block Solid runtimes for this.
 */
import { h } from "hastscript"
import type { ShikiConfig } from "astro"

// Astro re-exports its own `ShikiConfig` (see @astrojs/internal-helpers),
// whose `transformers` array element type is the `ShikiTransformer` Astro's
// bundled Shiki instance expects. Deriving the type this way (rather than
// importing `ShikiTransformer` from the top-level `shiki` package) avoids a
// nominal type mismatch when the workspace's own `shiki` dependency and
// Astro's internal Shiki dependency resolve to different package instances.
type ShikiTransformer = NonNullable<ShikiConfig["transformers"]>[number]

export function shikiCopyButtonTransformer(): ShikiTransformer {
  return {
    name: "solidiom:copy-button",
    pre(node) {
      const source = this.source

      const copyButton = h(
        "button",
        {
          type: "button",
          class: "code-block__copy",
          "data-copy-code": "",
          "data-code": source,
          "aria-label": "Copy code to clipboard",
        },
        [h("span", { class: "code-block__copy-label", "data-copy-label": "" }, "Copy")],
      )

      return h("div", { class: "code-block", "data-code-block": "" }, [node, copyButton])
    },
  }
}
