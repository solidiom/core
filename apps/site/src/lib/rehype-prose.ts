/**
 * Rehype prose enhancements (SITE-008).
 *
 * - Adds stable deep-link anchors to h2-h6 headings.
 * - Wraps tables in an overflow container for narrow viewports.
 *
 * Astro assigns heading ids after user rehype plugins run, so this plugin
 * generates ids with the same `github-slugger` implementation Astro uses.
 * Astro's later heading collector preserves existing ids, keeping the
 * rendered links, extracted heading metadata, and docs TOC in sync.
 */
import { h } from "hastscript"
import GithubSlugger from "github-slugger"
import { SKIP, visit } from "unist-util-visit"
import type { Element, Parents, Root } from "hast"

const HEADING_TAGS = new Set(["h2", "h3", "h4", "h5", "h6"])

function headingText(node: Element): string {
  let text = ""
  visit(node, (child) => {
    if (child.type === "text") text += child.value
  })
  return text
}

export function rehypeHeadingAnchors() {
  return (tree: Root) => {
    const slugger = new GithubSlugger()

    visit(tree, "element", (node: Element) => {
      if (!HEADING_TAGS.has(node.tagName)) return

      node.properties ??= {}
      if (typeof node.properties.id !== "string") {
        node.properties.id = slugger.slug(headingText(node))
      }

      const id = node.properties.id as string
      node.children = [
        h(
          "a",
          {
            href: `#${id}`,
            class: "heading-anchor",
            "aria-label": "Link to this section",
            "data-heading-anchor": "",
          },
          [h("span", { "aria-hidden": "true" }, "#")],
        ),
        h("span", { class: "heading-anchor-text" }, node.children as Element["children"]),
      ]
    })
  }
}

export function rehypeTableWrappers() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent: Parents | undefined) => {
      if (node.tagName !== "table" || index === undefined || !parent) return

      parent.children[index] = h("div", { class: "table-wrapper", tabindex: 0 }, [node])
      return SKIP
    })
  }
}
