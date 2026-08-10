import * as Tree from "@solidiom/tree"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    src: string
    components: string
    utils: string
    index: string
    helpers: string
    readme: string
  }
> = {
  en: {
    src: "src",
    components: "components",
    utils: "utils",
    index: "index.ts",
    helpers: "helpers.ts",
    readme: "README.md",
  },
  es: {
    src: "src",
    components: "componentes",
    utils: "utilidades",
    index: "index.ts",
    helpers: "ayudas.ts",
    readme: "README.md",
  },
}

export interface TreeExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Tree documentation example.
 * Demonstrates a hierarchical file explorer with expandable branches.
 */
export function TreeExample(props: TreeExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="tree-example"
      data-tree-example
    >
      <Tree.Root>
        <Tree.Item id="src">
          <Tree.ItemIndicator>📁</Tree.ItemIndicator>
          {copy().src}
          <Tree.Branch>
            <Tree.Item id="components">
              <Tree.ItemIndicator>📁</Tree.ItemIndicator>
              {copy().components}
              <Tree.Branch>
                <Tree.Item id="index">
                  <Tree.ItemIndicator>📄</Tree.ItemIndicator>
                  {copy().index}
                </Tree.Item>
              </Tree.Branch>
            </Tree.Item>
            <Tree.Item id="utils">
              <Tree.ItemIndicator>📁</Tree.ItemIndicator>
              {copy().utils}
              <Tree.Branch>
                <Tree.Item id="helpers">
                  <Tree.ItemIndicator>📄</Tree.ItemIndicator>
                  {copy().helpers}
                </Tree.Item>
              </Tree.Branch>
            </Tree.Item>
          </Tree.Branch>
        </Tree.Item>
        <Tree.Item id="readme">
          <Tree.ItemIndicator>📄</Tree.ItemIndicator>
          {copy().readme}
        </Tree.Item>
      </Tree.Root>
    </div>
  )
}
