import { typeset } from "@solidiom/recipes-tailwind"

export function TypesetRecipeDemo() {
  return (
    <div class="max-w-xl">
      <h1 class={typeset.heading1}>Recipes over primitives</h1>
      <p class={typeset.lead}>Typography belongs on semantic HTML, not in a runtime component.</p>
      <p class={typeset.paragraph}>
        Apply the granular Typeset entries directly to native elements when you control the markup.
      </p>
      <blockquote class={typeset.blockquote}>Behavior first. Styling stays opt-in.</blockquote>
      <p class={typeset.muted}>No primitive runtime required.</p>
    </div>
  )
}

export const typesetRecipeDemoCode = `/* In your Tailwind CSS entry point, scan the recipe source:
@source "../node_modules/@solidiom/recipes-tailwind/source/recipes/typeset.tsx";
*/

import { typeset } from "@solidiom/recipes-tailwind"

function Example() {
  return (
    <div>
      <h1 class={typeset.heading1}>Recipes over primitives</h1>
      <p class={typeset.lead}>Typography belongs on semantic HTML.</p>
      <p class={typeset.paragraph}>Apply a scale entry directly to each element.</p>
      <blockquote class={typeset.blockquote}>Behavior first. Styling stays opt-in.</blockquote>
      <p class={typeset.muted}>No primitive runtime required.</p>
    </div>
  )
}`
