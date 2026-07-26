export function ProseRecipeDemo() {
  return (
    <article class="max-w-xl" data-scope="prose" data-size="lg">
      <h1>Rendered Markdown</h1>
      <p>
        The prose recipe styles nested semantic HTML when markup comes from Markdown or a rich-text
        editor.
      </p>
      <h2>Usage</h2>
      <ul>
        <li>Apply one scope attribute to the container.</li>
        <li>
          Choose <code>sm</code>, <code>base</code>, or <code>lg</code> with <code>data-size</code>.
        </li>
      </ul>
      <p>
        <a href="https://www.solidjs.com">Solid</a> renders the content; the stylesheet handles its
        presentation.
      </p>
    </article>
  )
}

export const proseRecipeDemoCode = `import type { Element } from "solid-js"
import "@solidiom/recipes-tailwind/styles/prose.css"

function Example(props: { children: Element }) {
  return <article data-scope="prose" data-size="lg">{props.children}</article>
}

// Render sanitized Markdown or rich-text output as children; do not assign untrusted
// content to innerHTML.`
