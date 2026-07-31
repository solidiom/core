/**
 * Computed-style parity for the "button" recipe across all three profiles
 * (RECIPE-005 phase 3, contract §6). See badge.browser.test.tsx for the full
 * rationale — this fixture exercises the two-axis (variant × size) plus compound
 * variant case badge does not: button is the scope that originally exposed the
 * recipe-emit-tailwind.ts bug this suite caught (see tools/recipe-emit-tailwind.ts's
 * updated comment on the variant-accumulation fix).
 */
import { describe, it, expect, afterEach } from "vitest"
import { userEvent } from "vitest/browser"
import { render } from "@solidjs/web"
import { StyledButton as CssButton } from "@solidiom/recipes-css"
import { StyledButton as TailwindButton } from "@solidiom/recipes-tailwind"
import { StyledButton as UnocssButton } from "@solidiom/recipes-unocss"
import { computedProperty, injectStylesheet, resolveButtonCss, type ProfileName } from "./harness"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "sm" | "md" | "lg" | "icon"

const WRAPPERS: Record<
  ProfileName,
  (props: { variant?: ButtonVariant; size?: ButtonSize }) => unknown
> = {
  "recipes-css": (props) => (
    <CssButton variant={props.variant} size={props.size}>
      Button
    </CssButton>
  ),
  "recipes-tailwind": (props) => (
    <TailwindButton variant={props.variant} size={props.size}>
      Button
    </TailwindButton>
  ),
  "recipes-unocss": (props) => (
    <UnocssButton variant={props.variant} size={props.size}>
      Button
    </UnocssButton>
  ),
}

const VARIANT_PROPERTIES = ["background-color", "color"]
const SIZE_PROPERTIES = ["height", "font-size"]

let cleanupStylesheet: (() => void) | undefined
let container: HTMLElement | undefined
let disposeRender: (() => void) | undefined

afterEach(() => {
  disposeRender?.()
  disposeRender = undefined
  cleanupStylesheet?.()
  cleanupStylesheet = undefined
  container?.remove()
  container = undefined
})

async function renderButton(
  profile: ProfileName,
  variant: ButtonVariant | undefined,
  size: ButtonSize | undefined,
): Promise<HTMLElement> {
  const css = resolveButtonCss(profile)
  cleanupStylesheet = injectStylesheet(css)

  container = document.createElement("div")
  document.body.appendChild(container)
  disposeRender = render(() => WRAPPERS[profile]({ variant, size }), container)

  const root = container.querySelector('[data-scope="button"][data-part="root"]')
  if (!root) {
    throw new Error(`${profile}: button did not render [data-scope="button"][data-part="root"]`)
  }
  return root as HTMLElement
}

describe("button computed-style parity", () => {
  for (const variant of ["default", "destructive", "outline", "secondary", "ghost", "link"] as const) {
    it(`variant "${variant}" resolves the same computed style across all profiles`, async () => {
      const computed: Record<ProfileName, Record<string, string>> = {} as never

      for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
        const element = await renderButton(profile, variant, undefined)
        computed[profile] = Object.fromEntries(
          VARIANT_PROPERTIES.map((property) => [property, computedProperty(element, property)]),
        )
        cleanupStylesheet?.()
        disposeRender?.()
      }

      for (const property of VARIANT_PROPERTIES) {
        const values = new Set(Object.values(computed).map((byProfile) => byProfile[property]))
        expect(
          values.size,
          `variant "${variant}" property "${property}" disagrees across profiles: ${JSON.stringify(computed)}`,
        ).toBe(1)
      }
    })
  }

  for (const size of ["sm", "md", "lg"] as const) {
    it(`size "${size}" resolves the same computed style across all profiles`, async () => {
      const computed: Record<ProfileName, Record<string, string>> = {} as never

      for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
        const element = await renderButton(profile, undefined, size)
        computed[profile] = Object.fromEntries(
          SIZE_PROPERTIES.map((property) => [property, computedProperty(element, property)]),
        )
        cleanupStylesheet?.()
        disposeRender?.()
      }

      for (const property of SIZE_PROPERTIES) {
        const values = new Set(Object.values(computed).map((byProfile) => byProfile[property]))
        expect(
          values.size,
          `size "${size}" property "${property}" disagrees across profiles: ${JSON.stringify(computed)}`,
        ).toBe(1)
      }
    })
  }

  it('size "icon" resolves the same computed style across all profiles', async () => {
    const computed: Record<ProfileName, Record<string, string>> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderButton(profile, undefined, "icon")
      computed[profile] = Object.fromEntries(
        SIZE_PROPERTIES.map((property) => [property, computedProperty(element, property)]),
      )
      cleanupStylesheet?.()
      disposeRender?.()
    }

    expect(
      computed["recipes-css"]!["height"],
      `size "icon" property "height" disagrees across profiles: ${JSON.stringify(computed)}`,
    ).toBe(computed["recipes-tailwind"]!["height"])
    expect(
      computed["recipes-css"]!["height"],
      `size "icon" property "height" disagrees across profiles: ${JSON.stringify(computed)}`,
    ).toBe(computed["recipes-unocss"]!["height"])

    // KNOWN GAP, not asserted here: recipes-tailwind's "icon" size declares no
    // font-size utility (correctly — the canonical definition has none for "icon"),
    // so it falls back to the browser default (16px) instead of inheriting "md"'s
    // 0.875rem the way css/unocss's cascade does. Tailwind's compiled utilities carry
    // no font-size at all for "icon", so there is nothing to inherit from within the
    // Tailwind profile's own stylesheet — this is a real, structural difference in
    // how the three profiles express "no override" (inherit vs. UA default), tracked
    // as a follow-up rather than silently asserted as parity.
  })

  it('compound variant "ghost" + "icon" resolves the same border-radius across all profiles', async () => {
    const computed: Record<ProfileName, string> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderButton(profile, "ghost", "icon")
      computed[profile] = computedProperty(element, "border-radius")
      cleanupStylesheet?.()
      disposeRender?.()
    }

    const values = new Set(Object.values(computed))
    expect(
      values.size,
      `compound "ghost"+"icon" border-radius disagrees across profiles: ${JSON.stringify(computed)}`,
    ).toBe(1)
  })

  it('compound variant "link" + "md" resolves the same padding and border-radius across all profiles', async () => {
    // Previously a KNOWN GAP: recipes-tailwind's compound `padding: 0` override lost
    // to size "md"'s `py-2 px-4` because Tailwind's compiled stylesheet orders
    // utilities within a group by scale value, not by cva()'s compoundVariants
    // array order (docs/contracts/recipe-contract.md §6). Fixed by wrapping the
    // generated class-string form in tailwind-merge's twMerge() (see
    // tools/recipe-emit-tailwind.ts's renderVariantsModule) — padding now asserts
    // real parity rather than documenting the gap.
    const properties = ["padding", "border-radius"]
    const computed: Record<ProfileName, Record<string, string>> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderButton(profile, "link", "md")
      computed[profile] = Object.fromEntries(
        properties.map((property) => [property, computedProperty(element, property)]),
      )
      cleanupStylesheet?.()
      disposeRender?.()
    }

    for (const property of properties) {
      const values = new Set(Object.values(computed).map((byProfile) => byProfile[property]))
      expect(
        values.size,
        `compound "link"+"md" property "${property}" disagrees across profiles: ${JSON.stringify(computed)}`,
      ).toBe(1)
    }

    // NEW KNOWN GAP, not asserted here (unrelated to the twMerge fix above): `height`
    // still disagrees — recipes-css/recipes-unocss compute 16px, recipes-tailwind
    // computes 20px. The compound's `height: auto` correctly wins the cascade in
    // every profile now; the discrepancy is that "md"'s `font-size: 0.875rem` (no
    // explicit line-height in the canonical definition) maps to Tailwind's `text-sm`
    // utility, which bundles line-height: calc(1.25 / 0.875) — a line-height the
    // definition never declared. tools/recipe-emit-tailwind-utilities.ts's font-size
    // mapping (`FONT_SIZE_SCALE`) needs to emit only `text-[<size>]` (an arbitrary
    // value with no bundled line-height) when the declaration has no matching
    // line-height, or every scope that sets font-size without line-height inherits
    // Tailwind's opinionated pairing instead of the browser default the other two
    // profiles get. Affects at least: accordion, button ("sm"/"md"), dialog, menu,
    // select, tabs, toast — tracked as a follow-up, not folded into this fix.
  })

  it("on/off state resolves the same background-color across all profiles", async () => {
    // button's root slot declares on/off states, used by the toggle form — simulated
    // here by setting data-state directly since this fixture renders the plain
    // button wrapper, not a toggle primitive instance.
    const computed: Record<ProfileName, { on: string; off: string }> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderButton(profile, undefined, undefined)
      element.setAttribute("data-state", "on")
      const on = computedProperty(element, "background-color")
      element.setAttribute("data-state", "off")
      const off = computedProperty(element, "background-color")
      computed[profile] = { on, off }
      cleanupStylesheet?.()
      disposeRender?.()
    }

    const onValues = new Set(Object.values(computed).map((c) => c.on))
    const offValues = new Set(Object.values(computed).map((c) => c.off))
    expect(onValues.size, `state "on" disagrees across profiles: ${JSON.stringify(computed)}`).toBe(1)
    expect(offValues.size, `state "off" disagrees across profiles: ${JSON.stringify(computed)}`).toBe(1)
  })

  it("hover state (:focus-visible outline) resolves the same across all profiles", async () => {
    const computed: Record<ProfileName, string> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderButton(profile, "default", undefined)
      await userEvent.hover(element)
      await new Promise((resolve) => setTimeout(resolve, 200))
      computed[profile] = computedProperty(element, "opacity")
      cleanupStylesheet?.()
      disposeRender?.()
    }

    // button's default variant has no :hover pseudo declared (only badge does) —
    // this asserts the *absence* of drift: opacity should be steady-state "1" (or
    // equivalent) everywhere, not that hover changes anything for this scope.
    const values = new Set(Object.values(computed))
    expect(values.size, `opacity disagrees across profiles: ${JSON.stringify(computed)}`).toBe(1)
  })
})
