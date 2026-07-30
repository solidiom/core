/**
 * tools/recipe-contract-definitions — reference recipe definitions (RECIPE-001g).
 *
 * Three definitions chosen to exercise the schema rather than for coverage. Each one
 * expresses something the shipped recipes get wrong, so the emitters in
 * RECIPE-002/003/004 have a fixture that proves the contract fixes it:
 *
 *   button — 6 × 4 variant surface. The CSS profile currently emits eleven
 *            `solidiom-btn--*` classes with no definition anywhere in the package, so
 *            every non-default variant silently renders as the default.
 *   switch — cross-part state. Both profiles use an ancestor selector
 *            (`[data-part="root"][data-state="on"] [data-part="thumb"]`) that the
 *            class-string forms cannot express. Here the thumb carries its own state.
 *   dialog — multi-slot with presence states and a consumer-owned slot. No overlay
 *            stylesheet in either profile styles `open`/`closed` today.
 *
 * These are inputs to the emitters. They are deliberately not wired into any package.
 */
import { CONTRACT_VERSION, type RecipeDefinition } from "./recipe-contract-schema"

/**
 * Button.
 *
 * Fixes docs/recipe-contract-inventory.md: unbacked variant classes in recipes-css, and
 * a stylesheet form that covers only the default variant in both profiles.
 */
export const buttonRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "button",
  description:
    "Action trigger with intent variants, a size scale, and pressed state for the toggle form.",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        gap: "0.5rem",
        "white-space": "nowrap",
        "border-style": "none",
        "font-weight": "500",
        cursor: "pointer",
        "border-radius": { token: "radius" },
        transition: "opacity 0.15s, background-color 0.15s",
      },
      states: {
        // The toggle form emits on/off; the plain button emits neither.
        on: { "background-color": { token: "primary" }, color: { token: "primary-foreground" } },
        off: { "background-color": { token: "surface-muted" }, color: { token: "foreground" } },
      },
      flags: {
        disabled: { opacity: "0.5", cursor: "not-allowed", "pointer-events": "none" },
        loading: { opacity: "0.7", cursor: "progress" },
      },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
  ],
  variants: [
    {
      name: "variant",
      values: {
        default: {
          root: {
            "background-color": { token: "primary" },
            color: { token: "primary-foreground" },
          },
        },
        destructive: {
          root: {
            "background-color": { token: "destructive" },
            color: { token: "destructive-foreground" },
          },
        },
        outline: {
          root: {
            "background-color": "transparent",
            color: { token: "foreground" },
            "border-style": "solid",
            "border-width": "1px",
            "border-color": { token: "border" },
          },
        },
        secondary: {
          root: {
            "background-color": { token: "secondary" },
            color: { token: "secondary-foreground" },
          },
        },
        ghost: {
          root: { "background-color": "transparent", color: { token: "foreground" } },
        },
        link: {
          root: {
            "background-color": "transparent",
            color: { token: "primary" },
            "text-decoration-line": "underline",
            "text-underline-offset": "4px",
          },
        },
      },
    },
    {
      name: "size",
      values: {
        sm: { root: { height: "2.25rem", padding: "0 0.75rem", "font-size": "0.875rem" } },
        md: { root: { height: "2.5rem", padding: "0.5rem 1rem", "font-size": "0.875rem" } },
        lg: { root: { height: "2.75rem", padding: "0 2rem", "font-size": "1rem" } },
        icon: { root: { height: "2.5rem", width: "2.5rem", padding: "0" } },
      },
    },
  ],
  defaultVariants: { variant: "default", size: "md" },
  compoundVariants: [
    {
      // A ghost icon button needs a tighter hit area than a ghost text button.
      when: { variant: "ghost", size: "icon" },
      declarations: { root: { "border-radius": { token: "radius-full" } } },
    },
    {
      // Links have no box, so size padding would misalign the underline.
      when: { variant: "link", size: "md" },
      declarations: { root: { height: "auto", padding: "0" } },
    },
  ],
}

/**
 * Switch.
 *
 * The thumb declares its own `on`/`off` state rather than relying on an ancestor
 * selector, which is what makes the class-string forms emittable (guide §3.2).
 * `packages/switch/src/index.tsx` already emits `data-state` on the thumb part.
 */
export const switchRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "switch",
  description:
    "Binary toggle with a sliding thumb, styled per part so no ancestor state is needed.",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        width: "2.75rem",
        height: "1.5rem",
        padding: "2px",
        "border-radius": { token: "radius-full" },
        "border-style": "none",
        cursor: "pointer",
        "background-color": { token: "surface-input" },
        transition: "background-color 0.15s",
      },
      states: {
        on: { "background-color": { token: "primary" } },
        off: { "background-color": { token: "surface-input" } },
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed", "pointer-events": "none" } },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "thumb",
      element: "span",
      ownership: "recipe",
      base: {
        display: "block",
        width: "1.25rem",
        height: "1.25rem",
        "border-radius": { token: "radius-full" },
        "background-color": { token: "surface" },
        "box-shadow": { token: "shadow-sm" },
        transition: "transform 0.15s",
      },
      states: {
        // Declared on the thumb, not inherited from the root's state.
        on: { transform: "translateX(1.25rem)" },
        off: { transform: "translateX(0)" },
      },
    },
  ],
}

/**
 * Dialog.
 *
 * Exercises presence states on two slots and a consumer-owned slot. The `close`
 * exception replaces the `COMPOSED_PART_ALLOWLIST` entry for dialog in
 * tools/audit-recipe-dual-emission.ts.
 */
export const dialogRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "dialog",
  description: "Modal surface with a scrim, presence transitions, and labelled content.",
  slots: [
    {
      part: "backdrop",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        inset: "0",
        "background-color": { token: "surface-overlay" },
        transition: "opacity 0.15s",
      },
      states: {
        open: { opacity: "1" },
        closed: { opacity: "0" },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "max-width": "32rem",
        width: "100%",
        padding: "1.5rem",
        "background-color": { token: "surface-raised" },
        color: { token: "foreground" },
        "border-radius": { token: "radius-lg" },
        "box-shadow": { token: "shadow-lg" },
        transition: "opacity 0.15s, transform 0.15s",
      },
      states: {
        open: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        closed: { opacity: "0", transform: "translate(-50%, -50%) scale(0.96)" },
      },
    },
    {
      part: "title",
      element: "h2",
      ownership: "recipe",
      base: {
        margin: "0",
        "font-size": "1.125rem",
        "font-weight": "600",
        color: { token: "foreground" },
      },
    },
    {
      part: "description",
      element: "p",
      ownership: "recipe",
      base: {
        margin: "0.5rem 0 0",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
      },
    },
    {
      part: "close",
      element: "button",
      ownership: "consumer",
      ownershipReason:
        "Close is optional composition — the wrapper exposes Root/Content and the consumer decides whether to render a close affordance.",
      base: {
        position: "absolute",
        top: "0.75rem",
        right: "0.75rem",
        "border-style": "none",
        "background-color": "transparent",
        color: { token: "foreground-muted" },
        cursor: "pointer",
        "border-radius": { token: "radius-sm" },
      },
      pseudos: {
        ":hover": { color: { token: "foreground" } },
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
        },
      },
    },
  ],
}

/** Every reference definition, keyed by scope. */
export const REFERENCE_DEFINITIONS: Readonly<Record<string, RecipeDefinition>> = {
  button: buttonRecipe,
  switch: switchRecipe,
  dialog: dialogRecipe,
}
