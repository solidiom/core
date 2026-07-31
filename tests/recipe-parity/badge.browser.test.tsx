/**
 * Computed-style parity for the "badge" recipe across all three profiles
 * (RECIPE-005 phase 3, contract §6: "parity is asserted on computed style over a
 * rendered fixture, not on generated strings").
 *
 * Each profile's hand-written `StyledBadge` wrapper renders the same primitive
 * (`@solidiom/badge`) with the same props; only the injected stylesheet differs.
 * If the three profiles' computed styles disagree for the same variant, the
 * emitters have drifted from the canonical definition in a way none of the
 * string-based audits (`audit-recipe-dual-emission.ts`, `audit-recipe-parity.ts`)
 * can detect, because those compare selectors and class names, never resolved style.
 */
import { describe, it, expect, afterEach } from "vitest"
import { userEvent } from "vitest/browser"
import { render } from "@solidjs/web"
import { StyledBadge as CssBadge } from "@solidiom/recipes-css"
import { StyledBadge as TailwindBadge } from "@solidiom/recipes-tailwind"
import { StyledBadge as UnocssBadge } from "@solidiom/recipes-unocss"
import { computedProperty, injectStylesheet, resolveBadgeCss, type ProfileName } from "./harness"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const WRAPPERS: Record<ProfileName, (props: { variant?: BadgeVariant }) => unknown> = {
  "recipes-css": (props) => <CssBadge variant={props.variant}>Badge</CssBadge>,
  "recipes-tailwind": (props) => <TailwindBadge variant={props.variant}>Badge</TailwindBadge>,
  "recipes-unocss": (props) => <UnocssBadge variant={props.variant}>Badge</UnocssBadge>,
}

// Base declarations every variant shares — checked once per profile, not per variant.
const BASE_PROPERTIES = ["display", "border-radius", "font-weight"]
// Variant-specific declarations — checked per profile per variant.
const VARIANT_PROPERTIES = ["background-color", "color"]

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

async function renderBadge(
  profile: ProfileName,
  variant: BadgeVariant | undefined,
): Promise<HTMLElement> {
  const css = resolveBadgeCss(profile)
  cleanupStylesheet = injectStylesheet(css)

  container = document.createElement("div")
  document.body.appendChild(container)
  disposeRender = render(() => WRAPPERS[profile]({ variant }), container)

  const root = container.querySelector('[data-scope="badge"][data-part="root"]')
  if (!root) throw new Error(`${profile}: badge did not render [data-scope="badge"][data-part="root"]`)
  return root as HTMLElement
}

describe("badge computed-style parity", () => {
  it("every profile resolves the same base declarations", async () => {
    const computed: Record<ProfileName, Record<string, string>> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderBadge(profile, undefined)
      computed[profile] = Object.fromEntries(
        BASE_PROPERTIES.map((property) => [property, computedProperty(element, property)]),
      )
      cleanupStylesheet?.()
      disposeRender?.()
    }

    for (const property of BASE_PROPERTIES) {
      const values = new Set(Object.values(computed).map((byProfile) => byProfile[property]))
      expect(
        values.size,
        `"${property}" disagrees across profiles: ${JSON.stringify(computed)}`,
      ).toBe(1)
    }
  })

  for (const variant of ["default", "secondary", "destructive", "outline"] as const) {
    it(`variant "${variant}" resolves the same computed style across all profiles`, async () => {
      const computed: Record<ProfileName, Record<string, string>> = {} as never

      for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
        const element = await renderBadge(profile, variant)
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

  it("hover state resolves the same background-color across all profiles", async () => {
    // The definition's default variant declares a `:hover` pseudo. Real browser
    // hover (via Playwright's CDP through userEvent.hover) is used rather than
    // string-matching the stylesheet, so this is a genuine computed-style comparison
    // like every other test in this file, not a string-based fallback.
    const hoverBackgrounds: Record<ProfileName, string> = {} as never

    for (const profile of ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const) {
      const element = await renderBadge(profile, "default")
      await userEvent.hover(element)
      // The base rule declares `transition: background-color 0.15s, ...` — sampling
      // computed style immediately after triggering :hover can land mid-transition.
      // Wait past the transition duration so every profile is compared at steady state.
      await new Promise((resolve) => setTimeout(resolve, 200))
      hoverBackgrounds[profile] = computedProperty(element, "background-color")
      cleanupStylesheet?.()
      disposeRender?.()
    }

    const values = new Set(Object.values(hoverBackgrounds))
    expect(
      values.size,
      `hover background-color disagrees across profiles: ${JSON.stringify(hoverBackgrounds)}`,
    ).toBe(1)
  })
})
